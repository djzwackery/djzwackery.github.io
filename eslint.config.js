// @ts-check
import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import jsdoc from "eslint-plugin-jsdoc";
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
    plugins: { jsdoc },
    rules: {
      // Astro components intentionally destructure unused frontmatter props
      // for documentation purposes; still flag genuinely unused locals.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // No `if (x) return;` — every block gets braces, even one-liners.
      curly: ["error", "all"],
      // `/** on its own line, content indented, */` on its own line — never
      // a single-line `/** ... */` JSDoc comment.
      "jsdoc/multiline-blocks": ["error", { noSingleLineBlocks: true }],
    },
  },
);
