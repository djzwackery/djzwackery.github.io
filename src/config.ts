/**
 * Single source of truth for DJ Zwackery's site.
 * Copy, handles, and IDs live here so pages stay data-driven.
 */

export const SITE_URL = "https://djzwackery.com";

export const DJ_NAME = "DJ Zwackery";
export const SHOW_NAME = "House of Fun";

/** Ko-fi tip jar. Set to an empty string to hide the support button. */
export const KOFI_URL = "https://ko-fi.com/djzwackery";

/** Words that scroll across the LED marquee. Factual descriptors, not quotes. */
export const MARQUEE_WORDS = [
  "DJ ZWACKERY",
  "HOUSE OF FUN",
  "HAPPY HARDCORE",
  "UK HARDCORE",
  "FOLLOW ON TWITCH",
  ":BIGJIM:",
  "DJ ZWACKERY",
  "HOUSE OF FUN",
  "HAPPY HARDCORE",
  "UK HARDCORE",
  "FOLLOW ON TWITCH",
  ":ASKINGFORIT:",
];

/** Marquee words shown while he's live on Twitch. */
export const MARQUEE_WORDS_LIVE = [
  "● LIVE NOW",
  "WE'RE LIVE ON TWITCH",
  "GET IN HERE",
  "HANDS IN THE AIR",
];

/**
 * YouTube channel the feed and subscribe links point at.
 */
export const YOUTUBE_CHANNEL_ID = "UCLIVVSFSj9kbYUJzGYIjiUg";
export const YOUTUBE_URL = "https://www.youtube.com/@DJZwackery1";

/**
 * Bookings / contact. The form posts to Web3Forms (free, no backend): create a
 * form at https://web3forms.com, then paste the access key here. Until then the
 * form falls back to a mailto: link so the CTA still works.
 */
export const CONTACT_ACCESS_KEY: string =
  "e40c1461-cffc-49c1-9a03-16ef69dc4c6f";
export const BOOKING_EMAIL = "djzwackery@hotmail.com";

/**
 * Twitch identity used for the live embed, chat, and 7TV emote lookups.
 */
export const TWITCH_LOGIN = "djzwackery1";
/** Numeric Twitch user id - required by the 7TV emote API. */
export const TWITCH_USER_ID = "6785771";
export const TWITCH_URL = `https://www.twitch.tv/${TWITCH_LOGIN}`;
export const TWITTER_HANDLE = "@djzwackery";
/** Domains allowed to embed the Twitch player/chat. */
export const TWITCH_PARENTS = [
  "djzwackery.com",
  "www.djzwackery.com",
  "localhost",
];

export type Social = {
  platform: string;
  label: string;
  url: string;
  /** CSS custom-property name used as the hover accent. */
  accent: string;
};

export const SOCIALS: Social[] = [
  {
    platform: "youtube",
    label: "YouTube",
    url: YOUTUBE_URL,
    accent: "--magenta",
  },
  { platform: "twitch", label: "Twitch", url: TWITCH_URL, accent: "--cyan" },
  {
    platform: "discord",
    label: "Discord",
    url: "https://discord.gg/djzwackery",
    accent: "--acid",
  },
  {
    platform: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/djzwackery",
    accent: "--sun",
  },
  {
    platform: "x",
    label: "X",
    url: "https://x.com/djzwackery",
    accent: "--cyan",
  },
];

/**
 * Twitch CDN URL for an emote id (works for both his channel's `emotesv2_…`
 * ids and classic numeric ids). His channel emotes are fetched at build time
 * by src/lib/twitch-emotes.ts (see that file for the caching/fallback story).
 */
export const twitchEmoteUrl = (
  id: string | number,
  size: "2.0" | "3.0" = "3.0",
) => `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/${size}`;

/**
 * Curated dayglo fallback used if both emote sources are unreachable.
 * Real emotes are fetched client-side at runtime.
 */
export const FALLBACK_EMOJIS = [
  "😜",
  "🤪",
  "🔥",
  "💊",
  "🎉",
  "🐠",
  "📢",
  "✨",
  "💥",
  "🕺",
  "🙌",
  "💚",
  "💗",
  "⚡",
];
