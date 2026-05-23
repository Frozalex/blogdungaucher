import { Img, Layout, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  chain,
  createRef,
  createSignal,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  easeOutExpo,
  waitFor,
} from "@motion-canvas/core";

import { ChessBoard, PieceCode, shuffleBoard } from "../components/ChessBoard";
import { ChapterMark } from "../components/ChapterMark";
import { Lower3rd } from "../components/Lower3rd";
import { theme } from "../theme";

/**
 * Résumé vidéo (~2 min) de l'article echecs-et-memoire.
 *
 * Structure 5 beats Vox-style :
 *   01. Le paradoxe       , Karpov : tout retenir vs tout oublier
 *   02. L'expérience      , Chase & Simon 1973 : 28 vs 4 pièces
 *   03. Le hasard         : mêmes pièces, position aléatoire : 4 vs 4
 *   04. La révélation     : chunks, une bibliothèque de patterns
 *   05. Pour ton jeu      : entraînement réflexif vs volume blitz
 *
 * Images :
 *   - /images/karpov.jpg (à télécharger, cf. public/images/README.md)
 *   - fallback sur placeholder couleur si fichier absent
 */

const ARTICLE_URL = "blogdungaucher.com/fr/blog/echecs-et-memoire";

// Position de référence : milieu de partie type Ruy López, 26 pièces.
const REAL_POSITION : Partial<Record<string, PieceCode>> = {
  a1: "R", c1: "B", d1: "Q", e1: "K", h1: "R",
  c3: "N", d2: "B", f3: "N",
  a2: "P", b2: "P", c2: "P", d4: "P", e4: "P", f2: "P", g2: "P", h2: "P",
  a8: "r", c8: "b", d8: "q", e8: "k", h8: "r",
  c6: "n", f6: "n",
  a7: "p", b7: "p", c7: "p", d6: "p", e5: "p", f7: "p", g7: "p", h7: "p",
};

const COUNTDOWN_FROM = 5;

export default makeScene2D(function* (view) {
  view.fill(theme.bg);
  yield* beat01Paradox(view);
  yield* beat02Experiment(view);
  yield* beat03Random(view);
  yield* beat04Chunks(view);
  yield* beat05Takeaway(view);
});

// ════════════════════════════════════════════════════════════════════
// BEAT 01, LE PARADOXE (Karpov)
// ════════════════════════════════════════════════════════════════════

function* beat01Paradox(view : ReturnType<typeof makeScene2D>) {
  // Fond noir Vox-style avec portrait Karpov ou fallback couleur
  const dark = createRef<Rect>();
  view.add(<Rect ref={dark} width={1920} height={1080} fill="#0d0d0d" />);

  // Portrait Karpov (Wikimedia ; fallback colored box si missing)
  const portraitRef = createRef<Layout>();
  view.add(
    <Layout ref={portraitRef} x={-480} y={20} opacity={0}>
      <Rect
        width={520}
        height={680}
        fill={theme.surfaceWarm}
        radius={4}
        stroke="rgba(250, 250, 250, 0.15)"
        lineWidth={1}
      />
      <Img
        src="/images/karpov.jpg"
        width={520}
        height={680}
        radius={4}
      />
      {/* Légende sous portrait */}
      <Txt
        text="ANATOLI KARPOV"
        fontFamily={theme.fontDisplay}
        fontSize={18}
        fontWeight={700}
        letterSpacing={4}
        fill="rgba(250, 250, 250, 0.55)"
        y={370}
      />
    </Layout>,
  );

  // Texte narratif : ligne par ligne (kinetic)
  const line1Ref = createRef<Txt>();
  const line2Ref = createRef<Txt>();
  const line3Ref = createRef<Txt>();

  view.add(
    <Layout direction="column" gap={32} alignItems="start" x={300} y={-50}>
      <Txt
        ref={line1Ref}
        text="Il rejouait de mémoire"
        fontFamily={theme.fontDisplay}
        fontSize={56}
        fontWeight={600}
        fill="#fafafa"
        opacity={0}
      />
      <Txt
        ref={line2Ref}
        text="des parties vieilles de 20 ans."
        fontFamily={theme.fontSerif}
        fontStyle="italic"
        fontSize={72}
        fontWeight={500}
        fill={theme.green}
        opacity={0}
      />
      <Txt
        ref={line3Ref}
        text="Et pourtant : il oubliait sa liste de courses."
        fontFamily={theme.fontDisplay}
        fontSize={40}
        fontWeight={400}
        fill="rgba(250, 250, 250, 0.7)"
        opacity={0}
        marginTop={40}
      />
    </Layout>,
  );

  yield* portraitRef().opacity(1, 0.6, easeOutCubic);
  yield* waitFor(0.3);
  yield* line1Ref().opacity(1, 0.4, easeOutCubic);
  yield* waitFor(0.5);
  yield* line2Ref().opacity(1, 0.5, easeOutCubic);
  yield* waitFor(1.0);
  yield* line3Ref().opacity(1, 0.5, easeOutCubic);
  yield* waitFor(2.2);

  yield* all(
    portraitRef().opacity(0, 0.4),
    line1Ref().opacity(0, 0.3),
    line2Ref().opacity(0, 0.3),
    line3Ref().opacity(0, 0.3),
    dark().opacity(0, 0.35),
  );

  [dark, portraitRef, line1Ref, line2Ref, line3Ref].forEach((r) => r().remove());
}

// ════════════════════════════════════════════════════════════════════
// BEAT 02, L'EXPÉRIENCE (Chase & Simon, position réelle)
// ════════════════════════════════════════════════════════════════════

function* beat02Experiment(view : ReturnType<typeof makeScene2D>) {
  // Hook : "1973" géant transition
  const yearRef = createRef<Txt>();
  view.add(
    <Txt
      ref={yearRef}
      text="1973"
      fontFamily={theme.fontDisplay}
      fontSize={320}
      fontWeight={700}
      fill={theme.textMain}
      letterSpacing={-10}
      opacity={0}
    />,
  );
  yield* yearRef().opacity(1, 0.35, easeOutExpo);
  yield* waitFor(0.7);
  yield* all(
    yearRef().fontSize(110, 0.4, easeInOutCubic),
    yearRef().y(-380, 0.4, easeInOutCubic),
  );

  // Plateau + countdown
  const chapterRef = createRef<ChapterMark>();
  const lower3rdRef = createRef<Lower3rd>();
  const boardRef = createRef<ChessBoard>();
  const instructionRef = createRef<Txt>();
  const countdownSig = createSignal(COUNTDOWN_FROM);
  const countdownRef = createRef<Txt>();
  const curtainRef = createRef<Rect>();

  view.add(
    <ChapterMark
      ref={chapterRef}
      number="01"
      label="L'expérience"
      opacity={0}
    />,
  );
  view.add(
    <Lower3rd
      ref={lower3rdRef}
      source="Chase WG & Simon HA"
      detail="Cognitive Psychology, 4(1), 1973"
      opacity={0}
    />,
  );
  view.add(
    <ChessBoard
      ref={boardRef}
      size={520}
      setup={REAL_POSITION}
      showCoordinates
      opacity={0}
    />,
  );
  view.add(
    <Txt
      ref={instructionRef}
      text="5 SECONDES POUR MÉMORISER"
      fontFamily={theme.fontDisplay}
      fontSize={26}
      fontWeight={700}
      letterSpacing={6}
      fill={theme.green}
      y={-310}
      opacity={0}
    />,
  );
  view.add(
    <Txt
      ref={countdownRef}
      text={() => String(Math.ceil(countdownSig()))}
      fontFamily={theme.fontSerif}
      fontStyle="italic"
      fontSize={160}
      fontWeight={500}
      fill={theme.green}
      x={500}
      opacity={0}
    />,
  );
  view.add(
    <Rect
      ref={curtainRef}
      size={[570, 570]}
      fill="#0d0d0d"
      radius={4}
      opacity={0}
    />,
  );

  yield* all(
    yearRef().opacity(0, 0.3),
    chapterRef().opacity(1, 0.35, easeOutCubic),
    boardRef().opacity(1, 0.45, easeOutCubic),
    instructionRef().opacity(1, 0.35, easeOutCubic),
    lower3rdRef().opacity(1, 0.4, easeOutCubic),
  );
  yield* countdownRef().opacity(1, 0.2);
  yield* countdownSig(0, COUNTDOWN_FROM, easeInOutCubic);
  yield* all(
    curtainRef().opacity(0.98, 0.15, easeInCubic),
    countdownRef().opacity(0, 0.15),
    instructionRef().text("RECONSTRUIRE DE MÉMOIRE", 0.2),
  );
  yield* waitFor(0.5);

  yield* all(
    boardRef().opacity(0, 0.2),
    curtainRef().opacity(0, 0.2),
    instructionRef().opacity(0, 0.2),
    chapterRef().opacity(0, 0.2),
    lower3rdRef().opacity(0, 0.2),
  );

  // Big numbers
  yield* bigNumberReveal(view, {
    label: "UN NOVICE REPLACE",
    bigNumber: "4",
    unit: "PIÈCES SUR 26",
    color: theme.espritAccent,
  });
  yield* bigNumberReveal(view, {
    label: "UN GRAND MAÎTRE EN REPLACE",
    bigNumber: "28",
    unit: "PIÈCES SUR 26",
    color: theme.green,
    emphasize: true,
  });

  const captionRef = createRef<Txt>();
  view.add(
    <Txt
      ref={captionRef}
      text="L'écart est dramatique."
      fontFamily={theme.fontSerif}
      fontStyle="italic"
      fontSize={56}
      fontWeight={500}
      fill={theme.textMain}
      opacity={0}
    />,
  );
  yield* captionRef().opacity(1, 0.35, easeOutCubic);
  yield* waitFor(1.2);
  yield* captionRef().opacity(0, 0.25);

  [yearRef, chapterRef, lower3rdRef, boardRef, instructionRef, countdownRef, curtainRef, captionRef].forEach((r) => r().remove());
}

// ════════════════════════════════════════════════════════════════════
// BEAT 03, LE HASARD (position aléatoire)
// ════════════════════════════════════════════════════════════════════

function* beat03Random(view : ReturnType<typeof makeScene2D>) {
  const reshuffled = shuffleBoard(positionToArray(REAL_POSITION), 1337);

  const chapterRef = createRef<ChapterMark>();
  const lower3rdRef = createRef<Lower3rd>();
  const boardRef = createRef<ChessBoard>();
  const instructionRef = createRef<Txt>();
  const countdownSig = createSignal(COUNTDOWN_FROM);
  const countdownRef = createRef<Txt>();
  const curtainRef = createRef<Rect>();

  view.add(
    <ChapterMark
      ref={chapterRef}
      number="02"
      label="Et au hasard ?"
      accent={theme.espritAccent}
      opacity={0}
    />,
  );
  view.add(
    <Lower3rd
      ref={lower3rdRef}
      source="Chase WG & Simon HA"
      detail="Cognitive Psychology, 4(1), 1973"
      accent={theme.espritAccent}
      opacity={0}
    />,
  );
  view.add(
    <ChessBoard
      ref={boardRef}
      size={520}
      setup={reshuffled}
      showCoordinates
      opacity={0}
    />,
  );
  view.add(
    <Txt
      ref={instructionRef}
      text="MÊMES 26 PIÈCES, POSITION ALÉATOIRE"
      fontFamily={theme.fontDisplay}
      fontSize={24}
      fontWeight={700}
      letterSpacing={5}
      fill={theme.espritAccent}
      y={-310}
      opacity={0}
    />,
  );
  view.add(
    <Txt
      ref={countdownRef}
      text={() => String(Math.ceil(countdownSig()))}
      fontFamily={theme.fontSerif}
      fontStyle="italic"
      fontSize={160}
      fontWeight={500}
      fill={theme.espritAccent}
      x={500}
      opacity={0}
    />,
  );
  view.add(
    <Rect
      ref={curtainRef}
      size={[570, 570]}
      fill="#0d0d0d"
      radius={4}
      opacity={0}
    />,
  );

  yield* all(
    chapterRef().opacity(1, 0.35, easeOutCubic),
    boardRef().opacity(1, 0.45, easeOutCubic),
    instructionRef().opacity(1, 0.35, easeOutCubic),
    lower3rdRef().opacity(1, 0.4, easeOutCubic),
  );
  yield* countdownRef().opacity(1, 0.2);
  yield* countdownSig(0, COUNTDOWN_FROM, easeInOutCubic);
  yield* all(
    curtainRef().opacity(0.98, 0.15, easeInCubic),
    countdownRef().opacity(0, 0.15),
    instructionRef().text("ET MAINTENANT ?", 0.2),
  );
  yield* waitFor(0.4);

  yield* all(
    boardRef().opacity(0, 0.2),
    curtainRef().opacity(0, 0.2),
    instructionRef().opacity(0, 0.2),
    chapterRef().opacity(0, 0.2),
    lower3rdRef().opacity(0, 0.2),
  );

  // 4 vs 4 : la révélation
  yield* bigNumberReveal(view, {
    label: "NOVICE",
    bigNumber: "4",
    unit: "/ 26",
    color: theme.espritAccent,
  });
  yield* bigNumberReveal(view, {
    label: "GRAND MAÎTRE",
    bigNumber: "4",
    unit: "/ 26",
    color: theme.espritAccent,
    emphasize: true,
  });

  const captionRef = createRef<Txt>();
  view.add(
    <Txt
      ref={captionRef}
      text="L'avantage du maître a disparu."
      fontFamily={theme.fontSerif}
      fontStyle="italic"
      fontSize={56}
      fontWeight={500}
      fill={theme.textMain}
      opacity={0}
    />,
  );
  yield* captionRef().opacity(1, 0.35, easeOutCubic);
  yield* waitFor(1.4);
  yield* captionRef().opacity(0, 0.25);

  [chapterRef, lower3rdRef, boardRef, instructionRef, countdownRef, curtainRef, captionRef].forEach((r) => r().remove());
}

// ════════════════════════════════════════════════════════════════════
// BEAT 04, LA RÉVÉLATION (chunks)
// ════════════════════════════════════════════════════════════════════

function* beat04Chunks(view : ReturnType<typeof makeScene2D>) {
  const dark = createRef<Rect>();
  view.add(<Rect ref={dark} width={1920} height={1080} fill="#0d0d0d" opacity={0} />);
  yield* dark().opacity(1, 0.2);

  const chapterRef = createRef<ChapterMark>();
  view.add(
    <ChapterMark
      ref={chapterRef}
      number="03"
      label="L'explication"
      opacity={0}
    />,
  );
  chapterRef().findFirst((n) => n instanceof Txt && n.text() === "L'EXPLICATION")?.fill("#fafafa");
  yield* chapterRef().opacity(1, 0.35, easeOutCubic);

  // Phrase clé en kinetic typography
  const w1 = createRef<Txt>();
  const w2 = createRef<Txt>();
  view.add(
    <Layout direction="column" gap={18} alignItems="center" y={-120}>
      <Txt
        ref={w1}
        text="Pas une mémoire supérieure."
        fontFamily={theme.fontDisplay}
        fontSize={64}
        fontWeight={700}
        fill="#fafafa"
        opacity={0}
      />
      <Txt
        ref={w2}
        text="Une bibliothèque de patterns."
        fontFamily={theme.fontSerif}
        fontStyle="italic"
        fontSize={88}
        fontWeight={500}
        fill={theme.green}
        opacity={0}
      />
    </Layout>,
  );
  yield* w1().opacity(1, 0.35, easeOutCubic);
  yield* waitFor(0.5);
  yield* w2().opacity(1, 0.4, easeOutBack);
  yield* waitFor(1.3);

  // Mini-démonstration visuelle d'un chunk : "roque court intact"
  const chunkLayout = createRef<Layout>();
  view.add(
    <Layout
      ref={chunkLayout}
      direction="row"
      alignItems="center"
      gap={60}
      y={140}
      opacity={0}
    >
      {/* Visual chunk : roi g1 + 3 pions f2 g2 h2 */}
      <Layout direction="column" alignItems="center" gap={10}>
        <Txt
          text="♔ ♙ ♙ ♙"
          fontFamily={theme.fontPiece}
          fontSize={56}
          fill="#fafafa"
        />
        <Txt
          text="4 OBJETS POUR TOI"
          fontFamily={theme.fontDisplay}
          fontSize={16}
          fontWeight={600}
          letterSpacing={3}
          fill="rgba(250, 250, 250, 0.5)"
        />
      </Layout>
      <Txt
        text="→"
        fontFamily={theme.fontSerif}
        fontSize={64}
        fill={theme.green}
      />
      <Layout direction="column" alignItems="center" gap={10}>
        <Txt
          text="roque court intact"
          fontFamily={theme.fontSerif}
          fontStyle="italic"
          fontSize={42}
          fontWeight={500}
          fill={theme.green}
        />
        <Txt
          text="1 CHUNK POUR LE MAÎTRE"
          fontFamily={theme.fontDisplay}
          fontSize={16}
          fontWeight={600}
          letterSpacing={3}
          fill="rgba(250, 250, 250, 0.5)"
        />
      </Layout>
    </Layout>,
  );
  yield* chunkLayout().opacity(1, 0.5, easeOutCubic);
  yield* waitFor(2.6);

  yield* all(
    w1().opacity(0, 0.3),
    w2().opacity(0, 0.3),
    chunkLayout().opacity(0, 0.3),
    chapterRef().opacity(0, 0.3),
    dark().opacity(0, 0.3),
  );
  [dark, chapterRef, w1, w2, chunkLayout].forEach((r) => r().remove());
}

// ════════════════════════════════════════════════════════════════════
// BEAT 05, POUR TON JEU (takeaway + CTA)
// ════════════════════════════════════════════════════════════════════

function* beat05Takeaway(view : ReturnType<typeof makeScene2D>) {
  const chapterRef = createRef<ChapterMark>();
  view.add(
    <ChapterMark
      ref={chapterRef}
      number="04"
      label="Pour ton jeu"
      opacity={0}
    />,
  );
  yield* chapterRef().opacity(1, 0.35, easeOutCubic);

  // Comparaison visuelle : Volume vs Réflexion
  const compareLayout = createRef<Layout>();
  view.add(
    <Layout
      ref={compareLayout}
      direction="row"
      gap={120}
      alignItems="center"
      y={20}
      opacity={0}
    >
      {/* Mauvaise voie */}
      <Layout direction="column" alignItems="center" gap={18}>
        <Txt
          text="50"
          fontFamily={theme.fontDisplay}
          fontSize={200}
          fontWeight={700}
          fill={theme.espritAccent}
          letterSpacing={-8}
        />
        <Txt
          text="BLITZ SANS ANALYSE"
          fontFamily={theme.fontDisplay}
          fontSize={20}
          fontWeight={700}
          letterSpacing={4}
          fill={theme.textMuted}
        />
        <Txt
          text="≈ aucun chunk construit"
          fontFamily={theme.fontSerif}
          fontStyle="italic"
          fontSize={26}
          fill={theme.textDim}
          marginTop={8}
        />
      </Layout>
      {/* Séparateur */}
      <Layout direction="column" alignItems="center" gap={4}>
        <Rect width={1} height={120} fill={theme.textDim} />
        <Txt
          text="VS"
          fontFamily={theme.fontDisplay}
          fontSize={28}
          fontWeight={700}
          letterSpacing={4}
          fill={theme.textDim}
        />
        <Rect width={1} height={120} fill={theme.textDim} />
      </Layout>
      {/* Bonne voie */}
      <Layout direction="column" alignItems="center" gap={18}>
        <Txt
          text="1"
          fontFamily={theme.fontDisplay}
          fontSize={200}
          fontWeight={700}
          fill={theme.green}
          letterSpacing={-8}
        />
        <Txt
          text="PARTIE LENTE ANALYSÉE"
          fontFamily={theme.fontDisplay}
          fontSize={20}
          fontWeight={700}
          letterSpacing={4}
          fill={theme.textMain}
        />
        <Txt
          text="vraie consolidation"
          fontFamily={theme.fontSerif}
          fontStyle="italic"
          fontSize={26}
          fill={theme.green}
          marginTop={8}
        />
      </Layout>
    </Layout>,
  );
  yield* compareLayout().opacity(1, 0.5, easeOutCubic);
  yield* waitFor(2.6);

  // CTA finale
  yield* compareLayout().opacity(0, 0.3);

  const cta1 = createRef<Txt>();
  const cta2 = createRef<Txt>();
  view.add(
    <Layout direction="column" gap={16} alignItems="center" y={-30}>
      <Txt
        ref={cta1}
        text="L'article complet"
        fontFamily={theme.fontSerif}
        fontStyle="italic"
        fontSize={56}
        fontWeight={500}
        fill={theme.textMain}
        opacity={0}
      />
      <Txt
        ref={cta2}
        text={ARTICLE_URL}
        fontFamily={theme.fontDisplay}
        fontSize={36}
        fontWeight={600}
        letterSpacing={2}
        fill={theme.green}
        opacity={0}
      />
    </Layout>,
  );
  yield* cta1().opacity(1, 0.35, easeOutCubic);
  yield* cta2().opacity(1, 0.35, easeOutCubic);
  yield* waitFor(2.2);
  yield* chain(
    cta1().opacity(0, 0.3),
    cta2().opacity(0, 0.3),
    chapterRef().opacity(0, 0.3),
  );

  [chapterRef, compareLayout, cta1, cta2].forEach((r) => r().remove());
}

// ════════════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════════════

interface BigNumberConfig {
  label: string;
  bigNumber: string;
  unit: string;
  color: string;
  emphasize?: boolean;
}

function* bigNumberReveal(view : ReturnType<typeof makeScene2D>, cfg : BigNumberConfig) {
  const labelRef = createRef<Txt>();
  const numberRef = createRef<Txt>();
  const unitRef = createRef<Txt>();

  view.add(
    <Txt
      ref={labelRef}
      text={cfg.label}
      fontFamily={theme.fontDisplay}
      fontSize={24}
      fontWeight={600}
      letterSpacing={5}
      fill={theme.textMuted}
      y={-180}
      opacity={0}
    />,
  );
  view.add(
    <Txt
      ref={numberRef}
      text={cfg.bigNumber}
      fontFamily={theme.fontDisplay}
      fontSize={cfg.emphasize ? 440 : 340}
      fontWeight={700}
      letterSpacing={-12}
      fill={cfg.color}
      opacity={0}
      scale={cfg.emphasize ? 0.85 : 1}
    />,
  );
  view.add(
    <Txt
      ref={unitRef}
      text={cfg.unit}
      fontFamily={theme.fontDisplay}
      fontSize={26}
      fontWeight={600}
      letterSpacing={5}
      fill={theme.textMuted}
      y={220}
      opacity={0}
    />,
  );

  yield* labelRef().opacity(1, 0.25, easeOutCubic);
  if (cfg.emphasize) {
    yield* all(
      numberRef().opacity(1, 0.3, easeOutBack),
      numberRef().scale(1, 0.35, easeOutBack),
    );
  } else {
    yield* numberRef().opacity(1, 0.3, easeOutCubic);
  }
  yield* unitRef().opacity(1, 0.25, easeOutCubic);
  yield* waitFor(cfg.emphasize ? 1.2 : 0.85);
  yield* all(
    labelRef().opacity(0, 0.2),
    numberRef().opacity(0, 0.2),
    unitRef().opacity(0, 0.2),
  );

  labelRef().remove();
  numberRef().remove();
  unitRef().remove();
}

function positionToArray(squares : Partial<Record<string, PieceCode>>): PieceCode[] {
  const board : PieceCode[] = Array(64).fill("");
  for (const [sq, piece] of Object.entries(squares)) {
    if (!piece) continue;
    const file = sq.charCodeAt(0) - "a".charCodeAt(0);
    const rank = parseInt(sq[1], 10) - 1;
    const idx = (7 - rank) * 8 + file;
    board[idx] = piece;
  }
  return board;
}
