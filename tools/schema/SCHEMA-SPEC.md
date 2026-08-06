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
| Ambre foncé (texte ambre sur crème, meilleur contraste) | `#a67f2a` |
| Accent bleu (2e catégorie/contraste) | `#5b9fd4` |
| Fill bleu très clair (compagnon de l'accent bleu) | `#e8f1f8` |

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

## Watermark (filigrane logo) — NE PAS le faire toi-même
Le filigrane logo est appliqué **centralement par l'orchestrateur** après ton passage
(via `scripts/add-watermark.mjs`). Toi, tu NE lances AUCUNE commande Bash et tu
n'écris PAS de watermark à la main. Crée simplement les SVG **sans** bloc `<g id="wm">`.

## Insertion dans l'article
Insère une image markdown sur sa propre ligne, entourée de lignes vides, JUSTE APRÈS le
paragraphe qui introduit le concept illustré (pas en tête d'article, pas collé à un titre) :

```
![Texte alternatif descriptif et spécifique, une phrase.](/images/<prefixe>-NN-<descr>.svg)
```
Le `alt` doit décrire le contenu du schéma (utile SEO + accessibilité), pas répéter la légende mot pour mot.

## Combien de schémas par article
Le nombre exact à créer t'est donné dans ta mission (ex. « +4 schémas »). Répartis-les
sur toute la longueur de l'article (≈ 1 image toutes les 2-3 sections), pas tous groupés.
Chaque schéma illustre une idée DIFFÉRENTE ; ne redonde pas un schéma déjà présent.

## Contraintes de process (IMPORTANT)
- Tu NE lances AUCUNE commande Bash (pas de watermark, pas de validation script, pas de
  serveur dev). Tu utilises uniquement Read / Write / Edit.
- Ton livrable = les fichiers SVG créés (sans watermark) + les insertions markdown faites
  dans les articles. Le watermark, la validation XML et le rendu sont gérés par l'orchestrateur.
- Écris un SVG bien formé (balise `</svg>` finale, pas de `<` ni `&` littéraux dans le texte :
  utilise `&lt;` et `&amp;` ; `>` est toléré). Reste STRICTEMENT dans la palette.

## Exemple complet de référence (schéma réel, déjà en prod)
Voir `public/images/psychologie-joueur-01-flow.svg` (diagramme à axes) et
`public/images/psychologie-joueur-02-systeme-1-2.svg` (diagramme de contraste à deux cartes).
Lis-les pour t'imprégner du style AVANT de commencer.
