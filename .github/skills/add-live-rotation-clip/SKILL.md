---
name: add-live-rotation-clip
description: Adds a new ambient review clip to the live-only video rotation easter egg on djzwackery.com. Use this whenever the user asks to add a clip, review video, or ambient video that plays while the stream is live, or mentions the live video rotation, live clips, or the review clip pool.
---

## What this easter egg is

While the Twitch stream is live, `liveClips` (in `src/scripts/app.ts`, the IIFE with the comment
starting "Easter egg: while live, occasionally shows one of a pool of review clips") picks a random
clip from its pool every 15 seconds and plays it as a full-screen ambient wash (the same treatment
as the Dutch meme and the footer logo clip), sped up 1.5x to match the background video's own live
playback rate. It never repeats the same clip twice in a row. `liveClips.start()`/`.stop()` are
wired to the live/offline transition in `setLive()`, not to any user interaction, this is the one
easter egg on the site that's entirely state-driven rather than click/hover-driven.

## Adding a new clip

1. Compress the source clip following the `optimize-media-assets` skill's video pipeline (`ffmpeg`,
   `-an` if there's no audio content worth keeping, `-movflags +faststart`). Existing clips in
   `public/videos/` (`food-review-club.mp4`, `greg-review.mp4`, `aussie-review.mp4`,
   `bounce-by-the-ounce.mp4`) are a useful size/quality reference.
2. Drop the file in `public/videos/`.
3. Add its path to the `POOL` array inside the `liveClips` IIFE in `src/scripts/app.ts`.

That's it, no other array needs updating for this one.

## Don't prewarm these on hover

Unlike the MLG mascot, party, and footer-logo easter eggs, do not add these clips to any
`prewarmOnIntent(...)` call. There's no hover/touch trigger to hang a prewarm off, the pool is only
ever played while the stream is actually live, and prewarming every clip in the pool for every
visitor regardless of live status would load real bytes for the vast majority of visitors who never
see it fire. If prefetching ever becomes worth doing here, it should be gated on `setLive(true)`
actually firing, not on page load or hover.

## Verifying

There's no way to force "live" state locally without either being live on Twitch or stubbing
`checkTwitchLive()`. Fastest check: temporarily call `setLive(true)` from the browser console after
`astro dev --background`, confirm the new clip appears in the rotation within a few 15s cycles and
plays at the same 1.5x rate as the rest of the pool, then reload to clear the stubbed state. Run
`npm run check` for the code change itself.
