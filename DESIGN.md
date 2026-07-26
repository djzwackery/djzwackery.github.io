---
version: "alpha"
name: "DJ Zwackery: dayglo rave on club-black"
description: >
  Single-page site for a hardcore DJ streaming on Twitch. Loud, tactile,
  a little irreverent, flyers-and-stickers energy, not a corporate press kit.
colors:
  void: "#0a0410"
  void-2: "#170a24"
  void-3: "#241038"
  magenta: "#ff1f8f"
  magenta-contrast: "#e40074"
  acid: "#c6ff00"
  cyan: "#00e5ff"
  sun: "#ffe600"
  white: "#ffffff"
  ink-dim: "#b9a9cf"
typography:
  heading:
    fontFamily: Bungee
    fontSize: 1.9rem
    fontWeight: 400
    lineHeight: 1.05
  lead:
    fontFamily: Space Grotesk
    fontSize: 1.2rem
    fontWeight: 400
    lineHeight: 1.6
  item:
    fontFamily: Space Grotesk
    fontSize: 1.15rem
    fontWeight: 700
    lineHeight: 1.6
  body:
    fontFamily: Space Grotesk
    fontSize: 1.05rem
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: Space Grotesk
    fontSize: 0.9rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.6
    letterSpacing: 0.12em
rounded:
  none: 0px
spacing:
  xs: 0.5rem
  sm: 0.85rem
  md: 1.25rem
  lg: 2rem
  xl: 3rem
components:
  button:
    backgroundColor: "{colors.white}"
    textColor: "{colors.void}"
    typography: "{typography.small}"
    rounded: "{rounded.none}"
    padding: "0.8rem 1.3rem"
  button-magenta:
    backgroundColor: "{colors.magenta-contrast}"
    textColor: "{colors.white}"
  social-chip:
    rounded: "{rounded.none}"
    size: 72px
  gig-date-badge:
    backgroundColor: "{colors.magenta-contrast}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
---

# Design system: djzwackery.com

This documents the design decisions already built into the site, so future work (by a human or an
agent) can extend it consistently instead of re-deriving or drifting from it. It describes what's
actually implemented in `src/styles/global.css` and the component files. Treat this as a map to
the code, not a spec that precedes it. If the two disagree, the code is right; update this file.

Tokens above follow the [DESIGN.md specification](https://stitch.withgoogle.com/docs/design-md/specification)
(sRGB hex, since that's the token color format the spec defines). The live site actually renders
colors in OKLCH, see **Colors** below for why, and treat the hex values here as the sRGB-safe
reference, not the literal source of truth in code.

## Overview

DJ Zwackery: a hardcore DJ from Melbourne, Australia, streaming live on Twitch and posting sets to
YouTube weekly. The site's one job is to convert a casual visitor (from a stream, a social link, or
search) into a follow, a YouTube sub, a gig ticket, or a booking enquiry, and to feel like the same
energy as the stream itself.

Voice: Australian English (`-ise`, `-our`, `-re`, double-L, see `CLAUDE.md`), casual and a little
cheeky ("Pro DJ, pro lad," not "award-winning entertainment professional"). Copy describes what a
visitor gets, not what the brand is. Section headings are direct statements ("Who's Zwackery?",
"Catch him in the flesh"), never "About Us" / "Our Services." Brand/genre proper nouns (DJ Zwackery,
House of Fun, Happy Hardcore, UK Hardcore) are never translated across the site's 6 locales
(`en`, `ja`, `de`, `nl`, `fr`, `it`); everything else is.

## Colors

All colours are defined in **OKLCH** in `src/styles/global.css` `:root`, not hex. This keeps the
palette perceptually consistent and lets wide-gamut (P3) displays render the neon accents more
vividly than sRGB allows, while degrading gracefully on standard displays. The four accent colours
(`magenta`, `acid`, `cyan`, `sun`) are deliberately pushed ~8% past the sRGB gamut boundary for that
reason; the hex values in the token table above are the closest sRGB-safe approximation, for tools
that need a plain hex.

- **Void** (`#0a0410`): page background, the "club-black" base.
- **Void-2 / Void-3**: progressively lifted panel backgrounds (marquee, cards).
- **Magenta** (`#ff1f8f`): primary accent, headline highlights, borders, decorative shadows. Reads
  _against_ `void`.
- **Magenta-contrast** (`#e40074`): same hue, darkened until white text/icons sitting _on_ it clear
  WCAG AA 4.5:1. Used only for button/badge/toast backgrounds. **Do not merge these two tokens.**
  `magenta` is tuned for contrast against `void`; `magenta-contrast` is tuned for contrast _under_
  white text. Collapsing them back into one value re-breaks one case to fix the other.
- **Acid** (`#c6ff00`): secondary accent, the live-state colour, focus rings.
- **Cyan** (`#00e5ff`): tertiary accent, links, alternating chip colour.
- **Sun** (`#ffe600`): marquee text, warm accent.
- **Ink-dim** (`#b9a9cf`): secondary/muted text.

Never hardcode a new `rgba()`/translucent colour. Use `color-mix(in oklch, var(--token) N%,
transparent)` against one of the tokens above, so every tint traces back to the same source colour
instead of drifting.

## Typography

- **Display** (Bungee, one weight only, 400): section "screamers" and the logo wordmark. Never
  body copy; it doesn't have the weight range for it.
- **Body/label** (Space Grotesk, 400/500/700): everything else, including the uppercase "label" role
  (eyebrows, tags, nav, dates). One body face doing double duty as the technical/label face keeps
  the type system to two families total.
- One type scale for the whole site, each size tagged with its _role_ (`label`, `small`, `body`,
  `item`, `lead`, `heading`, see the `typography` tokens above) rather than a raw size. New
  components reuse a role, they don't invent a new one. `heading` and `lead` are fluid in the actual
  CSS (`clamp()` between the token value shown and a larger max on wide viewports); the token above
  is the floor.
- Both fonts are self-hosted via `@fontsource`: no render-blocking third-party font request.

## Layout

- Single global max-width (`--wrap: 1180px`, `min(100% - 2.5rem, var(--wrap))`): one content column
  for the whole site, no per-section overrides.
- Sections follow one rhythm: heading + underline rule, then content. No numbered steps anywhere.
  Nothing on this site is a sequence that benefits from 01/02/03 markers, so none are used.
- Logical CSS properties only (`margin-inline`, `inset-block-start`, `border-inline-start`,
  `text-align: start`, etc.). The whole stylesheet is RTL-ready without a rewrite. The one accepted
  exception is physical `left: 50%` + `translateX(-50%)` centering, which has no logical equivalent.

## Elevation & Depth

Depth is expressed through **hard, flat offset shadows** (`--shadow-hard: 6px 6px 0 var(--void)`):
never blur, never a soft `box-shadow`. It's a sticker/flyer material, not a floating card: buttons,
badges, and the hero photo stack all cast the same flat, sharp-edged shadow. Interactive elements
add physical feedback on top of that: buttons lift on hover (`translate(-2px,-2px)` + a bigger
shadow) and press down on `:active` (`translate(3px,3px)` + a smaller shadow). Every clickable
thing behaves like a physical button being pressed, not a flat colour change.

## Shapes

Zero border-radius, everywhere (`rounded: none`). Sharp corners on every button, chip, badge, and
photo frame: a deliberate, consistent choice matching the flyer/sticker material, not an oversight.
Don't introduce a rounded variant without a real reason tied to new content, not just "softer."

## Components

The **hero photo fan** (`Hero.astro` / `.hero__fan`) is the page's signature element and the one
thing it should be remembered for: four photos laid out like a spread hand of cards (`nth-child`
rotation + offset, each with its own accent-coloured hard shadow), auto-shuffling by moving the
DOM's last child to first every 3.5s so each photo takes a turn at the front. Hovering a card also
triggers a quick VHS-style glitch (hue-shift + scanlines) and reveals a hidden clip: a tell that
there's more here than a static photo, without spelling it out.

Everything else reuses the same **hard-shadow sticker** family (see the `button`, `button-magenta`,
`social-chip`, and `gig-date-badge` component tokens above): social chips, the gig date badge,
toasts, the "NEW" video badge. One physical material, reused everywhere, is the throughline, not a
different card style per section.

The **marquee** is the other repeated motif: a sticky ticker of genre/brand words, `◆`-separated,
that swaps its word list and colour scheme (`acid` instead of idle `sun`/`void-2`) the instant the
stream goes live. A small, cheap way to make "live" feel like a real state change rather than a
text label.

**Easter eggs** (deliberate, not incidental, consistent with the "rave, not corporate" tone, these
reward curiosity):

- Header/footer logo hover: a quick VHS-style glitch hinting something's interactive.
- Header logo click: confetti + a kick/break drum pattern whose tempo scales with click speed,
  escalating to a full breakbeat loop after enough clicks.
- Footer logo click: a short ambient video wash synced to a sound clip.
- MLG mascot (About section): an escalating click-combo system with screen shake/strobe and layered
  stingers.
- A pixel-art logo printed to the browser devtools console on load.

All of the above fully disable under `prefers-reduced-motion` (not just tone down), and are
prefetched on hover/touchstart intent rather than blanket page load, so they cost nothing for
visitors who never find them.

## Do's and Don'ts

- Do derive new accents in OKLCH, within ~8% of the sRGB gamut boundary like the existing four.
  Don't drop back to plain hex for a new token.
- Do reuse `--shadow-hard` + the lift/press transform before inventing a new hover treatment.
- Do check whether an existing pattern (glitch, marquee state swap, hard-shadow sticker) already
  says what a new "loud" moment needs before adding a new visual language.
- Don't collapse `magenta` and `magenta-contrast` into one token (see **Colors**).
- Don't add numbered step markers (01/02/03): nothing on this site is a sequence.
- Don't use a soft/blurred `box-shadow` anywhere; it breaks the flat sticker material.
- Don't add a new user-facing string in only one locale. Every string in `src/i18n/ui.ts` needs a
  real translation (or an explicit `// TODO:`) across all 6 locales before it ships.
- Don't skip `prefers-reduced-motion` on a new animated feature, including easter eggs.
