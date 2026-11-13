import { Chess } from "chess.js";

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const text = (value, name) => {
  if (typeof value !== "string" || !value.trim()) throw new Error(`Champ manquant : ${name}`);
};
const paragraphs = (value, name) => {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`Paragraphes manquants : ${name}`);
  value.forEach((paragraph, index) => text(paragraph, `${name}.${index}`));
};

function checkLine(fen, moves, name) {
  text(fen, `${name}.fen`);
  paragraphs(moves, `${name}.solutionSan`);
  const game = new Chess(fen);
  for (const move of moves) game.move(move, { strict: true });
  return game;
}

/** Validate authored content; never manufacture a letter from an article excerpt. */
export function validateNewsletterLetter(letter) {
  if (!letter || typeof letter !== "object") throw new Error("La lettre doit être un objet JSON.");
  if (!["example", "draft"].includes(letter.status)) throw new Error("Statut attendu : example ou draft.");
  for (const key of ["subject", "preheader", "introduction"]) text(letter[key], key);
  for (const section of ["idea", "position", "reading"]) {
    if (!letter[section] || typeof letter[section] !== "object") throw new Error(`Rubrique manquante : ${section}`);
    text(letter[section].title, `${section}.title`);
  }
  paragraphs(letter.idea.paragraphs, "idea.paragraphs");
  for (const key of ["origin", "description", "solutionLabel"]) text(letter.position[key], `position.${key}`);
  paragraphs(letter.position.explanation, "position.explanation");
  checkLine(letter.position.fen, letter.position.solutionSan, "position");
  if (letter.position.comparisonFen || letter.position.comparisonSan) {
    checkLine(letter.position.comparisonFen, letter.position.comparisonSan, "comparison");
  }
  text(letter.reading.reason, "reading.reason");
  text(letter.reading.url, "reading.url");
  const reading = new URL(letter.reading.url);
  if (reading.protocol !== "https:" || reading.username || reading.password) throw new Error("La lecture doit avoir un lien HTTPS sans identifiants.");
  return letter;
}

function renderBoard(position) {
  const glyphs = { wk: "♔", wq: "♕", wr: "♖", wb: "♗", wn: "♘", wp: "♙", bk: "♚", bq: "♛", br: "♜", bb: "♝", bn: "♞", bp: "♟" };
  const rows = new Chess(position.fen).board().map((rank, row) => `<tr>${rank.map((piece, col) => `<td width="36" height="36" aria-hidden="true" align="center" style="width:36px;height:36px;font-family:'DejaVu Sans','Segoe UI Symbol',serif;font-size:26px;line-height:36px;color:#242923;background:${(row + col) % 2 ? "#89a697" : "#fffcf4"};">${piece ? glyphs[piece.color + piece.type] : "&#160;"}</td>`).join("")}</tr>`).join("");
  return `<table role="img" aria-label="${escapeHtml(position.description)}" cellpadding="0" cellspacing="0" border="0" width="288" style="max-width:100%;border:2px solid #315649;">${rows}</table>`;
}

export function renderNewsletterLetter(letter, template) {
  validateNewsletterLetter(letter);
  const renderParagraphs = (items) => items.map((item) => `<p>${escapeHtml(item)}</p>`).join("\n");
  const status = letter.status === "example" ? "Exemple de la lettre. Aperçu local, aucun envoi effectué." : "Brouillon de la lettre. Aperçu local à relire, aucun envoi effectué.";
  const fields = {
    SUBJECT: escapeHtml(letter.subject), PREHEADER: escapeHtml(letter.preheader), STATUS_NOTE: status,
    INTRODUCTION: escapeHtml(letter.introduction), IDEA_TITLE: escapeHtml(letter.idea.title), IDEA_PARAGRAPHS: renderParagraphs(letter.idea.paragraphs),
    POSITION_TITLE: escapeHtml(letter.position.title), POSITION_ORIGIN: escapeHtml(letter.position.origin), POSITION_DESCRIPTION: escapeHtml(letter.position.description),
    BOARD: renderBoard(letter.position), SOLUTION_TITLE: escapeHtml(letter.position.solutionLabel), POSITION_PARAGRAPHS: renderParagraphs(letter.position.explanation),
    FEN: escapeHtml(letter.position.fen), COMPARISON_FEN: letter.position.comparisonFen ? `<p style="font-size:12px;overflow-wrap:anywhere;">FEN du contre-exemple : ${escapeHtml(letter.position.comparisonFen)}</p>` : "",
    READING_TITLE: escapeHtml(letter.reading.title), READING_REASON: escapeHtml(letter.reading.reason), READING_URL: escapeHtml(letter.reading.url),
  };
  const html = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in fields)) throw new Error(`Variable inconnue du modèle : ${key}`);
    return fields[key];
  });
  const plain = [
    "LA LETTRE DU GAUCHER", status, letter.subject, letter.preheader, letter.introduction,
    "01 / UNE IDÉE EXPLIQUÉE", letter.idea.title, ...letter.idea.paragraphs,
    "02 / UNE POSITION COMMENTÉE", letter.position.title, letter.position.origin, letter.position.description,
    `FEN : ${letter.position.fen}`, letter.position.solutionLabel, ...letter.position.explanation,
    ...(letter.position.comparisonFen ? [`FEN du contre-exemple : ${letter.position.comparisonFen}`] : []),
    "03 / UNE LECTURE RECOMMANDÉE", letter.reading.title, letter.reading.reason, letter.reading.url,
    "Les alertes de publication sont distinctes de cette lettre.", "Se désinscrire : {{ unsubscribe }}",
  ].join("\n\n") + "\n";
  return { html, text: plain };
}
