/// <reference types="astro/client" />

/**
 * Build-time environment variables (never exposed to the browser: they are
 * only read in server-side lib code that runs during `astro build`/`dev`).
 */
interface ImportMetaEnv {
  readonly YOUTUBE_API_KEY?: string;
  readonly YOUTUBE_CHANNEL_ID?: string;
  readonly YOUTUBE_MAX_RESULTS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "country-flag-icons/string/3x2/*" {
  const svg: string;
  export default svg;
}
