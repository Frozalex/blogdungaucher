import type { SiteLang } from './lang-paths';

export type PagefindResult = { url: string; excerpt: string; meta: Record<string, string> };
type Pagefind = {
  init: () => Promise<void>;
  options: (options: { language: string }) => Promise<void>;
  search: (query: string) => Promise<{ results: { data: () => Promise<PagefindResult> }[] }>;
};

const engines = new Map<SiteLang, Promise<Pagefind>>();

/** Each language needs its own instance: Pagefind's language is chosen at initialization. */
export function loadPagefind(lang: SiteLang): Promise<Pagefind> {
  let pending = engines.get(lang);
  if (!pending) {
    const url = `${location.origin}/pagefind/pagefind.js?lang=${lang}`;
    pending = import(/* @vite-ignore */ url).then(async (pf: Pagefind) => {
      await pf.options({ language: lang });
      await pf.init();
      return pf;
    });
    engines.set(lang, pending);
    pending.catch(() => engines.delete(lang));
  }
  return pending;
}
