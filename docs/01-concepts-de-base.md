# 01 — Concepts de base du web

Avant de plonger dans *ce* site précisément, posons les fondations. Ce chapitre explique les mots qui reviendront partout. Si tu connais déjà tout ça, saute au [chapitre 02](02-vue-ensemble-technique.md).

## 1. Qu'est-ce qu'une page web, concrètement ?

Une page web, c'est essentiellement **trois ingrédients** qui travaillent ensemble :

- **HTML** — le **contenu et la structure**. C'est le squelette : « ceci est un titre », « ceci est un paragraphe », « ceci est une image », « ceci est un lien ». Le HTML, seul, ressemble à un document Word sans aucune mise en forme.
- **CSS** — l'**apparence**. C'est l'habillage : les couleurs, les polices, les espacements, la disposition, le mode sombre. Le même HTML peut être rendu magnifique ou austère selon le CSS qu'on lui applique.
- **JavaScript** (souvent abrégé « JS ») — le **comportement**. C'est ce qui rend une page *interactive* : un menu qui s'ouvre, un bouton qui réagit, une recherche qui filtre des résultats, un thème qui bascule. Sans JavaScript, une page reste figée (ce qui n'est pas forcément un défaut, on y reviendra).

> **Image mentale.** HTML = les murs et les pièces d'une maison. CSS = la peinture, les meubles, la déco. JavaScript = l'électricité et la domotique (les choses qui *réagissent*).

Quand tu ouvres une page dans ton navigateur (Chrome, Firefox, Safari…), celui-ci lit ces trois ingrédients et les assemble pour afficher ce que tu vois.

## 2. « Site statique » vs « site dynamique » : la distinction la plus importante

C'est **le** concept central pour comprendre ce site.

### Un site **dynamique** (l'approche classique)

Imagine un grand site comme un journal en ligne ou un réseau social. Quand tu demandes une page, un **serveur** (un ordinateur distant) **fabrique la page à la volée**, au moment précis où tu la demandes : il interroge une **base de données**, assemble le contenu, et te renvoie le résultat. Chaque visite déclenche un petit travail de cuisine.

- ✅ Avantage : le contenu peut changer en temps réel, être personnalisé par utilisateur.
- ❌ Inconvénients : c'est plus lent, ça coûte plus cher (le serveur travaille en continu), c'est plus fragile (si la base de données tombe, le site tombe) et plus exposé aux piratages.

### Un site **statique** (l'approche de ce blog)

Ici, c'est l'inverse. **Toutes les pages sont cuisinées à l'avance**, une bonne fois pour toutes, et rangées comme de simples fichiers `.html` figés. Quand un visiteur arrive, le serveur n'a aucun travail à faire : il lui tend la page déjà prête, comme on tend un plat déjà cuisiné posé sur une étagère.

- ✅ Avantages : **très rapide** (rien à calculer), **très robuste** (pas de base de données qui peut tomber), **très sûr** (rien à pirater côté serveur), **pas cher** à héberger.
- ❌ Inconvénient : pour changer le contenu, il faut **refabriquer** les pages concernées (on appelle ça « rebuilder »). Ce n'est pas un problème pour un blog dont les articles ne changent pas toutes les secondes.

**Ce site est statique.** C'est un choix délibéré : un blog est exactement le type de site qui en profite le plus.

## 3. Le « build » : fabriquer le site

Puisque les pages sont cuisinées à l'avance, il y a forcément un moment où on les cuisine. Ce moment s'appelle le **build** (« construction » en anglais).

Le build, c'est un programme qu'on lance et qui :

1. lit tous les articles (écrits dans des fichiers texte) ;
2. lit les gabarits, les composants, les styles ;
3. **assemble tout ça** en centaines de fichiers HTML/CSS/JS finis ;
4. les dépose dans un dossier spécial appelé **`dist`** (pour « distribution »).

Ce dossier `dist` est **le site fini**, prêt à être mis en ligne. Sur ce projet, le build se lance avec la commande `npm run build` (on détaillera).

> **Image mentale.** Écrire les articles = écrire les recettes. Le build = le service du restaurant qui prépare tous les plats d'avance. `dist` = le buffet garni où les clients se servent.

## 4. Le navigateur, le serveur, l'« hébergement »

- **Le navigateur** : le logiciel sur l'appareil du visiteur (Chrome, Safari…). C'est lui qui *affiche* les pages.
- **Le serveur** : un ordinateur allumé 24h/24, quelque part dans un centre de données, qui **détient les fichiers du site** et les **envoie** aux navigateurs qui les demandent. Ici, c'est un **VPS** (« Virtual Private Server », un serveur privé virtuel — en gros, une portion d'un gros ordinateur louée à un hébergeur).
- **nginx** (prononcé « engine-X ») : le **logiciel qui tourne sur le serveur** et dont le métier est précisément de recevoir les demandes des navigateurs et de leur servir les bons fichiers. C'est le « serveur web » au sens logiciel.
- **Le nom de domaine** (`blogdungaucher.com`) : l'adresse lisible que tu tapes. Un système mondial (le DNS) traduit ce nom en l'adresse technique du serveur.

## 5. Git et GitHub : la sauvegarde et l'historique du code

Quand on fabrique un site, on modifie sans cesse des fichiers. Pour ne rien perdre et garder la trace de chaque changement, on utilise **Git**.

- **Git** est un outil qui prend des **photos** (on dit des **commits**) de l'ensemble des fichiers à un instant donné. On peut revenir à n'importe quelle photo passée, comparer, annuler. C'est une machine à remonter le temps pour le code.
- **GitHub** est un site web qui **héberge** ces photos en ligne (le « dépôt », en anglais *repository* ou *repo*). C'est à la fois une sauvegarde, un lieu de collaboration, et — ici — le **point de départ de la mise en ligne automatique**.

Concrètement : le créateur modifie des fichiers, prend une photo (`git commit`), l'envoie sur GitHub (`git push`), et **ça déclenche** la mise à jour du site (voir [chapitre 16](16-deploiement.md)).

## 6. Le « terminal » et les « commandes »

Beaucoup d'opérations de développement se font non pas en cliquant, mais en **tapant des commandes** dans une fenêtre noire appelée **terminal** (ou « ligne de commande »). Par exemple :

- `npm run build` → fabrique le site.
- `npm run dev` → lance une version de test sur ton ordinateur pour voir le résultat en direct pendant qu'on travaille.
- `git commit` → prend une photo du code.

Ces commandes sont juste une autre façon de donner des ordres à l'ordinateur, plus précise et plus rapide (pour qui sait s'en servir) que la souris.

## 7. `npm`, les « paquets » et `package.json`

Personne ne réécrit tout à la main. On s'appuie sur des **briques toutes faites** créées par d'autres : des **paquets** (en anglais *packages*). Par exemple, le moteur d'échecs Stockfish, l'outil qui transforme les formules mathématiques en jolies équations (KaTeX), ou le framework Astro lui-même.

- **npm** (« Node Package Manager ») est l'outil qui **télécharge et gère** ces paquets.
- Le fichier **`package.json`** est la **liste de courses** du projet : il énumère tous les paquets nécessaires et définit les commandes raccourcies (comme `npm run build`).
- Les paquets téléchargés atterrissent dans un énorme dossier `node_modules/` (qu'on ne touche jamais à la main et qu'on ne sauvegarde pas dans Git).

## 8. Récapitulatif visuel du cycle de vie

```
   ÉCRITURE                 BUILD                    MISE EN LIGNE
┌───────────────┐    ┌──────────────────┐    ┌────────────────────────┐
│ Fichiers texte│    │  npm run build   │    │  GitHub → GitHub        │
│ (articles,    │──► │  assemble tout   │──► │  Actions → serveur VPS  │──► Visiteurs
│  gabarits,    │    │  → dossier dist/ │    │  (nginx sert les pages) │
│  styles…)     │    │                  │    │                         │
└───────────────┘    └──────────────────┘    └────────────────────────┘
   sauvegardé
   avec Git/GitHub
```

Avec ces fondations, on peut maintenant regarder **quels outils précis** ce site utilise.

---

⬅️ Précédent : [00 — Introduction](00-introduction.md) | ➡️ Suivant : [02 — Vue d'ensemble technique](02-vue-ensemble-technique.md)
