import { isPublicAssetAvailable } from "./public-asset";
import imageWidths from "../data/image-widths.json";

/**
 * Largeurs des variantes produites par scripts/generate-image-variants.mjs.
 * Les deux fichiers doivent rester d'accord : ici on ne fait que déclarer dans
 * le `srcset` les fichiers que le script a écrits.
 */
const WIDTHS = [480, 640, 960] as const;

const SOURCE_RE = /\.(?:webp|jpe?g|png)$/i;

/**
 * Construit le `srcset` d'une image de `public/` à partir de ses variantes.
 *
 * Retourne `undefined` si aucune variante n'existe (image externe, SVG, source
 * déjà plus petite que 480 px) : l'appelant garde alors son `src` seul, sans
 * `srcset` cassé pointant vers des 404.
 *
 * L'original est ajouté en dernier avec sa largeur réelle, pour que les écrans
 * haute densité disposent encore de la pleine résolution. Cette largeur vient
 * de src/data/image-widths.json (écrit par le script de génération) ; le
 * paramètre `intrinsicWidth` ne sert que de repli pour les images absentes du
 * manifeste, comme celles insérées en HTML dans le markdown.
 */
export function buildSrcset(src: string | null | undefined, intrinsicWidth = 1200): string | undefined {
  if (!src) return undefined;
  const s = src.trim();
  if (!s.startsWith("/") || !SOURCE_RE.test(s)) return undefined;

  const known = (imageWidths as Record<string, number>)[s];
  const width = known ?? intrinsicWidth;

  const base = s.replace(SOURCE_RE, "");
  const entries: string[] = [];

  for (const w of WIDTHS) {
    if (w >= width) continue;
    const candidate = `${base}-${w}w.webp`;
    if (isPublicAssetAvailable(candidate)) entries.push(`${candidate} ${w}w`);
  }

  if (entries.length === 0) return undefined;
  entries.push(`${s} ${width}w`);
  return entries.join(", ");
}

/**
 * Attributs à étaler sur un `<img>` : `{...imgSizing(src, "280px")}`.
 *
 * Rend un objet vide quand aucune variante n'existe — un `sizes` tout seul ne
 * servirait à rien, et il vaut mieux ne rien poser que poser un `srcset` vide.
 */
export function imgSizing(
  src: string | null | undefined,
  sizes: string,
  intrinsicWidth = 1200,
): { srcset: string; sizes: string } | Record<string, never> {
  const srcset = buildSrcset(src, intrinsicWidth);
  return srcset ? { srcset, sizes } : {};
}
