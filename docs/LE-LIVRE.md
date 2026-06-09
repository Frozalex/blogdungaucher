# Le Livre du Blog d'un Gaucher

*Récit d'un site qui ne s'est pas fait en un jour.*

---

## Avant-propos

Cette documentation a deux têtes.

La première, technique, est rangée dans les chapitres `00-introduction.md` à `17-glossaire.md`. Elle explique comment le site fonctionne aujourd'hui : où sont les fichiers, à quoi sert chaque composant, comment marche le multilingue, ce que le service worker met en cache, par où passe une URL avant d'arriver dans le navigateur. C'est une documentation de référence : on l'ouvre quand on cherche quelque chose de précis.

La seconde, celle que tu tiens, est différente. Ce n'est pas un manuel. C'est un récit. Elle raconte, dans l'ordre des choses, comment ce site a été construit, refondu, corrigé, étendu, parfois saboté par ses propres bonnes idées, parfois sauvé par un commit du dimanche soir. Elle parle des jours où tout cassait, des semaines où rien ne semblait avancer, des nuits où une décision en remplaçait une autre sans bruit.

Le récit s'appuie sur les 179 commits du dépôt à la date du 8 juin 2026. Il n'invente rien : chaque scène est datée, chaque décision est traçable. Mais il raconte. Il met en intrigue ce que `git log` ne fait qu'aligner. On le lit comme un livre : du début à la fin, ou par chapitres choisis.

Le projet a démarré le 27 avril 2026. Le récit commence là.

---

# Partie I — Les fondations

## Chapitre 1 — Le commit zéro

Le 27 avril 2026 au matin, le dépôt n'existait pas. Le 27 avril 2026 au soir, il y avait neuf commits.

Le premier s'appelle, par convention, *Initial commit*. C'est le moment où le dossier `blog-gaucher/` quitte le statut d'idée pour devenir un projet versionné. Astro est posé. Les premières routes sont écrites. Un blog vide attend du contenu.

L'intention, à ce stade, est déjà formée. Le site sera **un blog d'échecs en français**, sobre, lisible, indexable par Google, lisible par les assistants IA, déployable sur un hébergeur modeste. Pas une application React lourde, pas une plateforme communautaire, pas un agrégateur. Un blog. Un éditorial. Un endroit où des textes vivent.

Astro est choisi pour une raison simple : il génère des pages HTML figées. Quand un visiteur tombe sur un article, il reçoit du HTML déjà fabriqué, prêt à lire, sans qu'aucun JavaScript ne doive s'exécuter pour qu'apparaisse un titre. Cette sobriété aura un prix (chaque modification du contenu déclenche une reconstruction complète du site), mais elle a une vertu : un site Astro qui tient debout aujourd'hui tient debout dans dix ans.

Le deuxième commit met les dépendances à jour. Le troisième répare une régression d'Astro v6 dans la configuration des `content collections`. Cette régression est instructive : avant même que la première ligne d'article n'existe, le projet a déjà rencontré son premier bug. La leçon est notée mentalement : *la stack a un coût d'entretien, même quand on choisit la plus sobre du marché*.

Les commits suivants installent la CI. Un workflow GitHub Actions est branché sur le dépôt. Sa mission : pousser les fichiers du site, à chaque commit sur `main`, vers un VPS distant, par SSH. Ça marche. Ça marchera longtemps. Ça finira, un jour, par ne plus marcher du tout. Mais on n'en est pas là.

Une clé SSH locale traîne dans le projet. Elle est repérée. Elle est ignorée par `.gitignore`. Les règles d'ignore sont élargies une seconde fois pour couvrir toutes les variantes. La culture du dépôt s'installe en silence : **on ne laisse jamais une clé sortir**.

## Chapitre 2 — La nuit des routes anglaises

Toujours le 27 avril. L'interactivité du site, qui marchait jusqu'à présent, casse d'un coup. La cause est tracée : une mauvaise gestion du `<script>` côté layout. Le correctif passe en même temps que l'ajout des routes anglaises (`/en/`).

L'ajout des routes anglaises est une décision lourde. À cette minute, le site n'a pas de contenu en anglais. Pas une ligne. Pourtant, on en pose la structure d'URL, on prépare le composant `BaseLayout` pour accepter une langue, on commence à penser en multilingue avant même d'écrire la première traduction. Cette inversion de l'ordre habituel (poser l'architecture avant d'avoir le besoin) ne se discute pas : si l'architecture vient après, elle est presque impossible à remettre.

Les icônes de la PWA sont actualisées en foulée, deux fois. La deuxième fois pour corriger une « mirror » asymétrique entre les icônes générées et celles servies en production. C'est un détail. Mais sur une PWA installable, un détail comme une icône de mauvaise taille tue l'installation sur certains téléphones.

À la fin du 27 avril, le projet a : un blog vide, une CI fonctionnelle, des routes anglaises mortes mais prêtes, une PWA correcte, un dépôt propre.

## Chapitre 3 — Le tournant multilingue (28 avril)

Le lendemain est un grand jour. Cinq commits sérieux tombent.

Le premier introduit toute l'architecture SEO multilingue : `hreflang`, Schema.org enrichi (Article, BreadcrumbList, FAQ), densité sémantique calibrée, maillage entre piliers thématiques. Le commit suit : « Architecture multilingue /fr /en /de, sitemap hreflang, ajustements SEO addiction ». L'allemand est ajouté à cette occasion. Il restera longtemps en sommeil : ses traductions n'existent pas encore, donc ses pages naissent avec un `noindex` qui dit à Google : *ne référence pas, ne juge pas*.

Le deuxième commit corrige une régression de pagination : les liens `prev`/`next` doivent être en chemins relatifs, pas en URLs absolues. Astro, par défaut, génère des URLs absolues qui finissent par contenir le mauvais hôte (`localhost:4321` au lieu du domaine de production). Une fonction de normalisation passe partout.

Le troisième commit crée **la rubrique Grand oral**. C'est une décision éditoriale forte. Le baccalauréat français approche pour des lecteurs concrets. Le site veut être utile à ce moment précis. Une nouvelle catégorie apparaît, `/grand-oral/`, avec ses propres règles :

- elle est **réservée au français** (le Grand oral est une épreuve française) ;
- elle est exclue des hreflang étrangers ;
- les articles déjà existants qui parlent de Maths ou de NSI sont recatégorisés dedans.

Cette rubrique va devenir, sur six semaines, un sous-site dans le site. Mais on ne le sait pas encore. Pour l'instant, c'est juste un nouveau dossier.

Le quatrième commit est un mélange : `chore: origine site figée, vérif dist après build, KaTeX mobile, article maths (Shannon)`. Il dit beaucoup. *Origine site figée* : on a posé le domaine de production en dur dans la config, parce qu'à force de basculer entre URLs de prévisualisation et URL réelle, le sitemap émettait n'importe quoi. *Vérif dist* : un script post-build vérifie qu'il n'y a pas eu de régression silencieuse. *KaTeX mobile* : les formules mathématiques débordaient sur les petits écrans. *Article maths (Shannon)* : un premier article sur la complexité du jeu d'échecs.

Le cinquième commit branche **ClientRouter et prefetch** sur les pages. ClientRouter est la grosse arme d'Astro : il transforme la navigation classique en transitions douces, sans rechargement complet de la page. Le prefetch précharge la cible quand le curseur s'approche d'un lien. À deux, ils donnent au site l'allure d'une application native, sans en être une.

Suit un correctif Hostinger : `.htaccess` pour le slash final et `index.html`. Cette ligne mérite qu'on s'arrête. L'hébergement Hostinger, à cette époque, sert le site. Or Astro génère des dossiers `/fr/science/index.html`, et Hostinger n'aime pas l'absence du slash final dans l'URL. Un `.htaccess` posé à la racine force la redirection. Sans lui, la moitié des liens internes mènent à des 404. Le dernier commit du jour harmonise les URLs des rubriques côté code (slash final partout, fonction `swapLangPrefix` introduite).

À la fin du 28 avril, le site a une colonne vertébrale multilingue, une rubrique Grand oral, un comportement de navigation moderne, et un hébergement domestiqué.

## Chapitre 4 — Les Joueurs (29 avril)

Le 29 avril, une nouvelle rubrique entre en scène : les Joueurs. Une bibliothèque de fiches biographiques, avec des dates de publication calquées sur les anniversaires des champions, mois après mois. Mai 2026 sera donc consacré aux joueurs nés en mai.

La rubrique est belle. Elle a ses photos sourcées, ses crédits, ses fiches éditoriales soignées. Elle existe, à cette date, comme un cinquième pilier potentiel à côté de science / esprit / société / Grand oral.

Mais quelque chose cloche. On le sent dès le commit `chore(typography): retirer les tirets cadratin` qui suit immédiatement la création des fiches : le ton n'est pas tout à fait celui du reste du site. Une fiche de joueur, fût-elle bien écrite, est un genre encyclopédique. Le blog, lui, vise un genre éditorial. La cohabitation va devenir une tension. On y reviendra.

Le même jour, un autre commit important arrive : `feat(i18n): English blog bodies from blog-translations, FAQ faqEn, EN schema`. Il acte une décision technique majeure. Plutôt que de dupliquer chaque article en double (un .md FR et un .md EN dans le même dossier), on externalise les traductions dans une collection séparée, `blog-translations`. Chaque entrée traduite porte un champ `frSlug` qui pointe vers son original. Cette séparation laisse la possibilité de :

- traduire à des rythmes différents ;
- marquer une traduction en `draft` sans casser le FR ;
- ajouter plus tard une collection `pt-brTranslations` sans toucher au FR.

À ce moment du projet, c'est juste une astuce d'organisation. Plus tard, ça deviendra la fondation de toute la stratégie multilingue.

## Chapitre 5 — La grande prolifération éditoriale (30 avril)

Le 30 avril est un jour de débordement. Dix-huit commits. Du robots.txt jusqu'à une notification de test OneSignal.

D'abord, le SEO. `add robots.txt + llms.txt` ajoute deux fichiers majeurs. `robots.txt` dit aux moteurs ce qu'ils peuvent crawler. `llms.txt`, plus récent, dit aux modèles de langage qui est l'éditeur, ce qu'il publie, quel ton attendre. C'est le pendant de robots.txt pour les IA. Le site naît dans une époque où être lisible par ChatGPT compte autant qu'être référencé par Google.

Puis l'arsenal des fiches Joueurs s'étend : dix profils enrichis, le ton retravaillé, les blocs de code nettoyés. La rubrique respire. Schema.org gagne un fallback. `llms.txt` s'allonge.

Et soudain, le contenu. `feat(blog): ajouter 16 nouveaux articles FR science et psychologie`. Seize d'un coup. La grande prolifération éditoriale commence. Suivent deux autres commits : un article sur la Loi de Murphy aux échecs, deux articles sur les bienfaits cérébraux des échecs et l'importance des pauses. Le site, en une journée, passe d'une poignée d'articles à une bibliothèque.

Mais la prolifération a un coût : il faut savoir comment afficher cette masse. Le commit suivant (`Blog: article mémoire (SEO), contenus science, traductions EN, assets et config`) regroupe tout l'attirail : SEO de l'article mémoire, traductions anglaises, assets, configuration. C'est le commit le plus fourre-tout du mois. Il signe l'urgence du moment.

Enfin, la fin de journée : `CI: deploy.yml, OneSignal post-deploy et cookies notifications`. Les notifications push arrivent. OneSignal est le choix initial. Un test est envoyé. Il marche. Un autre test. Il marche encore. Le commit `Notifications: choix utilisateur (cookies, footer), OneSignal optIn/optOut` ferme la boucle : un utilisateur peut activer ou désactiver les push depuis le footer ; le choix est mémorisé dans le cookie de consentement.

À ce moment, le site a tout : du contenu, des notifications, un SEO sérieux, une PWA. Il est presque prêt pour la grande presse.

Mais entre le 30 avril et la prochaine vague, dix jours de silence. Dans ces dix jours, on ne sait pas ce qui s'est passé hors du dépôt. Probablement : on a lu le site, on l'a montré, on a écouté. Quand le commit suivant arrive le 10 mai, c'est avec la force d'une rentrée.

---

# Partie II — Le grand chantier

## Chapitre 6 — La journée Alzheimer (10 mai)

Le 10 mai 2026 est une journée à elle seule. Vingt-trois commits. Une bascule.

Le premier de la journée publie un nouvel article : *Échecs, Alzheimer et réserve cognitive*. Ce n'est pas un billet ordinaire. Le commit `content(cerveau): complete rewrite with 15 scientific refs (IRMf, structural MRI, chronnectome, exec functions, Sala meta-analysis)` arrive dans la foulée. Le blog change d'altitude. Il ne se contente plus de réflexions générales sur les échecs. Il cite des IRM fonctionnelles, des IRM structurelles, le chronnectome, des fonctions exécutives, une méta-analyse Sala. C'est un article qu'on pourrait passer à un médecin.

Cette mise au sérieux du contenu déclenche tout le reste. Une règle Cursor est ajoutée pour que les futurs articles scientifiques soient ancrés sur des figures et des références. Les tables Markdown sont enrichies globalement. L'article Alzheimer est rééquilibré pour ne pas pencher trop SEO. Une FAQ en double est nettoyée. Des liens « Consensus synthesis » sont retirés des références (ils n'étaient pas du registre attendu).

Puis viennent les vidéos. **Remotion** entre en scène : un moteur de génération vidéo en React. Le site doit pouvoir produire des récaps animés. Les premières vidéos sont longues (36 secondes pour les petits, 55 pour les autres). Une itération plus tard, on raccourcit à 28 secondes. Les beats sont rendus séquentiels. L'intro est retirée sur l'article Alzheimer. Les cadratins sont enlevés des UI vidéo Remotion (premier signe de la guerre qui s'annonce).

Côté visuel, c'est la grande poussée cinématique. Trois commits massifs s'enchaînent :

- `feat: aurora + canvas hero animation, remove knight effect, add Remotion Player integration` ;
- `feat: cinematic hero — selective-color reveal, diagonal wipes, Ken Burns, bokeh, letterbox` ;
- `feat: full-page cinematic background on home (sticky viewport), Unsplash chess photos, remove letterbox`.

Le site, en quelques heures, s'est transformé en page de cinéma. Aurora animée, révélation par couleur sélective, wipes diagonaux, effet Ken Burns, bokeh, photos d'échecs Unsplash en fond plein écran sticky. Le hero est devenu un trailer.

Tout n'est pas gardé. Le letterbox (les bandes noires cinéma en haut et en bas) est mis puis retiré dans la même journée. La leçon : ce qui rend une image cinématographique en plan large rend un site illisible en navigation. La cinéma s'est confondue avec une fenêtre, et une fenêtre n'a pas de bandes noires.

## Chapitre 7 — La première guerre des cadratins (toujours le 10 mai)

Le même 10 mai, dans les commits intermédiaires, une autre bataille commence sans bruit.

`style: remove em dashes from article, Cursor rules, SVG title, workflows and comments`. Première mention explicite. Les tirets cadratin (`—`) sont retirés *partout*. Pas seulement du contenu : aussi des règles Cursor, des titres SVG, des workflows YAML, des commentaires de code.

Pourquoi cette obsession ? Plusieurs raisons coexistent.

D'abord, le tiret cadratin est devenu, en 2025-2026, l'un des marqueurs visibles de l'écriture par IA. Les lecteurs attentifs le reconnaissent. Le retirer, c'est revendiquer une écriture humaine, ou au moins humanisée. C'est un acte éditorial autant qu'un acte typographique.

Ensuite, le cadratin pose des problèmes pratiques. Il rentre mal dans certaines polices web. Il complique la recherche plein texte (un lecteur qui copie « écrire — penser » ne retrouvera pas la phrase). En français, il est moins naturel qu'en anglais ; les virgules et les deux-points font le même travail sans agresser l'œil.

Enfin, c'est devenu un rite. Le dépôt va voir, dans les mois qui suivent, *dix-sept commits* différents nommant explicitement le retrait des cadratins. C'est une discipline du soin : on revérifie, on ratisse, on ne tolère pas la rechute.

Le même jour, en parallèle, on retire les fermetures d'article du type *« Et toi, qu'en penses-tu ? »* (commit `remove comment-bait endings`) et on les remplace par des *roadmaps* et des *action closes* : ce que peut faire le lecteur, concrètement, à partir d'ici. Le ton change. Le site arrête de mendier l'engagement. Il propose, il oriente, il sort.

## Chapitre 8 — L'accueil qu'on refait six fois (toujours le 10 mai)

Toujours dans cette journée, le composant `HomeLanding.astro` est refait six fois.

1. Première version : `feat(home): nouvelle HomeLanding FR/EN/DE, i18n accueil, suppression cadratins blog`. Un accueil multilingue propre.
2. Deuxième : `style(home): accueil type maquette (panneau solide, lettrines, point marque)`. On essaie un panneau solide, des lettrines à l'ancienne, un point typographique comme marqueur.
3. Troisième : `refactor(home): retirer le fond cinématique, fond léger sur HomeLanding`. On enlève le fond cinéma qu'on vient juste de poser ailleurs. Trop chargé.
4. Quatrième : `style(home): hero plein écran sombre type landing (fond, marque, CTA)`. On bascule vers une esthétique landing page sombre.
5. Cinquième : `style(home): hero aligné Dead cells (100vh, Poppins, btn, cover BG)`. La référence est nommée : Dead Cells, le jeu vidéo. Police Poppins, viewport plein.
6. Sixième : `refactor(home): retirer titre Notre ligne et bloc Raccourcis`. On taille dans la maquette : deux blocs disparaissent, jugés redondants.

Une septième tentative arrive plus tard dans la journée : `feat(home): fond hero pixel art (hero-banner.png) + lisibilité`. Fond pixel art. La lisibilité est ajustée par-dessus.

Cette série dit quelque chose d'important : **on ne sait pas, au début, à quoi doit ressembler l'accueil**. On essaie. On compare. On garde ce qui tient au regard du lendemain. C'est une discipline coûteuse mais saine.

Le commit `feat(blog): 2 articles bienfaits echecs cerveau et pauses` du 30 avril a été suivi d'un commit `Retrait rubrique Joueurs, page Photos (bientôt), accueil classique et rubriques enrichies` du 10 mai (publié un peu plus tard ce mois-là). Les Joueurs disparaissent. La rubrique éphémère a vécu onze jours. Le site choisit la cohérence éditoriale contre la diversité formelle. C'est une décision qui économise *des années* de maintenance.

---

# Partie III — Le rite éditorial

## Chapitre 9 — L'orchestre SEO (11 → 13 mai)

Trois jours plus calmes. Mais lourds en SEO.

Le 11 mai : `SEO IA: robots.txt et llms.txt enrichis, hygiene repo et scan TruffleHog`. Le fichier `llms.txt` gagne du corps. Il explique le positionnement éditorial, le ton, les rubriques. Pour les assistants IA, c'est l'équivalent d'une charte. TruffleHog est branché sur le dépôt : un scanner de secrets. Aucune clé ne doit fuiter.

`docs(seo): llms.txt enrichi (positionnement éditorial), robots.txt bloc Google` ferme la journée. Un bloc dédié à Google est ajouté dans `robots.txt`.

Le 13 mai apporte trois mouvements distincts dans la même journée :

- `Accueil: 6 derniers articles, rubriques plus visibles; calendrier et tirets rubrique`. On passe à six articles affichés sur l'accueil. Les rubriques deviennent plus présentes visuellement. Un mini-calendrier de publication apparaît.
- `Notifications push: consentement, OneSignal (Safari/langue), CI vers l'article; footer sans RSS`. OneSignal est complété pour gérer Safari (qui est toujours en retard sur le Web Push) et la langue. Le RSS disparaît du footer (il était décoratif, peu utilisé).
- `Typo éditoriale : moins de parenthèses inutiles hors blog, suppression des tirets cadratins`. Encore les cadratins. Et, parallèlement, une réduction des parenthèses : sur les pages hors blog, elles ralentissaient la lecture.

Et enfin : `Accueil : derniers articles en alternance science / esprit / société`. C'est le commit qui introduit `interleaveLatestByPillar`. Au lieu d'afficher les trois derniers articles dans l'ordre chronologique, on alterne par rubrique. Effet : le lecteur ne voit plus un mur de science. Il voit la diversité.

## Chapitre 10 — Le 17 mai

Le 17 mai est l'autre grande journée du printemps. Quinze commits. Plusieurs refontes parallèles.

D'abord, le cookie consent. Le bandeau bas-de-page de la première époque a vécu. Trois commits successifs le remplacent :

- `feat: refonte cookie consent — modal centré, suppression bouton persistant` ;
- `fix: réactivité tactile des boutons du popup cookies` (le tap mobile ne répondait pas bien) ;
- `fix: cookie consent — [hidden] écrasé par display:flex`.

Ce dernier bug mérite qu'on s'arrête. L'attribut HTML `[hidden]` masque normalement un élément. Mais une règle CSS `display: flex` plus spécifique peut l'écraser. Le modal restait donc visible alors qu'il était censé être caché. Le correctif force la précédence. Une demi-journée perdue sur deux lignes de CSS. C'est le genre de bug qui apprend à toujours mettre `display: none !important` quand `[hidden]` compte.

En parallèle, ce 17 mai voit la **passe esthétique éditoriale** : pull-quotes (des citations mises en exergue), accents par catégorie (chaque rubrique a sa couleur d'accent), une page 404 redessinée. Le site, qui était fonctionnel, devient maintenant *éditorial* au sens fort : il a des marqueurs visuels propres à son genre.

Au milieu, un commit discret mais essentiel : `feat: glossaire, self-host fonts, service worker amélioré`.

- Le **glossaire** explique les mots techniques (Elo, théorie de Zermelo, fin de partie technique…) en infobulle sur les articles.
- Le **self-host des polices** sort le site de la dépendance Google Fonts. Les fichiers `.woff2` sont copiés en local. Plus de requête à `fonts.googleapis.com` qui ralentit le LCP.
- Le **service worker amélioré** affine ce qui est précaché et ce qui est servi en network-first.

Et un autre commit qui pèsera longtemps : `seo: amélioration JSON-LD Article et canonical prev/next`. Le JSON-LD Article gagne des champs (auteur, datePublished, dateModified). Les balises canoniques + `prev`/`next` sont calées correctement sur les paginations. Google va aimer.

Le 17 mai se clôt sur deux corrections : `Typo éditoriale : suppression des tirets cadratin sur tout le site.` et `Fusion branche Claude : passe esthétique éditoriale (pull-quotes, accents, 404)`. Le rite des cadratins s'exécute pour la sixième fois du mois.

## Chapitre 11 — Le sweep Winston (19 mai)

Deux jours plus tard, un commit étrange : `Éditorial : sweep crimes Winston (Plan, Bienvenue, À retenir)`. Le mot *Winston* ne renvoie à rien dans le code. C'est un nom de campagne interne. Il s'agit d'un passage éditorial sur les articles existants pour leur ajouter trois choses :

1. Un **Plan** au début (ce que l'article va couvrir) ;
2. Un mot de **Bienvenue** ou de contexte si le lecteur arrive par moteur ;
3. Une section **À retenir** à la fin (les trois ou quatre points essentiels).

C'est un investissement éditorial lourd mais payant. Trois opérations de pédagogie par article. Le site arrête de supposer que le lecteur sait pourquoi il est là.

La même semaine, l'infographie interactive des 10 premiers articles voit le jour, est refondue en concept *« programme de tournoi littéraire »*, puis recolorée avec les design tokens du site. Une infographie qui n'utilise pas les couleurs du site est un corps étranger. Cette correction est rapide mais nécessaire.

## Chapitre 12 — Motion Canvas remplace Remotion (20 → 21 mai)

Les 20 et 21 mai apportent une décision technique majeure : **Remotion sort, Motion Canvas entre**.

Remotion est puissant. Il rend la vidéo en React. Mais il a deux défauts pour un site comme celui-ci :

1. Le rendu prend du temps, et chaque modification de script demande une nouvelle compilation.
2. La logique de composition utilise tout l'écosystème React, ce qui suppose qu'on gère un projet React parallèle pour les vidéos.

Motion Canvas a la philosophie inverse. C'est un studio d'animation programmable, optimisé pour les scripts narratifs courts (récap, beat-by-beat). Le commit est sec : `Fusion Claude : Motion Canvas remplace Remotion pour les résumés vidéo`. La transition se fait sans fanfare. Les vidéos existantes sont rebâties.

Dans le même mouvement, plusieurs ajouts structurants :

- `Fusion Claude : rail de lecture vertical, FAQ et sommaire`. Le composant `TableOfContents.astro` naît sous sa forme actuelle : un rail vertical sur desktop, qui suit le scroll. Les FAQ deviennent un format unifié (accordéon stylé). Le sommaire des articles est mis dans le même standard.
- `Fusion Claude : navbar, commentaires, recherche et retrait FAB résumé`. La navbar gagne sa forme actuelle (logo, liens, actions). Les commentaires sont préparés (l'intégration Remark42 viendra plus tard). La recherche est posée. Le *FAB résumé* (un bouton flottant qui montrait un résumé court de l'article) est retiré : il flottait sans assumer une vraie utilité.

Le 22 mai conclut cette phase : `Fusion Claude : traductions EN/DE externalisées et enrichissements éditoriaux`. Les traductions anglaises et allemandes sont *toutes* déplacées hors des dossiers Astro standards, vers leur propre collection. La pile multilingue est devenue propre.

---

# Partie IV — Le mois des refontes

## Chapitre 13 — La forge PDF du Grand oral (23 mai)

Le 23 mai apporte une journée presque entièrement dédiée au Grand oral. Sept commits.

`Fusion Claude : Serpmantics, PDF article et enrichissements Grand Oral NSI`. Serpmantics est un client CLI maison pour l'analyse SEO éditoriale. Il est ajouté au dépôt sans tambour. C'est le genre d'outil qu'on développe pour soi-même puis qu'on partage si on a le temps.

Suivent quatre commits successifs sur les PDFs :

1. `Fusion Claude : téléchargement PDF direct via html2pdf.js`. Première version : un bouton qui télécharge la page courante via une bibliothèque côté navigateur, `html2pdf.js`.
2. `Fusion Claude : export PDF épuré (corps article uniquement)`. On retire la navbar, les commentaires, les boutons. Le PDF ne doit contenir que l'article.
3. `Fusion Claude : export PDF via extraction .article-main`. On normalise l'extraction : c'est désormais le DOM dans `.article-main` qui est converti.
4. `Refonte export PDF + amélioration blocs de code`. Les blocs de code sont retravaillés pour rester lisibles en PDF (couleurs, retour à la ligne).

Et au-dessus de tout ça : `Fusion Claude : 12 sujets Grand Oral et hub toutes spécialités`. Le hub multi-spécialités est créé. Douze sujets sont rédigés. Le Grand oral est devenu un coin du site à part entière.

`Retire 98 tirets cadratin des guides Grand Oral NSI/Maths/SES`. Quatre-vingt-dix-huit. La guerre continue.

## Chapitre 14 — La restructure (24 mai)

Le 24 mai amène une opération qu'on aurait pu faire bien plus tôt : `Restructure content/blog par catégorie et clarifie la nav`. Les articles, jusqu'à présent, vivaient tous au même niveau dans `src/content/blog/`. C'est devenu ingérable à trente articles. On crée des sous-dossiers par rubrique : `science/`, `esprit/`, `societe/`. La navigation gagne en clarté côté code. Côté site, rien ne change pour le visiteur.

Le même jour, deux autres mouvements :

- `Rend la page infographie dynamique`. L'infographie était un SVG statique. Elle devient dynamique : les données viennent du code, le rendu suit.
- `Ajoute 5 traductions EN en brouillon + mécanisme draft`. Cinq traductions anglaises arrivent en draft. Le *mécanisme draft* est ajouté à la collection : une entrée marquée `draft: true` n'est pas rendue. C'est une infrastructure qui servira beaucoup plus tard pour le pt-BR.
- `Sobriété des pages légales et nettoyage des tirets cadratin`. Les mentions légales et la politique de confidentialité sont allégées.

## Chapitre 15 — IndexNow et l'anglais en vitrine (26 → 31 mai)

Le 26 mai : `Ajoute IndexNow Bing + optimise toutes les meta descriptions SEO`. IndexNow est un protocole maintenu par Bing (et Yandex) : à chaque nouvelle URL publiée, un POST notifie les moteurs participants. Plus besoin d'attendre le crawl. Le site implémente le protocole.

Le 31 mai est le jour où l'anglais sort de l'ombre.

`Active la version anglaise du blog et bascule les URLs en EN`. Les routes `/en/` ne sont plus mortes. Elles servent du contenu. La langue est officiellement disponible.

`Publie toutes les traductions EN + désactive DE + ajoute archi pt-br`. Toutes les traductions anglaises restantes sont publiées en bloc. L'allemand est *officiellement* désactivé : ses pages ne sont plus servies, sa langue n'apparaît plus dans le sélecteur. Et en même temps, **l'architecture pt-BR est posée**. Une nouvelle collection `ptBrTranslations`. Une nouvelle constante de date de lancement. La structure existe avant le contenu, encore une fois.

Suivent : `Uniformise les FAQ (accordéon stylé) + traduit ArticleCard en EN`, `Traduit toutes les FAQ d'articles en anglais`, `Retire tous les tirets cadratin (—) du contenu` (encore), et `Aligne le style des articles EN sur les articles FR`. L'anglais ne doit pas avoir l'air d'un sous-produit. Il doit avoir le même soin.

## Chapitre 16 — Hostinger Reach, puis Brevo (1 → 2 juin)

Le 1er juin, la newsletter est intégrée : `Intègre la newsletter Hostinger Reach`. Hostinger Reach est le service maison de l'hébergeur. Le formulaire est branché.

Le 2 juin, deux jours plus tard : `Bascule le proxy newsletter de Hostinger Reach vers Brevo`. Décision prise vite. Hostinger Reach a probablement montré une limite qu'on n'avait pas vue à l'intégration (la limite de volume gratuite ? Une API peu documentée ? Une délivrabilité douteuse ?). Brevo (ex-Sendinblue) est plus mature. La bascule se fait en proxy : le formulaire ne change pas, c'est l'arrière qui pointe ailleurs.

Le commit qui suit (`Automatise l'envoi d'email Brevo à chaque nouvel article`) ferme la boucle : un script détecte les nouvelles publications dans le frontmatter et envoie automatiquement le mail aux abonnés. La newsletter est désormais un service qui tourne sans intervention humaine.

Le même jour : `Résout la cannibalisation SEO sur 5 groupes thématiques`. Cinq groupes d'articles avaient des sujets trop proches et se cannibalisaient en SERP (Google ne savait pas lequel ranker). La résolution est lourde : fusion par paires ou par triplets, redirections 301 nginx sur les URLs sortantes, sitemap nettoyé. C'est un travail de chirurgie SEO. Le résultat est noté dans une mémoire dédiée du dépôt pour ne pas refaire l'erreur.

`Refond la page infographie en concept "L'Observatoire éditorial"`. L'infographie change encore d'identité. Cette fois elle est cadrée comme un *observatoire éditorial* : ce que le blog observe, comment il le couvre, à quelle fréquence. C'est un méta-contenu assumé.

## Chapitre 17 — Trois jours où tout déraille (3 juin)

Le 3 juin est probablement la journée la plus tendue du projet. Dix commits, presque tous des correctifs.

D'abord, les vidéos PDF du Grand oral cassent. `Répare la génération des PDF Grand Oral (téléchargements)`. Le build serveur casse derrière. `Répare le build serveur : import dynamique Pagefind + lecture i18n défensive`. Le module Pagefind doit être importé via un spécifieur runtime, pas un import statique, sous peine de planter le build serveur sans message clair. Une lecture i18n « défensive » est ajoutée : si la clé manque, on ne plante pas, on retombe sur le français.

`fix(build): import Pagefind via spécifieur runtime (corrige le build serveur)`. C'est précisé, isolé, écrit en propre.

Plus tard, `fix(search): génère l'index Pagefind au build (recherche cassée en prod)`. La recherche, en production, ne renvoyait *rien*. La raison : l'index Pagefind n'était pas généré au build, donc le runtime cherchait dans le vide. Une étape de build est ajoutée. Le bug est invisible en local (l'index local existe en cache) et catastrophique en prod (la fonctionnalité majeure est morte).

Pendant ce temps, le SSH du déploiement vacille. `ci(deploy): durcit la connexion SSH (timeout 60s, command_timeout 15m)`. Premier durcissement. Puis `ci(deploy): SSH IPv4 forcé (-4) + retry 6x contre les timeouts intermittents`. On force IPv4 (les timeouts venaient de l'IPv6) et on retry six fois. Ça tient. Pour l'instant.

`PDF Grand Oral : retire le chrome de fin d'article`. Le bouton « Lire le suivant » et la signature de fin d'article ne devaient pas apparaître dans le PDF. Correction.

`Perf, dark-mode CSS et scoping set:html`. Plusieurs petits gains de performance, ajustement du mode sombre, et un correctif subtil sur la directive Astro `set:html` qui n'était pas correctement scopée.

`Corrige l'UX mobile : scatter plot coupé, cibles tactiles, logos dark mode`. L'UX mobile est repassée : un scatter plot débordait, certaines cibles tactiles étaient trop petites, des logos s'affichaient mal en sombre.

Et enfin, en fin de journée : `feat(notifications): migre OneSignal → ntfy (Web Push self-hosté)`. **OneSignal sort.** Probablement après une N-ième modification de ses conditions d'utilisation, ou un changement de tarif. **ntfy** entre : un service Web Push auto-hébergeable, simple, sans surprise. La migration touche le code client, le code serveur, et le cron post-deploy. C'est lourd. C'est sain.

Le 3 juin se termine avec un site qui marche mieux qu'au matin. Mais le matin était dur.

## Chapitre 18 — La nuit des dissertations (4 juin)

Le 4 juin commence par un coup de balai SEO : `fix(seo): vraies redirections (nginx ignore .htaccess), restaure page n°1, metas`. On découvre que nginx, en production, *ignore* le `.htaccess` que Hostinger lisait. Toutes les redirections qui dépendaient d'Apache via `.htaccess` étaient mortes depuis la bascule. Les vraies redirections nginx sont écrites. La page n°1 de la pagination (qui avait un comportement spécial pour éviter la duplication d'URL) est restaurée. Les metas sont repassées.

`chore(deploy): script d'activation des 301 nginx sur le VPS`. Un script qui applique les redirections sur le serveur. Plus jamais à la main.

`chore: force LF sur *.sh et deploy/ (.gitattributes)`. Les fins de ligne des scripts shell doivent être Unix (LF), pas Windows (CRLF). Sinon, le shell sur le VPS ne sait pas exécuter le script. Une règle `.gitattributes` force la conversion. Une fois pour toutes.

`fix(deploy): détection include via marqueur nginx -T (les includes sont développés)`. Quand on parse la config nginx pour vérifier qu'un include est bien activé, il faut utiliser `nginx -T` (qui développe les includes) et non simplement lire le fichier. Détail technique. Détail qui a coûté du temps.

`style: retire les 9 derniers tirets cadratin (texte éditorial + commentaires)`. Le tirage final. Neuf cadratins de moins. La guerre, à cette date, est gagnée. Elle reprendra le 8 juin sur une dissertation.

Et le commit phare du jour : `feat: essais→dissertations, Remark42 comments, 3 articles science`. La rubrique *Essais* est renommée en *Dissertations*. Le mot porte mieux la promesse : un texte argumenté, plan / transitions / conclusion. **Remark42** est intégré : un système de commentaires auto-hébergé, sans Disqus, sans Facebook, sans publicité. Trois articles science arrivent en même temps.

C'est ce 4 juin que la dissertation que tu as peut-être lue (*Dans quelle mesure la pratique des échecs prépare-t-elle à l'investissement ?*) entre dans le contexte qui l'attendait. Elle n'a pas été écrite ce jour-là (elle est datée du 26 mai), mais c'est ce jour-là que son nouveau cadre est posé.

---

# Partie V — La rentrée

## Chapitre 19 — Le pull-based deploy (4 juin, soir)

Le déploiement SSH durci a tenu trois semaines. Au soir du 4 juin, il craque pour de bon. Le runner GitHub mettait *des minutes* à établir la connexion. Les retry x6 finissaient parfois en échec total. Les déploiements devenaient aléatoires.

La décision est nette : `ci(deploy): passe en pull-based (VPS poll) au lieu du push SSH cassé`.

Le mécanisme est inversé. Le runner ne pousse plus rien. Il met simplement à jour un fichier-sentinelle dans le dépôt (un hash, une date). Le VPS, lui, poll ce fichier toutes les N minutes. Quand il détecte un nouveau hash, il `git pull` et rebuild. Plus de SSH sortant depuis GitHub. Plus de clé dans les secrets de l'action. Plus de timeouts IPv6. Plus de dépendance aux caprices du runner.

C'est un pattern qu'on aurait pu adopter dès le début. Mais il fallait avoir été échaudé par trois semaines de SSH cassé pour vouloir le payer. *Le projet ne refonde pas par anticipation ; il remplace quand ça coûte plus que ça ne rend.*

## Chapitre 20 — L'horizon brésilien (5 → 6 juin)

Le 5 juin : `feat(i18n): traductions pt-BR lot 1 (6 articles, draft, non exposées)`. Le portugais brésilien commence à exister dans le dépôt. Six articles traduits. Tous en `draft`. Aucune page `/pt-br/` n'est servie.

Le même jour : `feat(pwa): page de repli offline soignée + précache élargi (sw v6)`. La PWA mûrit. Quand un visiteur perd le réseau (métro, ascenseur, mauvaise région), il a maintenant une page de repli soignée plutôt que le message générique du navigateur. Le service worker passe en v6 avec un précache élargi.

Et : `docs: réécrit README (stack réelle, structure, déploiement pull-based, nginx, scripts)`. Le README est repris de zéro. Il documente la stack telle qu'elle est devenue : Astro, Pagefind, ntfy, Remark42, Brevo, nginx, déploiement pull-based, scripts. Plus rien d'obsolète. Plus rien d'oublié.

Le 6 juin : `feat(i18n): traductions pt-BR lot 2 (6 articles, draft, non exposées)`. Six de plus. La bibliothèque brésilienne s'épaissit toujours en mode draft.

`feat(hubs): refonte CategoryPage (articles-first, logo SVG) + retrait skip-link`. La refonte des pages de rubriques. Désormais, **articles-first** : la liste des billets passe au-dessus du fold. Le logo SVG remplace l'emoji pion noir précédent (qui apparaissait inégalement selon les polices système). Le skip-link en double est retiré.

`feat(content): 3 articles (religion, corps, histoire) bouchant la grille`. Trois articles arrivent pour combler des trous dans le calendrier éditorial.

`fix(schedule): rendre les scripts de grille récursifs + avancer les constantes`. Les scripts qui parcourent `src/content/blog/` doivent désormais descendre récursivement (depuis la restructure du 24 mai, les articles sont en sous-dossiers). Les constantes de calendrier sont avancées.

`fix(seo): rediriger 4 orphelins EN des articles fusionnés (301)`. Quatre URLs anglaises orphelines, héritées des fusions de la cannibalisation, sont redirigées en 301 vers leurs nouvelles cibles.

## Chapitre 21 — Le commit-trigger (8 juin)

Et le dernier commit du dépôt, à ce jour : `fix(deploy): remplacer SSH par commit-trigger dans scheduled-publish`.

Le déploiement principal est passé en pull-based le 4 juin. Mais il restait, dans un coin du dépôt, un script `scheduled-publish` qui faisait encore du SSH pour les publications programmées. Ce script déclenchait le déploiement quand une date prévue (par exemple : « publier l'article X le 12 juin à 06h00 ») arrivait.

Il est mis à jour pour utiliser le commit-trigger : il ne pousse plus directement, il fait juste un commit sur le dépôt avec un hash à jour. Le VPS poll, voit le hash, déploie. Cohérence atteinte. Plus aucun chemin du déploiement ne dépend de SSH sortant depuis GitHub.

---

# Épilogue — Cette dissertation

Si tu as ouvert la rubrique Dissertations aujourd'hui, tu n'as vu qu'un texte : *Dans quelle mesure la pratique des échecs prépare-t-elle à l'investissement ?*. Il a été publié le 26 mai 2026. Il a été retravaillé. On lui a retiré, le 8 juin, ses derniers tirets cadratin (huit occurrences exactement) et remplacé sa signature `Auteur -- blogdungaucher.com` par `Auteur, blogdungaucher.com`.

On lui a, le même jour, refait la liste qui l'accueille. La page `/fr/dissertations/` montre maintenant un compteur (« 1 texte publié »), une numérotation éditoriale (`N° 01`, en serif italique vert), un hover qui décale doucement vers la droite. La page article elle-même a gagné un H1 en serif italique au letter-spacing négatif, un excerpt italique au filet vert, des séparateurs sobres entre sections, des polices avec les ligatures activées (`font-feature-settings: kern, liga, onum`).

Ces ajustements minuscules sont la pointe d'un iceberg de 179 commits. Ils sont ce qui restera visible. Mais ils existent parce que, avant eux, il y a eu :

- la nuit où les routes anglaises ont été posées avant d'exister ;
- la journée Alzheimer où le ton du blog est monté d'un cran ;
- les six refontes du même accueil en un seul jour ;
- la migration OneSignal → ntfy ;
- la bascule SSH → pull-based ;
- la guerre des cadratins, gagnée en dix-sept commits ;
- la cannibalisation SEO résolue à coups de redirections nginx ;
- la rubrique Joueurs qu'on a su retirer à temps ;
- les trois jours d'enfer où Pagefind ne se buildait plus et où SSH timeoutait ;
- la naissance silencieuse de l'horizon brésilien dans une collection en draft.

---

## Postface — Ce qu'on a retenu

Le Blog d'un Gaucher n'a pas été pensé d'avance. Il s'est trouvé en marchant. À chaque étape, une décision en a remplacé une autre :

| Avant | Après | Pourquoi |
|---|---|---|
| `.htaccess` (Hostinger) | nginx (VPS) | besoin de vraies redirections |
| Push SSH (GitHub Actions) | Pull-based (VPS poll) | timeouts IPv6 ingérables |
| OneSignal | ntfy auto-hébergé | clauses qui changent, autonomie |
| Hostinger Reach | Brevo | maturité, délivrabilité |
| Remotion | Motion Canvas | rendu, simplicité du script |
| KaTeX global | KaTeX article-only | -67 ko sur la home |
| Essais | Dissertations | promesse éditoriale plus claire |
| Rubrique Joueurs | (supprimée) | hors champ éditorial |
| `display: flex` qui écrasait `[hidden]` | spécificité explicite | bug du 17 mai |
| FAB résumé flottant | (supprimé) | inutilité assumée |
| Le tiret cadratin | la virgule, le deux-points | signature humaine, lisibilité |

Aucune de ces décisions n'a été prise au début. Toutes ont été prises au bon moment. C'est probablement la seule règle stable du projet : **on ne refonde pas, on remplace une pièce à la fois quand elle commence à coûter plus qu'elle ne rend.**

La seconde règle, plus discrète, vient du soin éditorial : **on revient sur ce qui a été fait**. Le tiret cadratin n'a pas été chassé en une fois. Il a été chassé en dix-sept passes. Le ton n'a pas été trouvé au commit zéro. Il a été trouvé en réécrivant, en uniformisant les FAQ, en remplaçant les fermetures *comment-bait* par des roadmaps, en alignant l'EN sur le FR, en refondant six fois l'accueil dans la même journée.

La troisième règle est implicite, mais tout le récit la dit : **on pose l'infrastructure avant le besoin**. Les routes EN existaient avant le contenu EN. La collection `ptBrTranslations` existe avant les pages `/pt-br/`. La constante `PT_BR_LAUNCH_DATE` est dans le code des semaines avant la date qu'elle marque. Cette discipline-là protège des refontes douloureuses.

Le reste de la documentation, dans les chapitres `00-introduction.md` à `17-glossaire.md`, explique la mécanique du site tel qu'il est aujourd'hui. Ce livre, lui, restera la mémoire de comment on y est arrivé. Si tu y reviens dans deux ans et que tu trouves les chapitres techniques périmés, ce livre, lui, sera toujours exact. Parce qu'il ne parle pas de ce que fait le site. Il parle de ce que ses jours ont été.
