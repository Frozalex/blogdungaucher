/**
 * Règle éditoriale : 2 billets / semaine (lundi + jeudi), dates ISO (UTC).
 * — `RESCHEDULE_FROM` : dernier jour « figé » exclusif pour le calcul du premier
 *   lundi de grille (max publishDate < RESCHEDULE_FROM → lundi suivant).
 * — `SCHEDULE_GRID_ANCHOR_MONDAY` : tout billet avec publishDate >= ce lundi
 *   doit être sur la grille (lun/jeu, 2 par semaine ISO, nombre pair total).
 *   Les dates entre RESCHEDULE_FROM et ce lundi restent manuelles (coussin).
 *
 * Quand tu figes une nouvelle vague : mets à jour les deux constantes puis
 * `npm run apply:publish-schedule` (dry-run d’abord).
 */
export const RESCHEDULE_FROM = "2026-05-14";

/** Première semaine soumise à la validation stricte (lundi de début de grille). */
export const SCHEDULE_GRID_ANCHOR_MONDAY = "2026-05-18";
