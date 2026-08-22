---
title: "Survivorship Bias in Chess: The Graveyard You Never See"
excerpt: >-
  Opening theory is built on the games that got published. Grandmaster advice comes from the people who
  became grandmasters. Out of 502,000 rated players, roughly 1,750 hold the title. Everything you learn
  comes from the survivors.
seoTitle: "Survivorship Bias in Chess: Openings, GM Advice and Prodigies"
seoDescription: >-
  Survivorship bias applied to chess: why opening theory, grandmaster advice and prodigy stories all
  describe a sample whose losers have disappeared.
enSlug: "survivorship-bias-in-chess"
draft: false
tags:
  - survivorship bias
  - cognitive biases
  - Abraham Wald
  - openings
  - improvement
  - statistics
  - chess
faq:
  - question: "What is survivorship bias?"
    answer: >-
      It's the error of drawing conclusions from only the items that made it through a filter, while
      forgetting the ones the filter removed, because those are invisible by construction. The classic
      illustration comes from statistician Abraham Wald's 1943 work on aircraft returning from missions:
      the hits you observe on the survivors show where a plane can absorb damage, not where it's
      vulnerable.
  - question: "How is opening theory biased by survivors?"
    answer: >-
      Because it's built on the games that enter the databases: essentially tournament games between
      rated players, published and annotated. Positions that lead nowhere don't produce famous games,
      so no analysis, so no theory. A line's absence from theory rarely means it was refuted. Usually
      it means nobody had a reason to publish it.
  - question: "Why does my gambit work so well if it's supposed to be dubious?"
    answer: >-
      Because you're observing a filtered sample. The games where the gambit produced a spectacular
      attack are memorable and get retold. The ones where your opponent accepted, gave the material
      back at the right moment and won a dull endgame don't get retold. The success rate you perceive
      is your memory's, not your database's.
  - question: "Does the Polgár sisters case prove that training is enough?"
    answer: >-
      No, for two reasons. First because a protocol with no control group and no replication doesn't
      support a conclusion. Second because the result itself is more nuanced than the retellings
      suggest: Robert Howard showed in 2011 that despite comparable training, the three sisters did not
      reach the same level. Every family that attempted something similar without success never got a
      book written about them.
  - question: "How do you protect yourself from survivorship bias while improving at chess?"
    answer: >-
      By systematically seeking the complete sample rather than the remarkable cases. Concretely: check
      the real percentage in a database rather than trusting your impression, keep a log of all your
      games and not just the striking ones, and ask of every piece of advice from a strong player how
      many people applied it without it working.
---

There's always someone at the club who's been playing the same gambit for fifteen years. He defends it with quiet conviction: "objectively it's dubious, but at club level it works every time."

And he has evidence. He shows you the game where his opponent took the pawn, then the second one, and got mated on move 19. Another where the black king never managed to castle. A third, magnificent, with a rook sacrifice.

These are real games. They really happened. And yet his conclusion is wrong, for a reason that has nothing to do with chess and everything to do with what it's possible to tell a story about.

## The Planes That Came Back

The story has become the universal shorthand for this bias, and it deserves to be told properly, because the version in circulation is itself distorted.

During the Second World War, Columbia University's [Statistical Research Group](https://en.wikipedia.org/wiki/Survivorship_bias) worked for the American military. Among its members was a Hungarian-born mathematician, [Abraham Wald](https://en.wikipedia.org/wiki/Abraham_Wald).

The problem was concrete: bombers were returning from missions riddled with hits. Armour costs weight, therefore fuel and payload. You can only put it on part of the aircraft. Where?

The intuitive answer is to record the distribution of hits on the returning planes and reinforce the most damaged areas. That's reasonable. It's wrong.

In 1943, Wald produced a series of technical memoranda whose title announces the reasoning: a method of estimating an aircraft's vulnerability from the damage observed on survivors. His point is that **the available sample isn't the relevant sample**. The planes being studied are the ones that came back. If they came back with holes in the wings, that's precisely because holes in the wings don't stop a plane from coming back. The undamaged areas on the survivors are the ones where a hit was fatal, and those aircraft aren't in the data.

### The Legend Is Itself a Survivor

A small irony worth flagging, because it's instructive.

The image everyone associates with this story, a bomber silhouette covered in red dots captioned "armour the empty areas," is **a modern illustration**. Wald never drew it. The punchy line attributed to him, "put the armour where there are no holes," appears in none of his writings: his actual work consisted of calculating survival probabilities by region, considerably less spectacular and considerably more rigorous.

His memoranda stayed classified until 1980, and were brought to public attention by Marc Mangel and Francisco Samaniego in the *Journal of the American Statistical Association* in 1984. The American Mathematical Society notes that several of the tastiest details of the anecdote are unverifiable.

Put differently: the most famous story about survivorship bias survived by shedding everything that made it complicated. It passed through the filter of repetition because it was tellable. That's exactly the mechanism it describes.

## What the Filter Removes in Chess

The reasoning transposes anywhere a filter separates what you observe from what existed. In chess there are at least four filters, and the first is enormous.

### 1. Opening Theory Is a Corpus of Survivors

This is the most important point in the article, and the least often stated.

Your knowledge of openings comes from somewhere: books, videos, databases. Ask yourself what gets into those sources.

A game enters a database because it was played in an official tournament between rated players, transmitted to a federation, and integrated. A line becomes "theoretical" because someone played it at a level that makes the game interesting, then analysed, published and discussed it.

So the filter is double: **the level of the players** and **the interest of the game**.

Direct consequence: theory describes the paths strong players had a reason to take, and about which somebody had a reason to write. It does not describe the space of playable moves. A line absent from theory has rarely been refuted. Usually nobody had a motive to publish it, which is not remotely the same thing.

That's why openings considered dead for a century periodically come back to life when a strong player decides to look at them seriously. They weren't bad. They were absent.

The engine era added a second filter on top of the first. Lines refuted by computer analysis disappear from repertoires, therefore from games, therefore from databases. Theory converges on what survived examination, which is excellent for soundness and questionable for diversity: it describes an ever-narrower space ever more accurately.

### 2. The Advice Comes From Those Who Made It

In May 2025, FIDE listed roughly **502,000 players** on its standard rating list, and a little over 1.6 million rated players across all time controls. The number of grandmasters is estimated at between **1,730 and 1,800**, of whom **700 to 1,000 are active**.

Do the ratio. The grandmaster title covers something like **0.35%** of players rated in standard, and if you count only active ones, you drop below 0.2%.

Now think about where the advice you receive comes from. Method books are written by strong players. Training videos are produced by strong players. "How I improved" interviews are given by people whose improvement worked.

This isn't a scandal, it's even normal: you don't ask someone who failed how to succeed. But the resulting corpus has an awkward property. **You only have the winning branch.** If ten thousand players applied the same method and fifteen became strong, those fifteen are the ones who'll write the book, and they'll honestly describe what they did. Nothing in their account lets you distinguish what caused their success from what merely accompanied it.

So the question to ask of every piece of advice isn't "did it work for him," but **"how many people did the same thing without it working"**. That information almost never exists. Its absence is the bias.

### 3. Prodigies, and the Family Nobody Mentioned

The Polgár sisters are the most cited example. László Polgár claimed that genius can be trained, taught his three daughters chess from early childhood, and all three became international-level players.

Two problems, in this order.

The first is statistical. A protocol with three subjects, no control group and no replication doesn't support a conclusion. Polgár never reproduced the experiment. And above all: **how many families attempted something comparable with no notable result?** Nobody knows, and nobody ever will, because that kind of failure produces neither a book nor a documentary. It produces a child who quit chess at fourteen. Those are the planes that didn't come back.

The second problem is more interesting, because it concerns the result itself. In 2011, researcher Robert Howard published an analysis of the case in *Cognitive Development* showing that **despite comparable training, the three sisters did not reach the same level**. Judit was world number 8; Sofia, a strong player, didn't follow the same trajectory. With the protocol held equal, the results diverge. His conclusion: chess expertise doesn't depend on practice alone.

The underlying nature-versus-nurture debate is covered in our article on [genetics and talent in chess](/en/blog/echecs-et-genetique/). What concerns us here is narrower: even the example invoked to prove the thesis doesn't prove it, and the sample that would settle the question is invisible by construction.

### 4. Your Own Gambit

Back to the player from the opening.

He isn't making anything up. His three games are real. The filter isn't in the facts, it's in **what's memorable**.

A game where the gambit produces a devastating attack and mate on move 19 is a story. It gets told, it gets shown, you remember it for ten years. A game where the opponent accepts the pawn, returns it cleanly at the right moment, trades queens and wins a rook endgame in fifty moves is not a story. It's boring, it doesn't get told, and it's forgotten within a week.

The success rate he perceives is the success rate **of his memories**. And his memories were selected on a criterion that has nothing to do with effectiveness: tellability.

And the remedy here is trivial. His game database contains the exact answer. He just has to filter on the opening and read the percentage. It's the only one of the four filters you can lift in thirty seconds, which is probably why so few people lift it.

## Four Reflexes

**Ask for the denominator.** Faced with any claim of success, the useful question isn't "how many succeeded" but "out of how many." A number without a denominator isn't a statistic, it's an anecdote.

**Consult the database, not your memory.** For anything concerning your own results by opening, by colour, by time control, the data exists and it's free. Your memory isn't a sample, it's an editorial selection.

**Keep the complete log.** Record all your games, including the insipid draws and the uneventful losses. A notebook containing only the striking games ends up describing a player who doesn't exist. That's the basic principle of [useful game analysis](/en/blog/analyser-ses-parties/).

**Look for the absent.** Every time you're shown a successful trajectory, ask what the same approach would look like for someone it failed, and why you'd never hear about that person. The answer is almost always: because there'd be nothing to tell.

## What to Take Away

Survivorship bias isn't a reasoning error, it's a sampling error. The reasoning can be impeccable: if the data was filtered before it arrived, the conclusion will be wrong anyway.

In chess the filter is everywhere and it's particularly discreet, because what got removed left no trace. Opening theory describes the published paths. Training methods come from the 0.35% who got the title. Prodigy stories are told by the families where it worked. Your favourite gambit is evaluated by your most tellable memories.

None of these sources is lying. All of them faithfully describe the planes that came back.

**After reading:** open your game database, filter on your favourite opening, and read your real percentage. Compare it to the one you'd have quoted from memory. The gap is the bias, measured on you.

---

*This article is part of a series on psychology applied to chess. See also [the Dunning-Kruger effect in chess](/en/blog/effet-dunning-kruger-aux-echecs/) and [cognitive dissonance in chess](/en/blog/dissonance-cognitive-aux-echecs/).*

## Sources

- Wald, A. (1943). *A Method of Estimating Plane Vulnerability Based on Damage of Survivors*. Statistical Research Group, Columbia University. Published in 1980 by the Defense Technical Information Center.
- Mangel, M., & Samaniego, F. J. (1984). Abraham Wald's work on aircraft survivability. *Journal of the American Statistical Association*, 79(386), 259-267.
- Howard, R. W. (2011). Does high-level intellectual performance depend on practice alone? Debunking the Polgár sisters case. *Cognitive Development*, 26(3), 196-202.
- ChessBase (2025). *Chess statistics today*. FIDE rating list data, May 2025.
