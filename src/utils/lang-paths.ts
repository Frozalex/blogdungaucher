/** Préfixes URL pour les trois langues du site. */
export type SiteLang = "fr" | "en" | "de";

export function withTrailingSlash(path: string): string {
  if (path === "" || path === "/") return "/";
  const s = path.startsWith("/") ? path : `/${path}`;
  return s.endsWith("/") ? s : `${s}/`;
}

/**
 * Remplace le segment de langue en tête de chemin (/fr/, /en/, /de/).
 * Ex. `/fr/blog/foo/` + `en` → `/en/blog/foo/`
 */
export function swapLangPrefix(path: string, target: SiteLang): string {
  const norm = withTrailingSlash(path);
  const stripped = norm.replace(/^\/(fr|en|de)(?=\/|$)/, "");
  const rest =
    stripped === "" || stripped === "/"
      ? "/"
      : stripped.startsWith("/")
        ? stripped
        : `/${stripped}`;
  const tail = rest === "/" ? "" : rest;
  return withTrailingSlash(`/${target}${tail}`);
}
