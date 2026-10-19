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

## Sources

- OEIS Foundation (undated), *A000170: Number of ways of placing n nonattacking queens on an n×n board*, [sequence and references](https://oeis.org/A000170).
- Stockfish team (undated), *tests/perft.sh*, official legal-sequence checks, [repository](https://github.com/official-stockfish/Stockfish/blob/master/tests/perft.sh).
- Shannon, C. E. (1950), *Programming a Computer for Playing Chess*, Philosophical Magazine, 41, 256–275, [original](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf).
- Sala, G. and Gobet, F. (2017), *Does chess instruction improve mathematical problem-solving ability? Two experimental studies with an active control group*, Learning & Behavior, [article](https://link.springer.com/article/10.3758/s13420-017-0280-3).
- Sala, G. and Gobet, F. (2017), *Does Far Transfer Exist? Negative Evidence From Chess, Music, and Working Memory Training*, Current Directions in Psychological Science, [review](https://journals.sagepub.com/doi/full/10.1177/0963721417712760).
