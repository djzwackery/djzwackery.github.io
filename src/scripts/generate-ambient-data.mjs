/**
 * Build-time ambient-mode analysis. For each video in the YouTube cache,
 * downloads the lowest available quality with yt-dlp and uses ffmpeg to
 * extract a real audio RMS envelope and a true per-frame average colour, so
 * the site's ambient bloom (see app.ts) reacts to the actual video instead
 * of a guess. Runs via `npm run build` (see package.json), both in CI and
 * locally; skips gracefully if yt-dlp isn't installed. Output lands in
 * `.cache/data`, `public/data`, and `dist/data`, mirroring the same
 * cache/public/dist pattern as the YouTube feed cache in lib/youtube.ts.
 */
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const CACHE_DIR = join(process.cwd(), ".cache", "data");
const PUBLIC_DIR = join(process.cwd(), "public", "data");
const DIST_DIR = join(process.cwd(), "dist", "data");

/**
 * Written by the "Write YouTube cookies" CI step from a YOUTUBE_COOKIES
 * secret, when set; absent locally and on builds without the secret, in
 * which case yt-dlp just runs unauthenticated as before.
 */
const COOKIES_PATH = join(process.cwd(), "youtube-cookies.txt");
const hasCookies = existsSync(COOKIES_PATH);
const cookieArgs = hasCookies ? ["--cookies", COOKIES_PATH] : [];

/**
 * Per https://github.com/yt-dlp/yt-dlp/wiki/PO-Token-Guide's client table:
 * "web" requires a PO token for the actual streaming request, which we don't
 * have (that's the "only images are available" failure) — "tv" is the one
 * client that both skips the PO-token requirement and gets real (non-DRM)
 * formats once cookies are present. It's used alone, not mixed with "web",
 * since mixing clients can resolve video/audio through different ones and
 * 403 on whichever half came from a PO-token-requiring client. Without
 * cookies, "android_vr" is the equivalent PO-token-free option, but it
 * doesn't support cookies at all, hence the two separate branches.
 */
const clientArgs = hasCookies
  ? ["--extractor-args", "youtube:player_client=tv"]
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A burst of back-to-back requests from the same IP (exactly what a loop
 * over every video looks like) is itself part of what trips YouTube's bot
 * check on CI's shared runner IPs. A few seconds of jitter between videos,
 * on top of yt-dlp's own --sleep-requests below, makes the traffic look less
 * like scraping.
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
    // scale=1:1:flags=area averages each frame's pixels down to one sample,
    // rather than just picking/interpolating a corner pixel.
    execFileSync(
      "ffmpeg",
      [
        "-y",
        "-i",
        videoPath,
        "-vf",
        `fps=${COLORS_PER_SEC},scale=1:1:flags=area`,
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
    const colors = [];
    for (let i = 0; i + 2 < rawBuffer.length; i += 3) {
      colors.push(neonize(rawBuffer[i], rawBuffer[i + 1], rawBuffer[i + 2]));
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
  } finally {
    for (const p of [videoPath, wavPath, rawPath]) {
      if (existsSync(p)) {
        await fs.unlink(p);
      }
    }
  }
}
