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

### Comment ajouter une vidéo
Les vidéos sont produites avec un outil externe, puis déposées au format **MP4** dans `public/videos/`. Ajouter ensuite le champ `summaryVideo: /videos/summary-<slug-article>.mp4` au frontmatter de l'article, et éventuellement `summaryVideoNote` pour sa légende. Les pages vérifient que le fichier existe avant d'afficher le lecteur HTML natif, dans les trois langues.

> **Note historique.** Le projet a utilisé Remotion puis Motion Canvas. Ces deux outils de production vidéo ont été retirés du dépôt ; Motion Canvas a été supprimé le 18 octobre 2026.

### Pourquoi le service worker ignore les vidéos
Petit détail cohérent avec le [chapitre 13](13-pwa-hors-ligne.md) : le service worker **ne met pas les vidéos en cache** (elles sont trop volumineuses, elles satureraient la réserve locale). Elles sont donc toujours chargées depuis le réseau.

---

⬅️ Précédent : [14 — Les fonctionnalités interactives](14-fonctionnalites-interactives.md) | ➡️ Suivant : [16 — Le déploiement](16-deploiement.md)
