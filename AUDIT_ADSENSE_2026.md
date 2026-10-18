# Audit de Blog d’un Gaucher avant nouvelle candidature AdSense

Date : **18 octobre 2026**, fuseau America/Guadeloupe. Site : https://blogdungaucher.com. Audit du dépôt et lectures HTTP de production ; **aucun commit, aucune publication, aucun déploiement**.

> **Suivi du 18 octobre 2026 :** les dépendances ont depuis été corrigées. Les sections 1–15 conservent le diagnostic initial ; voir la section 16 pour les résultats après mise à jour.

## 1. Résumé exécutif

Le site dispose d’un fonds éditorial conséquent, de trois langues actives, de pages d’auteur/contact/confidentialité et d’une infrastructure statique fonctionnelle. Le motif historique « Thin content » est fourni par le propriétaire ; il n’a pas été consulté dans le compte AdSense et sa cause exacte reste inconnue. **Aucune correction ne garantit une approbation AdSense.**

Les principaux problèmes démontrés sont des liens actifs vers des articles programmés encore absents, des hreflang vers des pages non indexables, des informations de confidentialité qui ne décrivent pas complètement les traitements actuels et des formulations scientifiques à revoir. Les dépendances demandent également un chantier de maintenance : le registre npm signale 27 paquets affectés dans le projet principal, dont un classé critique. Le site statique ne rend pas automatiquement ces vulnérabilités exploitables en production.

Les corrections locales font passer les **16 cibles internes absentes à zéro** et les **57 pages émettant des hreflang vers des destinations non indexables à zéro**. Elles n’ajoutent aucune directive noindex et ne modifient aucune URL d’article. Les textes éditoriaux et juridiques sont conservés. Le build, les huit tests de navigation ajoutés et la vérification TypeScript passent. Les menus mobiles des trois accueils ont été exercés à 390 px sans débordement horizontal.

**Avis : différer la nouvelle candidature le temps de vérifier la CMP et la politique de confidentialité et de traiter les incohérences éditoriales prioritaires.** Il s’agit d’une recommandation motivée, pas d’un verdict Google.

## 2. Périmètre, nombres exacts et limites

| Périmètre | Nombre et signification |
|---|---|
| Documents Markdown examinés automatiquement | **517** : 152 articles FR, 1 dissertation FR, 103 traductions EN, 109 PT-BR et 152 NL |
| Articles FR publiés selon les dates du dépôt | **85**, plus 1 dissertation ; **67** articles FR futurs |
| HTML local initial | **392 fichiers**, comprenant un artefact local de revue graphique |
| HTML local final analysé | **391 fichiers** : 219 articles, 1 dissertation, 10 catégories, 7 pages de série, 3 recherches, 94 redirections et 57 autres pages |
| Pages d’articles locales | **219** : 85 FR, 67 EN, 67 PT-BR ; inclut cinq replis FR déjà en noindex |
| Sitemap local et sitemap public parcouru | **246 URL** chacun |
| Requêtes publiques distinctes | **275** : toutes les URL du sitemap et 29 sondes supplémentaires |
| Résultats HTTP publics | **262 réponses finales 200 et 13 réponses 404** ; aucun échec de transport |
| Réponses HTML publiques analysées | **273 URL demandées**, dont 260 réponses 200 et 13 erreurs ; robots.txt et ads.txt sont les deux autres réponses |
| Pages publiques HTML accessibles distinctes | **258 URL finales uniques en 200**, après regroupement des redirections HTTP ; **215 réponses d’articles en 200** |
| Contrôle squirrelscan complémentaire | **25 pages**, couverture rapide, score indicatif 52/100, grade F ; rapport brut joint |

Les 391 fichiers locaux ne sont pas présentés comme 391 pages accessibles sur Internet. Un HTTP final 200 peut suivre une redirection ; le fichier `http-production.json` conserve l’URL finale et les en-têtes. Les treize 404 sont des sondes négatives, pas treize articles dont le contenu aurait été lu. Les vérifications de fichiers sensibles se limitent aux chemins testés.

L’examen automatique couvre l’ensemble des documents ci-dessus : métadonnées, texte rendu, structure, références repérées et similarité. La lecture qualitative ciblée concerne notamment cerveau/neuroplasticité, Alzheimer, placebo, les sources bibliographiques, les modèles de catégories, les séries et les pages juridiques. **Ce n’est pas une expertise scientifique ligne par ligne des 517 documents**, ni une vérification de toutes les références externes. L’originalité face à tout le Web n’est pas prouvable avec ce contrôle.

Les Core Web Vitals réels, Search Console, le centre de règles AdSense, les annonces automatiques, le message CMP publié par Google, les configurations privées et les statistiques de trafic n’ont pas été accessibles.

## 3. Cartographie et inventaire des URL

### Architecture

- **Astro 6.1.9**, sortie `static`, slash final, React pour les composants interactifs, TypeScript ; serveur public nginx.
- `src/content.config.ts` : collections `blog`, `dissertations`, `enTranslations`, `ptBrTranslations`, `nlTranslations` avec schémas de validation.
- `src/utils/blog.ts` : sélection des articles publiés, slugs et traductions, données structurées. Le blog filtre correctement les dates futures.
- `src/pages/{fr,en,pt-br}/blog/[slug].astro` : articles générés au build. `[...page].astro` : pagination statique. Aucun rendu serveur Astro à chaque visite.
- Catégories : science, esprit, société ; Grand Oral en FR uniquement. Dissertations : une publication FR, version EN sans texte disponible.
- Séries : psychologie dans les trois langues ; moteur Python en FR. La psychologie annonce 41 épisodes, dont neuf publiés au moment de l’audit.
- `src/pages/nl/` et la collection NL : langue supplémentaire prévue au **1er novembre 2026**. Aucun article NL généré aujourd’hui ; certains documents juridiques NL sont déjà générés, en noindex.
- Recherche : Pagefind après le build, index de **219 pages dans trois langues**, pages `/fr/recherche/`, `/en/recherche/`, `/pt-br/recherche/` déjà en noindex.
- `proxy/newsletter.mjs` : service Node séparé, Brevo pour la newsletter, inscriptions et envoi Web Push. Ce service n’est pas un endpoint Astro.
- `motion-canvas/` et `tools/moteur-python/` : outils annexes ; leurs dépendances ne sont pas assimilées au JavaScript effectivement exécuté par le lecteur du blog.
- Build : génération d’images, validation de calendrier, Astro, Pagefind, traitement des scripts/images, finalisation de navigation et contrôle des liens. L’automatisation de publication nécessite un rebuild pour faire apparaître les nouveaux articles ; les fichiers de planification ne prouvent pas que la tâche VPS fonctionne.

### Inventaires détaillés

Les tableaux suivants constituent **l’inventaire URL par URL de ce rapport**, avec langue, type, statut si mesuré, indexabilité HTML, canonical, title, description, mots approximatifs, appréciation de valeur, anomalies, priorité et fichier source probable :

- [Production : inventaire des 273 réponses HTML](docs/audit-adsense-2026/inventory-production.md).
- [Build final : inventaire des 391 fichiers HTML](docs/audit-adsense-2026/inventory-local.md).
- [Catalogue des 517 contenus source](docs/audit-adsense-2026/content-inventory.json).
- [Mesures HTTP et en-têtes de production](docs/audit-adsense-2026/http-production.json).
- [Preuves des liens cassés, fichiers source et URL](docs/audit-adsense-2026/broken-link-evidence.md).

Les sources indiquées comme probables dans les inventaires automatiques sont à distinguer des fichiers exacts cités dans les constats ci-dessous. Les fichiers JSON contiennent aussi les liens, hreflang, titres de section et données structurées observés.

**Méthode des mots :** extraction du contenu principal rendu, sans navigation générale, scripts et pied de page. Le modèle d’article peut encore inclure des FAQ, extraits connexes et éléments d’interface ; les estimations Markdown sont donc fournies séparément. Les comptes ne constituent pas un seuil de qualité.

## 4. Problèmes critiques et sécurité prioritaire

### S1 — Avis npm critiques/élevés : confirmé pour les dépendances, exploitabilité à vérifier — P1

**Fichiers :** `package.json`, `package-lock.json`, `motion-canvas/package-lock.json`. **Portée :** chaîne de construction du site et outils annexes ; aucune URL précise ne démontre une exploitation.

Le contrôle `npm audit --json` retourne :

| Projet | Critique | Élevée | Modérée | Faible | Total paquets affectés |
|---|---:|---:|---:|---:|---:|
| Principal | 1 | 14 | 6 | 6 | 27 |
| Proxy | 0 | 0 | 0 | 0 | 0 |
| Motion Canvas | 0 | 9 | 2 | 0 | 11 |

Le paquet Astro hérite notamment d’un avis d’exécution de code via optimisation AVIF ; des avis touchent également des fonctions SSR, des dépendances de construction et des parseurs. **Un avis critique n’est pas la preuve d’un serveur web vulnérable :** `output: static` et nginx réduisent l’exposition des fonctions SSR, mais les images et contenus traités au build restent dans le périmètre de sécurité. Les rapports complets contiennent les identifiants GHSA, chemins et propositions de remédiation : [principal](docs/audit-adsense-2026/dependencies-npm.json), [proxy](docs/audit-adsense-2026/dependencies-proxy.json), [outillage vidéo](docs/audit-adsense-2026/dependencies-motion.json).

**Correction recommandée :** trier les avis selon les fonctionnalités réellement utilisées puis mettre à niveau dans une branche dédiée et reconstruire/tester les trois langues. Pas de `audit fix --force` automatique. **Risque SEO :** indirect si une migration modifie HTML, routes ou build ; nécessite une comparaison des sorties. Aucun paquet n’a été mis à jour pendant cet audit.

**Aucune compromission, clé privée exposée ou faille distante critique effectivement exploitable n’a été démontrée.**

## 5. Problèmes majeurs

### T1 — Liens vers des articles futurs absents : confirmé, corrigé localement — P1

**Fichiers exacts et URL :** voir [les 16 cibles et leurs sources](docs/audit-adsense-2026/broken-link-evidence.md). Exemples : `src/content/blog/esprit/theorie-de-l-attachement-aux-echecs.md` lie `/fr/blog/analyser-ses-parties/` prévu le 2 novembre ; `src/content/blog/societe/gaslighting-aux-echecs.md` lie `/fr/blog/echecs-et-la-triche/` prévu le 19 octobre. Les cibles FR testées et deux traductions répondent bien 404 en production.

Le contrôle initial trouve 16 cibles absentes ; celui du calendrier relève 12 liens FR entre publications passées et futures. Les traductions reproduisent une partie de ces liens. Une autre cible est `/nl/blog/`, absente avant le lancement, liée depuis les pages NL déjà générées.

**Correction :** le build transforme uniquement les liens vers des articles identifiés comme futurs en leur libellé sans ancre ; le Markdown reste intact. Lorsqu’un article est généré, le lien est conservé automatiquement. Le menu des pages NL déjà présentes utilise le blog FR tant que le blog NL n’existe pas. Une faute de frappe inconnue reste détectée par le contrôle des liens et fait échouer le build. **Risque SEO faible :** aucune URL changée, aucun contenu supprimé, retrait de liens vers des 404.

### T2 — Hreflang vers noindex : confirmé, corrigé localement — P2

**Fichier responsable :** `src/layouts/BaseLayout.astro`, émission générale des alternatives. **Exemples :** `/fr/dissertations/` annonce `/en/dissertations/` pourtant en noindex ; les pages de recherche, juridiques et de pagination annoncent aussi des alternatives non indexables. Certains articles FR annoncent une traduction absente dont le repli est en noindex. **57 pages locales initiales** émettent au moins une alternative de ce type.

**Correction :** finalisation des hreflang sur la base des fichiers réellement construits et de leurs directives robots ; retrait des alternatives vers destinations absentes, redirigées ou non indexables, et retrait des hreflang des pages source en noindex. Le sitemap était déjà cohérent pour ces exclusions. **Risque SEO faible :** l’indexabilité et les canonicals ne changent pas ; les trois langues publiées restent accessibles. La correction est une bonne pratique SEO, pas une obligation AdSense autonome.

### A1 — Consentement publicitaire effectif : à vérifier avant annonces — P1

**Fichiers :** `src/layouts/BaseLayout.astro`, `src/components/CookieConsent.astro`, `src/data/site.ts`. **URL :** toutes les pages utilisant le layout, notamment `/fr/`, `/en/`, `/pt-br/`.

Le SDK AdSense est chargé sans condition ; les signaux Consent Mode sont initialisés à refusé. Le panneau maison ne gère plus que les notifications. Ses commentaires supposent que Google fournit une CMP, mais **le code et le compte rendu d’un crawl HTML ne prouvent pas qu’un message certifié est publié, affiché dans les régions concernées et correctement révocable**. Une détection automatique « Cookiebot/TrustArc » n’est pas une preuve de configuration valide.

**Recommandation :** vérifier dans AdSense « Confidentialité et messages » le message publié, le domaine, la CMP certifiée et le parcours réel d’un visiteur EEE/Royaume-Uni/Suisse ; vérifier refus, acceptation, retrait, stockage et comportement réseau avant/après. La documentation Google demande une CMP certifiée intégrée au TCF pour les annonces personnalisées dans ces régions. Le Consent Mode seul n’établit pas cette conformité. [Exigences officielles](https://support.google.com/adsense/answer/13554116?hl=fr).

**Statut : risque plausible, pas violation confirmée.** Les emplacements du dépôt sont désactivés (`live: false`), mais les annonces automatiques et la configuration du compte sont inconnues. Aucune modification du script publicitaire effectuée. **Risque SEO :** faible si la CMP respecte l’accès au contenu ; risque UX et revenu à tester lors d’un changement.

### A2 — Politique de confidentialité en décalage avec la newsletter : confirmé, modification soumise à validation — P1

**Fichiers :** `src/pages/fr/politique-confidentialite.astro`, `src/components/NewsletterForm.astro`, `proxy/newsletter.mjs`. **URL :** `/fr/politique-confidentialite/` et formulaires présents sur le site.

La politique FR décrit contact, audience, publicité, push et commentaires, mais n’explique pas le traitement newsletter via **Brevo**, alors que le proxy transmet email/prénom et peut envoyer un message de bienvenue. Elle présente encore un choix Analytics dans le panneau, qui ne contient désormais que les notifications. L’affirmation d’absence de tiers pour les notifications nécessite aussi de tenir compte des services push du navigateur et de la différence entre les implémentations ntfy et Web Push.

**Correction recommandée :** décrire les traitements réellement actifs, destinataires, finalités, bases légales, conservation, désinscription/retrait ; réconcilier les versions EN/PT-BR. Vérifier la réalité de l’exemption revendiquée pour Umami : l’absence de cookies, seule, ne démontre pas le respect de toutes les conditions d’exemption. Cela nécessite une revue juridique et technique, pas une conclusion automatique d’illégalité.

Google impose des informations sur les usages des données et cookies publicitaires : [contenu obligatoire](https://support.google.com/adsense/answer/1348695?hl=fr). **Risque SEO faible**, risque réglementaire à examiner ; texte juridique non modifié.

### E1 — Causalité scientifique trop affirmative et cohérence entre articles : confirmé pour les formulations, exactitude détaillée à vérifier — P1

**Fichiers :** `src/content/blog/science/les-echecs-et-le-cerveau.md`, `src/content/blog/science/neuroplasticite-aux-echecs.md`, traductions correspondantes. **URL :** `/fr/blog/les-echecs-et-le-cerveau/`, `/fr/blog/neuroplasticite-aux-echecs/`.

Le premier commence par attribuer directement la fabrication du cerveau expert à la pratique ; plus loin, des différences observées sont décrites comme nécessairement sculptées par les années d’entraînement. Le second critique précisément l’interprétation causale excessive des comparaisons experts/novices. Une bibliographie existe : il ne faut donc pas qualifier le premier de texte sans sources. Le problème est la **portée donnée aux sources** et l’harmonisation des réserves.

L’abstract primaire d’Atherton 2003 décrit une comparaison de tâches avec activation bilatérale ; il ne suffit pas, à lui seul, à étayer tous les développements du blog sur un transfert novice/expert : [PubMed, PMID 12589885](https://pubmed.ncbi.nlm.nih.gov/12589885/). Le texte intégral et les autres publications restent à confronter aux affirmations une par une.

**Correction recommandée :** revue ciblée des formulations de causalité, des populations, des limites et des FAQ/illustrations ; différencier les angles des deux articles. **Ne pas fusionner ni supprimer par défaut.** **Risque SEO modéré** pour une réécriture importante ; préserver les URL et l’intention. Accord requis avant réécriture.

### E2 — Traces de fabrication éditoriale dans un article santé : confirmé — P2

**Fichier :** `src/content/blog/science/echecs-alzheimer-prevention-declin-cognitif.md`, section « Chess-training pilote chez les seniors ». **URL :** `/fr/blog/echecs-alzheimer-prevention-declin-cognitif/`.

Une phrase conseille de calibrer une vidéo ou un module Remotion sur une dose hebdomadaire : détail de fabrication peu utile à l’explication promise au lecteur. L’article contient néanmoins un tableau, des limites et des références ; sa valeur n’est pas réductible à cette phrase. D’autres passages passent d’incidence de démence à Alzheimer : la correspondance exacte avec les critères des travaux cités mérite une vérification.

**Correction recommandée :** relecture éditoriale de cette section et des traductions, puis validation des affirmations santé par les publications primaires. Aucun chiffre ni référence n’a été remplacé ou inventé. **Risque SEO faible** pour une correction ciblée ; validation requise.

## 6. Problèmes mineurs et améliorations

| ID / confiance | Preuve, fichier et URL | Recommandation et risque SEO |
|---|---|---|
| M1 — confirmé | `src/components/ArticleCard.astro` utilise h3 par défaut ; `/fr/blog/`, `/en/blog/`, `/pt-br/blog/` passent de h1 à h3 pour des cartes | Prévoir un niveau h2 pour les cartes directement sous le titre principal, en conservant le rendu. Faible risque ; laissé documenté |
| M2 — confirmé, corrigé | `src/pages/fr/infographie/index.astro`, `/fr/infographie/` : ordre/séparateurs du nom accessible différents du texte visible | Nom accessible aligné sur date, durée, titre et catégorie. Aucun changement graphique ; risque SEO négligeable |
| M3 — confirmé, corrigé préventivement | Fichier local ignoré `public/_rev.html` néanmoins copié dans `dist/_rev.html` | Retrait des sorties `_rev.html` et `_svglist.json` du build ; originaux locaux conservés. Les deux sondes publiques répondent 404 : aucune fuite de production confirmée |
| M4 — confirmé dans le code, corrigé | `proxy/newsletter.mjs`, fonction d’envoi de bienvenue : adresse email dans succès/erreur et détails fournisseur susceptibles de la répéter | Journaux génériques avec statut, sans email ni message brut fournisseur. Les anciens journaux du serveur restent à examiner ; aucun accès réalisé. Risque SEO nul |
| M5 — confirmé dans le code, corrigé préventivement | `src/pages/fr/dissertations/[slug].astro` et `index.astro` ne filtraient pas les dates, contrairement au sitemap | Filtre identique au blog. La seule dissertation actuelle est passée : aucune publication future constatée. Risque SEO nul pour les pages actuelles |
| M6 — confirmé | `src/pages/sitemap.xml.ts` attribue l’heure de build aux routes statiques | Utiliser une date de modification réellement significative ou omettre lastmod lorsque cette date est inconnue ; éviter l’apparence d’une révision éditoriale à chaque build. Pas un blocage AdSense |
| M7 — à vérifier | `deploy/nginx-headers.conf` accepte unsafe-inline et plusieurs domaines Google génériques | Durcir progressivement après observation des requêtes réelles ; ne pas casser publicité, maths ou commentaires. Aucun XSS exploitable démontré |
| M8 — confirmé dans le modèle | `src/components/CategoryPage.astro` ajoute le contenu d’introduction enrichi en FR/EN, pas en PT-BR | Examiner l’intérêt d’un contenu d’orientation PT-BR original ; pas de remplissage ni obligation de longueur. Réécriture soumise à validation |

Les signalements squirrelscan sur absence de CAPTCHA, nombre de liens, titres « trop courts », absence d’AGENTS.md, SRI du SDK publicitaire ou densité du mot « échecs » ne sont pas automatiquement des défauts à corriger. Les formulaires ont déjà des protections serveur ; le SDK Google évolue ; plusieurs règles portent sur des seuils arbitraires. Le menu mobile contient déjà `inert` : son signalement « focus dans aria-hidden » a été confronté au test navigateur et n’est pas confirmé comme défaut actuel.

## 7. Audit Thin Content : pages et risques réels

| Pages / fichiers | Constat et confiance | Action proposée, gravité et risque SEO |
|---|---|---|
| `/en/dissertations/` ; `src/pages/en/dissertations/index.astro`, `src/components/EssaisComingSoon.astro` | **Confirmé** : page sans dissertation traduite, déjà noindex et hors sitemap ; le message annonce une première dissertation sans fournir de texte ni lien vers une version EN | P2 : clarifier la disponibilité ou publier une vraie traduction après validation. Pas d’annonce sur cet écran tant qu’il reste vide. Ne pas supprimer l’URL automatiquement ; modification éditoriale à approuver |
| `/fr/series/moteur-python/` ; `src/pages/fr/series/moteur-python.astro` | **Confirmé** : programme d’épisodes à venir, aucun épisode publié ; déjà noindex/hors sitemap, éléments futurs sans lien | P2 : conserver un état de programme explicite et vérifier l’intérêt pour le lecteur ; pas de monétisation de l’écran inachevé. Aucune nouvelle désindexation nécessaire |
| `/fr/series/`, `/en/series/`, `/pt-br/series/` ; fichiers `src/pages/{fr,en,pt-br}/series/index.astro` | **Probable risque limité** : peu de prose autonome, mais fonction de navigation et lien vers une série réelle | Évaluer la qualité d’orientation et la promesse. Ne pas créer de texte de remplissage ni déduire un défaut de leur seule longueur. Pas de noindex proposé |
| `/fr/series/psychologie/` et versions EN/PT-BR ; fichiers `src/pages/{fr,en,pt-br}/series/psychologie.astro` | **Confirmé** : série en cours, neuf épisodes publiés et programme futur visible ; une série partiellement publiée n’est pas nécessairement une page inachevée sans valeur | P2 : vérifier que chaque épisode futur reste clairement distingué et non lié avant parution. Préserver le parcours existant |
| Cinq replis FR sous EN/PT-BR, liste ci-dessous | **Confirmé** : traduction non disponible, contenu FR servi sous URL de langue étrangère ; déjà noindex et exclu du sitemap | P2 : traduire réellement ou améliorer l’avertissement après validation ; aucun changement massif d’indexation |
| Rubriques FR/EN/PT-BR ; `src/components/CategoryPage.astro`, `src/data/category-landing-rich.ts` | **Confirmé** : cartes et extraits ; introductions enrichies FR/EN. Ce ne sont pas simplement des pages vides composées de liens | Comparer la valeur d’orientation, surtout PT-BR ; pas de réécriture automatique |
| 18 articles Grand Oral ; `src/content/blog/grand-oral/` | **Confirmé** : explications HTML autonomes, environ **806 à 5 817 mots Markdown** selon l’article. Bouton PDF ajouté par le modèle. Pas de dépendance exclusive au téléchargement constatée | Conserver les articles. Contrôler pédagogie, différences de sujets et fidélité des PDF ; pas de fusion automatique |
| Articles courts / duplications | Aucun article rendu sous 350 mots dans le contrôle ; minimum estimé 694 mots. Comparaison en shingles de cinq mots : aucune paire publiée de même langue à Jaccard ≥ 0,12 | Cela ne prouve ni originalité sur le Web ni différence d’intention. La série partage un format sans être automatiquement dupliquée ; pas de suppression motivée par la longueur |
| Sources scientifiques | Des bibliographies non cliquables existent, par exemple dans placebo ; absence de lien externe ≠ absence de référence. Les trois articles FR science sans lien externe repéré sont `echecs-et-le-corps.md`, `echecs-memoire-de-travail.md`, `effet-placebo-aux-echecs.md` | Revue de traçabilité et de portée, prioritaire pour les affirmations santé ; pas d’ajout de références inventées |

Les cinq URL de repli sont :

- `/en/blog/echecs-et-le-corps/`
- `/en/blog/echecs-religion-et-interdit/`
- `/en/blog/echecs-vs-philosophie-pensee-strategique/`
- `/en/blog/reseau-mode-defaut-aux-echecs/`
- `/pt-br/blog/echecs-vs-philosophie-pensee-strategique/`

Leurs fichiers responsables sont les modèles `src/pages/en/blog/[slug].astro` et `src/pages/pt-br/blog/[slug].astro`, associés à l’absence d’une traduction publiée correspondante. Le choix existant de noindex évite leur ajout au sitemap ; il n’empêche pas un évaluateur humain d’y accéder.

## 8. Vérifications SEO techniques

- **Title, description, H1 :** présents dans les pages d’articles rendues ; un H1 par article. Aucun title dupliqué parmi les pages locales indexables. Les pages techniques/offline et les redirections ont un rôle distinct ; ne pas les noter comme des articles.
- **Canonical :** origine HTTPS publique fixe dans `astro.config.mjs` et `scripts/site-origin.mjs`. Garde-fou du build contre HTTP et `:8080` réussi. Les changements de canonical observés à la racine et aux anciennes URL correspondent à des redirections, pas à une preuve de duplication.
- **Hreflang :** FR, EN, PT-BR et x-default là où les variantes sont indexables ; correction des destinations noindex décrite en T2. NL non lancé et non inclus dans les alternatives indexables. Une vérification Google Search Console reste utile après déploiement autorisé.
- **Sitemap :** 246 URL, aucune cible absente localement, aucune URL noindex dans le sitemap local ; les URL du sitemap public ont été demandées. Le fichier XML est parsable. Réserve sur lastmod des routes statiques, M6.
- **Robots :** `/robots.txt` public en 200, sitemap déclaré, accès générique et groupes publicitaires autorisés ; `/ads.txt` n’est pas bloqué. Les commentaires robots ne constituent pas une restriction d’accès sécurisée.
- **Noindex/nofollow :** recherche interne et pages 2+ déjà en noindex/follow. Pas de désindexation nouvelle. Les liens d’affiliation disposent d’un traitement sponsored/nofollow pour le pipeline concerné ; le rendu Markdown traduit étant distinct, vérifier les éventuels nouveaux liens commerciaux dans les traductions.
- **JSON-LD :** JSON syntaxiquement valide dans l’ensemble des pages locales contrôlées. Article, fil d’Ariane, auteur/site et FAQ présents selon modèle. Aucun article construit avec une date JSON-LD future détectée. Cela ne constitue pas une validation Rich Results Google ; le signalement de descriptions d’auteur localisées sous le même identifiant n’est pas une preuve d’identité incohérente.
- **Open Graph/Twitter :** définis dans `BaseLayout.astro`, image par défaut et variantes d’article. Unicité et existence des principales pages vérifiées par le build ; pas de test de partage dans chaque plateforme.
- **Redirections :** la racine HTTPS répond 301 vers `/fr/` dans le contrôle d’en-têtes ; ancienne URL de syndrome de l’imposteur atteint le contenu canonique. Les 94 fichiers de redirection Astro utilisent un meta-refresh et ne prouvent pas un statut HTTP 301. `public/.htaccess` est inactif sous nginx ; `deploy/nginx-redirects.conf` porte les règles à installer. `/nl/` répond aujourd’hui 200 avec redirection HTML, pas un 302 HTTP démontré.
- **404 :** une URL aléatoire et les fichiers `/.env` et `/.git/HEAD` répondent 404 ; plusieurs liens futurs répondent également 404. Pas de soft 404 démontrée pour ces sondes.
- **Liens/archives/orphelines :** zéro cible interne absente après correction, 17 122 href internes contrôlés par le script existant ; aucun fichier local indexable sans lien entrant dans le graphe rendu. Cela ne prouve pas l’absence de toute URL orpheline historiquement connue de Google.
- **Pagination :** routes statiques, prev/next et liens vers les articles ; pages 2+ déjà noindex/follow. Politique existante conservée.
- **Dates :** filtrage du blog correct ; dissertation alignée préventivement. Publication future dépend d’un rebuild planifié et de son fuseau/date ; exécution effective VPS non vérifiée.
- **Performances :** le score 52/100 de squirrelscan porte sur 25 pages et des heuristiques, pas sur les Core Web Vitals terrain. Aucun résultat CrUX, PSI ou mesure INP réelle disponible ; ne pas annoncer « CWV réussis ». Le poids, CSS bloquantes, scripts et préchargements restent des pistes à mesurer sur réseau mobile réel.
- **Mobile :** trois accueils testés à 390×844, un H1, largeur de document 390, menu inerte fermé, actif ouvert, fermeture Échap correcte, aucune erreur JavaScript capturée. Requêtes tierces bloquées volontairement : ce test ne valide pas les publicités/CMP. Puppeteer retourne une réponse de navigation nulle sur EN/PT-BR malgré le DOM chargé ; leurs HTTP de production sont vérifiés séparément.

## 9. Audit du code source et des formulaires

**Secrets — aucun identifié dans le contrôle réalisé.** Recherche de signatures courantes dans les fichiers texte de src/public/proxy/deploy/scripts ; rapport sans valeurs : [secret-scan.json](docs/audit-adsense-2026/secret-scan.json). Les identifiants éditeur AdSense, slots, VAPID public et ID de mesure publics ne sont pas des clés privées. L’historique Git et les variables d’environnement privées ne sont pas audités exhaustivement. Aucune valeur de secret n’est incluse dans ce rapport.

**Commentaires et débogage.** Aucun marqueur TODO/FIXME/HACK/DEBUG dans le périmètre applicatif texte ciblé. Les commentaires d’architecture et les journaux serveur de démarrage sont utiles ; ils ont été conservés. Le problème réel de journalisation email est corrigé en M4. Le build supprime déjà des commentaires inline ; cette opération n’est pas une frontière de sécurité. Aucun fichier `.map` trouvé dans le build final. L’artefact de revue local était distinct du code applicatif et est exclu préventivement.

**Formulaires newsletter.** Limite de taille 8 Ko, validation email/prénom, origine autorisée, pot de miel, durée minimale de remplissage et quotas sont présents. L’IP de limitation dépend du dernier X-Forwarded-For ajouté par le reverse proxy : vérifier que le service n’est pas directement exposé et que nginx ajoute bien cet en-tête. La configuration Docker et celle du VPS actif ne sont pas établies par le seul code Node. Pas d’inscription ni d’envoi de message effectué lors de l’audit ; aucun test de spam actif.

**Contact.** Le formulaire prépare un mailto et n’envoie rien depuis la page, ce qu’il indique au lecteur. Pas de formulaire contact serveur inventé dans le diagnostic.

**Push.** `/push/send` exige un jeton ; les inscriptions publiques contrôlent origine/quota et bornent la taille. La validation de l’endpoint se limite à une URL HTTPS : **risque probable à instruire** de stockage d’URL inattendues et de requêtes serveur indésirables lors d’une diffusion autorisée. La liste de fournisseurs, la résolution réseau et les protections de `web-push` doivent être étudiées avant de choisir une restriction compatible avec les navigateurs. Aucun exploit ni envoi effectué. Fichier : `proxy/newsletter.mjs`, routes `/push/subscribe` et `/push/send`.

**XSS/injection/CSRF.** Plusieurs `set:html` et `innerHTML` existent pour Markdown, maths, traduction et recherche. Les sources sont essentiellement des fichiers maintenus et l’index Pagefind ; leur présence seule n’établit pas une XSS. Les contrôles d’origine réduisent le CSRF sur les inscriptions. Aucun endpoint de modification de compte sensible sans protection n’a été démontré. Les chaînes de dépendances et les éventuelles contributions Markdown non fiables restent des surfaces de confiance à examiner.

**En-têtes publics.** HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy et Permissions-Policy présents sur la réponse publique testée. La CSP accepte unsafe-inline pour les besoins actuels ; il faut traiter cette concession comme une amélioration possible, pas prétendre à l’absence de CSP.

## 10. AdSense : règles, risques et points non vérifiables

| Sujet | Conclusion de cet audit |
|---|---|
| Violation de politique publicitaire confirmée | **Aucune démontrée** : le compte et la diffusion réelle n’ont pas été inspectés |
| Faible valeur / pages en construction | **Risque plausible** sur dissertations EN, programme moteur Python et replis de traduction ; pas de verdict automatique sur les catégories ou articles courts |
| Contenu copié | Aucun plagiat démontré ; comparaison interne seule, absence de preuve d’originalité Web exhaustive |
| Navigation | Défaut confirmé avant correction ; liens désormais cohérents localement, production inchangée |
| Pages légales/confidentialité | Présentes et accessibles ; écart concret sur la newsletter et formulations à mettre à jour après accord |
| CMP et retrait du consentement | À contrôler dans le compte et dans des parcours régionaux réels ; le SDK/Consent Mode ne suffisent pas comme preuve |
| ads.txt | Public en 200 ; ligne Google de format attendu, identifiant cohérent avec le code ; propriété/association avec le compte non vérifiable |
| Emplacements trompeurs / tests | Aucun `<ins>` d’annonce rendu par AdBanner avec `live: false` ; aucun script publicitaire de test distinct identifié ; annonces automatiques inconnues |
| Téléchargements | PDF publics, sans collecte email préalable constatée ; les articles HTML apportent un contenu autonome |
| Score SEO | **Pas une condition officielle d’approbation AdSense** ; aucune longueur minimale d’article déduite des règles Google citées |

Sources officielles consultées le 18 octobre 2026 :

1. [Règles du programme AdSense](https://support.google.com/adsense/answer/48182?hl=en).
2. [Écrans sans contenu éditeur ou à faible valeur](https://support.google.com/publisherpolicies/answer/11112688?hl=en) : la valeur éditoriale doit rester centrale ; écrans vides/en construction/utilitaires à distinguer des articles.
3. [Contenu répliqué](https://support.google.com/publisherpolicies/answer/11190248?hl=en) : reprise sans valeur ajoutée ; aucune accusation de copie n’est formulée ici.
4. [CMP certifiée et régions concernées](https://support.google.com/adsense/answer/13554116?hl=fr).
5. [Informations de confidentialité obligatoires](https://support.google.com/adsense/answer/1348695?hl=fr).
6. [Exploration et validité d’ads.txt](https://support.google.com/adsense/answer/7679060?hl=en).

## 11. Corrections appliquées et fichiers modifiés

| Fichier | Changement |
|---|---|
| `scripts/finalize-public-navigation.mjs` — ajouté | Passe finale ciblée : liens futurs rendus en texte, alternatives limitées aux pages indexables existantes, repli du lien blog NL avant lancement, exclusion des deux sorties locales de revue. Ne réécrit pas le reste du HTML et conserve les sources |
| `package.json` | Exécution de cette passe après génération et ajout du contrôle des liens à la fin du build |
| `scripts/finalize-public-navigation.test.mjs` — ajouté | Huit cas couvrant calendrier, réactivation des liens, vrais liens inconnus, conservation du HTML, hreflang, noindex, pré-lancement NL et idempotence |
| `proxy/newsletter.mjs` | Suppression des emails et messages bruts fournisseur dans les journaux de bienvenue |
| `src/pages/fr/dissertations/[slug].astro` | Exclusion des dissertations datées dans le futur des pages générées |
| `src/pages/fr/dissertations/index.astro` | Même filtre dans le listing |
| `src/pages/fr/infographie/index.astro` | Alignement du nom accessible avec le texte visible des points interactifs |
| `scripts/audit-adsense-inventory.mjs` — ajouté | Analyse reproductible du build et de captures de production facultatives |
| `docs/audit-adsense-2026/` et ce rapport | Inventaires, preuves, résultats, catalogue et script d’analyse des contenus |

Les inventaires finaux sont générés **après** ces corrections. Le [résumé initial](docs/audit-adsense-2026/baseline-summary.json) et le [contrôle initial des liens](docs/audit-adsense-2026/links-before.txt) conservent la preuve de l’état de départ. Les corrections importantes de contenu n’ont pas été exécutées. Le dossier `.codex/`, déjà non suivi au début de la mission, n’a pas été modifié pour cet audit.

## 12. Tests exécutés et résultats

| Contrôle | Résultat réellement obtenu |
|---|---|
| `npm run build` initial | Réussi ; chaîne existante ne contrôlait pas les liens cassés |
| `npm run build` final | **Réussi**, incluant calendrier de publication, Astro, Pagefind, images, URLs et liens ; [journal](docs/audit-adsense-2026/build.log) |
| `astro check` final | **0 erreur, 0 avertissement, 92 hints**, 207 fichiers contrôlés ; [journal](docs/audit-adsense-2026/typecheck.log) |
| `node scripts/finalize-public-navigation.test.mjs` | **8/8 réussis** ; [résultats](docs/audit-adsense-2026/tests-navigation.txt) |
| `node --check proxy/newsletter.mjs` | Réussi |
| `npm run check:dead-links` initial | **Échec réel**, 16 cibles absentes, 17 158 href contrôlés |
| Même contrôle final | **Réussi**, zéro cible absente, 17 122 href ; [résultats](docs/audit-adsense-2026/links-after.txt) |
| `npm run check:link-timing` | **Échec au niveau source : 12 liens FR vers le futur**. Les liens Markdown sont volontairement conservés et neutralisés dans le HTML livré. Ce test source n’est pas présenté comme passant ; [détails](docs/audit-adsense-2026/source-link-timing.txt) |
| Contrôle sitemap / JSON-LD / H1 / orphelines | 246 URL sitemap valides localement, aucune noindex/absente ; aucun JSON-LD syntaxiquement invalide ; un H1 par article ; aucune page indexable sans lien entrant |
| Lecture HTTP publique | 275 requêtes ; 262 réponses 200 et 13 sondes 404 ; pas d’échec réseau |
| squirrelscan public rapide | Exécuté sur 25 pages : **52/100** ; [rapport brut](docs/audit-adsense-2026/squirrel-production-quick.xml). Pas de score « après déploiement » inventé |
| Dépendances | Trois audits npm exécutés ; avis non corrigés automatiquement |
| Mobile navigateur local | Trois langues, 390×844, menu et Échap, pas de débordement ; [mesures](docs/audit-adsense-2026/mobile-navigation.json) |
| Lint | Aucun script lint déclaré ; aucun résultat lint annoncé |
| Suite unitaire/intégration préexistante | Aucune suite déclarée identifiée ; seuls les huit nouveaux tests et les contrôles ci-dessus sont présentés comme exécutés |
| Rich Results / CWV terrain / formulaires réels | Non validés : pas de compte Search Console/AdSense, pas de mesure terrain ; pas d’envoi email ou push |

Le premier lancement de navigateur a échoué faute de Chrome téléchargé ; le test a ensuite été réalisé avec Brave installé. L’aperçu local a nécessité l’autorisation réseau de l’environnement. Ces difficultés ont été résolues ; elles ne constituent pas un résultat de conformité publicitaire.

Reproduire les contrôles locaux :

```sh
npm run build
npx astro check
node scripts/finalize-public-navigation.test.mjs
python3 docs/audit-adsense-2026/analyze-content.py
node scripts/audit-adsense-inventory.mjs
```

Le script Python nécessite PyYAML. Sans capture HTTP fournie au dernier script, seul l’inventaire local est régénéré et le résumé de cette exécution ne mesure pas la production ; l’inventaire de production existant est conservé. Les captures HTML brutes de production sont restées temporaires ; seuls les résultats publics et les métadonnées HTTP sont conservés au dépôt.

## 13. Corrections nécessitant l’approbation du propriétaire

1. **Juridique :** mettre à jour la confidentialité FR, puis EN/PT-BR, pour la newsletter/Brevo, les choix de consentement réellement disponibles et les circuits push/commentaires. Faire relire les affirmations d’exemption ou d’absence de tiers.
2. **Éditorial scientifique :** revoir le début et les passages causaux de cerveau, harmoniser avec neuroplasticité, vérifier l’interprétation des publications et répercuter les corrections dans FAQ, images et traductions.
3. **Éditorial santé :** revoir les formulations démence/Alzheimer et retirer ou réécrire le passage de fabrication Remotion après validation de l’auteur.
4. **Traductions/pages inachevées :** décider du message de disponibilité des dissertations EN et des cinq replis ; ne pas fabriquer une traduction pour satisfaire un volume.
5. **Publicité :** autorisation explicite avant ajout/changement de scripts, activation des emplacements ou modification de la stratégie de monétisation. Préparer et tester la CMP avant diffusion ; une vérification de configuration seule ne nécessite pas une réécriture juridique automatique.
6. **Dépendances :** planifier une migration revue, avec périmètre et tests adaptés ; aucune mise à jour majeure imposée dans ce correctif limité.

Aucune suppression d’article, fusion, modification d’URL, désindexation massive, réécriture juridique ou transformation du design n’est proposée comme action automatique. **Le propriétaire doit aussi autoriser séparément le déploiement et tout commit.**

## 14. Plan d’action sur 30 jours

| Période | Priorité et livrable concret |
|---|---|
| J1–J3 | Relire ce diagnostic ; valider les corrections locales. Vérifier le compte AdSense, le motif exact, la CMP publiée et ads.txt associé au bon compte. Autoriser séparément le déploiement si souhaité, puis refaire les sondes HTTP et liens |
| J4–J7 | Approuver et mettre à jour la confidentialité et les informations newsletter dans les trois langues. Tester l’acceptation/refus/retrait depuis une région concernée, sans activer d’annonces avant vérification |
| J8–J14 | Revue scientifique ciblée cerveau/neuroplasticité/Alzheimer/placebo ; consigner pour chaque affirmation la source, population, résultat et limites. Corriger les passages validés et les traductions ; conserver les URL |
| J15–J21 | Triage puis mise à niveau des dépendances avec build et contrôle des sorties ; vérifier l’isolation du proxy, X-Forwarded-For, données push, conservation et sécurité des journaux |
| J22–J26 | Revue de navigation et de disponibilité des séries/traductions ; corriger les niveaux de titres. Mesurer les performances mobile avec outils adaptés et traiter les plus gros coûts sans refonte graphique |
| J27–J30 | Refaire sitemap, liens, sources/canonicals/hreflang, CMP, mobile et contrôles de production ; vérifier Search Console et la stabilité des nouvelles publications. Soumettre uniquement si les points prioritaires sont levés, sans promesse d’approbation |

Ce plan n’a pas créé d’automatisation ni de rappel.

## 15. Checklist avant nouvelle candidature

- [ ] Motif exact du précédent refus relu dans AdSense et domaine vérifié.
- [ ] Corrections locales approuvées, puis déployées sur autorisation séparée.
- [ ] Liens publics, traductions, séries et calendrier retestés après déploiement.
- [ ] CMP certifiée publiée et parcours régionaux réellement testés.
- [ ] Refus/retrait fonctionnels et cohérents avec les traitements observés.
- [ ] Politique de confidentialité mise à jour avec validation du propriétaire.
- [ ] Formulaires newsletter, désinscription et téléchargements vérifiés sans messages trompeurs.
- [ ] Revue des affirmations scientifiques prioritaires et traductions effectuée.
- [ ] Pages vides/en construction écartées de toute diffusion publicitaire ; absence d’annonces trompeuses vérifiée côté compte.
- [ ] Avis de dépendances triés et remédiations prioritaires exécutées/testées.
- [ ] Sitemap, canonical, hreflang, 404 et anciennes redirections retestés publiquement.
- [ ] Mobile et performances vérifiés avec scripts tiers actifs dans un environnement de test approprié.
- [ ] Aucun secret, artefact de revue ou source map interne livré.
- [ ] Aucune approbation AdSense présentée comme acquise.

## 16. Suivi — dépendances corrigées le 18 octobre 2026

À la demande du propriétaire, mise à niveau d’Astro et des dépendances vulnérables, avec conservation de la chaîne Markdown et adaptation de l’outillage vidéo. **Audits npm finaux : zéro vulnérabilité signalée dans le site, Motion Canvas et le proxy**, dépendances de développement incluses.

Le build du site réussit ; TypeScript Astro ne relève aucune erreur ni avertissement. Les 391 routes et métadonnées sont conservées ; 219 articles restent générés dans les trois langues. Navigation, formules et recherche validées en navigateur sur 15 pages FR/EN/PT-BR. Les huit tests de navigation et les deux tests de compatibilité vidéo réussissent.

Le build et le chargement de l’éditeur vidéo fonctionnent. Son contrôle TypeScript conserve 63 erreurs : comparaison avec installation isolée de l’ancien verrouillage, diagnostics strictement identiques. Ce contrôle n’est pas présenté comme réussi et les scènes n’ont pas été réécrites.

**Construction désormais sous Node.js ≥ 22.22.0. Aucun commit ni déploiement.** Les limites de l’audit AdSense et les autres actions éditoriales/juridiques restent inchangées.

[Détail des versions, adaptations, limites et preuves de vérification](docs/audit-adsense-2026/dependency-update/README.md).

## 17. Suivi — TypeScript Motion Canvas corrigé le 18 octobre 2026

**Les 63 diagnostics sont corrigés : `npm run check --prefix motion-canvas` réussit sans erreur**, avec `strict: true` conservé, sans suppression de diagnostic. Les helpers utilisent `View2D`, les imports de scènes utilisent les déclarations officielles du projet, et `ChessBoard` conserve le signal de dimensions et la méthode de rendu hérités de `Layout`. Les propriétés d’image non prises en charge et l’import inexistant sont retirés ; la recherche de texte possède un garde de type explicite.

Le rendu réel a également révélé un dégradé CSS incompatible avec le moteur et un portrait Karpov absent : utilisation du dégradé natif et du fond de remplacement déjà prévu lorsque le portrait manque.

| Vérification locale | Résultat |
|---|---|
| TypeScript Motion Canvas | **63 → 0 erreurs** ; [avant](docs/audit-adsense-2026/motion-typescript/typecheck-before.log), [après](docs/audit-adsense-2026/motion-typescript/typecheck-after.log) |
| Build et tests Motion Canvas | Build réussi ; **2/2 tests réussis** ; [build](docs/audit-adsense-2026/motion-typescript/build-motion.log), [tests](docs/audit-adsense-2026/motion-typescript/tests-motion.log) |
| Éditeur et scènes | HTTP 200, canevas chargé, zéro erreur JavaScript ; recalcul des deux scènes et rendu de dix instants à résolution réduite ; échiquier 520×520 et 31 pièces conservés ; [mesures](docs/audit-adsense-2026/motion-typescript/runtime.json) |
| Build du site | Réussi, Pagefind : **219 articles, 3 langues** ; **17 122 liens internes, zéro cible absente** ; [journal](docs/audit-adsense-2026/motion-typescript/build-site.log) |
| Astro et navigation | **0 erreur, 0 avertissement, 88 indications** ; **8/8 tests réussis** ; [résumé Astro](docs/audit-adsense-2026/motion-typescript/check-site-summary.log), [tests](docs/audit-adsense-2026/motion-typescript/tests-site.log) |
| Langues et routes | **391 routes conservées**, accueils et articles FR/EN/PT-BR valides ; [langues](docs/audit-adsense-2026/motion-typescript/languages.json), [routes](docs/audit-adsense-2026/motion-typescript/routes.json) |
| Navigateur mobile | **15 pages** en FR/EN/PT-BR, menus et Échap, recherche, formules et navigation Astro sans rechargement ; zéro erreur JavaScript capturée et aucun débordement horizontal ; [mesures](docs/audit-adsense-2026/motion-typescript/browser.json) |

Un premier build du site a échoué sur un fragment de pré-rendu manquant ; la relance complète a réussi sans modification des sources du site par ce chantier. Des modifications éditoriales parallèles étaient présentes : la comparaison porte sur les routes, sans prétendre à une identité intégrale des textes. Les requêtes tierces sont bloquées pendant les essais du site. Aucun export vidéo complet ni contrôle publicitaire n’est revendiqué. L’avertissement de dépréciation `esbuild` du plugin vidéo reste présent et n’empêche pas son build.

**Ce correctif Motion Canvas reste local : aucun commit, push ou déploiement effectué pour ce chantier.** Les preuves de la section 16 décrivent l’état antérieur à cette correction.

## 18. Suivi — retrait de Motion Canvas le 18 octobre 2026

À la demande du propriétaire, suppression complète du sous-projet `motion-canvas/` : sources, scènes, images réservées à ces scènes, configuration, dépendances et adaptateur Vite. Les références actives dans TypeScript et le script de nettoyage éditorial sont retirées ; la documentation d'utilisation est mise à jour. Aucune dépendance du site ou du proxy n'était liée à ce sous-projet.

Le lecteur HTML des MP4 et le champ `summaryVideo` restent disponibles pour des vidéos produites en dehors du dépôt. La référence au résumé jamais généré de l'article « Échecs et mémoire » est supprimée. Les sections 16 et 17 ainsi que leurs journaux sont conservés comme historique des vérifications effectuées avant le retrait ; leurs commandes Motion Canvas ne s'appliquent plus au projet actuel.

Après retrait : **build du site réussi**, 219 articles indexés dans trois langues, **391 pages générées**, 17 125 liens internes vérifiés sans cible absente. Le contrôle Astro réussit avec **0 erreur, 0 avertissement et 88 indications** ; les **8 tests de navigation réussissent**. Les accueils et articles FR/EN/PT-BR passent le contrôle de langues. [Build](docs/audit-adsense-2026/motion-removal/build-site.log), [résumé Astro](docs/audit-adsense-2026/motion-removal/check-site-summary.log), [tests](docs/audit-adsense-2026/motion-removal/tests-site.log), [langues](docs/audit-adsense-2026/motion-removal/languages.json).

En navigateur mobile 390×844 : **15 pages** testées en FR/EN/PT-BR, réponses HTTP 200, menus et Échap, recherche, formules et navigation Astro sans rechargement réussis, aucun débordement horizontal ni erreur JavaScript capturée. [Mesures](docs/audit-adsense-2026/motion-removal/browser.json). Les requêtes tierces sont bloquées pendant ces essais ; aucun contrôle publicitaire n'est revendiqué.

Le propriétaire autorise ensuite le commit et le push de ce retrait. Les modifications en cours sur d'autres sujets restent hors de ce commit ; aucun déploiement manuel n'est lancé.
