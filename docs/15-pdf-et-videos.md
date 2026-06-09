# 15 — Les PDF et les vidéos

Le site produit deux types de contenus « riches » au-delà des articles : des **PDF téléchargeables** (pour le Grand oral) et des **vidéos récap**. Ce chapitre explique comment ils sont fabriqués.

## Les PDF téléchargeables

### À quoi ils servent
Les lycéens qui préparent le Grand oral apprécient un document **imprimable**, à relire au calme. Le site génère donc, pour les sujets de Grand oral, des **PDF soignés** (script + plan + code + questions de jury), proposés via le bouton `DownloadPdfButton` sur la page.

### Comment ils sont fabriqués : `generate-pdfs.mjs`
Le script `scripts/generate-pdfs.mjs` :
1. parcourt **récursivement** les articles concernés (il descend dans les sous-dossiers) ;
2. transforme le contenu en une page mise en forme ;
3. la convertit en **PDF** (avec `html2pdf.js`) ;
4. dépose le résultat dans `public/pdfs/`.

Détail technique soigné : pour que les **formules mathématiques** s'affichent dans le PDF (même ouvert hors connexion), le style de KaTeX est **incorporé directement dans le document** (« inliné » en base64), plutôt que référencé de l'extérieur. Ainsi le PDF est **autonome**.

### Le workflow
Les PDF sont **générés à l'avance** et **versionnés dans Git** (ils sont dans `public/pdfs/`, donc sauvegardés). Quand on ajoute ou modifie un sujet de Grand oral, on **régénère** les PDF (`npm run pdfs` ou `npm run build:pdfs`) puis on les commite. On peut ainsi les servir tels quels, sans rien calculer à la volée.

## Les vidéos récap

### À quoi elles servent
Certains articles ont une **vidéo de résumé** (champ `summaryVideo` du frontmatter, affichée par le composant `ArticleVideo` sous le titre). C'est un format court qui synthétise l'article, utile pour le partage et l'engagement.

### Comment elles sont fabriquées : Motion Canvas
Les vidéos sont fabriquées avec **Motion Canvas**, un outil qui permet de **créer des animations vidéo à partir de code** (plutôt qu'à la main dans un logiciel de montage). Le projet vidéo est **séparé** du site, dans le dossier `motion-canvas/` (avec sa propre configuration, son thème, ses scènes). On y « code » l'animation, on exporte une vidéo (`.mp4`), et on la dépose dans `public/videos/` du site.

> **Note historique.** Le projet utilisait initialement **Remotion** (une autre technologie de vidéo par le code, encore listée dans `package.json`). Il a basculé vers **Motion Canvas** pour les vidéos récap. Les deux reposent sur la même idée : décrire une vidéo par du code, ce qui la rend **reproductible** et **automatisable** (on peut alimenter l'animation avec les « points à retenir » de l'article).

### Pourquoi le service worker ignore les vidéos
Petit détail cohérent avec le [chapitre 13](13-pwa-hors-ligne.md) : le service worker **ne met pas les vidéos en cache** (elles sont trop volumineuses, elles satureraient la réserve locale). Elles sont donc toujours chargées depuis le réseau.

---

⬅️ Précédent : [14 — Les fonctionnalités interactives](14-fonctionnalites-interactives.md) | ➡️ Suivant : [16 — Le déploiement](16-deploiement.md)
