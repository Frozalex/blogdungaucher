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

## Fontes

- Nash, J. (1951). *Non-Cooperative Games*. Annals of Mathematics, 54(2), 286–295. [Artigo](https://irving.vassar.edu/faculty/gj/FTU/io/literature/Nash51.pdf).
- Russell, S., & Norvig, P. (sem data, capítulo on-line). *Adversarial Search*. Artificial Intelligence: A Modern Approach. [Capítulo](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Projeto Syzygy (sem data). *probetool: documentação das métricas de finais*. GitHub. [Documentação](https://github.com/syzygy1/probetool).
