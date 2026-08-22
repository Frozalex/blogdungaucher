---
title: "Theory of Mind in Chess: A Trap Is a False Belief"
excerpt: >-
  Setting a trap means representing what your opponent believes, and knowing that belief is wrong.
  That's exactly the skill psychologists test in four-year-olds. It's also the one thing chess engines
  cannot do.
seoTitle: "Theory of Mind in Chess: Modelling What Your Opponent Believes"
seoDescription: >-
  What theory of mind is, what the false-belief task measures, and why setting a trap in chess is a
  cognitive act no engine can perform.
enSlug: "theory-of-mind-in-chess"
draft: false
tags:
  - theory of mind
  - false belief
  - traps
  - Premack
  - chess engines
  - social cognition
  - chess
faq:
  - question: "What is theory of mind?"
    answer: >-
      It's the ability to attribute mental states to yourself and to others, such as beliefs,
      intentions or knowledge. The term comes from a paper by Premack and Woodruff published in 1978.
      We call it a theory because those states aren't directly observable and have to be inferred in
      order to predict behaviour.
  - question: "What is the false-belief task?"
    answer: >-
      A test designed by Wimmer and Perner in 1983, popularized by Baron-Cohen, Leslie and Frith in
      1985 as the Sally-Anne test. An object is moved while a character is absent, and the child is
      asked where that character will look for it. Answering correctly requires representing a belief
      that differs from reality. Children generally manage it around age four.
  - question: "How does setting a trap in chess involve this skill?"
    answer: >-
      Because a trap means playing a move whose value depends on what your opponent doesn't see. You
      have to represent his state of knowledge, know that it differs from yours, and act on that gap.
      Structurally it's the same operation as the false-belief task.
  - question: "Why can't engines set traps?"
    answer: >-
      Because they have no model of the opponent. A classical engine evaluates positions assuming
      optimal play on the other side, which amounts to treating the opponent as though he sees
      everything. So it plays the objectively best move, never the move that would exploit a
      particular gap.
  - question: "Is theory of mind a scientifically stable concept?"
    answer: >-
      The explicit side reasonably is: verbal false-belief tasks have given consistent results for
      forty years. The implicit side, supposed to show the same competence in infants, has serious
      replication problems, and there is no consensus today about what those tasks measure.
---

Club position, your opponent is rated 200 points below you. You can play the objectively best move, which leads to a winning but long and technical endgame.

Or you can play a slightly worse move that leaves an apparent capture available. If he takes it, he loses immediately. If he doesn't, you've given up half a pawn of evaluation.

You play the second one, and he falls for it.

What you just did is more remarkable than it looks. You didn't calculate a variation: you calculated **what he was going to believe**. And you acted on a gap between his state of knowledge and yours.

That's a precise cognitive operation, one we test in four-year-olds, and one no chess engine can perform.

## A Question Asked About a Chimpanzee

The term appears in 1978, in a paper by David Premack and Guy Woodruff published in *Behavioral and Brain Sciences*, under a title shaped as a question: does the chimpanzee have a theory of mind?

Their definition has stuck: **an individual has a theory of mind if he attributes mental states to himself and to others**.

They explain why the word "theory" is appropriate. Those states, beliefs, intentions, desires, knowledge, **are not directly observable**. You can't see what someone believes. You deduce it through a system of inferences, and that system lets you make predictions about their behaviour. So it really is a theory in the scientific sense: a model of invisible entities that predicts observables.

Their protocol involved showing a chimpanzee filmed scenes of a human struggling with a problem, then offering photographs, one of which depicted the solution. What those results actually demonstrate is still debated forty-five years later.

## The Test That Structured the Field

It was in children that the question found its instrument.

In 1983, Heinz Wimmer and Josef Perner designed a formidably simple task. A child is told the story of Maxi, who puts his chocolate in a green cupboard and then leaves the room. While he's gone, his mother moves the chocolate to the blue cupboard.

Then the question: **where will Maxi look for his chocolate when he comes back?**

The correct answer is the green cupboard. It requires setting aside what you yourself know in order to represent what Maxi believes, while knowing that belief is false.

In 1985, Simon Baron-Cohen, Alan Leslie and Uta Frith published a variant that became more famous, the Sally-Anne test, with a marble moved from a basket to a box.

The result has been consistent for forty years: children generally start answering correctly **around age four**. Before that, they say the blue cupboard, meaning the place the chocolate actually is. They can't yet separate what they know from what someone else believes.

### The Part That Doesn't Hold

The qualification has to be stated, because it matters.

The **explicit** side, the verbal tasks described above, is reasonably solid and has replicated for decades.

The **implicit** side is much less so. From the 2000s onward, work argued that much younger infants already showed an understanding of false belief, measured by looking times rather than verbal answers. Those results had enormous impact.

They have since run into serious trouble. The initial samples were small, large-scale replication attempts have failed, and there is today **no consensus** on what these tasks actually measure. Slight differences in procedure change the results.

Put differently: that adults and children over four represent other people's beliefs is well established. That the capacity is present in the first year is not.

## What This Changes at the Board

Here's why the concept deserves an article, even though it looks remote from the game.

### A Trap Is a False-Belief Operation

Go back to the structure of the move that opened this article.

You know the capture loses. You also know that he doesn't know. You play a move **whose value depends entirely on that gap**.

It's structurally identical to the Maxi task. You have to represent a state of knowledge different from your own, know that it's mistaken, and predict behaviour from that representation.

And this isn't a figure of speech. A player incapable of that operation would always play the objectively best move, which, at equal strength, is an inferior practical strategy.

### What the Engine Cannot Do

This is the most important point in the article.

A classical chess engine evaluates positions assuming **optimal play from the opponent**. That's the logic of minimax, detailed in our article on [minimax in chess](/en/blog/minimax-aux-echecs/). In practice it amounts to treating your opponent as though he sees everything.

So an engine has **no model of the opponent**. It doesn't know who is sitting across the board, what that person knows, what they habitually miss, or what they're currently overlooking. It cannot form the thought "he won't see that."

Direct consequence: an engine never sets a trap. It plays the best move. If a trap happens to be the best move, it plays it, but for other reasons.

Which gives the human player a competence the machine lacks, and probably the only one left in practical play. We are irremediably inferior at evaluation and calculation. We remain the only ones able to play **against someone** rather than against a position.

It's also a reason to qualify the relationship of authority to the engine described in our article on [obedience to authority in chess](/en/blog/obeissance-a-l-autorite-aux-echecs/): on one specific point, its recommendation isn't the best practical decision, because it answers a different question.

### The Distinction From Mirror Neurons

A clarification, because the two subjects are neighbours and often confused.

Mirror neurons, covered in our article on [mirror neurons in chess](/en/blog/neurones-miroirs-aux-echecs/), concern **motor simulation**: understanding an action by reproducing it internally. That's a low-level mechanism, largely automatic.

Theory of mind concerns the attribution of **beliefs**, and specifically **false** ones. It requires holding two incompatible representations of the world simultaneously, the true one and the other person's, without confusing them.

Simulating a gesture and representing someone else's error are not the same operation.

## The Uses, and Their Limits

**Choosing a variation against a known opponent.** Taking someone into a structure he dislikes is a decision based on a model of his mind, not on the position.

**Calculating the practical move.** In a lost position, the objectively best move is almost never the best choice. You want the one that maximizes the chance of an opponent error, which requires knowing what's hard for a human to see.

**The draw offer.** It's entirely a theory-of-mind operation: what will he believe about my position when he sees me offer? That's also what makes it manipulable, as our article on [emotional manipulation in chess](/en/blog/manipulation-emotionnelle-aux-echecs/) describes.

**And the limit, which is severe.** Modelling someone else's mind is expensive, and the main source of error is **filling it with your own**. Believing he saw what you saw, or that he's unaware of what you're unaware of, is the mechanism of projection, the subject of the next article in this series. It's also why this reasoning is reserved for moments where it adds something: in a clear position, the objectively best move remains the best choice.

## Four Practices

**Distinguish the best move from the best choice.** These are two different questions, and your engine only handles one of them. In a risk-free position they coincide. In a lost or very sharp position they diverge.

**Build an explicit model of your regular opponents.** Not impressions, observations: which structures he avoids, what kind of tactic he misses, how he handles the clock. Three lines per player is enough, and it's worth more than ten moves of theory.

**Separate your information from his.** Before playing a move whose effect depends on his reaction, ask the question in Maxi form: what does *he* know, at this precise moment? Without the answer, you're playing against yourself.

**Don't use it against stronger players.** A trap only works if the model is correct. Against a clearly better player, your model of his mind is wrong, and the inferior move stays inferior.

## What to Take Away

Theory of mind is the ability to attribute invisible mental states to others in order to predict their behaviour. It's measured by the false-belief task, which children generally pass around age four, and whose implicit infant version is now contested for want of convincing replications.

In chess, this competence isn't a decorative extra: it's **the basis of practical play**. Setting a trap, choosing a variation against a given opponent, playing a lost position to maximize the chance of error, all of it consists of acting on the gap between what you know and what the other player believes.

And it's precisely what the engine doesn't do, since it assumes perfect play across the board. On that point, and probably on that point alone, you have a capacity it doesn't.

**After reading:** before your next game against an opponent you know, write three lines about what he habitually misses. That's a model of his mind, and it's the one piece of information your engine will never have.

---

*This article is part of a series on psychology applied to chess. The next one covers projection, meaning what happens when this model gets filled in with your own content. See also [mirror neurons in chess](/en/blog/neurones-miroirs-aux-echecs/) and [minimax in chess](/en/blog/minimax-aux-echecs/).*

## Sources

- Premack, D., & Woodruff, G. (1978). Does the chimpanzee have a theory of mind? *Behavioral and Brain Sciences*, 1(4), 515-526.
- Wimmer, H., & Perner, J. (1983). Beliefs about beliefs: Representation and constraining function of wrong beliefs in young children's understanding of deception. *Cognition*, 13(1), 103-128.
- Baron-Cohen, S., Leslie, A. M., & Frith, U. (1985). Does the autistic child have a "theory of mind"? *Cognition*, 21(1), 37-46.
- Onishi, K. H., & Baillargeon, R. (2005). Do 15-month-old infants understand false beliefs? *Science*, 308(5719), 255-258.
- Kulke, L., & Rakoczy, H. (2018). Implicit theory of mind: An overview of current replications and non-replications. *Data in Brief*, 16, 101-104.
