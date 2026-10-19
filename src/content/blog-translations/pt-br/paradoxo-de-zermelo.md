---
title: "Paradoxo de Zermelo: a imperfeição do jogo perfeito"
excerpt: "O valor do xadrez com jogo perfeito a partir da posição inicial continua desconhecido. Determinação do jogo, prova histórica e bases de finais ajudam a distinguir existência de uma resposta, cálculo e desempenho."
seoTitle: "Zermelo e xadrez: valor teórico e resultado desconhecido"
seoDescription: "Resultado sob jogo perfeito, regras de término e bases de finais: o que o modelo de Zermelo garante, sem afirmar conhecer o valor da posição inicial."
frSlug: "paradoxe-de-zermelo"
faq: [{"question": "O teorema de Zermelo prova que as brancas ganham?", "answer": "Não. Prova que existe uma resposta entre três possibilidades: vitória das brancas, vitória das pretas ou empate. Não diz qual. A posição inicial não está resolvida; uma avaliação de motor não prova seu valor."}, {"question": "Por que isso é chamado de paradoxo?", "answer": "Não é um paradoxo matemático, mas uma separação entre saber que existe um valor sob as regras fixadas e conhecer esse valor a partir da posição inicial. A existência está estabelecida, enquanto o resultado permanece desconhecido."}, {"question": "As bases de finais contradizem Zermelo?", "answer": "Não. Nas posições cobertas por uma base, o resultado é determinado segundo suas regras e métricas; exceções como direitos de roque precisam ser consideradas. As bases oferecem resultados calculados em um subconjunto acessível de posições."}, {"question": "Por que AlphaZero pode vencer Stockfish sem jogar perfeitamente?", "answer": "Nenhum dos dois demonstrou uma estratégia perfeita desde a posição inicial. No match de 2017, Stockfish 8 associa busca alfa-beta e avaliação escrita à mão; AlphaZero associa uma rede aprendida e busca em árvore Monte Carlo. Um resultado melhor em um match não mede a distância de uma estratégia ótima desconhecida."}, {"question": "Essa verdade matemática poderá ser descoberta?", "answer": "A solução exaustiva ultrapassa os meios atuais. Isso não prova que nenhum método futuro possa resolver o jogo. O algoritmo de Grover trata de busca não estruturada: não se pode simplesmente dividir por dois o expoente da árvore minimax do xadrez."}]
heroImageAlt: Um labirinto circular escuro com um caminho azul até o centro vazio.

---

Em 1912, no quinto Congresso Internacional de Matemáticos em Cambridge, o alemão [Ernst Zermelo, em francês](https://fr.wikipedia.org/wiki/Ernst_Zermelo) apresentou um resultado que mudaria a maneira de matemáticos e, depois, cientistas da computação pensarem os jogos de estratégia. Seu teorema é curto. Sua prova é elegante. As implicações para o xadrez são ao mesmo tempo tranquilizadoras e vertiginosas.

## Ernst Zermelo e a teoria dos conjuntos

Antes do xadrez, é preciso entender quem foi Zermelo. É conhecido sobretudo por contribuições fundamentais à teoria dos conjuntos, especialmente o [axioma da escolha, em francês](https://fr.wikipedia.org/wiki/Axiome_du_choix) e os axiomas de Zermelo–Fraenkel, em francês, que continuam entre os fundamentos usuais da matemática.

Seu interesse pelo xadrez não era casual. Matemáticos da época buscavam formalizar o raciocínio lógico em sistemas rigorosos. Jogos de estratégia com informação perfeita ofereciam um campo adequado: regras precisas, quantidade finita de estados e ausência de acaso. A pergunta natural era: existe, em teoria, uma maneira “perfeita” de jogar?

## O teorema de Zermelo: enunciado e prova

O teorema se aplica a uma classe que inclui o xadrez: jogos de dois participantes em confronto direto, sem coalizão, com informação perfeita, sem nada escondido, sem acaso, com turnos alternados e que sempre terminam em uma quantidade finita de lances.

**Enunciado moderno nesse contexto finito:** um dos jogadores pode forçar a vitória, ou cada um tem uma estratégia que garante pelo menos o empate. Nesse último caso, a oposição ótima leva ao empate. Esse enunciado deve ser distinguido do conteúdo exato do texto histórico de Zermelo, discutido mais adiante.

![Três valores possíveis com jogo perfeito, sem solução conhecida desde a posição inicial](/images/pt-br/zermelo-01-trois-issues.svg)

Em uma árvore finita, é possível compreender o resultado por **indução retroativa**, como no [minimax](/pt-br/blog/minimax-no-xadrez/). Essa apresentação didática não é a prova original de Zermelo: Schwalbe e Walker destacam justamente que o texto de 1913 não segue esse procedimento. Shannon publica seu artigo em 1950, 37 anos depois, sem que isso estabeleça uma reprodução “tal e qual” da prova.

Imagine um fim de partida alcançado. Cada posição terminal é uma vitória das brancas, uma vitória das pretas ou um empate. Agora retroceda um lance. Se é a vez das brancas, elas podem escolher a posição terminal acessível mais favorável. O mesmo vale para as pretas. Repetindo o processo desde todas as posições terminais até a inicial, cada posição na árvore recebe um valor definido: vitória das brancas, vitória das pretas ou empate.

O valor da posição inicial está, portanto, determinado. Ou o primeiro jogador tem estratégia para forçar a vitória, ou ambos podem garantir o empate, ou o segundo jogador tem estratégia para forçar a vitória.

![Exemplo moderno de indução retroativa em uma árvore fictícia](/images/pt-br/zermelo-02-backward-induction.svg)

### Uma prova aperfeiçoada posteriormente

Schwalbe e Walker distinguem o original de 1913 de suas formulações modernas. Zermelo admite sequências infinitas de lances e se interessa especialmente pela duração necessária para forçar uma vitória. König (1927) e Kalmár (1928/1929) prolongam a análise. É preciso separar essa história da demonstração elementar em árvore finita apresentada aqui.

Para tratar o xadrez moderno como jogo finito, é necessário incluir as regras de término. Repetição tripla e cinquenta lances abrem o direito de reivindicar empate; as regras automáticas de repetição quíntupla e 75 lances têm um papel distinto, como lembra o manual FIDE dos árbitros.

### Por que parece paradoxal

O paradoxo de Zermelo não é lógico. É prático. O teorema garante que a resposta existe e é única, mas não diz qual é. Sobretudo, não fornece por si um método praticável para encontrá-la.

Uma exploração exaustiva ingênua consideraria uma quantidade enorme de sequências. Shannon propõe a ordem de grandeza $10^{120}$ sob suas hipóteses: não é uma contagem exata de todas as partidas legais.

Como cálculo hipotético, examinar $10^{120}$ elementos a uma taxa de $10^{20}$ por segundo exigiria $10^{100}$ segundos. Isso ilustra um custo sob hipóteses específicas; não prova que nenhum outro método possa estabelecer o valor do jogo. O artigo sobre [os limites do cálculo no xadrez](/pt-br/blog/xadrez-problema-matematico-impossivel-e-ia/) desenvolve essa distinção.

## A verdade desconhecida do xadrez

A grande pergunta em aberto é: qual é o valor do xadrez com jogo perfeito? O teorema é um dos cinco conceitos fundadores da [teoria dos jogos aplicada ao xadrez](/pt-br/blog/teoria-dos-jogos-no-xadrez/).

Pode-se conjecturar um empate, mas nem a frequência de empates entre jogadores fortes nem uma avaliação de motor constituem prova. Essas observações envolvem adversários e orçamentos de cálculo específicos, não todas as respostas possíveis a uma estratégia.

Uma avaliação de Stockfish, em francês depende da versão, profundidade e tempo concedido. Uma pequena vantagem numérica não significa vitória forçada nem distância medida até a solução perfeita. O teorema mantém abertas as três possibilidades desde a posição inicial.

## Finais resolvidos: uma janela para o valor exato

Se a posição inicial do xadrez permanece sem solução, existe uma área em que foi possível resolver conjuntos completos de posições: finais com poucas peças.

As bases de finais, em francês, desenvolvidas por Ken Thompson e depois Marc Bourzutschky e outros, permitem tratar grandes conjuntos de finais, inclusive posições com sete peças. A cobertura e o significado de um resultado dependem da base: direitos de roque e regra dos cinquenta lances, por exemplo, exigem atenção.

As bases mostram principalmente por que é preciso especificar regras e métricas. A documentação de Ronald de Man apresenta, por exemplo, um final com valor DTZ50 de 164 meios-lances e uma “vitória amaldiçoada”: vencedora sem o limite dos cinquenta lances, mas não necessariamente com essa regra.

### DTM e DTZ: duas distâncias diferentes

DTM mede a distância até o mate; DTZ, a distância até uma captura ou movimento de peão que zera o contador. Otimizar cada uma pode levar a lances diferentes. Não são duas verdades contraditórias: são perguntas distintas, e é preciso dizer se a regra dos cinquenta lances é considerada. As bases Syzygy usuais fornecem WDL e DTZ, não uma distância DTM universal.

![Bases de finais: definir a pergunta e as regras](/images/pt-br/zermelo-04-dtm-dtz.svg)

## A imperfeição estrutural do jogador humano

O paradoxo revela algo fundamental sobre o humano: joga um jogo cuja “perfeição” é definida matematicamente, mas cujo valor desde a posição inicial ainda é desconhecido.

Um jogador se apoia no cálculo, no reconhecimento de padrões e na avaliação posicional. Podemos observar suas decisões e comparar resultados com os adversários; isso não fornece uma medida geral da distância até uma estratégia ótima desconhecida.

Os desempenhos de jogadores e motores podem ser comparados em partidas. Não oferecem uma distância medida até a estratégia perfeita, pois ela permanece desconhecida no conjunto do jogo. Algumas posições cobertas por bases de finais permitem, porém, verificar uma decisão segundo suas regras.

## O jogo perfeito não é o jogo ideal

Outra dimensão do paradoxo é filosófica. Mesmo se a estratégia perfeita estivesse escrita, você realmente a jogaria?

Imagine que as brancas tenham vitória forçada em oitenta lances desde a posição inicial. Seguir essa estratégia significaria que o resultado teórico já estaria determinado no primeiro lance. O adversário poderia escolher qualquer resposta e a estratégia manteria o ganho. Isso mudaria a questão teórica. A prática humana, porém, poderia continuar: saber que uma estratégia existe e conseguir aplicá-la em cada posição são coisas diferentes.

O fato de o xadrez ser complexo a ponto de não conhecermos uma estratégia perfeita contribui para sua vitalidade. A imperfeição humana sustenta parte de seu interesse como disciplina artística e esportiva.

Esse é o paradoxo filosófico: a beleza e a riqueza do jogo também se alimentam do desconhecimento coletivo do seu valor matemático. Se todos soubessem tudo de antemão, a experiência mudaria. O mistério é parte do seu combustível.

## Zermelo e os jogos resolvidos

A comunidade de computação resolveu progressivamente jogos de complexidade crescente, seguindo a lógica da determinação do resultado.

O [jogo da velha, em francês](https://fr.wikipedia.org/wiki/Morpion) termina em empate com jogo perfeito, uma estratégia acessível a quem a aprende. O [Lig-4, em francês](https://fr.wikipedia.org/wiki/Puissance_4) foi resolvido em 1988: vitória do primeiro jogador. As damas inglesas 8×8, *checkers*, foram resolvidas em 2007 por [Jonathan Schaeffer, em francês](https://fr.wikipedia.org/wiki/Jonathan_Schaeffer): empate com jogo perfeito, após dezoito anos de cálculo em um jogo com cerca de $5 × 10^{20}$ posições possíveis; nem todas foram percorridas individualmente.

![Situação de alguns jogos, sem comparar tamanhos incompatíveis](/images/pt-br/zermelo-03-jeux-resolus.svg)

O [xadrez, em francês](https://fr.wikipedia.org/wiki/%C3%89checs) continua em aberto. O [Go, em francês](https://fr.wikipedia.org/wiki/Go_(jeu)) também. O valor a partir da posição inicial não está estabelecido. A explosão combinatória atrapalha os métodos exaustivos atuais; não demonstra a impossibilidade de toda prova futura, e as regras exatas precisam ser especificadas para cada jogo.

## O que Zermelo muda para você no tabuleiro

Saber que o valor inicial continua desconhecido muda algo para o jogador prático? Não diretamente no tabuleiro. Mas muda a maneira de pensar o jogo.

Em uma posição complexa, suas variantes e sua avaliação geralmente são parciais. Existem, porém, certezas locais: um mate forçado corretamente estabelecido ou uma posição coberta por base de finais pode ser resolvida sob regras precisas. É preciso distinguir esses casos do desconhecido que permanece desde a posição inicial.

A distinção ajuda diante de um adversário mais forte: um desempenho melhor não garante uma solução exata de cada posição. Mas também não diz que ele desconheça um final conhecido ou um mate forçado. Compare variantes concretas, tempo disponível e justificativa do lance, em vez de um suposto grau de proximidade com a perfeição.

A contribuição de Zermelo não é uma estratégia para ganhar desde o início. Seu texto funda uma análise matemática do valor das posições; as formulações modernas separam a existência de um valor sob regras fixadas dos meios de calculá-lo.

**Depois da leitura:** lembre uma **frase de humildade matemática** em partidas longas: muitas decisões são aproximações, distintas de uma solução verificada por base de finais. Isso pode ajudar a relativizar a exigência de perfeição.

---

## Perguntas frequentes

### O teorema de Zermelo prova que as brancas ganham?

Não. Prova que existe **uma** resposta entre três possíveis: vitória das brancas, vitória das pretas ou empate. Não diz qual. A posição inicial não está resolvida; uma avaliação de motor não prova seu valor.

### Por que isso é chamado de paradoxo?

Matematicamente, não é um paradoxo: é um resultado coerente. O “paradoxo” é **epistêmico**: sabemos que existe um valor sob as regras fixadas, mas o da posição inicial continua desconhecido. Isso não prova que nenhum método futuro possa determiná-lo. É uma separação clara entre *certeza da existência* e *possibilidade de acesso*.

### As bases de finais contradizem Zermelo?

Ao contrário, **confirmam** a determinação em um subconjunto do problema. Nas posições cobertas, o resultado é determinado segundo suas regras e métricas; exceções como direitos de roque precisam ser consideradas. São resultados calculados em um conjunto finito e acessível de posições.

### Por que AlphaZero pode vencer Stockfish sem jogar perfeitamente?

Nenhum demonstrou uma estratégia perfeita desde a posição inicial. Ambos associam busca e avaliação, com **arquiteturas diferentes** no match de 2017: Stockfish 8 usa alfa-beta e avaliação escrita à mão; AlphaZero associa rede aprendida e MCTS. Um resultado melhor no match não mede a distância até uma estratégia ótima desconhecida.

### Essa verdade matemática poderá ser descoberta?

A solução exaustiva ultrapassa os meios atuais. Isso não demonstra que nenhum método futuro possa resolver o jogo. Invocar Grover para trocar diretamente $10^{120}$ por $10^{60}$ é injustificado: uma árvore adversarial não é uma simples lista de soluções para buscar.

## Fontes

- Zermelo, E. (1913). *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels*. Atas do quinto Congresso Internacional de Matemáticos, vol. II, 501–504. [Tradução no apêndice do texto de Schwalbe e Walker](https://studylib.net/doc/28166551/zermelo-work).
- Schwalbe, U., & Walker, P. (1999, versão revista do documento de trabalho de 1997). *Zermelo and the Early History of Game Theory*. University of Mannheim / University of Canterbury. [Texto integral consultado](https://studylib.net/doc/28166551/zermelo-work): diferença entre prova original e apresentação moderna.
- Shannon, C. E. (1950). *Programming a Computer for Playing Chess*. Philosophical Magazine, 41, 256–275. [Artigo original](https://www.computerhistory.org/chess/doc-431614f453dde/).
- De Man, R. (sem data). *Probetool*. GitHub. [Documentação das bases Syzygy](https://github.com/syzygy1/probetool): WDL, DTZ50 e exemplo de vitória amaldiçoada.
- FIDE (2022). *Arbiters’ Manual*. [Manual e regras de empate](https://arbiters.fide.com/wp-content/uploads/Publications/Manual/ARBManual2022_1st_October.pdf).
- Allis, V. (1988). *A Knowledge-based Approach of Connect-Four*. Vrije Universiteit Amsterdam. [Dissertação](https://tromp.github.io/c4/connect4_thesis.pdf): exemplo do Lig-4 citado no texto.

- Schaeffer, J., et al. (2007). *Checkers Is Solved*. Science, 317, 1518–1522. [Artigo integral](https://www.cs.cornell.edu/courses/cs6700/2013sp/readings/06-b-Checkers-Solved-Science-2007.pdf).
