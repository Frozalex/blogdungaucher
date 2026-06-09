# 14 — Les fonctionnalités interactives

Un site statique n'est pas un site mort : il peut être très interactif. Ce chapitre passe en revue **toutes les fonctionnalités qui réagissent au visiteur**, et comment elles fonctionnent sans serveur dynamique.

## La recherche : Pagefind

Le site a une vraie **recherche** (page `/fr/recherche/`). Le défi : un site statique n'a pas de serveur pour traiter une requête de recherche. La solution est **Pagefind**.

Comment ça marche :
1. **Après le build**, Pagefind parcourt toutes les pages d'articles et fabrique un **index** (une sorte de table des matières géante et compressée) qu'il découpe en petits morceaux.
2. Quand un visiteur tape une recherche, le **navigateur** télécharge seulement les morceaux d'index nécessaires et trouve les résultats **localement**, sans serveur.

C'est élégant : la recherche est rapide, fonctionne sans base de données, et coûte zéro en hébergement. Pagefind est lancé à la fin du build (`pagefind --site dist …`).

> **Détail technique :** comme les résultats de recherche sont insérés dans la page par du JavaScript, leur mise en forme utilise la technique `:global(...)` du CSS évoquée au [chapitre 07](07-design.md), sans quoi ils s'afficheraient sans style.

## Les commentaires : giscus

Sous les articles, les visiteurs peuvent **commenter** (composant `Comments.astro`). Le système utilisé est **giscus**, qui a une particularité maline : il **stocke les commentaires dans les « Discussions » du dépôt GitHub** du projet. Aucune base de données, aucun service payant, pas de pub. La configuration (quel dépôt GitHub, quelle catégorie de discussion) est dans `src/data/site.ts`. Le visiteur se connecte avec son compte GitHub pour commenter.

## La newsletter

Les visiteurs peuvent **s'abonner** pour recevoir les nouveaux articles (composants `NewsletterForm` et `NewsletterCta`). Côté technique, l'envoi des e-mails d'annonce est géré par le script `send-new-article-email.mjs` (voir [chapitre 11](11-scripts.md)), et des notifications push peuvent aussi être envoyées via **ntfy** (voir [chapitre 13](13-pwa-hors-ligne.md)).

## Le partage social

Le composant `ShareButtons.astro` ajoute sous chaque article des boutons pour le **partager** sur les réseaux ou **copier son lien**. Combiné aux balises Open Graph (voir [chapitre 09](09-seo.md)), un lien partagé affiche une belle carte d'aperçu.

## Le mode sombre et le changement de langue

Deux boutons de la barre de navigation (voir [chapitres 07](07-design.md) et [08](08-i18n.md)) :
- **Le bouton clair/sombre** bascule le thème (mémorisé dans le navigateur).
- **Le bouton FR/EN** change la langue de l'interface en direct, sans recharger.

## Les mathématiques : KaTeX

Dans les articles scientifiques et de Grand oral, on peut écrire des **formules mathématiques** (entre symboles `$`). L'outil **KaTeX** les transforme, pendant le build, en belles équations. C'est statique (calculé d'avance), donc rapide et sans JavaScript chez le visiteur. Comme son fichier de style est lourd, il n'est chargé **que sur les pages d'articles** (voir [chapitre 12](12-performance.md)).

## L'analyse d'échecs avec Stockfish

La page `/fr/analyses/` (code dans `src/scripts/analysis.ts`) est conçue pour **analyser des positions d'échecs** :
- on importe une position (au format **FEN**) ou une partie (au format **PGN**) ;
- un **échiquier interactif** (`chessboard-element`) l'affiche ;
- les règles du jeu sont gérées par **`chess.js`** (coups légaux, échec et mat) ;
- le **moteur Stockfish** (les fichiers dans `public/stockfish/`) **analyse** la position directement dans le navigateur et propose la meilleure suite, avec une **barre d'évaluation**.

Tout cela tourne **côté visiteur**, sans serveur. Cette page est **présente mais désactivée** pour l'instant (réglage `analysesAvailable: false` dans `src/data/site.ts`).

## Le suivi statistique : Google Analytics

Le site mesure son audience avec **Google Analytics** (identifiant `G-D31YHTHQT5`). **Important** : ce suivi ne se charge **qu'après le consentement** du visiteur (voir ci-dessous). Tant que personne n'a accepté, **aucun** script de suivi n'est activé.

## La publicité : Google AdSense

Le site est préparé pour afficher de la **publicité Google AdSense** (composant `AdBanner.astro`). Deux verrous, réglés dans `src/data/site.ts` :
- **`enabled`** — autorise le chargement du kit AdSense (nécessaire pour que Google puisse examiner le site pendant la demande d'approbation).
- **`live`** — affiche réellement les pubs. Tant qu'il est à `false` (état actuel), **aucun** emplacement publicitaire n'apparaît. Il passera à `true` une fois AdSense approuvé et les emplacements créés.

## Le consentement aux cookies

C'est la pièce qui orchestre tout ce qui précède côté vie privée : le composant `CookieConsent.astro` affiche un **bandeau** demandant l'autorisation avant d'activer le suivi (Analytics) et la publicité (AdSense). C'est une **obligation légale** en Europe (RGPD). Tant que le visiteur n'a pas accepté :
- Google Analytics **ne se charge pas** ;
- AdSense **ne se charge pas**.

Le choix du visiteur est **mémorisé** dans son navigateur, et il peut le modifier. C'est un composant volumineux et soigné, car il doit gérer finement l'activation **conditionnelle** de chaque service.

## Récapitulatif : interactif, mais toujours statique

Le point remarquable, c'est que **toutes** ces fonctionnalités interactives fonctionnent **sans serveur dynamique** :
- la recherche tourne dans le navigateur (Pagefind),
- les commentaires sont délégués à GitHub (giscus),
- l'analyse d'échecs tourne dans le navigateur (Stockfish),
- le suivi et la pub sont des services externes (Google),
- le reste (thème, langue) est du JavaScript léger côté visiteur.

C'est la démonstration qu'« statique » ne veut pas dire « figé ».

---

⬅️ Précédent : [13 — La PWA](13-pwa-hors-ligne.md) | ➡️ Suivant : [15 — Les PDF et les vidéos](15-pdf-et-videos.md)
