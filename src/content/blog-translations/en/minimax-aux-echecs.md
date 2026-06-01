---
title: "Minimax in Chess: The Algorithm That Thinks for You"
excerpt: "Minimax is the fundamental algorithm of strategic reflection in chess. From modern engines to your own thinking at the board, here's how this mathematical tool structures every decision."
seoTitle: "Minimax in Chess: Alpha-Beta, Negamax, and Engine Calculation"
seoDescription: "Minimax, alpha-beta pruning, negamax, null-move pruning, MCTS: how engines calculate the optimal move in chess and what your brain does without knowing it."
enSlug: "minimax-in-chess"
draft: false
faq:
  - question: "Does minimax always produce the best move?"
    answer: >-
      Yes, <strong>if the search reaches terminal positions</strong> (mate or stalemate). At finite depth
      with a heuristic evaluation function, minimax produces the optimal move <em>according to the evaluation
      and depth</em> used. That's why an engine rated 3500 Elo beats a human: its evaluation function + depth
      are closer to the truth than a human's, not because it calculates 'perfectly'.
  - question: "Why is it called 'negamax' rather than 'minimax' in code?"
    answer: >-
      Because in a zero-sum game, $\min(a,b) = -\max(-a,-b)$. Negamax exploits this symmetry to use <strong>a
      single recursive function</strong> instead of two. It's purely a code simplification, with no
      algorithmic change. Nearly all modern engines (Stockfish, Komodo, Leela Chess Zero) use negamax +
      alpha-beta.
  - question: "Does alpha-beta pruning change minimax's result?"
    answer: >-
      No, <strong>never</strong>. That's its fundamental property: alpha-beta produces exactly the same move
      as pure minimax, but exploring far fewer nodes. Pruning strength depends on <strong>move
      ordering</strong>: if you test the best move first, you prune massively; if you test the worst first,
      you barely prune anything. That's why engines invest so much in move ordering (killer moves, history of
      good moves).
  - question: "Why does AlphaZero abandon minimax?"
    answer: >-
      Not really: it keeps a tree search (MCTS), but replaces alpha-beta's exhaustive exploration with a
      <strong>probabilistic exploration guided</strong> by a neural network. The advantage: in positions
      where the classical evaluation function struggles (long-term sacrifices, subtle positional play), the
      neural network gives a more accurate estimate. The disadvantage: that network must be trained on
      millions of games, requiring considerable hardware resources.
  - question: "Does my brain really execute minimax when calculating?"
    answer: >-
      Approximately, yes. You perform a tree search with a very low branching factor (3-5 candidate moves
      instead of 35), very limited depth (3-8 half-moves), and an intuitive evaluation function (positional
      sense). You also use very powerful pruning heuristics: you <strong>reject</strong> most moves at a
      glance without calculating them. The difference with an engine isn't qualitative, it's quantitative.
---

There's something strange about chess strategy, this millennial game of intuition and art, being reducible to an algorithm of a few lines. The minimax algorithm does exactly that: it formalizes the heart of strategic reasoning in a zero-sum game into an elegant mathematical recursion.

## The Intuition Behind Minimax

Imagine you play White and want to choose the best possible move. How to define it? The best move is the one that, assuming your opponent also plays perfectly, gives you the best final result.

This recursive definition is the essence of minimax. White wants to maximize the result (from White's viewpoint). Black wants to minimize the result. Both players alternate, and at each tree level, it's one or the other playing.

The mathematical formalization is direct:

$$\text{minimax}(p, d) = \begin{cases} \text{eval}(p) & \text{if } d = 0 \text{ or terminal} \\ \max_{c \in C(p)} \text{minimax}(\text{succ}(p,c), d-1) & \text{White's turn} \\ \min_{c \in C(p)} \text{minimax}(\text{succ}(p,c), d-1) & \text{Black's turn} \end{cases}$$

## The Evaluation Function: The Heart of the Engine

Pure minimax would solve chess perfectly if you could explore the complete tree to terminal positions. In practice, this is impossible due to combinatorial complexity ($10^{120}$ leaves according to Shannon). You must stop search at finite depth and evaluate non-terminal positions with a **heuristic evaluation function**.

Modern engines like [Stockfish](https://en.wikipedia.org/wiki/Stockfish_(chess)) use extremely sophisticated evaluation functions that integrate:

- **Material value** with context-dependent value tables
- **Piece mobility**: the number of legal moves available
- **King safety**: pawn structure solidity around the king
- **Pawn structure**: doubled, isolated, backward, passed pawns
- **Center control**: occupation of e4, d4, e5, d5 squares

## Alpha-Beta Pruning: The Intelligence of Giving Up

Raw minimax is spectacularly inefficient. For search depth $d$ and branching factor $b$, you need to evaluate $b^d$ positions. At $b = 35$ and $d = 10$, that's $2.8 \times 10^{15}$. Impossible.

[Alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning) solves this by pruning branches that cannot influence the final decision.

The principle: if you've already found an option for White guaranteeing value $\alpha$, and you explore a branch where Black can force a result inferior to $\alpha$ for White, this branch can be abandoned.

In the optimal case (with well-ordered moves), alpha-beta reduces nodes from $b^d$ to $b^{d/2}$, effectively doubling the possible search depth.

### Negamax: The Simplification That Changes the Code

In practice, almost no engine implements minimax in its two-branch form (max for White, min for Black). All use **negamax**, exploiting $\min(a,b) = -\max(-a,-b)$ in a zero-sum game. Conceptually identical, but much shorter (15 lines of code vs 40).

### Null-Move Pruning: Passing Your Turn to Gain Time

A powerful heuristic: what if you **pass your turn**? If the position remains good for you despite this free move given to the opponent, then it's probably *very* good for you. The technique is standard since the 1990s.

## Advanced Techniques in Modern Engines

**Transposition tables**: a cache of already-analyzed positions. If the same position is reached by different move orders, the engine reuses the previous analysis.

**Iterative deepening**: instead of directly searching to depth $d$, the engine chains successive searches at depths 1, 2, 3, ..., $d$.

**Quiescence search**: at maximum depth, instead of statically evaluating, search continues until a "quiescent" (stable) position.

**Search extensions**: in certain positions, search depth is automatically extended.

**Late move reduction (LMR)**: for less promising moves, depth is reduced.

## The History of Minimax Engines

In 1950, [Claude Shannon](https://en.wikipedia.org/wiki/Claude_Shannon) laid the theoretical foundations.

The apex of classical minimax was [Deep Blue](https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)), which beat [Kasparov](https://en.wikipedia.org/wiki/Garry_Kasparov) in 1997. Deep Blue evaluated 200 million positions per second.

[Stockfish](https://en.wikipedia.org/wiki/Stockfish_(chess)), developed since 2008, represents the culmination of classical minimax with manual evaluation. Since 2020, it integrates NNUE (Efficiently Updatable Neural Network).

## AlphaZero and Surpassing Minimax

In 2017, DeepMind published [AlphaZero](https://en.wikipedia.org/wiki/AlphaZero), a program that learned to play chess by self-play in hours and convincingly beat Stockfish.

AlphaZero doesn't use classical minimax but a Monte Carlo Tree Search (MCTS) guided by a deep neural network. Instead of exhaustively exploring the tree with pruning, MCTS stochastically explores the most promising branches according to a learned policy.

What struck the chess community wasn't just AlphaZero's performance, but its playing style. AlphaZero plays audaciously and creatively, with long-term material sacrifices and a preference for piece activity over immediate material advantages.

## Minimax in Your Head

The most fascinating aspect of minimax for the practical player is that it describes what you already do when calculating variations. When you think "if I play there, he can respond this or that. If he responds this, I play this and he's forced to..."—you mentally execute a truncated minimax algorithm.

Your human limits determine the "depth" of your search. A 1200 player perhaps explores 2-3 levels reliably. A Grandmaster explores 7-10 levels in strategic positions.

The difference between an average player and a Grandmaster isn't just depth: it's also the quality of the internal evaluation function (positional intuition) and the effectiveness of pruning (the capacity to quickly identify relevant moves).

## Sources

- Shannon, C. E. (1950). Programming a computer for playing chess. *Philosophical Magazine*, 41(314), 256-275.
- Silver, D., et al. (2017). Mastering chess and shogi by self-play. arXiv:1712.01815.
- Knuth, D. E., & Moore, R. W. (1975). An analysis of alpha-beta pruning. *Artificial Intelligence*, 6(4), 293-326.
- Campbell, M., Hoane, A. J., & Hsu, F. (2002). Deep Blue. *Artificial Intelligence*, 134(1-2), 57-83.

## Key Takeaways

- Minimax is the algorithm that explores the game tree alternating maximization (White) and minimization (Black)
- **Negamax** is the modern, shorter formulation, mathematically equivalent
- **Alpha-beta pruning** dramatically reduces the number of nodes to explore without changing the result
- Modern engines add heuristic evaluation functions, **transposition tables**, null-move pruning, iterative deepening, and quiescence
- **AlphaZero** showed that an MCTS + neural network approach can surpass pure minimax for complex games
- Your brain mentally executes a simplified version of minimax (low branching + strong intuitive pruning)
