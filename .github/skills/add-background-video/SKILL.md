---
name: add-background-video
description: Replaces or adds the site's looping ambient background video on djzwackery.com. Use this whenever the user asks to change, swap, update, or add a new background video, background loop, or ambient video behind the page content.
---

## What this is

`src/components/BackgroundVideo.astro` renders a single full-page ambient `<video>` that autoplays,
loops, and sits behind everything with a dark scrim (`.bg-scrim`) over it for legibility. It is
muted and `playsinline` so mobile autoplay is allowed, and `preload="none"` (autoplay still triggers
an immediate fetch regardless of that hint, so file weight is what actually controls load cost, not
the preload attribute).

The video file lives at `public/videos/loop.mp4`, referenced via a `<source>` inside the component.
Its poster (shown before the video can play, and if autoplay is blocked) is
`public/videos/loop-poster.webp`.

## Replacing the background video

1. Start from the source clip and re-encode it, don't just drop the raw export in. This site's loop
   has previously been brought down from ~2MB to ~750KB at 854x480, 24fps with:
   ```
   ffmpeg -i <source> -vf "scale=854:480" -r 24 -an -c:v libx264 -crf 34 -preset slow \
     -pix_fmt yuv420p -movflags +faststart <output>.mp4
   ```
   `-an` strips audio (the tag is muted, so audio is dead weight). `-movflags +faststart` moves the
   moov atom to the front so playback can start before the whole file downloads. Adjust `-crf`
   (lower is higher quality, larger file, this site currently uses 34) and scale to match the new
   clip's content, a busier scene may need a lower CRF to avoid visible banding.
2. Regenerate the poster frame as a `.webp`, not `.jpg`:
   ```
   ffmpeg -i <output>.mp4 -frames:v 1 -f image2 - | cwebp -q 70 -resize 854 480 -o loop-poster.webp -
   ```
   or extract a frame first and run `cwebp -q 70 -resize 854 480 <frame>.png -o loop-poster.webp`.
3. Replace both files in `public/videos/` (same filenames, so no component change is needed, unless
   you're deliberately renaming, in which case update the `src`/`poster` paths in
   `BackgroundVideo.astro` too).
4. Visually verify before committing to a compression level: compare the new encode against the
   original at full brightness AND under the site's actual scrim darkening (the scrim sits at
   roughly 60 to 70% opacity over `--void`), since compression artefacts that are invisible in a
   bright preview can become visible once darkened, or the reverse. See the `optimize-media-assets`
   skill for the darkened-preview technique.

## Verifying

`astro dev --background`, load the page, confirm the video autoplays, loops cleanly at the seam (no
visible jump cut), and that `prefers-reduced-motion` still pauses it (handled already in
`src/scripts/app.ts`, no change needed unless you're touching that logic). Run `npm run check`
afterwards, this only touches static assets so it should already pass.
