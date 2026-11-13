import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { Chess } from 'chess.js';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const cases = [
  { name: 'Mémoire A : mat du couloir', fen: '6k1/r4ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1', moves: ['Re8#'], mate: true },
  { name: 'Mémoire B : défense par capture', fen: 'r5k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1', moves: ['Re8+', 'Rxe8'], mate: false },
  { name: 'Mémoire C : case de fuite', fen: '6k1/r4pp1/7p/8/8/8/5PPP/4R1K1 w - - 0 1', moves: ['Re8+', 'Kh7'], mate: false },
  { name: 'Concentration : suite pédagogique complète', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nd4', 'Nxe5', 'Qg5', 'Nxf7', 'Qxg2', 'Rf1', 'Qxe4+', 'Be2', 'Nf3#'], mate: true },
  { name: 'Analyse : mat du débutant', moves: ['f3', 'e5', 'g4', 'Qh4#'], mate: true },
  { name: 'Analyse : prise de la Dame', moves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6', 'Nxe5', 'Bxd1', 'Bxf7+', 'Ke7', 'Nd5#'], mate: true },
  { name: 'Analyse : prise du Cavalier', moves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6', 'Nxe5', 'dxe5', 'Qxg4'], mate: false },
  { name: 'AlphaZero : extrait publié, tableau S6, partie 1', moves: ['Nf3', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'Qc2', 'O-O', 'a3', 'Bxc3', 'Qxc3', 'a5', 'b4', 'd6', 'e3', 'Ne4', 'Qc2', 'Ng5', 'b5', 'Nxf3+', 'gxf3', 'Qf6', 'd4', 'Qxf3', 'Rg1', 'Nd7', 'Be2', 'Qf6', 'Bb2', 'Qh4', 'Rg4'], mate: false },
];
const results = [];
for (const example of cases) {
  const game = example.fen ? new Chess(example.fen) : new Chess();
  for (const move of example.moves) assert.equal(game.move(move).san, move, example.name);
  assert.equal(game.isCheckmate(), example.mate, example.name);
  results.push({ name: example.name, plies: example.moves.length, checkmate: game.isCheckmate(), finalFen: game.fen() });
}

const attention = new Chess();
for (const move of cases[3].moves.slice(0, -1)) attention.move(move);
assert.equal(attention.fen(), 'r1b1kbnr/pppp1Npp/8/8/3nq3/8/PPPPBP1P/RNBQKR2 b Qkq - 1 7');
attention.move('Nf3#');
assert.equal(attention.get('g2'), undefined);
assert.equal(attention.get('e2').type, 'b');
assert.equal(attention.moves().includes('Bxf3'), false);

const analysis = new Chess();
for (const move of cases[5].moves.slice(0, 8)) analysis.move(move);
const articleAnalysis = readFileSync(resolve(root, 'src/content/blog/esprit/analyser-ses-parties.md'), 'utf8');
assert.ok(articleAnalysis.includes(analysis.fen()));

const alpha = new Chess();
for (const move of cases[7].moves.slice(0, 25)) alpha.move(move);
assert.equal(alpha.get('g1').type, 'r');
for (const square of ['g2', 'g3', 'g4', 'g5', 'g6']) assert.equal(alpha.get(square), undefined);
assert.deepEqual({ type: alpha.get('g7').type, color: alpha.get('g7').color }, { type: 'p', color: 'b' });

let widgets = 0;
for (const path of ['science/echecs-et-memoire.md', 'esprit/echecs-et-concentration.md']) {
  const article = readFileSync(resolve(root, 'src/content/blog', path), 'utf8');
  for (const match of article.matchAll(/<study-position\b([^>]+)>/g)) {
    const attrs = Object.fromEntries([...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(x => [x[1], x[2]]));
    const game = new Chess(attrs.fen);
    for (const move of attrs.solution.split('|')) assert.equal(game.move(move).san, move);
    assert.equal(game.isCheckmate(), true);
    widgets++;
  }
}
assert.equal(widgets, 2);
console.log(JSON.stringify({ date: '2026-11-13', legalExamples: results, interactivePositions: widgets, assertions: 'passed' }, null, 2));
