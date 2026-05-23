# Motion Canvas : Blog d'un Gaucher

Vidéos longues format Vox / 3blue1brown qui étayent les articles du blog. Pure code TypeScript.

## Installation

```bash
cd motion-canvas
npm install
```

## Lancer l'éditeur

```bash
npm start
```

Ouvre <http://localhost:9000>. Tu prévisualises la scène en temps réel, scrubbe la timeline, ajustes les paramètres dans l'inspecteur.

## Structure

```
src/
  project.ts              ← liste des scènes du projet
  theme.ts                ← tokens design alignés sur le site + Remotion
  components/
    ChessBoard.tsx        ← échiquier 8x8 réutilisable (Unicode pieces, mélange déterministe)
  scenes/
    chase-simon.tsx       ← scène témoin : expérience Chase & Simon (1973),
                            étaye l'article echecs-et-memoire
```

## Workflow type pour une nouvelle vidéo

1. **Identifier** un concept visualisable dans un article (chunks, bifurcation, dilemme, etc.)
2. **Découper** en 4-6 segments narratifs (hook → démo → contraste → conclusion)
3. **Coder** une scène dans `src/scenes/`, en réutilisant `ChessBoard`, `theme`, et les helpers
4. **Référencer** la nouvelle scène dans `project.ts`
5. **Prévisualiser** dans l'éditeur (`npm start`)
6. **Rendre** en MP4 quand le visuel est validé (cf. ci-dessous)

## Rendu vidéo

Le studio Motion Canvas a un bouton **Render** dans la barre supérieure : choisis MP4, résolution (1080p par défaut), framerate (30 ou 60 fps).

Pour un rendu en ligne de commande sans GUI :

```bash
npx motion-canvas render
```

(Génère un MP4 dans `output/`.)

## Voix-off (à brancher plus tard)

Pour l'instant les scènes tournent sans audio. Trois options envisagées :

1. **Enregistrement perso** : micro USB + Audacity / Reaper, montage final sous Resolve ou Premiere
2. **TTS ElevenLabs** : voix clonée ou premium, plug direct en piste audio Motion Canvas via `useScene().slides.audio` ou en post-prod
3. **Sans voix** : typographie kinétique + musique seule pour les Shorts

À décider scène par scène selon le format final.

## Cohérence visuelle avec le reste du projet

- `theme.ts` reprend les tokens de `src/styles/global.css` (couleurs, fonts)
- Les couleurs rubriques (`scienceAccent`, `espritAccent`, etc.) correspondent à `categoryMap` dans `src/data/site.ts`
- Le composant `ChessBoard` rend des pièces Unicode pour rester indépendant de toute police custom

## Vidéos intégrées aux articles

Les **résumés vidéo** sous les titres d’articles sont produits ici (scènes `summary-*`), exportés en MP4 dans `public/videos/`, puis lus via `ArticleVideo.astro` et le champ frontmatter `summaryVideo`. Les **vidéos longues YouTube** (3–15 min, format Vox) utilisent le même pipeline Motion Canvas.
