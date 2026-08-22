---
title: "Minimax no xadrez: o algoritmo que pensa por você"
excerpt: "O minimax é o algoritmo fundamental do raciocínio estratégico no xadrez. Dos engines modernos ao seu próprio pensamento diante do tabuleiro, veja como essa ferramenta matemática estrutura cada decisão."
seoTitle: "Minimax no xadrez: alfa-beta, negamax e o cálculo dos engines"
seoDescription: "Minimax, poda alfa-beta, negamax, null-move pruning, MCTS: como os engines calculam o lance ótimo no xadrez e o que o seu cérebro faz sem saber."
frSlug: minimax-aux-echecs
faq:
  - question: "O minimax sempre produz o melhor lance?"
    answer: >-
      Sim, <strong>se a busca descer até as posições terminais</strong> (xeque-mate ou afogamento). Em
      profundidade finita com função de avaliação heurística, o minimax produz o lance ótimo <em>segundo a
      avaliação e a profundidade</em> usadas. É por isso que um engine avaliado em 3500 de Elo vence um humano:
      a função de avaliação dele + a profundidade estão mais perto da verdade que as de um humano, não porque
      ele calcula "perfeitamente".
  - question: "Por que se fala em \"negamax\" em vez de \"minimax\" nos códigos?"
    answer: >-
      Porque num jogo de soma zero, $\min(a,b) = -\max(-a,-b)$. O negamax explora essa simetria para usar
      <strong>uma única função recursiva</strong> em vez de duas. É puramente uma simplificação do código, sem
      mudança algorítmica. A quase totalidade dos engines modernos (Stockfish, Komodo, Leela Chess Zero) usa
      negamax + alfa-beta.
  - question: "A poda alfa-beta muda o resultado do minimax?"
    answer: >-
      Não, <strong>nunca</strong>. É a sua propriedade fundamental: a alfa-beta produz exatamente o mesmo lance
      que o minimax puro, mas explorando muito menos nós. A força da poda depende da <strong>ordem dos
      lances</strong>: se você testa o melhor lance primeiro, poda em massa; se testa o pior primeiro, quase não
      poda. É por isso que os engines investem tanto na ordenação dos lances (killer moves, histórico dos bons
      lances).
  - question: "Por que o AlphaZero abandona o minimax?"
    answer: >-
      Nem tanto: ele mantém uma busca em árvore (MCTS), mas troca a exploração exaustiva da alfa-beta por uma
      <strong>exploração probabilística guiada</strong> por uma rede neural. A vantagem: em posições onde a
      função de avaliação clássica se perde (sacrifícios de longo prazo, jogo posicional sutil), a rede neural dá
      uma estimativa mais justa. A desvantagem: é preciso treinar essa rede em milhões de partidas, o que exige
      recursos de hardware consideráveis.
  - question: "O meu cérebro executa mesmo o minimax quando eu calculo?"
    answer: >-
      Aproximadamente, sim. Você faz uma busca em árvore com um fator de ramificação bem baixo (3-5 lances
      candidatos em vez de 35), uma profundidade bem limitada (3-8 meios-lances) e uma função de avaliação
      intuitiva (senso posicional). Você também usa heurísticas de poda muito potentes: você <strong>rejeita</strong>
      a maioria dos lances num relance, sem calculá-los. A diferença em relação a um engine não é qualitativa, é
      quantitativa.
---

Há algo de estranho no fato de a estratégia no xadrez, esse jogo milenar de intuição e arte, poder ser reduzida a um algoritmo de algumas linhas. O algoritmo minimax faz exatamente isso: formaliza o coração do raciocínio estratégico num jogo de soma zero numa recorrência matemática elegante. E ele não é só a alma dos engines de xadrez modernos: é também a descrição formal do que você faz na sua cabeça quando calcula. (Para o quadro teórico geral do qual o minimax é o algoritmo central, veja [teoria dos jogos no xadrez](/pt-br/blog/teoria-dos-jogos-no-xadrez/); para o teorema que garante a existência de um valor para toda posição, [o paradoxo de Zermelo](/pt-br/blog/paradoxo-de-zermelo/).)

## A intuição por trás do minimax

Imagine que você joga com as Brancas e quer escolher o melhor lance possível. Como defini-lo? O melhor lance é aquele que, supondo que o seu adversário também jogue perfeitamente, te dá o melhor resultado final.

Essa definição recursiva é a essência do minimax. As Brancas querem maximizar o resultado (do ponto de vista das Brancas). As Pretas querem minimizar o resultado (do ponto de vista das Brancas, ou simetricamente maximizar o seu). Os dois jogadores se alternam, e a cada nível da árvore é um ou o outro que joga.

A formalização matemática é direta:

$$\text{minimax}(p, d) = \begin{cases} \text{avaliação}(p) & \text{se } d = 0 \text{ ou } p \text{ é terminal} \\ \max_{c \in C(p)} \text{minimax}(\text{suc}(p,c), d-1) & \text{se for a vez das Brancas} \\ \min_{c \in C(p)} \text{minimax}(\text{suc}(p,c), d-1) & \text{se for a vez das Pretas} \end{cases}$$

Onde $p$ é a posição atual, $d$ é a profundidade de busca restante, $C(p)$ é o conjunto dos lances legais em $p$, e $\text{suc}(p,c)$ é a posição resultante do lance $c$ em $p$.

## A função de avaliação: o coração do engine

O minimax puro resolveria o xadrez perfeitamente se você pudesse explorar a árvore completa até as posições terminais. Na prática, é impossível por causa da complexidade combinatória ($10^{120}$ folhas segundo Shannon). É preciso parar a busca numa profundidade finita e avaliar as posições não terminais com uma **função de avaliação heurística**.

Historicamente, as primeiras funções de avaliação eram simples: contagem de material (dama = 9 peões, torre = 5, bispo/cavalo = 3). Os engines modernos como o [Stockfish](https://pt.wikipedia.org/wiki/Stockfish) usam funções de avaliação extremamente sofisticadas, que integram:

**O valor do material**: com tabelas de valores contextuais que variam conforme a fase do jogo. Um cavalo vale mais num meio-jogo fechado do que num final aberto.

**A mobilidade das peças**: o número de lances legais disponíveis para cada peça. Uma peça com mais mobilidade costuma ser mais forte.

**A segurança do rei**: a solidez da estrutura de peões ao redor do rei, as linhas abertas em direção a ele, as peças adversárias ameaçadoras.

**A estrutura de peões**: os peões dobrados (enfraquecidos), isolados (sem apoio), atrasados (que não conseguem mais avançar), passados (sem peões adversários no caminho até a promoção).

**O controle do centro**: a ocupação e o controle das casas centrais e4, d4, e5, d5 e seus arredores.

Esses elementos são ponderados e combinados numa fórmula que tenta aproximar o "verdadeiro" valor da posição.

## A poda alfa-beta: a inteligência de desistir

O algoritmo minimax bruto é de uma ineficiência espetacular. Para uma profundidade de busca de $d$ lances e um fator de ramificação de $b$ (número médio de lances legais), é preciso avaliar $b^d$ posições. Com $b = 35$ e $d = 10$, são $35^{10} \approx 2{,}8 \times 10^{15}$ posições. Impossível na prática.

A [poda alfa-beta](https://pt.wikipedia.org/wiki/Poda_alfa-beta), desenvolvida de forma independente por vários pesquisadores nos anos 1950-1960 e formalizada por [John McCarthy](https://pt.wikipedia.org/wiki/John_McCarthy), resolve esse problema podando os ramos que não podem influenciar a decisão final.

O princípio é o seguinte: se você já encontrou uma opção para as Brancas que garante um resultado de valor $\alpha$, e você explora um ramo em que as Pretas podem forçar um resultado inferior a $\alpha$ para as Brancas, esse ramo pode ser abandonado. As Brancas nunca vão escolhê-lo, porque já têm algo melhor.

Formalmente, você mantém dois limites (no pseudocódigo ou no quadro):
- $\alpha$: o melhor valor já garantido para o jogador que maximiza (Brancas)
- $\beta$: o melhor valor já garantido para o jogador que minimiza (Pretas)

Quando $\alpha \geq \beta$, o ramo atual é podado: ele não pode produzir um resultado melhor que o já conhecido.

No caso ótimo (se os lances estiverem ordenados por qualidade decrescente), a alfa-beta reduz o número de nós de $b^d$ para $b^{d/2}$, dobrando efetivamente a profundidade de busca possível para o mesmo orçamento de cálculo.

### Negamax: a simplificação que muda o código

Na prática, quase nenhum engine implementa o minimax na sua forma de dois ramos (max para as Brancas, min para as Pretas). Todos usam a formulação **negamax**, que explora a identidade $\min(a,b) = -\max(-a,-b)$ num jogo de soma zero. O código passa de duas funções distintas a uma só, com uma inversão de sinal a cada chamada recursiva. Conceitualmente idêntico, mas bem mais curto (15 linhas de código contra 40) e fácil de manter. Quando um desenvolvedor diz "estou implementando minimax", quase sempre quer dizer "estou implementando negamax com alfa-beta".

### Null-move pruning: passar a vez para ganhar tempo

Uma heurística poderosa: e se você **passar a sua vez**? Se a posição continua boa para você apesar desse lance de graça dado ao adversário, então ela é provavelmente *muito* boa para você, e você pode podar a fundo o resto da análise. É o **null-move pruning**, técnica padrão desde os anos 1990. No xadrez, o truque tem um limite conhecido (o *zugzwang*: situação em que todo lance piora a posição, típica dos finais de peões), então os engines desativam a heurística em finais ou em posições identificadas como zugzwang potencial. Ganho típico: mais um fator de 2 a 4 na velocidade efetiva.

## As técnicas avançadas dos engines modernos

Os engines de xadrez modernos como o Stockfish adicionam muitas técnicas em cima da alfa-beta básica:

**Tabelas de transposição**: um cache de posições já analisadas. Se a mesma posição é alcançada por ordens de lances diferentes (transposição), o engine reaproveita a análise anterior em vez de recalculá-la. As tabelas de transposição podem economizar ordens de grandeza de tempo de cálculo.

**Aprofundamento iterativo**: em vez de fazer direto uma busca na profundidade $d$, o engine encadeia buscas sucessivas nas profundidades 1, 2, 3, ..., $d$. Cada iteração fornece uma ordenação melhor dos lances para a iteração seguinte, melhorando a eficiência da poda.

**Busca de quiescência**: na profundidade máxima, em vez de avaliar estaticamente, a busca se prolonga até uma posição "quiescente" (estável), explorando só as capturas e promoções. Isso evita avaliar posições em que uma troca de peças não resolvida distorceria a avaliação.

**Extensões de busca**: em certas posições (mate à vista, peão passado avançado, posição crítica), a profundidade de busca é estendida automaticamente além do limite nominal para evitar o efeito horizonte.

**Reduções de busca (LMR)**: ao contrário, para os lances pouco promissores (late move reduction), a profundidade é reduzida para economizar tempo. Se esses lances se revelam melhores que o esperado, a profundidade é restaurada.

## A história dos engines minimax: de Claude Shannon ao Stockfish

A história dos engines de xadrez é a história das melhorias sucessivas do minimax.

Em 1950, [Claude Shannon](https://pt.wikipedia.org/wiki/Claude_Shannon) lançou as bases teóricas no seu artigo "Programming a Computer for Playing Chess", identificando as duas abordagens (força bruta vs. seleção heurística) e os desafios fundamentais.

Em 1957, [Alex Bernstein](https://en.wikipedia.org/wiki/Alex_Bernstein_(computer_scientist)) criou o primeiro programa de xadrez funcional, no IBM 704, usando uma versão simplificada do minimax com uma avaliação rudimentar.

Os anos 1970-1980 viram a ascensão dos chips dedicados ao xadrez. O [Belle](https://en.wikipedia.org/wiki/Belle_(chess_machine)) de Ken Thompson e Joe Condon foi o primeiro programa a atingir o nível de mestre. O [Deep Thought](https://en.wikipedia.org/wiki/Deep_Thought_(chess_computer)) de Hsu e Campbell atingiu o nível de Grande Mestre.

O apogeu do minimax clássico foi o [Deep Blue](https://pt.wikipedia.org/wiki/Deep_Blue), que venceu [Kasparov](https://pt.wikipedia.org/wiki/Garry_Kasparov) em 1997. O Deep Blue avaliava 200 milhões de posições por segundo com uma função de avaliação desenvolvida em colaboração com Grandes Mestres.

O [Stockfish](https://pt.wikipedia.org/wiki/Stockfish), desenvolvido desde 2008, representa o auge da abordagem minimax clássica com avaliação manual. Desde 2020, ele integra o [NNUE](https://en.wikipedia.org/wiki/Efficiently_updatable_neural_network) (Efficiently Updatable Neural Network), uma rede neural integrada à função de avaliação.

## AlphaZero e a superação do minimax

Em 2017, a [DeepMind](https://pt.wikipedia.org/wiki/Google_DeepMind) publicou os resultados do [AlphaZero](https://pt.wikipedia.org/wiki/AlphaZero), um programa que aprendeu a jogar xadrez por auto-jogo em poucas horas e venceu o Stockfish de forma convincente.

O AlphaZero não usa o minimax clássico, mas uma [Busca em Árvore Monte Carlo](https://pt.wikipedia.org/wiki/Busca_em_%C3%A1rvore_Monte_Carlo) (MCTS) guiada por uma rede neural profunda. Em vez de explorar a árvore de forma exaustiva com poda, a MCTS explora estocasticamente os ramos mais promissores segundo uma política aprendida.

O que impressionou a comunidade do xadrez não foi só o desempenho do AlphaZero, mas o seu estilo de jogo. O AlphaZero joga de forma audaciosa e criativa, com sacrifícios de material de longo prazo e uma preferência pela atividade das peças em vez das vantagens materiais imediatas. Esse estilo lembra mais um jogador humano intuitivo do que um engine de força bruta.

O AlphaZero mostrou que o minimax não é o único caminho para o domínio do xadrez. O aprendizado por reforço pode produzir uma compreensão diferente e, às vezes, mais profunda do jogo. (O match AlphaZero-Stockfish de 2017 continua sendo o episódio fundador dessa revolução. Para o muro combinatório que torna essas abordagens necessárias, veja [por que o xadrez é um problema quase impossível](/pt-br/blog/xadrez-problema-matematico-impossivel-e-ia/); para as zonas em que esses algoritmos são mais exigidos, [a teoria do caos no xadrez](/pt-br/blog/teoria-do-caos-no-xadrez/).)

## O minimax na sua cabeça

O aspecto mais fascinante do minimax para o jogador prático é que ele descreve o que você já faz quando calcula variantes. Quando você pensa "se eu jogo aqui, ele pode responder isso ou aquilo. Se ele responde isso, eu jogo aquilo e ele é obrigado a...", você executa mentalmente um algoritmo minimax truncado.

Os seus limites humanos determinam a "profundidade" da sua busca. Um jogador de 1200 explora talvez 2-3 níveis de forma confiável. Um Grande Mestre explora 7-10 níveis em posições estratégicas e mais ainda nas posições táticas forçadas.

A diferença entre um jogador médio e um Grande Mestre não é só a profundidade: é também a qualidade da função de avaliação interna (a intuição posicional) e a eficiência da poda (a capacidade de identificar rápido os lances pertinentes e ignorar os ruins sem calculá-los).

Treinar esses dois aspectos está no coração do desenvolvimento de um jogador: enriquecer o senso posicional para melhorar a avaliação, e afinar o instinto dos "lances candidatos" para melhorar a poda. O minimax é a descrição formal desse processo.

**Depois da leitura:** num problema tático, imponha uma **profundidade fixa** (ex. três meios-lances) antes de olhar a solução: você calibra o seu minimax interno.

---

## Perguntas frequentes

### O minimax sempre produz o melhor lance?

Sim, **se a busca descer até as posições terminais** (xeque-mate ou afogamento). Em profundidade finita com função de avaliação heurística, o minimax produz o lance ótimo *segundo a avaliação e a profundidade* usadas. É por isso que um engine avaliado em 3500 de Elo vence um humano: a função de avaliação dele + a profundidade estão mais perto da verdade que as de um humano, não porque ele calcula "perfeitamente".

### Por que se fala em "negamax" em vez de "minimax" nos códigos?

Porque num jogo de soma zero, $\min(a,b) = -\max(-a,-b)$. O negamax explora essa simetria para usar **uma única função recursiva** em vez de duas. É puramente uma simplificação do código, sem mudança algorítmica. A quase totalidade dos engines modernos (Stockfish, Komodo, Leela Chess Zero) usa negamax + alfa-beta.

### A poda alfa-beta muda o resultado do minimax?

Não, **nunca**. É a sua propriedade fundamental: a alfa-beta produz exatamente o mesmo lance que o minimax puro, mas explorando muito menos nós. A força da poda depende da **ordem dos lances**: se você testa o melhor lance primeiro, poda em massa; se testa o pior primeiro, quase não poda. É por isso que os engines investem tanto na ordenação dos lances (killer moves, histórico dos bons lances).

### Por que o AlphaZero abandona o minimax?

Nem tanto: ele mantém uma busca em árvore (MCTS), mas troca a exploração exaustiva da alfa-beta por uma **exploração probabilística guiada** por uma rede neural. A vantagem: em posições onde a função de avaliação clássica se perde (sacrifícios de longo prazo, jogo posicional sutil), a rede neural dá uma estimativa mais justa. A desvantagem: é preciso treinar essa rede em milhões de partidas, o que exige recursos de hardware consideráveis.

### O meu cérebro executa mesmo o minimax quando eu calculo?

Aproximadamente, sim. Você faz uma busca em árvore com um fator de ramificação bem baixo (3-5 lances candidatos em vez de 35), uma profundidade bem limitada (3-8 meios-lances) e uma função de avaliação intuitiva (senso posicional). Você também usa heurísticas de poda muito potentes: você **rejeita** a maioria dos lances num relance, sem calculá-los. A diferença em relação a um engine não é qualitativa, é quantitativa.

---

## O essencial

- O minimax é o algoritmo que explora a árvore das partidas alternando maximização (Brancas) e minimização (Pretas)
- O **negamax** é a formulação moderna, mais curta, equivalente matematicamente
- A **poda alfa-beta** reduz drasticamente o número de nós a explorar sem mudar o resultado
- Os engines modernos acrescentam funções de avaliação heurísticas, tabelas de transposição, **null-move pruning**, aprofundamento iterativo e quiescência
- O AlphaZero mostrou que uma abordagem **MCTS + rede neural** pode superar o minimax puro nos jogos complexos
- O seu cérebro executa mentalmente uma versão simplificada do minimax (ramificação baixa + poda intuitiva forte)

### Fontes e referências

- **Shannon, C. E.** *Programming a Computer for Playing Chess.* Philosophical Magazine, Series 7, 41(314), 256-275, 1950. (O artigo fundador dos engines de xadrez e da aplicação do minimax.)
- **Silver, D., et al.** [*Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm.*](https://arxiv.org/abs/1712.01815) arXiv, 2017. (A publicação original do AlphaZero.)
- **Knuth, D. E., & Moore, R. W.** *An Analysis of Alpha-Beta Pruning.* Artificial Intelligence, 6(4), 293-326, 1975. (A análise formal do algoritmo alfa-beta.)
- **Campbell, M., Hoane, A. J., & Hsu, F.** [*Deep Blue.*](https://www.sciencedirect.com/science/article/pii/S0004370201001291) Artificial Intelligence, 134(1-2), 57-83, 2002. (A descrição do sistema Deep Blue que venceu Kasparov.)
- **Iyengar, S.** *Chess Programming: From Minimax to Neural Networks.* ACM Computing Surveys, 2019. (A revisão das abordagens algorítmicas na computação do xadrez.)
