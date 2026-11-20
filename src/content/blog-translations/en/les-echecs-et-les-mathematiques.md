---
heroImageAlt: A chess knight faces geometric solids across an unfinished bridge.
title: "Does Chess Make You Better at Maths? What the Evidence Shows"
excerpt: "A chessboard offers mathematical problems, but playing does not automatically improve school results. Explore the knight’s tour, eight queens and the evidence on transfer."
seoTitle: "Chess and Mathematics: Transfer, Problems and Evidence"
seoDescription: "Chess and mathematics: Sala and Gobet’s studies, the knight’s tour and eight queens. Distinguish mathematical teaching activities from automatic broader benefits."
enSlug: "chess-and-mathematics"
faq:
  - question: "Will chess improve a child’s maths grades?"
    answer: "That is not guaranteed. Sala and Gobet’s experiments with active controls do not confirm transfer to mathematical problem-solving."
  - question: "Is metacognition a demonstrated transfer effect?"
    answer: "Observing your reasoning is a useful teaching idea. That does not establish automatic transfer of the habit from chess to mathematics."
  - question: "Is a minimum time per move needed to reason?"
    answer: "No brain threshold of fifteen to thirty seconds is established here. A slower time control allows more time to explain choices without guaranteeing school benefits."
  - question: "How many eight-queens solutions exist?"
    answer: "There are 92 placements on an 8×8 board. Grouping by symmetry yields twelve classes, not all of equal size."
---

A grandmaster is not necessarily able to calculate an integral faster than you. Yet “chess makes you good at maths” keeps returning in schools and clubs. The board does offer mathematical problems; that does not prove playing automatically improves school results.

## Why connect the two disciplines?

In chess, rules determine possible actions and their consequences. You do not roll dice to see whether a bishop reaches its square. Calculating a variation means examining possibilities and checking what withstands the opponent’s replies.

You can compare this with solving a problem: understand the information, form a hypothesis, seek a counterexample and check the conclusion. That is an analogy of method, not a measurement of transfer between activities.

### Two problems on a board

The knight’s tour visits every square exactly once through legal knight moves. Represent squares as vertices and jumps as edges, and you seek a Hamiltonian path in that graph. This introduces a mathematical idea through a familiar object without claiming the problem single-handedly founded an entire mathematical field.

![Knight’s tour: visiting all 64 squares exactly once, calculated with Warnsdorff’s heuristic.](/images/en/echecs-maths-01-tour-cavalier.svg)

The eight-queens problem places eight queens so none attacks another. OEIS sequence A000170 records 92 solutions for eight queens. Symmetries group them into twelve classes; multiplying every class by eight fails because some solutions have symmetries themselves.

![The eight-queens problem: place eight queens so none attacks another. One of the 92 solutions.](/images/en/echecs-maths-02-huit-dames.svg)

This offers a teaching setting for backtracking: place a queen, check constraints, then revisit a choice if it blocks further progress. It does not imply that no solution can be constructed for boards of other sizes.

## Counting sequences is not counting positions

Stockfish’s *perft* checks give 119,060,324 legal sequences of six half-moves from the starting position, three moves per side. Several sequences can reach the same position: the number does not count distinct positions.

Shannon (1950) proposes the order of magnitude $10^{120}$ to illustrate a game tree’s size. This is an estimate, not the exact number of legal positions. For exploring that tree, see [minimax](/en/blog/minimax-in-chess/) and [the article on chess complexity](/en/blog/chess-mathematical-problem-and-ai/).

A move tree becomes a probability tree only if you add a probabilistic model. A game’s deterministic rules do not spontaneously assign a probability to each opponent reply.

## The delicate question: transfer to maths

You can improve at recognising chess patterns without improving every other ability. That is the far-transfer question: does training benefit tasks beyond those closely related to what you practised?

Sala and Gobet’s review (2017) stresses the evidence’s limits and the importance of active control groups. If one group receives chess lessons and another gets nothing comparable, additional attention, novelty or expectations may contribute to differences.

In two experiments on mathematical problem-solving, Sala and Gobet (2017) do not find a benefit confirming the expected transfer with this type of control. It would be contradictory then to present metacognition as the “only scientifically proven transfer” without sufficient specific evidence.

The earlier account of a Trier study provided no verifiable reference supporting its conclusion. It is therefore not used here to argue for replacing an hour of mathematics with chess.

## Using chess to support reasoning

You can still make a precise exercise from a position. Write your hypothesis before checking the solution: “This rook can enter because the back rank is weak.” Then seek the opponent’s best defence. If it refutes the idea, explain where the reasoning failed.

The same process can be explicitly taught in mathematics: write a conjecture, test a potentially contradictory case, and distinguish a favourable example from proof. The connection becomes a designed teaching activity rather than a presumed effect of simply playing.

### Choosing a pace that leaves a record

A slow training game gives more time to record candidates and explain choices. A fast game can help review patterns and notice difficulties under pressure. No universal seconds-per-move threshold establishes when the cortex finally begins reasoning. Analysis notes belong in training or post-game review, not official play.

If the goal is school learning, retain school exercises and measure the intended skills. If it is chess, examine calculation and understanding errors. Either way, observable progress is better than a general promise of intelligence.

## A counting problem you can build at a chess club

Ask a friend how many squares there are on a chessboard. Sixty-four is an excellent answer if you mean the small squares on which the pieces stand. Suppose you also allow larger squares made out of whole cells. Now you have to agree on the rules. Count only squares whose sides follow the grid, count each outline once and allow its interior to contain any pattern of light and dark cells. Two people who gave different answers to the original question might both have counted correctly.

Start with a drawing only three cells wide and three cells high. You can identify any square by its bottom left corner and the length of one side. There are nine possible corners for a square of side one. A square of side two can start in either of the first two columns and either of the first two rows. That gives four placements. The largest square has only one placement. There are fourteen in total. The useful discovery is the rule about the corner: once its location and the size are known, you do not have another choice to make.

Return to the full board. A square three cells wide can begin in any of the first six columns and first six rows. There are thirty-six placements. Work through the lengths from one to eight and add sixty-four, forty-nine, thirty-six, twenty-five, sixteen, nine, four and one. The result is two hundred and four. You can check the ordering with a picture: the largest square has exactly one position and the next size down fits in four. A calculation that gives four placements for the largest square has probably counted grid lines in place of cells.

Change one condition. Require the square to contain a1. There is exactly one qualifying square for each permitted length because its bottom left cell must be a1. Replace a1 with d4 and the situation changes. For a square of side two, d4 can occupy any of its four corners. For the largest possible square it must still lie inside the entire board. We have not changed the rectangular geometry of the board, but the distance of the specified cell from the edge now matters. Ask the class to predict which answers would survive if the special cell were h8. Reflection of the diagram is enough to settle that question without another sum.

## Two rooks, two solutions and a useful division

Set aside the kings for this puzzle: it is an exercise about the movement lines of pieces on an otherwise empty board. How many ways can you place two white rooks so that they share neither a rank nor a file? Tie an imaginary red ribbon around one of them. Place the marked rook first. It has sixty-four choices. Its rank and file are now unavailable, leaving the other rook seven choices of rank and seven choices of file. Multiply and you get three thousand one hundred and thirty-six placements for distinguishable rooks.

Remove the ribbon. Each final diagram has appeared exactly twice in the preceding count. Either of its occupied squares could have held the marked rook, and there are no further choices once that is decided. Dividing by two gives one thousand five hundred and sixty-eight diagrams. The word “exactly” does important work here. In some symmetry problems, including rotations of arrangements of several pieces, an arrangement can remain unchanged under a transformation. Dividing by the number of named transformations then needs an additional argument. In this rook puzzle the two pieces occupy different squares, which makes the argument about the ribbon work for every diagram.

Try a second solution that never puts a label on either rook. Choose two distinct ranks. There are twenty-eight possible pairs. Choose two distinct files in the same way. The intersections form four corners of a rectangle. Only the two diagonally opposite pairs put one rook on each rank and one on each file, giving twenty-eight times twenty-eight times two possibilities. The agreement between this count and the first one checks more than the arithmetic. It identifies the same objects from two descriptions, one beginning with a piece and one beginning with a set of lines.

For a harder version, forbid three particular cells before you place either piece. The first counting method can no longer assume that every initial square gives forty-nine choices. Some forbidden cells already lie on lines that the first rook would rule out. Draw a smaller board and compare two first placements, one in a row with a forbidden cell and another in a completely clear row. Work out why their counts differ before trying the full board. You have created a mathematical exercise whose difficulty comes from a changed assumption; no assertion about a player's intelligence is required.

A teacher can tell whether this activity worked by giving a fresh problem, such as two objects that may share a column but not a row. Ask learners to explain which step in either proof must change and which can be reused. An answer copied from the previous board will generally give the wrong total. An explanation that correctly identifies the new freedom tells you something specific about what the student learned to count.

## Sources

- OEIS Foundation (undated), *A000170: Number of ways of placing n nonattacking queens on an n×n board*, [sequence and references](https://oeis.org/A000170).
- Stockfish team (undated), *tests/perft.sh*, official legal-sequence checks, [repository](https://github.com/official-stockfish/Stockfish/blob/master/tests/perft.sh).
- Shannon, C. E. (1950), *Programming a Computer for Playing Chess*, Philosophical Magazine, 41, 256–275, [original](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf).
- Sala, G. and Gobet, F. (2017), *Does chess instruction improve mathematical problem-solving ability? Two experimental studies with an active control group*, Learning & Behavior, [article](https://link.springer.com/article/10.3758/s13420-017-0280-3).
- Sala, G. and Gobet, F. (2017), *Does Far Transfer Exist? Negative Evidence From Chess, Music, and Working Memory Training*, Current Directions in Psychological Science, [review](https://journals.sagepub.com/doi/full/10.1177/0963721417712760).
