---
title: "Zermelo’s Paradox: The Unknown Value of Perfect Chess"
excerpt: "Chess’s value from the initial position under perfect play remains unknown. Determinacy, Zermelo’s historical work and tablebases distinguish existence of an answer, calculation and practical performance."
seoTitle: "Zermelo and Chess: A Determined but Still Unknown Result"
seoDescription: "Perfect-play value, game-ending rules and tablebases: what the Zermelo framework guarantees without claiming to know the initial position’s value."
enSlug: "zermelo-paradox"
faq:
  - question: "Does Zermelo’s theorem prove White wins?"
    answer: "No. In the finite-game framework, one of three values exists: White wins, Black wins or a draw. It does not identify which applies to the initial chess position. An engine evaluation is not proof of that value."
  - question: "Why call this a paradox?"
    answer: "It is not a mathematical contradiction. The tension is epistemic: a value exists under specified rules, while the initial position’s value remains unknown. Existence and calculating the answer are separate questions."
  - question: "Do tablebases contradict Zermelo?"
    answer: "No. They calculate values for covered subsets under specified rules and metrics. Coverage limits, including castling rights, matter. They provide constructive results for accessible finite sets of positions."
  - question: "How can AlphaZero beat Stockfish without perfect play?"
    answer: "Neither has demonstrated a perfect strategy from the initial position. In the 2017 match, Stockfish 8 combines alpha-beta search with hand-written evaluation; AlphaZero combines a learned network and MCTS. A better match score is not a measured distance to an unknown optimal strategy."
  - question: "Could the answer one day be discovered?"
    answer: "Exhaustive solution exceeds current resources. That does not prove every future method impossible. Grover concerns unstructured search; we cannot simply halve the exponent of a chess minimax tree."
heroImageAlt: A circular dark maze with a blue path leading toward its empty center.

---

At the fifth International Congress of Mathematicians in Cambridge in 1912, German mathematician [Ernst Zermelo](https://fr.wikipedia.org/wiki/Ernst_Zermelo) presented work that would influence mathematical and later computational thinking about strategy games. Its implications for chess separate a reassuring existence result from the difficult question of calculating the answer.

## Ernst Zermelo and set theory

Zermelo is best known for foundational contributions to set theory, notably the [axiom of choice](https://fr.wikipedia.org/wiki/Axiome_du_choix) and Zermelo–Fraenkel axioms, part of mathematics’ standard foundations.

Strategy games offer precise rules, no hidden information and no chance. They make a natural setting for asking whether a theoretically perfect way to play exists. The exact game rules and termination assumptions remain essential.

## Zermelo’s theorem: statement and explanation

Consider two-player games of perfect information, without chance, with alternating moves and a finite game tree.

**Modern statement in this finite setting:** either one player can force a win, or each has a strategy guaranteeing at least a draw. In the latter case, optimal opposition produces a draw. Distinguish this from the exact content of Zermelo’s historical text, discussed below.

![Three possible perfect-play values, without a known solution from the initial position](/images/en/zermelo-01-trois-issues.svg)

For a finite tree, **backward induction**, as in [minimax](/en/blog/minimax-in-chess/), explains the result. This teaching presentation is not Zermelo’s original proof: Schwalbe and Walker explicitly note that his 1913 text does not proceed this way. Shannon’s 1950 article appears 37 years later; that interval does not establish direct reuse of the proof unchanged.

Imagine reaching terminal positions, each a White win, Black win or draw. Move one step back. If White is to move, White chooses the most favourable accessible result; Black similarly chooses from Black’s perspective. Continue recursively from terminal nodes to the root, and every node receives a value.

The initial position is therefore determined. White can force a win, or both sides can guarantee at least a draw, or Black can force a win. The statement does not identify which alternative holds in chess.

![A modern backward-induction example on a fictional tree](/images/en/zermelo-02-backward-induction.svg)

### A proof refined historically

Schwalbe and Walker distinguish the original 1913 text from modern formulations. Zermelo allows infinite move sequences and studies, among other things, lengths needed to force a win. König (1927) and Kalmár (1928/1929) extend the analysis. That history differs from the elementary finite-tree explanation here.

To treat modern chess as finite, include termination rules. Threefold repetition and fifty moves create rights to claim a draw; automatic fivefold repetition and seventy-five moves play a separate role, as the FIDE arbiters’ manual explains.

### Why it feels paradoxical

The paradox is practical, not logical. A value exists under the fixed rules, but the existence result does not identify it or provide a practical calculation of it.

Naive exhaustive search considers an enormous number of sequences. Shannon’s $10^{120}$ order of magnitude rests on assumptions; it is not an exact count of all legal games.

As a hypothetical calculation, examining $10^{120}$ items at $10^{20}$ per second takes $10^{100}$ seconds. That illustrates a cost under stated assumptions, not proof that no other method could establish the game’s value. See [the limits of chess calculation](/en/blog/chess-mathematical-problem-and-ai/) for the distinction.

## Chess’s unknown truth

The open question is the value of the starting position under perfect play. The theoretical setting is also discussed in [game theory applied to chess](/en/blog/game-theory-in-chess/).

A draw can be conjectured, but neither draws among strong players nor engine evaluations prove it. Those observations concern particular opponents and computing budgets, not every possible reply to a strategy.

A Stockfish evaluation depends on version, depth and time. A small numerical advantage means neither a forced win nor a measured distance to perfect solution. All three initial-position values remain open.

## Solved endgames: a window on exact results

Although the starting position remains unsolved, many low-material endgames have been calculated.

Endgame tablebases, developed through work by Ken Thompson, Marc Bourzutschky and others, cover large endgame sets, including seven-piece positions. Coverage and result meaning depend on the table set: castling rights and the fifty-move rule, for example, require particular care.

Ronald de Man’s documentation illustrates why metrics and rules matter with a DTZ50 value of 164 half-moves and a “cursed win”: winning without the fifty-move limit does not necessarily mean winning with it.

### DTM and DTZ: different distances

DTM measures distance to mate. DTZ measures distance to a capture or pawn move resetting the counter. Optimising them can select different moves. That creates no contradictory truths: the questions differ, and fifty-move-rule treatment must be specified. Usual Syzygy tables provide WDL and DTZ, not a universal DTM distance.

![Tablebases: specify the question and rules](/images/en/zermelo-04-dtm-dtz.svg)

## The human player’s structural limits

Chess has a mathematically defined notion of perfect play while its value from the initial position remains unknown.

A player uses calculation, pattern recognition and positional evaluation. We can observe decisions and compare results with opponents; that does not give a general measurement of distance from an unknown optimal strategy.

Human and engine match performances can be compared. They still do not provide a measured distance to perfect strategy across the game. Positions covered by tablebases, by contrast, allow decisions to be checked under their rules.

## Perfect play and the ideal game

Even if a perfect strategy were written down, what would that change about playing?

Imagine, hypothetically, White had a forced win within eighty moves from the initial position. Following that strategy would fix the result regardless of Black’s choices. That would change the theoretical stakes. Human practice could nevertheless continue: knowing a strategy exists differs from applying it in every position.

The unknown solution leaves room for discovery, sporting competition and aesthetic judgement. The idea that solving chess would “kill” it is a philosophical interpretation, not a theorem about how people would respond.

Its present uncertainty contributes to the experience of exploring a game whose possibilities exceed our calculation. That does not require declaring future solution impossible.

## Zermelo and solved games

Computing research has solved several games, with the meaning of “solved” tied to the starting position, strategy coverage and rules.

[Tic-tac-toe](https://fr.wikipedia.org/wiki/Morpion) is a draw under perfect play. [Connect Four](https://fr.wikipedia.org/wiki/Puissance_4) was solved in 1988 as a first-player win. English draughts on 8×8, *checkers*, was solved in 2007 by [Jonathan Schaeffer](https://fr.wikipedia.org/wiki/Jonathan_Schaeffer) and colleagues as a draw under perfect play, after eighteen years of work in a game with roughly $5\times10^{20}$ possible positions; not every position was individually traversed.

![The status of selected games, without incompatible size comparisons](/images/en/zermelo-03-jeux-resolus.svg)

[Chess](https://fr.wikipedia.org/wiki/%C3%89checs) and [Go](https://fr.wikipedia.org/wiki/Go_(jeu)) remain open from their initial positions. Combinatorial growth hinders current exhaustive methods; it does not prove every future proof impossible. Exact rules must also be specified for each game.

## What Zermelo changes for you at the board

Knowing the starting value is unknown does not directly choose your next move. It does change how a claim about a position should be interpreted.

In complex positions, your variations and evaluation are generally partial. Local certainties still exist: a correctly established forced mate or a tablebase-covered position may be solved under precise rules. Distinguish these from uncertainty remaining at the game’s starting point.

Against a stronger opponent, better performance does not guarantee exact solution of every position. Nor does it imply they do not know a particular endgame or forced mate. Compare concrete variations, available time and a move’s justification rather than an assumed closeness to perfection.

Zermelo’s contribution is not a winning strategy from the initial chess position. His text grounds mathematical analysis of game values; modern formulations separate existence under fixed rules from methods of calculation.

**After reading:** keep one reminder of **mathematical humility** in a long game: a partial evaluation is not automatically a tablebase result. It can help you decide what still needs checking without demanding impossible certainty everywhere.

---

## Frequently asked questions

### Does Zermelo’s theorem prove White wins?

No. In the finite setting, **one** value exists among White win, Black win and draw. The theorem does not identify which applies. The starting position remains unsolved; an engine evaluation is not proof.

### Why call this a paradox?

There is no mathematical contradiction. The tension is **epistemic**: a value exists under fixed rules while the starting value remains unknown. This does not prove that no future method can calculate it. Existence and access are separate questions.

### Do tablebases contradict Zermelo?

No. They provide calculated results for covered subsets according to their rules and metrics. Coverage limits, such as castling rights, matter. They are constructive examples of exact values for accessible finite sets.

### How can AlphaZero beat Stockfish without perfect play?

Neither has demonstrated a perfect strategy from the starting position. In 2017, Stockfish 8 combined alpha-beta search and hand-written evaluation, while AlphaZero combined a learned network and MCTS. A better match score is not a measured distance to an unknown optimal strategy.

### Could this mathematical value one day be discovered?

Exhaustive solution exceeds current resources, not necessarily every future method. Replacing $10^{120}$ with $10^{60}$ by invoking Grover is unjustified: an adversarial game tree is not a simple unstructured list of solutions.

## Sources

- Zermelo, E. (1913). *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels*. Proceedings of the fifth International Congress of Mathematicians, vol. II, 501–504. [Translation in the appendix to Schwalbe and Walker](https://studylib.net/doc/28166551/zermelo-work).
- Schwalbe, U., & Walker, P. (1999, revised version of the 1997 working paper). *Zermelo and the Early History of Game Theory*. University of Mannheim / University of Canterbury. [Full text consulted](https://studylib.net/doc/28166551/zermelo-work): original proof versus modern presentation.
- Shannon, C. E. (1950). *Programming a Computer for Playing Chess*. Philosophical Magazine, 41, 256–275. [Original article](https://www.computerhistory.org/chess/doc-431614f453dde/).
- De Man, R. (undated). *Probetool*. GitHub. [Syzygy documentation](https://github.com/syzygy1/probetool): WDL, DTZ50 and a cursed-win example.
- FIDE (2022). *Arbiters’ Manual*. [Manual and draw rules](https://arbiters.fide.com/wp-content/uploads/Publications/Manual/ARBManual2022_1st_October.pdf).
- Allis, V. (1988). *A Knowledge-based Approach of Connect-Four*. Vrije Universiteit Amsterdam. [Thesis](https://tromp.github.io/c4/connect4_thesis.pdf).
- Schaeffer, J., et al. (2007). *Checkers Is Solved*. Science, 317, 1518–1522. [Full article](https://www.cs.cornell.edu/courses/cs6700/2013sp/readings/06-b-Checkers-Solved-Science-2007.pdf).
