/**
 * Origine publique unique du site (HTTPS, sans port).
 * Ne pas la faire dépendre des variables d'environnement au build :
 * un VPS ou Docker peut définir SITE=http://domaine:8080 pour l'écoute locale,
 * ce qui fausserait import.meta.env.SITE et les URLs absolues Astro si la config
 * « site » était dérivée de cette valeur sans normalisation stricte.
 */
export const SITE_ORIGIN = "https://blogdungaucher.com";
