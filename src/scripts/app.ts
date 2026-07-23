import {
  TWITCH_LOGIN,
  TWITCH_USER_ID,
  TWITCH_PARENTS,
  twitchEmoteUrl,
  FALLBACK_EMOJIS,
  CONTACT_ACCESS_KEY,
  BOOKING_EMAIL,
} from "../config";

/**
 * His channel emotes are fetched at build time and injected into the page as a
 * JSON script tag; read them here (empty if unavailable).
 */
const channelEmotes: { id: string; name: string }[] = (() => {
  try {
    return JSON.parse(
      document.querySelector("[data-channel-emotes]")?.textContent || "[]",
    );
  } catch {
    return [];
  }
})();

const html = document.documentElement;
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const parents = TWITCH_PARENTS.map((p) => `parent=${p}`).join("&");

/**
 * iOS Safari only applies :active/:hover styles once the document has a touch
 * listener, so register a no-op one to make the sticker-button press work.
 */
document.addEventListener("touchstart", () => {}, { passive: true });

/**
 * Not-found toast: the 404 page redirects home with ?notfound, and we show a
 * quick toast then tidy the URL.
 */
(() => {
  const params = new URLSearchParams(location.search);
  if (!params.has("notfound")) return;
  const toast = document.querySelector<HTMLElement>("[data-toast]");
  params.delete("notfound");
  const clean = location.pathname + (params.toString() ? `?${params}` : "");
  history.replaceState(null, "", clean);
  if (!toast) return;
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  setTimeout(() => toast.classList.remove("is-visible"), 5000);
})();

/**
 * 0. BACKGROUND VIDEO - play it (unless reduced motion → poster)
 */
(() => {
  const vid = document.querySelector<HTMLVideoElement>("[data-bg-video]");
  if (!vid) return;
  if (reduceMotion) {
    vid.removeAttribute("autoplay");
    vid.pause();
    return; // poster stays visible, no motion
  }
  vid.play().catch(() => {
    /* autoplay blocked - poster remains, no-op */
  });
})();

/**
 * 1. LIGHTBOX - click a card, load the YouTube iframe on demand
 */
(() => {
  const lightbox = document.getElementById("lightbox");
  const frame = document.getElementById("lightbox-frame");
  const closeBtn = document.getElementById("lightbox-close");
  if (!lightbox || !frame || !closeBtn) return;

  let lastFocused: HTMLElement | null = null;

  const open = (id: string) => {
    lastFocused = document.activeElement as HTMLElement;
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="YouTube video player" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    lightbox.classList.add("is-open");
    closeBtn.focus();
  };
  const close = () => {
    lightbox.classList.remove("is-open");
    // let the exit transition play before tearing down the iframe
    setTimeout(() => {
      if (!lightbox.classList.contains("is-open")) frame.innerHTML = "";
    }, 260);
    lastFocused?.focus();
  };

  /**
   * The cards are real links to YouTube (so they work with no JS). When JS is
   * on, intercept a plain click and open the inline player instead; modifier
   * and middle clicks still open YouTube in a new tab.
   */
  document
    .querySelectorAll<HTMLAnchorElement>("[data-video-id]")
    .forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        open(card.dataset.videoId!);
      });
    });
  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) close();
  });
})();

/**
 * 1b. HERO FAN - shuffle the photo deck front-to-back. Moving the front card
 * to the back changes every card's nth-child index, so CSS animates them to
 * their new fan slot.
 */
(() => {
  const fan = document.querySelector("[data-hero-fan]");
  if (!fan || reduceMotion) return; // static fan if reduced motion
  const cards = fan.querySelectorAll(".fan__photo");
  if (cards.length < 2) return;

  setInterval(() => {
    /**
     * The front card is the last child; send it to the front of the DOM (the
     * back of the fan) so the rest shuffle up a slot.
     */
    fan.insertBefore(fan.lastElementChild!, fan.firstElementChild);
  }, 3500);
})();

/**
 * Booking form: submit inline via fetch, with a mailto fallback when no
 * Web3Forms key is configured. Status strings are localized server-side and
 * read off the form's data attributes.
 */
(() => {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  const status = document.querySelector<HTMLElement>("[data-contact-status]");
  if (!form || !status) return;
  const configured = CONTACT_ACCESS_KEY !== "YOUR_WEB3FORMS_ACCESS_KEY";
  const email = form.dataset.email ?? BOOKING_EMAIL;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const senderEmail = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    /**
     * Not wired up yet: hand off to the DJ's inbox instead of failing silently.
     */
    if (!configured) {
      const body = `Name: ${name}%0AEmail: ${senderEmail}%0A%0A${encodeURIComponent(message)}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(
        "Message via djzwackery.com",
      )}&body=${body}`;
      return;
    }

    const btn = form.querySelector("button[type=submit]") as HTMLButtonElement;
    btn.disabled = true;
    status.dataset.state = "";
    status.textContent = form.dataset.msgSending ?? "Sending…";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(String(res.status));
      status.dataset.state = "ok";
      status.textContent = form.dataset.msgSent ?? "Sent!";
      form.reset();
    } catch {
      status.dataset.state = "err";
      status.textContent =
        form.dataset.msgFailed ?? `Couldn't send. Email ${email} instead.`;
    } finally {
      btn.disabled = false;
    }
  });
})();

/**
 * 2. EMOTE RAIN - his real 7TV emotes, curated fallback
 */
const emoteRain = (() => {
  const layer = document.getElementById("emote-rain");
  let sources: string[] = []; // emote image urls
  let fetched = false;
  let running = false;
  let spawnTimer: number | undefined;

  async function loadEmotes() {
    if (fetched) return;
    fetched = true;
    /**
     * His actual Twitch channel (subscriber) emotes, baked in at build time.
     */
    const twitch = channelEmotes.map((e) => twitchEmoteUrl(e.id));
    let sevenTv: string[];
    try {
      const res = await fetch(
        `https://7tv.io/v3/users/twitch/${TWITCH_USER_ID}`,
      );
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as {
        emote_set?: { emotes?: { id: string }[] };
      };
      const emotes = data.emote_set?.emotes ?? [];
      sevenTv = emotes
        .slice(0, 40)
        .map((e) => `https://cdn.7tv.app/emote/${e.id}/2x.webp`);
    } catch {
      sevenTv = [];
    }
    /**
     * His Twitch channel emotes are weighted heavier so they show up often,
     * mixed with his 7TV channel emotes.
     */
    sources = [...twitch, ...twitch, ...sevenTv];
  }

  function spawnOne() {
    if (!layer) return;
    const el = document.createElement("span");
    el.className = "emote";
    const src = sources[Math.floor(Math.random() * sources.length)];
    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.width = 44;
      img.height = 44;
      el.appendChild(img);
    } else {
      el.textContent =
        FALLBACK_EMOJIS[Math.floor(Math.random() * FALLBACK_EMOJIS.length)];
    }
    const startX = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 160;
    const dur = 4500 + Math.random() * 3500;
    const spin = (Math.random() - 0.5) * 720;
    el.style.left = `${startX}vw`;

    layer.appendChild(el);

    if (reduceMotion) {
      /**
       * Reduced motion: dot a few emotes near the top, no falling.
       */
      el.style.top = `${5 + Math.random() * 15}vh`;
      el.style.opacity = "0.9";
      setTimeout(() => el.remove(), 2500);
      return;
    }

    const anim = el.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${drift}px, 108vh) rotate(${spin}deg)`,
          opacity: 0.9,
        },
      ],
      { duration: dur, easing: "cubic-bezier(.3,.1,.6,1)" },
    );
    anim.onfinish = () => el.remove();
  }

  async function start() {
    if (running) return;
    running = true;
    await loadEmotes();
    const tick = () => {
      if (!running) return;
      const burst = reduceMotion ? 1 : 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < burst; i++) spawnOne();
      spawnTimer = window.setTimeout(tick, reduceMotion ? 1600 : 380);
    };
    tick();
  }

  function stop() {
    running = false;
    if (spawnTimer) clearTimeout(spawnTimer);
    if (layer) layer.innerHTML = "";
  }

  return { start, stop };
})();

/**
 * 4. LIVE STAGE - inject Twitch player + chat only when live
 */
function mountStage() {
  const playerEl = document.querySelector<HTMLElement>("[data-twitch-player]");
  const chatEl = document.querySelector<HTMLElement>("[data-twitch-chat]");
  if (playerEl && !playerEl.dataset.mounted) {
    playerEl.dataset.mounted = "1";
    playerEl.innerHTML = `<iframe src="https://player.twitch.tv/?channel=${TWITCH_LOGIN}&${parents}&autoplay=true&muted=false" title="DJ Zwackery live on Twitch" allowfullscreen></iframe>`;
  }
  if (chatEl && !chatEl.dataset.mounted) {
    chatEl.dataset.mounted = "1";
    chatEl.innerHTML = `<iframe src="https://www.twitch.tv/embed/${TWITCH_LOGIN}/chat?darkpopout&${parents}" title="Twitch chat"></iframe>`;
  }
}

/**
 * 5. STATE - flip the whole site between offline / live
 */
let isLive = false;
function setLive(live: boolean) {
  if (live === isLive) return;
  isLive = live;
  html.dataset.live = String(live);

  /**
   * Kick the background deck-cam up a gear while he's live for extra energy.
   */
  const bg = document.querySelector<HTMLVideoElement>("[data-bg-video]");
  if (bg) bg.playbackRate = live ? 1.5 : 1;

  if (live) {
    mountStage();
    emoteRain.start();
    document.querySelector<HTMLElement>("[data-stage]")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  } else {
    emoteRain.stop();
  }
}

/**
 * Minimal shape of the `Twitch` global the embed player script (see
 * `loadTwitch` below) attaches to `window` — there's no official types
 * package for it.
 */
interface TwitchEmbedGlobal {
  Player: {
    new (
      elementId: string,
      options: Record<string, unknown>,
    ): { addEventListener(event: string, cb: () => void): void };
    ONLINE: string;
    OFFLINE: string;
  };
}
declare global {
  interface Window {
    Twitch?: TwitchEmbedGlobal;
  }
}

/**
 * 6. DETECTION - a hidden Twitch embed's ONLINE/OFFLINE events. Client-side,
 * no secrets, works on static hosting.
 */
function initTwitch() {
  /**
   * Hidden 1px player purely to receive online/offline events.
   */
  const probe = document.createElement("div");
  probe.id = "twitch-probe";
  probe.style.cssText =
    "position:fixed;width:1px;height:1px;left:-10px;top:-10px;opacity:0;pointer-events:none;";
  document.body.appendChild(probe);

  const Twitch = window.Twitch;
  if (!Twitch) return;
  const player = new Twitch.Player("twitch-probe", {
    channel: TWITCH_LOGIN,
    width: 1,
    height: 1,
    muted: true,
    autoplay: true,
    controls: false,
  });
  player.addEventListener(Twitch.Player.ONLINE, () => setLive(true));
  player.addEventListener(Twitch.Player.OFFLINE, () => setLive(false));
}

/**
 * 7. PARTY BURST - an easter egg. Clicking the hero wordmark (or the Konami
 * code) rains his channel emotes and dayglo confetti out of the logo, with a
 * quick colour flash. Respects reduced motion.
 */
(() => {
  const trigger = document.querySelector<HTMLElement>("[data-party]");
  if (!trigger) return;

  const emoteUrls = channelEmotes.map((e) => twitchEmoteUrl(e.id));
  const confettiColors = ["#ff1f8f", "#c6ff00", "#00e5ff", "#ffe600"];
  let layer: HTMLElement | null = null;
  let firing = false;

  function ensureLayer(): HTMLElement {
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "party";
      document.body.appendChild(layer);
    }
    return layer;
  }

  function fire() {
    if (firing) return;
    firing = true;
    setTimeout(() => (firing = false), 700);

    const box = ensureLayer();
    const r = trigger!.getBoundingClientRect();
    const originX = r.left + r.width / 2;
    const originY = r.top + r.height / 2;

    /**
     * A quick brand-colour flash radiating from the logo. A flat full-page
     * tint read as a muddy wash, so this is a radial gradient anchored to the
     * click point instead.
     */
    if (!reduceMotion) {
      html.style.setProperty("--party-x", `${originX}px`);
      html.style.setProperty("--party-y", `${originY}px`);
      html.classList.remove("is-partying");
      void html.offsetWidth;
      html.classList.add("is-partying");
      setTimeout(() => html.classList.remove("is-partying"), 700);
    }

    const count = reduceMotion ? 14 : 48;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "party__bit";
      const useEmote = emoteUrls.length > 0 && Math.random() < 0.4;
      if (useEmote) {
        const size = 24 + Math.random() * 14;
        const img = document.createElement("img");
        img.src = emoteUrls[Math.floor(Math.random() * emoteUrls.length)];
        img.alt = "";
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        p.appendChild(img);
      } else {
        p.style.width = `${7 + Math.random() * 6}px`;
        p.style.height = `${11 + Math.random() * 8}px`;
        p.style.background = confettiColors[i % confettiColors.length];
        p.style.borderRadius = Math.random() < 0.5 ? "50%" : "2px";
      }

      // Small spawn jitter so pieces don't all stack on the exact same point.
      const jitterX = (Math.random() - 0.5) * 32;
      const jitterY = (Math.random() - 0.5) * 32;
      p.style.left = `${originX + jitterX}px`;
      p.style.top = `${originY + jitterY}px`;
      box.appendChild(p);

      const angle = Math.random() * Math.PI * 2;
      const power = 90 + Math.random() * 220;
      const dx = Math.cos(angle) * power;
      const rise = -Math.abs(Math.sin(angle) * power) - 80;
      const fall = 220 + Math.random() * 240;
      const startSpin = (Math.random() - 0.5) * 60;
      const spin = startSpin + (Math.random() - 0.5) * 720;
      const dur = 1100 + Math.random() * 700;

      if (reduceMotion) {
        p.style.transform = `translate(${dx}px, ${rise}px)`;
        p.style.opacity = "0.9";
        setTimeout(() => p.remove(), 1200);
        continue;
      }

      // Two-phase arc: a quick ease-out launch, then a gravity-style ease-in
      // fall, so motion stays visible across the whole duration instead of
      // front-loading into the first third and leaving a long dead tail.
      const anim = p.animate(
        [
          {
            transform: `translate(0,0) rotate(${startSpin}deg)`,
            opacity: 1,
            offset: 0,
            easing: "cubic-bezier(.15,.8,.3,1)",
          },
          {
            transform: `translate(${dx * 0.75}px, ${rise}px) rotate(${spin * 0.5}deg)`,
            opacity: 1,
            offset: 0.4,
            easing: "cubic-bezier(.5,0,.7,.6)",
          },
          {
            transform: `translate(${dx}px, ${rise + fall}px) rotate(${spin}deg)`,
            opacity: 0,
          },
        ],
        { duration: dur, fill: "forwards" },
      );
      anim.onfinish = () => p.remove();
    }
  }

  trigger.style.cursor = "pointer";
  trigger.addEventListener("click", fire);

  /**
   * Konami code also sets it off, for the truly dedicated.
   */
  const seq = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let idx = 0;
  window.addEventListener("keydown", (e) => {
    idx = e.key.toLowerCase() === seq[idx].toLowerCase() ? idx + 1 : 0;
    if (idx === seq.length) {
      idx = 0;
      fire();
    }
  });
})();

(function loadTwitch() {
  /**
   * Preview override: `?live` (or `?live=1`) forces the live takeover so the
   * stream/emote-rain layout can be previewed without waiting for a real
   * stream. `?live=0` / `?live=false` forces offline; anything else is real
   * detection.
   */
  const param = new URLSearchParams(location.search).get("live");
  if (param !== null) {
    const wantLive = param !== "0" && param !== "false" && param !== "off";
    setLive(wantLive);
    if (wantLive) return; // skip the Twitch probe so it can't flip us back offline
  }

  const s = document.createElement("script");
  s.src = "https://player.twitch.tv/js/embed/v1.js";
  s.async = true;
  s.onload = initTwitch;
  document.head.appendChild(s);
})();
