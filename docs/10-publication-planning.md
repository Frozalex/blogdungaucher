# 10 — Le calendrier de publication

L'une des particularités les plus astucieuses du site : il **publie tout seul, deux fois par semaine**, sans intervention. Ce chapitre explique comment.

## L'idée : la publication programmée

On a vu (au [chapitre 04](04-contenu-articles.md)) que chaque article a une **date de publication** (`publishDate`), et que `getAllPosts()` ne montre que les articles **dont la date est passée**.

Conséquence : on peut écrire un article **à l'avance**, lui mettre une date dans le futur (« 24 septembre 2026 »), et il restera invisible jusqu'à cette date. Encore faut-il que le site soit **reconstruit** ce jour-là pour que l'article devienne visible. C'est le rôle d'un **rebuild quotidien automatique** (voir [chapitre 16](16-deploiement.md)) : chaque jour, le site se reconstruit ; les articles dont la date est atteinte apparaissent.

> **Image mentale.** C'est comme programmer des publications sur les réseaux sociaux : tu prépares tout, tu fixes les dates, et ça part tout seul.

## La règle : 2 articles par semaine (lundi + jeudi)

Le rythme éditorial repose sur **deux files indépendantes**, en heure UTC (le fuseau de référence) :

| Jour | Ce qui sort | Cadence |
|---|---|---|
| **Lundi** et **jeudi** | La file générale, hors série | 2 par semaine, rubriques différentes |
| **Mardi** | La série éditoriale en cours (Psychologie, puis Moteur en Python) | 1 par semaine, sans trou |

Soit trois articles par semaine tant que la file générale tient, puis le seul mardi de la série. Cette régularité est importante : Google et les lecteurs apprécient un rythme stable.

La correspondance mardi ⇄ série est **stricte dans les deux sens**. Un article de série ne peut pas sortir un lundi, et un article hors série ne peut pas occuper un mardi. C'est ce qui rend la règle vérifiable automatiquement.

> **Qu'est-ce qu'un « article de série » ?** Un slug déclaré dans un fichier `src/data/serie-*.ts`. C'est [`scripts/series-slugs.mjs`](../scripts/series-slugs.mjs) qui fait le lien, et c'est le seul endroit à toucher pour ajouter une série.

Pour garantir cette régularité, le projet a des **garde-fous automatiques** : des petits programmes qui **vérifient** et **réorganisent** les dates.

## Les fichiers du système

### `scripts/publish-schedule-constants.mjs` — les réglages
Ce petit fichier définit deux dates de référence :
- **`SCHEDULE_GRID_ANCHOR_MONDAY`** — le lundi à partir duquel la règle stricte s'applique.
- **`RESCHEDULE_FROM`** — une date de « gel » : avant elle, les dates ne sont pas touchées (ce sont des articles déjà publiés, qu'on ne réécrit jamais).

Avancer ces deux dates, c'est dire « la validation ne concerne désormais que le futur ».

### `scripts/check-publish-weekly.mjs` — le contrôleur
Ce script **vérifie** que le calendrier respecte la règle. Pour tous les articles à venir, il contrôle que :
- chaque date tombe un **lundi, un mardi ou un jeudi** ;
- les **mardis** portent des articles de série, et **seulement** eux ;
- les mardis de série **se suivent sans trou** (une série qui saute une semaine est une erreur, pas un choix) ;
- les semaines de la file hors série portent **exactement 2** articles, de **rubriques différentes**, sur le lundi et le jeudi ;
- la **dernière** semaine de la file hors série a le droit de n'en porter qu'un, le stock n'étant pas forcément pair ;
- une fois la file hors série épuisée, les semaines suivantes n'ont **que** leur mardi, et c'est normal ;
- aucune date n'est utilisée deux fois.

**Ce contrôle fait partie du build** (`npm run build`). Si la règle est violée, **le build échoue** et signale précisément le problème. C'est un filet de sécurité : impossible de mettre en ligne un calendrier bancal.

### `scripts/apply-future-publish-schedule.mjs` — le réorganisateur
Si on veut **(ré)assigner proprement** les dates de tous les articles à venir, ce script le fait automatiquement. Il remplit les **deux files séparément** : les articles de série prennent les mardis consécutifs, les autres les lundis et jeudis deux par deux.

Point important : il **ne réordonne rien**. L'ordre de chaque file est celui des `publishDate` actuelles, parce que c'est lui qui encode les décisions éditoriales déjà prises (priorité de trafic pour la série Psychologie, alternance de rubriques pour la file générale). Le script ne fait que reposer les dates sur la grille.

On le lance d'abord en mode **`--dry-run`** (« essai à blanc » : il montre ce qu'il *ferait* sans rien modifier), puis en vrai si le résultat convient. Il ne touche **jamais** aux articles déjà publiés.

### `scripts/pair-week-themes.mjs` — l'appariement de la semaine
Problème : deux articles de la même rubrique peuvent tomber le lundi et le jeudi de la même semaine. Ce script **réordonne** quels articles tombent sur quelles dates (sans changer l'ensemble des dates) jusqu'à ce qu'aucune semaine ne répète une rubrique.

Il ne travaille que sur la **file hors série**. Les mardis sont hors de son périmètre : une série est seule sur son jour, aucune collision de rubrique n'y est possible, et son ordre est imposé par la série elle-même.

Sa particularité : il part de l'**ordre chronologique en place** et ne fait que les permutations **strictement nécessaires**. Il choisit aussi, dans chaque semaine, lequel des deux articles passe le lundi, de façon à ne pas répéter non plus la rubrique entre un jeudi et le lundi suivant. Mode `--dry-run` disponible.

*Note historique : `PINNED_LAST` servait à épingler le hub de la série Psychologie sur le dernier créneau. La liste est vide depuis le passage des séries au mardi, ce rang de clôture étant désormais garanti par l'ordre chronologique que préserve le réorganisateur.*

### `scripts/interleave-future-themes.mjs` — l'alternateur global (historique)
Même famille, approche plus brutale : il étale chaque rubrique uniformément sur toute la timeline (positions fractionnaires) sans se soucier des semaines. Il bouscule donc l'ordre éditorial. Comme `pair-week-themes.mjs`, il ignore les articles de série. Conservé pour repartir de zéro sur une file devenue très mono-thématique ; au quotidien, préférer `pair-week-themes.mjs`.

## Un détail technique important : la lecture récursive

Les articles sont rangés en **sous-dossiers** par rubrique (`science/`, `esprit/`…). Un piège classique : un script qui lit `src/content/blog/` **sans descendre dans les sous-dossiers** ne voit **aucun** article. Ces scripts utilisent donc une lecture **récursive** (une fonction `walk()` qui explore tous les sous-dossiers). C'est un détail, mais c'est exactement le genre de bug qui peut rendre un garde-fou silencieusement inutile.

## La commande de vérification

Avant de publier de nouveaux articles, on lance :

```
npm run check:publish-weekly       # vérifie la grille
npm run apply:publish-schedule -- --dry-run   # voit la réorganisation proposée
npm run pair:week-themes -- --dry-run         # voit l'appariement des rubriques
```

L'ordre compte : `apply:publish-schedule` **pose les dates**, `pair:week-themes` décide ensuite **quel article va sur quelle date**. Faire l'inverse annulerait l'appariement.

Le contrôleur récapitule les deux files séparément :

```
OK : 76 billet(s) sur la grille (≥ 2026-08-31).
  mardi   — séries     : 39 billet(s), jusqu'au 2027-05-25
  lun/jeu — hors série : 37 billet(s) sur 19 semaine(s), jusqu'au 2027-01-04
```

Cette sortie se lit aussi comme un tableau de bord du stock : ici, la file hors série s'épuise début janvier 2027, quatre mois avant la fin de la série du mardi. Passé cette date, le blog publiera un seul article par semaine tant que rien de neuf n'aura été écrit.

## Ajouter une nouvelle série

1. Créer `src/data/serie-<nom>.ts` sur le modèle des deux existants, avec un champ `slug` par article.
2. Déclarer la série dans [`scripts/series-slugs.mjs`](../scripts/series-slugs.mjs), **dans l'ordre où elle prendra les mardis**. Une série placée après une autre commence le mardi qui suit le dernier article de celle-ci.
3. Déposer les articles dans `src/content/blog/<rubrique>/` avec une `publishDate` provisoire postérieure à celles de la série précédente, puis lancer `apply:publish-schedule`, qui posera les vrais mardis.

Rien d'autre : le contrôleur, le réorganisateur et l'appariement lisent tous les trois la même source.

---

⬅️ Précédent : [09 — Le référencement](09-seo.md) | ➡️ Suivant : [11 — Les scripts d'automatisation](11-scripts.md)
