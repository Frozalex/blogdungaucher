# 11 — Les scripts d'automatisation

Le dossier `scripts/` contient une trentaine de **petits programmes** (en JavaScript, exécutés par **Node.js**, l'outil qui fait tourner du JavaScript en dehors d'un navigateur). Ce ne sont **pas** des pages du site : ce sont des **outils** qu'on lance à la main (ou pendant le build) pour automatiser des tâches répétitives.

> **Pourquoi des scripts ?** Parce qu'une machine fait sans erreur, en une seconde, des tâches qui prendraient des heures et seraient sources de fautes si on les faisait à la main (renommer 60 redirections, vérifier 80 dates, régénérer 30 PDF…).

On les lance soit directement (`node scripts/le-script.mjs`), soit via un raccourci défini dans `package.json` (`npm run …`). L'extension `.mjs` désigne un module JavaScript moderne.

Voici **tous les scripts**, regroupés par fonction.

## Publication et calendrier
*(détaillés au [chapitre 10](10-publication-planning.md))*
- **`check-publish-weekly.mjs`** — vérifie la grille : le mardi aux séries (1/semaine, sans trou), le lundi et le jeudi à la file hors série (2/semaine, rubriques différentes). Fait partie du build.
- **`check-internal-link-timing.mjs`** (`npm run check:link-timing`) — détecte les liens internes « en avance » : un article déjà publié qui pointe vers un article dont la `publishDate` est encore dans le futur, donc invisible pour `getAllPosts()` et **404 en production**. Convention à appliquer : annoncer la cible en clair comme « à venir », sans lien actif, et rétablir le lien à sa publication. **Ne fait pas partie du build** : à lancer à la main, en particulier avant de publier ou de replanifier des dates.
- **`apply-future-publish-schedule.mjs`** — réassigne les dates des articles à venir sur la grille.
- **`pair-week-themes.mjs`** — permute le minimum d'articles pour qu'une semaine ne sorte jamais deux fois la même rubrique.
- **`interleave-future-themes.mjs`** — alterne les rubriques globalement (approche historique, bouscule l'ordre éditorial).
- **`publish-schedule-constants.mjs`** — les dates de référence partagées par les scripts ci-dessus.

## SEO et référencement
- **`generate-og-png.mjs`** — convertit l'image de partage par défaut (`og-default.svg` → `og-default.png`). Le PNG est mieux accepté que le SVG par les réseaux sociaux. Lancé au début du build.
- **`gen-nginx-redirects.mjs`** — régénère le fichier de redirections du serveur (`deploy/nginx-redirects.conf`) à partir des règles fixes + des redirections de traductions. À relancer après l'ajout/le renommage d'une traduction.
- **`en-redirects.mjs`** — la « source » partagée qui calcule les redirections « ancienne URL anglaise → slug localisé » en lisant le champ `enSlug` de chaque traduction (utilisée par `astro.config.mjs` et par le script nginx).
- **`site-origin.mjs`** — définit l'adresse officielle du site (`https://blogdungaucher.com`) comme constante partagée, pour éviter les incohérences.
- **`indexnow-submit.mjs`** — prévient instantanément les moteurs (Bing, Yandex…) qu'une page a changé, via le protocole **IndexNow** (accélère l'indexation).
- **`verify-dist-urls.mjs`** — après le build, vérifie que les adresses produites dans `dist/` sont correctes (pas de mauvaise origine, pas de lien cassé évident). Fait partie du build.
- **`serpmantics.mjs`, `serpmantics-audit-all.mjs`, `serpmantics-gap-analysis.mjs`, `serpmantics-rescore-live.mjs`, `serpmantics-retry-timeouts.mjs`** — une famille d'outils d'**audit de positionnement** : ils analysent comment le site se classe sur ses mots-clés et repèrent les opportunités. Les fichiers `.json`/`.md` à côté sont leurs rapports.

## Contenu et nettoyage du texte
- **`strip-em-dash.mjs`** et **`strip-em-dash-new-articles.mjs`** — suppriment les tirets cadratins (« — ») du contenu et les remplacent par une ponctuation normale (choix de style maison). Le premier balaie tout le site, le second seulement les nouveaux articles.
- **`extract-fr-faq.mjs`, `inline-faq-to-frontmatter.mjs`, `insert-en-faq.mjs`** — outils de manipulation des **FAQ** : les extraire du corps, les ranger dans le frontmatter, insérer les FAQ traduites.
- **`fix-yaml-keys-colon.mjs`** — répare des problèmes de format dans le frontmatter (YAML) des articles.
- **`migrate-en-translations.mjs`** — outil ponctuel pour migrer les traductions anglaises vers la nouvelle organisation.
- **`sweep-crimes.mjs`** — un script de nettoyage/correction en masse (« faire le ménage » de petites incohérences dans le contenu).

## Images, logo et icônes
- **`generate-favicons.mjs`** et **`build-favicon.mjs`** — fabriquent les **favicons** (la petite icône de l'onglet) dans toutes les tailles nécessaires.
- **`flip-logo.mjs`** — retourne le logo (effet miroir) ; le logo a une orientation particulière liée au thème « gaucher ».
- **`analyze-svg.mjs`, `analyze-svg2.mjs`, `clean-svg.mjs`** — analysent et **allègent** les fichiers SVG (le logo a été optimisé de 29 ko à 10 ko grâce à ce genre d'outil).

## PDF et vidéos
- **`generate-pdfs.mjs`** — génère les **PDF téléchargeables** du Grand oral à partir des articles (voir [chapitre 15](15-pdf-et-videos.md)).

## Performance
- **`perf-measure.mjs`** — pilote un navigateur invisible (Puppeteer) pour **mesurer la vitesse** réelle du site, sur PC et sur mobile avec connexion lente simulée (voir [chapitre 12](12-performance.md)).
- **`build-clean.mjs`** — un build « propre » (nettoie avant de reconstruire).

## Notifications et e-mails
- **`notify-ntfy.mjs`** — envoie une **notification push** (via le service **ntfy**) quand un nouvel article paraît.
- **`send-new-article-email.mjs`** — envoie un **e-mail** d'annonce d'un nouvel article (newsletter).

## Les commandes raccourcies (`package.json`)

Le fichier `package.json` définit les raccourcis suivants (lancés avec `npm run …`) :

| Commande | Ce qu'elle fait |
|----------|-----------------|
| `npm run dev` | Lance le site en mode développement (aperçu local en direct). |
| `npm run build` | **Fabrique le site complet** : génère l'image OG, vérifie le calendrier, build Astro, indexe la recherche (Pagefind), vérifie les URL. |
| `npm run preview` | Affiche localement le site déjà construit (pour tester le résultat final). |
| `npm run pdfs` | Régénère les PDF du Grand oral. |
| `npm run build:pdfs` | Build complet **puis** régénération des PDF. |
| `npm run check:publish-weekly` | Vérifie la grille de publication. |
| `npm run apply:publish-schedule` | Réorganise les dates de publication. |
| `npm run indexnow` | Notifie les moteurs de recherche. |
| `npm run strip:em-dash` | Nettoie les tirets cadratins. |
| `npm run notify` | Envoie une notification ntfy. |

### Le détail de la commande `build`

La commande la plus importante enchaîne plusieurs étapes, **dans l'ordre** :

```
generate-og-png  →  check-publish-weekly  →  astro build  →  pagefind  →  verify-dist-urls
   (image OG)        (vérifie la grille)     (fabrique)     (indexe la    (vérifie les
                                                            recherche)     adresses)
```

Si **une seule** de ces étapes échoue, tout le build s'arrête. C'est voulu : on ne met jamais en ligne un site dont une étape de contrôle a échoué.

---

⬅️ Précédent : [10 — Le calendrier de publication](10-publication-planning.md) | ➡️ Suivant : [12 — La performance](12-performance.md)
