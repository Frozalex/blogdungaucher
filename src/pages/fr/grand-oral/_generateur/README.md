Générateur Grand Oral en cours de développement

Cette page reste hors production à la demande de l’utilisateur.
Le préfixe _ du dossier exclut la route du routeur Astro et du build.
Les deux liens du dossier Grand Oral sont également désactivés par generatorEnabled=false dans EditorialGrandOral.astro.

Les fichiers de travail restent conservés :
- index.astro dans ce dossier ;
- src/components/GrandOralGenerator.astro ;
- src/data/oral-generator/ ;
- src/utils/oral-generator.ts.

La remise en service de la route et des liens attend la finalisation et la validation du générateur. Un simple noindex ne suffit pas à le garder hors production.

Vérification du générateur :

- `npm run check` contrôle les types Astro et TypeScript.
- `node scripts/test-grand-oral-generator.mjs` vérifie le rendu initial, les angles,
  les brouillons, les filtres, la remise à zéro, la pagination et les exports dans
  un navigateur local. Il crée une route de test temporaire, construit dans un
  dossier temporaire et supprime la route et cette construction à la fin.
- `npm run build` vérifie ensuite la construction normale sans route de test.

Le test navigateur utilise Puppeteer et son navigateur installé, ou le chemin
`PUPPETEER_EXECUTABLE_PATH`. Cette vérification n'active pas la route publique.
