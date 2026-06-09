---
title: "AlphaZero contra Stockfish: a revolução da inteligência artificial no xadrez"
excerpt: >-
  Em dezembro de 2017, a DeepMind publicava os resultados de um match que mudou a forma como se pensa tanto a
  inteligência artificial quanto o xadrez. O AlphaZero, treinado sem dados humanos, batia o Stockfish com um estilo
  de jogo que ninguém tinha antecipado.
seoTitle: "AlphaZero contra Stockfish: a revolução da IA no xadrez"
seoDescription: "AlphaZero vs Stockfish 2017: aprendizado por reforço, rede neural, estilo de jogo revolucionário. Como a IA mudou a compreensão do xadrez."
frSlug: echecs-alphazero-stockfish
---

Dezembro de 2017. A equipe da DeepMind publica um artigo de pesquisa e, em anexo, 10 partidas comentadas. Essas 10 partidas eletrizaram a comunidade enxadrística de uma forma que nada havia feito desde o match Fischer-Spassky de 1972.

Não era simplesmente que um programa batia outro programa. Era a *forma* como ele batia.

## A arquitetura do AlphaZero

Para compreender por que o AlphaZero representa uma ruptura, é preciso entender o que ele faz : e o que não faz.

O AlphaZero é um sistema de **deep reinforcement learning** (aprendizado por reforço profundo). Ele combina duas tecnologias:

**Uma rede neural profunda** que toma como entrada a posição do tabuleiro e produz duas saídas : uma distribuição de probabilidade sobre todos os lances legais (a "policy head" : quais lances parecem promissores) e uma avaliação da posição (-1 a +1, correspondendo a uma vitória das pretas, uma remis ou uma vitória das brancas : a "value head").

**A busca em árvore Monte Carlo (MCTS)** que usa a rede neural para guiar a busca. Em vez de explorar a árvore de jogo de forma exaustiva com poda alfa-beta, o MCTS simula partidas até o fim escolhendo os lances segundo as probabilidades da policy head e propagando os resultados para a raiz.

O que é notável : o AlphaZero recebeu apenas **as regras do jogo**. Nenhuma partida humana. Nenhuma heurística de posição. Nenhuma base de finais. Nenhum conhecimento sobre o que é uma "boa" posição : apenas a regra de que o xeque-mate é a vitória.

Ele jogou 44 milhões de partidas contra si mesmo em 9 horas (em TPUs do Google, hardware especializado), ajustando seus pesos de rede após cada partida. Ao final, havia desenvolvido uma compreensão do jogo de uma forma que ninguém havia programado.

## O match: 28-0-72

No match de dezembro de 2017, o AlphaZero jogou 100 partidas contra o Stockfish 8 (a melhor versão da época) em cadência clássica. Resultado: 28 vitórias para o AlphaZero, 72 empates, 0 derrota.

Esse placar é estupefante por vários aspectos. Um programa que bate o Stockfish *sem nunca perder* é extraordinário : o Stockfish 8 era ele mesmo muito superior a qualquer humano. E as vitórias não eram vitórias técnicas em finais complicados : construíam-se sobre temas posicionais claros.

Críticas legítimas existem sobre as condições do match:
- O Stockfish rodava sem suas bases de finais Syzygy
- O hardware do AlphaZero (TPUs) não é diretamente comparável aos CPUs do Stockfish
- O Stockfish não havia sido reotimizado para o hardware disponível

Essas críticas levaram a DeepMind a publicar em dezembro de 2018 uma versão revisada na revista *Science*, com condições mais equilibradas. O resultado confirmava a superioridade do AlphaZero, mas com uma vantagem menos esmagadora : cerca de 64% de vitórias nas posições abertas, placar global favorável mas não 28-0.

## O estilo de jogo : o que fascinou os Grandes Mestres

O placar impressionava. O estilo estupefazia.

Os Grandes Mestres que comentaram as 10 partidas publicadas (Kasparov, Nakamura, Seirawan) usavam termos incomuns no contexto da análise de motores : "criativo", "humano", "romântico", "vivo".

**Os sacrifícios posicionais.** O AlphaZero era notavelmente disposto a sacrificar material (tipicamente um peão, às vezes mais) para obter uma compensação dinâmica. O Stockfish, com sua avaliação material precisa, frequentemente recusaria esses sacrifícios ou os avaliaria como negativos. O AlphaZero os jogava e mantinha a compensação durante muitos lances, até que o material se transformasse em vantagem posicional.

**A confiança nas posições "biologicamente ganhadoras".** Posições em que a avaliação numérica do Stockfish era ~+0,2 (ligeiramente favoráveis às brancas, quase neutras) mas onde o AlphaZero mantinha uma pressão contínua, obrigando as pretas a defender posições desconfortáveis lance após lance, até o erro.

**O estilo "rei ativo" nos finais.** O AlphaZero usava seu rei de forma ofensiva mais cedo do que os motores clássicos : uma prática conhecida nos finais (o rei é uma peça forte nos finais) mas frequentemente diferida pelos motores que avaliam o rei seguro como prioridade absoluta.

Garry Kasparov, analisando as partidas, disse que "reconhecia" esse estilo : não como o de um programa, mas como o de um jogador humano brilhante com uma profunda compreensão posicional. "É assim que eu gostava de jogar quando estava no auge."

## O que o AlphaZero (re)descobriu na teoria das aberturas

O impacto mais duradouro do AlphaZero na prática do xadrez não é o match em si : é a influência sobre a teoria das aberturas.

O AlphaZero jogava regularmente vários sistemas que os motores clássicos haviam desvalorizado:

**A Defesa London (1.d4 d5 2.Bf4)**: considerada pelos motores como sólida mas sem mordente. O AlphaZero a jogava com uma energia posicional que inspirou jogadores humanos a reintegrá-la no alto nível. Hoje, Magnus Carlsen e outras elites a utilizam regularmente.

**O Gambito do Rei (1.e4 e5 2.f4)**: uma abertura romântica do século XIX, geralmente considerada insuficiente no mais alto nível. O AlphaZero a jogava e ganhava : revelando recursos que a teoria moderna não havia explorado plenamente.

**Estruturas de peões com ilhas múltiplas** que o Stockfish avaliava ligeiramente de forma negativa mas que continham dinâmicas compensatórias.

Essas "redescoberta" influenciaram as análises preparatórias das elites. Alguns Grandes Mestres usam explicitamente o [Leela Chess Zero](https://lczero.org) (o equivalente open-source do AlphaZero) para encontrar ideias que o Stockfish teria rejeitado.

## A convergência : Stockfish NNUE e o fim da dicotomia

Em 2020, o Stockfish integrou uma arquitetura de rede neural chamada **NNUE** (Efficiently Updatable Neural Network), desenvolvida inicialmente para o shogi.

O NNUE substitui a função de avaliação heurística do Stockfish por uma rede neural treinada em milhões de posições avaliadas pelo próprio Stockfish. Resultado : o Stockfish NNUE combina a velocidade de busca alfa-beta da antiga arquitetura com a riqueza de avaliação posicional das redes neurais.

A melhoria de nível foi imediata : cerca de 80-100 pontos Elo de ganho, tornando o Stockfish NNUE o melhor programa disponível publicamente.

A dicotomia "Stockfish (força bruta) vs AlphaZero (deep learning)" tornou-se obsoleta. As duas abordagens se fundiram. O Leela Chess Zero continua seu desenvolvimento com uma arquitetura mais próxima do AlphaZero, e os dois programas estão hoje próximos em força absoluta.

## Implicações para a compreensão humana do xadrez

A questão mais profunda levantada pelo AlphaZero não é "qual programa é o melhor?" : é "o que nos ensina um programa que joga assim sobre a natureza da compreensão no xadrez?"

O AlphaZero sugere que existe uma forma de compreensão posicional que não é redutível à avaliação material precisa + busca profunda. Posições que o Stockfish avalia como ~0 (neutras) contêm "gradientes" sutis de pressão e oportunidade que o AlphaZero detecta e explora.

Esses gradientes : difíceis de quantificar numericamente, mas reconhecíveis intuitivamente por um Grande Mestre experiente : assemelham-se ao que os jogadores humanos chamam de "iniciativa", "dinâmica", "peças ativas". O AlphaZero desenvolveu uma forma de medir essas qualidades que as heurísticas clássicas não possuíam.

Para os jogadores humanos, o ensinamento é contraintuitivo : às vezes, a posição "objetivamente" ligeiramente inferior mas dinamicamente rica é melhor do que a posição "objetivamente" equivalente mas estática. As avaliações numéricas dos motores, úteis mas imperfeitas, nem sempre capturam essa dinâmica.

É talvez a contribuição mais duradoura do AlphaZero ao xadrez : lembrar que a medida do bom lance não é apenas numérica. A beleza, a pressão, o sacrifício, a iniciativa (conceitos que os jogadores humanos sempre utilizaram) têm uma realidade computacional, não apenas poética.

---

*O AlphaZero nunca jogou uma partida contra um humano. Seus adversários eram motores e suas próprias cópias anteriores. Nunca sentiu a pressão de um torneio, o desconforto de uma posição perdedora, a alegria de uma bela combinação encontrada. E, no entanto, os Grandes Mestres disseram de seu jogo que era o mais "humano" que já analisaram. Há algo nessa ironia que merece reflexão.*
