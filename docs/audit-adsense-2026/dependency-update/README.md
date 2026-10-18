# Correction des dépendances — 18 octobre 2026

Les mises à jour sont locales. Aucun commit, aucune publication ni aucun déploiement.

## Résultat des audits npm

| Projet | Avant | Après installation propre |
|---|---:|---:|
| Site | 27 paquets affectés, dont 1 critique | **0** |
| Motion Canvas | 11 paquets affectés | **0** |
| Proxy newsletter | 0 | **0** |

Les rapports finaux `audit-site.json`, `audit-motion.json`, `audit-proxy.json` incluent les dépendances de développement. Ce résultat décrit les avis connus du registre interrogé et ne garantit pas l'absence de toute faille.

## Choix de mise à niveau

- Astro **6.1.9 → 7.4.0**, intégration React **4.4.2 → 7.1.0**, vérificateur Astro **0.9.9 → 0.9.10**.
- KaTeX **0.16.45 → 0.19.0**, sharp **0.34.5 → 0.35.5**, esbuild **0.27.7 → 0.28.2** ; dépendances indirectes corrigées dans le verrouillage.
- Conservation de la chaîne remark/rehype avec `@astrojs/markdown-remark` **7.3.3** et `unified(...)` dans la configuration. `compressHTML: true` est conservé. [Guide officiel Astro 7](https://docs.astro.build/en/guides/upgrade-to/v7/).
- Override KaTeX limité au moteur mathématique, pour que les plugins ne réintroduisent pas une ancienne version vulnérable.
- Retrait de `html-to-docx` : aucune importation dans les sources ni scripts ; les deux exports Word existants utilisent `docx`, conservé. Cela élimine la chaîne vulnérable `image-size` sans substituer une API incompatible.
- Motion Canvas conserve ses paquets **3.17.2**, mais utilise Vite **8.3.4** plutôt que **5.4.21**. Une adaptation explicite de la cible JavaScript remplace l'ancienne valeur `modules` par `es2020`.
- Le plugin vidéo officiel impose encore Vite 4/5 et utilise `fast-glob`. Les overrides sont limités à ce Vite, au parseur XML **@xmldom/xmldom 0.9.12**, et à un remplacement local de `fast-glob`. Aucun `--force`, `--legacy-peer-deps` ni exclusion d'avis de sécurité n'est employé.
- Le remplacement privé `motion-canvas/vendor/motion-project-glob` expose l'interface de recherche utilisée par le plugin, avec `tinyglobby` **0.2.17**. Il retire effectivement la chaîne `micromatch`/`braces`, pour laquelle aucun correctif npm sûr n'était proposé, et ne se contente pas de masquer l'alerte. Sa version locale `3.3.4-blog.1` ne désigne pas une publication officielle de fast-glob.

**Nouveau prérequis de construction : Node.js ≥ 22.22.0, npm ≥ 9.6.5.** Vérifications exécutées avec Node 22.23.0 et npm 10.9.8. Vérifier cette version sur l'hôte avant tout futur déploiement autorisé ; aucun hôte de production n'a été modifié.

## Vérifications réalisées

- `npm ci` du site et de Motion Canvas : réussis ; téléchargement du navigateur Puppeteer désactivé pour l'installation du site. Le navigateur système est utilisé pour les tests.
- Arbres `npm ls --all` du site et de Motion Canvas : valides, sans dépendance manquante ni peer invalide.
- Build du site : réussi avec index Pagefind de **219 pages dans trois langues**, contrôle de calendrier, variantes d'images, finalisation de navigation et **zéro cible interne absente** sur 17 122 href.
- Vérification Astro / TypeScript du site : **0 erreur, 0 avertissement, 88 indications**, sur 208 fichiers.
- Tests de navigation : **8/8** réussis ; tests du remplacement de glob, y compris avec le véritable plugin Motion Canvas : **2/2** réussis.
- Comparaison des **391 routes** avec le build précédant la migration : mêmes routes, langues, H1, titles, descriptions, canonicals, robots et hreflang. Texte des articles conservé après normalisation des guillemets ; seules deux différences typographiques de guillemets sont relevées, dans `burnout-chess` et `logique-modale-aux-echecs`. Aucun Markdown éditorial n'a été réécrit.
- Navigateur mobile **390×844** : **15 pages**, soit accueil, liste du blog, catégorie science, article minimax avec formules et recherche pour **FR, EN, PT-BR**. Réponses 200 ; recherche fonctionnelle dans chaque langue ; menus ouverture/Échap ; absence d'erreur JavaScript. Les requêtes tierces sont bloquées, donc ceci ne valide pas AdSense/CMP.
- Navigation dynamique Astro : clic liste → article puis menu mobile/Échap validés dans les trois langues, sans rechargement complet ni erreur JavaScript (`client-navigation.json`). Le test attend la fin de l’animation native, qui intercepte les clics pendant la transition.
- Motion Canvas : build réussi, serveur de développement démarré, éditeur chargé en navigateur en HTTP 200 sans erreur JavaScript capturée. Aucun rendu complet de vidéo ni notification/email n'a été déclenché.

### Limites constatées et conservées

Le contrôle TypeScript de Motion Canvas relève **63 erreurs** dans les scènes et composants, notamment des collisions de méthodes/propriétés et des types d'import de scène. Une installation isolée des **anciens manifests et verrouillage**, avec les mêmes sources, produit exactement les **63 mêmes diagnostics**. Le défaut préexistait donc à cette migration ; ce contrôle n'est pas déclaré réussi. Voir `typecheck-motion-before.log`, `typecheck-motion-after.log` et `typecheck-motion-comparison.json`. Les fichiers de scènes n'ont pas été modifiés dans ce chantier de sécurité.

Le plugin vidéo émet aussi un avertissement de dépréciation de sa configuration `esbuild` sous Vite 8 ; la compatibilité actuelle est vérifiée par le build et le chargement de l'éditeur. Une future version officielle du plugin permettra de retirer l'adaptation et les overrides concernés.

Les avertissements de contenu déjà connus sur des traductions EN absentes et les avertissements Pagefind concernant les fichiers de redirection subsistent ; leurs replis noindex et les routes restent identiques à l'état précédant la migration.

## Reproduire

Depuis la racine :

```sh
npm ci
npm run build
npm run check
npm test
npm run check:languages
npm audit
npm audit --prefix proxy
```

Dans `motion-canvas` :

```sh
npm ci
npm test
npm run build
npm audit
npm run check # les 63 diagnostics préexistants restent visibles
```

Les fichiers joints conservent les résultats de cette vérification ; les données de l'audit initial sont conservées dans le dossier parent.
