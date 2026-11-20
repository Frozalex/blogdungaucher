---
heroImageAlt: Um cavalo de xadrez encara formas geométricas do outro lado de uma
  ponte inacabada.
title: "O xadrez melhora a matemática? O que os estudos mostram"
excerpt: "O tabuleiro oferece problemas matemáticos, mas jogar não garante melhores resultados escolares. Entenda a diferença entre usar o xadrez como recurso didático e demonstrar uma transferência."
seoTitle: "Xadrez e matemática: transferência e limites dos estudos"
seoDescription: "Xadrez e matemática: Sala e Gobet, passeio do cavalo e problema das oito rainhas. O que a pesquisa mostra sobre transferência e propostas de raciocínio."
frSlug: "les-echecs-et-les-mathematiques"
faq: [{"question": "Fazer uma criança jogar xadrez melhora suas notas em matemática?", "answer": "Não é garantido. Os experimentos de Sala e Gobet com controle ativo não confirmam uma transferência para a resolução de problemas matemáticos."}, {"question": "A metacognição é uma transferência demonstrada?", "answer": "Observar o próprio raciocínio é uma proposta pedagógica útil. Não basta para estabelecer que esse hábito se transfira automaticamente do xadrez para a matemática."}, {"question": "É necessário um tempo mínimo por lance para raciocinar?", "answer": "Nenhum limite cerebral de quinze a trinta segundos é estabelecido aqui. Um ritmo mais lento oferece mais tempo para explicar suas escolhas, sem garantir benefício escolar."}, {"question": "Quantas soluções existem para o problema das oito rainhas?", "answer": "Existem 92 disposições no tabuleiro 8×8. Agrupá-las por simetrias produz doze classes, cujos tamanhos não são todos iguais."}]
---

Um grande mestre não é necessariamente capaz de calcular uma integral mais rápido que você. Ainda assim, a ideia de que “xadrez melhora a matemática” volta às escolas e aos clubes. O tabuleiro oferece problemas matemáticos; isso não basta para provar que jogar melhore automaticamente os resultados escolares.

## Por que aproximar as duas disciplinas?

No xadrez, as regras determinam as ações possíveis e suas consequências. Você não joga dados para saber se seu bispo chegará a uma casa. Ao calcular uma variante, examina possibilidades e depois verifica o que resiste às respostas adversárias.

Você pode aproximar esse processo da resolução de um problema: entender os dados, formular uma hipótese, buscar um contraexemplo, verificar a conclusão. É uma analogia de método. Não constitui uma medida da transferência entre as duas atividades.

### Dois problemas em um tabuleiro

O passeio do cavalo consiste em visitar cada casa exatamente uma vez usando os movimentos legais do cavalo. Se representar as casas como vértices e os saltos como arestas, você procura um caminho hamiltoniano nesse grafo. Essa tradução permite trabalhar um conceito matemático a partir de um objeto familiar, sem afirmar que o problema fundou sozinho toda uma área da matemática.

![Passeio do cavalo: percurso que visita cada uma das 64 casas uma única vez, calculado pela heurística de Warnsdorff.](/images/pt-br/echecs-maths-01-tour-cavalier.svg)

O problema das oito rainhas pede colocar oito rainhas sem que se ataquem. A sequência A000170 da OEIS registra 92 soluções para oito rainhas. As simetrias as agrupam em doze classes; não se pode simplesmente multiplicar todas por oito, porque algumas soluções têm simetrias próprias.

![Problema das oito rainhas: colocar oito rainhas no tabuleiro sem que nenhuma ameace outra. Uma das 92 soluções.](/images/pt-br/echecs-maths-02-huit-dames.svg)

É um recurso didático para a busca com retrocesso: você coloca uma rainha, verifica as restrições e volta a uma escolha quando ela bloqueia a continuação. Não se deve deduzir disso que não sabemos construir nenhuma solução para um tabuleiro de tamanho diferente.

## Contar sequências não é contar posições

As verificações *perft* do projeto Stockfish fornecem 119.060.324 sequências legais de seis meios-lances a partir da posição inicial, três lances de cada lado. Várias sequências podem chegar à mesma posição: esse número não conta posições distintas.

Shannon (1950) propõe a ordem de grandeza $10^{120}$ para ilustrar o tamanho de uma árvore de partidas. É uma estimativa, não a quantidade exata de posições legais. Para entender a exploração dessa árvore, leia [minimax](/pt-br/blog/minimax-no-xadrez/) e [o artigo sobre a complexidade do xadrez](/pt-br/blog/xadrez-problema-matematico-impossivel-e-ia/).

Uma árvore de lances só se torna uma árvore de probabilidades se você acrescentar um modelo probabilístico. As regras de um jogo sem acaso não atribuem espontaneamente uma probabilidade a cada resposta adversária.

## O ponto delicado: a transferência para a matemática

Você pode melhorar no reconhecimento de padrões de xadrez sem melhorar todas as outras capacidades. Essa é a questão da transferência distante: o benefício de um treinamento ultrapassa as tarefas próximas daquilo que foi praticado?

A síntese de Sala e Gobet (2017) destaca os limites das evidências e a importância dos grupos de controle ativos. Se um grupo recebe aulas de xadrez e outro não recebe nada comparável, a atenção adicional, a novidade ou as expectativas podem contribuir para as diferenças.

Em seus dois experimentos sobre resolução de problemas matemáticos, Sala e Gobet (2017) não encontram um benefício que confirme a transferência esperada com esse tipo de controle. Seria contraditório apresentar depois a metacognição como a “única transferência cientificamente provada” sem evidência específica suficiente.

A apresentação anterior de um estudo de Trier não fornecia uma referência verificável para apoiar a conclusão anunciada. Por isso, não serve aqui como argumento para trocar uma hora de matemática por uma hora de xadrez.

## Usar o jogo como apoio ao raciocínio

Você pode, ainda assim, fazer um exercício específico com uma posição. Escreva sua hipótese antes de ver a solução: “Esta torre pode entrar porque a última fileira está fraca”. Depois procure a melhor defesa adversária. Se ela refutar sua ideia, explique onde o raciocínio deixou de funcionar.

Esse processo também pode ser trabalhado explicitamente em matemática. Por exemplo: escrever uma conjectura, testar um caso que poderia contradizê-la e distinguir um exemplo favorável de uma demonstração. A aproximação vira uma atividade de ensino construída, em vez de um efeito presumido de simplesmente jogar.

### Escolher um ritmo que deixe um registro

Uma partida lenta oferece mais tempo para registrar seus candidatos e explicar sua escolha. Uma partida rápida pode servir para rever padrões e perceber o que falta sob pressão. Nenhum limite universal de segundos por lance permite declarar que seu córtex finalmente começa a raciocinar.

Se o objetivo é escolar, mantenha exercícios escolares e meça as habilidades pretendidas. Se o objetivo é de xadrez, examine seus erros de cálculo e compreensão. Nos dois casos, um progresso observável vale mais que uma promessa geral de inteligência.

## Um problema de contagem para propor no clube

Pergunte a um colega quantos quadrados tem um tabuleiro de xadrez. Sua primeira resposta será muitas vezes o produto de oito por oito. Essa resposta conta corretamente as casas. Mas se você aceitar também os quadrados cujos lados seguem as linhas do tabuleiro e que abrangem várias casas, é necessário especificar o enunciado. Caso contrário, duas pessoas podem defender respostas diferentes sem se equivocar em seus cálculos. Escreva a regra: cada quadrado alinhado à malha do tabuleiro conta uma vez, independentemente da cor das suas casas.

Comece em um tabuleiro menor do que você desenha em uma folha. Em uma grade de três quadrados de lado, há nove pequenos quadrados, quatro quadrados de duas casas de lado e um único grande quadrado. Você pode nomear um quadrado pela sua casa no canto inferior esquerdo e o comprimento do seu lado. Para cada comprimento, você nunca pode colocar o canto muito longe para a direita ou muito alto. Cada escolha permitida de coluna, no entanto, combina com cada escolha permitida de linha. É por isso que uma multiplicação aparece no cálculo.

No tabuleiro completo, um quadrado de três casas de lado pode começar em uma das seis primeiras colunas e uma das seis primeiras fileiras. Você tem 36 posições. Repita para cada comprimento e depois some: as oito contribuições valem sessenta e quatro, quarenta e nove, trinta e seis, vinte e cinco, dezesseis, nove, quatro e uma. A soma dessas parcelas vale duzentos e quatro. Você pode conferir seu cálculo invertendo o sentido do raciocínio: o grande quadrado tem uma posição possível, seu vizinho imediatamente menor tem quatro, e assim por diante. Esta verificação serve também para detectar uma confusão clássica entre o número de casas e o número de linhas que as separam.

Como transformar isso em um verdadeiro problema de pesquisa? Mude uma única restrição: o quadrado deve conter a casa a1. Resta um para cada comprimento. Todos têm o canto inferior esquerdo em a1. Mude a restrição para d4. Para os quadrados de duas casas de lado, d4 pode ser cada um dos quatro cantos, porque nenhuma borda incomoda. Para aqueles de oito casas de lado, ela só pode pertencer ao tabuleiro de xadrez inteiro. Desta vez seria errado multiplicar o número de comprimentos por um mesmo coeficiente. A proximidade da borda conta, embora a cor da casa pareça mais impressionante à primeira vista.

## Passar do cálculo para a prova com duas torres

Em um tabuleiro vazio, quantas maneiras de colocar duas torres brancas para que elas não compartilhem nem linha nem coluna? Suponha primeiro que uma delas tenha uma fita vermelha. A torre marcada pode ir em qualquer uma das sessenta e quatro casas. Uma vez colocada, elimina, para a segunda torre, a própria fileira e a própria coluna. Há sete linhas possíveis e sete colunas possíveis. O produto vale 49. Assim, você obtém 3.136 colocações de torres distinguíveis.

Retire a fita. Cada diagrama final foi contado exatamente duas vezes, porque qualquer uma das duas torres poderia ter ocupado a primeira casa escolhida. Restam, portanto, mil e quinhentos e sessenta e oito diagramas. Compare este resultado com a questão das oito damas. Aqui a divisão por dois é justificada para todos os diagramas pela mesma troca de rótulos. Para simetrias geométricas de uma colocação de damas, pelo contrário, é necessário olhar se uma transformação deixa certas colocações inalteradas. A presença de um grupo de transformações não basta, por si só, para escolher um divisor.

Você pode verificar a resposta sem usar uma torre marcada. Escolha duas linhas distintas entre oito: existem vinte e oito pares possíveis. Escolha duas colunas da mesma maneira. Nas quatro intersecções, apenas duas colocações ocupam uma vez cada linha e uma vez cada coluna. Multiplique vinte e oito por vinte e oito e depois por dois. Você encontra o mesmo total por um caminho que descreve diretamente os diagramas. Se os dois métodos tivessem dado resultados diferentes, procurar qual objeto tinha sido contado duas vezes teria sido muito mais instrutivo do que recomeçar a multiplicação.

Para prolongar a atividade, marque três casas proibidas no tabuleiro e mantenha as duas torres. O argumento que dava quarenta e nove possibilidades após a primeira escolha não se aplica mais uniformemente. Uma casa já proibida pode estar na fileira que a primeira torre acabou de tornar inutilizável. Experimente um tabuleiro menor, onde você pode listar as colocações à mão, e depois procure quais casas permanecem equivalentes. Assim, você fez uma tarefa matemática a partir da movimentação de uma peça, com suposições variadas e uma correção verificável. Ganhar mais jogos não é necessário para ver que você já sabe contar melhor essas configurações.

Você pode tornar visível a divisão por dois usando cartões. Em um cartão escreva “torre marcada em a1, outra em c3”; em outro, inverta os rótulos. Ao cobrir a palavra “marcada”, os dois cartões representam exatamente o mesmo diagrama. Faça o mesmo com duas torres que compartilham uma coluna e descarte ambas as versões. O argumento vale somente para as configurações permitidas pelo enunciado.

## Fontes

- OEIS Foundation (sem data), *A000170: Number of ways of placing n nonattacking queens on an n×n board*, base matemática, [sequência e referências](https://oeis.org/A000170).
- Equipe Stockfish (sem data), *tests/perft.sh*, código oficial de verificação das sequências legais, [repositório](https://github.com/official-stockfish/Stockfish/blob/master/tests/perft.sh).
- Shannon, C. E. (1950), *Programming a Computer for Playing Chess*, Philosophical Magazine, 41, 256–275, [original](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf).
- Sala, G. e Gobet, F. (2017), *Does chess instruction improve mathematical problem-solving ability? Two experimental studies with an active control group*, Learning & Behavior, [artigo](https://link.springer.com/article/10.3758/s13420-017-0280-3).
- Sala, G. e Gobet, F. (2017), *Does Far Transfer Exist? Negative Evidence From Chess, Music, and Working Memory Training*, Current Directions in Psychological Science, [síntese](https://journals.sagepub.com/doi/full/10.1177/0963721417712760).
