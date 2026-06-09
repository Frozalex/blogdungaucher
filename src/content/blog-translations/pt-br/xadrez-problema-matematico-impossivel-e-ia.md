---
title: "Por que o xadrez é um problema matemático (quase) impossível e como a IA consegue mesmo assim"
excerpt: >-
  A árvore de lances explode, o número de Shannon dá vertigem, e ainda assim um motor te corrige em alguns segundos.
  O xadrez é "impossível" de resolver? Veja o que a matemática, a informática e a IA realmente fazem por baixo do capô.
seoTitle: "Xadrez problema matemático impossível: complexidade, Shannon, IA"
seoDescription: "10^120 partidas possíveis, complexidade EXPTIME, Stockfish a 3500 Elo: por que resolver o xadrez permanece matematicamente impossível e como a IA contorna o muro."
frSlug: pourquoi-echecs-probleme-mathematique-impossible-et-ia
---

Você já viveu esse paradoxo : os aplicativos e a mídia vendem o [xadrez](https://pt.wikipedia.org/wiki/Xadrez) como um objeto de complexidade cósmica, um jogo onde cada jogador traça uma estratégia a longo prazo; depois você abre um aplicativo, joga um lance razoável, e o motor te corrige e te explica uma linha que você sozinho jamais encontraria.

Então o quê? Pode-se realmente reduzir tudo a fórmulas? Esse jogo é um problema matemático ao qual a matemática e a informática trazem respostas parciais, ou é uma lenda que se repete para parecer profundo? A resposta se dá em duas etapas : essa disciplina é impossível de tratar por força bruta em todo o espaço das partidas, mas se torna jogável num nível sobre-humano assim que você aceita medir a realidade graças a programas que combinam exploração, avaliação, poda e, hoje, aprendizado em máquinas muito potentes.

A verdade é mais interessante do que o mito : nenhuma lista finita de lances "fecha" o jogo como um enunciado formal fechado e, ainda assim, programas batem regularmente os melhores jogadores humanos porque não buscam a perfeição absoluta, apenas uma decisão boa o suficiente frente a um adversário real.

## O tabuleiro visto por dentro : um grafo de estados, não um caos

Para um matemático ou um cientista da computação, o [xadrez](https://pt.wikipedia.org/wiki/Xadrez) oferece uma qualidade rara : as regras são exatas, públicas, e o jogo é determinístico. Um [Cavalo](https://pt.wikipedia.org/wiki/Cavalo_(xadrez)) sempre salta em L, um Bispo permanece em sua cor : cada lance legal é reproduzível, sem acaso nem surpresa de regra.

- uma posição completa (peças, vez, roque, en passant…) = um estado do jogo;
- um lance legal = uma transição para outro estado;
- uma partida = uma trajetória, ou seja, uma sequência de estados num espaço gigantesco.

Isso pode ser visto como um [grafo orientado](https://pt.wikipedia.org/wiki/Grafo_dirigido): cada nó é um estado, cada aresta é um lance legal; a partir de um estado fixado, pode-se imaginar uma árvore de exploração onde os jogadores alternam os ramos.

## A árvore de lances : por que "eu calculo tudo" é um mito

Em seu nível de clube, você talvez já tenha ouvido um jogador dizer : "Calculei tudo." É uma frase que soa bem, mas é quase sempre falsa : mesmo os grandes mestres e campeões não percorrem nenhuma fração completa da árvore; do jogador de clube ao grande mestre, cada um mal toca uma ínfima parte dos ramos. Eles calculam uma pequena parte, e fazem isso bem.

A literatura costuma notar $b$ o número médio de lances possíveis (fator de ramificação), $d$ a profundidade explorada em semilances (*plies*), e $N(b,d)$ o número aproximado de nós a explorar:

$$N(b,d) \approx b^d$$

No meio-jogo, $b$ gira frequentemente em torno de 30-40. Se você toma $b=35$, então a $d=6$ já é enorme, a $d=10$ é astronômico, a $d=16$ é outro planeta. O cérebro humano não foi concebido para percorrer milhões de ramos : foi concebido para sobreviver, reconhecer padrões, economizar energia : e isso é excelente, porque é exatamente o que fazem também os motores modernos, combinando algoritmo e heurística.

Para deter essa explosão, não há magia : é preciso cortar, estimar, ordenar os lances.

## O número de Shannon : o "uau" que não é apenas um gimmick

[Claude Shannon](https://pt.wikipedia.org/wiki/Claude_Shannon), professor no [MIT](https://pt.wikipedia.org/wiki/Instituto_de_Tecnologia_de_Massachusetts) e pai da [teoria da informação](https://pt.wikipedia.org/wiki/Teoria_da_informa%C3%A7%C3%A3o), colocou no meio do século XX uma questão matemática : quantas partidas de xadrez são possíveis? Sua estimativa, tornada famosa, chega a $10^{120}$, o [número de Shannon](https://en.wikipedia.org/wiki/Shannon_number). Atenção : esse número não é uma verdade gravada em mármore; é uma medida para captar a escala, não uma lista exaustiva de configurações alcançáveis. O que torna isso fascinante é que essa impossibilidade não vem de um detalhe técnico mas de uma lei profunda : o espaço dos possíveis é tão vasto que "explorar tudo" está fora de alcance, mesmo para os algoritmos mais avançados.

## Por que esse jogo não está "resolvido" (e por que isso não impede de ganhar)

Um jogo é "[resolvido](https://en.wikipedia.org/wiki/Solved_game)" no sentido da matemática quando o resultado do jogo perfeito (vitória, derrota, empate) é conhecido desde a posição inicial e/ou quando uma estratégia ótima está inteiramente descrita.

A tabela a seguir resume a diferença entre alguns jogos célebres e o xadrez:

| Jogo | Resolvido? | Comentário rápido |
| --- | --- | --- |
| [Jogo da velha](https://pt.wikipedia.org/wiki/Jogo_da_velha) | Sim | Espaço pequeno : estratégia ótima conhecida |
| [Damas](https://pt.wikipedia.org/wiki/Damas) | Sim | Jogo perfeito = empate, prova massiva por cálculo |
| **Xadrez** | Não | Espaço vasto demais; nenhuma prova completa de resultado |
| [Go](https://pt.wikipedia.org/wiki/Go_(jogo)) | Parcialmente explorado | IA ([AlphaGo](https://pt.wikipedia.org/wiki/AlphaGo)) mudou o nível do debate |

Uma confusão frequente : "Se não está resolvido, um motor não pode ter certeza." Isso é correto no sentido formal, mas não é o objetivo. Na utilização real, um motor não precisa resolver a posição inicial para te bater : ele deve jogar suficientemente perto do ótimo nas situações reais. O teorema que garante que uma resposta *existe* (sem que se possa encontrá-la) é o paradoxo de Zermelo.

### EXPTIME-completo : o resultado de complexidade que ninguém vai contornar

No plano estrito da complexidade algorítmica, **o xadrez generalizado** (num tabuleiro $n \times n$) pertence à classe **EXPTIME-completo**: todo algoritmo correto para resolver a posição inicial exige um tempo exponencial em $n$. É o resultado de [Fraenkel e Lichtenstein (1981)](https://doi.org/10.1016/0097-3165(81)90016-9). EXPTIME-completo significa algo muito forte: **nenhum progresso algorítmico** tornará a resolução numa classe polinomial, salvo para quebrar uma hierarquia fundamental da teoria da complexidade. É um dos raros resultados onde se tem uma **prova de impossibilidade** em vez de uma simples ausência de solução.

Para o xadrez 8×8 especificamente (tamanho fixo, não generalizado), o estatuto formal é mais sutil : tecnicamente é um problema *finito*, portanto *decidível*. Mas o limite prático permanece $10^{120}$: decidível no sentido lógico, indecidível no sentido físico.

## O que faz um motor "clássico" : minimax, mas não ingênuo

Pode-se resumir a estrutura dos motores tradicionais (tipo [Stockfish](https://pt.wikipedia.org/wiki/Stockfish)) em três blocos:

- exploração : percurso da árvore de lances;
- avaliação : estimar quem está melhor na posição;
- otimizações : para não se afogar nos ramos.

A ideia por trás do [minimax](https://pt.wikipedia.org/wiki/Minimax) é quase filosófica : você busca maximizar sua vantagem; seu adversário busca minimizar sua vantagem; você escolhe o lance que maximiza o mínimo garantido frente ao melhor jogo do adversário:

$$f(x) = \max_{m \in M} \min_{r \in R} f(x_{m,r})$$

Se você quiser uma tradução para o clube : minimax é "eu não jogo um lance que funciona apenas se o outro estiver dormindo." É uma lógica clara de prudência racional, não uma garantia contra o tilt, mas um modelo do "pior caso".

## Alfa-beta : a arte de cortar sem arrependimento

O [poda alfa-beta](https://pt.wikipedia.org/wiki/Poda_alfa-beta) é uma otimização do percurso minimax : seu objetivo não é encontrar outra verdade, mas não calcular o que não pode mais mudar a decisão. **Alfa** é o melhor valor já garantido para o jogador que maximiza; beta é o melhor valor já garantido para o jogador que minimiza; se um ramo não poderá jamais superar o que você já encontrou em outro lugar, você o corta.

É o mesmo gesto que você faz quando calcula uma tática : você explora uma linha, vê que mesmo que tudo funcione, não obtém melhor do que outro plano, então para de se preocupar com ela. A consequência é enorme : com uma boa ordem dos lances, a poda alfa-beta pode reduzir drasticamente o número de nós explorados; o motor ganha profundidades "gratuitas" para a qualidade exibida na tela.

## A avaliação : o verdadeiro cerne, porque tudo é impossível de calcular

Mesmo com a poda alfa-beta, você não pode ir até o fim da árvore : você chega em folhas de profundidade limitada, e deve responder a uma pergunta que parece mágica : "esta configuração, quanto vale?" Os motores "clássicos" usam uma função de avaliação feita de critérios como:

- material;
- estrutura de peões;
- atividade das peças;
- segurança do rei;
- controle de casas (e muitos outros nos motores de ponta).

Não é uma adição ingênua de pontos : os bons motores combinam heurísticas, ajustes e parâmetros otimizados para obter uma avaliação correlacionada ao resultado final sem atingir esse resultado final. Na vida real, é como julgar uma posição "promissora" sem calcular o mate em vinte e oito lances : você sabe reconhecer um esquema onde a iniciativa e o par de bispos "cheiram bem", mesmo que nenhuma linha sirva de prova completa.

## A IA : quando a máquina aprende a avaliar e a escolher, em vez de tudo ser escrito à mão

Há alguns anos, uma ideia ganhou enorme espaço : em vez de codificar "à mão" uma avaliação sofisticada, torna-se possível *aprender* uma avaliação a partir de dados ou por auto-jogo. As [redes de neurônios](https://pt.wikipedia.org/wiki/Rede_neural_artificial) e o [aprendizado de máquina](https://pt.wikipedia.org/wiki/Aprendizado_de_m%C3%A1quina) estão no cerne dessa onda. A IA moderna brilha sobretudo em duas tarefas:

- avaliar uma posição de forma muito rica (representação comprimida);
- propor bons lances candidatos para orientar a exploração.

Resultado: o motor não precisa explorar "tudo": ele explora melhor. Você pode vê-lo como uma versão industrializada do que fazem os jogadores fortes: eles não olham trinta e cinco lances ao acaso; selecionam alguns "sérios", depois calculam. A IA faz o mesmo com uma consistência e uma profundidade de treinamento que ultrapassam a intuição.

O ponto espetacular de certas abordagens é o auto-jogo : uma máquina se enfrenta a si mesma, aprende das posições que gera, melhora suas avaliações, e recomeça. Não é um milagre, é um ciclo simples:

1. gerar experiências;
2. aprender a prever o que leva a bons resultados;
3. reforçar as escolhas ganhadoras;
4. iterar.

O que é fascinante é que a partir de um jogo com regras estritas, pode-se fazer emergir preferências estratégicas sem escrevê-las em português linha por linha.

## IBM face a Kasparov : um dia histórico para o software (sem "resolver" o jogo)

Em 1997, o [Deep Blue](https://pt.wikipedia.org/wiki/Deep_Blue) bate [Garry Kasparov](https://pt.wikipedia.org/wiki/Garry_Kasparov), então [campeão mundial](https://pt.wikipedia.org/wiki/Campe%C3%A3o_mundial_de_xadrez) de xadrez, contra uma máquina [IBM](https://pt.wikipedia.org/wiki/IBM) concebida especificamente para o jogo. Esse sucesso marca o século XX : o mundo inteiro descobre o poder do cálculo especializado.

No entanto, esse sucesso não resolve o xadrez no sentido teórico : uma máquina pode ganhar partidas contra o melhor jogador humano sem possuir uma estratégia perfeita desde a posição inicial. Os programadores modernos extraem muito mais do jogo do que em 1997, sem abolir por isso a base matemática subjacente.

## "Impossível" não significa "inutilizável" : a lição além do tabuleiro

O xadrez é um excelente modelo mental para problemas modernos, por exemplo:

- a [segurança informática](https://pt.wikipedia.org/wiki/Seguran%C3%A7a_da_informa%C3%A7%C3%A3o) (ataque / defesa);
- a estratégia (antecipação de um adversário);
- a otimização (onde investir o esforço da máquina);
- a decisão quando você não pode saber tudo de uma vez.

A mensagem mais importante não é "a IA é mágica" : é que o poder vem menos do fato de calcular tudo do que de calcular o que importa.

Na sua escala de jogador, é a mesma lição : você não pode ver tudo; pode aprender a escolher melhor o que você olha. O tabuleiro amplifica o que você é : se você busca o controle em todo lugar, ele lhe devolverá isso; se você aceita progredir sem se definir por um único número, poderá transformar cada partida em terreno de experiência.

**Após a leitura:** abra o motor numa partida recente, repare o **primeiro lance** onde sua variante e a linha do motor divergem em mais de meio peão, depois rejoguei **essa posição sozinha** três vezes durante o dia (sem nova partida).

---

## O que guardar

- A árvore das partidas é delimitada pelo **número de Shannon ($10^{120}$)**: nenhum algoritmo por força bruta chegará a percorrê-la
- O xadrez generalizado é **EXPTIME-completo**: existe uma **prova de impossibilidade** de algoritmo polinomial
- Os motores não *resolvem*, eles *aproximam*: minimax + alfa-beta + avaliação heurística + aprendizado
- Bater o humano e resolver o jogo são dois problemas diferentes; Stockfish/AlphaZero fazem o primeiro, ninguém faz o segundo
- Progredir como jogador é melhorar **sua função de avaliação interna** e **sua poda intuitiva**, exatamente como um motor
- "Impossível" no sentido formal não significa "inutilizável" : a qualidade da triagem conta mais do que a quantidade de cálculo

### Fontes e referências

- **Shannon, C. E.** *Programming a Computer for Playing Chess.* Philosophical Magazine, Series 7, 41(314), 256-275, 1950.
- **Fraenkel, A. S., & Lichtenstein, D.** *Computing a Perfect Strategy for n×n Chess Requires Time Exponential in n.* Journal of Combinatorial Theory, Series A, 31(2), 199-214, 1981.
- **Knuth, D. E., & Moore, R. W.** *An Analysis of Alpha-Beta Pruning.* Artificial Intelligence, 6(4), 293-326, 1975.
- **Silver, D., et al.** *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm.* arXiv, 2017.
- **Campbell, M., Hoane, A. J., & Hsu, F.** *Deep Blue.* Artificial Intelligence, 134(1-2), 57-83, 2002.
- **Allis, L. V.** *Searching for Solutions in Games and Artificial Intelligence.* PhD Thesis, University of Limburg, 1994.
