/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_NTFY_URL?:        string;
  readonly PUBLIC_NTFY_TOPIC?:      string;
  readonly PUBLIC_NTFY_VAPID_KEY?:  string;
  readonly PUBLIC_REMARK42_URL?:    string;
  readonly PUBLIC_REMARK42_SITE?:   string;
  readonly PUBLIC_NEWSLETTER_URL?:  string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
