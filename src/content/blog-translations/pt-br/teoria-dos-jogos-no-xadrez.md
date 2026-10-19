---
heroImageAlt: Uma ampulheta cuja areia é formada por pequenas peças de xadrez
  que passam de um bulbo para o outro.
title: "Teoria dos jogos no xadrez: cada lance como decisão estratégica"
excerpt: "Minimax, equilíbrio de Nash e informação perfeita: como distinguir o que um resultado matemático garante, o que um motor estima e o que você escolhe contra uma pessoa real."
seoTitle: "Teoria dos jogos no xadrez: Nash, minimax e Zermelo"
seoDescription: "Minimax, equilíbrio de Nash, estratégias mistas e Zermelo: teoria dos jogos aplicada ao xadrez, das aberturas à preparação contra o adversário."
frSlug: "theorie-des-jeux-aux-echecs"
faq: [{"question": "O xadrez é um jogo de soma zero?", "answer": "Sim, atribuindo +1 ao vencedor, −1 ao perdedor e zero a cada um no empate. A pontuação habitual de 1–0 ou ½–½ é de soma constante e pode ser transformada em soma zero."}, {"question": "Conhecemos o resultado do xadrez com jogo perfeito?", "answer": "Não. A existência de um valor teórico não indica se as brancas ganham, se as pretas ganham ou se ambos conseguem garantir o empate desde a posição inicial."}, {"question": "É preciso misturar suas aberturas?", "answer": "Isso pode tornar sua preparação menos previsível, mas nenhum teorema impõe uma distribuição específica. Em um jogo finito de informação perfeita como o xadrez, existem estratégias ótimas puras."}]
---

Rodada nove. Lance quatorze. Você jogou os treze anteriores sem pensar: conhece todos de cor. O adversário também. Uma variante familiar levou vocês à mesma posição. Isso não basta para provar que estão jogando um equilíbrio de Nash.

A teoria dos jogos ajuda a distinguir o que um resultado matemático garante, o que um motor estima e o que você escolhe contra uma pessoa real.

## O modelo: dois jogadores e regras conhecidas

O xadrez é um jogo de dois participantes, sem sorteio aleatório nas regras e com informação perfeita. Isso significa que os lances jogados e o estado do jogo são conhecidos dos dois lados. Não significa que você conheça a preparação ou as intenções adversárias.

Com a convenção vitória = +1, derrota = −1 e empate = 0, os ganhos dos jogadores somam zero. Com a pontuação habitual 1, 0 e ½, a soma vale um: é um jogo de soma constante, equivalente após uma mudança de escala. Repetir partidas não faz essa propriedade desaparecer automaticamente.

O modelo de busca adversarial apresentado por Russell e Norvig permite representar uma partida finita por uma árvore de decisões. Para representar corretamente o xadrez, o estado também precisa guardar direitos e histórico necessários às regras; as casas ocupadas nem sempre bastam.

## Um valor teórico não é uma solução calculada

Em uma árvore finita cujos resultados são vitória, empate ou derrota, podemos propagar os valores das folhas para cima: cada jogador escolhe a melhor continuação para si. Obtemos um valor para a raiz e escolhas que o garantem.

O artigo sobre [Zermelo](/pt-br/blog/paradoxo-de-zermelo/) retoma a história dessa questão. Aqui, a ideia central é simples: a existência de um resultado com jogo perfeito não informa qual é o resultado do xadrez desde a posição inicial.

Seria excessivo afirmar que é necessariamente preciso percorrer cada partida possível para encontrar uma prova ou que nenhuma descoberta futura poderá resolver o problema. O tamanho de uma árvore estimada não demonstra uma impossibilidade matemática.

## Minimax: garantir o melhor resultado contra a melhor defesa

Em uma posição com a vez das brancas, minimax toma o máximo dos valores das continuações. Com a vez das pretas, toma o mínimo, usando uma avaliação expressa do ponto de vista das brancas.

$$v(p)=\max_{c\in C(p)}v(\operatorname{resultado}(p,c))$$

$$v(p)=\min_{c\in C(p)}v(\operatorname{resultado}(p,c))$$

Nas folhas terminais, o valor vem do resultado da partida. Se você interromper antes, vem de uma estimativa: o cálculo prova apenas o valor dessa árvore truncada com essa avaliação.

Russell e Norvig também mostram como alfa-beta evita explorar ramos desnecessários para o resultado minimax. A melhora depende da ordem dos lances; o caso favorável em $O(b^{d/2})$ não é garantia para cada busca. Nem esse limite nem minimax descrevem literalmente o que seu cérebro calcula.

[Minimax no xadrez](/pt-br/blog/minimax-no-xadrez/) detalha esses limites. Nem todos os motores usam o mesmo método: equiparar Leela a um minimax simples seria enganoso.

## O que Nash acrescenta

Nash (1951) estuda equilíbrios em jogos não cooperativos. Em um equilíbrio, nenhum jogador consegue melhorar seu ganho mudando sozinho de estratégia, enquanto as estratégias dos demais permanecem fixas.

Uma estratégia é aqui um plano completo que indica o que fazer nas situações relevantes. Um primeiro lance isolado ou uma abertura popular não provam um equilíbrio. Uma variante avaliada como “igual” por um motor pode continuar mal compreendida ou mudar de avaliação com uma análise mais profunda.

Da mesma forma, a pontuação observada das brancas em uma base de partidas mede resultados humanos que dependem da amostra. Não demonstra um valor teórico nem a dominância de um primeiro lance. O artigo sobre [grafos e equilíbrios](/pt-br/blog/grafos-de-nash-equilibrio-aberturas/) esclarece isso.

## Estratégia pura, mistura e preparação

Em um jogo finito de informação perfeita, propagar os valores pela árvore permite escolher uma ação ótima em cada decisão: uma estratégia pura basta para garantir o valor teórico. O acaso não é, portanto, obrigatório para jogar perfeitamente.

Na prática, variar o repertório pode dificultar a preparação adversária. Você também pode preferir uma linha conhecida a fundo a uma surpresa que domina mal. São escolhas de treinamento e adaptação; nenhuma distribuição universal entre 1.e4, 1.d4 e 1.Cf3 decorre do teorema de Nash.

Antes de uma partida, distinga: “Qual sequência parece mais sólida?” e “Qual sequência consigo jogar corretamente hoje?”. Depois da partida, confira suas hipóteses sobre o adversário com os lances realmente jogados.

## Fontes

- Russell, S. e Norvig, P. (sem data), *Adversarial Search*, capítulo de manual disponibilizado pelos autores, [texto](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Nash, J. F. (1951), *Non-Cooperative Games*, Annals of Mathematics, 54(2), 286–295, [artigo original](https://irving.vassar.edu/faculty/gj/FTU/io/literature/Nash51.pdf).
