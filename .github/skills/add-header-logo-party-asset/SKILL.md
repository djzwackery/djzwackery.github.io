---
name: add-header-logo-party-asset
description: Adds or changes a kick sound, break sound, or confetti colour in the header logo click easter egg on djzwackery.com. Use this whenever the user asks to add a party sound, change the confetti colours, adjust the breakbeat, or otherwise touch the hero wordmark click/Konami code easter egg.
---

## What this easter egg is

Clicking the hero wordmark logo (`[data-party]` on the `h1.hero__wordmark` in `Hero.astro`), or
entering the Konami code, fires `fireParty()` in `src/scripts/app.ts`. Each click plays one sample
from a fixed kick roll, speeds up or slows down to match how fast the visitor is actually clicking,
and spawns a burst of confetti particles (some of which are Twitch/7TV emotes instead of plain
dots). After enough clicks without a break, the next hit is a full breakbeat loop instead of a kick.

## Where the pieces live

All in `src/scripts/app.ts`, near the top:

- `partyKicks`: array of short one-beat kick samples, cycled in order (not random), each exactly one
  beat at 170bpm (`NATIVE_BPM`). Files live in `public/party/`.
- `partyBreaks`: array of longer breakbeat loops, one picked at random (never the same one twice in
  a row) once `BREAK_EVERY` clicks have passed since the last break. Also in `public/party/`.
- `confettiColors`: an array of CSS custom property references (`var(--magenta)`, `var(--acid)`,
  etc.), not raw colour values. Confetti always draws from this list.

## Adding a new kick sample

1. The sample must be exactly one beat at 170bpm (match the tempo of the existing kicks in
   `public/party/kick-*.mp3`), otherwise the playback-rate scaling that tracks click speed will make
   it sound off-beat against the others in the roll.
2. Drop it in `public/party/`, add its path to `partyKicks` in `src/scripts/app.ts`.
3. Add the same path to `prewarmOnIntent("[data-party]", [...])` near the bottom of the file, so it's
   cached before the first click rather than fetched cold.

## Adding a new break

1. Drop the file in `public/party/`, add its path to `partyBreaks`.
2. Add it to the same `prewarmOnIntent("[data-party]", [...])` list.
3. No tempo constraint here (unlike kicks), breaks play at a fixed rate, not scaled to click speed.

## Adding or changing a confetti colour

Add a `var(--token-name)` entry to `confettiColors`, referencing an existing colour token from
`src/styles/global.css` `:root` (see `DESIGN.md`'s Colors section for the full palette and what each
token is for). Don't add a raw hex or `oklch()` literal here, every confetti colour should trace
back to a real design token so a future palette change updates this automatically.

## Tuning the feel (not asset changes, but the same feature)

- `BREAK_EVERY` (clicks since last break before another can fire) and `MAX_PARTY_BITS` (concurrent
  particle cap, kept modest since each is its own composited layer and Safari/iOS chokes well before 260) are the two constants most likely to need adjusting if a new asset changes the pacing.
- `MIN_PARTY_RATE`/`MAX_PARTY_RATE`/`MAX_BPM` govern how far the click-speed-tracking playback rate
  can stretch. Only touch these if a new kick sample's native tempo differs from 170bpm, in which
  case `NATIVE_BPM` needs updating too, not just the new file.

## Verifying

`npm run check`, then `astro dev --background` and click the wordmark repeatedly (and slowly, to
check the neutral 1x tempo still sounds right) to confirm the new asset fires and the tempo tracking
still feels natural at both extremes.
