# Reprise : theorie-des-jeux-aux-echecs

Consultation et rédaction : 19 octobre 2026.

Fichier : `src/content/blog/science/theorie-des-jeux-aux-echecs.md`

## Avant / après

Corps avant : 823 mots. Après : 1613 mots (comptage indicatif hors front matter, URL retirées). Corps enrichi sans coupe de fond ; quelques formulations héritées corrigées, selon le détail ci-dessous. Images, dates, crédits, slugs et champs SEO conservés. Titre/extrait ajustés seulement si nécessaires à la cohérence factuelle.

## Apports propres au sujet

Arbre numérique original résolu, modèle de piège avec hypothèse de fréquence explicitée, distinction score de partie / qualification, exercice de classement des erreurs. Calculs : max(min(4,-1),min(1,2))=1 ; espérance fictive 0,70.

## Sources et accès réel

- Russell et Norvig, https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf : PDF intégral accessible ; définition de stratégie contingente et remontée minimax. Attention : document ancien malgré son chemin 4th-ed, aucune affirmation sur moteurs actuels tirée de ses exemples historiques.
- Stanford Encyclopedia, https://plato.stanford.edu/entries/game-theory/ : texte intégral accessible ; cadre stratégies, utilités, croyances.
- Nash déjà présent, non rouvert : aucune donnée supplémentaire attribuée à ce texte.

## Repérage comparatif

- https://interstices.info/programmation-des-echecs-et-dautres-jeux/ : extrait consulté, présentation de minimax et tables de finales.
- https://www.ffothello.org/informatique/algorithmes/ : extrait consulté, arbre et anticipation. Notre ajout traite surtout garanties contre fréquences empiriques et utilité en tournoi, sans prétendre épuiser ces ressources.

Les repérages par extrait de recherche ne valent pas lecture intégrale. Pas de revendication de supériorité globale.

## Validations

Relecture des distinctions preuve/conseil/exemple fictif ; comparaison du corps ; absence de tiret cadratin ajouté ; liens explicites ; aucun diagnostic individuel ni chiffre supplémentaire non vérifié. Vérification des métadonnées par comparaison des versions avant/après. Pas de construction globale par cet agent.

## Contrôle final de cohérence

Images et crédits conservés. Tutoiement contrôlé (le pluriel réel des deux joueurs reste légitime). Corps sans tiret cadratin. Liens vers les articles programmés après le 19 octobre convertis en mentions sans lien lorsqu’il y en avait. Temps de lecture recalculé.

Extrait corrigé : les échecs sont un terrain d'application, pas l'origine exclusive de la théorie des jeux. Aucun autre champ SEO changé.

Contrôle KaTeX strict : accent hérité dans operatorname remplacé par text pour rendre les deux formules sans avertissement de caractères accentués en mode mathématique. Aucun changement de leur sens.

Validation technique finale : les 16 corps du lot passent la chaîne Markdown/GFM/mathématiques vers HTML avec KaTeX en mode strict sans avertissement ; liens internes contrôlés contre les dates de publication au 19 octobre 2026 et chemins des illustrations vérifiés. `git diff --check` sans erreur (avertissement CRLF sur un autre fichier préexistant).
