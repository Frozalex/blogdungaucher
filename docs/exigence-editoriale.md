# Exigence éditoriale des articles

Consigne du 19 octobre 2026 : Blog d’un Gaucher est un site spécialisé. Ses
articles doivent viser la référence dans leur sujet, avec une profondeur et une
utilité supérieures aux ressources concurrentes pertinentes.

## Ce qu’un article abouti doit apporter

Le lecteur doit comprendre le concept, son application réelle aux échecs, ses
limites et ce qu’il peut en faire. Selon le sujet, développer :

- une réponse claire à la question du titre et les définitions nécessaires ;
- le raisonnement détaillé, les mécanismes ou la démonstration, sans sauts logiques ;
- les travaux de référence : protocole, population, résultat, limites et portée
  échiquéenne, en distinguant un résumé consulté du texte intégral ;
- des exemples échiquéens précis : position, variante, partie, calcul ou situation
  pédagogique. Vérifier les coups, les calculs et les attributions ;
- les objections et les explications concurrentes, quand elles éclairent le sujet ;
- des applications et des critères permettant au lecteur de vérifier sa compréhension ;
- une bibliographie exploitée dans le texte, avec des liens vers les sources.

Ce sont des exigences de contenu à adapter au sujet. Il ne faut pas ajouter
artificiellement une section qui n’apporte rien, ni reproduire le même plan partout.

## Corriger sans appauvrir

Une affirmation non étayée doit être retirée ou reformulée. La version antérieure
n’est pas une réserve de faits fiables. Pour chaque coupe importante, identifier
la question du lecteur qu’elle laisse sans réponse et chercher un développement
solide : explication d’une méthode, analyse d’un résultat, exemple original,
contre-exemple ou comparaison de modèles.

Éviter aussi de consacrer l’essentiel d’un article à une succession de précautions.
Expliquer ce que l’on sait, pourquoi on le sait et comment l’utiliser. La prudence
scientifique doit améliorer la compréhension du sujet.

## Comparaison avec les autres ressources

Pour une création ou une réécriture de référence, consulter plusieurs ressources
qui répondent réellement à la même question, dont des contenus francophones s’ils
existent. Consigner les URL, la date de consultation, les points déjà bien traités
et les lacunes observées. Les concurrents servent à évaluer la couverture du sujet ;
les faits scientifiques doivent être vérifiés dans leurs sources primaires.

Une référence ne doit jamais être inventée ou complétée par vraisemblance.
Retrouver les auteurs, le titre, la date et le DOI lorsqu'il est utilisé ; ne
pas attribuer un chiffre au texte si celui-ci ne l'établit pas. Dans le suivi,
indiquer si l'on a consulté le texte intégral, le résumé ou seulement une notice.
Un échec d'accès ne transforme pas une source en fausse référence, mais interdit
de prétendre l'avoir relue intégralement. Les exemples créés pour expliquer
un mécanisme doivent rester identifiables comme des exemples.

L’avantage attendu doit être concret : une démonstration absente ailleurs, une
meilleure explication des études, des variantes vérifiées, des exercices corrigés,
une distinction conceptuelle importante ou une synthèse plus complète. Une longueur
supérieure ou un meilleur titre ne suffisent pas à prouver cette valeur.

## Contrôle avant livraison

Comparer le volume du corps, les sections et les apports avant/après. Une baisse
de plus de 15 % doit être expliquée dans le suivi et relue pour détecter les pertes
de substance. Ce seuil est une alerte interne choisie pour la maintenance du site,
pas un seuil scientifique ou une règle de référencement.

Un article court peut être excellent sur une question étroite. Un guide qui promet
un traitement complet ne doit pas se réduire à une introduction et à des liens.
Les fiches volontairement consolidées dans un guide doivent être distinguées des
articles à enrichir ; leur ancien volume n’est pas à rétablir automatiquement.

Vérifier ensuite l’exactitude, les sources, la cohérence entre titre et corps, les
liens, le rendu des tableaux, du code et des formules. Préserver les illustrations,
les crédits et les champs d’image conformément à `AGENTS.md`. Respecter le tutoiement
et éviter le tiret cadratin dans le texte des articles.

## Mesure reproductible

`python3 scripts/audit-editorial-volume.py --base 40dc7b9 --date 2026-10-19`
produit un inventaire dans `docs/audits-editoriaux/`. La référence précède les
corrections de fond du 15 au 19 octobre. Le comptage exclut les métadonnées, les
blocs de code, les commentaires, les balises, les URL et les descriptions d’images.
Il inclut les titres, tableaux et références textuelles : c’est un indicateur
approximatif, pas une mesure de la qualité ni le temps de lecture officiel.
