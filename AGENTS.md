## Comments & JSDoc

Write no comments by default. Add one only when the **why** is non-obvious — a hidden constraint, a workaround for a specific browser bug, a subtle invariant, or behaviour that would surprise a reader. If removing the comment wouldn't confuse a future reader, don't write it.

**JSDoc** (`/** … */`) is for exported functions, types, and interfaces where the signature alone doesn't convey intent. One sentence max unless the behaviour is genuinely complex. Never describe what the code does — only why it does it that way.

**Inline comments** (`//`) are for single non-obvious lines. Keep them to one short line.

**Never write:**

- Section dividers or ASCII banners (`// ─── Party burst ───`)
- Numbered headers (`// 1. LIGHTBOX`)
- Descriptions of what the next line does (`// loop over cards`)
- Stale or speculative notes (`// TODO: fix this later`)
- Multi-line comment blocks for anything that reads naturally from the code

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Node is pinned via `.node-version` (v26.4.0) — run `fnm use` / `nvm use` first if node/npm
aren't on PATH.

## Code quality

Before considering a change done, run:

```
npm run check   # format:check + lint + typecheck
```

Or individually: `npm run format` (Prettier, `--write`), `npm run lint` / `npm run lint:fix`
(ESLint, flat config in `eslint.config.js`), `npm run typecheck` (`astro check`).

## English copy

The site's English copy follows **Australian English** conventions:

- Use `-ise` endings: `organise`, `realise`, `customise` — not `-ize`
- Use `-our`: `colour`, `favour`, `behaviour` — not `-or`
- Use `-re`: `centre`, `theatre` — not `-er`
- Use double-L inflections: `travelling`, `fulfilling` — not single-L

The `html lang` attribute and the `localeTags` BCP-47 tag for English are both `en` (not `en-AU`) to stay consistent across all locale identifiers. Australian spelling conventions still apply to all copy under the `en` key in `src/i18n/ui.ts` and any new user-facing English text.

## Localisation

Every string change must be applied across **all 6 locales**: `en`, `ja`, `de`, `nl`, `fr`, `it`. The strings live in `src/i18n/ui.ts`. Never update only one locale — if a translation isn't known, mark it with a `// TODO:` comment but still add the key so the build doesn't break. See the `localize` skill below before starting any copy change.

## Agent skills

Task-specific playbooks live in `.github/skills/*/SKILL.md`. Check these before starting a matching task instead of re-deriving the approach from scratch:

- **localize** — adding or editing user-facing copy across all 6 locales.
- **optimize-media-assets** — compressing/tuning images and video so they don't hurt Core Web Vitals or PageSpeed.
- **add-background-video** — replacing the looping ambient background video.
- **add-header-logo-party-asset** — the hero wordmark click/Konami code easter egg (kick/break sounds, confetti colours).
- **add-live-rotation-clip** — the live-only ambient review clip rotation.
- **add-mlg-easter-egg-asset** — the About section MLG mascot sound/gif combo system.

## CSS direction

All CSS must use **logical properties** so the codebase is ready for RTL languages (e.g. Arabic) without a rewrite. Use:

- `padding-inline-start` / `padding-inline-end` instead of `padding-left` / `padding-right`
- `margin-inline-start` / `margin-inline-end` instead of `margin-left` / `margin-right`
- `inset-inline-start` / `inset-inline-end` instead of `left` / `right` in `position` contexts
- `inset-block-start` / `inset-block-end` instead of `top` / `bottom` in `position` contexts
- `border-inline-start` / `border-inline-end` instead of `border-left` / `border-right`
- `text-align: start` / `text-align: end` instead of `text-align: left` / `text-align: right`

Exception: physical `left: 50%` centering tricks that pair with `translateX(-50%)` may remain as-is (no logical equivalent that works cross-browser for centering).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
