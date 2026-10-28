# Vidéos d'articles

Ce dossier reçoit les MP4 produits avec un outil externe et référencés depuis le frontmatter des articles via le champ `summaryVideo`. Aucun outil de production vidéo n'est installé dans le dépôt.

## Ajouter une vidéo

1. Déposer le fichier sous le nom `summary-<slug-article>.mp4` dans ce dossier.
2. Ajouter `summaryVideo: /videos/summary-<slug-article>.mp4` au frontmatter de l'article.
3. Ajouter éventuellement `summaryVideoNote` pour la légende sous le lecteur.
4. Reconstruire le site pour intégrer le fichier.

## Comportement côté article

Les pages d'articles vérifient au build, via `isPublicAssetAvailable`, que le MP4 existe avant d'afficher `src/components/ArticleVideo.astro` sous le titre. Le lecteur utilise les contrôles HTML natifs et fonctionne sans JavaScript, dans les trois langues. Si le fichier est absent, aucun lecteur n'est affiché.

## Introduction du site

Film « Voir le jeu autrement », créé le 19 octobre 2026 à partir de la démo HTML validée.

- Vidéo web : `/videos/introduction-blog-gaucher.mp4` (35 s, H.264, 1280 × 720, 30 i/s, sans audio ; environ 756 Ko).
- Couverture : `/videos/introduction-blog-gaucher-poster.webp`.
- Master Full HD et lecteur de validation : `livrables/introduction-site/`.
- Source graphique : `livrables/demo-echecs/` ; rendu reproductible : `node livrables/introduction-site/render.mjs` (FFmpeg et Brave local requis).

Les fichiers sont prêts pour l’accueil ; aucun lecteur n’a été ajouté à l’accueil ni publié. Pour une intégration, conserver les commandes de lecture, `playsinline`, `preload="none"` et la couverture. Le texte est directement visible dans le film, qui fonctionne sans son. Le réglage `faststart` permet une lecture progressive.
