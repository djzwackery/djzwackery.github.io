/**
 * Build-time loader for Zwackery's Twitch channel emotes + 7TV emotes. Both
 * the emote lists AND the actual images are fetched here rather than by the
 * visitor's browser, then self-hosted from /emotes/, so the emote rain
 * never depends on Twitch or 7TV being reachable at runtime, and a failed
 * fetch here just means fewer emotes rather than a broken build or page.
 *
 * A manifest (id -> file + ETag/Last-Modified) is cached in `.cache/emotes/`
 * (persisted by actions/cache) alongside the images themselves. Each build
 * re-checks every known emote with a conditional request: a 304 costs
 * almost nothing and skips the download, but an edited emote (same id, new
 * artwork) still gets picked up instead of being cached forever. If the list
 * fetch itself fails, or an individual image is unreachable, we fall back to
 * whatever was cached last time rather than dropping it.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { TWITCH_LOGIN, TWITCH_USER_ID, twitchEmoteUrl } from "../config";

export interface Emote {
  source: "twitch" | "seventv";
  /**
   * Filename under /emotes/, e.g. "twitch-emotesv2_123.png".
   */
  file: string;
}

interface ManifestEntry {
  file: string;
  etag?: string;
  lastModified?: string;
}
type Manifest = Record<string, ManifestEntry>;

/**
 * Resolved from process.cwd() rather than import.meta.url: this module runs
 * from two different build contexts (page frontmatter and the [file].ts
 * endpoint route), which Astro/Vite bundle separately, so import.meta.url
 * doesn't reliably point at the same place in both, so cwd is always the repo root.
 */
const CACHE_DIR = join(process.cwd(), ".cache", "emotes");
const MANIFEST_PATH = join(CACHE_DIR, "manifest.json");

const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/gif": "gif",
  "image/jpeg": "jpg",
};

async function readManifest(): Promise<Manifest> {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, "utf8")) as Manifest;
  } catch {
    return {};
  }
}

async function writeManifest(manifest: Manifest): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(MANIFEST_PATH, JSON.stringify(manifest));
  } catch {
    // best-effort
  }
}

/**
 * Ensures one emote's image is downloaded and up to date. A conditional
 * request means an unchanged emote costs a 304 instead of a full download;
 * a 200 (new emote, or an edited one) replaces it.
 */
async function ensureImage(
  manifest: Manifest,
  source: Emote["source"],
  id: string,
  sourceUrl: string,
): Promise<string | null> {
  const key = `${source}-${id}`;
  const prior = manifest[key];
  try {
    const headers: HeadersInit = {};
    if (prior?.etag) {
      headers["If-None-Match"] = prior.etag;
    }
    if (prior?.lastModified) {
      headers["If-Modified-Since"] = prior.lastModified;
    }
    const res = await fetch(sourceUrl, { headers });
    if (res.status === 304 && prior) {
      return prior.file;
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const type = res.headers.get("content-type") ?? "";
    const ext = EXT_BY_CONTENT_TYPE[type] ?? "png";
    const file = `${key}.${ext}`;
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(
      join(CACHE_DIR, file),
      Buffer.from(await res.arrayBuffer()),
    );
    manifest[key] = {
      file,
      etag: res.headers.get("etag") ?? undefined,
      lastModified: res.headers.get("last-modified") ?? undefined,
    };
    return file;
  } catch (err) {
    if (prior) {
      return prior.file;
    }
    console.warn(
      `[emotes] image fetch failed for ${key} (${(err as Error).message}).`,
    );
    return null;
  }
}

async function gql<T>(query: string): Promise<T> {
  const res = await fetch("https://gql.twitch.tv/gql", {
    method: "POST",
    headers: {
      "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

/**
 * Subscriber emotes (subscriptionProducts) and follower emotes
 * (channel.localEmoteSets) are two separate GQL fields; a channel can have
 * both, and follower emotes were missing entirely before this merged them.
 */
async function fetchTwitchIds(): Promise<string[]> {
  const [subJson, followerJson] = await Promise.all([
    gql<{
      data?: {
        user?: { subscriptionProducts?: { emotes?: { id: string }[] }[] };
      };
    }>(
      `{ user(login: "${TWITCH_LOGIN}") { subscriptionProducts { emotes { id } } } }`,
    ),
    gql<{
      data?: {
        user?: {
          channel?: { localEmoteSets?: { emotes?: { id: string }[] }[] };
        };
      };
    }>(
      `{ user(login: "${TWITCH_LOGIN}") { channel { localEmoteSets { emotes { id } } } } }`,
    ),
  ]);
  const subIds = (subJson.data?.user?.subscriptionProducts ?? []).flatMap(
    (p) => p.emotes ?? [],
  );
  const followerIds = (
    followerJson.data?.user?.channel?.localEmoteSets ?? []
  ).flatMap((s) => s.emotes ?? []);
  const ids = [...subIds, ...followerIds].map((e) => e.id);
  if (ids.length === 0) {
    throw new Error("no emotes returned");
  }
  return ids;
}

async function fetchSevenTvIds(): Promise<string[]> {
  const res = await fetch(`https://7tv.io/v3/users/twitch/${TWITCH_USER_ID}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    emote_set?: { emotes?: { id: string }[] };
  };
  const ids = (json.emote_set?.emotes ?? []).slice(0, 40).map((e) => e.id);
  if (ids.length === 0) {
    throw new Error("no emotes returned");
  }
  return ids;
}

async function loadSource(
  result: Emote[],
  manifest: Manifest,
  source: Emote["source"],
  fetchIds: () => Promise<string[]>,
  sourceUrl: (id: string) => string,
): Promise<void> {
  let ids: string[];
  try {
    ids = await fetchIds();
  } catch (err) {
    console.warn(
      `[emotes] ${source} list fetch failed (${(err as Error).message}); falling back to cache.`,
    );
    for (const [key, entry] of Object.entries(manifest)) {
      if (key.startsWith(`${source}-`)) {
        result.push({ source, file: entry.file });
      }
    }
    return;
  }
  const files = await Promise.all(
    ids.map((id) => ensureImage(manifest, source, id, sourceUrl(id))),
  );
  for (const file of files) {
    if (file) {
      result.push({ source, file });
    }
  }
}

let memo: Promise<Emote[]> | null = null;

async function load(): Promise<Emote[]> {
  const manifest = await readManifest();
  const result: Emote[] = [];
  await Promise.all([
    loadSource(result, manifest, "twitch", fetchTwitchIds, (id) =>
      twitchEmoteUrl(id),
    ),
    loadSource(
      result,
      manifest,
      "seventv",
      fetchSevenTvIds,
      (id) => `https://cdn.7tv.app/emote/${id}/2x.webp`,
    ),
  ]);
  await writeManifest(manifest);
  console.log(
    `[emotes] ${result.length} emotes ready (${result.filter((e) => e.source === "twitch").length} Twitch, ${result.filter((e) => e.source === "seventv").length} 7TV).`,
  );
  return result;
}

/**
 * Get Zwackery's self-hosted emote list (metadata + images), memoized for the whole build.
 */
export function getEmotes(): Promise<Emote[]> {
  return (memo ??= load());
}

export function emoteCachePath(file: string): string {
  return join(CACHE_DIR, file);
}
