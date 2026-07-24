# DJ Zwackery - djzwackery.com 🎉

<img align="right" width="221" height="auto" src="./src/assets/logo.svg" alt="DJ Zwackery">

The official site for **DJ Zwackery**, happy hardcore DJ. Built with
[Astro](https://astro.build/), statically hosted on GitHub Pages at
[https://djzwackery.com](https://djzwackery.com).

- **Video wall** of his latest YouTube uploads — click any set to play it in an inline
  lightbox (loaded on demand, so nothing embeds until you click).
- **Real-time Twitch takeover** — a hidden Twitch embed watches for his stream going live.
  When he does, the layout switches to the stream + chat, the wordmark lights up `● LIVE`,
  and his real 7TV channel emotes rain down the page. It all reverses when he goes offline.
- **Social links** — YouTube, Twitch, Discord, Instagram, X (edit `src/config.ts`).
- Fast + SEO-friendly: no framework JS beyond one small inlined script, optimised images,
  self-hosted fonts, sitemap, canonical URLs, OpenGraph/Twitter cards, and JSON-LD.

## 🚀 Getting Started

Install dependencies with npm, then use the following commands:

| Command                | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `npm install`          | Installs dependencies.                               |
| `npm run dev`          | Runs the application locally at `localhost:4321`.    |
| `npm run build`        | Prepares the code for production (outputs `dist/`).  |
| `npm run preview`      | Serves the production build (use this to check CWV). |
| `npm run format`       | Formats the code with Prettier.                      |
| `npm run format:check` | Checks formatting without writing changes.           |
| `npm run lint`         | Lints the code with ESLint.                          |
| `npm run lint:fix`     | Lints and auto-fixes what it can.                    |
| `npm run typecheck`    | Type-checks with `astro check`.                      |
| `npm run check`        | Runs format:check, lint, and typecheck together.     |

> [!NOTE]
> Node is pinned via `.node-version`. If you use [`fnm`](https://github.com/Schniz/fnm)
> or `nvm`, run `fnm use` / `nvm use` in the project root first.

## 🔑 Environment Variables

Optional build-time API keys, provided as environment variables. Copy `.env.example` to `.env`
and fill in the values to enable them locally — everything is fetched at **build time only**,
there are no client-side API calls, and the site still builds without any of them (the video
wall just falls back to a cached feed, or is empty if no cache exists yet).

In CI these are provided as a GitHub Actions secret (see `.github/workflows/deploy.yml`).

| Variable              | Required | Description                                                                |
| --------------------- | -------- | -------------------------------------------------------------------------- |
| `YOUTUBE_API_KEY`     | No       | YouTube Data API v3 key. Powers the video wall of his latest uploads.      |
| `YOUTUBE_CHANNEL_ID`  | No       | Overrides which channel the feed is pulled from (defaults to his channel). |
| `YOUTUBE_MAX_RESULTS` | No       | Overrides how many videos are fetched (defaults to `12`).                  |

> [!NOTE]
> His real Twitch and 7TV emotes (for the live emote rain) are fetched **and downloaded** at
> build time — see [`src/lib/emotes.ts`](src/lib/emotes.ts) — then self-hosted from `/emotes/`.
> No key or secret needed, and the site never depends on Twitch or 7TV being reachable at runtime.

> [!TIP]
> The booking form isn't an env var: create a free form at [web3forms.com](https://web3forms.com)
> and paste the access key into `CONTACT_ACCESS_KEY` in [`src/config.ts`](src/config.ts). Until
> then it falls back to a `mailto:` link to `BOOKING_EMAIL`.

## 🚢 Deploying

This repository is set up for automatic deployments to GitHub Pages. Any push to the `dev`
branch triggers a build + deploy via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). A daily cron job also rebuilds
the site at 01:00 UTC (~noon Melbourne) to refresh build-time data (the YouTube feed and Twitch
emotes) even when nothing has changed in the repo.

One-time setup:

1. Add a repo secret `YOUTUBE_API_KEY` (enable "YouTube Data API v3" in Google Cloud and create a key).
2. **Settings → Pages → Source = "GitHub Actions"**.
3. The custom domain is set via [`public/CNAME`](public/CNAME) (`djzwackery.com`). The Twitch
   embed's allowed `parent` domains are in `TWITCH_PARENTS` in [`src/config.ts`](src/config.ts).

## 🎤 Adding a Gig

Gigs live in [`config/gigs.yaml`](config/gigs.yaml) — there's no CMS or content collection, just
a flat list:

```yaml
- date: "2026-09-26"
  event: Hardcore Evolution
  venue: Rubix Warehouse
  location: Melbourne, AU
  url: https://events.humanitix.com/hardcore-evolution/tickets
  image: https://events.humanitix.com/hardcore-evolution/flyer.jpg
```

- `date` is ISO `YYYY-MM-DD`. Past dates hide themselves automatically — no cleanup needed.
- `event` and `venue` are both optional. Whichever is set is shown; if both are set they're shown
  together as "Event • Venue" (the venue dimmed, subordinate to the event name). Set only one if
  that's all you know — e.g. a warehouse rave with no fixed venue name yet, or a club night where
  the venue _is_ the event.
- `location` is required — it's the only field guaranteed to render (and feeds
  `address.addressLocality` in the JSON-LD below).
- `url` is optional; omit it and the gig shows a "details coming soon" state instead of a ticket link.
- `image` is optional and JSON-LD-only (not shown on the page) — a fully-qualified URL to an
  externally-hosted flyer/poster. There's no local asset pipeline for it: anything that doesn't
  start with `http` is silently skipped rather than emitted as a broken image URL.
- Entries don't need to be pre-sorted — they're rendered soonest-first.
- If the list is empty, the whole "catch him in the flesh" section is removed from the site.
- Upcoming gigs also emit [schema.org `Event`](https://schema.org/Event) JSON-LD for search
  engines, built from the same `event`/`venue` fallback — see
  [`src/components/Seo.astro`](src/components/Seo.astro).

## 🎉 Easter Eggs & Live Preview

| Effect               | Trigger                                                                            |
| -------------------- | ---------------------------------------------------------------------------------- |
| Live Twitch takeover | He goes live — the layout switches to stream + chat and his real emotes rain down. |
| Confetti burst       | Click the DJ Zwackery logo, or enter the Konami code (↑↑↓↓←→←→BA).                 |
| Dutch overlay        | Switch the language to NL (Dutch) — a special full-page easter egg activates.      |
| Contact confetti     | Successfully submit the contact form — confetti bursts from the send button.       |

> [!TIP]
> Force-preview the live takeover with `?live` (e.g. `http://localhost:4321/?live`) — `?live=0`
> forces offline, no param uses real detection. Both effects respect `prefers-reduced-motion`.

## ✍️ Copy & Language

The site's English copy follows **Australian English** conventions. Use AU spellings throughout — `organise`, `colour`, `centre`, `travelling`, etc. The `html lang` attribute for English pages is `en` (not `en-AU`) for consistency across locales.

All six locales (`en`, `ja`, `de`, `nl`, `fr`, `it`) must be updated together whenever a string changes. See [AGENTS.md](AGENTS.md) for the full conventions.

## 📚 Additional Resources

| Resource               | Description                                                               |
| ---------------------- | ------------------------------------------------------------------------- |
| [AGENTS.md](AGENTS.md) | Agent instructions, conventions and gotchas for working in this codebase. |
