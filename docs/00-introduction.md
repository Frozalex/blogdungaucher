# 00 — Introduction : qu'est-ce que ce site ?

## Le projet en clair

**Blog d'un Gaucher** (adresse : `https://blogdungaucher.com`) est un **blog**, c'est-à-dire un site web sur lequel on publie régulièrement des articles. Son sujet : **les échecs**, mais abordés sous un angle inhabituel — pas des leçons pour « jouer mieux », plutôt des articles qui croisent les échecs avec la **science**, la **psychologie** et la **société**.

Le ton est celui de la vulgarisation sérieuse : chaque article est long (souvent plus de 2 000 mots), s'appuie sur de vraies études, et cite ses sources.

## Que trouve-t-on sur le site ?

Le contenu est rangé en quatre grandes **rubriques** (on dit aussi « catégories » ou « piliers ») :

1. **Science** — comment le cerveau voit, calcule et décide sur l'échiquier (mémoire, neurosciences, intelligence artificielle, mathématiques).
2. **Esprit** — le mental du joueur (concentration, confiance, gestion de la défaite, stress, burnout).
3. **Société** — la place des échecs dans le monde réel (école, prison, femmes, autisme, triche, argent, streaming).
4. **Grand oral** — une rubrique à part, destinée aux lycéens français qui préparent l'épreuve du « Grand oral » du baccalauréat en prenant les échecs comme sujet (avec des fiches méthode, du code, des plans).

À côté des articles de blog, le site propose aussi :

- des **dissertations** (textes plus longs et argumentés, dans une rubrique dédiée) ;
- une page **« Analyses »** prévue pour analyser des positions d'échecs avec un moteur de calcul (Stockfish) — fonctionnalité présente dans le code mais désactivée pour l'instant ;
- un **glossaire**, une page **« À propos »**, des pages légales (mentions légales, politique de confidentialité) ;
- des **PDF téléchargeables** pour les sujets de Grand oral.

## Les langues

Le site est pensé pour **trois langues** :

- **Français** (`/fr/…`) — la langue principale, complète.
- **Anglais** (`/en/…`) — traductions publiées au fur et à mesure.
- **Allemand** (`/de/…`) — préparé techniquement mais **pas encore exposé au public** (les traductions ne sont pas finalisées ; ces pages sont volontairement cachées des moteurs de recherche).

## Ce qui rend ce site particulier (techniquement)

Sans entrer dans le détail (les chapitres suivants le feront), voici ce qui caractérise ce site :

- **Il est « statique ».** Cela veut dire que toutes les pages sont fabriquées **à l'avance**, une fois pour toutes, et stockées comme de simples fichiers. Quand un visiteur arrive, on lui sert une page déjà prête. C'est extrêmement **rapide**, **robuste** (peu de choses peuvent casser) et **sûr** (pas de base de données à pirater). On reviendra longuement là-dessus.
- **Il publie tout seul.** Les articles sont écrits à l'avance avec une date de publication. Un programme automatique reconstruit le site chaque jour : le jour venu, l'article apparaît. Le rythme visé est **deux articles par semaine** (lundi et jeudi).
- **Il est très soigné pour Google et les IA.** Énormément de travail invisible sert à ce que les moteurs de recherche (Google) et les assistants IA (ChatGPT, Claude…) comprennent bien le contenu. C'est ce qu'on appelle le **référencement** ou **SEO**.
- **Il est rapide.** De nombreuses optimisations ont été faites pour que les pages s'affichent vite, même sur un téléphone avec une connexion lente.
- **Il s'installe comme une application.** Sur mobile, on peut « l'installer » sur l'écran d'accueil et il fonctionne même partiellement **hors ligne**. C'est ce qu'on appelle une **PWA**.

## Qui fabrique le site et comment il arrive sur Internet

Le site est **écrit sous forme de fichiers texte** sur l'ordinateur du créateur. Ces fichiers sont envoyés sur **GitHub** (une sorte de coffre-fort en ligne pour le code). De là, un service automatique (**GitHub Actions**) reconstruit le site et l'envoie sur un **serveur** (un ordinateur allumé en permanence, ici un « VPS ») qui le rend accessible au monde entier via le logiciel **nginx**.

Tout ce vocabulaire (« GitHub », « serveur », « nginx », « build »…) est expliqué dans le [chapitre suivant](01-concepts-de-base.md) et dans le [glossaire](17-glossaire.md). Pas de panique : on avance pas à pas.

---

➡️ Chapitre suivant : [01 — Concepts de base du web](01-concepts-de-base.md)
