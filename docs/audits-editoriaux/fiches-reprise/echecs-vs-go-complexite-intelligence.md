# Reprise de fond : echecs-vs-go-complexite-intelligence

Passe : articles programmés, lot 1. Consultation : 19 octobre 2026.

Fichier : `src/content/blog/science/echecs-vs-go-complexite-intelligence.md`. Publication conservée : **2026-12-17**.

Corps avant : **653 mots** ; après : **1303 mots** (+99.5 %). Mesure par `words` dans `scripts/audit-editorial-volume.py`, hors métadonnées, URL, code et descriptions d’images. Aucune réduction dans cette passe.

## Apports et corrections

Premier embranchement calculé, arbre fictif, état vs configuration, prise en passant contrôlée, portée des jalons machine, découverte d’un autre domaine.

Ne compare pas 10^120 parties estimées et configurations du Go comme une même grandeur ni intelligence des joueurs.

Les exemples fictifs et propositions de pratique sont identifiés. Les sources donnent leur portée et leurs limites ; les nouvelles explications ne sont pas présentées comme des résultats expérimentaux échiquéens lorsqu’elles ne le sont pas.

## Sources : accès et faits appuyés

- [https://tromp.github.io/go/legal.html](https://tromp.github.io/go/legal.html). **Accès réel :** Page de l’auteur accessible ; définition, résultat et méthode de comptage consultés. Travail mathématique primaire. **Portée :** Configurations légales du Go et groupes/libertés ; ne compte pas l’arbre complet des parties.
- [https://www.ibm.com/history/deep-blue](https://www.ibm.com/history/deep-blue). **Accès réel :** Archive de l’entreprise accessible et consultée. Source primaire institutionnelle et rétrospective. **Portée :** Jalon Deep Blue/Kasparov, pas comparaison causale de cognition humaine.
- [https://deepmind.google/research/alphago/](https://deepmind.google/research/alphago/). **Accès réel :** Page officielle accessible et consultée. Source primaire institutionnelle et rétrospective. **Portée :** Jalon AlphaGo et méthodes, pas résolution du Go.
- [https://arxiv.org/html/1712.01815v1](https://arxiv.org/html/1712.01815v1). **Accès réel :** Préprint intégral HTML accessible ; protocole et méthode consultés dans cette session de reprise. Source primaire. **Portée :** Entraînements propres aux jeux, politique/valeur/MCTS et auto-jeu ; aucune identification au cerveau humain.

Les longs documents ont été consultés dans les passages indiqués ; « texte intégral accessible » ne signifie pas une lecture intégrale exhaustive. Aucune référence ajoutée n’a été construite de mémoire. Pas de nouveau DOI, effectif ou résultat quantitatif non retrouvé.

## Ressources comparées

Repérage limité, directement concurrent ou adjacent selon la mention. Les extraits indexés sont distingués des pages ouvertes ; ils ne permettent pas d’affirmer ce que contient tout l’article.
- [https://perso.liris.cnrs.fr/educhene/articles/IUT2023.pdf](https://perso.liris.cnrs.fr/educhene/articles/IUT2023.pdf) : Support universitaire accessible ; passages jeux et IA consultés. Large panorama technique, pas conseil de choix personnel.
- [https://deepmind.google/research/alphago/](https://deepmind.google/research/alphago/) : Page officielle consultée ; méthode et jalons, aussi source primaire institutionnelle. Notre texte distingue espace d’états, parties et cognition humaine.

Valeur apportée : Ne compare pas 10^120 parties estimées et configurations du Go comme une même grandeur ni intelligence des joueurs. La comparaison ne justifie aucune déclaration « meilleur article » ni classement exhaustif des ressources Internet.

## Contrôles

- Métadonnées YAML comparées à la copie initiale : images, crédits, dates, SEO et tous les champs conservés, sauf temps de lecture et extraits halo/opérant corrigés.
- Illustrations du corps préservées ; aucun tiret cadratin dans le corps.
- Liens internes vérifiés avec une date de disponibilité égale au maximum du 19 octobre 2026 et de la publication source. Les cibles plus tardives sont annoncées sans lien actif ; aucune date n’a été avancée.
- Les exemples qui comportent des coups ont été rejoués avec chess.js : mat 1.f3 e5 2.g4 Dh4 ; menace f7 et défense ...g6 ; prise en passant après 1.e4 a6 2.e5 d5 ; Espagnole avec roque. Seules les lignes pertinentes sont employées dans chaque article. Pas d’attribution historique ni de meilleur coup moteur inventé.
- Calculs contrôlés : 6/10 = 60 %, deux répartitions d’issues pour un score de 0,80, 10^4 et 2^10, 20 coups initiaux légaux. Valeurs explicitement fictives lorsqu’elles illustrent un modèle.
- Conclusions après les nouveaux développements. Pas de build global, PDF, modification de code, commit ou déploiement par le responsable du lot.
