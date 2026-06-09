# 07 — Mise en page et design

Ce chapitre explique **l'habillage commun** à toutes les pages : le gabarit, les couleurs, les polices, le mode sombre.

## Le gabarit commun : `BaseLayout.astro`

Toutes les pages du site sont coulées dans un même **moule** : le fichier `src/layouts/BaseLayout.astro`. Une page typique se contente de dire « utilise BaseLayout, et voici mon contenu au milieu ». BaseLayout fournit tout le reste :

- **Le `<head>`** — la partie *invisible* d'une page HTML, qui contient les informations destinées au navigateur et à Google (titre, description, icônes, balises de partage social, données structurées…). C'est énorme et crucial pour le SEO (voir [chapitre 09](09-seo.md)).
- **La barre de navigation** (`Navbar`) en haut.
- **Le contenu de la page** au milieu (le « trou » que chaque page remplit).
- **Le pied de page** (`Footer`) en bas.
- **Les scripts de base** : mode sombre, multilingue, gestion du consentement, enregistrement de l'« application » (PWA).

En clair : **BaseLayout, c'est le cadre ; chaque page, c'est le tableau qu'on met dedans.**

### Ce que BaseLayout reçoit (ses « props »)

Chaque page peut passer à BaseLayout des informations : le `title`, la `description`, l'image de partage (`image`), la langue (`lang`), le type (`article` ou `website`), les données structurées, les liens vers les autres langues, etc. BaseLayout s'en sert pour fabriquer un `<head>` parfaitement adapté à chaque page.

## Le système de design : `global.css`

Tout l'aspect visuel est centralisé dans `src/styles/global.css` (plus de 1 100 lignes). En haut de ce fichier, on trouve les **« tokens de design »** : des **variables** qui définissent l'identité visuelle une bonne fois pour toutes. Le reste du CSS s'y réfère, si bien qu'on peut changer toute l'ambiance du site en modifiant quelques lignes.

> **Pourquoi des variables ?** Imagine que le vert de la marque soit écrit en dur à 200 endroits. Le changer serait un cauchemar. Avec une variable `--green`, on le définit une fois, et les 200 endroits suivent automatiquement.

### Les couleurs

```css
--bg:          #fcfaf6;   /* le fond, un blanc cassé chaud (couleur "papier") */
--surface:     #ffffff;   /* le fond des cartes, blanc pur */
--text-main:   #18181b;   /* le texte principal, presque noir */
--text-muted:  …66%;      /* le texte secondaire, gris */
--green:       #3d8b37;   /* LA couleur de la marque : un vert profond */
```

Le site a une identité **« papier chaud + vert »** : des fonds crème, du texte sombre, et un vert reconnaissable pour les liens et les accents. Chaque rubrique a **sa propre couleur d'accent** (définie dans `src/data/site.ts`) : bleu pour la Science, orange pour l'Esprit, turquoise pour la Société, violet pour le Grand oral.

### Les polices d'écriture

Le site utilise **trois polices**, chacune avec un rôle :

```css
--font-display: "Space Grotesk"   /* les titres : moderne, géométrique */
--font-body:    "Outfit"          /* le corps de texte : lisible, neutre */
--font-serif:   "Fraunces"        /* accents élégants : titres d'articles en italique */
```

Ces polices sont chargées via les paquets `@fontsource-variable/*`. Ce sont des **polices variables** : un seul fichier couvre toutes les graisses (du fin au gras), ce qui économise du poids.

### Les autres tokens

- **Ombres** (`--shadow-xs` à `--shadow-lg`) — pour donner du relief aux cartes.
- **Arrondis** (`--radius-sm` à `--radius-pill`) — la rondeur des coins.
- **Largeur du contenu** (`--container: 1140px`) — la largeur maximale d'une colonne de lecture confortable.
- **Animations** (`--ease-*`, `--motion-*`) — les courbes et durées des animations, pour un mouvement cohérent partout.

## Le mode sombre (clair / sombre)

Le site propose un **thème clair** et un **thème sombre**, basculables par un bouton dans la barre de navigation. Trois subtilités intéressantes :

1. **Pas de « flash ».** Normalement, si on attend que la page soit chargée pour appliquer le thème sombre, l'utilisateur voit un bref éclair blanc avant que le sombre s'applique. Pour l'éviter, un tout petit script est placé **tout en haut** du `<head>` (avant l'affichage) : il lit le choix mémorisé (ou la préférence du système d'exploitation) et applique le thème **avant que la page ne s'affiche**. C'est le script « anti-flash ».
2. **Le choix est mémorisé** dans le navigateur (`localStorage`), donc il persiste d'une visite à l'autre.
3. **Respect du système.** Si l'utilisateur n'a jamais choisi, le site suit la préférence de son appareil (mode sombre du téléphone, par exemple).

Techniquement, le thème actif est inscrit dans un attribut `data-theme="dark"` sur la page, et le CSS adapte toutes les couleurs en conséquence.

## La typographie des articles

Le corps des articles bénéficie d'un soin particulier (toujours dans `global.css`) :

- une **lettrine** (la première lettre du premier paragraphe, agrandie et colorée, comme dans un vieux livre) ;
- des titres en **italique élégant** (police Fraunces) ;
- des **citations** en encadré coloré ;
- des **liens** soulignés d'un trait coloré qui s'anime au survol ;
- une **largeur de lecture** limitée pour le confort des yeux.

## Un piège technique à connaître : le CSS « scopé »

Détail subtil mais important (noté dans les mémoires du projet). Astro **isole** par défaut le style de chaque composant (le style « ne fuit pas » d'un composant à l'autre). Mais quand du HTML est **injecté dynamiquement par du JavaScript** (par exemple les résultats de recherche, ou un message de succès de la newsletter), ce HTML **échappe** à cette isolation et risque de s'afficher sans style. La parade utilisée dans le projet : styliser ces morceaux avec une règle spéciale `:global(...)` placée sous un parent identifié. Ce n'est pas un détail à connaître pour utiliser le site, mais c'est une source de bugs récurrente que l'équipe technique surveille.

---

⬅️ Précédent : [06 — Les composants](06-composants.md) | ➡️ Suivant : [08 — Le multilingue (i18n)](08-i18n.md)
