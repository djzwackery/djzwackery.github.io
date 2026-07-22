# DJ Zwackery — djzwackery.com

The official site for **DJ Zwackery**, happy hardcore / UK hardcore DJ. Built with
[Astro](https://astro.build) (no UI framework), statically hosted on GitHub Pages.

## What it does

- **Video wall** of his latest YouTube uploads — click any set to play it in an inline
  lightbox (loaded on demand, so nothing embeds until you click).
- **Real-time Twitch takeover** — a hidden Twitch embed watches for his stream going live.
  When he does, the layout switches to the stream + chat, the wordmark lights up `● LIVE`,
  and **his real 7TV channel emotes rain down the page**. It all reverses when he goes offline.
- **Social links** — YouTube, Twitch, Discord, Instagram, TikTok (edit `src/config.ts`).
- Fast + SEO-friendly: no framework JS, one small inlined script, optimised images,
  self-hosted fonts, sitemap, canonical URLs, OpenGraph/Twitter cards, and JSON-LD.

## Previewing the live state

The Twitch takeover only triggers when he's actually streaming. To preview it any time,
add `?live` to the URL (e.g. `http://localhost:4321/?live`) — this forces the live layout,
mounts the stream + chat, and starts the emote rain. `?live=0` forces offline; no param
uses real detection.

## Editing content

Almost everything lives in [`src/config.ts`](src/config.ts): name, tagline, bio, marquee words,
social URLs, YouTube channel id, the Twitch login/user id, the Ko-fi link, and the gig list.
The video list is generated from `src/data/youtube.json` (see below).

**Gigs:** edit [`config/gigs.yaml`](config/gigs.yaml) (date, venue, city, optional ticket url).
Past dates hide themselves; if the list is empty the gigs section is removed entirely.

## How content refreshes (no backend, never fetched in the browser)

The video list and emotes are **baked into the build** from JSON committed in `src/data/`, so
the browser never talks to the YouTube/Twitch APIs and no key is ever shipped to the client.
That JSON is refreshed by scheduled GitHub Actions jobs:

- **`.github/workflows/refresh-feed.yml`** runs daily and:
  - runs `scripts/fetch-youtube.mjs` (needs the `YOUTUBE_API_KEY` secret) → `src/data/youtube.json`
  - runs `scripts/fetch-twitch-emotes.mjs` (public Twitch GraphQL, no secret) → `src/data/twitch-emotes.json`
  - commits any changes to `dev`, which triggers the deploy.
- **`.github/workflows/deploy.yml`** builds and publishes to GitHub Pages on every push to `dev`.
  The build only reads the committed JSON (deterministic, no API calls at deploy time).

The emote rain also loads his 7TV emotes live in the browser as an enhancement, falling back to
the committed Twitch emotes / a curated emoji set if unreachable.

### Refreshing locally

Copy [`.env.example`](.env.example) to `.env`, add your YouTube Data API v3 key, then:

```sh
npm run refresh        # fetch YouTube + Twitch emotes into src/data
npm run fetch:youtube  # just the YouTube feed
```

With no key set, the scripts skip and keep the committed cache, so builds still work.

### One-time setup

1. Add a repo secret `YOUTUBE_API_KEY` (YouTube Data API v3 key — enable "YouTube Data API v3"
   in Google Cloud and create a key).
2. **Settings → Pages → Source = "GitHub Actions"**.
3. The custom domain is set via [`public/CNAME`](public/CNAME) (`djzwackery.com`). The
   Twitch embed's allowed `parent` domains are in `TWITCH_PARENTS` in `src/config.ts`.
4. **Booking form:** create a free form at [web3forms.com](https://web3forms.com) and paste
   the access key into `CONTACT_ACCESS_KEY` in `src/config.ts`. Until then the form falls
   back to a `mailto:` to `BOOKING_EMAIL`.

## 🧞 Commands

| Command           | Action                                     |
| :---------------- | :----------------------------------------- |
| `npm install`     | Install dependencies                       |
| `npm run dev`     | Start local dev server at `localhost:4321` |
| `npm run build`   | Build the production site to `./dist/`     |
| `npm run preview` | Preview the production build locally       |
