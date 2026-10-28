---
heroImageAlt: "Uma mão minúscula segura um dedal diante de uma imensa duna de areia."
title: "Complexidade do xadrez: de Shannon a Deep Blue e AlphaZero"
excerpt: "A árvore de variantes se torna imensa muito antes de um motor conseguir explorar tudo. De Shannon a Deep Blue e AlphaZero, distinga estimativas de tamanho, busca seletiva e limites demonstrados."
seoTitle: "Complexidade do xadrez: Shannon, alfa-beta e AlphaZero"
seoDescription: "Ordens de grandeza de Shannon, busca alfa-beta, Deep Blue e AlphaZero: distinga complexidade generalizada, xadrez 8×8 e desempenho dos motores."
frSlug: "echecs-et-complexite-algorithmique"
faq: [{"question": "O que é o número de Shannon?", "answer": "É uma ordem de grandeza histórica da árvore de partidas, em torno de 10^120, obtida por Shannon com hipóteses simplificadoras. Não deve ser confundida com uma contagem exata das partidas legais nem com a estimativa de cerca de 4,8×10^44 posições legais de Tromp. Várias sequências de lances podem levar à mesma posição; sua quantidade não demonstra uma impossibilidade de resolver o jogo."}, {"question": "Como Deep Blue venceu Kasparov sem calcular tudo?", "answer": "Combinando duas técnicas. A poda alfa-beta elimina ramos de busca que não podem melhorar o resultado já encontrado, sem mudar a pontuação do mesmo minimax. O ganho depende da ordem dos lances. Junto a uma função de avaliação elaborada com grandes mestres, Deep Blue avaliava cerca de 200 milhões de posições por segundo e aprofundava seletivamente certas linhas forçadas. É uma heurística poderosa, não uma solução completa."}, {"question": "Em quanto tempo AlphaZero superou Stockfish?", "answer": "No protocolo de Silver e colegas (2017), a curva de avaliação supera Stockfish após quatro horas. O treinamento usa muitas TPUs e partidas de autojogo. Esse prazo não se transfere a um computador pessoal nem mede uma compreensão humana do jogo."}, {"question": "O xadrez está resolvido matematicamente?", "answer": "O valor da posição inicial com jogo perfeito continua desconhecido. É preciso distinguir a solução a partir dessa posição de uma solução forte, que trata todas as posições do jogo. Superar um campeão não prova uma estratégia ótima."}, {"question": "Como os humanos ainda conseguem jogar apesar dessa complexidade?", "answer": "Você não precisa resolver o jogo para escolher um lance. Pode comparar algumas variantes, reconhecer uma estrutura familiar e avaliar as consequências das escolhas. Isso permite jogar sem garantir uma decisão ótima."}]
---

Em 1950, Claude Shannon, fundador da teoria da informação, publicou um artigo chamado “Programming a Computer for Playing Chess”. Nele examina como fazer uma máquina escolher um lance apesar do tamanho da árvore de variantes.

Shannon distingue as configurações do tabuleiro das sequências de lances. Sua ordem de grandeza histórica de 10^120 para a árvore de partidas se apoia em hipóteses de ramificação e duração; não é uma contagem exata de todas as partidas legais. Serve para mostrar por que explorar ingenuamente todas as continuações não é um método prático.

O problema da quantidade de posições é diferente: em 2021, John Tromp apresenta uma estimativa de cerca de 4,8×10^44 posições legais. A mesma posição pode ser alcançada por várias sequências. Comparar os dois números exige, portanto, dizer o que está sendo contado.

Era preciso encontrar outra coisa.

## O que é complexidade algorítmica?

A complexidade algorítmica é uma área da computação teórica que estuda os recursos, como tempo e memória, necessários para resolver problemas. Classifica os problemas conforme sua “dificuldade fundamental”: não na prática em um computador específico, mas teoricamente, de maneira assintótica, à medida que o tamanho do problema aumenta.

As classes mais conhecidas:
- **P:** problemas decidíveis em tempo polinomial em função do tamanho da entrada; isso não garante uma execução rápida para toda instância
- **NP:** problemas cujas soluções podem ser *verificadas* em tempo polinomial, potencialmente lentos para resolver e rápidos para verificar
- **PSPACE:** problemas solucionáveis com memória polinomial, mesmo que o tempo seja exponencial
- **EXPTIME:** problemas decidíveis em tempo no máximo exponencial em um polinômio do tamanho da entrada
- **EXPSPACE:** problemas decidíveis com memória no máximo exponencial em um polinômio do tamanho da entrada; essa classe contém EXPTIME

O xadrez generalizado, em um tabuleiro n×n em vez de 8×8, constitui um problema **EXPTIME-completo**, segundo Fraenkel e Lichtenstein (1981). Isso significa que resolver exatamente o xadrez em um tabuleiro arbitrário é, no sentido formal, tão difícil quanto os problemas mais difíceis da sua classe, e nenhum algoritmo polinomial pode resolvê-los.

Esse resultado assintótico não fornece um número mínimo de anos de cálculo para o tabuleiro 8×8 isoladamente. Os próprios autores destacam esse limite. O xadrez moderno é um jogo finito quando se incluem as regras de término automático; isso torna uma solução teoricamente definida, sem torná-la praticável hoje.

## A árvore de jogo e a explosão combinatória

Imagine a árvore de uma partida de xadrez. Na raiz, a posição inicial. Depois do primeiro lance das brancas, com 20 possibilidades, existem 20 nós. Depois do primeiro lance das pretas, também com 20 possibilidades, são 400 nós. Depois de dois lances de cada lado, 197.281 sequências legais de quatro meios-lances chegam às folhas da árvore. É preciso distinguir sequências de lances de posições distintas: várias sequências podem chegar à mesma posição. O teste de geração de lances do Stockfish verifica, por exemplo, 3.195.901.860 sequências a sete meios-lances.

Como ilustração, tomemos uma ramificação uniforme de 35 e uma profundidade de 80 meios-lances, ou 40 lances por jogador. O modelo fornece 35^80 ≈ 10^123,5 sequências nessa profundidade. É um cálculo ilustrativo, não uma contagem da árvore completa.

Esse modelo ilustra a explosão da **quantidade de sequências de lances**: aumentar a profundidade acrescenta um fator exponencial. Não é a quantidade de posições distintas nem a prova de que nenhum método poderia determinar o valor do jogo sem percorrer cada sequência.

Essa explosão combinatória explica por que os primeiros programas de xadrez, nas décadas de 1950 a 1970, eram fracos apesar de computadores cada vez mais poderosos. A força bruta sozinha não funcionava. Eram necessárias heurísticas: atalhos inteligentes que trocam a garantia de optimalidade pela viabilidade prática.

## Poda alfa-beta: o primeiro grande salto

A **poda alfa-beta** permite evitar cálculos inúteis no minimax. Com profundidade, função de avaliação e árvore idênticas, conserva o resultado do minimax: o corte, em si, não é uma aproximação.

Mantém-se a mesma perspectiva para todas as pontuações: MAX as maximiza e MIN as minimiza. Alfa é um limite inferior disponível para MAX; beta, um limite superior disponível para MIN. Quando beta ≤ alfa, um ramo já não pode mudar uma escolha acessível a um ancestral e pode ser cortado. MAX não designa automaticamente as brancas em todas as implementações.

Em uma árvore uniforme com ramificação b e profundidade d, a ordem ideal dos lances permite um custo da ordem de O(b^(d/2)), contra O(b^d) do minimax. Na pior ordem, o ganho pode desaparecer. Esse resultado assintótico não transforma diretamente o número de Shannon em um tamanho preciso de árvore para calcular.

Combinada a uma **função de avaliação**, isto é, uma fórmula que estima o valor de uma posição sem chegar às folhas da árvore, a poda alfa-beta permite buscar até uma profundidade fixa e avaliar as posições resultantes. Era exatamente o que Deep Blue fazia em 1997.

## Deep Blue: a vitória da engenharia

Deep Blue não era um programa sutil. Era uma obra de engenharia que aplicava capacidade computacional às heurísticas de xadrez.

A IBM construiu **chips especializados**, ASICs, concebidos apenas para avaliar posições de xadrez: centenas em paralelo. A IBM relata uma capacidade de avaliação de 200 milhões de posições por segundo. Com uma poda alfa-beta otimizada e heurísticas sofisticadas de ordenação, o sistema aprofundava seletivamente as variantes promissoras.

A função de avaliação foi desenvolvida com ajuda de grandes mestres: codificava explicitamente conceitos como estrutura de peões, segurança do rei, atividade das peças e casas fracas. Cada conceito era traduzido em termos numéricos, com pesos ajustados pelos engenheiros.

Kasparov venceu Deep Blue em 1996, por 4 a 2. Perdeu em 1997, por 3,5 a 2,5. Esse resultado demonstra um desempenho em um match, não uma solução matemática do jogo. A combinação de hardware especializado, busca e avaliação basta para explicar a abordagem técnica, sem decidir se uma máquina “entende” como um humano.

## AlphaZero: uma revolução de outra natureza

Vinte anos depois, a DeepMind apresentou AlphaZero. A diferença não era quantitativa: era qualitativa.

AlphaZero aprende sua política de lances e sua avaliação por autojogo, sem base de partidas humanas nem função de avaliação de xadrez escrita à mão. Isso não significa ausência de escolhas de engenharia: representação das posições, arquitetura e procedimento de busca são definidos pelos autores.

Jogava contra si mesmo: milhões de partidas. A cada partida, uma rede neural profunda aprendia quais posições tendem a ser ganhas e quais lances tendem a ser bons em quais posições. O preprint de Silver e colegas (2017) relata que Stockfish foi superado após **quatro horas** na curva de avaliação. O treinamento mobiliza muitas TPUs; esse prazo e esse resultado dependem do hardware e do protocolo.

O estilo de AlphaZero fascinava grandes mestres: dinâmico, disposto a sacrificar, com intuições posicionais que os teóricos nunca tinham codificado explicitamente. Na comparação do preprint de 2017, AlphaZero explora cerca de 80 mil posições por segundo, contra 70 milhões de Stockfish. Essas medidas se referem a sistemas e hardware diferentes; um nó explorado não tem o mesmo custo nem a mesma função nas duas buscas.

A rede guia uma busca MCTS: portanto, AlphaZero continua explorando uma árvore, com outra seleção de variantes e uma avaliação aprendida. A palavra “intuição” é aqui uma analogia, não a prova de um mecanismo cognitivo humano reproduzido.

## O que essa história muda na sua visão de um motor

Deep Blue e AlphaZero mostram duas maneiras de selecionar variantes e avaliar posições. Seu sucesso não significa que resolveram o xadrez. Também não prova que uma rede neural reproduza o funcionamento do cérebro de um grande mestre.

Para você, a distinção é útil: uma análise de motor propõe lances com um orçamento de cálculo específico. Não fornece uma prova do valor exato da posição inicial. A explosão combinatória explica a necessidade de selecionar; não diz que todo método futuro de solução seja impossível.

## Fontes

- Shannon, C. E. (1950). *Programming a Computer for Playing Chess*. Philosophical Magazine, 41, 256–275. [Artigo original, Computer History Museum](https://www.computerhistory.org/chess/doc-431614f453dde/): estimativa da árvore e busca seletiva.
- Tromp, J. (2021). *Number of legal chess positions*. [Página do autor](https://tromp.github.io/chess/chess.html): estimativa de cerca de 4,8 × 10^44 posições legais.
- Fraenkel, A. S., & Lichtenstein, D. (1981). *Computing a perfect strategy for n×n chess requires time exponential in n*. Journal of Combinatorial Theory, Series A. [Texto integral dos autores](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf): variante generalizada EXPTIME-completa.
- IBM (sem data). *Deep Blue*. [História do projeto](https://www.ibm.com/history/deep-blue): hardware, velocidade de avaliação e matches contra Kasparov.
- Silver, D., et al. (2017). *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*. arXiv. [Preprint integral](https://arxiv.org/html/1712.01815v1): autojogo, comparação com Stockfish e condições experimentais.
- Equipe Stockfish (sem data). *tests/perft.sh*. GitHub. [Testes do gerador de lances](https://github.com/official-stockfish/Stockfish/blob/master/tests/perft.sh).

## Para continuar

- [Grand Oral NSI, em francês: por que AlphaZero representa uma ruptura na inteligência artificial?](/fr/blog/sujet-grand-oral-nsi-alphazero/)
- [Por que o xadrez é um problema matemático quase impossível e como a IA ainda consegue jogar](/pt-br/blog/xadrez-problema-matematico-impossivel-e-ia/)
- [Grand Oral de matemática, em francês: como o xadrez constitui um modelo do pensamento combinatório?](/fr/blog/sujet-grand-oral-maths-combinatoire/)
