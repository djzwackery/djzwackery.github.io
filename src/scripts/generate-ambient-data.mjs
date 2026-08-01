/**
 * Build-time ambient-mode analysis. For each video in the YouTube cache,
 * downloads the lowest available quality with yt-dlp and uses ffmpeg to
 * extract a real audio RMS envelope and a true per-frame average colour, so
 * the site's ambient bloom (see app.ts) reacts to the actual video instead
 * of a guess. Runs via `npm run build` (see package.json), both in CI and
 * locally; skips gracefully if yt-dlp isn't installed. Output lands in
 * `.cache/data`, `public/data`, and `dist/data`, mirroring the same
 * cache/public/dist pattern as the YouTube feed cache in lib/youtube.ts.
 *
 * CI's runner IPs get blocked regardless of cookies, so the primary path is
 * now local: run this from a real machine (see scripts/push-ambient-data.sh),
 * which pushes `.cache/data` as a GitHub release asset for CI to restore.
 */
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const CACHE_DIR = join(process.cwd(), ".cache", "data");
const PUBLIC_DIR = join(process.cwd(), "public", "data");
const DIST_DIR = join(process.cwd(), "dist", "data");

/**
 * Two ways cookies can be in play: a local `youtube-cookies.txt` (manual,
 * for local testing — see the yt-dlp --cookies-from-browser instructions),
 * or CI's "Setup YouTube cookies" step, which wires a secret into yt-dlp's
 * own config rather than a file in this repo, so it's signalled via
 * YOUTUBE_COOKIES_ENABLED instead of a path we could check for. Only the
 * local-file case needs an explicit --cookies flag; the CI case is already
 * applied to every yt-dlp call before this script even runs.
 */
const COOKIES_PATH = join(process.cwd(), "youtube-cookies.txt");
const localCookiesExist = existsSync(COOKIES_PATH);
const hasCookies =
  localCookiesExist || process.env.YOUTUBE_COOKIES_ENABLED === "true";
const cookieArgs = localCookiesExist ? ["--cookies", COOKIES_PATH] : [];

/**
 * Marks the run as having hit an auth wall despite using cookies, so CI can
 * skip pushing the (possibly now-degraded) jar back to the secret — refusing
 * to refresh for a cycle is recoverable, overwriting a good secret with a
 * stale jar it can't recover from on its own is not.
 */
const STALE_MARKER_PATH = join(process.cwd(), ".cache", "cookies-stale");
if (existsSync(STALE_MARKER_PATH)) {
  await fs.rm(STALE_MARKER_PATH);
}
let cookieAuthFailed = false;

/**
 * Forcing a specific player_client (tried android_vr/tv/web in various
 * combinations) consistently 403'd on the actual media fetch, even though
 * format *resolution* succeeded — reproduced locally, so it wasn't CI's IP.
 * Letting yt-dlp fall back to its own default client-selection logic (no
 * --extractor-args at all) is what actually works once cookies are present;
 * it evidently negotiates something our manual override was overriding
 * incorrectly. Only override the client when there's no cookies file, where
 * yt-dlp's default (web-first) selection otherwise gets rejected outright
 * when unauthenticated.
 */
const clientArgs = hasCookies
  ? []
  : ["--extractor-args", "youtube:player_client=android_vr"];

for (const dir of [CACHE_DIR, PUBLIC_DIR, DIST_DIR]) {
  if (!existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }
}

const CACHE_PATH = join(process.cwd(), ".cache", "youtube.json");
if (!existsSync(CACHE_PATH)) {
  console.error("YouTube cache not found. Run a build first to fetch videos.");
  process.exit(1);
}

const videos = JSON.parse(await fs.readFile(CACHE_PATH, "utf8"));

/**
 * Keeps .cache/data (and its public/dist mirrors) bounded to just the
 * current feed, so pushing it (see scripts/push-ambient-data.sh) never
 * grows unbounded as older videos fall out of the top MAX_RESULTS.
 */
const currentIds = new Set(videos.map((v) => v.id));
for (const dir of [CACHE_DIR, PUBLIC_DIR, DIST_DIR]) {
  for (const file of await fs.readdir(dir)) {
    if (file.endsWith(".json") && !currentIds.has(file.slice(0, -5))) {
      await fs.unlink(join(dir, file));
      console.log(`[trim] Removed stale ambient data: ${file}`);
    }
  }
}

try {
  execFileSync("yt-dlp", ["--version"], { stdio: "ignore" });
} catch {
  console.warn(
    "⚠️  yt-dlp not found in PATH. Skipping ambient-mode data generation.",
  );
  console.warn(
    "   (Install it locally to generate this data in dev, e.g. 'brew install yt-dlp')",
  );
  process.exit(0);
}

const PEAKS_PER_SEC = 5;
const COLORS_PER_SEC = 2;
const AUDIO_SAMPLE_RATE = 11025;
/**
 * Samples per frame (COLOR_GRID_SIZE²) for {@link dominantColor}, not a visible resolution.
 */
const COLOR_GRID_SIZE = 8;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A burst of back-to-back requests from the same IP (exactly what a loop
 * over every video looks like) is itself part of what gets flagged. A few
 * seconds of jitter between videos, on top of yt-dlp's own --sleep-requests
 * below, makes the traffic look less like scraping.
 */
const BETWEEN_VIDEOS_MIN_MS = 4000;
const BETWEEN_VIDEOS_JITTER_MS = 5000;

/**
 * Standard RGB→HSL conversion. h/s/l are all returned in the 0–1 range (not
 * degrees/percent), since that's what {@link hslToHex} and the clamping in
 * {@link neonize} expect.
 */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return { h: 0, s: 0, l };
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    default:
      h = (r - g) / d + 4;
  }
  return { h: h / 6, s, l };
}

/**
 * Inverse of {@link rgbToHsl}: takes 0–1 h/s/l and returns a "#rrggbb" hex string.
 */
function hslToHex(h, s, l) {
  const hue2rgb = (p, q, t) => {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  };
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (v) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Club footage averages to muddy greys/browns, which would make the ambient
 * rig look washed out rather than dayglo. Push real hues toward the site's
 * saturated palette; leave true greys/blacks/whites alone so fades don't
 * flash an arbitrary colour (hue is meaningless at s=0).
 */
function neonize(r, g, b) {
  const { h, s, l } = rgbToHsl(r, g, b);
  const boostedS = s < 0.03 ? s : Math.max(s, 0.75);
  const clampedL = Math.min(Math.max(l, 0.32), 0.68);
  return hslToHex(h, boostedS, clampedL);
}

/**
 * Saturation-weighted average across a frame's sampled pixels (a small grid,
 * not just one), so a vivid stage light or LED wall pulls the result toward
 * itself instead of being diluted by muted/grey regions (black gear, walls,
 * skin) the way a flat average would. The `+ 0.02` weight floor keeps a
 * genuinely colourless frame from dividing by ~0 — it just falls back to a
 * plain average, which is already grey anyway.
 */
function dominantColor(samples) {
  let sumWeight = 0;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  for (const [r, g, b] of samples) {
    const { s } = rgbToHsl(r, g, b);
    const weight = s * s + 0.02;
    sumWeight += weight;
    sumR += r * weight;
    sumG += g * weight;
    sumB += b * weight;
  }
  return [sumR / sumWeight, sumG / sumWeight, sumB / sumWeight];
}

let isFirstDownload = true;

for (const video of videos) {
  const videoId = video.id;
  const cachePath = join(CACHE_DIR, `${videoId}.json`);
  const publicPath = join(PUBLIC_DIR, `${videoId}.json`);
  const distPath = join(DIST_DIR, `${videoId}.json`);

  if (existsSync(cachePath)) {
    console.log(`[skip] Ambient data for ${videoId} already cached.`);
    await fs.copyFile(cachePath, publicPath);
    await fs.copyFile(cachePath, distPath);
    continue;
  }

  if (!isFirstDownload) {
    const delay =
      BETWEEN_VIDEOS_MIN_MS + Math.random() * BETWEEN_VIDEOS_JITTER_MS;
    console.log(
      `[process] Waiting ${(delay / 1000).toFixed(1)}s before the next download...`,
    );
    await sleep(delay);
  }
  isFirstDownload = false;

  console.log(`[process] Downloading ${videoId} for ambient-mode analysis...`);
  const videoPath = join(process.cwd(), `temp_${videoId}.mp4`);
  const wavPath = join(process.cwd(), `temp_${videoId}.wav`);
  const rawPath = join(process.cwd(), `temp_${videoId}.rgb`);

  try {
    // We only need the audio envelope and an average-colour-per-frame, not
    // anything watchable, so ask for the lowest video+audio tracks directly
    // (144p + the smallest audio track) rather than "worst", which picks the
    // smallest *muxed* format — usually 360p, several times the size.
    execFileSync(
      "yt-dlp",
      [
        "-f",
        "bestvideo[height<=144]+worstaudio/worst[height<=240]/worst",
        ...clientArgs,
        ...cookieArgs,
        "-o",
        videoPath,
        "--merge-output-format",
        "mp4",
        `https://www.youtube.com/watch?v=${videoId}`,
      ],
      { stdio: "inherit" },
    );

    console.log(`[process] Extracting audio envelope for ${videoId}...`);
    execFileSync(
      "ffmpeg",
      [
        "-y",
        "-i",
        videoPath,
        "-ar",
        String(AUDIO_SAMPLE_RATE),
        "-ac",
        "1",
        "-f",
        "wav",
        wavPath,
      ],
      { stdio: "inherit" },
    );

    console.log(`[process] Sampling colour for ${videoId}...`);
    // scale=N:N:flags=area area-averages each frame down to an NxN grid
    // (each cell itself an average of the source pixels it covers) instead
    // of flattening the whole frame to one pixel — {@link dominantColor}
    // needs several samples per frame to tell a vivid region from a muted
    // one, which a single flat average can't do.
    execFileSync(
      "ffmpeg",
      [
        "-y",
        "-i",
        videoPath,
        "-vf",
        `fps=${COLORS_PER_SEC},scale=${COLOR_GRID_SIZE}:${COLOR_GRID_SIZE}:flags=area`,
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        rawPath,
      ],
      { stdio: "inherit" },
    );

    const wavBuffer = await fs.readFile(wavPath);
    const dataOffset = 44; // standard PCM WAV header
    const samples = new Int16Array(
      wavBuffer.buffer,
      wavBuffer.byteOffset + dataOffset,
      (wavBuffer.length - dataOffset) / 2,
    );
    const chunkSize = Math.floor(AUDIO_SAMPLE_RATE / PEAKS_PER_SEC);
    const numChunks = Math.floor(samples.length / chunkSize);

    const peaks = [];
    let maxRms = 0;
    for (let i = 0; i < numChunks; i++) {
      let sumSquares = 0;
      for (let j = 0; j < chunkSize; j++) {
        const val = samples[i * chunkSize + j];
        sumSquares += val * val;
      }
      const rms = Math.sqrt(sumSquares / chunkSize);
      peaks.push(rms);
      if (rms > maxRms) {
        maxRms = rms;
      }
    }
    const normalizedPeaks = peaks.map((p) =>
      Number((p / (maxRms || 1)).toFixed(3)),
    );

    const rawBuffer = await fs.readFile(rawPath);
    const pixelsPerFrame = COLOR_GRID_SIZE * COLOR_GRID_SIZE;
    const bytesPerFrame = pixelsPerFrame * 3;
    const colors = [];
    for (
      let offset = 0;
      offset + bytesPerFrame <= rawBuffer.length;
      offset += bytesPerFrame
    ) {
      const samples = [];
      for (let i = 0; i < bytesPerFrame; i += 3) {
        samples.push([
          rawBuffer[offset + i],
          rawBuffer[offset + i + 1],
          rawBuffer[offset + i + 2],
        ]);
      }
      const [r, g, b] = dominantColor(samples);
      colors.push(neonize(r, g, b));
    }

    const payload = JSON.stringify({
      peaks: normalizedPeaks,
      colors,
      peaksPerSec: PEAKS_PER_SEC,
      colorsPerSec: COLORS_PER_SEC,
    });

    await fs.writeFile(cachePath, payload);
    await fs.writeFile(publicPath, payload);
    await fs.writeFile(distPath, payload);
    console.log(`[process] Saved ambient data for ${videoId}.`);
  } catch (err) {
    console.error(`[error] Failed to process ${videoId}:`, err.message);
    if (localCookiesExist) {
      cookieAuthFailed = true;
    }
  } finally {
    for (const p of [videoPath, wavPath, rawPath]) {
      if (existsSync(p)) {
        await fs.unlink(p);
      }
    }
  }
}

/**
 * When every video is already cached, the loop above never calls yt-dlp, so
 * a local cookie jar never gets exercised between runs. A metadata-only
 * request keeps the session alive for the next local run too.
 */
if (isFirstDownload && localCookiesExist && videos.length > 0) {
  const touchVideoId = videos[0].id;
  console.log(
    `[cookies] Nothing to download; touching YouTube with ${touchVideoId} to keep cookies exercised...`,
  );
  try {
    execFileSync(
      "yt-dlp",
      [
        "--skip-download",
        ...clientArgs,
        ...cookieArgs,
        `https://www.youtube.com/watch?v=${touchVideoId}`,
      ],
      { stdio: "inherit" },
    );
  } catch (err) {
    console.warn("[cookies] Cookie touch request failed:", err.message);
    cookieAuthFailed = true;
  }
}

if (cookieAuthFailed) {
  await fs.writeFile(STALE_MARKER_PATH, "1");
}
