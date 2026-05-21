import { Layout, LayoutProps, Rect, Txt } from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  SimpleSignal,
  SignalValue,
} from "@motion-canvas/core";
import { theme } from "../theme";

/**
 * Échiquier 8x8 paramétrable, conçu pour les vidéos longues.
 *
 * - `setup` accepte un objet { case → pièce } (notation algébrique, ex. {"e4": "P", "g1": "N"})
 *   ou un tableau de 64 chaînes vides/pièces (row-major, depuis a8).
 * - Les pièces sont des caractères Unicode (♔♕♖♗♘♙ pour blancs, ♚♛♜♝♞♟ pour noirs)
 *   rendues avec font-piece (DejaVu Sans / Apple Symbols selon plateforme).
 * - Expose des helpers pour la révélation progressive (`reveal(piece)`)
 *   et le masquage façon Chase & Simon (`hideAll()`).
 */

export type PieceCode = "K" | "Q" | "R" | "B" | "N" | "P" | "k" | "q" | "r" | "b" | "n" | "p" | "";

const PIECE_GLYPH: Record<string, string> = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

/** Coordonnées algébriques d'une case à partir de (file, rank) 0-7. */
function square(file: number, rank: number): string {
  return String.fromCharCode("a".charCodeAt(0) + file) + (rank + 1);
}

/** Parse une position depuis un objet {case: pièce} vers un tableau de 64. */
export function positionFromSquares(
  squares: Partial<Record<string, PieceCode>>,
): PieceCode[] {
  const board: PieceCode[] = Array(64).fill("");
  for (const [sq, piece] of Object.entries(squares)) {
    if (!piece) continue;
    const file = sq.charCodeAt(0) - "a".charCodeAt(0);
    const rank = parseInt(sq[1], 10) - 1;
    if (file < 0 || file > 7 || rank < 0 || rank > 7) continue;
    // Index 0 = a8 (top-left in visual order), 63 = h1
    const idx = (7 - rank) * 8 + file;
    board[idx] = piece;
  }
  return board;
}

/** Mélange aléatoire reproductible (seed) des cases occupées. */
export function shuffleBoard(
  board: PieceCode[],
  seed = 42,
): PieceCode[] {
  // PRNG simple (mulberry32) pour reproductibilité entre rendus.
  let s = seed >>> 0;
  const rand = () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const pieces = board.filter((p) => p !== "");
  const result: PieceCode[] = Array(64).fill("");
  const indices = Array.from({ length: 64 }, (_, i) => i);
  // Fisher-Yates sur les indices, on prend les N premiers pour placer les N pièces.
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  pieces.forEach((piece, k) => {
    result[indices[k]] = piece;
  });
  return result;
}

interface ChessBoardProps extends LayoutProps {
  size?: SignalValue<number>;
  /** Position initiale : objet `{a1: "R", ...}` ou tableau de 64. */
  setup?: Partial<Record<string, PieceCode>> | PieceCode[];
  /** Afficher les coordonnées (a-h, 1-8) sur les bords. */
  showCoordinates?: boolean;
  /** Cacher toutes les pièces dès le départ (utile pour révélation). */
  startHidden?: boolean;
}

export class ChessBoard extends Layout {
  public readonly size: SimpleSignal<number, this>;
  private readonly board: PieceCode[];
  private readonly pieceRefs: ReturnType<typeof createRef<Txt>>[] = [];

  public constructor(props: ChessBoardProps) {
    super(props);
    this.size = createSignal(props.size ?? 600) as SimpleSignal<number, this>;

    const raw = props.setup;
    this.board = Array.isArray(raw)
      ? raw
      : raw
        ? positionFromSquares(raw)
        : Array(64).fill("");

    this.draw(props.showCoordinates ?? false, props.startHidden ?? false);
  }

  private draw(showCoordinates: boolean, startHidden: boolean) {
    const boardSize = this.size();
    const cell = boardSize / 8;

    // Cadre + cases
    const grid = new Layout({
      size: boardSize,
      layout: false,
    });
    this.add(grid);

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const isLight = (file + rank) % 2 === 0;
        const xCenter = (file - 3.5) * cell;
        // Visual rank: rank 0 = bottom (1), 7 = top (8). Y axis = inverted.
        const yCenter = (3.5 - rank) * cell;

        grid.add(
          new Rect({
            x: xCenter,
            y: yCenter,
            width: cell,
            height: cell,
            fill: isLight ? theme.boardLight : theme.boardDark,
          }),
        );

        const idx = (7 - rank) * 8 + file;
        const piece = this.board[idx];
        if (piece) {
          const ref = createRef<Txt>();
          this.pieceRefs.push(ref);
          grid.add(
            <Txt
              ref={ref}
              x={xCenter}
              y={yCenter}
              text={PIECE_GLYPH[piece]}
              fontFamily={theme.fontPiece}
              fontSize={cell * 0.78}
              fill={piece === piece.toUpperCase() ? "#fafafa" : "#1a1a1a"}
              stroke={piece === piece.toUpperCase() ? "#1a1a1a" : "#1a1a1a"}
              lineWidth={2.5}
              strokeFirst
              opacity={startHidden ? 0 : 1}
              data-square={square(file, rank)}
              data-piece={piece}
            />,
          );
        }
      }
    }

    // Bordure éditoriale autour de l'échiquier
    grid.add(
      new Rect({
        size: boardSize + 6,
        stroke: theme.boardBorder,
        lineWidth: 3,
      }),
    );

    if (showCoordinates) {
      const labelSize = cell * 0.18;
      for (let file = 0; file < 8; file++) {
        const xCenter = (file - 3.5) * cell;
        grid.add(
          new Txt({
            x: xCenter,
            y: boardSize / 2 + labelSize,
            text: String.fromCharCode("a".charCodeAt(0) + file),
            fontFamily: theme.fontDisplay,
            fontSize: labelSize,
            fill: theme.textDim,
          }),
        );
      }
      for (let rank = 0; rank < 8; rank++) {
        const yCenter = (3.5 - rank) * cell;
        grid.add(
          new Txt({
            x: -boardSize / 2 - labelSize,
            y: yCenter,
            text: String(rank + 1),
            fontFamily: theme.fontDisplay,
            fontSize: labelSize,
            fill: theme.textDim,
          }),
        );
      }
    }
  }

  /** Refs vers toutes les pièces actuellement placées sur le plateau. */
  public pieces() {
    return this.pieceRefs;
  }
}
