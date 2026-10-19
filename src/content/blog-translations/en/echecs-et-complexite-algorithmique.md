---
heroImageAlt: A tiny hand holding a thimble at the foot of an immense sand dune.
title: "The Algorithmic Complexity of Chess: From Shannon to AlphaZero"
excerpt: "The tree of variations becomes enormous long before an engine can explore it all. Distinguish size estimates, selective search and demonstrated limits from Shannon to Deep Blue and AlphaZero."
seoTitle: "Chess Complexity: Shannon, Alpha-Beta and AlphaZero"
seoDescription: "Shannon’s orders of magnitude, alpha-beta search, Deep Blue and AlphaZero: distinguish generalised complexity, 8×8 chess and engine performance."
enSlug: "chess-algorithmic-complexity"
faq:
  - question: "What is the Shannon number?"
    answer: "It is a historical order of magnitude for the game tree, around 10^120, derived using simplifying assumptions. It is neither an exact count of legal games nor Tromp’s estimate of about 4.8×10^44 legal positions. Several move sequences can reach the same position; their abundance does not prove solving chess impossible."
  - question: "How did Deep Blue beat Kasparov without calculating everything?"
    answer: "By combining search and evaluation. Alpha-beta pruning skips branches that cannot improve an available choice, preserving the result of the same minimax search. Its savings depend on move order. Deep Blue combined this with a detailed evaluation developed with grandmasters, specialised hardware capable of about 200 million positions per second and selective extensions. Match strength is not a complete solution of chess."
  - question: "How quickly did AlphaZero surpass Stockfish?"
    answer: "In Silver and colleagues’ 2017 protocol, the evaluation curve passes Stockfish after four hours. Training uses many TPUs and self-play. That duration does not transfer to a personal computer or measure human-like understanding."
  - question: "Is chess mathematically solved?"
    answer: "The initial position’s value under perfect play remains unknown. Solving from that position differs from a strong solution covering every position in the game. Beating a champion is not proof of an optimal strategy."
  - question: "How can humans play despite this complexity?"
    answer: "You do not need to solve the game to choose a move. You can compare a few variations, recognise familiar structures and evaluate consequences. That makes play possible without guaranteeing an optimal decision."
---

In 1950, Claude Shannon, the founder of information theory, published “Programming a Computer for Playing Chess”. He examines how a machine might choose a move despite the size of the variation tree.

Shannon distinguishes board configurations from move sequences. His historical order of magnitude of 10^120 for the game tree rests on assumptions about branching and duration; it is not an exact count of all legal games. It illustrates why naively exploring every continuation is not a practical method.

Counting positions is a separate problem: in 2021, John Tromp presents an estimate of about 4.8×10^44 legal positions. Several sequences may reach the same position. Comparing these numbers therefore requires stating what is being counted.

Something else was needed.

## What is algorithmic complexity?

Algorithmic complexity is a branch of theoretical computer science studying the resources, such as time and memory, needed to solve problems. It classifies problems by their fundamental difficulty, not on a particular computer in practice but asymptotically as the problem size grows.

Familiar classes include:

- **P:** problems decidable in polynomial time in the input size; this does not guarantee fast execution for every instance.
- **NP:** problems whose solutions can be *verified* in polynomial time; verification and finding a solution are different questions.
- **PSPACE:** problems solvable using polynomial memory, even if time is exponential.
- **EXPTIME:** problems decidable in time at most exponential in a polynomial of the input size.
- **EXPSPACE:** problems decidable using at most exponential memory in a polynomial of the input size; this class contains EXPTIME.

A generalised form of chess, on an n×n board rather than 8×8, is **EXPTIME-complete** according to Fraenkel and Lichtenstein (1981). In formal terms, the problem is as hard as the hardest problems in its class. No polynomial-time algorithm solves that entire generalised family.

This asymptotic result does not provide a minimum number of computing years for the single 8×8 board. The authors themselves stress that limit. Modern chess is finite when automatic termination rules are included; that makes a solution theoretically defined without making it practical today.

## The game tree and combinatorial explosion

Imagine the game tree. At its root is the initial position. After White’s first move, with 20 possibilities, there are 20 nodes. After Black’s first move, also with 20 possibilities, there are 400. After two moves by each side, 197,281 legal sequences of four half-moves reach the leaves. Move sequences differ from distinct positions: several sequences can reach the same position. Stockfish’s move-generation test checks, for example, 3,195,901,860 sequences at seven half-moves.

For illustration, take uniform branching of 35 and a depth of 80 half-moves, or 40 moves per player. The model gives 35^80 ≈ 10^123.5 sequences at that depth. This is an illustrative calculation, not a count of the complete tree.

The model illustrates the explosion in the **number of move sequences**: increasing depth adds an exponential factor. It gives neither the number of distinct positions nor proof that no method could determine the game’s value without traversing every sequence.

This combinatorial growth explains the difficulty faced by early chess programs in the 1950s–1970s despite increasingly powerful computers. Naive brute force was not a practical route. Programs needed selective methods and evaluations that made decisions possible without guaranteeing optimal play.

## Alpha-beta pruning: the first major leap

**Alpha-beta pruning** avoids unnecessary calculation in minimax. With the same depth, evaluation function and tree, it preserves minimax’s result: the cutoff itself is not an approximation.

All scores use one perspective: MAX maximises them and MIN minimises them. Alpha is an available lower bound for MAX; beta is an available upper bound for MIN. When beta ≤ alpha, a branch can no longer change a choice already available to an ancestor and may be cut. MAX therefore does not automatically mean White in every implementation.

On a uniform tree with branching factor b and depth d, ideal move ordering gives a cost on the order of O(b^(d/2)), compared with O(b^d) for minimax. With the worst ordering, the gain may disappear. This asymptotic result does not directly turn Shannon’s number into a precise tree size to calculate.

Combined with an **evaluation function**, a formula estimating a position’s value without reaching terminal game outcomes, alpha-beta allows searching to a fixed depth and evaluating the resulting positions. Deep Blue used this approach in 1997.

## Deep Blue: an engineering achievement

Deep Blue combined substantial computing power with chess-specific search and evaluation. Its strength was an engineering achievement rather than a mathematical solution of the game.

IBM built **specialised chips**, ASICs, designed to evaluate chess positions, with hundreds operating in parallel. IBM reports evaluation capacity of 200 million positions per second. Optimised alpha-beta pruning and sophisticated move-ordering heuristics allowed selective deepening of promising lines.

The evaluation function was developed with help from grandmasters. It explicitly encoded ideas such as pawn structure, king safety, piece activity and weak squares. Each concept became numerical terms with weights adjusted by engineers.

Kasparov beat Deep Blue in 1996, 4–2, then lost in 1997, 3.5–2.5. This demonstrates performance in a match, not a mathematical solution of chess. Specialised hardware, search and evaluation explain the technical approach without deciding whether a machine “understands” as a human does.

## AlphaZero: a different kind of change

Twenty years later, DeepMind presented AlphaZero. Its difference concerned the method, not only the amount of computation.

AlphaZero learns its move policy and evaluation through self-play, without a human-game database or a hand-written chess evaluation. That does not mean an absence of engineering choices: the authors define position representation, architecture and search procedure.

It played against itself across millions of games. A deep neural network learned which positions tended to lead to wins and which moves tended to work from particular positions. Silver and colleagues’ preprint (2017) reports surpassing Stockfish after **four hours** on its evaluation curve. Training uses many TPUs; this duration and result depend on the hardware and protocol.

AlphaZero’s dynamic, often sacrificial play attracted grandmasters’ attention, with positional choices not explicitly written into a conventional evaluation function. In the 2017 preprint comparison, AlphaZero searches about 80,000 positions per second against Stockfish’s 70 million. These measurements concern different systems and hardware; a searched node does not have the same cost or role in both methods.

The network guides MCTS search: AlphaZero still explores a tree, with different selection of variations and a learned evaluation. “Intuition” is an analogy here, not proof that a human cognitive mechanism has been reproduced.

## How this history changes the way you look at an engine

Deep Blue and AlphaZero show two ways of selecting variations and evaluating positions. Their success does not mean they solved chess. Nor does it prove that a neural network reproduces a grandmaster’s brain.

For you, the distinction is useful: engine analysis proposes moves within a computing budget. It does not provide proof of the initial position’s exact value. Combinatorial explosion explains why selection is necessary in these approaches; it does not establish that every future solution method is impossible.

## Sources

- Shannon, C. E. (1950). *Programming a Computer for Playing Chess*. Philosophical Magazine, 41, 256–275. [Original article, Computer History Museum](https://www.computerhistory.org/chess/doc-431614f453dde/): tree estimates and selective search.
- Tromp, J. (2021). *Number of legal chess positions*. [Author’s page](https://tromp.github.io/chess/chess.html): an estimate of about 4.8×10^44 legal positions.
- Fraenkel, A. S., & Lichtenstein, D. (1981). *Computing a perfect strategy for n×n chess requires time exponential in n*. Journal of Combinatorial Theory, Series A. [Authors’ full text](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf): the EXPTIME-complete generalised variant.
- IBM (undated). *Deep Blue*. [Project history](https://www.ibm.com/history/deep-blue): hardware, evaluation speed and matches against Kasparov.
- Silver, D., et al. (2017). *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*. arXiv. [Full preprint](https://arxiv.org/html/1712.01815v1): self-play, Stockfish comparison and experimental conditions.
- Stockfish team (undated). *tests/perft.sh*. GitHub. [Move-generator tests](https://github.com/official-stockfish/Stockfish/blob/master/tests/perft.sh).

## Further reading

- [Grand Oral NSI: Why does AlphaZero mark a break in artificial intelligence? (French)](/fr/blog/sujet-grand-oral-nsi-alphazero/)
- [Why chess is an almost impossible mathematical problem, and how AI copes anyway](/en/blog/chess-mathematical-problem-and-ai/)
- [Grand Oral Mathematics: How does chess model combinatorial thinking? (French)](/fr/blog/sujet-grand-oral-maths-combinatoire/)
