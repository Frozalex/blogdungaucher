---
heroImageAlt: "An hourglass whose sand consists of tiny chess pieces passing from one bulb to the other."
title: "Game Theory in Chess: What Strategic Decisions Mean"
excerpt: "Minimax, Nash equilibrium and perfect information: distinguish mathematical guarantees, engine estimates and practical choices against another player."
seoTitle: "Game Theory in Chess: Nash, Minimax and Zermelo"
seoDescription: "Minimax, Nash equilibrium, pure and mixed strategies and Zermelo: game theory applied to chess, with clear limits between proof and practical preparation."
enSlug: "game-theory-in-chess"
faq:
  - question: "Is chess zero-sum?"
    answer: "Yes, using +1 for the winner, −1 for the loser and zero each for a draw. Standard 1–0 or ½–½ scoring is constant-sum and can be transformed into zero-sum scoring."
  - question: "Do we know chess’s result under perfect play?"
    answer: "No. Existence of a theoretical value does not identify whether White wins, Black wins or both can guarantee a draw from the initial position."
  - question: "Should I mix my openings?"
    answer: "Variation may make preparation less predictable, but no theorem imposes a particular split. In a finite perfect-information game such as chess under termination rules, optimal pure strategies exist."
---

Round nine, move fourteen. You played the previous thirteen from memory. Your opponent did too. A familiar variation brought you to the same position. That does not prove you are playing a Nash equilibrium.

Game theory helps distinguish what a mathematical result guarantees, what an engine estimates and what you choose against a real person.

## The model: two players and known rules

Chess is a two-player game without random draws in its rules and with perfect information. Played moves and the game state are available to both sides. That does not mean knowing an opponent’s preparation or intentions.

With win = +1, loss = −1 and draw = zero, payoffs sum to zero. With standard 1, zero and ½ scoring, they sum to one: a constant-sum game equivalent after rescaling. Repeating games does not automatically remove that property.

Russell and Norvig’s adversarial-search framework represents a finite game as a decision tree. A correct chess state also needs rights and historical information required by the rules; occupied squares are not always enough.

## A theoretical value is not a calculated solution

In a finite tree with win, draw and loss outcomes, values can be propagated from leaves: each player chooses the continuation most favourable to them. This supplies a root value and choices guaranteeing it.

The [Zermelo article](/en/blog/zermelo-paradox/) discusses the history. The point here is simple: existence of a perfect-play result does not identify the initial chess position’s value.

It would be excessive to claim every possible game must necessarily be traversed to find proof, or that no future discovery could solve the problem. An enormous estimated tree does not demonstrate mathematical impossibility.

## Minimax: the best guarantee against the best defence

At a White-to-move position, minimax takes the maximum continuation value. At a Black-to-move position, it takes the minimum, with values expressed from White’s perspective.

$$v(p)=\max_{c\in C(p)}v(\operatorname{result}(p,c))$$

$$v(p)=\min_{c\in C(p)}v(\operatorname{result}(p,c))$$

At terminal leaves, value comes from the game result. If stopped earlier, it comes from an estimate: calculation then establishes only the value of that truncated, evaluated tree.

Russell and Norvig also show how alpha-beta skips branches unnecessary to minimax’s result. Savings depend on move ordering; the favourable $O(b^{d/2})$ case is not guaranteed in every search. Neither this bound nor minimax literally describes your brain’s calculation.

[Minimax in chess](/en/blog/minimax-in-chess/) details these limits. Engines do not all share one search method: treating Leela as simple minimax would mislead.

## What Nash adds

Nash (1951) studies equilibria in non-cooperative games. At equilibrium, no player improves their payoff by changing strategy alone while the others’ strategies remain fixed.

A strategy here is a complete plan specifying choices in relevant situations. One first move or a popular opening does not prove equilibrium. An engine’s “equal” line may remain poorly understood or change evaluation with deeper analysis.

Likewise, White’s observed database score measures human results dependent on the sample. It establishes neither theoretical value nor first-move dominance. [Graphs and equilibria](/en/blog/nash-equilibrium-openings/) explores this distinction.

## Pure strategies, mixing and preparation

In a finite perfect-information game, backward induction selects an optimal action at each decision: a pure strategy suffices to guarantee the theoretical value. Randomness is not compulsory for perfect chess.

In practice, varying your repertoire may complicate opposing preparation. You may also prefer a deeply known line to an unfamiliar surprise. These are training and adaptation decisions; no universal split among 1.e4, 1.d4 and 1.Nf3 follows from Nash’s theorem.

Before playing, distinguish “Which continuation seems soundest?” from “Which can I handle correctly today?” Afterwards, compare your hypotheses about the opponent with the moves actually played.

## Sources

- Russell, S. and Norvig, P. (undated), *Adversarial Search*, authors’ textbook chapter, [text](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Nash, J. F. (1951), *Non-Cooperative Games*, Annals of Mathematics, 54(2), 286–295, [original article](https://irving.vassar.edu/faculty/gj/FTU/io/literature/Nash51.pdf).
