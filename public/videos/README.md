# Vidéos d'articles

Ce dossier reçoit les MP4 produits avec un outil externe et référencés depuis le frontmatter des articles via le champ `summaryVideo`. Aucun outil de production vidéo n'est installé dans le dépôt.

## Ajouter une vidéo

1. Déposer le fichier sous le nom `summary-<slug-article>.mp4` dans ce dossier.
2. Ajouter `summaryVideo: /videos/summary-<slug-article>.mp4` au frontmatter de l'article.
3. Ajouter éventuellement `summaryVideoNote` pour la légende sous le lecteur.
4. Reconstruire le site pour intégrer le fichier.

## Comportement côté article

Les pages d'articles vérifient au build, via `isPublicAssetAvailable`, que le MP4 existe avant d'afficher `src/components/ArticleVideo.astro` sous le titre. Le lecteur utilise les contrôles HTML natifs et fonctionne sans JavaScript, dans les trois langues. Si le fichier est absent, aucun lecteur n'est affiché.
