# Reprise : minimax-aux-echecs

Consultation et rédaction : 19 octobre 2026.

Fichier : `src/content/blog/science/minimax-aux-echecs.md`

## Avant / après

Corps avant : 1658 mots. Après : 2366 mots (comptage indicatif hors front matter, URL retirées). Corps enrichi sans coupe de fond ; quelques formulations héritées corrigées, selon le détail ci-dessous. Images, dates, crédits, slugs et champs SEO conservés. Titre/extrait ajustés seulement si nécessaires à la cohérence factuelle.

## Apports propres au sujet

Arbre original calculé et coupure expliquée, transposition légale, bornes exactes/inférieures/supérieures, effet d’horizon et niveaux de garantie. Révision complémentaire titre/extrait et passages sur AlphaZero nécessaire au contrôle final.

## Sources et accès réel

- Russell et Norvig https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf : PDF intégral accessible, minimax/alpha-bêta et limites heuristiques.
- https://github.com/official-stockfish/Stockfish/blob/master/src/search.cpp : fichier officiel accessible intégralement à date, recherche concrète ; pas de numéro de ligne stable prétendu.
- Silver et al. https://arxiv.org/abs/1712.01815 : résumé et notice accessible ; version 2017 identifiée, pas d’attribution de compréhension humaine.

## Repérage comparatif

- https://interstices.info/programmation-des-echecs-et-dautres-jeux/ : extrait consulté, arbre/alpha-bêta/tables.
- https://www.ffothello.org/informatique/algorithmes/ : extrait consulté, schéma algorithmique. Notre apport propre est un déroulement numérique avec ordre modifié, types de bornes du cache et garanties hiérarchisées.

Les repérages par extrait de recherche ne valent pas lecture intégrale. Pas de revendication de supériorité globale.

## Validations

Relecture des distinctions preuve/conseil/exemple fictif ; comparaison du corps ; absence de tiret cadratin ajouté ; liens explicites ; aucun diagnostic individuel ni chiffre supplémentaire non vérifié. Vérification des métadonnées par comparaison des versions avant/après. Pas de construction globale par cet agent.

## Contrôle final de cohérence

Images et crédits conservés. Tutoiement contrôlé (le pluriel réel des deux joueurs reste légitime). Corps sans tiret cadratin. Liens vers les articles programmés après le 19 octobre convertis en mentions sans lien lorsqu’il y en avait. Temps de lecture recalculé.

Titre et extrait rectifiés pour ne plus prétendre que l'algorithme pense à la place du lecteur ou structure chaque décision humaine. Section AlphaZero reformulée : autre architecture, réseau politique/valeur, absence de preuve d'intuition humaine, résultats liés au protocole. Attribution historique exclusive à McCarthy retirée ; référence au chapitre réellement consulté. Absolu « impossible » remplacé par non réalisable avec les moyens actuels. Légende d'image nettoyée de son cadratin sans changer le fichier image. Transpositions contrôlées avec chess.js : placement, trait et droits identiques, compteurs demi-coups 0 et 1 différents (différence cohérente avec la distinction état/historique expliquée dans le texte).

Validation technique finale : les 16 corps du lot passent la chaîne Markdown/GFM/mathématiques vers HTML avec KaTeX en mode strict sans avertissement ; liens internes contrôlés contre les dates de publication au 19 octobre 2026 et chemins des illustrations vérifiés. `git diff --check` sans erreur (avertissement CRLF sur un autre fichier préexistant).
