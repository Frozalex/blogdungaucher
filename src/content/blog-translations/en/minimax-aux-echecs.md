---
title: "Minimax in Chess: Search, Evaluation and the Limits of the Analogy"
excerpt: "Minimax formalises a choice against the opponent’s best replies. Explore alpha-beta, negamax, selective search and MCTS without treating the algorithm as a proven model of your brain."
seoTitle: "Minimax in Chess: Alpha-Beta, Negamax and Engine Search"
seoDescription: "Minimax, negamax, alpha-beta and MCTS: understand engine search, its guarantees and limits, without presenting it as a demonstrated model of human cognition."
enSlug: "minimax-in-chess"
faq:
  - question: "Does minimax always return the best move?"
    answer: "On a finite tree searched to correctly valued terminal outcomes, it gives an optimal decision. With heuristic cutoffs, its guarantee concerns only that evaluated tree, not the position’s complete truth."
  - question: "Does alpha-beta change the minimax value?"
    answer: "With the same tree, depth and evaluations, exact alpha-beta preserves the minimax value. Several moves may share that value, so tie-breaking can vary. Additional selective pruning has different guarantees."
  - question: "Do all engines use negamax and alpha-beta?"
    answer: "No. Negamax is a formulation of minimax suited to zero-sum games. Stockfish uses selective alpha-beta search, while AlphaZero uses network-guided MCTS."
  - question: "Does my brain execute minimax?"
    answer: "It is a reasoning analogy: you compare moves and replies. The sources presented demonstrate neither an identical brain algorithm nor a fixed depth associated with Elo."
heroImageAlt: A pruned tree rising above a chess piece.

---

There is something striking about expressing strategy in an old game of intuition and art through a short algorithm. Minimax formalises strategic choice in a zero-sum game as a mathematical recurrence. It also provides a useful analogy for organising calculation, without being a demonstrated description of your brain. For the theoretical framework, see [game theory in chess](/en/blog/game-theory-in-chess/); for existence of a game value under specified rules, see [Zermelo](/en/blog/zermelo-paradox/).

## The intuition behind minimax

Imagine playing White and wanting the best move. Define it as the move yielding the best final result when the opponent also chooses optimally.

That recursive definition is minimax’s core. White maximises the outcome from White’s perspective; Black minimises it from that same perspective, equivalently maximising from Black’s. The players alternate at successive tree levels.

A mathematical formulation is:

$$\text{minimax}(p,d)=\begin{cases}\text{evaluation}(p)&\text{if }d=0\text{ or }p\text{ is terminal}\\\max_{c\in C(p)}\text{minimax}(\text{succ}(p,c),d-1)&\text{if White is to move}\\\min_{c\in C(p)}\text{minimax}(\text{succ}(p,c),d-1)&\text{if Black is to move}\end{cases}$$

Here $p$ is the current position, $d$ remaining depth, $C(p)$ the legal moves and $\text{succ}(p,c)$ the position after move $c$.

## The evaluation function: the engine’s assessment

Minimax would solve a finite chess tree if the complete tree could be explored to terminal positions. That is not practical with current resources because of combinatorial growth. Shannon’s order of magnitude illustrates move-sequence explosion, not an exact leaf count. Search is stopped at finite depth, and nonterminal positions receive a **heuristic evaluation**.

A traditional evaluation combines material, mobility, king safety and pawn structure. These help interpret a position but are not context-independent absolute values.

Stockfish integrated NNUE neural evaluation in 2020. Distinguish that architecture from older hand-written sums of features. In the recurrence, “evaluation” must return exact utility for a terminal outcome and an estimate for a position cut off only because depth reached zero.

## Alpha-beta pruning: avoiding unnecessary work

Unpruned minimax grows rapidly. With depth $d$ half-moves and uniform branching $b$, leaf count is on the order of $b^d$. For $b=35$ and $d=10$, $35^{10}\approx2.8\times10^{15}$ leaves in that illustrative model.

[Alpha-beta pruning](https://fr.wikipedia.org/wiki/%C3%89lagage_alpha-b%C3%AAta), associated with work by several researchers including John McCarthy, reduces work by skipping branches that cannot influence the final decision.

If White already has an option guaranteeing value $\alpha$, and a branch lets Black force a value below $\alpha$ for White, White need not choose that branch. A better option is already available.

Maintain two bounds in the same score perspective:

- $\alpha$: a lower bound available to the maximising player, White here.
- $\beta$: an upper bound available through the minimising player, Black here.

When $\alpha\geq\beta$, the current branch can be cut because it cannot change an already available ancestor choice.

With ideal move ordering, cost approaches $O(b^{d/2})$. This is an asymptotic order, not an equation yielding an exact real-position node count.

![Alpha-beta pruning on a three-level minimax tree: grey branches cannot influence the final choice. Alpha is already 3 for MAX, so a branch where MIN can force less than 3 need not be fully explored.](/images/en/minimax-01-alpha-beta.svg)

### Negamax: simplifying the formulation

Negamax uses $\min(a,b)=-\max(-a,-b)$ and evaluates from the side-to-move perspective. The sign changes when the side changes. It reformulates minimax; it does not describe every engine or guarantee a precise reduction in code length.

### Null-move pruning: testing a hypothetical pass

A useful heuristic asks what happens if you **pass your turn**. If the position remains favourable despite giving the opponent a move, the engine may cut further analysis under specified conditions. This is **null-move pruning**.

The hypothetical pass is not a legal chess move. Zugzwang is a known risk: having to move can worsen the result, particularly in some endgames. Implementations add conditions and checks to limit that risk. No universal two-to-fourfold speed gain is established here.

![Null-move pruning: a hypothetical pass may support cutting search when the position remains favourable. Zugzwang, where having to move worsens the result, is a known risk requiring safeguards.](/images/en/minimax-03-null-move.svg)

## Advanced techniques in modern engines

Engines such as Stockfish add techniques beyond basic alpha-beta:

**Transposition tables:** cache information about previously searched positions. When another move order reaches a matching state, the engine may reuse suitable information instead of repeating all the work. Reuse depends on stored depth, bound type and relevant state.

![Two paths can reach the same position](/images/en/minimax-04-transposition.svg)

**Iterative deepening:** search depths 1, 2, 3 and onward rather than start immediately at $d$. Earlier iterations help order moves for later searches and improve pruning efficiency.

**Quiescence search:** at the nominal cutoff, continue selected tactical moves according to the implementation rather than always evaluate statically. A checked king requires legal responses, not captures alone. This helps address unresolved tactical sequences that would distort a static score.

**Search extensions:** some lines receive additional depth, such as those involving checks, advanced passed pawns or other critical conditions, according to the engine’s design.

**Late move reductions, LMR:** less promising later moves may be searched at reduced depth to save time. A better-than-expected result may trigger further search.

## Search that evolves

Stockfish’s published code combines search, transposition tables, iterative deepening and selective mechanisms. Those should not be confused with exact alpha-beta on a fixed tree.

The 2020 NNUE announcement illustrates another change: replacing evaluation without abandoning the alpha-beta search family. A modern engine is not merely a material formula followed by blind exploration.

## AlphaZero and alternatives to classical minimax search

In 2017, [DeepMind](https://fr.wikipedia.org/wiki/Google_DeepMind) published [AlphaZero](https://fr.wikipedia.org/wiki/AlphaZero) results: learned self-play evaluation and search beat Stockfish in a particular experimental setup. Training hours need the accompanying hardware and protocol context.

AlphaZero uses neural-network-guided [Monte Carlo tree search](https://fr.wikipedia.org/wiki/Recherche_arborescente_Monte-Carlo), MCTS, rather than the conventional minimax search described above. Search selects paths using its learned policy and evaluates explored leaves with the network; simulations do not all run to checkmate.

Published games attracted attention through long-term material sacrifices and piece activity. Calling the style intuitive or creative describes an interpretation of moves, not a measured human cognitive process in the program.

AlphaZero demonstrates that conventional alpha-beta is not the only route to strong chess performance. It does not establish a “deeper human understanding” or solve the game. For the combinatorial problem, see [why chess is an almost impossible mathematical problem](/en/blog/chess-mathematical-problem-and-ai/); for another framework requiring careful distinction, see [chaos theory in chess](/en/blog/chaos-theory-in-chess/).

## Minimax as a tool for your calculation

When asking “If I play there, what is their best reply?”, minimax can organise your reasoning. That does not show your brain executes it or assign three-to-eight or seven-to-ten levels to a player category.

In a training position, choose two candidates and examine a reply to each. Then look for a defence you had not considered. The goal is better checking, not reproducing a measured human search depth.

![Calculation: an analogy to clarify](/images/en/minimax-02-profondeur-humain-moteur.svg)

## Sources

- Russell, S., & Norvig, P. (undated online chapter). *Adversarial Search*. Artificial Intelligence: A Modern Approach. [Chapter](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Stockfish team (undated). *search.cpp*. Official repository. [Code](https://github.com/official-stockfish/Stockfish/blob/master/src/search.cpp).
- Stockfish team (2020). *Introducing NNUE Evaluation*. [Announcement](https://stockfishchess.org/blog/2020/introducing-nnue-evaluation/).
- Silver, D., et al. (2017). *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*. arXiv. [Article](https://arxiv.org/html/1712.01815v1).
