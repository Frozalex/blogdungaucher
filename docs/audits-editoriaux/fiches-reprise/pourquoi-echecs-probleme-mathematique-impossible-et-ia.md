# Reprise de fond : pourquoi-echecs-probleme-mathematique-impossible-et-ia

Date : 19 octobre 2026. Lot : articles publiés, lot 1.

Fichier : `src/content/blog/science/pourquoi-echecs-probleme-mathematique-impossible-et-ia.md`.

Corps avant cette passe : **2470 mots** ; après : **3183 mots** (+28.9 %). Comptage par la fonction `words` de `scripts/audit-editorial-volume.py`, hors métadonnées, URL, code et descriptions d’images.

Ancienne référence 40dc7b9 : 3078 mots ; écart restant +3.4 %. Ce repère quantitatif ne valide pas les anciennes affirmations et ne déclenche pas une restauration automatique.

## Apports concrets

Démonstration alpha-bêta à quatre feuilles, contre-exemples numériques contrôlés, profondeur sélective vs preuve, taille variable vs échiquier fixé, performance vs garantie.

Aucune réduction du corps dans cette passe. Les conseils et scènes pédagogiques sont identifiés ; aucune statistique, citation ou référence inventée. Les longs textes disponibles ne sont pas présentés comme une lecture exhaustive : les passages effectivement consultés sont indiqués ci-dessous.

## Sources consultées et portée réelle

- **Russell et Norvig** : [https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf). Accès : Chapitre intégral accessible ; sections minimax et alpha-bêta consultées. Manuel. Ce que cela appuie : Couper sans changer le résultat minimax sur le même arbre évalué.
- **Shannon 1950** : [https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf). Accès : Article intégral accessible ; ordre de grandeur et méthode consultés. Source primaire théorique. Ce que cela appuie : Estimation, pas dénombrement exact ni borne pour tout algorithme.
- **Fraenkel et Lichtenstein 1981** : [https://kubokovac.eu/zlozitost/mat/chessExptime.pdf](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf). Accès : Texte intégral accessible ; énoncé et cadre généralisé consultés. Source primaire théorique. Ce que cela appuie : Famille n×n, pas temps exact pour l’instance 8×8.

Les références héritées non énumérées ci-dessus ne sont pas revendiquées comme revalidées pendant cette passe. Les nouveaux développements reposent sur les sources listées et les raisonnements/exemples explicitement construits.

## Comparaison de ressources concurrentes ou adjacentes

Consultation et repérage : 19 octobre 2026. Les extraits indexés ne sont pas assimilés à une lecture intégrale. Les ressources adjacentes ou institutionnelles sont signalées comme telles.
- [https://jeuxechecs.fr/e_book/resoudre_les_echecs.pdf](https://jeuxechecs.fr/e_book/resoudre_les_echecs.pdf) : PDF consulté, traite précisément le mauvais argument d’impossibilité par Shannon. Ne pas prétendre que cette distinction manque ailleurs.
- [https://joshvarty.github.io/AlphaZero/](https://joshvarty.github.io/AlphaZero/) : Tutoriel consulté, recherche guidée et valeur sur petit jeu. Comparaison adjacente ; notre apport est l’exemple alpha-bêta calculé et les niveaux de preuve.

Valeur ajoutée effectivement apportée : Rend contrôlable une coupure et son domaine de validité, sans confondre excellence pratique d’un moteur et résolution.

Aucune déclaration « meilleur article » : ce repérage limité documente des apports, sans prétendre couvrir l’ensemble des résultats Internet.

## Validation

- Métadonnées d’images, crédits, dates, slug et SEO préservés ; temps de lecture ajusté. Extrait ou point clé corrigé uniquement lorsque sa formulation contredisait la portée des preuves.
- Aucun tiret cadratin dans le corps ; liens vers les articles programmés rendus inactifs dans ce lot si nécessaire.
- Variantes ajoutées rejouées avec chess.js : développement italien et menaces de ...Dg5 ; transposition de cavaliers, six champs FEN ; Scandinavie et mise à jour des captures. Chaque variante n’est utilisée que dans les articles concernés. Aucun jugement moteur de « meilleur coup » attribué.
- Calculs d’illustration contrôlés : matrice de Nash, minima alpha-bêta, budget fictif, probabilités et visites, coordonnées et trajets de Cavalier selon le sujet.
- Pas de construction globale, PDF, commit ni déploiement par le responsable du lot. Le contrôle global est assuré par l’agent coordinateur.
