# Prompts vignettes — rubrique Esprit (ambre `#f0a050`)

## État de génération au 17/08/2026

19 vignettes générées, traitées et intégrées. **Quatre sont à regénérer** : elles sont
sorties à dominante froide malgré le verrouillage, et lues dans la grille elles passent
pour de la rubrique Science.

| Slug | Problème constaté |
|---|---|
| `bienfaits-des-pauses-aux-echecs` | intégralement bleu-sarcelle, aucun ambre |
| `echecs-et-concentration` | fond bleu nuit dominant, l'ambre réduit au cône de lumière |
| `echecs-estime-de-soi-elo` | le seul aplat coloré est un plan bleu |
| `echecs-et-la-solitude` | bleu-gris dominant, l'ambre réduit à un bandeau |

Cas limite laissé en l'état : `echecs-et-confiance-en-soi` (briques ambre sur fond
bleu-gris) — la lecture reste chaude, mais c'est la limite basse.

Pour les reprises, renforcer encore : remplacer `deep charcoal ink for … only` par
`no dark blue, no slate, shadows in deep warm brown`, l'ombre bleue étant le vecteur
principal de la dérive. Les quatre images actuelles restent en ligne en attendant, un
visuel imparfait valant mieux que le damier de secours.

Accent unique de la rubrique : `warm amber orange` (`#f0a050`). Chaque prompt nomme
l'ambre au moins deux fois, déclare explicitement sa domination sur toute l'image, et
exclut `blue, teal, cyan, green, cold tones` dans le `--no` — la rubrique Esprit a déjà
dérivé une fois vers un bleu-sarcelle (cf. `echecs-et-flow` dans `PROMPTS.md`).

Ajouter le flag de version Midjourney courant, identique pour toute la série, et le
`--sref` de la première vignette validée.

---

### `5-biais-cognitifs-blunder`

*5 biais cognitifs qui te font blunder aux échecs* — L'effet Einstellung : la première idée qui vient occupe le terrain et masque les meilleures solutions, d'où cinq rails déviés qui convergent tous vers le même mauvais aiguillage.

```
five parallel rails of thought bending sharply and converging into one wrong track,
the first idea crowding out the better ones,
editorial conceptual illustration for a science magazine, top-down view, wide flat plane,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the rails only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Cinq rails parallèles s'infléchissant brusquement pour converger vers une seule voie déviée.`

---

### `analyser-ses-parties`

*Analyser ses parties d'échecs : le guide pratique pour progresser vraiment* — Le moment critique, ce coup unique où l'avantage a changé de camp, est repérable à l'œil nu dans la trace de la partie : d'où le sillon de pièces où une seule marque de pas s'écarte.

```
a long trail of footprints across sand where one single step veers off sideways,
the exact moment a game turned, marked and unmistakable,
editorial conceptual illustration for a science magazine, high oblique aerial view, raking light,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the prints only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Une traînée d'empreintes rectiligne dont une seule marque bifurque nettement sur le côté.`

---

### `bienfaits-des-pauses-aux-echecs`

*Les bienfaits des pauses aux échecs : pourquoi arrêter de jouer te rend meilleur* — L'apprentissage se consolide pendant l'arrêt, pas pendant l'effort : un champ labouré laissé en jachère qui reverdit tout seul dit ce paradoxe sans figure humaine.

```
a ploughed field left deliberately fallow, new growth rising only from the untouched strip,
rest as the condition of growth,
editorial conceptual illustration for a science magazine, wide landscape, low horizon line,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the furrows only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Un champ labouré dont seule la bande laissée intacte porte une repousse végétale.`

---

### `burnout-chess`

*Burnout aux échecs : quand le jeu que tu aimes te vide* — L'épuisement n'est pas la perte de la passion mais son extinction par excès de combustion : une silhouette de dos devant un âtre réduit à des braises tièdes.

```
a seated figure seen from behind facing a hearth burnt down to cooling embers,
the fire that consumed itself, warmth without flame,
editorial conceptual illustration for a science magazine, wide interior, frontal symmetrical view,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the figure only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, face, blue, teal, cyan, green, cold tones
```

`alt` : `Une silhouette de dos assise devant un foyer réduit à des braises qui s'éteignent.`

---

### `echecs-estime-de-soi-elo`

*Elo et estime de soi : quand votre classement devient votre identité* — Le classement est un thermomètre pris pour un juge : une aiguille de cadran de mesure devenue si lourde qu'elle déforme et fissure le support auquel elle est vissée.

```
a heavy measuring needle bolted onto a thin panel, its weight cracking the surface it measures,
an instrument mistaken for a verdict,
editorial conceptual illustration for a science magazine, macro close-up, shallow frontal view,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the needle only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, dial markings, gauge scale, blue, teal, cyan, green, cold tones
```

`alt` : `Une aiguille de mesure massive vissée sur un panneau mince qu'elle fissure sous son poids.`

---

### `echecs-et-colere-ragequit`

*Échecs et colère : le circuit neurologique du ragequit* — Le ragequit est un court-circuit : l'amygdale déclenche avant que le cortex n'ait statué, d'où un interrupteur qui saute et une décharge qui part avant d'atteindre le tableau de commande.

```
an electrical circuit arcing at a shortcut junction before the current reaches the control panel,
a decision fired before it was ever authorised,
editorial conceptual illustration for a science magazine, extreme macro, side profile of the wiring,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the wiring only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, circuit board cliche, glowing brain, blue, teal, cyan, green, cold tones
```

`alt` : `Un circuit électrique déchargeant un arc à un embranchement, avant le tableau de commande.`

---

### `echecs-et-concentration`

*Concentration aux échecs : entraîner l'attention comme un muscle* — L'attention soutenue est une ressource qui s'épuise et se rétrécit après 90 minutes : un cône de lumière large au départ qui se resserre progressivement en un mince faisceau.

```
a broad cone of light narrowing progressively into one thin beam across a long empty room,
attention shrinking as the hours pass,
editorial conceptual illustration for a science magazine, deep one-point perspective corridor,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the walls only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Un cône lumineux large qui se resserre en un mince faisceau au fond d'une salle vide.`

---

### `echecs-et-confiance-en-soi`

*Échecs et confiance en soi : ce que l'échiquier construit vraiment* — La confiance solide repose sur le processus, pas sur les résultats : un mur monté assise par assise, dont les rangs du bas portent tout le poids, contre une pile empilée à la va-vite.

```
two stacks side by side, one mortared course by course, one balanced loosely and tilting,
built confidence against borrowed confidence,
editorial conceptual illustration for a science magazine, straight-on elevation, eye level,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the outlines only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Deux empilements côte à côte, l'un maçonné rang par rang, l'autre en équilibre instable.`

---

### `echecs-et-l-echec`

*Apprendre à perdre aux échecs : plus difficile qu'on ne le dit* — Aux échecs la défaite est sans échappatoire : pas d'arbitre, pas de chance, pas de coéquipier. Une pièce couchée dont l'ombre porte se lit comme une donnée mesurée, pas comme un drame.

```
a single toppled chess pawn lying flat, its cast shadow measured out like a plain record,
a defeat with nowhere to hide and nobody to blame,
editorial conceptual illustration for a science magazine, extreme low angle at surface level,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the pawn only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, fallen king among pieces, blue, teal, cyan, green, cold tones
```

`alt` : `Un pion couché à plat au ras du sol, son ombre s'étirant comme une mesure.`

---

### `echecs-et-la-solitude`

*La solitude aux échecs : le sport où vous êtes réglementairement seul* — La solitude ici est réglementaire, pas subie : deux joueurs séparés par une règle et non par une distance, d'où deux sièges face à face que sépare une cloison nette.

```
two facing seats at one small table divided by a clean vertical partition between them,
proximity without any possible exchange, isolation written into the rules,
editorial conceptual illustration for a science magazine, side profile, flat theatrical staging,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the furniture only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Deux sièges se faisant face autour d'une table, séparés par une cloison verticale nette.`

---

### `echecs-et-perfectionnisme-toxique`

*Échecs et perfectionnisme toxique : quand le meilleur devient l'ennemi du bien* — Le processus ironique de Wegner : à force de vouloir écarter l'erreur, on la fabrique. Une main polissant une surface jusqu'à la creuser rend ce retournement mieux qu'une image d'anxiété.

```
a hand polishing one spot of a smooth surface until the rubbing wears a hole through it,
the effort to perfect becoming the damage itself,
editorial conceptual illustration for a science magazine, macro close-up, bare wrist, no sleeve,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the hand only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, suit, business attire, cuff, blue, teal, cyan, green, cold tones
```

`alt` : `Une main polissant un point d'une surface lisse jusqu'à y creuser un trou.`

---

### `echecs-et-procrastination`

*Procrastination et échecs : ce que l'échiquier apprend sur l'évitement* — Ce n'est pas un problème de temps mais d'évitement émotionnel, que la pendule court-circuite : le sablier presque vide oblige à trancher là où l'attente cherchait encore une certitude.

```
an hourglass almost empty beside one unmoved chess piece still waiting to be played,
the deadline forcing a decision that certainty never would,
editorial conceptual illustration for a science magazine, tight side view, shallow depth,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the hourglass only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Un sablier presque écoulé posé près d'une pièce d'échecs restée immobile.`

---

### `echecs-et-resilience`

*Résilience aux échecs : apprendre à rebondir après la défaite* — La résilience n'est pas l'absence de souffrance mais la traversée : une silhouette avançant dans un vent frontal, courbée sans être arrêtée, dit le passage plutôt que le relèvement héroïque.

```
a lone silhouette walking forward into a strong headwind, bent but still advancing,
enduring the storm rather than escaping it,
editorial conceptual illustration for a science magazine, full-length side profile, wide open plain,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the figure only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, face, rising king, blue, teal, cyan, green, cold tones
```

`alt` : `Une silhouette de profil avançant courbée contre un vent de face, sur une plaine vide.`

---

### `echecs-et-visualisation`

*Visualisation mentale aux échecs : voir sans regarder* — Chase et Simon : l'expert ne mémorise pas case par case, il stocke des groupes de pièces liées. D'où un damier dont les cases se regroupent d'elles-mêmes en quelques blocs cohérents.

```
a chessboard grid whose squares merge into five large coherent blocks instead of many cells,
memory stored as chunks, not as pixels,
editorial conceptual illustration for a science magazine, flat top-down view, perfectly orthogonal,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the grid lines only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Une grille d'échiquier dont les cases fusionnent en cinq grands blocs cohérents.`

---

### `echecs-gestion-du-temps`

*Gestion du temps aux échecs : la pendule comme miroir de tes décisions* — La cadence irrégulière (longues réflexions puis coups précipités) coûte plus que le zeitnot lui-même : d'où une file de goulots inégaux où le liquide s'accumule puis se vide d'un coup.

```
a row of narrow glass vessels of wildly uneven width, liquid pooling then rushing through,
time spent unevenly and paid for at the end,
editorial conceptual illustration for a science magazine, straight frontal row, eye-level lineup,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the glass outlines only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, clock dial, blue, teal, cyan, green, cold tones
```

`alt` : `Une rangée de récipients de verre de largeurs très inégales où un liquide s'écoule.`

---

### `echecs-peur-de-gagner`

*Échecs et peur de gagner : le sabotage inconscient au bord de la victoire* — Le sabotage survient à un pas du but, quand l'issue devient réelle : une pièce arrêtée sur la dernière rangée, la case de promotion restée vide juste devant elle.

```
a lone pawn stopped one square short of the final rank, the promotion square left empty ahead,
freezing exactly where the outcome becomes real,
editorial conceptual illustration for a science magazine, over-the-shoulder rear three-quarter view,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the pawn only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Un pion arrêté une case avant la dernière rangée, la case de promotion restée vide.`

---

### `echecs-peur-de-perdre`

*Échecs et peur de perdre : quand la défaite paralyse avant d'arriver* — La peur rétracte le jeu : on se replie, on cesse de créer, et la défaite arrive par la prudence même. Un pont-levis relevé qui coupe le seul chemin dit ce repli auto-infligé.

```
a drawbridge raised shut, sealing off the only path across, the moat empty and harmless,
a defence that cut off its own way forward,
editorial conceptual illustration for a science magazine, distant wide shot, flat frontal elevation,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the structure only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Un pont-levis relevé fermant l'unique passage au-dessus d'une douve à sec.`

---

### `echecs-stress-tournoi`

*Gérer le stress en tournoi d'échecs : ce que disent la psychologie et la physiologie* — La courbe du cortisol : le stress améliore la vigilance jusqu'à un seuil, puis dégrade exactement ce dont on a besoin. La corde tendue qui chante juste puis casse rend ce seuil.

```
a taut string tightened to its exact resonant point, the next turn of the peg about to snap it,
useful tension one notch away from rupture,
editorial conceptual illustration for a science magazine, extreme macro, diagonal across the frame,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the string only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Une corde tendue à l'extrême en diagonale, la cheville d'accord sur le point de céder.`

---

### `faut-il-vraiment-etudier-les-ouvertures`

*Faut-il vraiment étudier les ouvertures ? Le contre-argument* — Le conseil dominant est mal calibré : ce n'est pas « oui ou non » mais « à partir de quel niveau ». D'où deux escaliers où la même marche est inutile en bas et indispensable en haut.

```
a staircase where the lower steps lie unused and flat while the upper ones become essential,
the same advice worthless at one altitude and decisive at another,
editorial conceptual illustration for a science magazine, side elevation, ascending diagonal,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the steps only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Un escalier dont les marches basses sont aplaties et les marches hautes bien formées.`

---

### `jouer-en-blitz-est-il-mauvais-pour-progresser`

*Jouer en blitz est-il vraiment mauvais pour progresser ?* — Le problème n'est pas le blitz mais sa proportion : beaucoup de surface, très peu de fond. Une très large flaque de quelques millimètres à côté d'un puits étroit et profond rend l'arbitrage entre étendue et profondeur.

> Métaphore réécrite le 17/08/2026 : la version initiale utilisait une balance à plateaux,
> motif également retenu par `echecs-et-argent` (Société) et `echecs-alphazero-stockfish`
> (Science). La balance reste au seul article où elle est littérale, celui sur l'argent.

```
a very wide puddle only millimetres deep beside a narrow well sinking far down,
breadth traded against depth,
editorial conceptual illustration for a science magazine, high three-quarter view, wide flat ground,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the well opening only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones, balance scale
```

`alt` : `Une flaque très large et peu profonde à côté d'un puits étroit qui plonge loin.`

---

### `loi-de-murphy-aux-echecs`

*Loi de Murphy aux échecs : pourquoi le blunder paraît toujours arriver au pire moment* — Ce n'est pas une loi, c'est de la mémoire sélective : on ne retient que les erreurs bien placées. Une planche à clous où seuls quelques impacts sont marqués au feutre le montre.

```
a board of many identical pins where only a handful have been circled and remembered,
selective memory building a law out of coincidence,
editorial conceptual illustration for a science magazine, flat overhead view, dense even field,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the pins only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Un champ dense de clous identiques dont seuls quelques-uns sont entourés d'un cercle.`

---

### `pourquoi-grands-joueurs-perdent-contre-enfants`

*Pourquoi les grands joueurs d'échecs perdent contre des enfants* — L'enfant joue des coups étrangers au répertoire humain : le GM ne peut plus s'appuyer sur son expérience. Une clé lourde et ouvragée devant une serrure au profil inédit dit cette expérience rendue inutile.

```
an ornate heavy key held before a lock whose keyway has an entirely unfamiliar shape,
years of accumulated experience suddenly fitting nothing,
editorial conceptual illustration for a science magazine, tight macro, straight-on frontal framing,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the key only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Une clé ouvragée présentée devant une serrure dont le profil ne lui correspond pas.`

---

### `psychologie-du-joueur-d-echecs`

*La psychologie du joueur d'échecs : ce qui se passe vraiment dans ta tête* — La partie se joue d'abord contre soi-même, avant que la main ne bouge : d'où une silhouette assise face à sa propre ombre projetée en vis-à-vis, comme un second joueur.

```
a seated silhouette facing its own cast shadow sitting upright opposite, as a second player,
the real opponent being oneself,
editorial conceptual illustration for a science magazine, side profile, two figures in mirrored balance,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the silhouettes only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, face, blue, teal, cyan, green, cold tones
```

`alt` : `Une silhouette assise de profil faisant face à son ombre redressée comme un adversaire.`

---

### `regle-40-40-20-echecs`

*La règle 40-40-20 : comment vraiment structurer son entraînement aux échecs* — La plupart des joueurs font exactement l'inverse de la répartition recommandée : trois piles de pions de hauteurs franchement inégales, la plus haute étant celle qui devrait être la plus basse.

```
three stacks of chess pawns of markedly unequal height, the tallest one clearly misplaced,
effort allocated in exactly the wrong proportions,
editorial conceptual illustration for a science magazine, low frontal angle, three subjects abreast,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the pawns only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Trois piles de pions d'échecs de hauteurs très inégales alignées en contre-plongée.`

---

### `syndrome-imposteur-2000-elo`

*Le syndrome de l'imposteur à 2000 Elo : pourquoi tu ne te sens pas à ta place* — L'imposteur du palier : le chiffre atteint semble ne pas nous appartenir. Une pièce d'échecs posée sur un socle taillé pour une pièce plus grande rend ce mauvais ajustement au seuil franchi.

```
a chess piece standing on a pedestal whose recess was carved for a noticeably larger piece,
a rank reached but visibly ill-fitting,
editorial conceptual illustration for a science magazine, low upward angle, isolated plinth,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the piece only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Une pièce d'échecs posée dans l'empreinte d'un socle taillée pour une pièce plus grande.`

---

### `syndrome-imposteur-aux-echecs`

*Le syndrome de l'imposteur aux échecs : jouer sous le poids du doute* — Ici le mécanisme est l'attribution : la réussite est portée au compte de la chance, jamais de soi. Des racines profondes sous un arbre que personne ne voit rendent ce mérite invisible à celui qui le porte.

```
a deep dense root system under thin soil, entirely hidden beneath a modest visible sprout,
real foundations that their owner refuses to count,
editorial conceptual illustration for a science magazine, vertical cross-section, underground cutaway,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the roots only, warm amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, blue, teal, cyan, green, cold tones
```

`alt` : `Coupe souterraine montrant un vaste réseau de racines sous une pousse minuscule.`

---
