---
title: "Comment un échiquier connecté peut-il transmettre une partie en direct tout en économisant sa batterie ?"
excerpt: "Un roque et un bilan de charge montrent pourquoi un échiquier doit traiter les gestes localement avant de transmettre les coups."
specialty: "Sciences de l’ingénieur · NSI"
---

<div class="academic-dissertation">

<section class="dissertation-movement" aria-label="Introduction">

<p class="dissertation-movement-start">Un échiquier électronique permet à un public de suivre sur écran une partie disputée avec des pièces physiques. Il doit transformer des déplacements en données, déterminer quel coup a effectivement été joué et transmettre le résultat avec un délai acceptable. Lorsqu’il fonctionne sur batterie, garder une fréquence élevée de transmission peut peser sur l’autonomie. Comment diffuser vite une partie tout en limitant cette consommation ? Il faut séparer la détection, la validation et l’envoi, puis comparer deux façons de répartir le travail entre le plateau et l’ordinateur.</p>

</section>

<section class="dissertation-movement" aria-label="I. Un changement de case n’équivaut pas toujours à un coup d’échecs">

<p class="dissertation-movement-start">Le fabricant Digital Game Technology décrit des échiquiers électroniques capables de reconnaître des pièces et leur position. Le plateau fournit des observations. Le programme qui les interprète doit retrouver un coup et ses conséquences sur la partie. Lors d’un déplacement ordinaire, une pièce quitte une case et apparaît sur une autre. Si le joueur prend une pièce, une des cases peut rester occupée entre le début et la fin. Il faut alors distinguer le type et la couleur de son occupant, ou observer une séquence suffisamment informative.</p>

<p>Le petit roque blanc rend cette différence visible. Si les conditions prévues par les règles sont remplies, le roi va de e1 à g1 et la tour de h1 à f1. Entre les deux gestes, le plateau montre momentanément un roi déplacé et une tour encore immobile. Cette observation intermédiaire ne constitue pas le résultat final d’un coup. La publier pourrait faire croire au spectateur que le roi a joué seul un déplacement impossible. L’identité des pièces, leur état au tour précédent et les règles du jeu donnent ensemble le sens du mouvement observé.</p>

<p>Dans une architecture simple, le plateau envoie fréquemment des relevés bruts à un ordinateur qui reconstruit la partie. Dans une autre, le plateau lit ses capteurs à la même fréquence, mais garde l’état précédent en mémoire. Au terme du geste, il compare l’état stable aux positions que les coups légaux pourraient produire. Si la comparaison permet d’identifier un coup, il envoie un message qui décrit celui-ci, accompagné par exemple de son numéro. La mesure n’a pas été ralentie. C’est le nombre de transmissions qui a changé.</p>

<p>Le cas de la promotion montre à quel point le système doit être attentif au sens des données. Quand un pion atteint la dernière rangée, le joueur doit le remplacer par une pièce choisie parmi quatre types. Un capteur qui connaît seulement les cases occupées peut indiquer que le pion a quitté sa case et que la dernière rangée reste occupée. Cela ne dit pas s’il y a désormais une dame ou un cavalier. Le système doit attendre une identification suffisante ou recevoir une indication explicite du type choisi. Ce besoin n’est pas un détail d’affichage. Les coups légaux disponibles au tour suivant dépendent de la pièce qui a réellement été posée.</p>

</section>

<section class="dissertation-movement" aria-label="II. On peut comparer la charge dépensée pour une même séquence de jeu">

<p class="dissertation-movement-start">Je prends un modèle fictif de deux minutes pendant lesquelles huit demi-coups sont joués. Un demi-coup désigne ici l’action d’un seul camp, comme e2-e4. Le plateau effectue dans les deux cas cinq lectures par seconde. Le fonctionnement des capteurs et du traitement consomme en moyenne 8 milliampères hors émission, une valeur supposée identique pour simplifier la comparaison. La radio ajoute 30 milliampères lorsqu’elle émet. Un relevé brut occupe 10 millisecondes et un message décrivant le coup en occupe 20.</p>

<p>Au bout de deux minutes, le système qui retransmet cinq relevés par seconde a effectué 600 envois. Sa radio a donc émis pendant 6 secondes. Dans le système qui envoie seulement les demi-coups validés, huit messages de 20 millisecondes représentent 0,16 seconde d’émission. La charge se calcule en multipliant le courant par une durée exprimée en heures. On obtient 0,050 milliampère-heure pour la radio du premier système et environ 0,0013 pour celle du second. À cela s’ajoutent dans les deux cas environ 0,267 milliampère-heure pour le fonctionnement du plateau.</p>

<p>Au total, le modèle donne environ 0,317 contre 0,268 milliampère-heure sur la période. La charge liée aux émissions diminue fortement, tandis que le gain sur l’ensemble est proche de 15 %. Cette distinction est essentielle. Économiser presque toute la charge dédiée aux messages ne signifie pas économiser presque toute la batterie. Les capteurs restent actifs entre les coups. Si le calcul local, l’écoute radio ou les retransmissions consomment davantage que ne le suppose le modèle, le résultat doit être recalculé.</p>

<p>Le bilan permet aussi d’établir une limite pour le choix de l’architecture. Dans le modèle, on économise environ 0,049 milliampère-heure d’émission sur deux minutes. Si le traitement local ajoute davantage que cette quantité de charge, l’économie disparaît. Sur deux minutes, un supplément constant de 1,5 milliampère représente justement 0,05 milliampère-heure. C’est donc un ordre de grandeur à comparer au coût réel du processeur. Ce raisonnement aide à formuler un essai plus ciblé : mesurer la hausse du courant hors transmission lorsque le programme local filtre plusieurs lectures et compare les possibilités, puis vérifier que cette hausse reste compatible avec l’économie calculée sur la radio.</p>

</section>

<section class="dissertation-movement" aria-label="III. Le direct impose des critères de délai et de cohérence">

<p class="dissertation-movement-start">Pour valider un coup, le système peut attendre que la position reste stable sur plusieurs lectures. Cette attente protège contre l’envoi d’un geste inachevé. Elle ajoute aussi un délai après le dépôt de la pièce. Une valeur acceptable se choisit selon le service attendu. Le public a besoin d’une mise à jour rapide, mais un léger décalage est souvent moins gênant qu’un échiquier qui affiche successivement des positions contradictoires. En tournoi, le temps des joueurs et le temps de diffusion doivent rester des informations distinctes.</p>

<p>Une rupture du réseau pose un autre problème. Si le récepteur manque le message numéro huit et reçoit le neuf, il peut détecter le trou. Le plateau peut garder un court historique et renvoyer le coup manquant, ou transmettre l’état complet pour retrouver un affichage cohérent. Avec plusieurs jeux de mesures, on comparerait le délai du dernier geste au nouvel affichage, le nombre d’erreurs et la charge effectivement utilisée. Il faudrait notamment examiner le roque, la prise, la promotion et une interruption de connexion.</p>

<p>Pour suivre la panne d’un seul message, je peux écrire trois colonnes sur une feuille. La première reçoit le déplacement physique, la deuxième le numéro de coup du plateau, la troisième l’état du récepteur. Tant que les numéros se suivent, le spectateur sait à quel événement correspond la mise à jour. S’ils font un saut, je peux montrer ce que doivent faire les deux appareils : demander la donnée manquante ou repartir d’une position complète et d’un numéro annoncé. Envoyer une position complète conserve l’affichage, mais ne reconstitue pas forcément la notation de tous les coups manquants. Un produit destiné à l’analyse après tournoi peut donc avoir une exigence d’enregistrement plus forte qu’un écran qui affiche seulement la position actuelle.</p>

</section>

<section class="dissertation-movement" aria-label="Conclusion">

<p class="dissertation-movement-start">Pour diffuser une partie en limitant la charge consommée, un échiquier peut lire régulièrement ses cases tout en envoyant principalement des coups interprétés. Le roque montre pourquoi les règles doivent intervenir avant la transmission. Le calcul explique ensuite le gain possible. Le choix final dépend du délai, de la capacité à retrouver une partie après un incident et de la consommation réellement mesurée.</p>

</section>

</div>

## Sources

- Digital Game Technology, [présentation des échiquiers électroniques](https://www.digitalgametechnology.com/about-dgt-e-boards).
- Fédération internationale des échecs, [règles du roque et du déplacement des pièces, articles 3 et 4](https://handbook.fide.com/chapter/e012023).
