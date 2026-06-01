---
title: "AlphaZero vs Stockfish: the Artificial Intelligence Revolution in Chess"
excerpt: >-
  In December 2017, DeepMind published the results of a match that changed the way we think about both artificial
  intelligence and chess. AlphaZero, trained without any human data, beat Stockfish with a playing style nobody had
  anticipated.
seoTitle: "AlphaZero vs Stockfish: the AI Revolution in Chess"
seoDescription: >-
  AlphaZero vs Stockfish 2017 match, reinforcement learning, revolutionary playing style: how AlphaZero changed chess
  and AI.
enSlug: "alphazero-vs-stockfish"
draft: false
faq:
  - question: Is AlphaZero still the strongest chess program?
    answer: >-
      The question is complicated. DeepMind never released a public version of AlphaZero. Stockfish has been massively
      improved since 2017, integrating neural networks into its evaluation function (NNUE, Efficiently Updatable Neural
      Network). The current version of Stockfish (Stockfish 16/17) is probably stronger than AlphaZero as it stood in
      2017. Leela Chess Zero (Lc0), the open-source equivalent of AlphaZero, is still being developed and represents
      the deep-learning approach. The line between the two approaches has blurred.
  - question: Why are the conditions of the AlphaZero vs Stockfish match disputed?
    answer: >-
      Mainly because Stockfish was run without Syzygy endgame tablebases (a library of perfectly calculated endings
      that Stockfish normally uses), and because AlphaZero's hardware setup (Google TPUs, specialized hardware) was
      not directly comparable to Stockfish's standard CPU. Results published later in Science (December 2018), with
      more balanced conditions, still confirmed AlphaZero's superiority, but with a less crushing edge.
  - question: What is NNUE, the system that revolutionized Stockfish?
    answer: >-
      NNUE (Efficiently Updatable Neural Network) is a neural-network architecture designed to run very quickly on
      standard CPUs. Integrated into Stockfish since 2020, it replaces the old heuristic evaluation function with a
      neural network trained on millions of positions evaluated by Stockfish itself. The result: Stockfish NNUE
      combines alpha-beta search speed with the evaluation richness of neural networks, a hybrid that raised its level
      by about 80-100 Elo points.
  - question: Did AlphaZero really "rediscover" lost chess concepts?
    answer: >-
      More precisely: it played ideas that were known theoretically but considered "too risky" or "not solid enough"
      by classical engine standards. Gambit pawns held for many moves for dynamic compensation, asymmetric pawn
      structures Stockfish would evaluate negatively but that contain tactical poisons. Grandmasters like Kasparov
      and Seirawan commented that AlphaZero's style sometimes looked like that of 19th-century romantic players:
      maximizing active pieces rather than the material count.
  - question: Is Leela Chess Zero (Lc0) accessible to the public?
    answer: >-
      Yes, completely. Lc0 is an open-source project that implements the AlphaZero architecture using neural-network
      weights trained by the community. It is free to download and integrates with analysis interfaces such as Arena
      or Chessbase. On a good GPU, it plays at a level comparable to the best Stockfish builds. It is the way ordinary
      players can access an "AlphaZero-like" style of analysis, which can be more instructive than Stockfish for
      understanding positions with intuitive compensation.
---

December 2017. The DeepMind team publishes a research paper and, as an appendix, 10 annotated games. Those 10 games electrified the chess community in a way nothing had since the Fischer-Spassky match of 1972.

It was not just that one program beat another program. It was *how* it beat it.

## AlphaZero's architecture

To understand why AlphaZero represents a rupture, you have to understand what it does, and what it does not do.

AlphaZero is a **deep reinforcement learning** system. It combines two technologies:

**A deep neural network** that takes the chessboard position as input and produces two outputs: a probability distribution over all legal moves (the "policy head": which moves look promising), and an evaluation of the position (-1 to +1, corresponding to a Black win, a draw or a White win: the "value head").

**Monte Carlo Tree Search (MCTS)**, which uses the neural network to guide the search. Instead of exhaustively exploring the game tree with alpha-beta pruning, MCTS simulates games to the end by picking moves according to the policy head's probabilities, then propagating the results back to the root.

What is remarkable: AlphaZero had been given only **the rules of the game**. No human games. No positional heuristics. No endgame tablebases. No knowledge of what a "good" position looks like, only the rule that checkmate is a win.

It played 44 million games against itself in 9 hours (on Google TPUs, specialized hardware), updating its network weights after each game. By the end, it had developed an understanding of the game in a way nobody had programmed in.

## The match: 28-0-72

In the December 2017 match, AlphaZero played 100 games against Stockfish 8 (the best version at the time) at classical time control. Result: 28 wins for AlphaZero, 72 draws, 0 losses.

The score is staggering on several counts. A program that beats Stockfish *without ever losing* is extraordinary. Stockfish 8 was itself far superior to any human. And the wins were not technical wins in complicated endings: they were built on clear positional themes.

Legitimate criticisms exist about the conditions of the match:
- Stockfish ran without its Syzygy endgame tablebases
- AlphaZero's hardware (TPUs) is not directly comparable to Stockfish's CPUs
- Stockfish had not been re-optimized for the available hardware

These criticisms led DeepMind to publish a revised version in December 2018 in *Science*, under more balanced conditions. The result confirmed AlphaZero's superiority, but with a less crushing edge: roughly 64% wins in open positions, a favorable overall score but not 28-0.

## The playing style: what fascinated the grandmasters

The score was impressive. The style was astonishing.

Grandmasters who commented on the 10 published games (Kasparov, Nakamura, Seirawan) used unusual words in the context of engine analysis: "creative," "human," "romantic," "alive."

**Positional sacrifices.** AlphaZero was remarkably willing to sacrifice material (typically a pawn, sometimes more) for dynamic compensation. Stockfish, with its precise material evaluation, would often refuse those sacrifices or rate them as negative. AlphaZero played them and maintained the compensation for many moves, until the material disadvantage transformed into a positional edge.

**Confidence in "biologically winning" positions.** Positions where Stockfish's numerical evaluation was ~+0.2 (slightly favorable to White, almost a draw) but where AlphaZero kept continuous pressure, forcing Black to defend uncomfortable positions move after move, until the mistake.

**The "active king" style in endgames.** AlphaZero used its king offensively earlier than classical engines: a practice known in endgame theory (the king is a strong piece in the endgame) but often deferred by engines that treat king safety as an absolute priority.

Garry Kasparov, analyzing the games, said he "recognized" that style: not as a program's, but as that of a brilliant human player with deep positional understanding. "This is how I liked to play when I was at my peak."

## What AlphaZero (re)discovered in opening theory

AlphaZero's most lasting impact on chess practice is not the match itself: it is the influence on opening theory.

AlphaZero regularly played several systems that classical engines had de-prioritized:

**The London System (1.d4 d5 2.Bf4)**: considered solid by engines but lacking bite. AlphaZero played it with a positional energy that inspired human players to bring it back to top level. Today, Magnus Carlsen and other elite players use it regularly.

**The King's Gambit (1.e4 e5 2.f4)**: a romantic 19th-century opening, generally considered insufficient at the highest level. AlphaZero played it and won, revealing resources that modern theory had not fully explored.

**Pawn structures with multiple islands** that Stockfish evaluated as slightly negative but contained compensatory dynamics.

These "rediscoveries" have influenced elite preparation. Some grandmasters explicitly use Leela Chess Zero (the open-source equivalent of AlphaZero) to find ideas Stockfish would have rejected.

## The convergence: Stockfish NNUE and the end of the dichotomy

In 2020, Stockfish integrated a neural-network architecture called **NNUE** (Efficiently Updatable Neural Network), originally developed for shogi.

NNUE replaces Stockfish's heuristic evaluation function with a neural network trained on millions of positions evaluated by Stockfish itself. The result: Stockfish NNUE combines the alpha-beta search speed of the old architecture with the positional evaluation richness of neural networks.

The level jump was immediate: about 80-100 Elo points gained, making Stockfish NNUE the strongest publicly available program.

The "Stockfish (brute force) vs AlphaZero (deep learning)" dichotomy has become obsolete. Both approaches have merged. Leela Chess Zero keeps developing with an architecture closer to AlphaZero, and both programs are today close in absolute strength.

## Implications for human chess understanding

The deepest question raised by AlphaZero is not "which program is best?", it is "what does a program that plays like this teach us about the nature of chess understanding?"

AlphaZero suggests that there is a form of positional understanding that is not reducible to precise material evaluation plus deep search. Positions Stockfish rates as ~0 (drawn) contain subtle "gradients" of pressure and opportunity that AlphaZero detects and exploits.

These gradients, hard to quantify numerically but intuitively recognizable by an experienced grandmaster, look like what human players call "initiative," "dynamism," "active pieces." AlphaZero developed a way to measure these qualities that classical heuristics did not have.

For human players, the lesson is counter-intuitive: sometimes the "objectively" slightly inferior but dynamically rich position is better than the "objectively" equivalent but static one. Engine evaluations, useful but imperfect, do not always capture that dynamism.

That may be AlphaZero's most lasting contribution to chess: a reminder that the measure of a good move is not only numerical. Beauty, pressure, sacrifice, initiative (concepts human players have always used) have a computational reality, not just a poetic one.

---

*AlphaZero never played a game against a human. Its opponents were engines and its own earlier copies. It never felt the pressure of a tournament, the discomfort of a losing position, the joy of a beautiful combination found. And yet, grandmasters said its play was the most "human" they had ever analyzed. There is something in that irony worth reflecting on.*
