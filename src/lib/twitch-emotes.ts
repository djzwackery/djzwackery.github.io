/**
 * Build-time loader for his Twitch channel (subscriber) emotes. Runs on the
 * server during the build via Twitch's public GraphQL endpoint (the same one
 * twitch.tv uses in the browser — no key/secret needed). The resulting list is
 * injected into the page for the client emote-rain script.
 *
 * Like the YouTube loader, the API is the source of truth and a `.cache/` copy
 * (persisted by actions/cache) is the fallback. Nothing is committed.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { TWITCH_LOGIN } from "../config";

export interface ChannelEmote {
  id: string;
  name: string;
}

/** Shape of the fields we read from Twitch's public GraphQL response. */
interface TwitchGqlResponse {
  data?: {
    user?: {
      subscriptionProducts?: { emotes?: { id: string; token: string }[] }[];
    };
  };
}

const CACHE_PATH = fileURLToPath(
  new URL("../../.cache/twitch-emotes.json", import.meta.url),
);

let memo: Promise<ChannelEmote[]> | null = null;

async function readCache(): Promise<ChannelEmote[] | null> {
  try {
    return JSON.parse(await readFile(CACHE_PATH, "utf8")) as ChannelEmote[];
  } catch {
    return null;
  }
}

async function writeCache(emotes: ChannelEmote[]): Promise<void> {
  try {
    await mkdir(dirname(CACHE_PATH), { recursive: true });
    await writeFile(CACHE_PATH, JSON.stringify(emotes));
  } catch {
    // best-effort
  }
}

async function load(): Promise<ChannelEmote[]> {
  try {
    const res = await fetch("https://gql.twitch.tv/gql", {
      method: "POST",
      headers: {
        "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{ user(login: "${TWITCH_LOGIN}") { subscriptionProducts { emotes { id token } } } }`,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as TwitchGqlResponse;
    const emotes: ChannelEmote[] = (json.data?.user?.subscriptionProducts ?? [])
      .flatMap((p) => p.emotes ?? [])
      .map((e) => ({ id: e.id, name: e.token }));
    if (emotes.length === 0) throw new Error("no emotes returned");
    await writeCache(emotes);
    console.log(`[twitch] Fetched ${emotes.length} channel emotes.`);
    return emotes;
  } catch (err) {
    const cached = await readCache();
    console.warn(
      `[twitch] Emote fetch failed (${(err as Error).message}) — ${cached ? "falling back to cache" : "curated emoji only"}.`,
    );
    return cached ?? [];
  }
}

/** Get his channel emotes (memoized for the whole build). */
export function getChannelEmotes(): Promise<ChannelEmote[]> {
  return (memo ??= load());
}
