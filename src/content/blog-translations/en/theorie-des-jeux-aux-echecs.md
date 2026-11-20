---
heroImageAlt: An hourglass whose sand consists of tiny chess pieces passing from
  one bulb to the other.
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

## Resolve the smallest useful game tree by hand

Give White two legal plans in an imaginary position. Call them Open File and Trade Queens. After Open File, Black may choose a counterattack or passive defence. In our deliberately small tree the counterattack ends in a white loss, while passive defence ends in a white win. After Trade Queens, Black can choose either of two endings. One ends in a draw and the other in a white win. These terminal results are assumptions of the example; they have not been generated from a chess engine. Use one point for a white win, half a point for a draw and zero for a loss.

Start at the bottom under Open File. Which outcome should White use when comparing plans against the strongest defence? Black can choose the counterattack, and that leaves White with zero. The win following passive defence is real inside the example, but White cannot force Black to choose it. Do the same under Trade Queens. Here the best defence gives Black a draw, leaving White half a point. Return to the root. White can choose between a guaranteed zero and a guaranteed half. The minimax choice in this tree is Trade Queens. The calculation never needed to know which plan sounds more ambitious or which line produces the prettiest finish.

Now erase one of the replies. If the counterattack was missing from your original analysis, Open File would have appeared to win. Adding it changes your answer dramatically even though you have not changed the rules or the players' objectives. This is a useful way to read annotations such as “forced” or “wins by force”. Ask which replies were considered, why the unlisted replies are irrelevant and whether a forcing-looking move might actually permit a quiet defensive answer. A guarantee in the little tree is only as complete as the branches you had grounds to include.

## Put habits into a separate calculation

What if your actual opponent habitually defends passively? You may want a prediction about that player in addition to the worst-case result. Make the assumption explicit: suppose you estimate a three-in-four chance of passive defence against Open File and a one-in-four chance of the counterattack. The expected score under those invented assumptions is three quarters of a point. Suppose also that you expect Black to reach the drawing ending every time after Trade Queens. That still gives half a point. Under this second question Open File comes out ahead. You haven't discovered an error in minimax; you have introduced information about the expected reply and changed the criterion used to rank the plans.

Ask how far the estimate can change before the preference reverses. If Open File wins after passive defence and loses after the counterattack, its expected score is just the probability you assign to passive defence. Once that falls below one half, Trade Queens has the higher expected score in this particular example. At one half the expected scores tie, while the possible outcomes remain very different. That threshold is a property of the numbers we invented. To use it in practice you would need evidence about the player, the position and the time available to find the counterattack.

A thin notebook sample can give a misleading impression of precision. Three missed tactics in a rapid event are weak grounds for claiming the opponent will miss the same idea in a slow game next month. They may have studied the weakness since. Their previous positions may also have contained fewer alternative checks, or their clock may have been running short. Show these limitations by writing the worst-case result beside the expected result in your notes. You can then say both “I believe the trap is attractive in this pairing” and “if Black sees the defence, I risk losing.”

## What if only a win qualifies?

Imagine that this is the last round and White must win to qualify for the final. On a second sheet, give qualification one and elimination zero. With the rankings in our example a draw now has the same consequence for qualification as a loss. It still earns half a point on the tournament score sheet. Those two entries refer to different objectives. Against Black's best defence neither plan guarantees qualification. If you change the utility of the draw in the calculation, make sure you have also stated what Black wants; assuming identical tournament incentives for both sides may be wrong.

This matters when listening to two strong players argue about a practical decision. One might prefer a safe draw because it secures a team match. The other might reject it because the team already needs a full point. Before deciding which player understands the position better, compare the results they are trying to achieve. It is entirely possible for them to agree on every variation and still recommend different choices in different match situations.

## A question to take to your next analysis session

Pick one critical position and give a friend an incomplete tree to challenge. Write your candidate moves on the left and your predicted replies on the right, with a blank row under each. Ask the friend to fill in the row that would most damage your recommendation. If they find one, update the result for that branch before asking a computer for a score. Keep your initial prediction on the page so that you can see what changed. Did the new reply refute a tactic, alter your estimate of what the opponent would choose, or expose a disagreement about the value of a draw? Those are three different discoveries, and each suggests a different lesson to carry into the next game.

Before filing the diagram, add the one assumption on which you are least confident. When you revisit the position with a stronger player, that assumption gives them a concrete place to challenge your decision.

## Sources

- Russell, S. and Norvig, P. (undated), *Adversarial Search*, authors’ textbook chapter, [text](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Nash, J. F. (1951), *Non-Cooperative Games*, Annals of Mathematics, 54(2), 286–295, [original article](https://irving.vassar.edu/faculty/gj/FTU/io/literature/Nash51.pdf).
