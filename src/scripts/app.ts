import {
  TWITCH_LOGIN,
  TWITCH_PARENTS,
  FALLBACK_EMOJIS,
  CONTACT_ACCESS_KEY,
  BOOKING_EMAIL,
} from "../config";
import "./console-credit";

/**
 * Zwackery's Twitch + 7TV emotes, already fetched and self-hosted at build
 * time (see lib/emotes.ts) and injected as a JSON script tag: plain local
 * URLs, no runtime fetch; empty arrays if the build-time fetch failed.
 */
const emotes: { twitch: string[]; seventv: string[] } = (() => {
  try {
    const parsed = JSON.parse(
      document.querySelector("[data-emotes]")?.textContent || "{}",
    );
    return { twitch: parsed.twitch ?? [], seventv: parsed.seventv ?? [] };
  } catch {
    return { twitch: [], seventv: [] };
  }
})();

const html = document.documentElement;
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isMobile = window.matchMedia("(max-width: 640px)").matches;
const parents = TWITCH_PARENTS.map((p) => `parent=${p}`).join("&");

/**
 * iOS Safari only applies :active/:hover styles once the document has a touch
 * listener, so register a no-op one to make the sticker-button press work.
 */
document.addEventListener("touchstart", () => {}, { passive: true });

/** 404 page sets a sessionStorage flag before redirecting; consume it once here. */
(() => {
  if (!sessionStorage.getItem("notfound")) return;
  sessionStorage.removeItem("notfound");
  const toast = document.querySelector<HTMLElement>("[data-toast]");
  if (!toast) return;
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  setTimeout(() => toast.classList.remove("is-visible"), 5000);
})();

(() => {
  const vid = document.querySelector<HTMLVideoElement>("[data-bg-video]");
  if (!vid) return;
  if (reduceMotion) {
    vid.removeAttribute("autoplay");
    vid.pause();
    return;
  }
  vid.play().catch(() => {
    /* autoplay blocked, poster remains */
  });
})();

/**
 * Lightbox: cards are real links to YouTube (progressive enhancement). Intercept
 * plain clicks to open an inline player; modifier/middle clicks still open YouTube.
 */
(() => {
  const lightbox = document.getElementById("lightbox");
  const frame = document.getElementById("lightbox-frame");
  const closeBtn = document.getElementById("lightbox-close");
  if (!lightbox || !frame || !closeBtn) return;

  let lastFocused: HTMLElement | null = null;
  let scrollLockY = 0;

  /** iOS Safari ignores `overflow: hidden` on body while scrolling, so pin it in place instead. */
  const setScrollLocked = (locked: boolean) => {
    if (locked) {
      scrollLockY = window.scrollY;
      document.body.style.top = `-${scrollLockY}px`;
      document.body.classList.add("scroll-locked");
    } else {
      document.body.classList.remove("scroll-locked");
      document.body.style.top = "";
      window.scrollTo({ top: scrollLockY, behavior: "instant" });
    }
  };

  const open = (id: string) => {
    lastFocused = document.activeElement as HTMLElement;
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="YouTube video player" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    lightbox.classList.add("is-open");
    setScrollLocked(true);
    closeBtn.focus();
  };
  const close = () => {
    lightbox.classList.remove("is-open");
    setScrollLocked(false);
    // let the exit transition finish before tearing down the iframe
    setTimeout(() => {
      if (!lightbox.classList.contains("is-open")) frame.innerHTML = "";
    }, 260);
    lastFocused?.focus();
  };

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
 * Hero fan: moving the front card (last DOM child) to the back changes every
 * card's nth-child index, which CSS uses to animate each photo to its new fan
 * slot. Paused while a card's easter-egg clip is playing (see below) so the
 * shuffle doesn't yank the card away mid-loop.
 *
 * Easter egg: hovering a card swaps in a muted clip, with a brief VHS-glitch
 * flicker at the swap instead of a plain crossfade. Touch has no real hover,
 * so tap toggles it instead (mirrors the About mascot's pattern).
 */
(() => {
  const fan = document.querySelector<HTMLElement>("[data-hero-fan]");
  if (!fan) return;
  const cards = fan.querySelectorAll<HTMLElement>(".fan__photo");
  if (!cards.length) return;

  let rotateTimer: ReturnType<typeof setInterval> | undefined;
  const startRotation = () => {
    if (reduceMotion || rotateTimer || cards.length < 2) return;
    rotateTimer = setInterval(() => {
      fan.insertBefore(fan.lastElementChild!, fan.firstElementChild);
    }, 3500);
  };
  const stopRotation = () => {
    clearInterval(rotateTimer);
    rotateTimer = undefined;
  };
  startRotation();

  const isTouch = window.matchMedia("(hover: none)").matches;
  const GLITCH_MS = 250;

  cards.forEach((card) => {
    const clip = card.querySelector<HTMLVideoElement>(".fan__clip");
    if (!clip) return;
    let glitchTimer: ReturnType<typeof setTimeout>;

    const glitch = () => {
      if (reduceMotion) return;
      card.classList.remove("is-glitching");
      // force reflow so a second glitch mid-timer restarts the animation
      void card.offsetWidth;
      card.classList.add("is-glitching");
      clearTimeout(glitchTimer);
      glitchTimer = setTimeout(
        () => card.classList.remove("is-glitching"),
        GLITCH_MS,
      );
    };
    const show = () => {
      stopRotation();
      glitch();
      clip.currentTime = 0;
      clip.play().catch(() => {});
    };
    const hide = () => {
      glitch();
      clip.pause();
      startRotation();
    };

    if (isTouch) {
      card.addEventListener("click", () => {
        const active = card.classList.toggle("is-active");
        if (active) show();
        else hide();
      });
    } else {
      card.addEventListener("mouseenter", show);
      card.addEventListener("mouseleave", hide);
    }
  });
})();

const emoteUrls = emotes.twitch;
const confettiColors = [
  "var(--magenta)",
  "var(--acid)",
  "var(--cyan)",
  "var(--sun)",
];
/** Cycled in order on each click, like playing through a kick roll. */
const partyKicks = [
  "/party/kick-1.mp3",
  "/party/kick-2.mp3",
  "/party/kick-3.mp3",
  "/party/kick-4.mp3",
];
/** One picked at random once enough clicks have built up; never two at once. */
const partyBreaks = [
  "/party/break-renegade.mp3",
  "/party/break-omoh.mp3",
  "/party/break-rig.mp3",
  "/party/break-djd.mp3",
];
/** Clicks needed since the last break before another is allowed to fire. */
const BREAK_EVERY = 16;
/** The kick samples are exactly one beat at 170bpm; playbackRate is scaled
 * off that so the felt tempo tracks how fast you're actually clicking, capped
 * to a 190bpm ceiling since anything faster stops sounding like a beat. */
const NATIVE_BPM = 170;
const MAX_BPM = 200;
const NATIVE_BEAT_SECONDS = 60 / NATIVE_BPM;
const MIN_PARTY_RATE = 0.6;
const MAX_PARTY_RATE = MAX_BPM / NATIVE_BPM;

let nextKickIndex = 0;
let clicksSinceBreak = 0;
let breakPlaying = false;
let lastPartyClick = 0;
let lastBreak = "";

/** Never the same break twice in a row. */
function pickPartyBreak(): string {
  const choices = partyBreaks.filter((b) => b !== lastBreak);
  return choices[Math.floor(Math.random() * choices.length)];
}

/** A pause longer than 2s (or the very first click) resets to a neutral tempo. */
function partyClickRate(now: number): number {
  if (!lastPartyClick) {
    lastPartyClick = now;
    return 1;
  }
  const delta = (now - lastPartyClick) / 1000;
  lastPartyClick = now;
  if (delta > 2) return 1;
  if (delta <= 0) return MAX_PARTY_RATE;
  const rate = NATIVE_BEAT_SECONDS / delta;
  return Math.min(MAX_PARTY_RATE, Math.max(MIN_PARTY_RATE, rate));
}
let partyLayer: HTMLElement | null = null;
let partyFlash: HTMLElement | null = null;
/**
 * Caps concurrent particles instead of cooling down clicks, so spamming
 * stays instant. Kept modest: each particle is its own composited layer,
 * and Safari/iOS chokes well before 260 of those stay smooth.
 */
const MAX_PARTY_BITS = 160;
let livePartyBits = 0;

function ensurePartyLayer(): HTMLElement {
  if (!partyLayer) {
    partyLayer = document.createElement("div");
    partyLayer.id = "party";
    document.body.appendChild(partyLayer);
  }
  return partyLayer;
}

function ensurePartyFlash(): HTMLElement {
  if (!partyFlash) {
    partyFlash = document.createElement("div");
    partyFlash.id = "party-flash";
    document.body.appendChild(partyFlash);
  }
  return partyFlash;
}

/** Runs `cleanup` exactly once, whichever of the two triggers fires first. */
function once(cleanup: () => void): () => void {
  let done = false;
  return () => {
    if (done) return;
    done = true;
    cleanup();
  };
}

/**
 * Shared player for the "clip" easter eggs: same ambient-wash treatment as
 * the Dutch meme (see .clip-meme), muted, dismissing itself when the clip
 * ends rather than a guessed timeout (`stop()` lets a caller cut it short
 * early, e.g. to match a shorter sound effect). One overlay reused across
 * calls, and `playing` guards against a second clip starting while one is
 * still going.
 */
function createClipPlayer() {
  let overlay: HTMLDivElement | null = null;
  let video: HTMLVideoElement | null = null;
  let playing = false;
  let dismiss: () => void = () => {};

  function play(src: string, rate = 1) {
    if (playing) return;
    playing = true;
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "clip-meme";
      video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      overlay.appendChild(video);
      document.body.appendChild(overlay);
    }
    const v = video!;
    const bgVideo = document.querySelector<HTMLElement>(".bg-video");

    dismiss = once(() => {
      playing = false;
      v.pause();
      overlay!.classList.remove("is-visible");
      if (bgVideo) bgVideo.style.opacity = "";
    });

    v.src = src;
    v.playbackRate = rate;
    v.addEventListener("ended", dismiss, { once: true });
    v.addEventListener("error", dismiss, { once: true });
    v.addEventListener(
      "canplay",
      () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            overlay!.classList.add("is-visible");
            if (bgVideo) bgVideo.style.opacity = "0";
          });
        });
        v.play().catch(dismiss);
      },
      { once: true },
    );
    // fallback in case `ended` never fires (Safari/iOS throttling)
    setTimeout(dismiss, 20000);
  }

  return { play, stop: () => dismiss() };
}

const clipPlayer = createClipPlayer();

function fireParty(originX: number, originY: number) {
  const box = ensurePartyLayer();

  const rate = partyClickRate(performance.now());
  const playBreak = !breakPlaying && clicksSinceBreak >= BREAK_EVERY;
  const beatSrc = playBreak ? pickPartyBreak() : partyKicks[nextKickIndex];
  if (playBreak) {
    lastBreak = beatSrc;
    clicksSinceBreak = 0;
    breakPlaying = true;
  } else {
    nextKickIndex = (nextKickIndex + 1) % partyKicks.length;
    clicksSinceBreak++;
  }

  const beat = new Audio(beatSrc);
  beat.volume = 0.5;
  beat.playbackRate = rate;
  beat.preservesPitch = false;
  if (playBreak) {
    beat.addEventListener("ended", () => (breakPlaying = false), {
      once: true,
    });
  }
  beat.play().catch(() => {});

  // A flat full-page tint reads as a muddy wash; radial gradient anchored to
  // the click point gives a real burst effect instead. Driven by
  // Element.animate() (cancel-then-restart) rather than a CSS class toggle:
  // rapid-fire clicks on iOS could coalesce the remove/reflow/re-add into a
  // single paint and the flash would never visibly restart.
  if (!reduceMotion) {
    const flash = ensurePartyFlash();
    flash.style.insetInlineStart = `${originX}px`;
    flash.style.insetBlockStart = `${originY}px`;
    flash.getAnimations().forEach((a) => a.cancel());
    flash.animate(
      [
        { opacity: 1, scale: 0.03 },
        { opacity: 0, scale: 1 },
      ],
      {
        duration: 700,
        easing: "ease-out",
        fill: "forwards",
      },
    );
  }

  const requested = reduceMotion ? 14 : 32;
  const count = Math.max(
    0,
    Math.min(requested, MAX_PARTY_BITS - livePartyBits),
  );
  for (let i = 0; i < count; i++) {
    livePartyBits++;
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
      p.style.width = `${4 + Math.random() * 4}px`;
      p.style.height = `${10 + Math.random() * 14}px`;
      p.style.background = confettiColors[i % confettiColors.length];
      p.style.borderRadius =
        Math.random() < 0.35 ? "50%" : `${5 + Math.random() * 8}px`;
    }

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

    const cleanup = once(() => {
      p.remove();
      livePartyBits--;
    });

    if (reduceMotion) {
      p.style.transform = `translate(${dx}px, ${rise}px)`;
      p.style.opacity = "0.9";
      setTimeout(cleanup, 1200);
      continue;
    }

    // Two-phase arc: ease-out launch then ease-in fall keeps motion visible
    // across the full duration instead of front-loading into the first third.
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
    // onfinish can silently never fire if Safari/iOS throttles or drops the
    // animation under load, which would leak the counter and eventually
    // block every future burst; a fallback timeout guarantees cleanup.
    anim.onfinish = cleanup;
    setTimeout(cleanup, dur + 200);
  }
}

/**
 * Booking form: posts to Web3Forms; falls back to a mailto: link when no API
 * key is configured so the CTA still works. Status strings are localized
 * server-side and read off the form's data attributes.
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
      const r = btn.getBoundingClientRect();
      fireParty(r.left + r.width / 2, r.top + r.height / 2);
    } catch {
      status.dataset.state = "err";
      status.textContent =
        form.dataset.msgFailed ?? `Couldn't send. Email ${email} instead.`;
    } finally {
      btn.disabled = false;
    }
  });
})();

const emoteRain = (() => {
  const layer = document.getElementById("emote-rain");
  let sources: string[] = [];
  let loaded = false;
  let running = false;
  let spawnTimer: number | undefined;

  function loadEmotes() {
    if (loaded) return;
    loaded = true;
    // Twitch emotes appear twice so they show up more often than 7TV emotes.
    sources = [...emotes.twitch, ...emotes.twitch, ...emotes.seventv];
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

  function start() {
    if (running) return;
    running = true;
    loadEmotes();
    const tick = () => {
      if (!running) return;
      const burst = reduceMotion
        ? 1
        : isMobile
          ? 1
          : 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < burst; i++) spawnOne();
      spawnTimer = window.setTimeout(
        tick,
        reduceMotion ? 1600 : isMobile ? 900 : 380,
      );
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
 * Easter egg: while live, occasionally shows one of a pool of review clips
 * as the same ambient wash as the Dutch meme, sped up to match the bg
 * video's own 1.5x while live. Fixed delay between plays is the cooldown;
 * add more clips to the pool as needed.
 */
const liveClips = (() => {
  const POOL = [
    "/videos/food-review-club.mp4",
    "/videos/greg-review.mp4",
    "/videos/aussie-review.mp4",
    "/videos/bounce-by-the-ounce.mp4",
  ];
  const DELAY = 15 * 1000;
  const PLAYBACK_RATE = 1.5;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let last = "";

  function scheduleNext() {
    timer = setTimeout(() => {
      const choices = POOL.filter((c) => c !== last || POOL.length === 1);
      last = choices[Math.floor(Math.random() * choices.length)];
      clipPlayer.play(last, PLAYBACK_RATE);
      scheduleNext();
    }, DELAY);
  }

  return {
    start() {
      if (timer || reduceMotion) return;
      scheduleNext();
    },
    stop() {
      clearTimeout(timer);
      timer = undefined;
    },
  };
})();

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

let isLive = false;
function setLive(live: boolean) {
  if (live === isLive) return;
  isLive = live;
  html.dataset.live = String(live);

  const bg = document.querySelector<HTMLVideoElement>("[data-bg-video]");
  if (bg && !isMobile) bg.playbackRate = live ? 1.5 : 1;

  if (live) {
    mountStage();
    emoteRain.start();
    liveClips.start();
    document.querySelector<HTMLElement>("[data-stage]")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  } else {
    emoteRain.stop();
    liveClips.stop();
  }
}

/**
 * Minimal shape of the `Twitch` global the embed player script attaches to
 * `window`; there's no official types package for it.
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
 * Live detection via a hidden Twitch embed's ONLINE/OFFLINE events: client-side,
 * no secrets, works on static hosting without a backend.
 */
function initTwitch() {
  /** Hidden 1px player: only here to receive online/offline events. */
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
 * The -50% loop needs one copy of the words as wide as the viewport, or
 * ultra-wide monitors flash a gap. Duplicate (scaling duration to match).
 */
(() => {
  const tracks = document.querySelectorAll<HTMLElement>(".marquee__track");

  const ensureSeamless = (track: HTMLElement) => {
    const duration = parseFloat(getComputedStyle(track).animationDuration);
    let unitWidth = track.scrollWidth / 2;
    if (!unitWidth || !duration) return;
    const speed = unitWidth / duration;
    const target = window.innerWidth * 1.15;
    while (unitWidth < target) {
      const clone = document.createDocumentFragment();
      Array.from(track.children).forEach((c) =>
        clone.appendChild(c.cloneNode(true)),
      );
      track.appendChild(clone);
      unitWidth = track.scrollWidth / 2;
    }
    track.style.animationDuration = `${unitWidth / speed}s`;
  };

  tracks.forEach(ensureSeamless);

  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => tracks.forEach(ensureSeamless), 200);
  });

  new MutationObserver(() => tracks.forEach(ensureSeamless)).observe(html, {
    attributeFilter: ["data-live"],
  });
})();

/**
 * Touch has no persistent :hover to leave, so gate a tap toggle to
 * `hover: none` only.
 */
(() => {
  const mascot = document.querySelector<HTMLElement>("[data-mascot]");
  if (!mascot || !window.matchMedia("(hover: none)").matches) return;
  mascot.addEventListener("click", () => {
    mascot.classList.toggle("is-active");
  });
})();

/**
 * MLG mascot easter egg: click it (repeatedly) for hitmarkers, escalating
 * overlapping sfx/gifs, and a screen shake/strobe that ramps with the combo,
 * kicking in at 3 rapid clicks, and resets after a pause. Tier lands on
 * `body` as a plain class; see the CSS for why the shake itself targets
 * main/.footer instead of body directly. Clicking frantically enough
 * (5 clicks within 200ms of each other) triggers a one-off "rapid crosshair
 * meme" burst across the mascot, gated by its own 5s cooldown.
 */
(() => {
  const mascot = document.querySelector<HTMLElement>("[data-mascot]");
  if (!mascot) return;

  /** Short enough to layer freely without turning into a wall of noise. */
  const stingerSfx = [
    "/mlg/airhorn.mp3",
    "/mlg/omg.mp3",
    "/mlg/swaggity-swagger.mp3",
    "/mlg/wow.mp3",
    "/mlg/sniper.mp3",
    "/mlg/intervention-triple-kill.mp3",
    "/mlg/pufferfish-augh.mp3",
    "/mlg/mum-get-the-camera.mp3",
    "/mlg/sanic-the-hegehog.mp3",
    "/mlg/damn-son.mp3",
    "/mlg/headshot-mlg.mp3",
    "/mlg/loud-mlg-horn.mp3",
  ];
  /** 11-17s tracks; only one plays per peak-tier episode, not per click. */
  const chaosTracks = [
    "/mlg/my-hope-will-never-die.mp3",
    "/mlg/wombo-combo.mp3",
    "/mlg/wombo-combo-omg.mp3",
    "/mlg/omg-full.mp3",
  ];
  const gifPool = [
    "/mlg/sniper.webp",
    "/mlg/rainbow-frog.webp",
    "/mlg/wow.webp",
    "/mlg/thumbs-up-kid.webp",
    "/mlg/airhorn.webp",
    "/mlg/foodguy.webp",
    "/mlg/takeaway.webp",
    "/mlg/pufferfish.webp",
    "/mlg/food-gov.webp",
    "/mlg/takeaway2.webp",
  ];
  const MAX_LIVE_AUDIO = 12;
  const MAX_LIVE_CHAOS_TRACKS = 2;
  const MAX_LIVE_GIFS = 6;
  const COMBO_TIMEOUT = 1200;
  const MAX_COMBO = 20;
  const FADE_OUT_MS = 500;
  /** Tighter than COMBO_TIMEOUT: this measures genuinely frantic clicking, not just a sustained combo. */
  const RAPID_CLICK_GAP = 200;
  const RAPID_CLICKS_NEEDED = 5;
  const CROSSHAIR_MEME_COOLDOWN = 5000;
  const CROSSHAIR_COUNT = 16;
  const pick = (pool: string[]) =>
    pool[Math.floor(Math.random() * pool.length)];

  let combo = 0;
  let lastClick = 0;
  let liveChaosTracks = 0;
  let liveGifs = 0;
  let peakShown = false;
  let resetTimer: ReturnType<typeof setTimeout>;
  let rapidCombo = 0;
  let lastRapidClick = 0;
  let lastCrosshairMeme = 0;

  /** Tracked (not just counted) so a reset can fade every one of these out. */
  const activeAudio: { audio: HTMLAudioElement; release: () => void }[] = [];

  const strobe = document.createElement("div");
  strobe.id = "mlg-strobe";
  document.body.appendChild(strobe);

  const playSfx = (src: string, volume: number, isChaosTrack = false) => {
    if (activeAudio.length >= MAX_LIVE_AUDIO) return;
    if (isChaosTrack && liveChaosTracks >= MAX_LIVE_CHAOS_TRACKS) return;
    if (isChaosTrack) liveChaosTracks++;
    const audio = new Audio(src);
    audio.volume = volume;
    // release() can be reached from "ended", the fallback timeout below, and
    // a fade-out all racing each other; once() keeps a double-fire from
    // double-decrementing liveChaosTracks.
    const entry: { audio: HTMLAudioElement; release: () => void } = {
      audio,
      release: once(() => {
        const i = activeAudio.indexOf(entry);
        if (i !== -1) activeAudio.splice(i, 1);
        if (isChaosTrack) liveChaosTracks--;
      }),
    };
    activeAudio.push(entry);
    audio.addEventListener("ended", entry.release, { once: true });
    audio.play().catch(entry.release);
    // "ended" can go missing under iOS throttling too; 20s covers even the
    // longest chaos track (~17s) so a stuck entry can't wedge MAX_LIVE_AUDIO.
    setTimeout(entry.release, 20000);
  };

  /** Ramps every currently-playing MLG sound to silence instead of letting it linger or cutting abruptly. */
  const fadeOutAllAudio = () => {
    for (const { audio, release } of [...activeAudio]) {
      const startVolume = audio.volume;
      const start = performance.now();
      const step = (now: number) => {
        if (audio.paused) return;
        const t = Math.min((now - start) / FADE_OUT_MS, 1);
        audio.volume = startVolume * (1 - t);
        if (t < 1) requestAnimationFrame(step);
        else {
          audio.pause();
          release();
        }
      };
      requestAnimationFrame(step);
    }
  };

  const spawnHitmarker = (x: number, y: number) => {
    const mark = document.createElement("div");
    mark.className = "mlg-hitmarker";
    mark.style.left = `${x}px`;
    mark.style.top = `${y}px`;
    document.body.appendChild(mark);
    if (reduceMotion) {
      mark.style.animation = "none";
      setTimeout(() => mark.remove(), 300);
    } else {
      // animationend can silently never fire under Safari/iOS throttling;
      // a fallback timeout guarantees the node still gets cleaned up.
      const cleanup = once(() => mark.remove());
      mark.addEventListener("animationend", cleanup, { once: true });
      setTimeout(cleanup, 550);
    }
  };

  /** Rapid-click easter egg: a burst of hitmarkers scattered across the mascot, staggered like a montage. */
  const spawnCrosshairMeme = () => {
    const rect = mascot.getBoundingClientRect();
    for (let i = 0; i < CROSSHAIR_COUNT; i++) {
      setTimeout(() => {
        spawnHitmarker(
          rect.left + Math.random() * rect.width,
          rect.top + Math.random() * rect.height,
        );
        playSfx("/mlg/hitmarker.mp3", 0.6);
      }, i * 40);
    }
  };

  const flashOverlay = (x: number, y: number) => {
    if (liveGifs >= MAX_LIVE_GIFS) return;
    liveGifs++;
    const img = document.createElement("img");
    img.className = "mlg-overlay";
    img.src = pick(gifPool);
    img.alt = "";
    img.decoding = "async";
    // jitter around the click point, clamped so it can't spawn off-screen
    const left = Math.min(
      Math.max(x + (Math.random() - 0.5) * 300, 40),
      window.innerWidth - 40,
    );
    const top = Math.min(
      Math.max(y + (Math.random() - 0.5) * 300, 40),
      window.innerHeight - 40,
    );
    img.style.left = `${left}px`;
    img.style.top = `${top}px`;
    img.style.setProperty("--mlg-rotate", `${(Math.random() - 0.5) * 20}deg`);
    document.body.appendChild(img);
    const cleanup = once(() => {
      img.remove();
      liveGifs--;
    });
    img.addEventListener("animationend", cleanup, { once: true });
    setTimeout(cleanup, 1700);
  };

  const setTier = (tier: number) => {
    document.body.classList.remove("mlg-1", "mlg-2", "mlg-3", "mlg-4", "mlg-5");
    if (tier > 0) document.body.classList.add(`mlg-${tier}`);
  };

  mascot.addEventListener("click", (e) => {
    const now = performance.now();
    combo =
      now - lastClick > COMBO_TIMEOUT ? 1 : Math.min(combo + 1, MAX_COMBO);
    lastClick = now;

    rapidCombo = now - lastRapidClick <= RAPID_CLICK_GAP ? rapidCombo + 1 : 1;
    lastRapidClick = now;
    if (
      !reduceMotion &&
      rapidCombo >= RAPID_CLICKS_NEEDED &&
      now - lastCrosshairMeme >= CROSSHAIR_MEME_COOLDOWN
    ) {
      lastCrosshairMeme = now;
      rapidCombo = 0;
      spawnCrosshairMeme();
    }

    playSfx("/mlg/hitmarker.mp3", 0.6);
    spawnHitmarker(e.clientX, e.clientY);

    const tier =
      combo >= 16
        ? 5
        : combo >= 12
          ? 4
          : combo >= 8
            ? 3
            : combo >= 5
              ? 2
              : combo >= 3
                ? 1
                : 0;
    if (!reduceMotion) {
      setTier(tier);
      if (tier >= 3 && !peakShown) {
        peakShown = true;
        playSfx(pick(chaosTracks), 0.35, true);
      }
      const gifChance = tier >= 3 ? 1 : tier === 2 ? 0.6 : tier === 1 ? 0.3 : 0;
      if (Math.random() < gifChance) flashOverlay(e.clientX, e.clientY);
      if (tier >= 4 && Math.random() < (tier === 5 ? 0.9 : 0.5)) {
        flashOverlay(e.clientX, e.clientY);
      }
      if (tier === 5 && Math.random() < 0.4) {
        flashOverlay(e.clientX, e.clientY);
      }
    }

    const sfxChance = tier >= 3 ? 1 : tier === 2 ? 0.7 : tier === 1 ? 0.4 : 0;
    if (Math.random() < sfxChance) {
      playSfx(pick(stingerSfx), 0.5);
    }

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      combo = 0;
      peakShown = false;
      setTier(0);
      fadeOutAllAudio();
    }, COMBO_TIMEOUT);
  });
})();

/**
 * Easter egg: clicking the footer logo plays a sound (restarting rather than
 * layering on repeat clicks) and shows the same ambient clip wash as the
 * Dutch meme, using the TFT review clip. The clip is cut short the moment
 * the sound finishes rather than running to its own (longer) natural end.
 */
(() => {
  const trigger = document.querySelector<HTMLElement>(".footer__logo");
  if (!trigger) return;
  const audio = new Audio("/pavs.mp3");
  audio.volume = 0.5;
  audio.addEventListener("ended", () => clipPlayer.stop());
  trigger.addEventListener("click", () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
    clipPlayer.play("/videos/tft-review.mp4");
  });
})();

/**
 * Easter egg: clicking the hero wordmark (or entering the Konami code) rains
 * channel emotes and confetti from the logo. Respects reduced motion.
 */
(() => {
  const trigger = document.querySelector<HTMLElement>("[data-party]");
  if (!trigger) return;

  trigger.style.cursor = "pointer";
  trigger.addEventListener("click", (e) => {
    fireParty(e.clientX, e.clientY);
  });

  /** Konami code also sets it off, for the truly dedicated. */
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
      const r = trigger.getBoundingClientRect();
      fireParty(r.left + r.width / 2, r.top + r.height / 2);
    }
  });
})();

/**
 * Dutch easter egg: full-screen meme on NL, timed from actual image load
 * rather than page load.
 */
(() => {
  if (document.documentElement.lang !== "nl") return;
  const overlay = document.createElement("div");
  overlay.className = "dutch-meme";
  const img = document.createElement("img");
  img.alt = "";
  img.decoding = "async";
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  const bgVideo = document.querySelector<HTMLElement>(".bg-video");

  const dismiss = () => {
    overlay.classList.remove("is-visible");
    if (bgVideo) bgVideo.style.opacity = "";
    overlay.addEventListener("transitionend", () => overlay.remove(), {
      once: true,
    });
  };

  img.addEventListener(
    "load",
    () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.classList.add("is-visible");
          if (bgVideo) bgVideo.style.opacity = "0";
        });
      });
      setTimeout(dismiss, 3000);
    },
    { once: true },
  );
  img.addEventListener("error", () => overlay.remove(), { once: true });
  img.src = "/dutch.webp";
})();

(function loadTwitch() {
  /**
   * `?live` / `?live=1` forces the live takeover so the layout can be previewed
   * without a real stream. `?live=0` / `?live=false` forces offline.
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

/**
 * Warms the HTTP cache for an easter egg's media the moment the user shows
 * intent (hover, or touchstart since touch has no hover) instead of
 * blanket-fetching everything on every page load regardless of whether
 * these features are ever touched.
 */
function prewarmOnIntent(selector: string, assets: string[]) {
  const trigger = document.querySelector(selector);
  if (!trigger) return;
  const warm = () => {
    for (const href of assets) fetch(href).catch(() => {});
  };
  trigger.addEventListener("mouseenter", warm, { once: true });
  trigger.addEventListener("touchstart", warm, { once: true, passive: true });
}

prewarmOnIntent(".footer__logo", ["/pavs.mp3", "/videos/tft-review.mp4"]);

prewarmOnIntent("[data-party]", [
  "/party/kick-1.mp3",
  "/party/kick-2.mp3",
  "/party/kick-3.mp3",
  "/party/kick-4.mp3",
  "/party/break-renegade.mp3",
  "/party/break-omoh.mp3",
  "/party/break-rig.mp3",
  "/party/break-djd.mp3",
]);

prewarmOnIntent("[data-mascot]", [
  "/mlg/airhorn.mp3",
  "/mlg/omg.mp3",
  "/mlg/swaggity-swagger.mp3",
  "/mlg/wow.mp3",
  "/mlg/sniper.mp3",
  "/mlg/intervention-triple-kill.mp3",
  "/mlg/pufferfish-augh.mp3",
  "/mlg/mum-get-the-camera.mp3",
  "/mlg/sanic-the-hegehog.mp3",
  "/mlg/damn-son.mp3",
  "/mlg/headshot-mlg.mp3",
  "/mlg/loud-mlg-horn.mp3",
  "/mlg/hitmarker.mp3",
  "/mlg/my-hope-will-never-die.mp3",
  "/mlg/wombo-combo.mp3",
  "/mlg/wombo-combo-omg.mp3",
  "/mlg/omg-full.mp3",
  "/mlg/sniper.webp",
  "/mlg/rainbow-frog.webp",
  "/mlg/wow.webp",
  "/mlg/thumbs-up-kid.webp",
  "/mlg/airhorn.webp",
  "/mlg/foodguy.webp",
  "/mlg/takeaway.webp",
  "/mlg/pufferfish.webp",
  "/mlg/food-gov.webp",
  "/mlg/takeaway2.webp",
]);
