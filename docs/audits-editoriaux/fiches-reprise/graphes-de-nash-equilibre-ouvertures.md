# Reprise de fond : graphes-de-nash-equilibre-ouvertures

Date : 19 octobre 2026. Lot : articles publiés, lot 1.

Fichier : `src/content/blog/science/graphes-de-nash-equilibre-ouvertures.md`.

Corps avant cette passe : **717 mots** ; après : **1519 mots** (+111.9 %). Comptage par la fonction `words` de `scripts/audit-editorial-volume.py`, hors métadonnées, URL, code et descriptions d’images.

Ancienne référence 40dc7b9 : 2355 mots ; écart restant -35.5 %. Ce repère quantitatif ne valide pas les anciennes affirmations et ne déclenche pas une restauration automatique.

## Apports concrets

Matrice fictive 2×2 avec équilibre mixte calculé ; distinction stratégie complète/premier coup ; transposition de cavaliers contrôlée ; lecture séparée des scores, usages et évaluations ; méthode des meilleures objections.

Aucune réduction du corps dans cette passe. Les conseils et scènes pédagogiques sont identifiés ; aucune statistique, citation ou référence inventée. Les longs textes disponibles ne sont pas présentés comme une lecture exhaustive : les passages effectivement consultés sont indiqués ci-dessous.

## Sources consultées et portée réelle

- **Nash 1951** : [https://irving.vassar.edu/faculty/gj/FTU/io/literature/Nash51.pdf](https://irving.vassar.edu/faculty/gj/FTU/io/literature/Nash51.pdf). Accès : Texte intégral accessible, définition et cadre consultés. Travail primaire théorique. Ce que cela appuie : Aucune déviation unilatérale profitable dans un profil de stratégies ; exemple numérique créé ici.
- **Russell et Norvig, Adversarial Search** : [https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf). Accès : Chapitre intégral accessible ; sections minimax/alpha-bêta consultées. Manuel, pas résultat expérimental. Ce que cela appuie : Différence modèle adversarial, profondeur et évaluation heuristique.

Les références héritées non énumérées ci-dessus ne sont pas revendiquées comme revalidées pendant cette passe. Les nouveaux développements reposent sur les sources listées et les raisonnements/exemples explicitement construits.

## Comparaison de ressources concurrentes ou adjacentes

Consultation et repérage : 19 octobre 2026. Les extraits indexés ne sont pas assimilés à une lecture intégrale. Les ressources adjacentes ou institutionnelles sont signalées comme telles.
- [https://www.chess.com/fr/openings](https://www.chess.com/fr/openings) : Page consultée, répertoire et principes d’ouverture ; pas de démonstration de Nash sur les variantes.
- [https://joshvarty.github.io/AlphaZero/](https://joshvarty.github.io/AlphaZero/) : Tutoriel consulté ; utile sur arbres et valeurs, mais pas centré sur l’équilibre et les ouvertures. Comparaison adjacente.

Valeur ajoutée effectivement apportée : Fournit une démonstration calculable et montre exactement où le modèle cesse de décrire le répertoire réel ; ne prétend pas une supériorité globale sur ces ressources.

Aucune déclaration « meilleur article » : ce repérage limité documente des apports, sans prétendre couvrir l’ensemble des résultats Internet.

## Validation

- Métadonnées d’images, crédits, dates, slug et SEO préservés ; temps de lecture ajusté. Extrait ou point clé corrigé uniquement lorsque sa formulation contredisait la portée des preuves.
- Aucun tiret cadratin dans le corps ; liens vers les articles programmés rendus inactifs dans ce lot si nécessaire.
- Variantes ajoutées rejouées avec chess.js : développement italien et menaces de ...Dg5 ; transposition de cavaliers, six champs FEN ; Scandinavie et mise à jour des captures. Chaque variante n’est utilisée que dans les articles concernés. Aucun jugement moteur de « meilleur coup » attribué.
- Calculs d’illustration contrôlés : matrice de Nash, minima alpha-bêta, budget fictif, probabilités et visites, coordonnées et trajets de Cavalier selon le sujet.
- Pas de construction globale, PDF, commit ni déploiement par le responsable du lot. Le contrôle global est assuré par l’agent coordinateur.
