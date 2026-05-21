import { Layout, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  chain,
  createRef,
  createSignal,
  Direction,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  slideTransition,
  waitFor,
} from "@motion-canvas/core";

import { ChessBoard, PieceCode, shuffleBoard } from "../components/ChessBoard";
import { theme } from "../theme";

/**
 * Scène témoin — Chase & Simon (1973), expérience reconstruite visuellement
 * pour étayer l'article echecs-et-memoire.
 *
 * Découpage Vox-style :
 *   1. Hook ("Combien de pièces…")
 *   2. Phase 1 — Position réelle, 5 s d'exposition, rideau, comptage
 *   3. Phase 2 — Mêmes pièces, mais aléatoires, mêmes 5 s, rideau, comptage
 *   4. Conclusion ("Pas une mémoire. Une bibliothèque de chunks.")
 *
 * Durée totale ~32 s à 30 fps (~960 frames).
 * Tout est sans son ; les espaces de respiration laissent place à la voix-off à venir.
 */

// Position de référence : milieu de partie type Ruy López, position équilibrée,
// suffisamment dense pour rendre l'expérience visuellement claire (≈26 pièces).
const REAL_POSITION: Partial<Record<string, PieceCode>> = {
  // Blancs
  a1: "R", c1: "B", d1: "Q", e1: "K", h1: "R",
  c3: "N", d2: "B", f3: "N",
  a2: "P", b2: "P", c2: "P", d4: "P", e4: "P", f2: "P", g2: "P", h2: "P",
  // Noirs
  a8: "r", c8: "b", d8: "q", e8: "k", h8: "r",
  c6: "n", f6: "n",
  a7: "p", b7: "p", c7: "p", d6: "p", e5: "p", f7: "p", g7: "p", h7: "p",
};

const COUNTDOWN_FROM = 5;

export default makeScene2D(function* (view) {
  view.fill(theme.bg);

  // ── 1. Hook : titre éditorial centré ─────────────────────────────
  const titleRef = createRef<Txt>();
  const subtitleRef = createRef<Txt>();

  view.add(
    <Layout direction="column" gap={36} alignItems="center" opacity={0} ref={createRef<Layout>()}>
      <Txt
        ref={titleRef}
        text="Chase & Simon, 1973"
        fontFamily={theme.fontDisplay}
        fontSize={72}
        fontWeight={700}
        fill={theme.textMain}
        opacity={0}
      />
      <Txt
        ref={subtitleRef}
        text="Combien de pièces une mémoire de Grand Maître retient-elle vraiment ?"
        fontFamily={theme.fontSerif}
        fontStyle="italic"
        fontSize={40}
        fill={theme.textMuted}
        opacity={0}
        textAlign="center"
        maxWidth={1300}
      />
    </Layout>,
  );

  yield* titleRef().opacity(1, 0.6, easeOutCubic);
  yield* waitFor(0.3);
  yield* subtitleRef().opacity(1, 0.7, easeOutCubic);
  yield* waitFor(1.8);
  yield* all(
    titleRef().opacity(0, 0.5, easeInOutCubic),
    subtitleRef().opacity(0, 0.5, easeInOutCubic),
  );

  // ── 2. Phase 1 — Position réelle ─────────────────────────────────
  const boardRef = createRef<ChessBoard>();
  const phaseLabelRef = createRef<Txt>();
  const countdownSig = createSignal(COUNTDOWN_FROM);
  const countdownRef = createRef<Txt>();
  const curtainRef = createRef<Rect>();

  view.add(
    <Layout direction="column" gap={48} alignItems="center">
      <Txt
        ref={phaseLabelRef}
        text="POSITION RÉELLE — 5 SECONDES POUR LA MÉMORISER"
        fontFamily={theme.fontDisplay}
        fontSize={32}
        fontWeight={600}
        letterSpacing={6}
        fill={theme.green}
        opacity={0}
        y={-460}
      />
      <ChessBoard
        ref={boardRef}
        size={620}
        setup={REAL_POSITION}
        showCoordinates
        opacity={0}
      />
      <Txt
        ref={countdownRef}
        text={() => String(Math.ceil(countdownSig()))}
        fontFamily={theme.fontSerif}
        fontStyle="italic"
        fontSize={140}
        fontWeight={500}
        fill={theme.green}
        opacity={0}
        y={460}
      />
    </Layout>,
  );

  // Rideau noir au-dessus du plateau, utilisé pour la phase "mémorisation terminée"
  view.add(
    <Rect
      ref={curtainRef}
      size={[700, 700]}
      fill="#0d0d0d"
      stroke={theme.textMain}
      lineWidth={2}
      radius={4}
      opacity={0}
    />,
  );

  yield* slideTransition(Direction.Left, 0.6);
  yield* all(
    boardRef().opacity(1, 0.5, easeOutCubic),
    phaseLabelRef().opacity(1, 0.5, easeOutCubic),
  );
  yield* countdownRef().opacity(1, 0.3);

  // Countdown 5 → 0 en 5 secondes
  yield* countdownSig(0, COUNTDOWN_FROM, easeInOutCubic);

  // Le rideau tombe : la position est cachée
  yield* all(
    curtainRef().opacity(0.97, 0.45, easeOutCubic),
    countdownRef().opacity(0, 0.3),
    phaseLabelRef().text("RECONSTRUIRE LA POSITION DE MÉMOIRE", 0.4),
  );
  yield* waitFor(0.6);

  // ── 3. Affichage des résultats Phase 1 ───────────────────────────
  yield* showResultBars(view, {
    title: "Pièces correctement replacées",
    novice: { value: 4, max: 26, color: theme.espritAccent, label: "Novice" },
    master: { value: 28, max: 26, color: theme.green, label: "Grand Maître" },
    caption: "Sur 26 pièces. L'écart est dramatique.",
  });

  // Reset visuel pour Phase 2
  yield* all(
    curtainRef().opacity(0, 0.4),
    boardRef().opacity(0, 0.4),
    phaseLabelRef().opacity(0, 0.3),
  );

  // ── 4. Phase 2 — Mêmes pièces, mais en positions aléatoires ──────
  const realBoard = boardRef();
  // Remplacement du plateau par une version mélangée des mêmes pièces
  const reshuffled = shuffleBoard(positionToArray(REAL_POSITION), 1337);
  realBoard.remove();

  const board2Ref = createRef<ChessBoard>();
  view.add(
    <ChessBoard
      ref={board2Ref}
      size={620}
      setup={reshuffled}
      showCoordinates
      opacity={0}
    />,
  );

  countdownSig(COUNTDOWN_FROM);
  yield* all(
    board2Ref().opacity(1, 0.5, easeOutCubic),
    phaseLabelRef().text("MÊMES PIÈCES, POSITION ALÉATOIRE", 0.4),
    phaseLabelRef().opacity(1, 0.4),
    countdownRef().opacity(1, 0.3),
  );
  yield* countdownSig(0, COUNTDOWN_FROM, easeInOutCubic);

  yield* all(
    curtainRef().opacity(0.97, 0.45, easeOutCubic),
    countdownRef().opacity(0, 0.3),
    phaseLabelRef().text("ET MAINTENANT ?", 0.4),
  );
  yield* waitFor(0.6);

  yield* showResultBars(view, {
    title: "Pièces correctement replacées",
    novice: { value: 4, max: 26, color: theme.espritAccent, label: "Novice" },
    master: { value: 4, max: 26, color: theme.green, label: "Grand Maître" },
    caption: "L'avantage du maître s'évapore. Totalement.",
  });

  yield* all(
    curtainRef().opacity(0, 0.4),
    board2Ref().opacity(0, 0.4),
    phaseLabelRef().opacity(0, 0.3),
  );

  // ── 5. Conclusion ────────────────────────────────────────────────
  const conclusionRef = createRef<Layout>();
  view.add(
    <Layout
      ref={conclusionRef}
      direction="column"
      gap={40}
      alignItems="center"
      opacity={0}
    >
      <Txt
        text="Pas une mémoire supérieure."
        fontFamily={theme.fontDisplay}
        fontSize={64}
        fontWeight={700}
        fill={theme.textMain}
      />
      <Txt
        text="Une bibliothèque de chunks."
        fontFamily={theme.fontSerif}
        fontStyle="italic"
        fontSize={88}
        fontWeight={500}
        fill={theme.green}
      />
      <Txt
        text="Chase & Simon, Cognitive Psychology, 4(1), 55-81"
        fontFamily={theme.fontDisplay}
        fontSize={26}
        fontWeight={500}
        letterSpacing={2}
        fill={theme.textDim}
        y={40}
      />
    </Layout>,
  );

  yield* conclusionRef().opacity(1, 0.8, easeOutCubic);
  yield* waitFor(2.5);
  yield* conclusionRef().opacity(0, 0.6, easeInOutCubic);
});

// ── Helpers ─────────────────────────────────────────────────────────

interface ResultBarSpec {
  value: number;
  max: number;
  color: string;
  label: string;
}

interface ResultBarsConfig {
  title: string;
  novice: ResultBarSpec;
  master: ResultBarSpec;
  caption: string;
}

function* showResultBars(view: ReturnType<typeof makeScene2D>["prototype"]["children"] extends never ? never : any, cfg: ResultBarsConfig) {
  const containerRef = createRef<Layout>();
  const noviceWidth = createSignal(0);
  const masterWidth = createSignal(0);
  const BAR_FULL_WIDTH = 760;

  view.add(
    <Layout
      ref={containerRef}
      direction="column"
      gap={56}
      alignItems="start"
      opacity={0}
      width={900}
    >
      <Txt
        text={cfg.title}
        fontFamily={theme.fontDisplay}
        fontSize={36}
        fontWeight={600}
        fill={theme.textMain}
      />
      {/* Novice */}
      <Layout direction="column" gap={12} width={900}>
        <Layout direction="row" justifyContent="space-between" width={900}>
          <Txt text={cfg.novice.label} fontFamily={theme.fontDisplay} fontSize={28} fontWeight={500} fill={theme.textMuted} />
          <Txt
            text={() => `${Math.round((noviceWidth() / BAR_FULL_WIDTH) * cfg.novice.max)} / ${cfg.novice.max}`}
            fontFamily={theme.fontSerif}
            fontStyle="italic"
            fontSize={32}
            fill={cfg.novice.color}
          />
        </Layout>
        <Rect width={BAR_FULL_WIDTH} height={18} fill={theme.bgWarm} radius={4}>
          <Rect
            width={() => noviceWidth()}
            height={18}
            x={() => (noviceWidth() - BAR_FULL_WIDTH) / 2}
            fill={cfg.novice.color}
            radius={4}
          />
        </Rect>
      </Layout>
      {/* Master */}
      <Layout direction="column" gap={12} width={900}>
        <Layout direction="row" justifyContent="space-between" width={900}>
          <Txt text={cfg.master.label} fontFamily={theme.fontDisplay} fontSize={28} fontWeight={500} fill={theme.textMuted} />
          <Txt
            text={() => `${Math.round((masterWidth() / BAR_FULL_WIDTH) * cfg.master.max)} / ${cfg.master.max}`}
            fontFamily={theme.fontSerif}
            fontStyle="italic"
            fontSize={32}
            fill={cfg.master.color}
          />
        </Layout>
        <Rect width={BAR_FULL_WIDTH} height={18} fill={theme.bgWarm} radius={4}>
          <Rect
            width={() => masterWidth()}
            height={18}
            x={() => (masterWidth() - BAR_FULL_WIDTH) / 2}
            fill={cfg.master.color}
            radius={4}
          />
        </Rect>
      </Layout>
      <Txt
        text={cfg.caption}
        fontFamily={theme.fontSerif}
        fontStyle="italic"
        fontSize={30}
        fill={theme.textMuted}
        marginTop={20}
      />
    </Layout>,
  );

  const noviceTarget = (cfg.novice.value / cfg.novice.max) * BAR_FULL_WIDTH;
  const masterTarget = (cfg.master.value / cfg.master.max) * BAR_FULL_WIDTH;

  yield* containerRef().opacity(1, 0.5, easeOutCubic);
  yield* chain(
    noviceWidth(noviceTarget, 1.1, easeOutBack),
    waitFor(0.25),
    masterWidth(masterTarget, 1.1, easeOutBack),
    waitFor(2.0),
  );
  yield* containerRef().opacity(0, 0.45, easeInOutCubic);
  containerRef().remove();
}

function positionToArray(squares: Partial<Record<string, PieceCode>>): PieceCode[] {
  const board: PieceCode[] = Array(64).fill("");
  for (const [sq, piece] of Object.entries(squares)) {
    if (!piece) continue;
    const file = sq.charCodeAt(0) - "a".charCodeAt(0);
    const rank = parseInt(sq[1], 10) - 1;
    const idx = (7 - rank) * 8 + file;
    board[idx] = piece;
  }
  return board;
}
