# Spec — schémas SVG maison « Blog d'un Gaucher »

Objectif : produire des schémas SVG explicatifs, sobres et rigoureux, insérés dans des
articles qui n'ont actuellement AUCUNE image. Chaque schéma doit **servir le propos**
(illustrer UN concept clé de l'article), jamais décorer pour « aérer ». Ligne éditoriale :
vulgarisation scientifique sérieuse. Public : joueurs d'échecs, curieux, lycéens.

## Règle d'or
- 1 schéma = 1 idée précise TIRÉE DU TEXTE de l'article (concept, mécanisme, comparaison,
  courbe, arbre, cycle). Pas de généralité vague.
- Factuellement exact : si l'article cite un auteur/une étude/un modèle (Nash, Zermelo,
  Kahneman, minimax…), le schéma doit refléter fidèlement ce modèle.
- Texte des labels en **français**, concis.
- PAS de couverture / hero. Uniquement des schémas insérés DANS le corps.

## Format technique (obligatoire, identique partout)
- `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="H" viewBox="0 0 640 H" role="img" aria-labelledby="ID">`
  - Largeur TOUJOURS 640. Hauteur H entre 300 et 380 selon le contenu.
  - `ID` = identifiant court unique (ex. `chaos1`, `nash2`).
- Premier enfant : `<title id="ID">…</title>` = phrase descriptive complète (accessibilité + SEO).
- Fond : `<rect width="640" height="H" fill="#faf8ef"/>`.
- Titre visible en haut, centré :
  `<text x="320" y="30" text-anchor="middle" font-family="Georgia, serif" font-size="16" font-style="italic" fill="#1c1a16">…</text>`
- Corps : formes géométriques simples (rect, circle, line, path, polygon, polyline) + labels.

## Palette (n'utiliser QUE ces couleurs)
| Rôle | Hex |
|---|---|
| Fond crème | `#faf8ef` |
| Texte foncé | `#1c1a16` |
| Vert primaire (accent, élément « bon »/mis en avant) | `#3d8b37` |
| Vert foncé (texte sur vert) | `#2e7d34` |
| Vert très clair (remplissage) | `#eef3e9` |
| Gris texte secondaire | `#6e6a64` |
| Gris labels / légende italique | `#8a8478` |
| Gris bordures neutres | `#c9c2b4` |
| Gris moyen | `#9b9384` |
| Blanc (remplissage cartes) | `#fff` |
| Accent ambre (attention/transition/secondaire) | `#c9a24b` |
| Accent bleu (2e catégorie/contraste) | `#5b9fd4` |

Convention : le vert marque l'élément « choisi », « optimal » ou « sain » ; les neutres
gris = éléments non retenus ou secondaires ; ambre = alerte/bascule ; bleu = 2e série.

## Typo
- Titre + légendes/annotations italiques : `font-family="Georgia, serif"` (souvent `font-style="italic"`).
- Données, labels de nœuds, valeurs : `font-family="system-ui, sans-serif"`, `font-weight` 700–800 pour l'important.
- Tailles usuelles : titre 16, labels 13–15, petites annotations 11–12, gros chiffres 18–20.

## Nommage des fichiers
`public/images/<prefixe>-NN-<descr>.svg`
- `<prefixe>` = dérivé court du slug (ex. `theorie-chaos`, `nash`, `zermelo`, `minimax`,
  `neurones-miroirs`, `reseaux-bayesiens`, `regle-40-40-20`, `pauses`, `colere`,
  `peur-perdre`, `imposteur`, `perfectionnisme`, `imposteur-2000`, `peur-gagner`,
  `logique-modale`, `go-maths`, `go-nsi`, `go-maths-spe`, `echecs-argent`).
- `NN` = 01, 02… `<descr>` = 1–3 mots kebab-case.

## Watermark (filigrane logo)
NE PAS l'écrire à la main. Après avoir créé tes SVG, lance :
```
node scripts/add-watermark.mjs public/images/mon-fichier-01-xxx.svg public/images/autre-02-yyy.svg
```
Le script ajoute le logo en bas-droite (opacité 0.07), idempotent. Fais-le pour CHACUN de tes fichiers.

## Insertion dans l'article
Insère une image markdown sur sa propre ligne, entourée de lignes vides, JUSTE APRÈS le
paragraphe qui introduit le concept illustré (pas en tête d'article, pas collé à un titre) :

```
![Texte alternatif descriptif et spécifique, une phrase.](/images/<prefixe>-NN-<descr>.svg)
```
Le `alt` doit décrire le contenu du schéma (utile SEO + accessibilité), pas répéter la légende mot pour mot.

## Combien de schémas par article
- Article < 1600 mots : **1** schéma.
- Article 1600–3000 mots : **2** schémas.
- Article > 3000 mots (grand oral) : **2** schémas (éventuellement 3 si le contenu s'y prête vraiment).

## Validation avant de rendre la main
- Vérifie que chaque SVG est bien formé (XML valide). Exemple :
  `node -e "new (require('xmldom').DOMParser)()" ` n'est pas dispo → utilise plutôt un contrôle simple :
  `node -e "const s=require('fs').readFileSync(process.argv[1],'utf8'); if(!s.includes('</svg>'))throw new Error('SVG incomplet'); if((s.match(/</g)||[]).length!==(s.match(/>/g)||[]).length) throw new Error('balises déséquilibrées'); console.log('ok',process.argv[1])" public/images/ton-fichier.svg`
- NE lance PAS de serveur de dev (`npm run dev`/`astro dev`) : le port 4321 est utilisé par le process principal, tu créerais un conflit. La vérification visuelle finale est faite par l'orchestrateur.
- Confirme que chaque fichier contient bien `id="wm"` (watermark appliqué).

## Exemple complet de référence (schéma réel, déjà en prod)
Voir `public/images/psychologie-joueur-01-flow.svg` (diagramme à axes) et
`public/images/psychologie-joueur-02-systeme-1-2.svg` (diagramme de contraste à deux cartes).
Lis-les pour t'imprégner du style AVANT de commencer.
