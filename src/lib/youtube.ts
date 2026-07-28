/**
 * Build-time YouTube feed loader. This runs on the server during
 * `astro build` / `astro dev` (never in the browser), so the API key stays
 * private and the videos are baked straight into the HTML.
 *
 * The live API is the source of truth. On any failure (no key, network error,
 * quota, empty result) it falls back to a local cache in `.cache/`, which CI
 * persists between runs with actions/cache, so a flaky API never blanks the
 * feed. Nothing is committed to the repo.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

export interface Video {
  id: string;
  title: string;
  thumb: string;
  published: string;
  /**
   * 0 if the statistics lookup failed or the video hides its view count.
   */
  viewCount: number;
  /**
   * ISO-8601 (e.g. "PT4M13S"). Empty if the details lookup failed.
   */
  duration: string;
  /**
   * YouTube's own description text, only used for JSON-LD, not rendered.
   */
  description: string;
}

/**
 * Shape of the fields we read from a YouTube Data API v3 search result item.
 */
interface YouTubeSearchItem {
  id?: { kind?: string; videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: { high?: { url?: string } };
    publishedAt?: string;
  };
}

interface YouTubeSearchResponse {
  items?: YouTubeSearchItem[];
  error?: { message?: string };
}

interface YouTubeVideosResponse {
  items?: {
    id?: string;
    statistics?: { viewCount?: string };
    contentDetails?: { duration?: string };
  }[];
}

/**
 * Resolved from process.cwd(), not import.meta.url, see emotes.ts for why.
 */
const CACHE_PATH = join(process.cwd(), ".cache", "youtube.json");
const API_KEY = import.meta.env.YOUTUBE_API_KEY ?? process.env.YOUTUBE_API_KEY;
const CHANNEL_ID =
  import.meta.env.YOUTUBE_CHANNEL_ID ??
  process.env.YOUTUBE_CHANNEL_ID ??
  "UCLIVVSFSj9kbYUJzGYIjiUg";
const MAX_RESULTS =
  import.meta.env.YOUTUBE_MAX_RESULTS ??
  process.env.YOUTUBE_MAX_RESULTS ??
  "12";

/**
 * Fetch once per build, no matter how many pages ask for the feed.
 */
let memo: Promise<Video[]> | null = null;

/**
 * Decode the HTML entities the YouTube API returns in titles (e.g. &#39;).
 */
function decode(s: string): string {
  return s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Reduce the raw search response to the fields the site actually renders.
 */
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
      viewCount: 0,
      duration: "",
      description: decode(it.snippet?.description ?? ""),
    }));
}

interface VideoDetails {
  viewCount: number;
  duration: string;
}

/**
 * `search.list` doesn't return statistics or contentDetails, so view counts
 * and duration need a follow-up `videos.list` call. Best-effort: a failure
 * here just means cards render without a view count/duration, not a failed
 * build.
 */
async function fetchVideoDetails(
  ids: string[],
): Promise<Map<string, VideoDetails>> {
  const details = new Map<string, VideoDetails>();
  if (ids.length === 0) {
    return details;
  }
  try {
    const url =
      "https://www.googleapis.com/youtube/v3/videos?" +
      new URLSearchParams({
        key: API_KEY!,
        part: "statistics,contentDetails",
        id: ids.join(","),
      });
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = (await res.json()) as YouTubeVideosResponse;
    for (const item of json.items ?? []) {
      if (!item.id) {
        continue;
      }
      details.set(item.id, {
        viewCount: Number(item.statistics?.viewCount ?? 0),
        duration: item.contentDetails?.duration ?? "",
      });
    }
  } catch (err) {
    console.warn(
      `[youtube] Failed to fetch video details (${(err as Error).message}) — showing videos without view counts/duration.`,
    );
  }
  return details;
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
    if (!res.ok) {
      throw new Error(json.error?.message ?? `HTTP ${res.status}`);
    }
    const videos = normalize(json);
    if (videos.length === 0) {
      throw new Error("no videos returned");
    }
    const details = await fetchVideoDetails(videos.map((v) => v.id));
    for (const v of videos) {
      const d = details.get(v.id);
      v.viewCount = d?.viewCount ?? 0;
      v.duration = d?.duration ?? "";
    }
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

/**
 * Newest first, matching the channel's own "Date added (newest)" view. The
 * API's `order=date` param and the on-disk cache are both trusted to already
 * be in this order, which isn't guaranteed, so it's re-sorted explicitly
 * here rather than assumed.
 */
function sortByPublishedDesc(videos: Video[]): Video[] {
  return [...videos].sort(
    (a, b) => Date.parse(b.published) - Date.parse(a.published),
  );
}

/**
 * Get the latest videos (memoized for the whole build).
 */
export function getVideos(): Promise<Video[]> {
  return (memo ??= load().then(sortByPublishedDesc));
}
