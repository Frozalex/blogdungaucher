# Reprise : echecs-peur-de-gagner

Consultation et rédaction : 19 octobre 2026.

Fichier : `src/content/blog/esprit/echecs-peur-de-gagner.md`

## Avant / après

Corps avant : 576 mots. Après : 1331 mots (comptage indicatif hors front matter, URL retirées). Corps enrichi sans coupe de fond ; quelques formulations héritées corrigées, selon le détail ci-dessous. Images, dates, crédits, slugs et champs SEO conservés. Titre/extrait ajustés seulement si nécessaires à la cohérence factuelle.

## Apports propres au sujet

Trois hypothèses distinguées, exemple original vérifiable de pat/mat, entraînement des deux camps et référence attendue séparée du résultat acquis.

## Sources et accès réel

- Kahneman et Tversky 1979, https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Behavioral_Decision_Theory/Kahneman_Tversky_1979_Prospect_theory.pdf : PDF intégral accessible ; transposition au jeu explicitement analogique.
- Position construite FEN 7k/8/5KQ1/8/8/8/8/8 w - - 0 1 : Dg7 mat, Df7 pat ; vérification légale à effectuer avec chess.js avant livraison.

## Repérage comparatif

- https://www.esprit-echecs.fr/astuces-comment-gagner-position-gagnante/ : extrait consulté, principes et attention aux ressources.
- https://mentalolympique.fr/blog/peur-gagner-peur-perdre-sport : extrait consulté, conséquences anticipées de la victoire et avertissement contre diagnostic automatique. Notre ajout combine analyse différentielle et position pat/mat corrigée.

Les repérages par extrait de recherche ne valent pas lecture intégrale. Pas de revendication de supériorité globale.

## Validations

Relecture des distinctions preuve/conseil/exemple fictif ; comparaison du corps ; absence de tiret cadratin ajouté ; liens explicites ; aucun diagnostic individuel ni chiffre supplémentaire non vérifié. Vérification des métadonnées par comparaison des versions avant/après. Pas de construction globale par cet agent.

## Contrôle final de cohérence

Images et crédits conservés. Tutoiement contrôlé (le pluriel réel des deux joueurs reste légitime). Corps sans tiret cadratin. Liens vers les articles programmés après le 19 octobre convertis en mentions sans lien lorsqu’il y en avait. Temps de lecture recalculé.

Vérification exécutée avec chess.js : FEN 7k/8/5KQ1/8/8/8/8/8 w - - 0 1 ; Qg7# donne isCheckmate=true, Qf7 donne isStalemate=true. Lien analyser-ses-parties (publication 2 novembre 2026) converti en article à venir sans lien.

Validation technique finale : les 16 corps du lot passent la chaîne Markdown/GFM/mathématiques vers HTML avec KaTeX en mode strict sans avertissement ; liens internes contrôlés contre les dates de publication au 19 octobre 2026 et chemins des illustrations vérifiés. `git diff --check` sans erreur (avertissement CRLF sur un autre fichier préexistant).
