---
heroImageAlt: Duas bolinhas soltas em pontos quase iguais de um plano inclinado
  chegam a cantos opostos.
title: "Teoria do caos no xadrez: a ordem na tempestade"
excerpt: "Um pequeno erro pode mudar uma partida. A teoria do caos oferece uma analogia sugestiva, desde que não se confunda uma posição difícil com um sistema caótico demonstrado."
seoTitle: "Teoria do caos e xadrez: uma analogia com limites"
seoDescription: "Posições tensas e lances que mudam tudo: distinga a analogia do caos no xadrez de um modelo dinâmico, um expoente de Lyapunov ou uma prova."
frSlug: "theorie-du-chaos-aux-echecs"
faq: [{"question": "O xadrez é caótico no sentido matemático?", "answer": "Uma posição tática instável não basta para demonstrar isso. Aqui, caos é uma analogia: nenhum expoente de Lyapunov do xadrez é estabelecido."}, {"question": "O caos envolve apenas sistemas contínuos?", "answer": "Não. Sistemas de tempo discreto também podem apresentar caos. É preciso especificar seu espaço de estados e sua dinâmica antes de aplicar uma definição matemática."}, {"question": "Complicar sempre favorece o jogador mais fraco?", "answer": "Não. As complicações podem criar oportunidades para ambos e dificultar sua própria defesa. Nenhum limite Elo universal é estabelecido aqui."}]
---

Um lance a mais, uma peça mal colocada e toda a estrutura desmorona. Em uma partida taticamente tensa, você pode sentir que o menor detalhe muda tudo. A palavra “caos” descreve bem essa experiência. Dar a ela um sentido matemático exige mais.

## O que a teoria do caos estuda

Nas notas de aula, Semyon Dyatlov (2015) apresenta sistemas dinâmicos cujas trajetórias e propriedades estatísticas podem ser estudadas com precisão. Também oferece exemplos de tempo discreto. O caos não se limita, portanto, às equações que evoluem em tempo contínuo.

Para aplicar essas ideias, é preciso definir os estados do sistema, sua evolução e a maneira de comparar duas trajetórias. Um tabuleiro, dois jogadores escolhendo lances e uma avaliação de motor não fornecem automaticamente esse modelo.

## Uma casa pode mudar tudo

Um peão em f3, em vez de f4, pode mudar as casas controladas e as possibilidades de ataque. É uma casa de diferença, não uma “meia casa”. Ainda é preciso verificar se as duas posições comparadas são legais.

Essa observação de xadrez não demonstra uma divergência exponencial. A pontuação de um motor é uma estimativa que depende da busca; comparar duas avaliações em várias profundidades não fornece, sozinho, um expoente de Lyapunov.

Da mesma forma, chamar um lance crítico de “bifurcação” pode ajudar a contar a partida. Não prova que seja uma bifurcação no sentido da teoria de sistemas dinâmicos. O estilo de um jogador também não é um atrator estranho medido.

## A dificuldade real: buscar o suficiente

O capítulo de Russell e Norvig sobre busca adversarial apresenta o efeito horizonte: interromper uma busca pode deixar um acontecimento importante além do limite examinado. A busca de quiescência prolonga certas sequências táticas para evitar avaliar cedo demais uma posição instável. Não garante que todo perigo seja visto.

Esse problema computacional basta para explicar que uma análise mude ao receber mais recursos. Não é necessário atribuir a ela um mecanismo caótico. Para os princípios da busca, leia [o artigo sobre minimax](/pt-br/blog/minimax-no-xadrez/).

## Como analisar uma partida que mudou de rumo

Retome uma partida recente em que perdeu o fio. Antes de ligar o motor, escreva o que tinha calculado e a resposta adversária que surpreendeu. Depois compare seus lances candidatos nas mesmas condições de análise.

Procure uma explicação de xadrez: ameaça esquecida, peça indefesa, troca que abre uma linha. Se a avaliação variar com a profundidade, mantenha essa incerteza no comentário. Um valor exibido não substitui a variante que o justifica.

Você pode chamar esse trecho de momento crítico. Evite deduzir que toda a partida tem um “lambda alto”: nenhuma medida desse tipo é estabelecida nas fontes deste artigo.

## É preciso complicar contra alguém mais forte?

As complicações podem oferecer chances práticas, mas também dão mais coisas para você calcular. Uma posição que o adversário conhece melhor pode facilitar a tarefa dele, mesmo que pareça desordenada para você.

Escolha uma sequência cujos recursos e riscos compreenda. Na análise, pergunte se havia uma defesa mais simples ou se as complicações realmente ofereceram uma chance. A pergunta é mais útil que uma regra geral baseada em uma diferença de 300 Elo.

A analogia do caos mantém, assim, seu lugar: expressa uma impressão de fragilidade. Verificar uma combinação continua sendo um trabalho de variantes, regras e cálculo.

## Duas aberturas quase gêmeas para jogar novamente

Aqui estão duas experiências que você pode montar em seu tabuleiro de xadrez. Na primeira, jogue 1. f3 e5 2. g4. Na segunda, jogue 1. f3 e5 2. g3. As pretas jogam em ambas as posições. As peças ocupam as mesmas casas, exceto o peão branco da coluna g. Antes de continuar, tente a mesma saída da dama em ambos os casos e anuncie o que você está esperando. Qual a diferença dessa mudança de uma única casa?

No primeiro tabuleiro, a dama preta sai de d8, passa por e7, f6 e g5, e depois chega em h4. A diagonal para o rei branco passa por g3 e depois por f2. O peão f deixou f2 e o peão g ultrapassou g3. As duas casas estão livres. O rei está em xeque. Dama e bispo ocupam as casas vizinhas na primeira fileira, e os peões em d2 e e2 também limitam a fuga. A dama preta controla f2. Nenhuma peça branca pode capturar a dama ou interpor-se em g3 ou f2. É xeque-mate. Esta conclusão é acessível verificando as respostas legais; não depende de uma apreciação sobre a qualidade do jogo branco.

No segundo tabuleiro, a dama também pode vir em h4, mas o peão branco está justamente em g3. Ele fecha a diagonal e ataca a dama em h4. As brancas podem capturá-la por gxh4. Seria tentador concluir que as brancas estão ganhas desde o início desta segunda variante. Agora você impôs às pretas um lance que perde a dama. A conclusão estabelecida é apenas sobre essa saída da dama. Você mostrou por que um plano funciona em um caso e falha no outro; você não resolveu a segunda posição contra o melhor jogo das pretas.

Este detalhe muda a maneira de anotar uma partida. A frase "uma pequena perturbação inverteu o resultado" escamoteia duas decisões: as brancas escolheram o comprimento do passo de seu peão e, em seguida, as pretas levaram ou não em conta sua nova casa. Você pode dar uma explicação mais instrutiva, indicando a diagonal decisiva e a resposta que a refuta. Um leitor que saiba reconhecer este detalhe não precisará memorizar os quatro primeiros meios-lances.

## Qual a distância entre duas posições?

Faça variar o seu instrumento de medição. Se você contar as peças que mudaram de casa entre as duas posições anteriores, sua resposta é uma. Se você conta as casas cujo conteúdo difere, sua resposta é duas: g3 está vazia em um tabuleiro de xadrez, g4 no outro. Se você contar as diferenças de material, sua resposta é zero. Essas três respostas estão corretas. Elas não medem a mesma propriedade. Antes de afirmar que dois estados estão próximos, é preciso escolher as diferenças que importam para a questão.

Outro desafio em uma folha: você pode fabricar duas posições cujas peças ocupam exatamente as mesmas casas e, no entanto, não oferecem as mesmas decisões? Pense no roque. Um rei que voltou à sua casa original depois de um desvio perdeu seu direito de fazer o roque. Um desenho da posição não conta esse desvio. A história exigida pelas regras faz parte dos dados. De acordo com o problema, a vez de jogar, os direitos de roque e a possibilidade de uma captura en passant podem ser tão importantes quanto a ocupação das casas. Compreende-se por que um programa que comparasse apenas fotografias do tabuleiro confundiria às vezes duas situações distintas.

Tente também o caminho inverso. Jogue 1. Cf3 Cf6 2. g3 g6, em seguida, coloque as peças no lugar e jogue 1. g3 g6 2. Cf3 Cf6. O caminho difere, mas a posição das peças, a vez de jogar, os direitos de roque e as possibilidades imediatas de captura en passant coincidem. Os contadores de meios-lances desde o último movimento de peão diferem: eles importam quando se examinam as regras de empate por ausência de capturas ou de lances de peão. Para estudar o desenvolvimento dos bispos no próximo lance, no entanto, você pode examinar o mesmo diagrama. Portanto, dois caminhos separados podem se unir para uma questão específica. Uma divergência de notação na súmula não significa que as trajetórias se desviam em cada etapa.

## Observar a instabilidade sem criar um “índice de caos”

Suponha que você queira comparar duas maneiras de jogar uma posição tensa. Prepare uma árvore de respostas antes de olhar para uma avaliação. Para cada candidato branco, anote a ameaça que você acha que está criando, uma defesa das pretas que a neutraliza e um lance preto natural que poderia ignorá-la. Se a ameaça funcionar apenas neste último ramo, sua árvore descreve uma aposta sobre a reação adversa. Se ela funciona apesar das duas respostas, você ainda tem que verificar se há uma terceira defesa. Uma lista de lances encontrados à mão não garante a que a análise esteja completa.

Não resuma esta árvore somente pela diferença entre as pontuações mostradas no primeiro e no último lance. Uma mudança de pontuação pode corresponder a um recurso concreto descoberto mais tarde na pesquisa. Outra pode resultar de duas escolhas diferentes do jogador humano. Estas observações não têm o mesmo significado. Para separá-las, primeiro fixe uma sequência e compare o que o motor descobre com orçamentos de cálculo diferentes; em seguida, fixe o orçamento para examinar várias decisões ao mesmo tempo. Mantenha uma variante legível para cada comparação. Se você não pode dizer qual peça se beneficia da mudança, sua análise ainda exige trabalho.

Por fim, dê sua posição a um parceiro com uma única ordem: encontrar o detalhe que levaria você a abandonar seu primeiro candidato. Seu papel não é jogar uma partida inteira. Se ele encontrar uma defesa que você não tinha considerado, volte ao último momento em que seu candidato ainda era relevante. Foi antes de uma troca, antes da abertura de uma coluna, antes de o rei perder uma casa de fuga? É aqui que você pode colocar seu exercício para a semana seguinte. Você sabe exatamente o que você pede ao leitor para ver e como corrigir sua resposta.

No exemplo inicial, cubra o peão da coluna g com uma ficha. O parceiro precisa pedir exatamente uma informação para decidir se Dh4 dá mate. Pedir a casa do peão revela que ele entendeu a geometria da ameaça.

Cubra a coluna g outra vez e peça que o parceiro explique por que a posição da dama sozinha ainda não decide o diagnóstico de mate.

## Fontes

- Dyatlov, S. (2015), *Chaos in dynamical systems*, curso do MIT, [notas originais](https://math.mit.edu/classes/18.095/2015IAP/lecture9/lect_notes.pdf).
- Russell, S. e Norvig, P. (sem data), *Adversarial Search*, capítulo de manual disponibilizado pelos autores, [texto](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
