---
title: "A complexidade algorítmica do xadrez: por que a IA levou 50 anos para bater o humano"
excerpt: >-
  O número de partidas de xadrez possíveis supera o número de átomos no universo observável. Compreender a complexidade
  algorítmica do xadrez é compreender por que Deep Blue em 1997 foi um feito, e por que AlphaZero em 2017 foi uma
  revolução de natureza completamente diferente.
seoTitle: "Complexidade algorítmica do xadrez: por que a IA levou 50 anos"
seoDescription: "Número de Shannon, alpha-beta pruning, Deep Blue, AlphaZero: a complexidade algorítmica do xadrez explicada e por que bater o humano foi tão difícil."
frSlug: echecs-et-complexite-algorithmique
---

Em 1950, Claude Shannon (o fundador da teoria da informação) publicava um artigo intitulado "Programming a Computer for Playing Chess". Ele ainda não havia escrito os programas. Ele calculava se isso era sequer *possível*.

Sua conclusão : o número de posições legais de xadrez é de aproximadamente 10^43. O número de partidas distintas possíveis é ainda maior. Uma busca exaustiva da árvore de jogo completa ultrapassaria as capacidades de qualquer computador fisicamente realizável : não por falta de velocidade, mas porque o tempo necessário superaria a idade do universo.

Era preciso encontrar outra coisa.

## O que é a complexidade algorítmica?

A [complexidade algorítmica](https://pt.wikipedia.org/wiki/Complexidade_computacional) é um ramo da informática teórica que estuda os recursos (tempo, memória) necessários para resolver problemas. Ela classifica os problemas segundo sua "dificuldade fundamental" : não na prática num computador dado, mas em teoria, assintoticamente, à medida que o tamanho do problema cresce.

As classes mais conhecidas:
- **P**: problemas resolúveis em tempo polinomial (rápidos)
- **NP**: problemas cujas soluções podem ser *verificadas* em tempo polinomial (potencialmente lentos para resolver, rápidos para verificar)
- **PSPACE**: problemas resolúveis com memória polinomial (mesmo que o tempo seja exponencial)
- **EXPTIME**: problemas que necessitam de um tempo exponencial no pior caso
- **EXPSPACE**: a classe mais temível, necessitando tanto tempo quanto memória exponenciais

O xadrez generalizado (num tabuleiro n×n em vez de 8×8) pertence à classe **EXPTIME-completo** segundo os resultados de Fraser et al. (1981). Isso significa que a resolução exata do xadrez num tabuleiro arbitrário é, no sentido formal, tão difícil quanto os problemas mais difíceis de sua classe, e que nenhum algoritmo polinomial pode esperar resolvê-los.

Para o xadrez no tabuleiro 8×8 padrão, a questão é ligeiramente diferente : a partida termina sempre (regra dos 50 lances, repetição), portanto o problema é finito. Mas o espaço de busca permanece astronômico.

## A árvore de jogo e a maldição da explosão combinatória

Imagine a árvore de jogo de uma partida de xadrez. Na raiz, a posição inicial. Após o primeiro lance das Brancas (20 possíveis), 20 nós. Após o primeiro lance das Negras (20 possíveis), 400 nós. Após dois lances de cada lado : aproximadamente 8.902 posições. Após cinco lances de cada lado : aproximadamente 69 bilhões.

O fator de ramificação médio de uma partida de xadrez é de aproximadamente 35 (o número de lances legais numa posição típica). O comprimento médio de uma partida é de aproximadamente 40 lances por jogador. A árvore completa tem portanto aproximadamente 35^80 ≈ 10^123 nós.

É o **número de partidas distintas possíveis**. Supera de longe o número de átomos no universo observável (10^80). Mesmo que cada átomo do universo fosse um computador analisando um bilhão de posições por segundo desde o Big Bang, teríamos explorado apenas uma fração infinitesimal desse espaço.

Essa explosão combinatória explica por que os primeiros programas de xadrez, nos anos 1950-1970, eram tão fracos apesar de computadores cada vez mais poderosos. A força bruta sozinha não podia funcionar. Eram precisas heurísticas : atalhos inteligentes que sacrificam a garantia de otimalidade pela praticabilidade.

## O alpha-beta pruning : o primeiro grande salto

O algoritmo **alpha-beta pruning** (poda alfa-beta), desenvolvido nos anos 1950-1960 por vários pesquisadores (incluindo John McCarthy e Donald Knuth), é a heurística fundamental dos motores de xadrez clássicos.

A ideia : se buscamos a árvore de jogo e encontramos um ramo que não pode ser melhor do que o que já encontramos, paramos de explorá-lo. Mais precisamente : mantemos dois valores, alpha (o melhor escore que as Brancas podem garantir) e beta (o melhor escore que as Negras podem garantir). Assim que um ramo produz um escore fora dessa janela [alpha, beta], é abandonado.

No melhor caso, o alpha-beta pruning reduz o número de nós a explorar para a raiz quadrada da árvore completa. A partir de um espaço de 10^123, pode-se esperar buscar 10^61, ainda astronômico, mas muito mais gerenciável com boas heurísticas de ordenação dos lances (buscar primeiro os lances provavelmente bons torna a poda mais eficiente).

Combinado a uma **função de avaliação**: uma fórmula que estima o valor de uma posição sem ir até as folhas da árvore : o alpha-beta permite buscar a uma profundidade fixa e avaliar as posições resultantes. É exatamente o que Deep Blue fazia em 1997.

## Deep Blue : a vitória da engenharia

Deep Blue não era um programa sutil. Era uma obra-prima de engenharia bruta aplicada às heurísticas de xadrez.

A IBM havia construído **chips especializados** (ASICs) concebidos unicamente para avaliar posições de xadrez : centenas em paralelo. Deep Blue avaliava entre 100 e 300 milhões de posições por segundo. Com um alpha-beta pruning bem otimizado e heurísticas de ordenação sofisticadas, buscava tipicamente a uma profundidade de 12 a 16 lances, às vezes mais nas posições críticas ("busca de extensão").

A função de avaliação havia sido desenvolvida com a ajuda de Grandes Mestres : ela codificava explicitamente conceitos como a estrutura de peões, a segurança do rei, a atividade das peças, as casas fracas. Cada conceito era traduzido em termos numéricos, com pesos ajustados pelos engenheiros.

Kasparov havia batido Deep Blue em 1996 (4-2). Perdeu em 1997 (3,5-2,5). Sua derrota não se devia à "compreensão" do jogo por Deep Blue : não havia nenhuma no sentido cognitivo. Era poder de cálculo + heurísticas humanas codificadas + engenharia material, levados até um limiar onde a força de cálculo bruta compensava as limitações da abordagem.

## AlphaZero : uma revolução de natureza diferente

Vinte anos mais tarde, a DeepMind apresentava AlphaZero. A diferença não era quantitativa : era qualitativa.

AlphaZero havia recebido apenas as **regras do jogo**: quais peças existem, como se movem, quando uma partida termina. Nenhuma base de dados de partidas humanas. Nenhuma heurística explicitada. Nenhum conceito codificado por Grandes Mestres.

Ele jogava contra si mesmo : milhões de partidas. A cada partida, uma rede de neurônios profunda aprendia : quais posições tendem a ser ganhadoras, quais lances tendem a ser bons a partir de quais posições. Após **9 horas** de treinamento em TPUs (processadores especializados da Google), AlphaZero havia atingido um nível que superava Stockfish, o melhor motor "clássico" da época.

O estilo de jogo que AlphaZero havia desenvolvido fascinava os Grandes Mestres : dinâmico, voluntariamente sacrificial, com intuições posicionais que os teóricos nunca tinham codificado explicitamente. AlphaZero buscava claramente menos posições do que Stockfish (cerca de 80.000 por segundo contra 60 milhões), mas cada uma era avaliada por uma rede de neurônios que codificava uma "intuição" aprendida pela experiência em vez de por regras explícitas.

Não era mais uma busca exaustiva melhorada. Era algo estruturalmente diferente : uma aproximação da intuição pelo aprendizado profundo.

## O que a IA revela sobre a cognição humana no xadrez

A trajetória Deep Blue → AlphaZero revela algo importante sobre a natureza da cognição humana no xadrez.

Deep Blue batia os humanos fazendo *diferente*: mais cálculo bruto, mais rápido, mais profundo. AlphaZero bate os humanos fazendo algo *mais similar* ao que os humanos fazem : reconhecimento de padrões, avaliação intuitiva, uma busca muito podada na árvore de jogo.

Os estudos de IRMf sobre os jogadores de xadrez especialistas mostram que seu cérebro não é um calculador bruto. Diante de uma posição, um Grande Mestre não "calcula" primeiro todas as variantes. Ele **reconhece** a posição como pertencendo a uma família, identifica os temas-chave, e só explora em profundidade 3 a 5 lances candidatos máximo. A maioria dos 35 lances legais disponíveis é rejeitada em alguns centésimos de segundo por um processo intuitivo, antes mesmo da reflexão consciente.

Esse processamento (rápido, baseado em padrões, econômico) é o que AlphaZero reproduz melhor do que Deep Blue. E é provavelmente por isso que AlphaZero desenvolveu conceitos de jogo que os humanos reconhecem como "belos" ou "audaciosos" : ao contrário do jogo sólido mas mecânico de Stockfish.

A complexidade algorítmica do xadrez era tão grande que foi preciso esperar não um computador rápido o suficiente para resolvê-la pela força, mas um novo paradigma computacional (o aprendizado profundo) para aproximar a cognição que, desde sempre, permitia aos humanos jogar apesar dessa complexidade.

Shannon havia visto certo em 1950. A busca exaustiva era impossível. A solução não era buscar mais rápido. Era aprender a não buscar.

---

*Claude Shannon jogava ele mesmo xadrez, com um nível "razoável" segundo seus contemporâneos. Ele teria achado provavelmente irônico que a melhor solução para seu problema fosse imitar não o computador, mas o humano.*

---

## O que guardar

- O número de posições legais de xadrez é estimado entre 10^44 e 10^47 : o "número de Shannon". O universo observável contém cerca de 10^80 átomos. O espaço de busca exaustiva é impossível por definição.
- Deep Blue batia Kasparov em 1997 por força bruta aumentada : avaliação de 200 milhões de posições por segundo + heurísticas de poda (alpha-beta pruning). Um programa baseado em regras humanas explícitas, levado ao extremo.
- AlphaZero (2017) recebeu apenas as regras do jogo e jogou contra si mesmo 44 milhões de partidas em 9 horas. Desenvolveu conceitos de jogo desconhecidos dos teóricos, sem jamais ter visto uma base de dados de partidas humanas.
- A complexidade do xadrez é **EXPTIME-completo** na versão generalizada (tabuleiro n×n): uma classe de complexidade superior a NP.
- A compreensão humana do xadrez não é uma versão degradada da busca arborescente : é um tipo de cognição radicalmente diferente, baseado no reconhecimento de padrões e na intuição.

### Fontes e referências

- **Shannon, C. E.** *Programming a Computer for Playing Chess.* Philosophical Magazine, 41(314), 256-275, 1950.
- **Silver, D., et al.** [*Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm.*](https://arxiv.org/abs/1712.01815) arXiv:1712.01815, 2017. (AlphaZero)
- **Campbell, M., Hoane, A. J., & Hsu, F. H.** *Deep Blue.* Artificial Intelligence, 134(1-2), 57-83, 2002.
- **Fraenkel, A. S., & Lichtenstein, D.** *Computing a perfect strategy for n×n chess requires time exponential in n.* Journal of Combinatorial Theory, Series A, 31(2), 199-214, 1981.
- **Gobet, F.** *Understanding Expertise in Chess : A Cognitive Science Approach.* Psychology Press, 2016.
