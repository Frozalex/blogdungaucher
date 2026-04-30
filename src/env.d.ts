/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_ONESIGNAL_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
