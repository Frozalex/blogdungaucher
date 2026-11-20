---
title: "Nash Equilibrium and Chess Openings: Models and Limits"
excerpt: "Nash equilibrium provides a language for strategies, but a popular opening is not a theorem. Distinguish formal equilibrium, engine estimates and practical preparation."
seoTitle: "Nash Equilibrium and Openings: The Model and Its Limits"
seoDescription: "Nash, minimax and chess openings: distinguish mathematical equilibrium, engine evaluation and practical preparation without treating popularity as proof."
enSlug: "nash-equilibrium-openings"
faq:
  - question: "Is a popular opening a proven Nash equilibrium?"
    answer: "No. Popularity, an engine evaluation or a draw between champions does not prove an optimal strategy against every reply."
  - question: "Why represent positions with a graph?"
    answer: "Different move orders can reach the same position. Configuration graphs can also contain cycles; castling rights, en passant and history needed for draw rules must be specified."
  - question: "Does varying openings create a mixed equilibrium?"
    answer: "No. A distribution of choices is a mixed strategy within a defined model. Proving equilibrium also requires establishing that nobody benefits from deviating alone under the model’s payoffs."
  - question: "Does an equal evaluation prove a draw?"
    answer: "A limited-depth engine estimate is not enough. Proof must cover relevant legal replies and game-ending rules."
heroImageAlt: Two chess pieces leaning against each other in mutual balance.

---

Why do some openings remain in use after decades of analysis? Nash equilibrium provides a language for thinking about strategies, but does not turn a popular variation into a theorem.

“Nash graphs” here is a teaching connection, not the name of a standard theory proving the Sicilian or Berlin correct.

## What Nash defines

In *Non-Cooperative Games* (1951), John Nash describes a strategy profile in which no player can improve their payoff by changing strategy alone while the others keep theirs. The article spans pages 286–295, ten pages; it should not be confused with his short 1950 note.

A strategy specifies choices in situations within the game, not merely the first move’s name. The existence theorem for finite games allows mixed strategies; it does not automatically provide the optimal moves of a chess game.

## What that means at the board

In the usual zero-sum model, each side prefers winning to drawing and drawing to losing. Russell and Norvig’s minimax analysis searches for a strategy against the opponent’s best replies.

A line called “equal” by an engine expresses something different: an estimate with a method and search budget. A draw between champions is another kind of information again. Neither alone proves that every possible deviation has been covered.

You can speak metaphorically of a practical balance in preparation if you label it as such. If a novelty changes a line’s evaluation, our knowledge changed; a mathematically proven equilibrium is not refuted by a theoretical fashion.

## Game trees and position graphs

A tree keeps move sequences separate. A graph can merge sequences reaching the same position: transpositions. It must also specify what it calls a position.

Piece placement is not always enough. Side to move, castling rights and en passant can change legal moves. Applying all draw rules also requires historical information.

The configuration graph can contain cycles. Knights may leave and return to their starting squares. A tree retaining the entire game history does not confuse those occurrences. Calling every opening graph “acyclic” without qualification would therefore be misleading.

![What information are you representing?](/images/en/nash-03-graphe-transpositions.svg)

## Endgames and calculated values

Tablebases can provide exact values within their domain and conventions. Distinguish win/draw/loss, distance to mate and distance to resetting the move counter. Syzygy documentation emphasises draw rules: a table distance is not always a number of winning moves in every tournament situation.

That precision makes endgames useful for discussing models: which information describes the state, which rule ends the game and which quantity is calculated?

## Varying a repertoire: a practical decision

If you often face the same person, varying openings may make preparation less targeted. It does not prove that a 50%, 30%, 20% mix is a Nash equilibrium, or establish a universal five-hour study threshold for choosing a repertoire.

Examine the cost of each change: do you know the ensuing plans? Can you explain resulting positions? Are you gaining surprise at the cost of playing something you do not understand? These questions suffice to organise a practical choice.

## Sporting results and the model

A draw may or may not suit the tournament standings. That can change the preferences you want a model to represent. Define them before announcing a new equilibrium.

In a strictly zero-sum model, both players cannot simultaneously increase their payoff. Importing the prisoner’s dilemma or a collective Pareto improvement without qualification therefore confuses the analysis.

Further reading: [game theory](/en/blog/game-theory-in-chess/), [minimax](/en/blog/minimax-in-chess/) and [Zermelo](/en/blog/zermelo-paradox/).

## Build an opening-preparation game on four cards

Suppose two club players must privately decide what to study this evening. White has time to prepare either plan A or plan B. Black can study either response X or response Y. To make the mathematical question completely transparent, invent the following scores. If White studies A and Black chooses X, give White one point. If White studies A and Black chooses Y, give White minus one. Reverse the scores in the other row: B against X gives White minus one, and B against Y gives White one. Give Black the opposite score in every case. These numbers describe a teaching game on paper, not the expected score of any opening.

Can either player announce a single choice and expect the other to stick to a particular reply? Start in the upper left cell, where A meets X. Black can improve by changing to Y. In the upper right cell White can improve by switching to B. At B against Y, Black wants to switch to X, and at B against X, White wants to switch to A. Every cell gives at least one of the players a profitable change with the other's choice held fixed. There is no equilibrium in pure strategies here. You have checked all four possibilities instead of relying on the word “balanced”.

Let each player toss a fair coin privately. Against Black's equally likely responses, White's plan A earns one half of one point and one half of minus one point, for an average of zero. White's plan B also averages zero. Any mixture of the two therefore has the same expected result while Black continues to use that coin. By the same reasoning Black has nothing to gain by changing the mixing frequency while White keeps the fair coin. The two mixtures form an equilibrium. One actual play of the card game will still produce a winner and a loser; the zero is an expectation over choices, not the result that must be observed every evening.

## What changes when a player can watch the choice?

Repeat the experiment but let Black look at White's card before choosing the response. A fair coin no longer protects White: Black can choose Y after seeing A and X after seeing B. The numbers in the four cells did not change. The information available when choosing did. That detail is essential if you want to use the model to discuss openings. A player may have to prepare for several systems in private before the round, but does get to observe White's first move before replying at the board. A model of preparation and a model of play should show clearly which decision is hidden.

Change a different feature. Suppose White thinks A is easy to remember whereas B requires an evening of analysis that could have been spent resting. The original matrix assigned no value to that difference. If the player wants a model of preparation costs, those costs must enter the figures somehow. Simply announcing that the original coin no longer feels right doesn't invalidate the arithmetic. It tells you that the question the club player really cares about includes a variable the matrix left out. State what each point now means before searching for the new best responses.

## A transposition you can check without a database

Set up the starting position and play 1.Nf3 Nf6 2.Nc3 Nc6. Write down the occupied squares, whose turn it is and whether any castling rights have been lost. Set up again and play 1.Nc3 Nc6 2.Nf3 Nf6. The knights have reached the same collection of squares, White is to play, no pawn has moved and no capture has occurred. Even the number of half-moves since the last pawn move or capture agrees. An opening notebook can put the two paths on one page at this point. A list of move sequences still needs two entries to record how the page was reached.

This example explains something practical about preparation. If a database lists eighty games via the first path and twenty via the second, looking at only the first move order loses some evidence about what players do from the shared diagram. Conversely, attaching all hundred games to *each* path and then adding the totals counts some evidence twice. First decide whether you want to know how often an initial move order is chosen or how often a reply is played from the shared position. The same database can answer both questions if you count different things.

## Keep three columns in your repertoire notebook

For a variation you are considering, write separate entries for frequency, observed score and analytical assessment. Frequency tells you how often the move was played in the selected games. Observed score depends on the sample, the opponents, the colours and the time controls represented. An analytical assessment comes from studying possible replies, perhaps with an engine. A rare move may deserve preparation because it is good; a popular move can also deserve preparation because you will often face it even if you have found an effective reply.

Try the distinction on your own games. Perhaps one line has an excellent score in blitz because several opponents missed the same trick. Ask what happens if the opponent knows the trick and chooses the best defence you can find. If your position remains comfortable, record that reason independently of the score. If the line becomes awkward, write the saving resource down before deciding whether surprise is still worth the effort. Neither result has identified a Nash equilibrium, but both directly improve the usefulness of your preparation.

Finally, revisit those entries after the next tournament and change only the column for which you actually have new evidence. One more win changes the results column. A newly found defence changes the analysis column. Hearing that the local champion has adopted the system might change your estimate of how often you will meet it. Keeping the updates separate prevents a fashionable opening from acquiring an undeserved mathematical guarantee.

## Sources

- Nash, J. (1951). *Non-Cooperative Games*. Annals of Mathematics, 54(2), 286–295. [Article](https://irving.vassar.edu/faculty/gj/FTU/io/literature/Nash51.pdf).
- Russell, S., & Norvig, P. (undated online chapter). *Adversarial Search*. Artificial Intelligence: A Modern Approach. [Chapter](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Syzygy project (undated). *probetool: endgame-metric documentation*. GitHub. [Documentation](https://github.com/syzygy1/probetool).
