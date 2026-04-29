import "chessboard-element";
import { Chess } from "chess.js";

declare global {
  interface Window {
    __analysisCleanup?: () => void;
  }
}

window.__analysisCleanup?.();

const PIECE_UNICODE: Record<string, string> = {
  wp: "\u2659", wn: "\u2658", wb: "\u2657", wr: "\u2656", wq: "\u2655", wk: "\u2654",
  bp: "\u265F", bn: "\u265E", bb: "\u265D", br: "\u265C", bq: "\u265B", bk: "\u265A",
};
const PIECE_VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

function initAnalysisPage() {
  const board = document.getElementById("analysis-board") as any;
  const input = document.getElementById("position-input") as HTMLTextAreaElement | null;
  const fileInput = document.getElementById("position-file") as HTMLInputElement | null;
  const loadBtn = document.getElementById("load-position");
  const undoBtn = document.getElementById("undo-move");
  const resetBtn = document.getElementById("reset-board");
  const flipBtn = document.getElementById("flip-board");
  const playBestBtn = document.getElementById("play-bestmove");
  const reviewFirstBtn = document.getElementById("review-first");
  const reviewPrevBtn = document.getElementById("review-prev");
  const reviewNextBtn = document.getElementById("review-next");
  const reviewLastBtn = document.getElementById("review-last");
  const statusLine = document.getElementById("status-line");
  const movesList = document.getElementById("moves-list");
  const depthEl = document.getElementById("engine-depth");
  const bestMoveEl = document.getElementById("engine-bestmove");
  const pvEl = document.getElementById("engine-pv");
  const depthRange = document.getElementById("engine-depth-range") as HTMLInputElement | null;
  const depthValue = document.getElementById("engine-depth-value");
  const evalFill = document.getElementById("eval-fill") as HTMLElement | null;
  const evalLabel = document.getElementById("eval-label");
  const turnIndicator = document.getElementById("turn-indicator");
  const capturedBlack = document.getElementById("captured-black");
  const capturedWhite = document.getElementById("captured-white");

  if (
    !board || !input || !fileInput || !loadBtn || !undoBtn || !resetBtn ||
    !flipBtn || !playBestBtn || !reviewFirstBtn || !reviewPrevBtn ||
    !reviewNextBtn || !reviewLastBtn || !statusLine || !movesList ||
    !depthEl || !bestMoveEl || !pvEl || !depthRange || !depthValue ||
    !evalFill || !evalLabel || !turnIndicator || !capturedBlack || !capturedWhite
  ) {
    return;
  }

  const chess = new Chess();
  let orientation = "white";
  let currentBestMove = "";
  let replayMoves: any[] = [];
  let replayIndex = 0;
  let manualNotes: string[] = [];
  let targetDepth = Number(depthRange.value);
  let lastSuggestionBeforeMove = "";
  depthValue.textContent = `${targetDepth}`;

  const engine = new Worker("/stockfish/stockfish.js");
  engine.postMessage("uci");
  engine.postMessage("isready");
  engine.postMessage("setoption name MultiPV value 1");

  const setStatus = (message: string) => {
    statusLine.textContent = message;
  };

  // --- Turn indicator ---
  const updateTurnIndicator = () => {
    const isWhite = chess.turn() === "w";
    const dot = turnIndicator.querySelector(".turn-dot") as HTMLElement;
    const text = turnIndicator.querySelector(".turn-text") as HTMLElement;
    if (dot) dot.style.background = isWhite ? "#fff" : "#222";
    if (text) text.textContent = isWhite ? "Trait aux Blancs" : "Trait aux Noirs";
    if (chess.isCheckmate()) {
      if (text) text.textContent = isWhite ? "Mat - les Noirs gagnent" : "Mat - les Blancs gagnent";
    } else if (chess.isDraw()) {
      if (text) text.textContent = "Partie nulle";
    } else if (chess.isCheck()) {
      if (text) text.textContent += " - Échec !";
    }
  };

  // --- Captured pieces ---
  const updateCaptured = () => {
    const start: Record<string, number> = { P: 8, N: 2, B: 2, R: 2, Q: 1, K: 1, p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
    const boardState = chess.board().flat();
    for (const sq of boardState) {
      if (sq) {
        const key = sq.color === "w" ? sq.type.toUpperCase() : sq.type.toLowerCase();
        start[key] = (start[key] ?? 0) - 1;
      }
    }

    let whiteCaptures = ""; // pieces noires capturees par les blancs
    let blackCaptures = ""; // pieces blanches capturees par les noirs
    let whiteMat = 0;
    let blackMat = 0;
    for (const [piece, count] of Object.entries(start)) {
      if (count <= 0) continue;
      const isUpper = piece === piece.toUpperCase();
      const color = isUpper ? "w" : "b";
      const type = piece.toLowerCase();
      const sym = PIECE_UNICODE[`${color}${type}`] ?? "";
      const val = PIECE_VALUE[type] ?? 0;
      if (color === "w") {
        blackCaptures += sym.repeat(count);
        blackMat += val * count;
      } else {
        whiteCaptures += sym.repeat(count);
        whiteMat += val * count;
      }
    }

    const diff = whiteMat - blackMat;
    const diffStr = diff > 0 ? ` +${diff}` : diff < 0 ? ` ${diff}` : "";

    if (orientation === "white") {
      capturedBlack.innerHTML = `<span class="captured-pieces">${whiteCaptures}</span>${diff > 0 ? `<span class="mat-diff">+${diff}</span>` : ""}`;
      capturedWhite.innerHTML = `<span class="captured-pieces">${blackCaptures}</span>${diff < 0 ? `<span class="mat-diff">${diff}</span>` : ""}`;
    } else {
      capturedBlack.innerHTML = `<span class="captured-pieces">${blackCaptures}</span>${diff < 0 ? `<span class="mat-diff">${diff}</span>` : ""}`;
      capturedWhite.innerHTML = `<span class="captured-pieces">${whiteCaptures}</span>${diff > 0 ? `<span class="mat-diff">+${diff}</span>` : ""}`;
    }
  };

  // --- Move list with clickable moves (chess.com style: pairs on same row) ---
  const updateMoves = () => {
    const totalMoves = replayMoves.length ? replayMoves.length : chess.history().length;
    const allMoves = replayMoves.length ? replayMoves : chess.history({ verbose: true });
    movesList.innerHTML = "";

    if (!allMoves.length) {
      const empty = document.createElement("div");
      empty.className = "moves-empty";
      empty.textContent = "Aucun coup joué.";
      movesList.appendChild(empty);
      return;
    }

    for (let i = 0; i < allMoves.length; i += 2) {
      const row = document.createElement("div");
      row.className = "move-row";

      const num = document.createElement("span");
      num.className = "move-num";
      num.textContent = `${Math.floor(i / 2) + 1}.`;
      row.appendChild(num);

      const whiteBtn = document.createElement("button");
      whiteBtn.className = "move-btn" + (i + 1 === replayIndex ? " active" : "");
      const wNote = manualNotes[i] ? ` ${manualNotes[i]}` : "";
      whiteBtn.textContent = `${allMoves[i].san}${wNote}`;
      whiteBtn.dataset.moveIdx = String(i + 1);
      whiteBtn.addEventListener("click", () => goToMove(i + 1));
      row.appendChild(whiteBtn);

      if (i + 1 < allMoves.length) {
        const blackBtn = document.createElement("button");
        blackBtn.className = "move-btn" + (i + 2 === replayIndex ? " active" : "");
        const bNote = manualNotes[i + 1] ? ` ${manualNotes[i + 1]}` : "";
        blackBtn.textContent = `${allMoves[i + 1].san}${bNote}`;
        blackBtn.dataset.moveIdx = String(i + 2);
        blackBtn.addEventListener("click", () => goToMove(i + 2));
        row.appendChild(blackBtn);
      }

      movesList.appendChild(row);
    }

    // Auto-scroll to active move
    const active = movesList.querySelector(".move-btn.active");
    if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const setEval = (cp: number, mate: number | null) => {
    const turn = chess.turn();
    if (mate !== null) {
      const adjustedMate = turn === "b" ? -mate : mate;
      evalLabel.textContent = `#${adjustedMate}`;
      const forWhite = adjustedMate > 0 ? 100 : 0;
      evalFill.style.height = `${forWhite}%`;
      return;
    }
    const adjustedCp = turn === "b" ? -cp : cp;
    const safeCp = Math.max(-1200, Math.min(1200, adjustedCp));
    const ratio = (safeCp + 1200) / 2400;
    evalFill.style.height = `${Math.round(ratio * 100)}%`;
    evalLabel.textContent = `${(safeCp / 100).toFixed(2)}`;
  };

  const requestEvaluation = () => {
    engine.postMessage("stop");
    engine.postMessage(`position fen ${chess.fen()}`);
    engine.postMessage(`go depth ${targetDepth}`);
  };

  const syncBoard = () => {
    board.setPosition(chess.fen());
    updateMoves();
    updateTurnIndicator();
    updateCaptured();
    requestEvaluation();
  };

  // --- Navigation ---
  const goToMove = (idx: number) => {
    if (!replayMoves.length) return;
    idx = Math.max(0, Math.min(replayMoves.length, idx));
    replayIndex = idx;
    chess.reset();
    for (let i = 0; i < replayIndex; i += 1) {
      chess.move({
        from: replayMoves[i].from,
        to: replayMoves[i].to,
        promotion: replayMoves[i].promotion,
      });
    }
    syncBoard();
    setStatus(idx === 0 ? "Position initiale." : `Coup ${replayIndex}/${replayMoves.length}.`);
  };

  const isLikelyFen = (value: string) =>
    /^([pnbrqkPNBRQK1-8]+\/){7}[pnbrqkPNBRQK1-8]+ [wb] (?:-|[KQkq]{1,4}) (?:-|[a-h][36]) \d+ \d+$/.test(value);

  const sanitizePgn = (value: string) => {
    let out = "";
    let braceDepth = 0;
    let variationDepth = 0;
    let inSemicolonComment = false;

    for (let i = 0; i < value.length; i += 1) {
      const ch = value[i];
      if (inSemicolonComment) { if (ch === "\n") { inSemicolonComment = false; out += ch; } continue; }
      if (braceDepth > 0) { if (ch === "{") braceDepth += 1; else if (ch === "}") braceDepth -= 1; continue; }
      if (variationDepth > 0) { if (ch === "(") variationDepth += 1; else if (ch === ")") variationDepth -= 1; continue; }
      if (ch === ";") { inSemicolonComment = true; continue; }
      if (ch === "{") { braceDepth = 1; continue; }
      if (ch === "(") { variationDepth = 1; continue; }
      if (ch === "$") { while (i + 1 < value.length && /\d/.test(value[i + 1])) i += 1; continue; }
      out += ch;
    }

    return out.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
  };

  const detectAndLoad = (text: string) => {
    const clean = text.trim();
    if (!clean) { setStatus("Le champ est vide."); return; }

    const test = new Chess();
    const loadedReplay: any[] = [];
    let loaded = false;
    try {
      if (isLikelyFen(clean)) {
        test.load(clean);
        loaded = true;
      } else {
        try {
          test.loadPgn(clean, { strict: false });
          loadedReplay.push(...test.history({ verbose: true }));
          loaded = loadedReplay.length > 0;
        } catch { loaded = false; }
        if (!loaded) {
          const normalizedPgn = sanitizePgn(clean);
          test.reset();
          test.loadPgn(normalizedPgn, { strict: false });
          loadedReplay.push(...test.history({ verbose: true }));
          loaded = loadedReplay.length > 0;
        }
      }
    } catch { loaded = false; }

    if (!loaded) {
      setStatus("Format invalide ou non reconnu. Vérifie le contenu (PGN complet avec coups, ou FEN valide).");
      return;
    }

    if (loadedReplay.length) {
      replayMoves = loadedReplay;
      replayIndex = replayMoves.length;
      manualNotes = [];
      chess.reset();
      for (let i = 0; i < replayIndex; i += 1) {
        chess.move({ from: replayMoves[i].from, to: replayMoves[i].to, promotion: replayMoves[i].promotion });
      }
    } else {
      replayMoves = [];
      replayIndex = 0;
      manualNotes = [];
      chess.load(test.fen());
    }
    syncBoard();
    setStatus(`Position chargée - ${replayMoves.length ? replayMoves.length + " coups" : "FEN"}.`);
  };

  const onDrop = (event: any) => {
    const { source, target, setAction } = event.detail;
    const move = chess.move({ from: source, to: target, promotion: "q" });
    if (!move) { setAction("snapback"); return; }
    setAction("drop");
    const playedUci = `${move.from}${move.to}${move.promotion ?? ""}`;
    const note = lastSuggestionBeforeMove && playedUci === lastSuggestionBeforeMove ? "!!" : "?!";
    if (replayMoves.length) {
      replayMoves = replayMoves.slice(0, replayIndex);
      manualNotes = manualNotes.slice(0, replayIndex);
    }
    replayMoves.push(move);
    manualNotes.push(note);
    replayIndex = replayMoves.length;
    syncBoard();
    setStatus(`Coup joué : ${move.san} ${note}`);
  };

  const onLoadClick = () => detectAndLoad(input.value);
  const onInputKeydown = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      detectAndLoad(input.value);
    }
  };
  const onFileChange = async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const content = await file.text();
    input.value = content;
    detectAndLoad(content);
  };
  const onUndo = () => {
    chess.undo();
    if (replayMoves.length) {
      replayMoves = replayMoves.slice(0, -1);
      manualNotes = manualNotes.slice(0, -1);
      replayIndex = replayMoves.length;
    }
    syncBoard();
    setStatus("Dernier coup annulé.");
  };
  const onReset = () => {
    chess.reset();
    replayMoves = [];
    replayIndex = 0;
    manualNotes = [];
    syncBoard();
    setStatus("Retour à la position initiale.");
  };
  const onFlip = () => {
    orientation = orientation === "white" ? "black" : "white";
    board.orientation = orientation;
    updateCaptured();
  };
  const onPlayBestMove = () => {
    if (!currentBestMove || currentBestMove === "(none)") {
      setStatus("Aucun meilleur coup disponible pour cette position.");
      return;
    }
    const from = currentBestMove.slice(0, 2);
    const to = currentBestMove.slice(2, 4);
    const promotion = currentBestMove.length > 4 ? currentBestMove.slice(4, 5) : "q";
    const move = chess.move({ from, to, promotion });
    if (!move) { setStatus("Le meilleur coup n'a pas pu être joué."); return; }
    if (replayMoves.length) {
      replayMoves = replayMoves.slice(0, replayIndex);
      manualNotes = manualNotes.slice(0, replayIndex);
    }
    replayMoves.push(move);
    manualNotes.push("!!");
    replayIndex = replayMoves.length;
    syncBoard();
    setStatus(`Meilleur coup joué : ${move.san}`);
  };
  const onReviewFirst = () => goToMove(0);
  const onReviewPrev = () => goToMove(replayIndex - 1);
  const onReviewNext = () => {
    if (!replayMoves.length || replayIndex >= replayMoves.length) return;
    const next = replayMoves[replayIndex];
    chess.move({ from: next.from, to: next.to, promotion: next.promotion });
    replayIndex += 1;
    syncBoard();
    setStatus(`Coup ${replayIndex}/${replayMoves.length}.`);
  };
  const onReviewLast = () => goToMove(replayMoves.length);

  const onDepthChange = () => {
    targetDepth = Number(depthRange.value);
    depthValue.textContent = `${targetDepth}`;
    requestEvaluation();
    setStatus(`Profondeur de recherche fixée à ${targetDepth}.`);
  };

  // --- Keyboard navigation ---
  const onKeydown = (event: KeyboardEvent) => {
    const tag = (event.target as HTMLElement)?.tagName;
    if (tag === "TEXTAREA" || tag === "INPUT") return;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        onReviewPrev();
        break;
      case "ArrowRight":
        event.preventDefault();
        onReviewNext();
        break;
      case "Home":
        event.preventDefault();
        onReviewFirst();
        break;
      case "End":
        event.preventDefault();
        onReviewLast();
        break;
      case "f":
      case "F":
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          onFlip();
        }
        break;
    }
  };

  const onEngineMessage = (event: MessageEvent) => {
    const line = typeof event.data === "string" ? event.data : "";
    if (!line) return;

    if (line.startsWith("info") && line.includes(" score ")) {
      const depthMatch = line.match(/ depth (\d+)/);
      const cpMatch = line.match(/ score cp (-?\d+)/);
      const mateMatch = line.match(/ score mate (-?\d+)/);
      const pvMatch = line.match(/ pv (.+)$/);

      if (depthMatch) depthEl.textContent = depthMatch[1];
      if (pvMatch) pvEl.textContent = pvMatch[1];

      if (mateMatch) {
        setEval(0, Number(mateMatch[1]));
      } else if (cpMatch) {
        setEval(Number(cpMatch[1]), null);
      }
    }

    if (line.startsWith("bestmove")) {
      const best = line.split(" ")[1] ?? "-";
      currentBestMove = best;
      bestMoveEl.textContent = best;
      lastSuggestionBeforeMove = best;
    }
  };
  engine.addEventListener("message", onEngineMessage);

  board.addEventListener("drop", onDrop);
  loadBtn.addEventListener("click", onLoadClick);
  input.addEventListener("keydown", onInputKeydown);
  fileInput.addEventListener("change", onFileChange);
  undoBtn.addEventListener("click", onUndo);
  resetBtn.addEventListener("click", onReset);
  flipBtn.addEventListener("click", onFlip);
  playBestBtn.addEventListener("click", onPlayBestMove);
  reviewFirstBtn.addEventListener("click", onReviewFirst);
  reviewPrevBtn.addEventListener("click", onReviewPrev);
  reviewNextBtn.addEventListener("click", onReviewNext);
  reviewLastBtn.addEventListener("click", onReviewLast);
  depthRange.addEventListener("input", onDepthChange);
  document.addEventListener("keydown", onKeydown);

  syncBoard();

  window.__analysisCleanup = () => {
    board.removeEventListener("drop", onDrop);
    loadBtn.removeEventListener("click", onLoadClick);
    input.removeEventListener("keydown", onInputKeydown);
    fileInput.removeEventListener("change", onFileChange);
    undoBtn.removeEventListener("click", onUndo);
    resetBtn.removeEventListener("click", onReset);
    flipBtn.removeEventListener("click", onFlip);
    playBestBtn.removeEventListener("click", onPlayBestMove);
    reviewFirstBtn.removeEventListener("click", onReviewFirst);
    reviewPrevBtn.removeEventListener("click", onReviewPrev);
    reviewNextBtn.removeEventListener("click", onReviewNext);
    reviewLastBtn.removeEventListener("click", onReviewLast);
    depthRange.removeEventListener("input", onDepthChange);
    document.removeEventListener("keydown", onKeydown);
    engine.removeEventListener("message", onEngineMessage);
    engine.postMessage("quit");
    engine.terminate();
  };
}

initAnalysisPage();
document.addEventListener("astro:page-load", initAnalysisPage);
