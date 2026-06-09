# 10 — Le calendrier de publication

L'une des particularités les plus astucieuses du site : il **publie tout seul, deux fois par semaine**, sans intervention. Ce chapitre explique comment.

## L'idée : la publication programmée

On a vu (au [chapitre 04](04-contenu-articles.md)) que chaque article a une **date de publication** (`publishDate`), et que `getAllPosts()` ne montre que les articles **dont la date est passée**.

Conséquence : on peut écrire un article **à l'avance**, lui mettre une date dans le futur (« 24 septembre 2026 »), et il restera invisible jusqu'à cette date. Encore faut-il que le site soit **reconstruit** ce jour-là pour que l'article devienne visible. C'est le rôle d'un **rebuild quotidien automatique** (voir [chapitre 16](16-deploiement.md)) : chaque jour, le site se reconstruit ; les articles dont la date est atteinte apparaissent.

> **Image mentale.** C'est comme programmer des publications sur les réseaux sociaux : tu prépares tout, tu fixes les dates, et ça part tout seul.

## La règle : 2 articles par semaine (lundi + jeudi)

Le rythme éditorial visé est de **deux articles par semaine**, publiés le **lundi** et le **jeudi** (en heure UTC, le fuseau de référence). Cette régularité est importante : Google et les lecteurs apprécient un rythme stable.

Pour garantir cette régularité, le projet a des **garde-fous automatiques** : des petits programmes qui **vérifient** et **réorganisent** les dates.

## Les fichiers du système

### `scripts/publish-schedule-constants.mjs` — les réglages
Ce petit fichier définit deux dates de référence :
- **`SCHEDULE_GRID_ANCHOR_MONDAY`** — le lundi à partir duquel la règle stricte s'applique.
- **`RESCHEDULE_FROM`** — une date de « gel » : avant elle, les dates ne sont pas touchées (ce sont des articles déjà publiés, qu'on ne réécrit jamais).

Avancer ces deux dates, c'est dire « la validation ne concerne désormais que le futur ».

### `scripts/check-publish-weekly.mjs` — le contrôleur
Ce script **vérifie** que le calendrier respecte la règle. Pour tous les articles à venir, il contrôle que :
- chaque date tombe bien un **lundi ou un jeudi** ;
- chaque semaine a **exactement 2** articles (jamais 1, jamais 3) ;
- le nombre total est **pair** (sinon il manquerait un article quelque part) ;
- aucune date n'est utilisée deux fois.

**Ce contrôle fait partie du build** (`npm run build`). Si la règle est violée, **le build échoue** et signale précisément le problème. C'est un filet de sécurité : impossible de mettre en ligne un calendrier bancal.

### `scripts/apply-future-publish-schedule.mjs` — le réorganisateur
Si on veut **(ré)assigner proprement** les dates de tous les articles à venir sur la grille lundi/jeudi, ce script le fait automatiquement. On le lance d'abord en mode **`--dry-run`** (« essai à blanc » : il montre ce qu'il *ferait* sans rien modifier), puis en vrai si le résultat convient. Il ne touche **jamais** aux articles déjà publiés.

### `scripts/interleave-future-themes.mjs` — l'alternateur de rubriques
Problème possible : la file des prochains articles pourrait être « 10 articles Science d'affilée ». Ce script **réordonne** quels articles tombent sur quelles dates (sans changer l'ensemble des dates) pour **alterner les rubriques** (Science, Esprit, Société…) et offrir de la variété au lecteur. Lui aussi a un mode `--dry-run`.

## Un détail technique important : la lecture récursive

Les articles sont rangés en **sous-dossiers** par rubrique (`science/`, `esprit/`…). Un piège classique : un script qui lit `src/content/blog/` **sans descendre dans les sous-dossiers** ne voit **aucun** article. Ces scripts utilisent donc une lecture **récursive** (une fonction `walk()` qui explore tous les sous-dossiers). C'est un détail, mais c'est exactement le genre de bug qui peut rendre un garde-fou silencieusement inutile.

## La commande de vérification

Avant de publier de nouveaux articles, on lance :

```
npm run check:publish-weekly       # vérifie la grille
npm run apply:publish-schedule -- --dry-run   # voit la réorganisation proposée
```

Un message « OK : N billets sur la grille, 2 par semaine » confirme que tout est bon.

---

⬅️ Précédent : [09 — Le référencement](09-seo.md) | ➡️ Suivant : [11 — Les scripts d'automatisation](11-scripts.md)
