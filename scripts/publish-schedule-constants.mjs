/**
 * Règle éditoriale, dates ISO (UTC) :
 *   MARDI   — un article de série (Psychologie, puis Moteur en Python).
 *   LUN/JEU — deux articles de la file historique, de rubriques différentes.
 * Soit trois articles par semaine tant que la file hors série tient, puis le
 * seul mardi de la série. La définition d'« article de série » vit dans
 * `scripts/series-slugs.mjs`.
 *
 * `RESCHEDULE_FROM` : dernier jour « figé » exclusif pour le calcul du premier
 *   lundi de grille (max publishDate < RESCHEDULE_FROM → lundi suivant).
 * `SCHEDULE_GRID_ANCHOR_MONDAY` : tout billet avec publishDate >= ce lundi
 *   doit être sur la grille. Les dates entre RESCHEDULE_FROM et ce lundi
 *   restent manuelles (coussin).
 *
 * Quand tu figes une nouvelle vague : mets à jour les deux constantes puis
 * `npm run apply:publish-schedule` (dry-run d'abord).
 */
export const RESCHEDULE_FROM = "2026-08-28";

/** Première semaine soumise à la validation stricte (lundi de début de grille).
 * Avancé au 2026-08-31 lors du passage des séries au mardi. La semaine W35
 * reste telle quelle : son lundi 24 août est déjà publié, et son jeudi 27 août
 * porte `gaslighting-aux-echecs`, un article de la série Psychologie encore
 * placé sur l'ancienne grille. On ne réécrit pas une date déjà indexée ou
 * imminente ; la nouvelle règle ne porte donc que sur le 2026-08-31 et après. */
export const SCHEDULE_GRID_ANCHOR_MONDAY = "2026-08-31";
