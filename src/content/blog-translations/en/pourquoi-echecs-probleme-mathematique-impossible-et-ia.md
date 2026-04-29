You have already lived this paradox: people sell you [chess](https://en.wikipedia.org/wiki/Chess) as cosmically complex, a game where each player traces long-term strategy; then you open an app, play a reasonable move, and the engine corrects you and explains a line you could never find alone.

So what? Can everything really be reduced to formulas? Is this game a mathematical problem that maths and computing only partly answer, or a story we tell ourselves to sound deep? The answer has two parts: this discipline cannot be handled by brute force over the entire space of games, yet it becomes playable at a superhuman level once you accept measuring reality with programs that combine search, evaluation, pruning, and today learning on very powerful machines.

![Diagram of an 8×8 board, chess and discrete configurations](/images/echecs-ia-01-plateau.svg)

The truth is more interesting than the myth: no finite list of moves "closes" the game like a sealed formal statement, yet programs regularly beat the strongest human players because they do not seek absolute perfection, only a good enough decision against a real opponent.

## The board from the inside: a state graph, not chaos

For a mathematician or computer scientist [chess](https://en.wikipedia.org/wiki/Chess) offers a rare quality: the rules are exact, public, and the game is deterministic. A [knight](https://en.wikipedia.org/wiki/Knight_(chess)) always moves in an L, a bishop stays on its colour: every legal move in this chess game is reproducible, with no random rule surprises, even if facing an unpredictable human can feel uncertain.

- a complete position (pieces, side to move, castling rights, en passant…) = a game state;
- a legal move = a transition to another state;
- a game = a trajectory, a sequence of states in a gigantic space.

If you want to be a bit formal, you can view it as a [directed graph](https://en.wikipedia.org/wiki/Directed_graph): each node is a state, each edge is a legal move; from a fixed state you can picture a search tree where players alternate branches. That framework is close to [game theory](https://en.wikipedia.org/wiki/Game_theory), a real bridge between mathematics and computing.

![Directed graph: positions and legal moves on the board](/images/echecs-ia-02-graphe.svg)

## The move tree: why "I calculated everything" is a myth

At club level you may have heard a player say: "I calculated everything." It sounds good but it is almost never strictly true: even grandmasters and champions traverse no complete fraction of the tree; from club player to grandmaster we only skim branches. They calculate a small part, and they do it well.

People often denote \(b\) the average number of legal moves (branching factor), \(d\) the search depth in half-moves (*plies*), and \(N(b,d)\) the approximate number of nodes to explore; a naive approximation gives \(N(b,d) \approx b^d\). As soon as depth grows you do not add "a little" work: you multiply work; it is a law of mathematics: the exponential. It explains why even the fastest machines remain bounded by available time and memory, even with the best known algorithms.

$$
N(b,d) \approx b^d
$$

In the middlegame \(b\) often sits around 30-40. If you take \(b=35\), then at \(d=6\) it is already huge, at \(d=10\) astronomical, at \(d=16\) another planet. The human brain was not built to traverse millions of branches: it was built to survive, recognise patterns, save energy, and that is good news because modern engines do the same, combining algorithm and heuristic.

To curb this explosion there is no magic: you must cut, estimate, order moves; methods this article unpacks next.

![Search tree: combinatorial explosion \(b^d\) in this game](/images/echecs-ia-03-arbre.svg)

## Shannon's number: the "wow" that is not just a gimmick

[Claude Shannon](https://en.wikipedia.org/wiki/Claude_Shannon), professor at [MIT](https://en.wikipedia.org/wiki/Massachusetts_Institute_of_Technology) and father of [information theory](https://en.wikipedia.org/wiki/Information_theory), posed a mathematics question in the mid-twentieth century: how many chess games are possible? His famous estimate lands around \(10^{120}\), the [Shannon number](https://en.wikipedia.org/wiki/Shannon_number). Careful: this figure is not eternal truth carved in stone; it is a scale grasp, not an exhaustive list of reachable configurations. What makes it fascinating is that the impossibility does not come from a technical detail but from a deep law: the space of possibilities is so vast that "exploring everything" stays out of reach even for the most advanced algorithms.

![Order of magnitude \(10^{120}\), Shannon number and information](/images/echecs-ia-04-shannon.svg)

## Why this game is not "solved" (and why that does not stop you winning)

A game is "[solved](https://en.wikipedia.org/wiki/Solved_game)" in the mathematical sense when, from the initial position, you know the outcome of perfect play (win, loss, draw) and/or possess an optimal strategy. [Game theory](https://en.wikipedia.org/wiki/Game_theory), inherited from [John von Neumann](https://en.wikipedia.org/wiki/John_von_Neumann), gives tools to discuss rational players and [Nash equilibrium](https://en.wikipedia.org/wiki/Nash_equilibrium); here the structure is mostly a duel with almost perfect information.

The following table summarises the difference between a few famous games and chess (the only table in this article).

| Game | Solved? | Quick comment |
| --- | --- | --- |
| [Tic-tac-toe](https://en.wikipedia.org/wiki/Tic-tac-toe) | Yes | Small space: optimal strategy known |
| [Checkers](https://en.wikipedia.org/wiki/English_draughts) | Yes | Perfect play is a draw; massive computer proof |
| **Chess** | No | Space too vast; no complete proof of outcome |
| [Go](https://en.wikipedia.org/wiki/Go_(game)) | Partially explored | AI ([AlphaGo](https://en.wikipedia.org/wiki/AlphaGo)) shifted the debate |

A common confusion: "If it is not solved, an engine cannot be sure." That is formally true, but it is not the goal. In real use an engine does not need to solve the starting position to beat you: it must play close enough to optimal in actual situations.

Solving a game and playing it very well are not the same thing. You can be unbeatable for the vast majority of players without a complete formal proof of perfect-play outcome. Machines impress because they excel at search and evaluation, not at "closing" the game by exhaustive proof.

## What a "classical" engine does: minimax, but not naive

Traditional engines (such as [Stockfish](https://en.wikipedia.org/wiki/Stockfish_(chess))) boil down to three blocks:

- search: traversing the move tree;
- evaluation: estimating who stands better on the diagram;
- optimisations: avoiding drowning in branches.

The idea behind [minimax](https://en.wikipedia.org/wiki/Minimax) is almost philosophical: you seek to maximise your advantage; your opponent seeks to minimise your advantage; you pick the move that maximises the minimum guaranteed against best defence. A highly simplified version looks like recursion on the graph's nodes:

$$
f(x) = \max_{m \in M} \min_{r \in R} f(x_{m,r})
$$

In club terms: minimax means "I do not play a move that only works if the opponent sleeps." It is a clear logic of rational caution, not a guarantee against tilt, but a worst-case model.

Raw minimax alone explores far too large a tree: without optimisation you die before you finish thinking; the good news is that a huge part of the tree is useless if you know how to prune it without regret.

![Minimax: maximise gain against the worst opponent](/images/echecs-ia-05-minimax.svg)

## Alpha-beta: the art of pruning without regret

[Alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning) optimises minimax traversal: its goal is not to find a different truth but to avoid computing what can no longer change the decision. **Alpha** is the best value already guaranteed for the maximising player; beta is the best value already guaranteed for the minimising player; if a branch can never beat what you already found elsewhere, you cut it.

It is the same gesture as when you calculate tactics: you explore a line, see that even if everything works you do not beat another plan, so you stop dwelling on it. The consequence is huge: with good move ordering alpha-beta can drastically cut explored nodes; the engine gains "free" depth for what appears on screen.

![Alpha-beta pruning: branches cut without changing the decision](/images/echecs-ia-06-alphabeta.svg)

## Evaluation: the real heart, because everything cannot be calculated

Even with alpha-beta you cannot reach the end of the tree: you hit leaves at limited depth and must answer a question that feels like magic: "what is this configuration worth?" Classical engines use evaluation functions built from criteria such as:

- material;
- pawn structure;
- piece activity;
- king safety;
- square control (and many more in top engines).

It is not naive point addition: strong engines combine heuristics, tweaks, and optimised parameters to correlate evaluation with final outcomes without reaching those outcomes. In real life it is like judging a position "promising" without calculating mate in twenty-eight moves: you recognise a schema where initiative and the bishop pair "feel right", even though no single line is complete proof. The engine formalises that know-how tirelessly for thousands of players.

![Heuristic evaluation function on the board](/images/echecs-ia-07-evaluation.svg)

## AI: learning to evaluate and choose instead of handwriting everything

In recent years one idea has gained huge traction: instead of hand-coding sophisticated evaluation, you can *learn* evaluation from data or self-play. [Neural networks](https://en.wikipedia.org/wiki/Artificial_neural_network) and [machine learning](https://en.wikipedia.org/wiki/Machine_learning) sit at the centre of this wave. People often confuse "AI" with "it calculates more": in reality modern AI shines mainly on two tasks:

- evaluating a position richly (compressed representation);
- proposing good candidate moves to steer search.

Result: the engine does not need to explore "everything": it explores better. You can see it as industrialised strong-player behaviour: they do not look at thirty-five random moves; they pick a few "serious" ones, then calculate. AI does the same with coherence and training depth beyond intuition.

The spectacular side of some approaches is self-play: a machine plays itself, learns from positions it generates, improves evaluations, repeats. It is not a miracle; it is a simple loop:

1. generate experience;
2. learn to predict what leads to good outcomes;
3. reinforce winning choices;
4. iterate.

What is fascinating is that starting from a game with strict rules you can surface strategic preferences without writing them line by line in English.

![Neural network: modern AI and search on the board](/images/echecs-ia-08-reseau.svg)

## IBM versus Kasparov: a historic day for software (without "solving" the game)

In 1997 [Deep Blue](https://en.wikipedia.org/wiki/Deep_Blue) defeated [Garry Kasparov](https://en.wikipedia.org/wiki/Garry_Kasparov), then [world chess champion](https://en.wikipedia.org/wiki/World_Chess_Championship), against an [IBM](https://en.wikipedia.org/wiki/IBM) machine built specifically for chess. That success marks its era: the world discovered the power of specialised computing.

Yet that success does not solve chess in the theoretical sense: you can win games against the strongest human without holding a perfect strategy from the initial position. Programmers today, in France and worldwide, extract far more from the game than in 1997 without abolishing the underlying mathematical substrate.

![1997: IBM's machine versus Kasparov, world champion](/images/echecs-ia-09-deepblue.svg)

## Strategic models and mathematics: what game science contributes

[Game theory](https://en.wikipedia.org/wiki/Game_theory) connects chess, through mathematics, to a whole family of models where players choose actions in response to others. The formalism crosses economics, decision support, and automated computation.

For a club player the takeaway is simple: you navigate a game where pure chance is low but uncertainty about opponent choices is real, a structure close to duels studied by game science, even if the game keeps its own flavour.

**Proof attempts.** The community has published masses of work on sub-problems (endgames, openings, tablebases), but no proof fixes perfect-play outcome from the starting position: the space of games resists exhaustive exploration.

Notions of [decidability](https://en.wikipedia.org/wiki/Decidability_(logic)) and [computational complexity](https://en.wikipedia.org/wiki/Computational_complexity) explain why "test everything" is unrealistic. That limit does not impoverish the game: it mixes rigour and intuition.

![Strategic conflict models and equilibrium](/images/echecs-ia-10-theorie.svg)

## "Impossible" does not mean "unusable": the lesson beyond the board

Chess is an excellent mental model for modern problems, for example:

- [cybersecurity](https://en.wikipedia.org/wiki/Computer_security) (attack / defence);
- strategy (anticipating an opponent);
- optimisation (where to invest machine effort);
- deciding when you cannot know everything at once.

The most important message is not "AI is magic": power comes less from calculating everything than from calculating what matters.

At your level as a player the lesson is the same: you cannot see everything; you can learn to choose better what you watch. The board amplifies who you are: if you seek control everywhere it throws it back at you; if you accept improving without defining yourself by a single number, you can turn every game into a training ground.

## What this means for you as a player

**Try this.** If you want to see what an engine does on a position, open the site's [analysis workspace](/analyses) (Stockfish in the browser): depth, score, and variations live.

**On the blog:**
- [Do chess players get better at maths?](/en/blog/les-echecs-et-les-mathematiques/)
- [Psychology of the chess player](/en/blog/psychologie-du-joueur-d-echecs/)
- [Chess and the brain](/en/blog/les-echecs-et-le-cerveau/)

Chess is "impossible" if you imagine a brute solution: explore everything, prove everything, solve everything at once. It becomes "possible" once you accept reality: you win by selecting, evaluating, and pruning. Strength is not how many moves you calculate but how well you sort. A lucid player already knows that.

**To go further:** [chessprogramming.org](https://www.chessprogramming.org/Main_Page), [ICGA](https://www.icga.org/), [arXiv](https://arxiv.org/).

Now that you know how an engine navigates the move tree, does it change how you use one to analyse your games? Share in the comments.
