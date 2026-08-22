---
title: "Confirmation Bias in Chess: You Calculate Your Plan, Never Its Refutation"
excerpt: >-
  Eight minutes on a combination, and he plays a defense you never even looked at. That isn't a shortage
  of time. A study run on chess players shows that masters try to refute their own plan, while novices
  try to confirm it.
tags:
  - confirmation bias
  - Wason
  - falsification
  - calculation
  - expertise
  - cognitive biases
  - chess
seoTitle: "Confirmation Bias in Chess: Refute Your Own Plan"
seoDescription: >-
  Confirmation bias applied to calculation in chess. What the Wason task reveals, and why masters refute
  their own plans where novices confirm them.
enSlug: "confirmation-bias-in-chess"
draft: false
faq:
  - question: "What is confirmation bias?"
    answer: >-
      It's the tendency to search for, interpret and remember information in ways that support what you
      already believe, rather than putting it to the test. Peter Wason demonstrated it in 1960 with a
      task that became famous, where participants tested their hypothesis with examples designed to
      confirm it instead of looking for examples that would invalidate it.
  - question: "How does confirmation bias show up during calculation?"
    answer: >-
      As an asymmetry in the tree of variations. You calculate at length the continuation that makes your
      plan brilliant, and far less the opponent's replies that destroy it. The tree isn't too short, it's
      unbalanced: deep on the side that proves you right, shallow on the other.
  - question: "Do strong players escape confirmation bias?"
    answer: >-
      Partly, and that's an important result. Cowley and Byrne showed in 2004 that masters more readily
      generated sequences refuting their own plans, where novices tended to confirm them. That suggests
      the capacity to falsify isn't a personality trait but a skill tied to expertise in a domain.
  - question: "How do I train myself to refute my own plans?"
    answer: >-
      With an explicit rule rather than good intentions. Before playing a move you've calculated, ask
      yourself the question: what reply would make this move bad? Then look for it for a fixed length of
      time. What matters is that the search is mandatory and bounded, not that it's sincere: sincerity is
      rarely available when the target is yourself.
  - question: "Does the analysis engine help correct this bias?"
    answer: >-
      Only partly. It tells you your move was bad, but it doesn't tell you that you never looked at the
      refutation. And that's the information that counts. To retrieve it, you have to write down before
      the analysis what you actually calculated, otherwise memory will reconstruct a version where you
      saw everything.
---

You spot it on move 24. A combination. Knight sacrifice, discovered check, the queen falls.

You calculate for eight minutes. You check the move order. You extend it to move 31 to make sure the endgame is winning. You play it.

He answers in forty seconds with a move you hadn't looked at. Not a hard move: a move you'd have found in thirty seconds if you'd been looking for it. But you weren't looking for it.

That's the subject. Your problem wasn't time, you spent eight minutes. Your problem is **the direction those eight minutes went**.

## Wason's Demonstration

In 1960, the British psychologist [Peter Wason](https://en.wikipedia.org/wiki/Peter_Cathcart_Wason) published an experiment of disarming simplicity.

You're given three numbers: **2, 4, 6**. They follow a rule the experimenter has in mind. Your job is to find that rule. To do it you can propose as many triplets as you like, and each time you'll only be told whether your triplet fits the rule or not. When you're sure, you announce it.

What almost every participant does looks perfectly rational. They form a hypothesis, typically "even numbers going up by two." Then they test: 8, 10, 12. Yes. 20, 22, 24. Yes. 100, 102, 104. Yes.

Three confirmations. They announce their rule confidently. They're wrong.

The rule was **"three numbers in increasing order."** Much broader. And the reason they didn't find it is cruel in its simplicity: their tests could reveal nothing. Every triplet they chose was compatible with their hypothesis. A positive answer was guaranteed in advance, so it carried no information.

The only useful test would have been to try something like **1, 2, 3**, or even **3, 17, 42**. A triplet their own hypothesis would reject. A "yes" would have immediately demolished the hypothesis and moved the search forward.

Wason extended this work in 1968 with the selection task, more famous still, where the overwhelming majority of participants turn over the cards that could confirm a rule rather than the ones that could disprove it.

In 1998, Raymond Nickerson devoted a review to the subject that became the standard reference, in the *Review of General Psychology*, and his conclusion is broad: this bias runs through science, medicine, the justice system and everyday life.

## The Shape It Takes at the Board

Go back to your combination, and look at how those eight minutes were distributed.

You calculated: I play Nxf7, he recaptures Kxf7, I have Qh5+, he has to play Kg8, and then Bxh7+ wins the queen. Every step was checked. The line is correct. You even extended it.

Now count the time spent on **his other replies**. On what happens if he doesn't recapture. On the in-between move that gives him a check before recapturing. On the defense that gives up material but wrecks your coordination.

Probably a few seconds, or nothing.

Your tree of variations wasn't too short. It was **unbalanced**. Deep, precise and careful on the side that proves you right. Almost nonexistent on the side that would contradict you. And that's exactly Wason's 8-10-12 triplet: a test that could only produce a confirmation.

Two mechanisms make this especially stubborn in chess.

**Investment.** The more you've calculated an idea, the more it costs you to abandon it. After six minutes on a combination, the brain stops asking whether it's good: it asks how to make it work. That's the justification mechanism described in our article on [cognitive dissonance in chess](/en/blog/dissonance-cognitive-aux-echecs/).

**Beauty.** A combination is aesthetically satisfying. The pleasure it provides is a reward received **before** you know whether it works, and that reward skews the examination that follows. Ugly ideas get examined more honestly than beautiful ones.

## The Result That Changes Everything

Here's the point that justifies this article on its own, and it comes from a study run directly on chess players.

In 2004, Michelle Cowley and Ruth Byrne, of Trinity College Dublin, presented work titled "Chess masters' hypothesis testing" at the annual conference of the Cognitive Science Society. Their question: does confirmation bias survive expertise?

The protocol asks players of different strengths to formulate a plan for a position, then generate the move sequences that would let them evaluate it.

Result: **masters more readily generate sequences that refute their own plan. Novices tend to confirm it.**

Masters are also better at spotting the precise opponent move that invalidates a hypothesis. The authors offer an explanation: access to a large repertoire of knowledge lets you consider more possible moves, for yourself as well as for the opponent, which makes refutation materially available.

### Why This Matters

That result corrects a received idea you run into everywhere, including in our own overview of the [5 cognitive biases that make you blunder](/en/blog/5-biais-cognitifs-blunder/), where it says this bias affects novices and experts alike. Within a domain of expertise, that's not what Cowley and Byrne show.

And the implication is optimistic. If masters refuted better because they were temperamentally more skeptical, there'd be nothing to be done. But the explanation on offer is different: they refute better **because they know more moves**. Falsification isn't a virtue, it's a consequence of the repertoire.

The authors even suggest that this capacity might be a component of what expertise is. Not finding the right idea faster, but eliminating the bad ones faster.

Which has a direct practical consequence: **working on your tactical patterns doesn't just improve your ability to find, it improves your ability to doubt**. You can't look for a refutation whose shape you've never encountered.

## Four Protocols

Clear-sightedness through good intentions doesn't work here. You need rules you can apply with a clock running.

### 1. The Mandatory Question, With a Time Limit

Before playing a move you've calculated for more than two minutes, one question: **what reply would make this move bad?**

Two details matter more than the question itself. It has to be **mandatory**, triggered by a mechanical criterion like calculation time, not by your feeling of uncertainty, which is precisely what the bias distorts. And it has to be **bounded**: one minute, no more. A search with no limit won't happen.

You're not trying to be honest with yourself, which is hard. You're triggering a procedure, which is easy.

### 2. Switch Chairs

The most effective method, and the least practiced.

Don't look for "the flaws in my plan," a phrasing that leaves you owning the plan. Ask yourself: **if I had his pieces, what would I play now?**

Changing the point of view does far more than changing the intention. From his chair, your combination is no longer your idea to defend: it's a threat to parry. And parrying a threat is a task you're far better at than criticizing your own work.

### 3. The Mandatory Candidate

Before calculating anything, list **three** candidate moves. Not one. Three.

The rule comes from Kotov's method, but here it serves a precise function: it stops you from entering the calculation with a single hypothesis already installed. Wason showed that the problem is born the moment the hypothesis becomes singular, because all the remaining work then organizes itself around it.

### 4. Write It Down Before You Analyze

This one is about the post-mortem, and it's the only way to measure your own bias.

When you analyze with the engine, you learn that your move 24 was bad. You don't learn that **you never looked at the refutation**. And that's the information with value, because it's about your process, not about the position.

The only way to preserve it: write down, during or just after the game, what you actually calculated. Without that note, your memory will reconstruct a version where you did consider his reply but misevaluated the follow-up. That's almost never true, and it's the subject of an upcoming article in this series on reconstructive memory. The general method is laid out in our guide on [analyzing your games](/en/blog/analyser-ses-parties/).

## Key Takeaways

Confirmation bias doesn't make you calculate less. It makes you calculate **in a single direction**. Wason showed it in 1960 with three numbers: participants tested their hypothesis with examples incapable of disproving it, and declared themselves certain at the end of an empty demonstration.

In chess, that produces an asymmetrical tree of variations. Eight minutes on the side that proves you right, a few seconds on the other. And two aggravating factors specific to the game: the time already invested in the idea, and the aesthetic pleasure it gives before it's even been checked.

The good news comes from a study run on players. Masters refute their own plans better than novices, and probably because they know more moves, not because they're naturally more lucid. The ability to doubt yourself, within a domain, is bought with knowledge of that domain.

Put another way: the question "what would show me I'm wrong" only has value if you have the means to answer it. The rest of the work is what gets you those means.

**After reading:** in your next game, impose the rule on yourself just once. One move calculated for more than two minutes, one mandatory minute looking for the refutation, from your opponent's chair. Once is enough to see how much turns up.

---

*This article is part of a series on psychology applied to chess. See also [the Dunning-Kruger effect in chess](/en/blog/effet-dunning-kruger-aux-echecs/), [cognitive dissonance in chess](/en/blog/dissonance-cognitive-aux-echecs/) and [survivorship bias in chess](/en/blog/biais-du-survivant-aux-echecs/).*

## Sources

- Wason, P. C. (1960). On the failure to eliminate hypotheses in a conceptual task. *Quarterly Journal of Experimental Psychology*, 12(3), 129-140.
- Wason, P. C. (1968). Reasoning about a rule. *Quarterly Journal of Experimental Psychology*, 20(3), 273-281.
- Nickerson, R. S. (1998). Confirmation bias : A ubiquitous phenomenon in many guises. *Review of General Psychology*, 2(2), 175-220.
- Cowley, M., & Byrne, R. M. J. (2004). Chess masters' hypothesis testing. In *Proceedings of the 26th Annual Conference of the Cognitive Science Society*, 705-710.
