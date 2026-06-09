# Documentation du site « Blog d'un Gaucher »

Bienvenue. Ce dossier explique **comment fonctionne le site de A à Z**, écrit pour quelqu'un qui ne connaît rien au développement web. Chaque chapitre prend le temps d'expliquer non seulement *ce que fait* le site, mais *pourquoi* c'est fait ainsi et *comment* la machine s'y prend.

> **À qui s'adresse ce document ?** À toi, propriétaire du site, et à toute personne curieuse qui voudrait comprendre la mécanique sans être informaticien. On part du principe que tu sais te servir d'un ordinateur, mais pas que tu sais programmer. Les mots techniques sont expliqués à la première rencontre, et regroupés à la fin dans un [glossaire](17-glossaire.md).

## Comment lire cette documentation

Tu peux la lire dans l'ordre (recommandé la première fois) ou piocher le chapitre qui t'intéresse. Les chapitres vont du **plus général** (c'est quoi un site web ?) au **plus précis** (que fait tel petit script ?).

> Pour le récit : [Le Livre du Blog d'un Gaucher](LE-LIVRE.md) raconte, dans l'ordre des choses, comment le site a été construit, refondu, corrigé, étendu. C'est l'histoire derrière la mécanique.

## Table des matières

| # | Chapitre | Ce que tu y apprendras |
|---|----------|------------------------|
| 00 | [Introduction](00-introduction.md) | Ce qu'est le site, ce qu'il propose, à qui il s'adresse |
| 01 | [Concepts de base du web](01-concepts-de-base.md) | HTML, CSS, JavaScript, serveur, « build »… expliqués simplement |
| 02 | [Vue d'ensemble technique](02-vue-ensemble-technique.md) | La « pile » d'outils (Astro, etc.) et comment tout s'emboîte |
| 03 | [Arborescence des fichiers](03-arborescence.md) | Le plan du dossier : à quoi sert chaque répertoire |
| 04 | [Le contenu : articles et rubriques](04-contenu-articles.md) | Comment un article est écrit, rangé, et ses « métadonnées » |
| 05 | [Les pages et les adresses (URL)](05-pages-routes.md) | Quelles pages existent et comment leurs adresses sont fabriquées |
| 06 | [Les composants](06-composants.md) | Chaque brique réutilisable de l'interface, une par une |
| 07 | [Mise en page et design](07-design.md) | Le gabarit commun, les couleurs, les polices, le mode sombre |
| 08 | [Le multilingue (FR / EN / DE)](08-i18n.md) | Comment le site gère plusieurs langues |
| 09 | [Le référencement (SEO)](09-seo.md) | Comment le site se rend compréhensible par Google |
| 10 | [Le calendrier de publication](10-publication-planning.md) | La règle « 2 articles/semaine » et son automatisation |
| 11 | [Les scripts d'automatisation](11-scripts.md) | Chaque petit programme du dossier `scripts/` |
| 12 | [La performance (vitesse)](12-performance.md) | Tout ce qui a été fait pour que le site soit rapide |
| 13 | [L'application installable et le hors-ligne (PWA)](13-pwa-hors-ligne.md) | Service worker, cache, notifications |
| 14 | [Les fonctionnalités interactives](14-fonctionnalites-interactives.md) | Recherche, commentaires, newsletter, partage, pub, analyse Stockfish |
| 15 | [Les PDF et les vidéos](15-pdf-et-videos.md) | Génération des PDF du Grand oral, vidéos récap |
| 16 | [Le déploiement](16-deploiement.md) | Comment le site passe de ton ordinateur à Internet |
| 17 | [Glossaire](17-glossaire.md) | Tous les mots techniques, définis simplement |

## En une phrase

**« Blog d'un Gaucher » est un blog d'échecs en français, généré comme un ensemble de pages HTML figées (donc très rapides et robustes), multilingue, optimisé pour Google et les assistants IA, publié automatiquement deux fois par semaine, et installable comme une application.**

Le reste de ce dossier détaille chacun de ces mots.
