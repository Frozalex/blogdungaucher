# 12 — La performance (vitesse)

La **vitesse d'affichage** est un sujet à part entière. Une page lente fait fuir les visiteurs **et** est pénalisée par Google. Ce site a fait l'objet d'un travail d'optimisation méticuleux. Ce chapitre explique les principes et les optimisations concrètes.

## Pourquoi la vitesse compte

- **Les visiteurs** abandonnent une page qui met plus de 2-3 secondes à s'afficher, surtout sur mobile.
- **Google** mesure officiellement la vitesse (via des indicateurs appelés **Core Web Vitals**) et en tient compte dans le classement.
- L'indicateur le plus suivi est le **LCP** (« Largest Contentful Paint ») : le temps que met **le plus gros élément visible** (souvent le grand titre ou l'image principale) à apparaître. Objectif : moins de 2,5 secondes.

## L'avantage de départ : un site statique

Comme expliqué au [chapitre 01](01-concepts-de-base.md), un site **statique** part déjà gagnant : les pages sont pré-fabriquées, le serveur n'a rien à calculer, il sert du HTML prêt. Et Astro envoie **très peu de JavaScript** (le poids le plus coûteux). C'est la fondation de la rapidité du site.

## Comment on mesure

Le script `scripts/perf-measure.mjs` pilote un **navigateur invisible** (Puppeteer) qui charge les pages et chronomètre. Il teste **deux profils** :
- **PC** (connexion rapide).
- **Mobile** « bridé » : processeur ralenti 4× et connexion « Slow 4G » lente, pour simuler un vrai téléphone d'entrée de gamme. C'est le scénario le plus exigeant.

Comme les mesures varient, on en fait plusieurs (5-6) et on prend la médiane.

## Les optimisations concrètes appliquées

Voici les améliorations réelles réalisées sur le site (consignées dans les notes du projet), expliquées simplement.

### 1. Ne charger les maths que là où il y en a
KaTeX (l'outil qui dessine les formules) a besoin d'un fichier de style de ~23 ko qui **bloque l'affichage** le temps d'être chargé. Or seules les pages d'**articles** contiennent des formules. On l'a donc **retiré** du gabarit global et **importé uniquement** dans les pages d'articles. Résultat : les ~30 pages sans formules (accueil, rubriques, listes…) s'affichent plus vite. **Règle à respecter : ne jamais réimporter KaTeX globalement.**

### 2. Externaliser le dictionnaire de traduction
Le dictionnaire de traduction de l'interface (~10 ko) était auparavant **recopié dans chaque page**. On l'a déplacé dans **un seul fichier** (`public/i18n-dict.js`) que le navigateur télécharge **une fois** et garde en cache. Toutes les pages suivantes le réutilisent sans le recharger. (Voir [chapitre 08](08-i18n.md).)

### 3. Alléger le logo
Le logo (un SVG) a été **optimisé** (avec des outils SVGO) de **29,6 ko à 10,3 ko** (−65 %), sans changement visible, en supprimant les données inutiles du fichier.

### 4. Ne pas animer l'élément le plus important
Sur l'accueil, le grand titre (le « hero ») avait une **animation d'apparition en fondu**. Problème : cet élément est précisément celui que mesure le LCP. L'animer **repoussait** son apparition à ~5 secondes sur mobile. En **supprimant l'animation** de cet élément (il s'affiche immédiatement), le **LCP mobile est passé de ~5 s à ~2,9 s** (−41 %). Les sections plus bas gardent leurs animations, sans pénalité.

### 5. Précharger la police des titres
La police des titres (Space Grotesk, ~22 ko) est présente dans le grand titre de chaque page. On demande au navigateur de la **précharger en priorité** (`<link rel="preload">`) pour qu'elle soit prête quand le titre s'affiche. En revanche, on **ne précharge pas** la police décorative Fraunces (80 ko), trop lourde et utile seulement sur l'accueil.

### Bilan chiffré
Cumul de ces optimisations : poids HTML total réduit d'environ 10 %, CSS bloquant de l'accueil ramené de 94 ko à 66 ko, et surtout **LCP mobile de l'accueil divisé presque par deux** (de ~5 s à ~2,9 s).

## Les stratégies de chargement

- **Images en chargement différé (« lazy loading »)** : les images plus bas dans la page ne se chargent que quand on approche en défilant, pas toutes d'un coup au départ.
- **Le « préchargement » des pages liées** : Astro peut précharger les pages vers lesquelles pointent les liens visibles, pour que le clic soit instantané. C'est un compromis (ça consomme un peu de données mobiles), surveillé dans les réglages.
- **Le cache du service worker** (voir [chapitre 13](13-pwa-hors-ligne.md)) : une fois une ressource chargée, elle est gardée localement et resservie instantanément les fois suivantes.

## Un piège de mesure à connaître

Détail amusant noté dans le projet : lors des mesures, un fichier « parasite » de 193 ko apparaissait dans le réseau. Enquête faite, ce n'était **pas** le site, mais une **injection de l'antivirus Kaspersky** installé localement. Morale : quand on mesure la performance, il faut savoir distinguer ce qui vient du site de ce qui vient de l'environnement de test.

---

⬅️ Précédent : [11 — Les scripts](11-scripts.md) | ➡️ Suivant : [13 — L'application installable et le hors-ligne (PWA)](13-pwa-hors-ligne.md)
