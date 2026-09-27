import fs from "fs";
import path from "path";

/**
 * Variantes redimensionnées des images de `public/`.
 *
 * Les fichiers de `public/` échappent au pipeline d'assets d'Astro : sans cela,
 * une carte de 280 px téléchargeait le hero 1200x800 complet. `scripts/generate-thumbs.mjs`
 * produit les variantes avant le build, ce module les expose aux composants.
 *
 * ATTENTION : `THUMB_DIR_NAME` et `THUMB_WIDTHS` sont dupliqués dans
 * `scripts/generate-thumbs.mjs` (script Node, hors pipeline TypeScript).
 * Toute modification ici doit y être répercutée.
 */
export const THUMB_DIR_NAME = "thumbs";
export const THUMB_WIDTHS = [320, 480, 640, 768, 960, 1200] as const;

/**
 * `sizes` du carrousel « Pour vous », partagé par les quatre templates d'article.
 * Suit `.related-carousel__track` : 17.5rem au repos, 15.5rem sous 1024px,
 * 46 % de la fenêtre sous 760px.
 */
export const RELATED_CARD_SIZES = "(max-width: 760px) 46vw, (max-width: 1024px) 248px, 280px";

/** `sizes` du hero d'article : panneau de 56vw, pleine largeur une fois empilé. */
export const ARTICLE_HERO_SIZES = "(max-width: 820px) 100vw, 56vw";

export type ResponsiveImage = {
  src: string;
  srcset?: string;
  sizes?: string;
};

/** `/images/blog/foo.webp` + 320 -> `/images/blog/thumbs/foo-320.webp` */
function thumbUrl(src: string, width: number): string {
  const dir = path.posix.dirname(src);
  const base = path.posix.basename(src).replace(/\.[^.]+$/, "");
  return `${dir}/${THUMB_DIR_NAME}/${base}-${width}.webp`;
}

// Le build rend des centaines de cartes : on mémorise les srcset déjà calculés
// plutôt que de refaire cinq `existsSync` par image et par carte.
const cache = new Map<string, string | null>();

function buildSrcset(src: string): string | null {
  const cached = cache.get(src);
  if (cached !== undefined) return cached;

  const parts: string[] = [];
  for (const width of THUMB_WIDTHS) {
    const url = thumbUrl(src, width);
    const abs = path.join(process.cwd(), "public", url.replace(/^\/+/, ""));
    try {
      if (fs.existsSync(abs) && fs.statSync(abs).size > 0) {
        parts.push(`${url} ${width}w`);
      }
    } catch {
      // Variante illisible : on l'ignore, le `src` d'origine reste le repli.
    }
  }
  const srcset = parts.length ? parts.join(", ") : null;
  cache.set(src, srcset);
  return srcset;
}

/**
 * Décrit une image de `public/` en version responsive.
 *
 * Renvoie le `src` d'origine si aucune variante n'a été générée (image ajoutée
 * après coup, format non géré) : l'affichage reste correct, seulement plus lourd.
 *
 * @param sizes Attribut `sizes` décrivant la largeur d'affichage réelle.
 */
export function getResponsiveImage(src: string, sizes: string): ResponsiveImage {
  if (!src || /^https?:\/\//i.test(src) || !src.startsWith("/")) return { src };
  const srcset = buildSrcset(src);
  if (!srcset) return { src };
  return { src, srcset, sizes };
}
