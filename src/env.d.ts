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

/**
 * Globaux runtime posés par les scripts inline (BaseLayout, i18n, ntfy).
 * Déclarés ici pour que les scripts `<script>` (type-checkés) ne remontent pas
 * de ts(2339) « Property '__x' does not exist on Window ».
 */
interface Window {
  __lang?: string;
  __i18n?: Record<string, Record<string, string>>;
  __I18N_DICT__?: Record<string, Record<string, string>>;
  __applyLang?: (lang: string) => void;
  __langFromPath?: (path: string) => string;
  __NTFY_URL__?: string;
  __NTFY_TOPIC__?: string;
  __NTFY_VAPID_KEY__?: string;
}
