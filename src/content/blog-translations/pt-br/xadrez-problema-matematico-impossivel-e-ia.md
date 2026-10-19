---
heroImageAlt: "Vinheta em pixel art: computador retrô com uma árvore de decisão
  luminosa na tela e título sobre complexidade matemática do xadrez e IA."
title: "Por que resolver o xadrez é tão difícil e como a IA consegue jogar"
excerpt: "A árvore dos lances cresce rapidamente, mas um motor encontra boas decisões em segundos. Entenda o que busca, avaliação e aprendizado permitem fazer sem resolver todo o jogo."
seoTitle: "Resolver o xadrez: complexidade, Shannon e limites da IA"
seoDescription: "Número de Shannon, busca exaustiva, avaliação e IA: por que o xadrez não está resolvido, sem confundir dificuldade prática com impossibilidade demonstrada."
frSlug: "pourquoi-echecs-probleme-mathematique-impossible-et-ia"
faq: [{"question": "O xadrez será resolvido algum dia?", "answer": "Não sabemos. A exploração exaustiva está fora do alcance dos métodos atuais, mas isso não exclui outra forma de prova. O resultado EXPTIME trata de uma generalização do jogo, não de uma impossibilidade demonstrada para o tabuleiro 8×8."}, {"question": "Qual a diferença entre resolver o jogo e vencer um humano?", "answer": "Resolver exige uma prova do resultado com jogo perfeito. Ganhar partidas contra humanos mede desempenho em certas condições, sem estabelecer essa prova. Classificações de motores e de humanos não são diretamente intercambiáveis."}, {"question": "O número de Shannon é exato?", "answer": "Não. A ordem de grandeza 10^120 descreve o tamanho estimado de uma árvore de partidas, não uma contagem exata de posições legais distintas."}]
---

Você já viveu esse paradoxo: aplicativos e mídia apresentam o [xadrez, em francês](https://fr.wikipedia.org/wiki/%C3%89checs) como um objeto de complexidade imensa, no qual cada jogador traça uma estratégia de longo prazo; depois você abre um aplicativo, faz um lance razoável e o motor corrige, mostrando uma linha que não encontraria sozinho.

Então é possível reduzir tudo a fórmulas? É um problema matemático ao qual matemática e computação oferecem respostas parciais ou uma lenda repetida para parecer profundo? A resposta tem duas etapas: explorar por força bruta todo o espaço das partidas está fora do alcance dos recursos atuais, mas é possível jogar em nível sobre-humano com programas que combinam exploração, avaliação, poda e, hoje, aprendizado em máquinas poderosas.

![Esquema de um tabuleiro de xadrez 8 por 8](/images/pt-br/echecs-ia-01-plateau.svg)

A realidade é mais interessante que o mito: não se conhece uma solução completa desde a posição inicial e, ainda assim, programas vencem regularmente os melhores humanos, sem demonstrar perfeição absoluta, encontrando decisões suficientemente fortes contra adversários reais.

## O tabuleiro por dentro: um grafo de estados, não um caos

Para a matemática ou a computação, o [xadrez, em francês](https://fr.wikipedia.org/wiki/Jeu_d%27%C3%A9checs) tem uma qualidade valiosa: regras exatas, públicas e determinísticas. Um [cavalo, em francês](https://fr.wikipedia.org/wiki/Cavalier_(jeu_d%27%C3%A9checs)) sempre salta em L, um bispo fica na sua cor: cada lance legal é reproduzível, sem acaso nem surpresa de regra, mesmo que um humano imprevisível provoque incerteza.

- Uma posição completa, com peças, vez, roque e en passant, é um estado do jogo.
- Um lance legal é uma transição para outro estado.
- Uma partida é uma trajetória, uma sequência de estados em um espaço gigantesco.

Formalmente, pode ser visto como um [grafo dirigido, em francês](https://fr.wikipedia.org/wiki/Graphe_orient%C3%A9): cada nó é um estado e cada aresta um lance legal. A partir de um estado fixo, também é possível imaginar uma árvore de exploração em que os jogadores alternam os ramos. Esse modelo é detalhado em [teoria dos jogos no xadrez](/pt-br/blog/teoria-dos-jogos-no-xadrez/), com outra perspectiva nos [equilíbrios das aberturas](/pt-br/blog/grafos-de-nash-equilibrio-aberturas/).

![Grafo dirigido dos lances possíveis no xadrez](/images/pt-br/echecs-ia-02-graphe.svg)

## A árvore dos lances: por que “calculei tudo” costuma ser exagero

No clube, talvez você já tenha ouvido “calculei tudo”. A frase soa bem, mas em uma posição ampla quase nunca é literal: grandes mestres e campeões também percorrem apenas parte da árvore. Selecionam uma parte pequena e a calculam bem.

Os livros costumam representar por \(b\) a quantidade média de lances possíveis, o fator de ramificação, por \(d\) a profundidade em meios-lances, *plies*, e por \(N(b,d)\) a quantidade aproximada de nós a explorar. Uma aproximação ingênua fornece \(N(b,d) \approx b^d\). Ao acrescentar profundidade, não se soma apenas um pouco de trabalho: o crescimento é exponencial. Isso explica por que até máquinas rápidas ficam limitadas pelo tempo e pela memória disponíveis.

$$
N(b,d) \approx b^d
$$

Em um modelo simplificado, considere um fator de ramificação constante \(b=35\). O número de folhas cresce como \(b^d\), e aumentar a profundidade rapidamente custa caro. Em uma partida real, a quantidade de lances legais varia com a posição. Selecionar candidatos como humano e buscar com um motor podem ser comparados como analogia prática; não são, por isso, o mesmo mecanismo.

Para conter a explosão, não há mágica: é preciso cortar, estimar e ordenar os lances, métodos detalhados a seguir.

![Crescimento de uma árvore: definir o modelo](/images/pt-br/echecs-ia-03-arbre.svg)

## O número de Shannon: uma ordem de grandeza

[Claude Shannon, em francês](https://fr.wikipedia.org/wiki/Claude_Shannon) propõe em 1950 uma ordem de grandeza de \(10^{120}\) sob as hipóteses do seu modelo, conhecida como [número de Shannon, em francês](https://fr.wikipedia.org/wiki/Nombre_de_Shannon). Não é uma contagem exata das partidas legais nem das configurações alcançáveis. A estimativa ilustra o custo de uma exploração exaustiva ingênua; não prova que nenhum método diferente possa resolver o jogo no futuro.

![Ordem de grandeza do número de partidas de xadrez de Shannon](/images/pt-br/echecs-ia-04-shannon.svg)

## Por que o jogo não está resolvido e isso não impede vencer

Um jogo está [resolvido, em francês](https://fr.wikipedia.org/wiki/Jeu_r%C3%A9solu), no sentido matemático, quando o resultado do jogo perfeito, vitória, derrota ou empate, é conhecido a partir da posição inicial e/ou uma estratégia ótima é inteiramente descrita. A [teoria dos jogos, em francês](https://fr.wikipedia.org/wiki/Th%C3%A9orie_des_jeux), associada a [John von Neumann, em francês](https://fr.wikipedia.org/wiki/John_von_Neumann), oferece ferramentas para falar de jogadores racionais e [equilíbrio de Nash, em francês](https://fr.wikipedia.org/wiki/%C3%89quilibre_de_Nash); aqui, a estrutura é principalmente a de um duelo de informação perfeita.

A tabela resume a diferença entre alguns jogos conhecidos e o xadrez, a única tabela deste artigo.

| Jogo | Resolvido? | Comentário |
| --- | --- | --- |
| [Jogo da velha, em francês](https://fr.wikipedia.org/wiki/Morpion) | Sim | Espaço pequeno e estratégia ótima conhecida |
| [Damas inglesas, em francês](https://fr.wikipedia.org/wiki/Dames_anglaises) | Fracamente resolvidas | Posição inicial empatada com jogo perfeito; não abrange todas as variantes de damas |
| **Xadrez** | Não | Espaço muito amplo; nenhuma prova completa do resultado |
| [Go, em francês](https://fr.wikipedia.org/wiki/Go_%28jeu%29) | Parcialmente explorado | A IA [AlphaGo, em francês](https://fr.wikipedia.org/wiki/AlphaGo) mudou o nível de desempenho |

Desconhecer o valor inicial não impede certezas locais: um mate forçado demonstrado ou uma base de finais aplicável pode oferecer um resultado exato no seu contexto. Uma avaliação heurística não tem essa garantia. Assim, um motor pode ter alto desempenho sem resolver o jogo inteiro. A diferença é aprofundada no [paradoxo de Zermelo](/pt-br/blog/paradoxo-de-zermelo/).

### EXPTIME-completo: cuidado com a generalização

Fraenkel e Lichtenstein (1981) estudam o problema de decidir quem pode ganhar de uma posição arbitrária em uma generalização do xadrez no tabuleiro $n\times n$. O problema é EXPTIME-completo. Os autores esclarecem que o resultado diz pouco diretamente sobre o xadrez 8×8.

É uma dificuldade no pior caso para uma família de problemas de tamanho variável. Não é um tempo de cálculo imposto a cada posição nem uma prova de impossibilidade física de resolver a posição inicial comum. O xadrez de tamanho fixo continua sendo um problema finito; “indecidível” não é a palavra adequada para um cálculo caro demais na prática.


## O que faz um motor clássico: minimax, mas não ingênuo

É possível resumir a estrutura dos motores tradicionais, como [Stockfish, em francês](https://fr.wikipedia.org/wiki/Stockfish), em três partes:

- Exploração: percorrer a árvore dos lances.
- Avaliação: estimar quem está melhor na posição.
- Otimizações: evitar se perder na quantidade de ramos.

A ideia do minimax, em francês é quase filosófica: você busca maximizar sua vantagem; o adversário busca minimizá-la; você escolhe o lance que maximiza o mínimo garantido diante da melhor resposta. Uma versão simplificada lembra uma recorrência nos nós do grafo:

$$
f(x) = \max_{m \in M} \min_{r \in R} f(x_{m,r})
$$

Na linguagem do clube, minimax é “não jogo um lance que só funciona se o outro estiver dormindo”. É uma lógica de prudência racional, não garantia contra o tilt, mas um modelo do pior caso.

Minimax bruto leva a uma árvore grande demais: sem otimizações, o custo rapidamente fica proibitivo. A boa notícia é que muitos ramos são desnecessários quando se sabe cortá-los sem alterar o resultado. O algoritmo, os refinamentos, como negamax, null-move e tabelas de transposição, e as alternativas neurais são detalhados em [minimax no xadrez](/pt-br/blog/minimax-no-xadrez/).

![Minimax: maximizar o resultado contra a melhor resposta adversária](/images/pt-br/echecs-ia-05-minimax.svg)

## Alfa-beta: cortar sem mudar o valor

A [poda alfa-beta, em francês](https://fr.wikipedia.org/wiki/%C3%89lagage_alpha-b%C3%AAta) otimiza a exploração minimax: não busca outra verdade, mas evita calcular o que já não pode mudar a decisão. **Alfa** é o melhor valor já garantido ao jogador que maximiza; beta, o melhor valor já garantido ao que minimiza. Se um ramo já não puder melhorar a escolha disponível, ele é cortado.

É uma analogia com seu cálculo de uma tática: você explora uma linha, percebe que, mesmo funcionando, ela não oferece mais que outro plano e deixa de insistir. Com boa ordenação de lances, alfa-beta pode reduzir muito os nós explorados, permitindo ao motor aumentar a profundidade com o mesmo orçamento.

![Poda alfa-beta: cortar ramos sem mudar a decisão](/images/pt-br/echecs-ia-06-alphabeta.svg)

## A avaliação: estimar sem calcular tudo

Mesmo com alfa-beta, em geral você não chega ao fim da árvore: encontra folhas em profundidade limitada e precisa responder “quanto vale esta posição?”. Motores clássicos usam uma função de avaliação com critérios como:

- Material.
- Estrutura de peões.
- Atividade das peças.
- Segurança do rei.
- Controle de casas e outros critérios dos motores avançados.

Não é apenas uma soma ingênua de pontos: motores tradicionais combinam heurísticas e parâmetros otimizados. Stockfish anunciou em 2020 a integração de NNUE, avaliação neural, mantendo a busca alfa-beta. Essas abordagens combinam busca e aprendizado para avaliar sem chegar ao resultado final. É comparável, como analogia, a julgar uma posição promissora sem calcular um mate em 28 lances: iniciativa e par de bispos podem parecer bons mesmo sem uma prova completa. O motor formaliza critérios de avaliação e os aplica repetidamente. O artigo sobre [a teoria do caos no xadrez](/pt-br/blog/teoria-do-caos-no-xadrez/) distingue a analogia de uma instabilidade tática de uma prova de caos matemático.

![Avaliar uma posição em profundidade limitada](/images/pt-br/echecs-ia-07-evaluation.svg)

## IA: aprender a avaliar e escolher em vez de escrever tudo à mão

Nos últimos anos, ganhou espaço a ideia de *aprender* uma avaliação a partir de dados ou autojogo, em vez de escrever toda a função à mão. [Redes neurais, em francês](https://fr.wikipedia.org/wiki/R%C3%A9seau_de_neurones_artificiels) e [aprendizado de máquina, em francês](https://fr.wikipedia.org/wiki/Apprentissage_automatique) estão no centro dessa mudança. IA não significa apenas “calcular mais”: essas abordagens ajudam em duas tarefas:

- Avaliar uma posição com uma representação aprendida.
- Propor lances candidatos para orientar a exploração.

O motor não precisa explorar tudo: seleciona a busca. A seleção pode lembrar a de um jogador forte que escolhe candidatos antes de calcular, mas essa comparação não demonstra uma equivalência entre a rede e a intuição humana.

Um aspecto importante de algumas abordagens é o autojogo: a máquina enfrenta a si mesma, aprende com as posições geradas, melhora as avaliações e recomeça. É um ciclo:

1. Gerar experiências.
2. Aprender a prever o que conduz a bons resultados.
3. Reforçar escolhas vencedoras.
4. Repetir.

Partindo de regras estritas, podem surgir preferências estratégicas sem escrevê-las explicitamente em linguagem humana.

![Redes e busca: funções distintas](/images/pt-br/echecs-ia-08-reseau.svg)

## IBM contra Kasparov: um marco sem resolver o jogo

Em 1997, [Deep Blue, em francês](https://fr.wikipedia.org/wiki/Deep_Blue) vence [Garry Kasparov, em francês](https://fr.wikipedia.org/wiki/Garry_Kasparov), então [campeão mundial, em francês](https://fr.wikipedia.org/wiki/Champion_du_monde_d%27%C3%A9checs), com uma máquina da [IBM, em francês](https://fr.wikipedia.org/wiki/IBM) projetada especificamente para xadrez. O sucesso marcou o século XX e mostrou a força do cálculo especializado.

Mesmo assim, não resolveu o xadrez no sentido teórico: uma máquina pode ganhar partidas do melhor humano sem ter uma estratégia perfeita desde o início. Programas modernos extraem mais do jogo que em 1997, sem eliminar suas questões matemáticas fundamentais.

![Deep Blue contra Kasparov: um marco dos anos 1990](/images/pt-br/echecs-ia-09-deepblue.svg)

## Modelos estratégicos e matemática: o que oferece a teoria dos jogos

A [teoria dos jogos, em francês](https://fr.wikipedia.org/wiki/Th%C3%A9orie_des_jeux) liga o xadrez a uma família de modelos em que participantes escolhem ações em resposta uns aos outros. O formalismo cruza economia, apoio à decisão e cálculo automatizado.

Para o jogador de clube, a ideia central é simples: as regras não incluem um sorteio aleatório, mas existe incerteza sobre as escolhas adversárias. É uma estrutura próxima dos duelos estudados pela teoria dos jogos, com características próprias.

**Provas.** Existem trabalhos sobre subproblemas, como finais, aberturas e tabelas de posições, mas nenhuma prova fixa o resultado do jogo perfeito desde a posição inicial: a exploração exaustiva continua impraticável.

Os conceitos de [decidibilidade, em francês](https://fr.wikipedia.org/wiki/D%C3%A9cidabilit%C3%A9) e [complexidade algorítmica, em francês](https://fr.wikipedia.org/wiki/Complexit%C3%A9_des_algorithmes) ajudam a distinguir o que pode ser decidido do custo de fazê-lo. A limitação prática não empobrece o jogo: combina rigor e intuição.

![O modelo matemático do xadrez](/images/pt-br/echecs-ia-10-theorie.svg)

## “Impossível” não quer dizer inutilizável: além do tabuleiro

O xadrez oferece analogias para problemas modernos, como:

- [Segurança da informação, em francês](https://fr.wikipedia.org/wiki/S%C3%A9curit%C3%A9_informatique), ataque e defesa.
- Estratégia e antecipação de um adversário.
- Otimização, escolhendo onde investir esforço computacional.
- Decisão quando não é possível saber tudo de uma vez.

A ideia central não é “IA é mágica”: a força vem menos de calcular tudo que de selecionar o que importa.

Na sua escala de jogador, a lição é semelhante: você não consegue ver tudo, mas pode aprender a escolher melhor o que examina. Aceitar o progresso sem se definir por um número permite usar cada partida como experiência.

## O que isso muda para o jogador

**Para experimentar.** Abra uma posição no seu programa de análise, com Stockfish local ou no navegador, e observe profundidade, avaliação e variantes.

**No blog.**
- [O xadrez melhora a matemática?](/pt-br/blog/xadrez-e-matematica/)
- [Psicologia do enxadrista](/pt-br/blog/psicologia-do-jogador-de-xadrez/)
- [Xadrez e cérebro](/pt-br/blog/xadrez-e-o-cerebro/)

A exploração exaustiva ingênua ultrapassa os recursos atuais. Seleção, avaliação e poda permitem jogar em nível alto com orçamento limitado. A eficácia depende da posição, dos algoritmos e dos recursos; não demonstra impossibilidade matemática de resolver o jogo nem equivalência com o raciocínio humano.

**Para aprofundar:** [chessprogramming.org](https://www.chessprogramming.org/Main_Page), [ICGA](https://www.icga.org/) e [arXiv](https://arxiv.org/).

**Depois da leitura:** abra seu programa de análise, identifique o **primeiro lance** em que sua variante e a linha do motor divergem em mais de meio peão e jogue novamente **apenas essa posição** três vezes ao longo do dia, sem começar outra partida.

---

## Fontes

- Shannon, C. E. (1950), *Programming a Computer for Playing Chess*, Philosophical Magazine, 41, 256–275, [artigo original](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf), para a estimativa combinatória discutida.

- Fraenkel, A. S. e Lichtenstein, D. (1981), *Computing a Perfect Strategy for n×n Chess Requires Time Exponential in n*, Journal of Combinatorial Theory, série A, 31, 199–214, [texto dos autores](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf).
- Russell, S. e Norvig, P. (sem data), *Adversarial Search*, capítulo de manual, [texto](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf), para minimax, alfa-beta e limites da busca.
- Equipe Stockfish (2020), *Introducing NNUE Evaluation*, site oficial, [anúncio](https://stockfishchess.org/blog/2020/introducing-nnue-evaluation/).
- IBM (sem data), *Deep Blue*, arquivo da empresa, [história do match de 1997](https://www.ibm.com/history/deep-blue).
