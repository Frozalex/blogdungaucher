/**
 * « Les plus lus » — liste éditoriale manuelle (panneau RankedPanel de l'accueil).
 *
 * Liste de slugs FR (nom de fichier sans extension) dans l'ordre d'affichage.
 * Le panneau les résout contre les articles publiés ; tout slug introuvable est
 * ignoré, et la liste est complétée par les articles les plus récents si besoin,
 * pour toujours afficher 5 entrées.
 *
 * Pour démarrer sans dépendre d'Umami / de la Search Console : édition à la main.
 * On pourra plus tard remplacer cette constante par un pull de stats réelles.
 */
export const mostReadSlugs: readonly string[] = [
  "les-echecs-rendent-ils-plus-intelligent",
  "echecs-et-memoire",
  "theorie-des-jeux-aux-echecs",
  "echecs-et-dopamine",
  "syndrome-imposteur-aux-echecs",
];
