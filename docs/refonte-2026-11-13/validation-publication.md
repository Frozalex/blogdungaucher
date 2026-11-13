# Refonte du 13 novembre 2026

## Lot livré

Style Forêt & papier inspiré de Blogvi, navigation et cartes cohérentes, sommaire statique à droite puis texte sur toute la largeur ; adaptation mobile et thème sombre. Cinq dossiers de référence enrichis avec sources primaires contrôlées. Recherche commune aux articles, dissertations, glossaire, parcours et outils. Lectures sauvegardées, reprise de passage et progression locales. Positions interactives légales. Atelier Grand oral avec brouillons par angle, étapes, répétition et export. Lettre avec exemple complet, modèle réutilisable et invitations contextuelles.

## Préservation de l'existant

Le candidat part de `origin/main` (`2b555830c638a0117f7e307d109d7c447e9fb22d`). Seules les modifications de cette session et leurs médias directement couplés sont intégrées. Les nombreuses modifications locales antérieures restent dans l'espace de travail initial. Les 53 dissertations présentes dans la version distante sont conservées : une publiée, 52 programmées. Dates de publication, vignettes et crédits préservés ; aucun changement du calendrier de diffusion. Aucun envoi d'email, notification ou publication sociale déclenché pendant les contrôles.

Les 153 résumés vidéo canoniques restent présents, dont 97 publiables à la date du contrôle. Cinq références éditoriales et le titre de concentration ont été réconciliés après revue, sans prétendre à un nouveau rendu de leurs MP4. Les supports Pinterest ont été relus : sept PDF et deux vidéos AlphaZero ont réellement été corrigés et rendus. Le manifeste indique le backend réel et les empreintes des fichiers. Voir les rapports éditoriaux associés.

## Validation

- Construction de production complète : réussie, y compris les contrôles vidéo, Pinterest, calendrier et dissertations.
- 122 tests exécutés : 122 réussis, aucun ignoré, aucun échec. Les quatre tests natifs Canvas utilisent le module temporaire explicitement indiqué ; aucune dépendance de production ajoutée.
- Analyse Astro : 339 fichiers, zéro erreur, zéro avertissement, 91 indications non bloquantes.
- Liens internes : 541 pages, 31 544 liens vérifiés, aucun lien mort.
- Contrôles navigateur sur ordinateur et mobile : accueil, archives, rubriques, articles, dissertations, glossaire, recherche, à propos, contact, bibliothèque, atelier et lettre ; absence de débordement horizontal sur les vues examinées.
- Parcours testés : sauvegarde et reprise, progression conservée, brouillon par angle, minuterie, recherche filtrée, sommaire et élargissement du texte, correction des positions, mode concentration, thème sombre, menu mobile et validation d'adresse invalide.

La mesure des inscriptions signifie acceptation par le serveur, sans prétendre vérifier réception ou double confirmation. Aucun numéro réel de la lettre n'est envoyé. Le nouveau texte de bienvenue du proxy reste conditionné au rechargement du service serveur existant ; aucune activation serveur n'est prétendue sans observation. Aucun score global squirrelscan n'est revendiqué, l'outil n'étant pas disponible.

## Contrôle complémentaire des dates historiques

La construction courante sur GitHub a réussi. Les trois instantanés de dates anciennes ont initialement refusé les révisions réelles du 13 novembre comme futures par rapport à leur horloge. Un correctif ciblé omet `lastmod` pour ces seules révisions dans un instantané explicitement chargé par `scripts/test-build-clock.mjs`. La construction normale continue de refuser toute date future. Les dates éditoriales des cinq dossiers sont conservées. Quatre tests supplémentaires couvrent ces cas.

La compilation historique locale au 1er novembre à 06 h UTC réussit après le correctif (422 pages). Le sitemap a été contrôlé : aucune date future et aucune date de révision inventée. Analyse Astro du correctif : zéro erreur, zéro avertissement.
