---
name: add-mlg-easter-egg-asset
description: Adds a new sound effect or reaction gif to the MLG mascot easter egg on djzwackery.com. Use this whenever the user asks to add a new MLG sound, MLG gif, mascot sound effect, or reaction image to the About section mascot combo system.
---

## What this easter egg is

Clicking the MLG mascot (`[data-mascot]` in the About section) builds a combo. As the combo climbs
through tiers 1 to 5 it plays short stinger sound effects, occasionally flashes a reaction gif near
the click point, and past tier 3 layers in one long "chaos track" for the episode. Everything is
driven by `src/scripts/app.ts`, in the IIFE with the comment starting "MLG mascot easter egg".

## Where assets live

All mascot assets are flat files in `public/mlg/`, referenced by absolute path (`/mlg/name.ext`):

- Short stingers and reaction sounds: `.mp3`, roughly 1 to 5 seconds.
- Long chaos tracks: `.mp3`, roughly 11 to 17 seconds, only one plays per tier-3+ episode.
- Reaction gifs: `.webp` (not `.gif`), used as `<img>` overlays, not `<video>`.

Naming is kebab-case matching the meme/clip it's from (`sanic-the-hegehog.mp3`,
`rainbow-frog.webp`). Keep new files consistent with that.

## Steps to add a new sound effect

1. Drop the file in `public/mlg/`, kebab-case name, `.mp3`.
2. Add its path to the `stingerSfx` array (short stinger) or `chaosTracks` array (long track) in
   `src/scripts/app.ts`, inside the MLG mascot IIFE.
3. Add the same path to the `prewarmOnIntent("[data-mascot]", [...])` array near the bottom of the
   file, this is what warms the asset in the browser cache the moment the user hovers or touches the
   mascot, before they've clicked. Missing this step means the first playback on click will be
   slower than the rest.

## Steps to add a new reaction gif

1. Convert the source to `.webp` (see the `optimize-media-assets` skill for the exact `cwebp`
   invocation used elsewhere on this site) and drop it in `public/mlg/`.
2. Add its path to the `gifPool` array in `src/scripts/app.ts`.
3. Add the same path to the `prewarmOnIntent("[data-mascot]", [...])` array, same reasoning as above.

## Verifying

`npm run check` (format, lint, typecheck) after editing `app.ts`. There's no runtime test for combo
tiers; the fastest manual check is `astro dev --background`, open the About section, and click the
mascot rapidly, watch for the new sound or gif firing at a normal-feeling rate compared to the
existing pool (a pool of N items should each show up roughly 1/N of the time, so don't expect the
new one on the first few clicks).

Respect the two array-membership rules above every time; forgetting the prewarm array is the most
common miss since the feature still works without it, it's just not prefetched.
