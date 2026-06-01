---
title: "The Algorithmic Complexity of Chess: Why AI Took 50 Years to Beat Humans"
excerpt: "The number of possible chess games exceeds the number of atoms in the observable universe. Understanding the algorithmic complexity of chess means understanding why Deep Blue in 1997 was a feat, and why AlphaZero in 2017 was a completely different kind of revolution."
seoTitle: "Chess Algorithmic Complexity: Why AI Took 50 Years"
seoDescription: "Shannon number, alpha-beta pruning, Deep Blue, AlphaZero: chess algorithmic complexity explained, and why beating humans was so difficult."
enSlug: "chess-algorithmic-complexity"
draft: false
faq:
  - question: "What is the 'Shannon number'?"
    answer: >-
      It's an estimate of the number of legal chess positions, proposed by Claude Shannon in 1950. He
      estimated it at about 10^43. Later work refined this between 10^44 and 10^47. For scale: the observable
      universe contains about 10^80 atoms, and one second contains 10^43 femtoseconds. The Shannon number
      illustrates why exhaustive search of all positions is physically impossible, even with infinitely fast
      computers.
  - question: "How did Deep Blue beat Kasparov if it couldn't calculate everything?"
    answer: >-
      Through two combined techniques. Alpha-beta pruning intelligently prunes the search tree: if a branch
      can't lead to a better result than what's already found, it's abandoned. This exponentially reduces the
      search space. Combined with a very elaborate position evaluation function (developed with
      Grandmasters), Deep Blue evaluated about 200 million positions per second and typically searched 12-15
      moves deep. It's impressive, but not a complete solution: it's a very powerful heuristic.
  - question: "Did AlphaZero really learn chess in 9 hours?"
    answer: >-
      Yes, in a precise sense: from zero human knowledge (only the rules), playing against itself with
      reinforcement learning and deep neural networks, AlphaZero reached a level surpassing Stockfish (the
      best 'classical' engine) after 9 hours of training on specialized hardware (Google TPUs). What's
      remarkable isn't just the speed but the playing style developed: dynamic, sacrificial, with positional
      intuitions theorists hadn't codified.
  - question: "Are chess 'solved' mathematically?"
    answer: >-
      No. A game is 'solved' when you can calculate the optimal decision from any position. Checkers were
      solved in 2007 by Jonathan Schaeffer: it's a perfect draw. Chess isn't solved and probably won't be
      with foreseeable technology: the game space is too large. You can play chess better than any human, but
      not in a provably perfect way.
  - question: "Why can human players still play chess despite this complexity?"
    answer: >-
      Because humans don't search in the space of all positions. They recognize patterns, intuitively prune
      bad moves, and reason primarily from concepts (pressure, pawn structure, piece activity) rather than
      brute calculation. A Grandmaster rarely calculates more than 3-5 moves deep in a normal position: they
      eliminate 95% by intuition before even starting to calculate. It's a radically different type of
      processing from tree search, with its own strengths (creativity, positional intuition) and weaknesses
      (less precise calculation under pressure).
---

In 1950, Claude Shannon (founder of information theory) published an article titled "Programming a Computer for Playing Chess." He hadn't yet written the programs. He was calculating whether it was even *possible*.

His conclusion: the number of legal chess positions is about 10^43. The number of distinct possible games is even larger. An exhaustive search of the complete game tree would exceed the capabilities of any physically realizable computer—not from lack of speed, but because the necessary time would exceed the age of the universe.

So something else had to be found.

## What Is Algorithmic Complexity?

Algorithmic complexity is a branch of theoretical computer science that studies the resources (time, memory) needed to solve problems. It classifies problems by their "fundamental difficulty"—not in practice on a given computer, but in theory, asymptotically, as problem size grows.

The most well-known classes:
- **P**: problems solvable in polynomial time
- **NP**: problems whose solutions can be *verified* in polynomial time
- **PSPACE**: problems solvable with polynomial memory
- **EXPTIME**: problems requiring exponential time in the worst case

Generalized chess (on an n×n board instead of 8×8) belongs to the **EXPTIME-complete** class according to Fraser et al. (1981) results. This means the exact resolution of chess on an arbitrary board is, in the formal sense, as difficult as the hardest problems in its class.

## The Game Tree and the Curse of Combinatorial Explosion

Imagine the game tree of a chess game. At the root, the starting position. After White's first move (20 possible), 20 nodes. After Black's first move (20 possible), 400 nodes. After two moves each: about 8,902 positions. After five moves each: about 69 billion.

The average branching factor of a chess game is about 35. The average length of a game is about 40 moves per player. The complete tree therefore has approximately 35^80 ≈ 10^123 nodes.

This is the **number of distinct possible games**. It far exceeds the number of atoms in the observable universe (10^80). Even if every atom in the universe were a computer analyzing a billion positions per second since the Big Bang, only an infinitesimal fraction of this space would have been explored.

## Alpha-Beta Pruning: The First Great Leap

The **alpha-beta pruning** algorithm, developed in the 1950s-1960s, is the fundamental heuristic of classical chess engines.

The idea: if you search the game tree and find a branch that cannot be better than what you've already found, you stop exploring it. More precisely: you maintain two values, alpha (the best score White can guarantee) and beta (the best score Black can guarantee). As soon as a branch produces a score outside this [alpha, beta] window, it is abandoned.

In the best case, alpha-beta pruning reduces the number of nodes to explore to the square root of the complete tree. From a 10^123 space, you can hope to search 10^61—still astronomical, but much more manageable with good move-ordering heuristics.

## Deep Blue: The Victory of Engineering

Deep Blue wasn't a subtle program. It was an engineering masterpiece of brute force applied to chess heuristics.

IBM had built **specialized chips** (ASICs) designed solely to evaluate chess positions—hundreds in parallel. Deep Blue evaluated between 100 and 300 million positions per second. With well-optimized alpha-beta pruning and sophisticated ordering heuristics, it typically searched 12-16 moves deep, sometimes more in critical positions.

The evaluation function had been developed with Grandmasters: it explicitly codified concepts like pawn structure, king safety, piece activity, weak squares. Each concept was translated into numerical terms.

Kasparov had beaten Deep Blue in 1996 (4-2). He lost in 1997 (3.5-2.5). His defeat wasn't due to Deep Blue's "understanding" of the game—there was none in the cognitive sense. It was computing power + codified human heuristics + hardware engineering, pushed to a threshold where brute computational force compensated for the limitations of the approach.

## AlphaZero: A Revolution of Different Nature

Twenty years later, DeepMind presented AlphaZero. The difference wasn't quantitative: it was qualitative.

AlphaZero received only the **game rules**: which pieces exist, how they move, when a game ends. No database of human games. No explicit heuristics. No concepts codified by Grandmasters.

It played against itself: millions of games. After each game, a deep neural network learned: which positions tend to be winning, which moves tend to be good from which positions. After **9 hours** of training on TPUs (Google specialized processors), AlphaZero had reached a level surpassing Stockfish, the best "classical" engine of the time.

The style of play AlphaZero developed fascinated Grandmasters: dynamic, willingly sacrificial, with positional intuitions that theorists had never explicitly codified. AlphaZero searched markedly fewer positions than Stockfish (about 80,000 per second vs 60 million), but each was evaluated by a neural network encoding an "intuition" learned through experience rather than explicit rules.

This was no longer improved exhaustive search. It was something structurally different: an approximation of intuition by deep learning.

## What AI Reveals About Human Cognition in Chess

The Deep Blue → AlphaZero trajectory reveals something important about the nature of human cognition in chess.

Deep Blue beat humans by doing things *differently*: more brute calculation, faster, deeper. AlphaZero beats humans by doing something *more similar* to what humans do: pattern recognition, intuitive evaluation, very pruned tree search.

fMRI studies on expert chess players show their brain isn't a brute calculator. Faced with a position, a Grandmaster doesn't first "calculate" all variations. They **recognize** the position as belonging to a family, identify key themes, and only deeply explore 3-5 candidate moves maximum.

The algorithmic complexity of chess was so great that we had to wait not for a computer fast enough to brute-force resolve it, but for a new computational paradigm (deep learning) to approximate the cognition that, all along, allowed humans to play despite this complexity.

Shannon was right in 1950. Exhaustive search was impossible. The solution wasn't to search faster. It was to learn not to search.

## Sources

- Shannon, C. E. (1950). Programming a computer for playing chess. *Philosophical Magazine*, 41(314), 256-275.
- Fraenkel, A. S., & Lichtenstein, D. (1981). Computing a perfect strategy for n×n chess requires time exponential in n. *Journal of Combinatorial Theory*, 31(2), 199-214.
- Silver, D., et al. (2018). A general reinforcement learning algorithm that masters chess, shogi, and Go through self-play. *Science*, 362(6419), 1140-1144.
- Campbell, M., Hoane, A. J., & Hsu, F. H. (2002). Deep Blue. *Artificial Intelligence*, 134(1-2), 57-83.

## Key Takeaways

- The number of legal chess positions is estimated between **10^44 and 10^47** (Shannon number). The observable universe contains about 10^80 atoms
- **Deep Blue** beat Kasparov in 1997 by augmented brute force: 200M positions/second + alpha-beta pruning heuristics
- **AlphaZero** (2017) received only the rules and played 44M games against itself in 9 hours, developing concepts unknown to theorists
- Chess complexity is **EXPTIME-complete** in the generalized version (n×n board): no polynomial algorithm can resolve chess generally
- Human chess understanding is not a degraded version of tree search: it's **radically different cognition** based on pattern recognition and intuition
