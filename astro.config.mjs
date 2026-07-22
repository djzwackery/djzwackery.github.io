// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import yaml from "@rollup/plugin-yaml";

// https://astro.build/config
export default defineConfig({
  site: "https://djzwackery.com",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja", "de", "nl", "fr"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
          ja: "ja-JP",
          de: "de-DE",
          nl: "nl-NL",
          fr: "fr-FR",
        },
      },
    }),
  ],
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    plugins: [yaml()],
  },
});
