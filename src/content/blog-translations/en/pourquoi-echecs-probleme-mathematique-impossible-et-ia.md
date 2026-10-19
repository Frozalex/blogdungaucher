---
heroImageAlt: "Pixel art thumbnail: a retro computer with a glowing decision
  tree on screen and a title about chess complexity and AI."
title: "Why Chess Is So Hard to Solve, and How AI Plays Anyway"
excerpt: "The move tree grows rapidly, yet an engine can suggest a strong reply in seconds. Explore what mathematics, search and learned evaluation actually do, without confusing practical difficulty with impossibility."
seoTitle: "Solving Chess: Complexity, Shannon and the Limits of AI"
seoDescription: "Shannon’s estimate, exhaustive search, evaluation and AI: why chess remains unsolved without confusing practical difficulty with demonstrated impossibility."
enSlug: "chess-mathematical-problem-and-ai"
faq:
  - question: "Will chess ever be solved?"
    answer: "We do not know. Exhaustive exploration is beyond current methods, but another form of proof is not ruled out. EXPTIME concerns a generalisation of chess, not a demonstrated impossibility for the 8×8 board."
  - question: "How does solving differ from beating a human?"
    answer: "Solving requires proof of the perfect-play result. Winning games against humans measures performance under specific conditions without establishing that proof. Engine and human rating lists are not directly interchangeable."
  - question: "Is Shannon’s number exact?"
    answer: "No. The order of magnitude 10^120 describes an estimated game tree, not an exact count of distinct legal positions."
---

You may know the apparent paradox: apps and media present [chess](https://fr.wikipedia.org/wiki/%C3%89checs) as enormously complex, then you open an app, play a reasonable move and receive an engine correction with a line you could not find alone.

Can this really be reduced to formulas? Do mathematics and computing offer partial answers, or is complexity merely a story we tell? There are two distinct points: exhaustive exploration of the full game space is beyond current practical resources, while selective search, evaluation, pruning and learning can produce performance exceeding human match results.

![Diagram of an 8 by 8 chessboard](/images/en/echecs-ia-01-plateau.svg)

No complete solution from the initial position is known. Nevertheless, programs can beat leading humans without possessing a proof of perfect play: choosing strong moves against an actual opponent is a different task.

## The board from within: a state graph

For mathematics and computing, [chess](https://fr.wikipedia.org/wiki/Jeu_d%27%C3%A9checs) has precise, public and deterministic rules. A [knight](https://fr.wikipedia.org/wiki/Cavalier_(jeu_d%27%C3%A9checs)) follows its defined jump; a bishop remains on its colour. Human choices may be uncertain to you, but the rules themselves contain no random draw deciding whether a move works.

- A sufficiently specified position, including pieces, side to move, castling, en passant and relevant history, is a state.
- A legal move transitions to another state.
- A game is a trajectory through states.

Represent this as a [directed graph](https://fr.wikipedia.org/wiki/Graphe_orient%C3%A9): nodes are states and edges legal moves. From a fixed state, an exploration tree keeps different move sequences separate. [Game theory in chess](/en/blog/game-theory-in-chess/) explores the framework, while [opening equilibria](/en/blog/nash-equilibrium-openings/) distinguishes formal results from preparation.

![Directed graph of possible chess moves](/images/en/echecs-ia-02-graphe.svg)

## The move tree: what “I calculated everything” leaves out

At a club, you may hear “I calculated everything”. Sometimes a local forced sequence can be checked completely. Across a complex position’s full game tree, however, players normally examine a selected subset of continuations.

Let \(b\) be a branching factor, \(d\) depth in half-moves, or *plies*, and \(N(b,d)\) an approximate leaf count in a uniform model. The simple model gives exponential growth:

$$N(b,d)\approx b^d.$$

Adding depth multiplies work rather than adding a small fixed amount. That is why finite time and memory matter even on fast machines. Real branching varies, and a search can merge transpositions, prune or use other methods; the formula is not an exact count of every engine’s work.

A middlegame illustration often uses 30–40 legal moves. With \(b=35\), depths six, ten and sixteen already differ enormously. Human players and programs select possibilities, though that shared description does not establish identical cognitive and computational mechanisms.

The methods below cut, estimate and order moves to make useful search practical.

![Tree growth: specify the model](/images/en/echecs-ia-03-arbre.svg)

## Shannon’s number: an order of magnitude

[Claude Shannon](https://fr.wikipedia.org/wiki/Claude_Shannon), a founder of information theory, considered computer chess in his 1950 article. His famous \(10^{120}\) estimate, the [Shannon number](https://fr.wikipedia.org/wiki/Nombre_de_Shannon), conveys the scale of a game tree under simplifying assumptions.

It is not an exact list or count of distinct reachable positions. The large estimate helps explain the impracticality of naive exhaustive traversal; it does not prove that no other method could determine the game’s value.

![Order of magnitude of chess game sequences (Shannon)](/images/en/echecs-ia-04-shannon.svg)

## Why chess is not solved, and why an engine can still win

“[Solved](https://fr.wikipedia.org/wiki/Jeu_r%C3%A9solu)” can mean different levels of result. A weak solution determines the initial position’s outcome under perfect play and supplies the necessary strategy; a strong solution covers all relevant positions. [Game theory](https://fr.wikipedia.org/wiki/Th%C3%A9orie_des_jeux), including work associated with [John von Neumann](https://fr.wikipedia.org/wiki/John_von_Neumann), provides tools for reasoning about rational choices and [Nash equilibrium](https://fr.wikipedia.org/wiki/%C3%89quilibre_de_Nash). Chess’s perfect-information structure is central here.

| Game | Solved? | Comment |
| --- | --- | --- |
| [Tic-tac-toe](https://fr.wikipedia.org/wiki/Morpion) | Yes | A small game with a known optimal strategy |
| [English draughts, or checkers](https://fr.wikipedia.org/wiki/Dames_anglaises) | Yes | Its initial position is a draw under perfect play |
| **Chess** | No | No complete proof of the initial perfect-play outcome |
| [Go](https://fr.wikipedia.org/wiki/Go_%28jeu%29) | No from the standard initial position | [AlphaGo](https://fr.wikipedia.org/wiki/AlphaGo) demonstrated strong match performance, a separate achievement |

“Unsolved” does not mean an engine can never be certain about any local position. A forced mate or tablebase-covered endgame can supply exact information under its rules. To beat a human, the engine does not need to solve the starting position. The existence framework is discussed in [Zermelo’s paradox](/en/blog/zermelo-paradox/).

### EXPTIME-complete: be careful with generalisation

Fraenkel and Lichtenstein (1981) study deciding who can win from an arbitrary position in a generalisation of chess on an $n\times n$ board. That problem is EXPTIME-complete. The authors note that the result says little directly about 8×8 chess.

It is worst-case complexity for a family whose input size varies. It gives neither an imposed computing time for every position nor proof that solving the usual initial position is physically impossible. Fixed-size chess under termination rules remains finite; “undecidable” does not mean merely too expensive in practice.

## What a traditional engine does: minimax without naivety

The architecture of traditional engines such as [Stockfish](https://fr.wikipedia.org/wiki/Stockfish) can be introduced through three functions:

- Search: explore a tree of moves.
- Evaluation: estimate which side is better.
- Optimisations: avoid spending the budget on unhelpful branches.

Minimax chooses the best guaranteed outcome against the opponent’s best replies. In a simplified two-ply recurrence:

$$f(x)=\max_{m\in M}\min_{r\in R}f(x_{m,r}).$$

In club terms: do not choose a move that works only if the opponent fails to respond well. This is a worst-case model, not a guarantee against tilt or a measured description of your mind.

Unoptimised minimax grows quickly. Fortunately, branches can sometimes be skipped while preserving the result of a fixed evaluated tree. [Minimax in chess](/en/blog/minimax-in-chess/) develops negamax, null-move pruning and transposition tables while distinguishing exact reformulations from selective heuristics.

![Minimax  -  maximise your result against the best replies](/images/en/echecs-ia-05-minimax.svg)

## Alpha-beta: cutting without changing the fixed-tree value

[Alpha-beta pruning](https://fr.wikipedia.org/wiki/%C3%89lagage_alpha-b%C3%AAta) optimises minimax traversal. It skips work that cannot affect a choice already available to an ancestor.

Using one score perspective, alpha is an available lower bound for MAX and beta an available upper bound through MIN. When alpha is at least beta, the branch can be cut. At identical tree, depth and evaluations, exact alpha-beta preserves the minimax value. Tied moves may still be selected differently.

As an analogy, you may stop exploring a tactical line once you establish it cannot improve on another available plan. Good move ordering can substantially reduce explored nodes and allow deeper search within the budget. Extra selective pruning has different guarantees from exact alpha-beta.

![Alpha-beta pruning  -  skip branches without changing the value](/images/en/echecs-ia-06-alphabeta.svg)

## Evaluation: estimating without calculating everything

At a depth cutoff, a nonterminal position still needs a value estimate. Traditional hand-written evaluations use criteria such as:

- Material.
- Pawn structure.
- Piece activity.
- King safety.
- Controlled squares and other features.

This is not merely adding fixed piece points. Engines combine tuned features and search. Stockfish announced NNUE neural evaluation in 2020 while retaining alpha-beta search, showing that learning and this search family can be combined.

Estimating a promising position without calculating mate resembles a familiar practical task. That analogy does not prove a human mechanism in the engine. [Chaos theory in chess](/en/blog/chaos-theory-in-chess/) similarly distinguishes tactical instability as an analogy from mathematical chaos.

![Evaluating a position at limited depth](/images/en/echecs-ia-07-evaluation.svg)

## AI: learning to evaluate and select

Rather than write every evaluation feature by hand, a system can learn from data or self-play. [Neural networks](https://fr.wikipedia.org/wiki/R%C3%A9seau_de_neurones_artificiels) and [machine learning](https://fr.wikipedia.org/wiki/Apprentissage_automatique) can support two tasks:

- Evaluating a position through a learned representation.
- Proposing promising candidates to guide exploration.

That does not mean every learned system follows one architecture or always searches less. It means selection and evaluation can change how a computing budget is used.

Strong human players also select candidates before calculating, but this is an analogy at the level of the task, not proof that network training reproduces human intuition.

Self-play provides a training loop:

1. Generate experience through games.
2. Learn predictions about outcomes and promising moves.
3. Update selection and evaluation using those results.
4. Repeat.

Researchers still define representations, architectures, training objectives and procedures. Learned preferences can emerge without manually specifying each strategic concept; the process is not free of engineering.

![Networks and search: distinct functions](/images/en/echecs-ia-08-reseau.svg)

## IBM and Kasparov: a historic match without solving chess

In 1997, [Deep Blue](https://fr.wikipedia.org/wiki/Deep_Blue) beat [Garry Kasparov](https://fr.wikipedia.org/wiki/Garry_Kasparov), then [world chess champion](https://fr.wikipedia.org/wiki/Champion_du_monde_d%27%C3%A9checs), using an [IBM](https://fr.wikipedia.org/wiki/IBM) system designed specifically for chess. It demonstrated the power of specialised hardware, search and evaluation.

Winning that match did not solve chess. A machine can outperform the leading human in a match without a perfect strategy from the initial position. Subsequent engine advances do not abolish that mathematical distinction.

![Deep Blue against Kasparov  -  a 1990s milestone](/images/en/echecs-ia-09-deepblue.svg)

## Strategic models: what game theory contributes

[Game theory](https://fr.wikipedia.org/wiki/Th%C3%A9orie_des_jeux) connects chess to models in economics, decision support and automated calculation where choices respond to other agents.

For a club player, distinguish deterministic rules from uncertainty about another person’s choices. A game can have no random rule and still leave you unsure how the opponent will reply.

**Proofs and subproblems.** Work on endgames and other restricted settings yields exact results within stated coverage. No proof currently fixes the initial perfect-play outcome of full chess. Naive exhaustive exploration is impractical with current methods.

[Decidability](https://fr.wikipedia.org/wiki/D%C3%A9cidabilit%C3%A9) and [algorithmic complexity](https://fr.wikipedia.org/wiki/Complexit%C3%A9_des_algorithmes) address different questions. A finite problem can be theoretically decidable without a practical exhaustive solution. That distinction makes claims about impossibility more precise.

![The mathematical framework of chess](/images/en/echecs-ia-10-theorie.svg)

## “Hard to solve” does not mean unusable

Chess offers analogies for modern problems such as:

- [Computer security](https://fr.wikipedia.org/wiki/S%C3%A9curit%C3%A9_informatique): interacting attack and defence.
- Strategy: anticipating another agent.
- Optimisation: deciding where to spend computing effort.
- Decisions when not everything can be examined at once.

The lesson is not that AI is magic. Strong performance comes from how search, evaluation and resources interact, rather than an exhaustive view of every possibility.

For your own play, you can learn to choose what to examine more carefully. This is a practical idea, not evidence that the board reveals your whole personality or that each result measures your worth.

## What changes for you as a player

**Try it.** Open a position in an analysis tool with Stockfish locally or in the browser. Observe depth, score and lines. Changing resources may change a non-proven evaluation; follow the variation rather than treating every number as a theorem.

**On the blog:**

- [Does chess make you better at maths?](/en/blog/chess-and-mathematics/)
- [The psychology of the chess player](/en/blog/chess-player-psychology/)
- [Chess and the brain](/en/blog/chess-and-the-brain/)

Chess is beyond current naive full traversal, yet useful decisions are possible through selection, evaluation and pruning. Match strength does not prove complete solution, and a large estimated tree does not exclude every future proof method.

**Further reading:** [chessprogramming.org](https://www.chessprogramming.org/Main_Page), [ICGA](https://www.icga.org/) and [arXiv](https://arxiv.org/).

**After reading:** in a training review, find the **first move** where your idea and the engine’s differ by more than half a pawn under stated analysis settings. Revisit **that position** three times if useful, examining the concrete line. The threshold and repetition count are exercise choices, not a validated universal prescription.

---

## Sources

- Shannon, C. E. (1950), *Programming a Computer for Playing Chess*, Philosophical Magazine, 41, 256–275, [original article](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf): the combinatorial estimate discussed above.
- Fraenkel, A. S. and Lichtenstein, D. (1981), *Computing a Perfect Strategy for n×n Chess Requires Time Exponential in n*, Journal of Combinatorial Theory, Series A, 31, 199–214, [authors’ text](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf).
- Russell, S. and Norvig, P. (undated), *Adversarial Search*, textbook chapter, [text](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf): minimax, alpha-beta and search limits.
- Stockfish team (2020), *Introducing NNUE Evaluation*, [official announcement](https://stockfishchess.org/blog/2020/introducing-nnue-evaluation/).
- IBM (undated), *Deep Blue*, company archives, [1997 match history](https://www.ibm.com/history/deep-blue).
