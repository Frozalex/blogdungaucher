# Vidéos d'articles

Ce dossier contient les MP4 produits par Motion Canvas et référencés depuis le frontmatter des articles via le champ `summaryVideo`.

## Convention de nommage

`summary-<slug-article>.mp4` : un MP4 par scène de résumé.

Exemple : `summary-echecs-et-memoire.mp4` pour l'article du même slug.

## Workflow pour générer un MP4

```bash
cd ../../motion-canvas
npm start
# 1. Ouvre http://localhost:9000
# 2. Sélectionne la scène
# 3. Clique sur l'icône "Render" en haut à droite
# 4. Choisis : MP4, 30 fps, 1920x1080
# 5. Le rendu sort dans motion-canvas/output/
# 6. Renomme et déplace dans ce dossier
```

Ou en CLI :

```bash
cd ../../motion-canvas
npx motion-canvas render
# Sortie dans output/, à déplacer ensuite ici.
```

## Comportement côté article

Le composant `src/components/ArticleVideo.astro` vérifie au build (via `isPublicAssetAvailable`) si le MP4 existe.
- Si oui → lecteur intégré sous le titre de l'article, avant le hero image
- Si non → la balise ne rend rien, le frontmatter peut rester en place sans casser le build

Cela permet de référencer `summaryVideo: "/videos/foo.mp4"` dans un article **avant** d'avoir produit le MP4, puis de le voir apparaître automatiquement dès le fichier déposé.
