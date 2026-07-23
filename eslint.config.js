// @ts-check
import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import globals from "globals";

export default defineConfig(
  globalIgnores(["dist/**", ".astro/**", ".cache/**", "node_modules/**"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs["flat/recommended"],
  {
    // Astro/Node-side code (config, pages, lib, scripts run at build time).
    files: ["**/*.{js,mjs,ts,astro}"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // Client-side script that ships to the browser.
    files: ["src/scripts/**/*.ts"],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    rules: {
      // Astro components intentionally destructure unused frontmatter props
      // for documentation purposes; still flag genuinely unused locals.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
