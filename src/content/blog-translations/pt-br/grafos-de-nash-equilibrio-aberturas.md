---
title: "Grafos de Nash: equilíbrio e aberturas no xadrez"
excerpt: "O equilíbrio de Nash oferece uma linguagem para pensar estratégias, mas não transforma uma abertura popular em teorema. Entenda a diferença entre modelo, avaliação e preparação prática."
seoTitle: "Equilíbrio de Nash e aberturas: modelo e limites"
seoDescription: "Nash, minimax e aberturas de xadrez: distinga equilíbrio matemático, avaliação de motor e preparação prática, sem confundir popularidade com prova."
frSlug: "graphes-de-nash-equilibre-ouvertures"
faq: [{"question": "Uma abertura popular é um equilíbrio de Nash demonstrado?", "answer": "Não. Popularidade, avaliação de motor ou empate entre campeões não provam uma estratégia ótima contra todas as respostas."}, {"question": "Por que representar posições por um grafo?", "answer": "Ordens de lances podem levar à mesma posição. O grafo das configurações também pode conter ciclos; é preciso especificar direitos de roque, captura en passant e o histórico necessário às regras de empate."}, {"question": "Variar minhas aberturas basta para formar um equilíbrio misto?", "answer": "Não. Uma distribuição de escolhas é uma estratégia mista em um modelo definido. Para demonstrar um equilíbrio, também é preciso estabelecer que ninguém ganha ao desviar sozinho, conforme os ganhos do modelo."}, {"question": "Uma avaliação igual prova o empate?", "answer": "Uma estimativa de motor em profundidade limitada não basta. Uma prova precisa abranger as respostas legais relevantes e as regras de término da partida."}]
heroImageAlt: Duas peças de xadrez apoiadas uma na outra em equilíbrio.

---

Por que certas aberturas continuam sendo jogadas apesar de décadas de análise? O equilíbrio de Nash oferece uma linguagem para pensar estratégias, mas não transforma uma variante popular em teorema.

O título “grafos de Nash” serve aqui como aproximação didática. Não designa uma teoria padrão que teria demonstrado a correção da Siciliana ou da Berlinesa.

## O que Nash define

Em *Non-Cooperative Games* (1951), John Nash descreve um perfil de estratégias em que nenhum jogador pode melhorar seu ganho mudando sozinho de estratégia, enquanto os demais mantêm as suas. O artigo ocupa as páginas 286 a 295, dez páginas; não deve ser confundido com sua breve nota de 1950.

Uma estratégia é uma maneira de escolher nas situações do jogo, não apenas o nome do primeiro lance. O teorema de existência para jogos finitos admite estratégias mistas; não fornece automaticamente os lances ótimos de uma partida de xadrez.

## O que isso significa no tabuleiro

No modelo usual de soma zero, cada lado prefere ganhar a empatar e empatar a perder. A análise minimax apresentada por Russell e Norvig busca uma estratégia contra as melhores respostas adversárias.

Uma linha julgada “igual” por um motor expressa outra coisa: uma estimativa com um método e um orçamento de busca. Um empate entre dois campeões é ainda outra informação. Nenhuma delas prova, sozinha, que todos os desvios possíveis foram cobertos.

Você pode, portanto, falar de um equilíbrio prático de preparação, desde que sinalize que é uma imagem. Se uma novidade muda a avaliação de uma linha, nosso conhecimento mudou; um equilíbrio matematicamente provado não é refutado por uma simples tendência teórica.

## Árvore das partidas e grafo das posições

Uma árvore mantém separadas as sequências de lances. Um grafo pode reunir sequências que chegam à mesma posição: são as transposições. Também precisa especificar o que chama de posição.

A disposição das peças nem sempre basta. O lado com a vez e os direitos de roque ou de captura en passant podem mudar os lances legais. Para aplicar todas as regras de empate, ainda é preciso guardar informações de histórico.

O grafo das configurações pode ter ciclos. Cavalos podem sair e voltar às casas iniciais. Uma árvore que mantém todo o histórico não confunde essas ocorrências. Seria, portanto, enganoso chamar sem explicação todo grafo de aberturas de “acíclico”.

![Qual informação você representa?](/images/pt-br/nash-03-graphe-transpositions.svg)

## Finais e valores calculados

As bases de finais podem fornecer um valor exato no seu domínio e segundo suas convenções. É preciso distinguir vitória, empate ou derrota, distância ao mate e distância a uma reinicialização do contador de lances. A documentação Syzygy destaca as regras de empate: uma distância da base nem sempre é uma quantidade de lances vencedores em toda situação de torneio.

Essa precisão torna os finais interessantes para discutir modelos: qual informação descreve o estado, qual regra encerra a partida e qual grandeza é calculada?

## Variar seu repertório: uma decisão prática

Se enfrenta frequentemente a mesma pessoa, variar suas aberturas pode tornar a preparação dela menos direcionada. Isso não prova que uma mistura de 50%, 30% e 20% seja um equilíbrio de Nash nem que exista um limite universal de cinco horas semanais de estudo para escolher um repertório.

Você pode olhar o custo de cada mudança: conhece os planos seguintes? Consegue explicar as posições a que chega? Ganha uma surpresa ao custo de uma posição que não entende? Essas perguntas bastam para organizar uma escolha de prática.

## Resultado esportivo e modelo

Um empate pode ser conveniente ou não conforme a classificação do torneio. Isso pode mudar as preferências que você deseja representar em um modelo. É preciso defini-las antes de anunciar um novo equilíbrio.

No modelo estritamente de soma zero, os dois jogadores não podem aumentar simultaneamente seu ganho. Importar sem cuidado o dilema do prisioneiro ou uma melhora coletiva de Pareto, portanto, confunde a análise.

Para aprofundar: [teoria dos jogos](/pt-br/blog/teoria-dos-jogos-no-xadrez/), [minimax](/pt-br/blog/minimax-no-xadrez/) e [Zermelo](/pt-br/blog/paradoxo-de-zermelo/).

## Uma pequena matriz para entender uma resposta melhor

Vamos construir um modelo pedagógico que não represente nenhuma abertura real. As brancas escolhem um repertório A ou B; as pretas escolhem uma preparação X ou Y. Os seguintes valores são os ganhos fictícios das brancas, sendo os das pretas seus opostos.

| Repertório das brancas  | Preparação X  | Preparação Y |
| ---  | ---:  | ---: |
| A  | 1  | -1 |
| B  | -1  | 1 |

Se as pretas sempre escolherem X, as brancas preferem A. Se as brancas sempre escolherem A, as pretas preferem Y. Cada escolha fixa permite, portanto, uma mudança vantajosa do outro lado: nenhuma casa é um equilíbrio em estratégias puras.

Suponhamos agora que os dois lados sorteiem suas escolhas, dando 50% de chance a cada opção. Para as brancas, A rende em média (1 - 1)/2  = 0, e B também. Escolher outra frequência não pode melhorar a sua esperança enquanto as pretas mantiverem a sua distribuição. O raciocínio simétrico vale para as pretas: este par de misturas constitui um equilíbrio do modelo.

Este cálculo ilustra a definição de [Nash](https://irving.vassar.edu/faculty/gj/FTU/io/literature/Nash51.pdf). Não determina nenhuma frequência ideal para a Siciliana ou Caro-Kann: os ganhos foram inventados para tornar o cálculo controlável. Para uma recomendação real, as opções, preferências e valores escolhidos devem ser justificados.

## Por que essa matriz não é todo o jogo de xadrez

Em uma partida, você vê os lances jogados antes de responder. Uma estratégia abrangente deve, portanto, prever uma conduta para cada história relevante, incluindo aquelas que não ocorrem na sua linha favorita. Reduzir esta estratégia para "jogar 1.e4" perde quase todas as informações.

Essa diferença também explica por que a imprevisibilidade não é suficiente para tornar um lance bom. Em um duelo de informação perfeita analisado por minimax, uma ação inferior não ganha um valor objetivo porque raramente é jogada. Ela pode surpreender um humano, o que pertence a outro modelo, incorporando uma preparação limitada ou erros.

É legítimo estudar esse segundo modelo. Só é preciso anunciar o que se otimiza: resultado contra um adversário conhecido, probabilidade de ganhar quando o empate não é suficiente, carga de memorização, ou desempenho contra uma determinada população. Dois objetivos diferentes podem recomendar repertórios diferentes sem contradição matemática.

## Transposição verificável no tabuleiro

**Exemplo pedagógico.** Compare as sequências 1.Cf3 Cf6 2.Cc3 Cc6 e 1.Cc3 Cc6 2.Cf3 Cf6. As mesmas peças ocupam as mesmas casas, as brancas têm a vez de jogar, nenhum direito de roque mudou e nenhuma captura en passant é possível. O contador desde o último movimento de peão ou a última captura é de quatro meios-lances em ambos os casos. Os seis campos FEN são idênticos; isso não significa que todos os históricos de repetição possíveis sejam intercambiáveis.

Numa árvore, os dois caminhos permanecem distintos. Em um grafo de posições, você pode reuni-los e evitar fazer a mesma análise novamente. Para verificar regras dependentes de repetições, no entanto, é necessário manter as informações relevantes nos caminhos: a identidade do diagrama não substitui todo o histórico.

O interesse prático é imediato. Um repertório organizado apenas como uma lista de sequências torna-se frágil se o adversário inverter dois lances. Um repertório organizado em torno de posições de referência permite que você reconheça que já conhece a estrutura, mesmo que a ordem tenha mudado.

## Popularidade, pontuação e avaliação: três indicadores para ler separadamente

Uma base pode mostrar-lhe que uma variante marca muitos pontos com as brancas. Antes de deduzir uma vantagem, veja quem a joga e contra quem. Uma linha usada pelos favoritos contra jogadores menos fortes pode mostrar uma excelente pontuação sem ser objetivamente superior às suas alternativas. As partidas rápidas e clássicas também não impõem as mesmas restrições.

Uma avaliação do motor traz outra informação: este programa, nesta posição e com esse tempo de cálculo, prefere um lance. Para aprofundar uma novidade, verifique as respostas críticas e a estabilidade da análise ao aumentar o tempo de análise. Uma preferência estável é mais utilizável do que uma variação breve de algumas centésimas; ainda não é uma prova exaustiva do valor inicial do jogo.

A popularidade mede o uso. Pode refletir uma moda, um ganho de preparação, disponibilidade de cursos ou uma preferência estratégica. Nenhum destes indicadores permite, por si só, deduzir os outros dois.

## Transformar o modelo em método de preparação

Escolha uma posição de referência no seu repertório e escreva três coisas. Que plano você gostaria de jogar se o adversário cooperasse? Qual é a resposta adversa que mais incomoda esse plano? Que transição para outro tipo de posição você estaria disposto a aceitar?

Em seguida, analise esta resposta incômoda primeiro. Você passa de uma preparação que confirma suas preferências para uma preparação que enfrenta as melhores objeções disponíveis. É a contribuição útil da linguagem das melhores respostas, mesmo quando você não tem um equilíbrio comprovado.

### Uma classificação que depende do repertório adversário

Imagine que duas aberturas dão os mesmos resultados médios no seu caderno. Ao reler as partidas, você descobre que usou a primeira principalmente contra adversários que trocam as damas cedo e a segunda contra jogadores que procuram roques em alas opostas. Sua média mistura então a escolha das aberturas e a escolha dos adversários. Para esclarecer sua próxima rodada, separe as respostas que esse adversário realmente joga das que as regras lhe permitem. Mesmo com observações perfeitas sobre seu repertório passado, você teria identificado um hábito, não demonstrado que ele não ganharia nada jogando de outra forma.

Experimente mudar apenas um valor da matriz e refazer as contas. Se a preparação X passar a render dois pontos às brancas quando elas escolhem A, sorteios iguais já darão médias diferentes a A e B. A frequência calculada dependia dos ganhos escolhidos.

Um colega pode conferir a mudança calculando as duas linhas sem conhecer sua resposta. Peça que identifique quem escolhe a linha e quem escolhe a coluna antes de interpretar o sinal do ganho.

## Fontes

- Nash, J. (1951). *Non-Cooperative Games*. Annals of Mathematics, 54(2), 286–295. [Artigo](https://irving.vassar.edu/faculty/gj/FTU/io/literature/Nash51.pdf).
- Russell, S., & Norvig, P. (sem data, capítulo on-line). *Adversarial Search*. Artificial Intelligence: A Modern Approach. [Capítulo](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Projeto Syzygy (sem data). *probetool: documentação das métricas de finais*. GitHub. [Documentação](https://github.com/syzygy1/probetool).
