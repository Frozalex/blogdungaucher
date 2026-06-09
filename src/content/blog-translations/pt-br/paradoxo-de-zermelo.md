---
title: "Paradoxo de Zermelo: a imperfeição do jogo perfeito"
excerpt: "O xadrez tem uma verdade matemática que ninguém conhece. Zermelo a demonstrou em 1913: o resultado sob jogo perfeito está determinado de antemão. Mas essa certeza teórica esconde uma vertigem prática fascinante."
seoTitle: "Paradoxo de Zermelo no xadrez: verdade determinada mas inacessível"
seoDescription: "Ernst Zermelo (1913) provou que o xadrez tem um resultado sob jogo perfeito: Brancas ganham, Pretas ganham ou empate. Por que essa certeza permanece fora de alcance, e o que isso muda no seu jogo."
frSlug: paradoxe-de-zermelo
---

Em 1913, durante o quinto Congresso Internacional de Matemáticos em Cambridge, o matemático alemão [Ernst Zermelo](https://pt.wikipedia.org/wiki/Ernst_Zermelo) apresentou um resultado que mudaria a forma como os matemáticos, e mais tarde os cientistas da computação, pensam os jogos de estratégia. Seu teorema é curto. Sua demonstração é elegante. E suas implicações no xadrez são ao mesmo tempo tranquilizadoras e vertiginosas.

## Ernst Zermelo e a teoria dos conjuntos

Antes de falar de xadrez, é preciso compreender quem era Zermelo. Ele é principalmente conhecido por suas contribuições fundamentais à teoria dos conjuntos, em particular o [axioma da escolha](https://pt.wikipedia.org/wiki/Axioma_da_escolha) e os [axiomas de Zermelo-Fraenkel](https://pt.wikipedia.org/wiki/Axiomas_de_Zermelo-Fraenkel), que ainda hoje constituem os fundamentos padrão da matemática.

Em 1913, seu interesse pelo xadrez não era fortuito. Os matemáticos da época buscavam formalizar o raciocínio lógico em sistemas tão rigorosos quanto possível. Os jogos de estratégia perfeita representavam um terreno ideal: regras precisas, número finito de estados, sem acaso. A questão natural era: existe, em teoria, uma forma "perfeita" de jogar?

## O teorema de Zermelo: enunciado e demonstração

O teorema de Zermelo se aplica a uma classe de jogos que inclui o xadrez: jogos de dois jogadores que se enfrentam diretamente (sem coalizão), com informação perfeita (nada está escondido), sem acaso, onde os dois jogadores jogam alternadamente, e que terminam sempre num número finito de lances.

**Enunciado:** Em todo jogo desse tipo, uma das três situações seguintes é necessariamente verdadeira: o jogador 1 tem uma estratégia ganhadora, ou o jogador 2 tem uma estratégia ganhadora, ou os dois jogadores podem forçar o empate.

A demonstração usa uma **indução retroativa** (*backward induction*) sobre o comprimento máximo possível da partida. Imagine um final de partida alcançado. Cada posição terminal é ou uma vitória para Brancas, ou uma vitória para Pretas, ou um empate. Agora, vamos remontar um lance. Se é a vez de Brancas, elas podem escolher entre as posições terminais acessíveis aquela que lhes é mais favorável. Da mesma forma para Pretas. Remontando recursivamente assim desde todas as posições terminais até a posição inicial, cada posição na árvore do jogo recebe um valor definido: vitória Brancas, vitória Pretas, ou empate.

O valor da posição inicial está portanto determinado. O primeiro jogador a jogar tem ou uma estratégia para forçar a vitória, ou os dois jogadores podem forçar o empate, ou o segundo jogador tem uma estratégia para forçar a vitória.

### Uma demonstração refinada depois

Detalhe histórico frequentemente esquecido: o texto original de Zermelo em 1913 contém uma **sutileza não trivial** sobre a finitude. Zermelo supõe implicitamente que toda partida termina num número finito de lances, mas não trata corretamente o caso onde o perdedor pode indefinidamente atrasar o xeque-mate. É [Dénes König](https://pt.wikipedia.org/wiki/D%C3%A9nes_K%C5%91nig) (1927) e depois [László Kalmár](https://en.wikipedia.org/wiki/L%C3%A1szl%C3%B3_Kalm%C3%A1r) (1928) que completam a prova com o que se chama hoje de **lema de König** sobre as árvores infinitas com ramificação finita. No xadrez, esse detalhe é resolvido na prática pela regra dos 50 lances e pela regra da tripla repetição, que garantem a finitude efetiva.

### Por que é paradoxal

O paradoxo de Zermelo não é lógico. É um paradoxo prático. O teorema garante que a resposta existe e é única. Mas não diz qual é. E sobretudo, não diz como encontrá-la.

Para encontrar o valor real da posição inicial do xadrez, seria necessário percorrer a totalidade da árvore do jogo. Essa árvore contém cerca de $10^{120}$ folhas segundo a estimativa de Shannon. Para referência, a idade do universo é de cerca de $4 \times 10^{17}$ segundos, e o número de átomos no universo observável é de cerca de $10^{80}$.

Um computador que pudesse avaliar $10^{20}$ posições por segundo (ou seja, cerca de $10^{11}$ vezes mais rápido do que os melhores computadores atuais) levaria cerca de $10^{100}$ segundos para resolver o xadrez por força bruta. É infinitamente mais longo do que a idade do universo. A resolução completa do xadrez por exploração exaustiva é fisicamente impossível com qualquer tecnologia concebível.

## A verdade desconhecida do xadrez

A grande questão que o teorema de Zermelo deixa em suspense é: qual é o valor do xadrez sob jogo perfeito?

A maioria dos grandes mestres e dos teóricos acha que a resposta é o empate. O argumento empírico é forte: no mais alto nível de jogo, os empates são muito frequentes, e a posição inicial é considerada ligeiramente favorável às Brancas (que têm o primeiro movimento) mas não o suficiente para forçar a vitória contra uma defesa ótima.

Mas isso é apenas uma intuição baseada na observação do jogo humano. Não é uma prova. É matematicamente possível que as Brancas tenham uma vitória forçada escondida em profundidades que nenhum humano jamais explorou. É improvável segundo os especialistas, mas não demonstrado como impossível.

Alguns trabalhos recentes em informática tentam abordar a questão de forma assintótica. [Komodo](https://en.wikipedia.org/wiki/Komodo_(chess)), [Stockfish](https://pt.wikipedia.org/wiki/Stockfish) e seus sucessores avaliam a posição inicial como ligeiramente favorável às Brancas (na ordem de +0,2 a +0,3 peão de vantagem), mas essa avaliação é ela mesma baseada em funções heurísticas, não num cálculo exaustivo.

## Os finais resolvidos: uma janela sobre a verdade

Se resolver o xadrez inteiro é impossível, existe um domínio onde a resolução completa foi realizada: os finais com poucas peças.

As [tablebases](https://pt.wikipedia.org/wiki/Tablebase) desenvolvidas por Ken Thompson e depois Marc Bourzutschky e outros resolveram todos os finais até sete peças no tabuleiro. Esse trabalho monumental revelou resultados surpreendentes.

O final Rei-Dama-Torre contra Rei-Dama, por exemplo, havia sido considerado nulo por muito tempo. As tablebases revelaram que em certas configurações, um lado pode forçar a vitória em... 517 lances. Nenhum humano, mesmo o melhor Grande Mestre do mundo, poderia encontrar esse caminho por raciocínio próprio. A profundidade da verdade enxadrística nessas configurações ultrapassa largamente as capacidades humanas.

Esse resultado é instrutivo. Ele mostra que sua intuição sobre o que é "ganho" ou "nulo" pode ser profundamente errada quando você se afasta das posições familiares. Ele reforça o mistério de Zermelo: a verdade existe, mas pode se esconder em profundidades que desafiam a compreensão humana.

### O salto DTM / DTZ: duas verdades para uma mesma posição

As tablebases distinguem duas medidas da "vitória forçada": DTM (*Distance to Mate*, distância ao mate) e DTZ (*Distance to Zero*, distância ao próximo lance de peão ou captura que reinicia o contador dos 50 lances). Um mesmo final ganho pode ter DTM = 517 e DTZ = 7: existe um lance que simplifica a vitória em sete semilances se aceitar "perder" a vitória matemática em benefício de uma vitória mais curta mas acessível. Essa dualidade ilustra algo profundo sobre Zermelo: a **verdade matemática** de uma posição depende do critério escolhido para "ganhar", e a humanidade joga quase sempre com um critério prático (ganhar antes do relógio, antes da fadiga) muito diferente do critério teórico.

## A imperfeição estrutural do jogador humano

O paradoxo de Zermelo revela algo fundamental sobre a condição do jogador humano. Ele joga um jogo cuja "perfeição" está matematicamente definida, mas fisicamente inacessível.

Um jogador humano, mesmo o melhor do mundo, joga uma aproximação da estratégia ótima. Seu nível de jogo é determinado pela qualidade dessa aproximação: a que profundidade ele pode calcular, quantos padrões táticos ele reconhece, quão fiel é sua avaliação posicional à realidade.

[Magnus Carlsen](https://pt.wikipedia.org/wiki/Magnus_Carlsen), considerado por muitos o melhor jogador da história, ainda comete erros. [Stockfish](https://pt.wikipedia.org/wiki/Stockfish), o melhor motor de xadrez atual, também comete erros em relação ao jogo perfeito teórico, erros bem mais raros e bem menores, mas erros ainda assim.

A diferença entre Carlsen e Stockfish não é qualitativa (um joga perfeitamente e o outro não), ela é quantitativa (um é uma aproximação mais fina do que o outro). Esse ponto de vista muda profundamente sua forma de pensar o progresso no xadrez: você não tende à perfeição, você tenta se aproximar dela.

## O jogo perfeito não é o jogo ideal

Outra dimensão do paradoxo de Zermelo é filosófica. Mesmo que a estratégia perfeita fosse escrita em preto e branco, você a jogaria realmente?

Imagine que Brancas têm uma vitória forçada em 80 lances a partir da posição inicial. Jogar essa vitória forçada significaria que toda partida já estaria, na realidade, terminada no lance 1. O adversário poderia jogar qualquer coisa, o resultado seria o mesmo. O xadrez, como jogo, cessaria de existir. A competição desapareceria. A arte estratégica desmoronaria.

O fato de o xadrez ser tão complexo que nenhuma estratégia perfeita é conhecida é precisamente o que o torna vivo. A imperfeição dos jogadores humanos é a condição necessária à existência do jogo como disciplina artística e esportiva.

Esse paradoxo é profundo: a beleza e a riqueza do xadrez repousam na ignorância coletiva de sua verdade matemática. Se todos soubessem tudo de antemão, o jogo morreria. O mistério é seu combustível.

## Zermelo e a hierarquia dos jogos resolvidos

A comunidade de informática resolveu progressivamente jogos mais complexos uns após os outros, seguindo a lógica de Zermelo.

O [jogo da velha](https://pt.wikipedia.org/wiki/Jogo_da_velha) é nulo sob jogo perfeito, e essa verdade é acessível a qualquer criança que aprende a estratégia correta. O [Conecta-4](https://pt.wikipedia.org/wiki/Conecta-4) foi resolvido em 1988: vitória do primeiro jogador. As [damas](https://pt.wikipedia.org/wiki/Damas) foram resolvidas em 2007 por [Jonathan Schaeffer](https://en.wikipedia.org/wiki/Jonathan_Schaeffer_(computer_scientist)): nulo sob jogo perfeito, após 18 anos de cálculo e um registro de $5 \times 10^{20}$ posições.

O [xadrez](https://pt.wikipedia.org/wiki/Xadrez) permanece em aberto. O [Go](https://pt.wikipedia.org/wiki/Go_(jogo)) também. A resolução completa desses jogos permanece fora de alcance, não em princípio (Zermelo garante que uma resposta existe), mas na prática (a complexidade combinatória é demasiado elevada).

## O que Zermelo muda para você no tabuleiro

Saber que o xadrez tem uma verdade matemática inacessível muda algo para o jogador prático? Não diretamente no tabuleiro. Mas muda a forma de pensar o jogo.

Cada lance que você joga é uma aproximação. Cada avaliação de posição que você faz é uma estimativa. Cada plano que você constrói é uma heurística. Não há certeza, mesmo para o Grande Mestre mais sólido. Há aproximações mais ou menos finas da verdade.

Essa humildade matemática é saudável. Ela significa que mesmo frente a um adversário muito mais forte do que você, a verdade da posição não é conhecida por ele. Ele joga, ele também, uma aproximação. Seu relógio gira. Seus recursos cognitivos são limitados. Nas complicações que ele não conhece, sua verdade prática pode se afastar significativamente da verdade teórica.

O gênio de Zermelo não é ter resolvido o xadrez. É ter provado que a solução existe, de forma definitiva, sem poder encontrá-la. Um exemplo raro onde a certeza da existência está separada da possibilidade do acesso.

**Após a leitura:** guarde em mente uma **frase de humildade matemática** numa partida longa: você joga aproximações, não a verdade da tablebase; isso pode dissolver o perfeccionismo no momento errado.

---

## O que guardar

- Zermelo prova que em todo jogo finito de dois jogadores com informação perfeita, o resultado sob jogo perfeito está determinado de antemão
- Para o xadrez, isso significa que ou Brancas ganham, ou Pretas ganham, ou a partida é nula sob jogo perfeito dos dois lados
- Ninguém sabe ainda qual dessas três opções é verdadeira; a hipótese majoritária é o empate
- A demonstração foi refinada por **König (1927) e Kalmár (1928)** para tratar rigorosamente a finitude
- As **tablebases ≤ 7 peças** são a confirmação construtiva do teorema sobre um subconjunto acessível
- Esse paradoxo revela que a "perfeição" no xadrez é um ideal matematicamente definido mas fisicamente inacessível

### Fontes e referências

- **Zermelo, E.** *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels.* Proceedings of the Fifth International Congress of Mathematicians, Cambridge, 1913.
- **Schwalbe, U., & Walker, P.** *Zermelo and the Early History of Game Theory.* Games and Economic Behavior, 34(1), 123-137, 2001.
- **Schaeffer, J., et al.** *Checkers Is Solved.* Science, 317(5844), 1518-1522, 2007.
- **Fraenkel, A. S., & Lichtenstein, D.** *Computing a Perfect Strategy for n×n Chess Requires Time Exponential in n.* Journal of Combinatorial Theory, Series A, 31(2), 199-214, 1981.
- **Shannon, C. E.** *Programming a Computer for Playing Chess.* Philosophical Magazine, Series 7, 41(314), 1950.
