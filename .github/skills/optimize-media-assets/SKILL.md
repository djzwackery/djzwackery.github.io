---
name: optimize-media-assets
description: Optimises images and video for djzwackery.com so they don't hurt Core Web Vitals or PageSpeed Insights scores. Use this whenever the user asks to compress, optimise, shrink, or speed up an image or video asset, or mentions LCP, Core Web Vitals, or PageSpeed findings about image or video delivery.
---

## Two asset paths on this site

- **Photos used in Astro components** (e.g. the hero fan photos in `src/assets/`): go through
  Astro's `<Picture>` component (`astro:assets`), which handles resizing, format conversion, and
  quality at build time. Don't hand-compress these yourself, tune the `<Picture>` props instead.
- **Everything in `public/`** (background video, MLG mascot sounds/gifs, posters): served as-is, no
  build-time processing. These need to be compressed by hand before they're added.

## Tuning an existing `<Picture>` (e.g. `src/components/Hero.astro`)

Relevant props and what they actually do:

- `widths`: the responsive breakpoints generated. Don't include a width larger than the source
  image's native resolution divided by the smallest `object-fit: cover` crop it'll ever be shown at,
  it just produces an upscaled, wasted variant.
- `sizes`: must match the actual rendered width at each breakpoint (check with devtools, not by
  guessing), otherwise the browser picks the wrong `srcset` candidate and either wastes bytes or
  under-resources the image.
- `quality`: this site currently runs hero photos at `62`, verified visually against the original at
  `75` with no visible artefacts even on a demanding texture (flame detail). Don't drop quality
  without a side-by-side comparison first, see **Verifying visually** below.
- `loading` / `fetchpriority`: any image that's a real Largest Contentful Paint (LCP) candidate
  needs `loading="eager"` and `fetchpriority="high"`. Note `loading="lazy"` does not reliably defer
  an in-viewport image on this site's layouts, but it does still cost you the `fetchpriority` hint
  if left unset, so an ambiguous LCP candidate should get the eager/high treatment rather than being
  left lazy "just in case".
- If several elements could plausibly be the LCP element (e.g. overlapping cards in a shuffling
  deck), mark all of them `fetchpriority="high"` rather than guessing one. LCP element selection can
  differ between a local preview and the live site for identically-sized overlapping elements.

## Compressing a video for `public/`

```
ffmpeg -i <source> -vf "scale=<W>:<H>" -r <fps> -an -c:v libx264 -crf <N> -preset slow \
  -pix_fmt yuv420p -movflags +faststart <output>.mp4
```

- `-an` if the tag is muted (background/ambient video), audio is dead weight.
- `-movflags +faststart` always, lets playback start before the full file downloads.
- Don't guess resolution/CRF, start from the container's actual rendered size (not the source
  export's native size) and iterate: encode, compare file size, then verify visually (below) before
  committing.
- `autoplay` on a `<video>` fetches immediately regardless of `preload="none"`, don't rely on the
  `preload` attribute to defer load cost. Only re-encoding the file itself reduces load cost.

## Compressing an image for `public/`

```
cwebp -q <quality> -resize <W> <H> <source> -o <output>.webp
```

Use `.webp`, not `.jpg`/`.png`, for anything in `public/` that doesn't go through `<Picture>`.

## Verifying visually before committing to a compression level

Byte count alone is not sufficient. This site's dark scrim overlay
(`.bg-scrim`, roughly 60 to 70% opacity over `--void`) hides some artefacts and reveals others, so
compare under both conditions, not just full brightness:

```python
from PIL import Image, ImageEnhance
img = Image.open("candidate.webp")
darkened = ImageEnhance.Brightness(img).enhance(0.35)  # rough approximation of the scrim
```

Put the original and the candidate (both full-brightness and darkened) side by side before deciding
a compression level is acceptable. This has previously caught a case where a "smaller" re-encode was
actually hiding a quality deficit (client-side upscale/blur from under-resourcing one dimension), so
a smaller file is not automatically a better one, confirm it visually.

## After changing any asset

Run `npm run check` (format, lint, typecheck). For anything affecting the hero or another likely LCP
element, use the `chrome-devtools-mcp` performance trace tools (`performance_start_trace` +
`performance_analyze_insight`, insight names `LCPBreakdown`, `LCPDiscovery`, `RenderBlocking`) to
confirm the change actually helped, rather than assuming it did from the file size drop alone.
