# Prompts vignettes — rubrique Grand oral (violet `#8b5cf6`)

Accent unique de la rubrique : `soft muted violet`. Aucune autre couleur d'accent.
Le violet est la teinte la plus instable de la série : Midjourney glisse vers le
bleu-sarcelle. Chaque prompt le nomme **trois fois** et exclut explicitement
`blue, teal, cyan, green, orange` dans le `--no`.

Sujets scolaires : `blackboard, whiteboard, equations, formulas, handwriting,
diagram, graph paper` sont ajoutés au `--no` de chaque prompt, sinon Midjourney
écrit des formules au tableau.

Cf. `tools/vignettes/VIGNETTE-SPEC.md` pour la charte. Ajouter le flag de version
Midjourney courant, le même pour toute la série.

---

### `grand-oral-mathematiques-echecs`

*Grand oral Maths + NSI : les échecs comme pont entre les deux spécialités* — L'idée retenue est le pont lui-même : la combinatoire mathématique et l'algorithmique informatique sont deux rives d'une même question, d'où une arche unique franchissant une faille entre deux plateaux distincts.

```
a single slender arch bridging two separate stone plateaus across a deep narrow chasm, one walking silhouette crossing,
editorial conceptual illustration for a science magazine, wide landscape shot, distant profile view, horizon low,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the silhouette only, soft muted violet dominant across the whole image,
violet plateaus, violet sky, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, face, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Une arche fine franchit un ravin entre deux plateaux, une silhouette la traverse.`

---

### `grand-oral-maths-spe-echecs`

*Grand oral spé Maths : les échecs comme terrain d'application du programme de terminale* — L'idée retenue est que chaque chapitre du programme trouve sa case sur l'échiquier : un damier vu de dessus dont chaque carreau contient un solide géométrique différent, une collection d'outils rangés sur un même terrain.

```
overhead view of a chequered board where each square holds a different small geometric solid, cube cone sphere prism, an ordered collection of tools,
editorial conceptual illustration for a science magazine, strict top-down view, flat orthogonal framing, soft raking shadows,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for contours only, soft muted violet dominant across the whole image,
violet squares, violet solids, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Un damier vu du dessus dont chaque case porte un solide géométrique différent.`

---

### `grand-oral-nsi-echecs`

*Grand oral spé NSI : les échecs comme cas d'école de l'algorithmique et de l'IA* — L'idée retenue est la représentation des données : le bitboard réduit une position à des couches binaires empilées, d'où des plaques translucides superposées qui ne redeviennent lisibles qu'alignées.

```
several thin translucent plates stacked in mid-air, each pierced with a different pattern of holes, aligning into one readable shape,
editorial conceptual illustration for a science magazine, three-quarter view slightly from below, floating exploded stack,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for edges only, soft muted violet dominant across the whole image,
violet plates, violet shadows, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Des plaques perforées translucides empilées en l'air s'alignent en une forme unique.`

---

### `guide-grand-oral-echecs-nsi`

*Guide Grand Oral NSI – Échecs : script, code Python commenté et questions jury* — Ce guide est un mode d'emploi de l'algorithmique : la métaphore est le démontage propre d'un mécanisme, chaque rouage extrait et posé à plat, comme un code expliqué ligne par ligne.

```
a small clockwork mechanism fully disassembled and laid out flat in neat rows, every cog and spring separated and spaced,
editorial conceptual illustration for a science magazine, top-down knolling layout, even flat lighting,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for outlines only, soft muted violet dominant across the whole image,
violet parts, violet surface, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Un mécanisme d'horlogerie démonté, chaque rouage posé à plat en rangées régulières.`

---

### `guide-grand-oral-echecs-ses-hggsp`

*Guide Grand Oral SES/HGGSP – Échecs : script, arguments et questions jury* — Ce guide arme l'élève d'arguments d'auteurs face au jury : la métaphore est la silhouette debout qui tient un éventail ouvert de plaques, chaque plaque un angle d'attaque du même sujet.

```
a standing silhouette holding an open fan of thin flat plaques spread like playing cards, facing three empty chairs,
editorial conceptual illustration for a science magazine, side profile view, head cropped above frame, stage-level angle,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the silhouette only, soft muted violet dominant across the whole image,
violet plaques, violet floor, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, face, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Une silhouette de profil déploie un éventail de plaques face à trois chaises vides.`

---

### `guide-grand-oral-echecs-toutes-specialites`

*Guide Grand Oral toutes spécialités – Échecs : le kit universel pour lycéens* — L'idée retenue est l'adaptabilité : un même objet central se raccorde à des embouts de formes toutes différentes, comme un sujet unique branché sur n'importe quelle spécialité.

```
one central hexagonal hub with many different-shaped adapters radiating and clicking onto it, each socket a distinct silhouette,
editorial conceptual illustration for a science magazine, flat overhead view, radial symmetry, centred composition,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for contours only, soft muted violet dominant across the whole image,
violet hub, violet adapters, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Un moyeu central hexagonal auquel se raccordent des embouts de formes toutes différentes.`

---

### `sujet-grand-oral-hggsp-fischer-spassky`

*Sujet Grand Oral HGGSP : Fischer-Spassky 1972, un instrument d'influence dans la guerre froide ?* — L'idée retenue est le soft power de Nye : un duel minuscule devient un instrument d'influence mondiale, d'où deux pions isolés dont les ombres portées s'étirent en continents.

```
two lone pawns facing each other on bare ground, their cast shadows stretching far and widening into continent shapes,
editorial conceptual illustration for a science magazine, low raking side light, wide horizontal shot, ground-level view,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the pawns only, soft muted violet dominant across the whole image,
violet shadows, violet ground, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, flag, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Deux pions se font face, leurs ombres s'étirent et s'élargissent en formes de continents.`

---

### `sujet-grand-oral-hggsp-memoire-patrimoine`

*Sujet Grand Oral HGGSP : Comment Fischer-Spassky 1972 est-il mémorialisé différemment dans le monde ?* — L'idée retenue est la mémoire divisée de Nora : un même événement produit des souvenirs incompatibles, d'où une pièce d'échecs unique dont trois ombres divergentes ne dessinent pas la même silhouette.

```
one single chess king casting three divergent shadows of clearly different silhouettes, three lights from three directions,
editorial conceptual illustration for a science magazine, macro close-up, shallow flat stage, view from just above the base,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the piece only, soft muted violet dominant across the whole image,
violet shadows, violet surface, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Une pièce d'échecs projette trois ombres divergentes aux silhouettes toutes différentes.`

---

### `sujet-grand-oral-hggsp-mondialisation-plateformes`

*Sujet Grand Oral HGGSP : Les échecs illustrent-ils la mondialisation culturelle ou la résistance à l'uniformisation ?* — L'idée retenue est la glocalisation de Robertson : un maillage global uniforme se pose sur des reliefs locaux qui le déforment sans le rompre, ni uniformisation totale ni rejet.

```
a perfectly regular woven mesh draped over uneven local terrain, bulging and stretching around each hill without tearing,
editorial conceptual illustration for a science magazine, wide landscape view, oblique bird's-eye angle,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the mesh lines only, soft muted violet dominant across the whole image,
violet terrain, violet mesh, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, globe, map, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Un maillage régulier posé sur un terrain accidenté se déforme autour de chaque relief.`

---

### `sujet-grand-oral-maths-combinatoire`

*Sujet Grand Oral Maths : En quoi le jeu d'échecs constitue-t-il un modèle de la pensée combinatoire ?* — L'idée retenue est le nombre de Shannon : le principe multiplicatif fait exploser le dénombrement, d'où un unique carreau de damier qui se subdivise en une nuée de carreaux de plus en plus petits.

```
a single board square subdividing again and again into ever smaller squares filling the whole surface, explosive multiplication,
editorial conceptual illustration for a science magazine, flat frontal view, extreme scale contrast, centred,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the largest square only, soft muted violet dominant across the whole image,
violet subdivisions, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Une case de damier se subdivise indéfiniment en carreaux de plus en plus petits.`

---

### `sujet-grand-oral-maths-elo-probabilites`

*Sujet Grand Oral Maths : Dans quelle mesure les probabilités permettent-elles de modéliser la performance aux échecs ?* — L'idée retenue est la convergence : une suite récurrente de résultats bruités se stabilise vers un niveau réel, d'où un pendule dont l'amplitude décroît partie après partie jusqu'au repos.

```
a swinging pendulum captured in many overlapping positions, its arc narrowing step by step toward stillness, above scattered pawns,
editorial conceptual illustration for a science magazine, straight-on side elevation, long horizontal framing,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the pendulum only, soft muted violet dominant across the whole image,
violet arcs, violet background, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Un pendule saisi en positions superposées, son amplitude décroissant jusqu'à l'immobilité.`

---

### `sujet-grand-oral-maths-modeles-limites`

*Sujet Grand Oral Maths : Quels modèles mathématiques permettent de comprendre les échecs, et où sont leurs limites ?* — L'idée retenue est que tout modèle ne capte qu'une facette : quatre pochoirs différents découpent chacun une part d'une même forme complexe, aucun ne la recouvre entièrement.

```
four different flat stencils each masking a portion of one complex underlying shape, no stencil covering it entirely,
editorial conceptual illustration for a science magazine, flat top-down layout, four panels of one object, even lighting,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the underlying shape only, soft muted violet dominant across the whole image,
violet stencils, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Quatre pochoirs distincts masquent chacun une part d'une même forme complexe.`

---

### `sujet-grand-oral-maths-zermelo-complexite`

*Sujet Grand Oral Maths : Pourquoi les mathématiques prouvent-elles que les échecs ne seront jamais résolus par la force brute ?* — L'idée retenue est le hiatus de Zermelo : la solution existe en théorie mais reste physiquement hors d'atteinte, d'où un coffre à la serrure minuscule et une clé démesurée qui n'y entrera jamais.

```
an enormous key far too large for the tiny keyhole of a small closed chest, proven to exist yet forever unusable,
editorial conceptual illustration for a science magazine, macro close-up on the lock, dramatic scale mismatch, side view,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the keyhole only, soft muted violet dominant across the whole image,
violet key, violet chest, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Une clé démesurée devant la serrure minuscule d'un petit coffre fermé.`

---

### `sujet-grand-oral-nsi-alpha-beta`

*Sujet Grand Oral NSI : En quoi l'élagage alpha-bêta illustre-t-il l'optimisation d'une recherche arborescente ?* — L'idée retenue est la coupure : l'élagage supprime des branches entières sans changer le résultat, d'où un arbre taillé net dont la moitié des rameaux gît au sol.

```
a bare branching tree cleanly pruned on one side, whole severed limbs lying on the ground below, the crown still intact,
editorial conceptual illustration for a science magazine, frontal wide shot, low horizon, stark silhouette,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the trunk only, soft muted violet dominant across the whole image,
violet branches, violet ground, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, leaves, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Un arbre nu taillé d'un seul côté, ses branches coupées gisant au sol.`

---

### `sujet-grand-oral-nsi-alphazero`

*Sujet Grand Oral NSI : Pourquoi AlphaZero représente-t-il une rupture dans l'intelligence artificielle ?* — L'idée retenue est l'apprentissage par le jeu contre soi-même, sans aucun savoir humain injecté : d'où une boucle fermée qui se nourrit d'elle-même et s'épaissit à chaque tour.

```
a closed looping ribbon feeding back into its own beginning, each revolution thicker and more intricate than the last,
editorial conceptual illustration for a science magazine, tight macro on the loop crossing, three-quarter angle,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the innermost turn only, soft muted violet dominant across the whole image,
violet ribbon, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, circuit, neural network, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Un ruban en boucle fermée se nourrit de lui-même, s'épaississant à chaque tour.`

---

### `sujet-grand-oral-nsi-minimax`

*Sujet Grand Oral NSI : Comment un programme informatique peut-il jouer aux échecs ?* — L'idée retenue est la remontée récursive des valeurs : le programme descend explorer puis fait remonter l'évaluation jusqu'à la racine, d'où un mobile suspendu dont chaque nœud pèse et s'équilibre depuis le bas.

```
a hanging mobile of nested crossbars, each lower arm balancing small pawns, weight resolving upward to one top pivot,
editorial conceptual illustration for a science magazine, low-angle view looking up, symmetrical suspension,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the threads only, soft muted violet dominant across the whole image,
violet bars, violet pieces, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Un mobile suspendu de balanciers emboîtés, de petits pions s'équilibrant vers le pivot.`

---

### `sujet-grand-oral-ses-bourdieu-reproduction`

*Sujet Grand Oral SES : En quoi les échecs sont-ils un capital culturel qui reproduit les inégalités ?* — L'idée retenue est la reproduction sociale de Bourdieu : le capital hérité place les départs à des hauteurs inégales, d'où un escalier dont les premières marches manquent pour un pion et sont déjà franchies pour l'autre.

```
two identical pawns at the foot of the same staircase, one facing missing lower steps, the other already standing higher,
editorial conceptual illustration for a science magazine, flat side elevation, wide shot, hard raking shadow,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the pawns only, soft muted violet dominant across the whole image,
violet stairs, violet wall, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Deux pions identiques devant un escalier dont les premières marches manquent pour l'un.`

---

### `sujet-grand-oral-ses-marche-superstars`

*Sujet Grand Oral SES : Le marché des joueurs d'échecs illustre-t-il les mécanismes du marché des talents ?* — L'idée retenue est l'économie des superstars de Rosen : un écart de talent infime produit un écart de revenu vertigineux, d'où des colonnes de hauteurs presque égales sauf une qui perce hors du cadre.

```
a row of slender columns of almost equal height with one single column shooting far beyond the others out of frame,
editorial conceptual illustration for a science magazine, extreme low-angle upward view, tight vertical perspective,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated soft muted violet,
deep charcoal ink for the tallest column only, soft muted violet dominant across the whole image,
violet columns, violet sky, generous negative space, calm and precise, quiet lower-left corner left empty
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blackboard, whiteboard, equations, formulas, handwriting, diagram, graph paper, bar chart, blue, teal, cyan, green, orange, cold tones
```

`alt` : `Des colonnes de hauteur presque égale, une seule s'élançant très au-delà du cadre.`
