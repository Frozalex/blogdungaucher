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

## Uma árvore que você pode resolver por si mesmo

Aqui está um **exemplo pedagógico fictício**, sem pretender representar uma posição real. As brancas hesitam entre dois planos A e B. Depois de A, as pretas têm duas respostas que levam a valores de +4 e  −1 para as brancas. Depois de B, suas respostas dão +1 e +2. Todas as variantes terminam aqui por construção.

Se você olhar apenas para a melhor folha, A parece atraente: +4 excede +2. Mas as pretas não são obrigadas a cooperar. Elas escolhem  −1 depois de A e +1 depois de B. As brancas então comparam  −1 e +1, então escolhem B. O valor desta árvore é +1. Este cálculo explica o que falta à frase “eu tinha visto uma bela combinação”: é preciso também examinar o que acontece se o outro recusa a continuação desejada.

Agora mude uma hipótese. Suponhamos que estes números sejam avaliações aproximadas após três meios-lances, e não resultados finais. O cálculo de baixo para cima permanece exato **para estes números**; a conclusão sobre a posição real torna-se uma estimativa. Uma captura intermediária no quarto meio-lance pode alterar a avaliação. O rigor consiste em manter o método e seu alcance juntos.

Você pode fazer o exercício novamente com resultados vitória, empate e derrota. Um ramo onde todas as respostas adversas levam a um empate garante o empate. Outro ramo que contém nove vitórias e uma derrota não garante nenhuma vitória. O número de boas folhas não substitui a escolha do adversário. Para falar de probabilidade, é necessário acrescentar um modelo de sua conduta.

## Armadilha, melhor defesa e esperança prática

Uma armadilha pode ganhar muitas vezes sem ser teoricamente boa. Vamos pegar um **modelo fictício de preparação**: uma linha arriscada dá a vitória se o adversário cair na armadilha, mas a derrota se ele encontrar a refutação. Se a probabilidade de cair é de 70%, a pontuação esperada é de 0,70, com a pontuação do torneio. Outra linha garante hipoteticamente o empate, ou seja, 0,50. A primeira maximiza o resultado esperado nesse modelo; a segunda garante mais contra uma defesa exata.

De onde vem 70%? Este número é inventado para o exercício. Uma frequência em uma base pode ser enganosa: adversários menos experientes, partidas rápidas, versões antigas da teoria, armadilha conhecida apenas pelos jogadores que entram nela. Se o seu próximo adversário preparou a refutação, a frequência histórica não é a sua probabilidade de errar. Uma estratégia dita “prática” deve explicitar os conhecimentos sobre os quais ela aposta.

É por isso que uma surpresa não se julga apenas pela pontuação imediata. Uma linha pode ser eficaz uma vez e, em seguida, tornar-se ruim quando os adversários adaptam sua preparação. A [introdução à teoria dos jogos da Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/game-theory/) ajuda a separar estratégias, utilidades e crenças. Ela não fornece uma frequência ideal universal para o seu repertório.

## O resultado da partida e o objetivo do torneio

Um empate pode ser suficiente para ganhar um torneio; também pode deixar um jogador eliminado. As regras e os pontos da partida são os mesmos, mas o objetivo prático muda. Maximizar a pontuação média da partida e maximizar a probabilidade de terminar primeiro não são duas formulações automaticamente equivalentes.

**Situação fictícia:** na última rodada, apenas uma vitória permite que você se qualifique. Você pode preferir uma posição com mais desequilíbrios do que uma repetição de lances disponível. Isso não torna a repetição menos correta no jogo abstrato. Você muda a função de utilidade relevante para a sua decisão. É preciso ainda verificar se a complicação mantém chances razoáveis, em vez de confundir a obrigação de ganhar com a obrigação de sacrificar.

Uma análise útil pode, portanto, manter duas colunas: valor estimado e interesse em seu objetivo real. Essa separação permite discutir uma decisão sem reescrever depois as regras matemáticas para justificar uma aposta.

## Como usar essa teoria em seu treinamento

Escolha uma partida recente e reconstrua um único momento decisivo. Escreva seus dois candidatos, a resposta do adversário que você esperava e a resposta que você temia. Então procure uma terceira resposta que você tenha negligenciado. O objetivo não é calcular toda a árvore, mas verificar se a sua escolha é baseada na cooperação do adversário.

Na revisão, distinga três possíveis erros: uma resposta legal esquecida, uma posição final mal avaliada ou uma hipótese frágil sobre o comportamento adverso. Eles exigem trabalhos diferentes. No primeiro caso, pratique a busca por lances candidatos. No segundo, compare a sua avaliação da posição final com os recursos disponíveis para cada lado. No terceiro, reveja as hipóteses que você fez sobre o adversário.

Este protocolo é uma proposta de treinamento, não uma intervenção validada experimentalmente. Ele, no entanto, dá uma tradução concreta à teoria: você não busca mais apenas uma sequência brilhante, você identifica o que a sua escolha garante e quais hipóteses sustentam o restante.

### Quando o adversário oferece empate

Imagine uma última rodada em que apenas uma vitória te qualifica. Para a folha de resultados, um empate vale sempre meio ponto. Para o seu objetivo de qualificação, ele tem exatamente a mesma consequência de uma derrota. Escreva as duas colunas de ganhos antes de comparar suas opções. Dois leitores podem escolher lances diferentes da mesma árvore simplesmente porque eles definiram dois objetivos diferentes. Esta divergência não põe em causa o cálculo feito em cada coluna.

## Fontes

- Russell, S. e Norvig, P. (sem data), *Adversarial Search*, capítulo de manual disponibilizado pelos autores, [texto](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Nash, J. F. (1951), *Non-Cooperative Games*, Annals of Mathematics, 54(2), 286–295, [artigo original](https://irving.vassar.edu/faculty/gj/FTU/io/literature/Nash51.pdf).
