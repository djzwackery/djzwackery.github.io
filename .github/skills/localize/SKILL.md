---
name: localize
description: Adds or edits user-facing copy across all 6 locales this site supports (en, ja, de, nl, fr, it). Use this whenever the user asks to add new UI text, translate something, fix a translation, or when any change touches a string that's shown to visitors.
---

## The single source of truth

All translated copy lives in `src/i18n/ui.ts`, in one `ui` object keyed by locale then by a dotted
key (`"hero.followTwitch"`, `"contact.reason1"`, etc). `languages` (display names for the switcher)
and `localeTags` (BCP-47 tags for `html lang` / `og:locale`) live in the same file. There is no
external translation service, no `.po`/`.json`-per-locale split, no fallback-string library: it's
one TypeScript object, and `UiKey = keyof (typeof ui)["en"]` means the English block is the type
source, so a key missing from `en` can't be referenced anywhere.

Components read the current locale and translate like this:

```ts
import { useTranslations, getLang } from "../i18n";
const t = useTranslations(Astro.currentLocale);
const lang = getLang(Astro.currentLocale); // raw Lang, for when you need it directly
```

`t(key, vars?)` looks up `key` in the current locale, falling back to `en` if missing, and replaces
`{token}` placeholders from `vars` (see `contact.failed`: `"Couldn't send. Email {email} instead."`).
`getLang` coerces an arbitrary locale string to a supported `Lang`, defaulting to `en`.

## Adding or changing a string

1. Add the key under `en` first with the real copy.
2. Immediately add the same key to the other 5 locale blocks (`ja`, `de`, `nl`, `fr`, `it`), in the
   same relative position so the file stays diffable locale-to-locale. **Never leave a locale
   behind**: if you don't have a real translation yet, still add the key with a `// TODO:` comment
   so the type checker and build don't break, but don't ship it that way if avoidable.
3. If the copy needs an inline emphasis span (the neon highlight styling used in headings), wrap the
   emphasized word(s) in `[[double brackets]]` and render with `set:html={highlight(t("some.key"))}`
   (see `About.astro` or `LiveStage.astro` for the pattern). Translators can move the brackets to
   wherever the target language's word order puts the emphasis; the highlighted word does not have
   to be a literal translation of the English one's position.
4. Run `npm run check` (typecheck catches a key referenced but missing from a locale block, since
   `UiKey` is derived from `en`, but it will NOT catch a key present in `en` and silently missing
   from e.g. `fr`, so still verify all 6 blocks by eye).

## What stays in English everywhere

Per the comment at the top of `ui.ts`: brand names (`DJ Zwackery`, `House of Fun`) and genre names
(`happy hardcore`, `UK hardcore`, `gabber`, `drum & bass`) are kept as-is in every locale; these are
proper nouns / scene terminology, not descriptive text, and hardcore/hardstyle audiences use the
English genre names internationally. Don't translate them just because the surrounding sentence is
translated.

## Tone: match, don't reinvent

This site's voice is an energetic, casual rave-MC voice, not neutral marketing copy: e.g. `en`'s
`about.bio2` ends "Pro DJ, pro lad.", and every locale has its own equivalent register (`pro Kumpel`
in `de`, `pro maat` in `nl`, `pro pote` in `fr`, `pro fra` in `it`). Before inventing a new
translation for a concept, grep `ui.ts` for how that concept is already phrased elsewhere in the same
locale (e.g. "hands in the air" already exists in `about.bio1` and every `hero.photo1Alt`; "get in
here" already exists inside `live.heading`) and reuse that exact wording rather than a second,
slightly different translation of the same idea; terminology drift between two spots that describe
the same thing reads as sloppy in a small site like this one. This mattered concretely when
localizing the LED marquee (`src/components/Marquee.astro`): the live-mode words reuse `status.live`
verbatim instead of re-translating "live now" a second time, and the other phrases were matched
against `live.heading` / `about.bio1` phrasing rather than translated cold.

`en` copy specifically follows **Australian English** (`organise`, `colour`, `centre`, `travelling`;
see `AGENTS.md`), but `html lang` / `localeTags.en` stay `"en"`, not `"en-AU"`.

## When you need an array, not a single string

`t()` returns one string per key by design (`UiKey` → `string`). If a component needs a localized
_list_ (see `marqueeLive` in `ui.ts`, used by `Marquee.astro` for the live-mode LED marquee words),
don't force it into the `ui` table; add a separate `export const yourThing: Record<Lang, readonly
string[]> = { en: [...], ja: [...], ... }` next to `ui`, and read it with `yourThing[getLang(Astro.currentLocale)]`.
Still populate all 6 locales. If one entry is really just another key's value repeated (e.g. the
marquee's "LIVE NOW" beat _is_ `status.live`), build it with `t()` at the call site instead of
duplicating the translation into the array: one fewer place for the two to drift apart.

## Sensitivity pass

Before finishing, reread every new string in every locale for: unintended double meanings, slang
that's regional-only or dated, and phrasing that reads as more/less intense than the English source
in a way that changes meaning (marquee/hype copy in particular tends to get either flattened or
over-translated literally: check it still sounds like something a hype MC would actually shout in
that language, not a dictionary transliteration).

## Locale-list plumbing (only touch this for a genuinely new locale, not a string edit)

Adding a 7th locale is bigger than a string edit; it also needs: `astro.config.mjs`'s `i18n.locales`
array and the sitemap plugin's `i18n.locales` map, the `supported` array hardcoded in the
root-redirect script in `src/layouts/Base.astro`, and `languages` / `localeTags` in `ui.ts`. A normal
"translate this new string" task never needs any of these.

## Verifying

`npm run check` first. Since this is a static export, the fastest visual check without a browser is
curling each locale's server-rendered HTML and grepping the section you changed, e.g.:

```
for loc in "" "ja/" "de/" "nl/" "fr/" "it/"; do
  echo "=== /$loc ==="
  curl -s "http://localhost:4321/$loc" | grep -o 'your-marker-text'
done
```

against `astro dev --background`. For anything visual (marquee, highlight placement, RTL-sensitive
layout), also load it in a real browser: text length varies a lot between locales (German in
particular runs long) and can overflow containers that looked fine in English.
