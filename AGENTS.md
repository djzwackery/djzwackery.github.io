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

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
