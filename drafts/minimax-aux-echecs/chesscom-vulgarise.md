# Minimax : l'algorithme que ton cerveau utilise sans le savoir

« Si je joue là, il prend, je reprends, mais alors il a ce coup… » Ça te parle ? Ce petit dialogue intérieur que tu fais avant chaque coup, il porte un nom : minimax. C'est l'algorithme au cœur de tous les moteurs d'échecs, de Deep Blue à Stockfish. Et la bonne nouvelle, c'est que tu le fais déjà naturellement. Comprendre comment il marche peut t'aider à mieux calculer.

## L'idée en une phrase

Le meilleur coup, c'est celui qui te donne le meilleur résultat **en supposant que l'adversaire jouera toujours le pire pour toi**. Toi tu maximises, lui minimise. D'où le nom : mini-max.

## Comment ça marche

**1. On déroule l'arbre des possibilités.** À chaque coup, tu imagines les réponses, puis tes réponses aux réponses, etc. À chaque étage, c'est l'un qui cherche le mieux pour lui, l'autre le pire pour toi. Le souci : à chaque coup il y a ~35 possibilités. À 10 coups de profondeur, ça fait des milliers de milliards de positions. Impossible à tout calculer, même pour un ordi.

**2. L'astuce qui sauve tout : couper les branches mortes.** Ça s'appelle l'élagage alpha-bêta. Le principe : si tu as déjà trouvé un bon plan, et qu'une autre option se révèle clairement pire, inutile de creuser plus loin, tu abandonnes cette branche. Cette astuce double la profondeur qu'un moteur peut atteindre. C'est grâce à elle que Deep Blue a battu Kasparov en 1997.

**3. La fonction d'évaluation : le « jugement » du moteur.** Comme on ne peut pas aller jusqu'au mat, le moteur s'arrête et « note » la position : matériel, sécurité du roi, structure de pions, contrôle du centre… Stockfish bat l'humain non pas parce qu'il joue « parfaitement », mais parce que ce jugement + sa profondeur de calcul sont meilleurs que les tiens. Et AlphaZero, lui, a remplacé ce jugement par un réseau de neurones : d'où son style spectaculaire, plein de sacrifices.

## Ce que ça change pour toi

Le point clé : **tu fais déjà du minimax**, juste en version réduite. Un débutant calcule 2-3 coups fiables, un grand maître 7-10. Mais la profondeur n'est pas tout. Deux autres choses comptent autant :
- **Ton « jugement » de position** (ton sens positionnel) : c'est ta fonction d'évaluation interne. Plus elle est fine, mieux tu évalues sans calculer.
- **Ton élagage** : ta capacité à virer instantanément les coups nuls pour ne calculer que les 3-4 bons. C'est ça qui fait gagner du temps.

Une astuce de moteur que tu peux voler : l'ordre dans lequel tu examines les coups change tout. Si tu regardes d'abord le coup le plus prometteur, tu peux écarter le reste très vite (« le reste est forcément moins bien »). Si tu commences par les coups faibles, tu perds du temps. Donc entraîne ton instinct à proposer le bon candidat en premier : c'est ça qui fait gagner des secondes précieuses à la pendule.

Exercice concret pour t'entraîner : sur un puzzle, fixe-toi une profondeur (genre 3 demi-coups) et calcule jusque-là AVANT de regarder la solution. Tu muscles ton minimax interne. Avec le temps, tu calcules plus loin, plus vite, et tu écartes les mauvais coups d'un coup d'œil. C'est exactement ce que fait un moteur, en plus lent.

---

*J'ai creusé tout ça plus en profondeur, alpha-bêta, negamax, AlphaZero et MCTS, dans la version académique : [lien à coller].*
