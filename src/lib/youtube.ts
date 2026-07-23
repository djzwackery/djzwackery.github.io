/**
 * Build-time YouTube feed loader. This runs on the server during
 * `astro build` / `astro dev` (never in the browser), so the API key stays
 * private and the videos are baked straight into the HTML.
 *
 * The live API is the source of truth. On any failure (no key, network error,
 * quota, empty result) it falls back to a local cache in `.cache/` — which CI
 * persists between runs with actions/cache, so a flaky API never blanks the
 * feed. Nothing is committed to the repo.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

export interface Video {
  id: string;
  title: string;
  thumb: string;
  published: string;
}

/** Shape of the fields we read from a YouTube Data API v3 search result item. */
interface YouTubeSearchItem {
  id?: { kind?: string; videoId?: string };
  snippet?: {
    title?: string;
    thumbnails?: { high?: { url?: string } };
    publishedAt?: string;
  };
}

interface YouTubeSearchResponse {
  items?: YouTubeSearchItem[];
  error?: { message?: string };
}

const CACHE_PATH = fileURLToPath(
  new URL("../../.cache/youtube.json", import.meta.url),
);
const API_KEY = import.meta.env.YOUTUBE_API_KEY ?? process.env.YOUTUBE_API_KEY;
const CHANNEL_ID =
  import.meta.env.YOUTUBE_CHANNEL_ID ??
  process.env.YOUTUBE_CHANNEL_ID ??
  "UCLIVVSFSj9kbYUJzGYIjiUg";
const MAX_RESULTS =
  import.meta.env.YOUTUBE_MAX_RESULTS ??
  process.env.YOUTUBE_MAX_RESULTS ??
  "12";

/** Fetch once per build, no matter how many pages ask for the feed. */
let memo: Promise<Video[]> | null = null;

/** Decode the HTML entities the YouTube API returns in titles (e.g. &#39;). */
function decode(s: string): string {
  return s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** Reduce the raw search response to the fields the site actually renders. */
function normalize(json: YouTubeSearchResponse): Video[] {
  return (json.items ?? [])
    .filter((it): it is YouTubeSearchItem & { id: { videoId: string } } =>
      Boolean(it.id?.kind === "youtube#video" && it.id?.videoId),
    )
    .map((it) => ({
      id: it.id.videoId,
      title: decode(it.snippet?.title ?? "Untitled set"),
      thumb:
        it.snippet?.thumbnails?.high?.url ??
        `https://i.ytimg.com/vi/${it.id.videoId}/hqdefault.jpg`,
      published: it.snippet?.publishedAt ?? new Date().toISOString(),
    }));
}

async function readCache(): Promise<Video[] | null> {
  try {
    return JSON.parse(await readFile(CACHE_PATH, "utf8")) as Video[];
  } catch {
    return null;
  }
}

async function writeCache(videos: Video[]): Promise<void> {
  try {
    await mkdir(dirname(CACHE_PATH), { recursive: true });
    await writeFile(CACHE_PATH, JSON.stringify(videos));
  } catch {
    // cache is best-effort; a failure here shouldn't fail the build
  }
}

async function load(): Promise<Video[]> {
  if (!API_KEY) {
    const cached = await readCache();
    console.warn(
      `[youtube] No API key set — ${cached ? "using cached feed" : "feed will be empty"}.`,
    );
    return cached ?? [];
  }

  try {
    const url =
      "https://www.googleapis.com/youtube/v3/search?" +
      new URLSearchParams({
        key: API_KEY,
        channelId: CHANNEL_ID,
        part: "snippet,id",
        order: "date",
        type: "video",
        maxResults: String(MAX_RESULTS),
      });
    const res = await fetch(url);
    const json = (await res.json()) as YouTubeSearchResponse;
    if (!res.ok) throw new Error(json.error?.message ?? `HTTP ${res.status}`);
    const videos = normalize(json);
    if (videos.length === 0) throw new Error("no videos returned");
    await writeCache(videos);
    console.log(`[youtube] Fetched ${videos.length} videos from the API.`);
    return videos;
  } catch (err) {
    const cached = await readCache();
    console.warn(
      `[youtube] Fetch failed (${(err as Error).message}) — ${cached ? "falling back to cache" : "no cache available"}.`,
    );
    return cached ?? [];
  }
}

/** Get the latest videos (memoized for the whole build). */
export function getVideos(): Promise<Video[]> {
  return (memo ??= load());
}
