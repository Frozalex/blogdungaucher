# Ancien point d’entrée de travail du générateur

Le 13 novembre 2026, l’utilisateur a demandé de finaliser et d’appliquer l’ensemble des chantiers du site, dont le Grand oral. L’atelier finalisé possède désormais sa route normale : `src/pages/fr/grand-oral/generateur/index.astro`.

Les liens du dossier Grand oral sont activés. Ce dossier préfixé `_` reste exclu du routeur Astro ; son ancien `index.astro` est conservé pour compatibilité avec l’ancien outil de test isolé. Le composant partagé contient les fonctions finalisées.

Les vérifications actuelles sont décrites dans `docs/refonte-2026-11-13/grand-oral/validation.md`. Le vieux script `scripts/test-grand-oral-generator.mjs` utilise Puppeteer et des attentes antérieures à la sauvegarde persistante ; il n’est pas le contrôle navigateur de cette refonte. Les interactions finales sont vérifiées dans le navigateur de l’application.
