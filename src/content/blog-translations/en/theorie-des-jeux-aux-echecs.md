---
title: "Game Theory in Chess: Why Every Move is a Strategic Decision"
excerpt: "Chess is the founding ground of game theory. Minimax, Nash equilibrium, perfect information: a mathematical breakdown of what is really happening when you play."
seoTitle: "Game Theory in Chess: Nash, Minimax, Zermelo Explained"
seoDescription: "Minimax, Nash equilibrium, mixed strategies, Zermelo's theorem: game theory applied to chess, from openings to preparing for a specific opponent."
draft: true
faq:
  - question: Are chess strictly a zero-sum game?
    answer: >-
      Yes, mathematically. The sum of payoffs (1 for a win, 0 for a loss) is constant whatever the result: one player's
      win is exactly the other's loss; a draw splits 0.5-0.5. That property is what makes minimax applicable without
      complication. "Matches" (sequences of games with tactical bonuses) are no longer strictly zero-sum, and that is
      precisely where repeated-game theory becomes interesting.
  - question: What is the difference between minimax and Nash equilibrium in chess?
    answer: >-
      Minimax is a **computation technique**: it says how to find the best move assuming the opponent is optimal. The
      Nash equilibrium is a **state of the system**: a configuration where no player has an interest in deviating
      alone. In a two-player zero-sum game like chess, the minimax solution *coincides* with the Nash equilibrium
      (von Neumann's theorem, 1928). In more complex games (non-zero-sum, more than two players), the two concepts
      diverge.
  - question: Is there a dominant strategy on the first move?
    answer: >-
      Empirically, **no**. Statistics from tens of millions of elite games show 1.e4, 1.d4, 1.c4 and 1.Nf3 as playable
      with similar advantages for White (~54-56% score). None *dominates* the others strictly. That suggests either
      that the "truth" of chess allows several equilibria at move 1, or that the human and machine calculation horizon
      cannot yet tell them apart.
  - question: Why talk about "mixed strategies" if you always play the best move?
    answer: >-
      Because "the best move" depends on your model of the opponent. If you systematically play 1.e4, you give the
      opponent perfect information about your preparation: they can invest all their study time on your lines.
      Diversifying (40% 1.e4, 40% 1.d4, 20% 1.Nf3) dilutes their preparation effort. Beyond a certain level, the
      mixed strategy becomes a defensive investment in information.
  - question: Can game theory predict who will win a game?
    answer: >-
      No, and that matters. It says that **under perfect play**, the result is determined. But perfect play exists
      neither for humans (cognitive limits) nor for machines (computational limits beyond 7-piece endgames). The
      theory predicts *asymptotic equilibria* (a stable Ruy Lopez over 200 years), not *individual outcomes*. For
      that, you have to model strength differences, preparation, fatigue, time of day - and there game theory hands
      off to statistics and psychology.
---

Round 9. Move 14. You have played the previous thirteen without thinking: you know them by heart. So does your opponent. You both watch the clock, not the board. At that instant, you are two perfectly rational actors locked into the same equilibrium.

You know it. So does he.

That is what game theory is about. It is not a metaphor: chess is **the textbook case** on which von Neumann and Nash built their models.

## Why chess is an almost-perfect mathematical object

Four properties make chess a rare object in game theory. They sound mundane. They are not.

**Two players, full stop.** No alliances, no coalitions, no third parties. White against Black, what one wins the other loses exactly.

**Zero sum.** No outcome where you both win. None where you both lose. A draw is a strict split, not a compromise. That property makes chess analyzable: it is what we call a *two-player zero-sum game*, the simplest class in game theory.

**Perfect information.** In poker, you do not see the opponent's cards. In backgammon, you roll dice. In chess, *everything* is on the board. At every instant, both players have access to exactly the same information. No hidden element, no randomness.

**Finite.** The number of legal games is Shannon's estimate: $10^{120}$. Astronomical, larger than the number of atoms in the observable universe. But **finite**. And that finiteness is what makes the following theorem possible.

## The 110-year-old theorem that says a chess game already has a result

In 1913, the mathematician [Ernst Zermelo](https://en.wikipedia.org/wiki/Ernst_Zermelo) proves a result that should give you vertigo. (The theorem, its scope, its limits and its combinatorial subtlety are detailed in the dedicated article on [Zermelo's paradox](/en/blog/paradoxe-de-zermelo/).)

In every two-player game with perfect information, no chance, and a finite tree, one of these three statements is *necessarily true*:
1. The first player has a winning strategy.
2. The second player has a winning strategy.
3. Both can force a draw.

Applied to chess: there exists **right now** a truth of the starting position. Either White wins with perfect play. Or Black wins. Or the game is a draw under perfect play.

Nobody knows which. Nobody will probably ever know: you would have to explore $10^{120}$ games. But **the answer exists**. It is etched into the structure of the game itself, independent of who plays.

The majority expert hypothesis is that it is a draw. But that is a belief, not a theorem.

## Minimax: what your brain already runs, without knowing it

When you think about a move, you do something like: *"If I play the knight here, he takes. If I recapture, he has Qf3, threatening... no, I have Re1 in between."*

What you just did has a name: the **minimax** algorithm. And you learned it without anyone teaching it to you, because it is the only logical way to reason against an intelligent opponent.

The idea fits in two sentences. You look for the move that gives you the **best possible result**, assuming the opponent will systematically choose the reply that gives you the **worst possible result**.

Before the formula, the analogy: imagine two players passing each other a lamp. Whoever holds the lamp picks, in a room, which bulb to light: the brightest for their team, the dimmest for the opposing team. Maximize for yourself, minimize for the other, each turn. That is all.

If you write $v(p)$ for the value of position $p$ from White's side:

$$v(p) = \max_{c \in C(p)} v(\text{result}(p, c)) \quad \text{if it is White's turn}$$
$$v(p) = \min_{c \in C(p)} v(\text{result}(p, c)) \quad \text{if it is Black's turn}$$

$C(p)$ is the set of legal moves in position $p$.

What this formula spares you from recomputing: at each depth, it assumes the opponent will play *their* best move, sparing you the cost of imagining their likely mistakes (which would cost calculation without gaining safety).

That is exactly what Stockfish, Leela and all modern engines run. The difference between them and you: they do it across millions of nodes per second, whereas your brain processes maybe three or four. The algorithm's details, its refinements (transposition tables, iterative deepening) and its modern neural-network version are covered in the [minimax in chess](/en/blog/minimax-aux-echecs/) article.

### Why an engine does not explore $35^{10}$ positions

A problem: combinatorial growth is exponential. About 35 legal moves per ply. At depth 10, that is $35^{10}$ ≈ 2,700 trillion positions. Out of reach even for the best supercomputer.

The trick that saves everything: **alpha-beta pruning**. The principle is clear.

Suppose you have already found a variation that guarantees you an edge. If, while exploring another branch, you discover that the opponent can drag you down below that benchmark, **there is no point exploring the rest of the branch**. You already know it is bad. You cut.

Pruning turns $35^d$ into $35^{d/2}$: in other words, it **doubles the depth** reachable with the same compute budget. That is the technical reason a 1997 engine (Deep Blue) could already beat Kasparov.

## Nash, or why 1.e4 e5 2.Nf3 Nc6 3.Bb5 has survived for 200 years

John Nash generalized minimax to games where multiple equilibria coexist. The **Nash equilibrium** is a state where no player has an interest in changing their strategy **unilaterally**, provided the other keeps theirs.

> **Quick definition: Nash equilibrium.** Imagine two firms setting their prices. If one cuts, it gains customers but loses margin. The other follows. They both end up at a price where neither has an interest in moving first. That is a Nash equilibrium: not the collective optimum, just a point where nobody gains by deviating alone.

In chess, that translates into the openings.

When we say a variation is *"theoretically equal,"* it means precisely that: both sides have resources that maintain the balance, and the first to deviate unilaterally risks being punished. That is why the Ruy Lopez (1.e4 e5 2.Nf3 Nc6 3.Bb5) spans centuries: it is a stable equilibrium that nobody has managed to break.

Under perfect play on both sides, *the entire game* would be one gigantic Nash equilibrium. And if the truth of chess is a draw, then that equilibrium is the draw. The complete mapping of these equilibria in current openings is the subject of [Nash graphs and opening equilibria](/en/blog/graphes-de-nash-equilibre-ouvertures/); a single repertoire can contain several equilibria, and the choice between them is already part of the meta-game.

### Dominant strategies and dominated strategies

A sibling concept, often confused with Nash: the **dominant strategy**. A move is *dominant* if it is better than its alternatives regardless of the opponent's reply. A move is *dominated* if another option is strictly better whatever the other plays. In chess, pure dominant strategies are rare (almost every position offers a trade-off), but **dominated** strategies are frequent: a move that loses material without compensation is dominated by almost any other legal move. That is the mathematical basis of what coaches call "eliminating absurd moves" before calculating.

Dominance analysis is what your brain uses to *not* calculate every line: you dismiss 30 of the 35 legal moves in under a second because they are dominated. You only analyze the 3 to 5 remaining ones seriously.

## Perfect information does not really exist (and that is what makes the game playable)

Textbooks say chess is *perfect information*. Technically true. Practically false.

The missing information is not on the board. It is inside your opponent's skull.

You do not know how deep he has calculated. You do not know if he knows the variation you prepared last night. You do not know whether his apparent calm hides a position he thinks is lost, or a devastating combination he is waiting to drop on move 27.

That subjective asymmetry turns chess, in practice, into an imperfect-information game. That is where the [psychology of the chess player](/en/blog/psychologie-du-joueur-d-echecs/) comes in. That is where pure game theory stops correctly predicting human behavior.

## The Bobby Fischer paradox: why the most predictable player of the 20th century won

Game theory says: diversify your openings, otherwise you become predictable and you get prepared against. That is called a **mixed strategy**: playing several lines with varied probabilities rather than the same one every time.

Bobby Fischer played **1.e4** in almost all his games.

Pure strategy, full predictability, apparent violation of the mixed-strategy principle. And yet, he dominated. Why?

Because his preparation in 1.e4 lines was so deep that he *preferred to play familiar positions*, even expected ones, rather than surprise the opponent in positions he had mastered less well. His pure strategy dominated any mixed strategy from a less prepared opponent. That is a full game-theory result: when the preparation differential is large enough, predictability becomes an advantage.

You, at 1500 Elo, are not Fischer. Diversify your openings.

## Why Magnus Carlsen almost never plays an isolated game

Tournament chess is a *repeated game*: you will face the same opponents over several years, dozens of times. And the theory of repeated games says that in that frame, **reputation** becomes a strategic asset in its own right.

Known for your aggression? Your opponents arrive armed with solid defensive systems, and you can trap them by playing calmly one given day. Known for endgame technique? They will avoid simplifications, so the middlegame becomes your terrain.

That is the technical reason Magnus Carlsen and his team spend hundreds of hours per match *preparing the specific opponent*. They are not looking for the absolute best move. They are looking for the subtle deviation that leaves the known paths of **this** opponent **specifically**, while keeping a theoretical edge.

It is also why world-championship matches often produce odd openings: those are not objectively better moves, they are strategically better moves *against this person, at this moment, given what they have prepared*.

## What game theory gives up (and probably will never get back)

Despite its power, game theory hits combinatorial complexity. "Solving" chess (knowing whether White wins, Black wins, or it is a draw under perfect play) requires exploring a tree of $10^{120}$ leaves. No computer will do it. No future classical computer will, without a physical revolution.

For comparison:
- **Tic-tac-toe**: trivially solved. Draw under perfect play.
- **Connect Four**: solved in 1988. The first player wins.
- **Checkers**: solved in 2007 by Jonathan Schaeffer and his team (published in *Science*). Draw under perfect play, after 18 years of computing.
- **Nim**: solved analytically (Sprague-Grundy theorem).
- **Chess**: remains open. For a very long time.

It is not a limit of the discipline. The theory claims the answer exists. It is just that the computational resources needed are physically out of reach. (For the detailed proof of this practical impossibility and the way AI gets around the wall, see [why chess is an almost impossible mathematical problem](/en/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/).)

## The lesson that fits in one line

On 64 squares as in a life decision, there is no *absolute* best move. There are good moves **relative to a model of the opponent**.

Improving that model (understanding how the other thinks, what they have prepared, what they fear) is what separates the good player from the excellent one.

Von Neumann did not invent game theory for chess. He invented it to model the Cold War. But the two objects have the same skeleton: two rational actors, interdependent decisions, an outcome that depends on what each *believes* the other will do.

**After reading:** before your next long game, write one line on **the intentions hypothesis** you make about the opponent (aggressive, avoids complications, plays fast in blitz, etc.); confront it with the actual game afterwards.

---

## Frequently asked questions

### Are chess strictly a zero-sum game?

Yes, mathematically. The sum of payoffs (1 for a win, 0 for a loss) is constant whatever the result: one player's win is exactly the other's loss; a draw splits 0.5-0.5. That property is what makes minimax applicable without complication. "Matches" (sequences of games with tactical bonuses) are no longer strictly zero-sum, and that is precisely where repeated-game theory becomes interesting.

### What is the difference between minimax and Nash equilibrium in chess?

Minimax is a **computation technique**: it says how to find the best move assuming the opponent is optimal. The Nash equilibrium is a **state of the system**: a configuration where no player has an interest in deviating alone. In a two-player zero-sum game like chess, the minimax solution *coincides* with the Nash equilibrium (von Neumann's theorem, 1928). In more complex games (non-zero-sum, more than two players), the two concepts diverge.

### Is there a dominant strategy on the first move?

Empirically, **no**. Statistics from tens of millions of elite games show 1.e4, 1.d4, 1.c4 and 1.Nf3 as playable with similar advantages for White (~54-56% score). None *dominates* the others strictly. That suggests either that the "truth" of chess allows several equilibria at move 1, or that the human and machine calculation horizon cannot yet tell them apart.

### Why talk about "mixed strategies" if you always play the best move?

Because "the best move" depends on your model of the opponent. If you systematically play 1.e4, you give the opponent perfect information about your preparation: they can invest all their study time on your lines. Diversifying (40% 1.e4, 40% 1.d4, 20% 1.Nf3) dilutes their preparation effort. Beyond a certain level, the mixed strategy becomes a defensive investment in information.

### Can game theory predict who will win a game?

No, and that matters. It says that **under perfect play**, the result is determined. But perfect play exists neither for humans (cognitive limits) nor for machines (computational limits beyond 7-piece endgames). The theory predicts *asymptotic equilibria* (a stable Ruy Lopez over 200 years), not *individual outcomes*. For that, you have to model strength differences, preparation, fatigue, time of day - and there game theory hands off to statistics and psychology.

---

## Key takeaways

- Chess is a finite, zero-sum, two-player, perfect-information game, therefore analyzable through Zermelo (1913).
- A "truth" of the game already exists (White wins, Black wins, or draw under perfect play), but $10^{120}$ games make it inaccessible.
- Minimax = maximize for yourself assuming the other minimizes for you. That is what your brain does without knowing it.
- Alpha-beta pruning doubles the reachable depth: the reason Deep Blue beat Kasparov in 1997.
- The Nash equilibrium explains why some openings (the Ruy Lopez) cross centuries: nobody has an interest in deviating alone.
- **Elimination of dominated strategies** is what lets you calculate only 3-5 moves out of 35 without thinking: you intuitively dismiss what is strictly worse.
- In practice, information is never perfect: uncertainty is in the opponent's head, not on the board. That is where psychology replaces math.

### Sources and references

- **von Neumann, J., & Morgenstern, O.** *Theory of Games and Economic Behavior.* Princeton University Press, 1944. (The founding text of modern game theory.)
- **Nash, J.** [*Non-Cooperative Games.*](https://www.jstor.org/stable/1969529) Annals of Mathematics, 54(2), 286-295, 1951. (The formal introduction of the Nash equilibrium.)
- **Zermelo, E.** *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels.* Proceedings of the Fifth International Congress of Mathematicians, 1913. (The founding theorem on the solvability of finite games.)
- **Schaeffer, J., et al.** [*Checkers Is Solved.*](https://www.science.org/doi/10.1126/science.1144079) Science, 317(5844), 1518-1522, 2007. (The complete solution of checkers by computer.)
- **Shannon, C. E.** *Programming a Computer for Playing Chess.* Philosophical Magazine, Series 7, 41(314), 1950. (The estimate of the number of possible chess games.)
