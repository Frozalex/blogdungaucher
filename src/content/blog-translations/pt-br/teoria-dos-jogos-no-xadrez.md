---
title: "Teoria dos jogos no xadrez: por que cada lance é uma decisão estratégica"
excerpt: "O xadrez é o terreno de origem da teoria dos jogos. Minimax, equilíbrio de Nash, informação perfeita: a anatomia matemática do que realmente acontece quando você joga."
seoTitle: "Teoria dos jogos no xadrez: Nash, minimax e Zermelo explicados"
seoDescription: "Minimax, equilíbrio de Nash, estratégias mistas, teorema de Zermelo: a teoria dos jogos aplicada ao xadrez, das aberturas à preparação contra um adversário específico."
draft: true
frSlug: theorie-des-jeux-aux-echecs
faq:
  - question: "O xadrez é um jogo de soma zero no sentido estrito?"
    answer: >-
      Sim, matematicamente. A soma dos ganhos (1 para a vitória, 0 para a derrota) é constante seja qual for o
      resultado: a vitória de um é exatamente a derrota do outro, o empate se reparte 0,5-0,5. É essa propriedade
      que permite aplicar o minimax sem complicação. Os "matches" (sequência de partidas com bônus tático) já não
      são estritamente de soma zero, e é justamente aí que a teoria dos jogos <em>repetidos</em> fica interessante.
  - question: "Qual é a diferença entre minimax e equilíbrio de Nash no xadrez?"
    answer: >-
      O minimax é uma <strong>técnica de cálculo</strong>: ele diz como encontrar o melhor lance supondo o
      adversário ótimo. O equilíbrio de Nash é um <strong>estado do sistema</strong>: uma configuração em que
      nenhum jogador tem interesse em desviar sozinho. Num jogo de soma zero com dois jogadores como o xadrez, a
      solução minimax <em>coincide</em> com o equilíbrio de Nash (teorema de von Neumann, 1928). Em jogos mais
      complexos (soma não zero, mais de dois jogadores), os dois conceitos divergem.
  - question: "Existe uma estratégia dominante no primeiro lance?"
    answer: >-
      Empiricamente, <strong>não</strong>. As estatísticas de dezenas de milhões de partidas de elite dão 1.e4,
      1.d4, 1.c4 e 1.Cf3 como jogáveis com uma vantagem parecida para as Brancas (~54-56% de aproveitamento).
      Nenhum <em>domina</em> os outros no sentido estrito. Isso sugere ou que a "verdade" do xadrez admite vários
      equilíbrios no lance 1, ou que o horizonte de cálculo humano e de máquina ainda não permite separá-los.
  - question: "Por que se fala em \"estratégias mistas\" se a gente sempre joga o melhor lance?"
    answer: >-
      Porque "o melhor lance" depende do seu modelo do adversário. Se você joga 1.e4 sistematicamente, dá ao
      adversário a informação perfeita sobre a sua preparação: ele pode investir todo o tempo de estudo nas suas
      linhas. Diversificar (40% 1.e4, 40% 1.d4, 20% 1.Cf3) dilui o esforço de preparação dele. A partir de certo
      nível, a estratégia mista vira um investimento defensivo sobre a informação.
  - question: "A teoria dos jogos consegue prever quem vai ganhar uma partida?"
    answer: >-
      Não, e isso é importante. Ela diz que <strong>sob jogo perfeito</strong>, o resultado está determinado. Mas
      o jogo perfeito não existe nem no humano (limites cognitivos) nem na máquina (limites computacionais além
      dos finais de 7 peças). A teoria prevê os <em>equilíbrios assintóticos</em> (a Espanhola estável há 200
      anos), não os <em>resultados individuais</em>. Para isso, é preciso modelar a diferença de força, a
      preparação, o cansaço, o horário da partida: e aí a teoria dos jogos cede o lugar à estatística e à psicologia.
---

Rodada 9. Lance 14. Você jogou os treze anteriores sem pensar: sabe todos de cor. O seu adversário também. Os dois olham o relógio, não o tabuleiro. Nesse instante, vocês são dois agentes perfeitamente racionais trancados no mesmo equilíbrio.

Você sabe disso. Ele também.

É esse o tema da teoria dos jogos. Não é uma metáfora: o xadrez é **o caso de manual** sobre o qual von Neumann e Nash construíram os seus modelos.

## Por que o xadrez é um objeto matemático quase perfeito

Quatro propriedades fazem do xadrez um objeto raro na teoria dos jogos. Parecem banais. Não são.

**Dois jogadores, ponto-final.** Sem aliança, sem coalizão, sem terceiro. Brancas contra Pretas, o que um ganha o outro perde exatamente.

**Soma zero.** Nenhum resultado em que vocês ganham os dois. Nenhum em que perdem os dois. O empate é uma divisão estrita, não um meio-termo. Essa propriedade torna o xadrez analisável: é o que se chama de *jogo de soma zero com dois jogadores*, a classe mais simples da teoria dos jogos.

**Informação perfeita.** No pôquer, você não vê as cartas do adversário. No gamão, você joga dados. No xadrez, *tudo* está no tabuleiro. A todo instante, os dois jogadores têm acesso exatamente à mesma informação. Nenhum elemento oculto, nenhum acaso.

**Finito.** O número de partidas legais é a estimativa de Shannon: $10^{120}$. Astronômico: maior que o número de átomos no universo observável. Mas **finito**. E é essa finitude que torna possível o teorema a seguir.

## O teorema de 110 anos que diz que uma partida de xadrez já tem um resultado

Em 1913, o matemático [Ernst Zermelo](https://pt.wikipedia.org/wiki/Ernst_Zermelo) prova um resultado que deveria te dar vertigem. (O teorema, o seu alcance, os seus limites e a sua sutileza combinatória estão detalhados no artigo dedicado sobre [o paradoxo de Zermelo](/pt-br/blog/paradoxe-de-zermelo/).)

Em todo jogo de dois jogadores, com informação perfeita, sem acaso e finito, uma destas três afirmações é *forçosamente verdadeira*:
1. O primeiro jogador tem uma estratégia vencedora.
2. O segundo jogador tem uma estratégia vencedora.
3. Os dois conseguem forçar o empate.

Aplicado ao xadrez: existe **desde já** uma verdade da posição inicial. Ou as Brancas ganham jogando perfeitamente. Ou as Pretas ganham. Ou a partida é empate sob jogo perfeito.

Ninguém sabe qual. Ninguém provavelmente saberá jamais: seria preciso explorar $10^{120}$ partidas. Mas **a resposta existe**. Está gravada na estrutura do próprio jogo, independentemente de quem joga.

A hipótese majoritária dos especialistas é que é o empate. Mas isso é uma crença, não um teorema.

## Minimax: o que o seu cérebro já executa, sem saber

Quando você pensa num lance, faz algo como: *"Se eu jogo o cavalo aqui, ele captura. Se eu recapturo, ele tem Df3, isso ameaça... não, eu tenho Te1 no meio."*

O que você acabou de fazer tem nome: o algoritmo **minimax**. E você o aprendeu sem que ninguém te ensinasse, porque é o único jeito lógico de raciocinar contra um adversário inteligente.

A ideia cabe em duas frases. Você procura o lance que te dá o **melhor resultado possível**, partindo do princípio de que o seu adversário vai escolher sistematicamente a resposta que te dá o **pior resultado possível**.

Antes da fórmula, a analogia: imagine dois jogadores que passam uma lâmpada um ao outro. Quem segura a lâmpada escolhe, numa sala, a lâmpada que acende: pega a mais brilhante para o seu time e a menos brilhante para o time adversário. Maximizar para si, minimizar para o outro, a cada turno. É só isso.

Se você anota $v(p)$ o valor de uma posição $p$ para as Brancas:

$$v(p) = \max_{c \in C(p)} v(\text{resultado}(p, c)) \quad \text{se for a vez das Brancas}$$
$$v(p) = \min_{c \in C(p)} v(\text{resultado}(p, c)) \quad \text{se for a vez das Pretas}$$

$C(p)$ é o conjunto dos lances legais na posição $p$.

O que essa fórmula te faz evitar recalcular: a cada profundidade, ela supõe que o adversário vai jogar o *seu* melhor lance, o que te dispensa de imaginar os erros prováveis dele (que te custariam cálculo sem ganhar segurança).

É exatamente o que o Stockfish, o Leela e todos os engines modernos executam. A diferença em relação a você: eles fazem isso sobre milhões de nós por segundo, enquanto o seu cérebro processa talvez três ou quatro. O detalhe do algoritmo, os seus refinamentos (tabela de transposição, *iterative deepening*) e a sua versão moderna em rede neural são tratados no artigo [minimax no xadrez](/pt-br/blog/minimax-aux-echecs/).

### Por que um engine não explora $35^{10}$ posições

Um problema: o crescimento combinatório é exponencial. A cada lance, cerca de 35 lances legais. Na profundidade 10, isso dá $35^{10}$ ≈ 2 700 000 bilhões de posições. Inacessível até para o melhor supercomputador.

O truque que salva tudo: a **poda alfa-beta**. O princípio é límpido.

Suponha que você já encontrou uma variante que te garante uma vantagem. Se, ao explorar outro ramo, você descobre que o adversário pode te levar a algo pior que esse ganho, **é inútil explorar o resto do ramo**. Você já sabe que é ruim. Você corta.

A poda transforma $35^d$ em $35^{d/2}$: ou seja, ela **dobra a profundidade** alcançável com o mesmo orçamento de cálculo. É a razão técnica pela qual um engine de 1997 (Deep Blue) já conseguia bater Kasparov.

## Nash, ou por que 1.e4 e5 2.Cf3 Cc6 3.Bb5 sobreviveu 200 anos

John Nash generalizou o minimax para os jogos em que vários equilíbrios coexistem. O **equilíbrio de Nash** é um estado em que nenhum jogador tem interesse em mudar a sua estratégia **unilateralmente**, desde que o outro mantenha a dele.

> **Definição rápida: equilíbrio de Nash.** Imagine duas empresas que fixam os seus preços. Se uma baixa, ganha clientes mas perde margem. A outra a acompanha. As duas acabam num preço em que nenhuma tem interesse em se mexer primeiro. É um equilíbrio de Nash: não o ótimo coletivo, só um ponto em que ninguém ganha desviando sozinho.

No xadrez, isso se traduz nas aberturas.

Quando se diz que uma variante é *"teoricamente igual"*, é exatamente isso que se quer dizer: os dois lados dispõem de recursos que mantêm o equilíbrio, e o primeiro que desvia unilateralmente corre o risco de ser punido. É por isso que a Espanhola (1.e4 e5 2.Cf3 Cc6 3.Bb5) atravessa os séculos: é um equilíbrio estável que ninguém conseguiu quebrar.

Sob jogo perfeito dos dois lados, *a partida inteira* seria um único e gigantesco equilíbrio de Nash. E se a verdade do xadrez é o empate, então esse equilíbrio é o empate. O mapeamento completo desses equilíbrios nas aberturas atuais é o tema de [grafos de Nash e equilíbrio das aberturas](/pt-br/blog/graphes-de-nash-equilibre-ouvertures/); um mesmo repertório pode conter vários equilíbrios, e a escolha entre eles já é coisa do metajogo.

### Estratégias dominantes e estratégias dominadas

Um conceito irmão, muitas vezes confundido com Nash: a **estratégia dominante**. Um lance é *dominante* se for melhor que as suas alternativas seja qual for a resposta adversária. Um lance é *dominado* se uma outra opção for estritamente melhor independentemente do que o outro jogar. No xadrez, as estratégias dominantes puras são raras (quase toda posição oferece um trade-off), mas as estratégias **dominadas** são frequentes: um lance que perde material sem compensação é dominado por quase qualquer outro lance legal. É a base matemática do que os treinadores chamam de "eliminar os lances absurdos" antes de calcular.

A análise por dominância é o que o seu cérebro usa para *não* calcular cada linha: você descarta 30 dos 35 lances legais em menos de um segundo porque são dominados. Você só analisa a sério os 3 a 5 restantes.

## A informação perfeita não existe de verdade (e é isso que torna o jogo jogável)

Os manuais dizem que o xadrez é de *informação perfeita*. É tecnicamente verdade. Na prática, falso.

A informação que falta não está no tabuleiro. Está na cabeça do seu adversário.

Você não sabe até onde ele calculou. Não sabe se ele conhece a variante que você preparou ontem à noite. Não sabe se a calma aparente dele esconde uma posição que ele acha perdida ou uma combinação devastadora que ele espera soltar no lance 27.

Essa assimetria subjetiva transforma o xadrez, na prática, num jogo de informação imperfeita. É aí que a [psicologia do jogador de xadrez](/pt-br/blog/psychologie-du-joueur-d-echecs/) entra em cena. É aí que a teoria dos jogos pura deixa de prever corretamente o comportamento humano.

## O paradoxo Bobby Fischer: por que o jogador mais previsível do século XX ganhou

A teoria dos jogos diz: diversifique as suas aberturas, senão você vira previsível e se faz preparar. É o que se chama de **estratégia mista**: jogar várias linhas com probabilidades variadas em vez da mesma toda vez.

Bobby Fischer jogou **1.e4** em quase todas as suas partidas.

Estratégia pura, previsibilidade total, violação aparente do princípio da estratégia mista. E, no entanto, ele dominava. Por quê?

Porque a preparação dele nas linhas de 1.e4 era de uma profundidade tal que ele *preferia jogar posições familiares*, mesmo esperadas, a surpreender em posições que dominava menos. A estratégia pura dele dominava qualquer estratégia mista de um adversário menos preparado. É um resultado de teoria dos jogos por inteiro: quando o diferencial de preparação é suficiente, a previsibilidade vira vantagem.

Você, com 1500 de Elo, não é o Fischer. Diversifique as suas aberturas.

## Por que Magnus Carlsen quase nunca joga uma partida isolada

O xadrez de torneio é um *jogo repetido*: você vai enfrentar os mesmos adversários ao longo de vários anos, dezenas de vezes. E a teoria dos jogos repetidos diz que, nesse contexto, a **reputação** vira um ativo estratégico por si só.

Conhecido pela sua agressividade? Os seus adversários chegam armados de sistemas defensivos sólidos, e você pode pegá-los jogando calmo num dado dia. Conhecido pela técnica no final? Eles vão evitar as simplificações, então o meio-jogo vira o seu terreno.

É a razão técnica pela qual Magnus Carlsen e a sua equipe passam centenas de horas por match *preparando o adversário específico*. Eles não buscam o melhor lance absoluto. Buscam o desvio sutil que sai dos caminhos conhecidos **daquele** adversário **específico**, mantendo ao mesmo tempo uma vantagem teórica.

É também por isso que os matches de campeonato mundial costumam produzir aberturas estranhas: não são lances objetivamente melhores, são lances estrategicamente melhores *contra esta pessoa, neste momento, com o que ela preparou*.

## O que a teoria dos jogos abandona (e provavelmente nunca vai recuperar)

Apesar da sua potência, a teoria dos jogos esbarra na complexidade combinatória. "Resolver" o xadrez (saber se as Brancas ganham, as Pretas ganham, ou empate sob jogo perfeito) exige explorar uma árvore de $10^{120}$ folhas. Nenhum computador vai conseguir. Nenhum computador clássico futuro também, sem uma revolução física.

Para comparar:
- **O jogo da velha**: resolvido trivialmente. Empate sob jogo perfeito.
- **O Lig 4 (Connect Four)**: resolvido em 1988. O primeiro jogador ganha.
- **As damas**: resolvidas em 2007 por Jonathan Schaeffer e a sua equipe (publicado na *Science*). Empate sob jogo perfeito, após 18 anos de cálculo.
- **O Nim**: resolvido analiticamente (teorema de Sprague-Grundy).
- **O xadrez**: continua em aberto. Por muito tempo.

Não é um limite da disciplina. A teoria afirma que a resposta existe. É só que os recursos de cálculo necessários estão fora de alcance físico. (Para a demonstração detalhada dessa impossibilidade prática e o jeito como a IA contorna o muro, veja [por que o xadrez é um problema matemático quase impossível](/pt-br/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/).)

## A lição que cabe em uma linha

Sobre 64 casas, como numa decisão de vida, não existe bom lance *absoluto*. Existem bons lances **em relação a um modelo do adversário**.

Melhorar esse modelo (entender como o outro pensa, o que ele preparou, o que ele teme) é o que separa o bom jogador do excelente.

Von Neumann não inventou a teoria dos jogos para o xadrez. Inventou-a para modelar a Guerra Fria. Mas os dois objetos têm a mesma ossatura: dois agentes racionais, decisões interdependentes, um resultado que depende do que cada um *acredita* que o outro vai fazer.

**Depois da leitura:** antes da sua próxima partida longa, escreva uma linha sobre a **hipótese de intenções** que você faz sobre o adversário (agressivo, evita complicações, joga rápido no blitz, etc.); confronte-a com a partida real depois.

---

## Perguntas frequentes

### O xadrez é um jogo de soma zero no sentido estrito?

Sim, matematicamente. A soma dos ganhos (1 para a vitória, 0 para a derrota) é constante seja qual for o resultado: a vitória de um é exatamente a derrota do outro, o empate se reparte 0,5-0,5. É essa propriedade que permite aplicar o minimax sem complicação. Os "matches" (sequência de partidas com bônus tático) já não são estritamente de soma zero, e é justamente aí que a teoria dos jogos *repetidos* fica interessante.

### Qual é a diferença entre minimax e equilíbrio de Nash no xadrez?

O minimax é uma **técnica de cálculo**: ele diz como encontrar o melhor lance supondo o adversário ótimo. O equilíbrio de Nash é um **estado do sistema**: uma configuração em que nenhum jogador tem interesse em desviar sozinho. Num jogo de soma zero com dois jogadores como o xadrez, a solução minimax *coincide* com o equilíbrio de Nash (teorema de von Neumann, 1928). Em jogos mais complexos (soma não zero, mais de dois jogadores), os dois conceitos divergem.

### Existe uma estratégia dominante no primeiro lance?

Empiricamente, **não**. As estatísticas de dezenas de milhões de partidas de elite dão 1.e4, 1.d4, 1.c4 e 1.Cf3 como jogáveis com uma vantagem parecida para as Brancas (~54-56% de aproveitamento). Nenhum *domina* os outros no sentido estrito. Isso sugere ou que a "verdade" do xadrez admite vários equilíbrios no lance 1, ou que o horizonte de cálculo humano e de máquina ainda não permite separá-los.

### Por que se fala em "estratégias mistas" se a gente sempre joga o melhor lance?

Porque "o melhor lance" depende do seu modelo do adversário. Se você joga 1.e4 sistematicamente, dá ao adversário a informação perfeita sobre a sua preparação: ele pode investir todo o tempo de estudo nas suas linhas. Diversificar (40% 1.e4, 40% 1.d4, 20% 1.Cf3) dilui o esforço de preparação dele. A partir de certo nível, a estratégia mista vira um investimento defensivo sobre a informação.

### A teoria dos jogos consegue prever quem vai ganhar uma partida?

Não, e isso é importante. Ela diz que **sob jogo perfeito**, o resultado está determinado. Mas o jogo perfeito não existe nem no humano (limites cognitivos) nem na máquina (limites computacionais além dos finais de 7 peças). A teoria prevê os *equilíbrios assintóticos* (a Espanhola estável há 200 anos), não os *resultados individuais*. Para isso, é preciso modelar a diferença de força, a preparação, o cansaço, o horário da partida: e aí a teoria dos jogos cede o lugar à estatística e à psicologia.

---

## O essencial

- O xadrez é um jogo finito, de soma zero, com dois jogadores, de informação perfeita, logo analisável por Zermelo (1913).
- Uma "verdade" do jogo já existe (Brancas ganham, Pretas ganham, ou empate sob jogo perfeito), mas $10^{120}$ partidas a tornam inacessível.
- Minimax = maximizar para si supondo que o outro minimiza para si. É o que o seu cérebro faz sem saber.
- A poda alfa-beta dobra a profundidade alcançável: a razão pela qual o Deep Blue batia Kasparov em 1997.
- O equilíbrio de Nash explica por que certas aberturas (a Espanhola) atravessam os séculos: ninguém tem interesse em desviar sozinho.
- A **eliminação das estratégias dominadas** é o que te permite calcular só 3-5 lances de 35 sem pensar: você descarta intuitivamente o que é estritamente pior.
- Na prática, a informação nunca é perfeita: a incerteza está na cabeça do adversário, não no tabuleiro. É aí que a psicologia substitui a matemática.

### Fontes e referências

- **von Neumann, J., & Morgenstern, O.** *Theory of Games and Economic Behavior.* Princeton University Press, 1944. (O texto fundador da teoria dos jogos moderna.)
- **Nash, J.** [*Non-Cooperative Games.*](https://www.jstor.org/stable/1969529) Annals of Mathematics, 54(2), 286-295, 1951. (A introdução formal do equilíbrio de Nash.)
- **Zermelo, E.** *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels.* Proceedings of the Fifth International Congress of Mathematicians, 1913. (O teorema fundador sobre a resolução dos jogos finitos.)
- **Schaeffer, J., et al.** [*Checkers Is Solved.*](https://www.science.org/doi/10.1126/science.1144079) Science, 317(5844), 1518-1522, 2007. (A resolução completa do jogo de damas por computador.)
- **Shannon, C. E.** *Programming a Computer for Playing Chess.* Philosophical Magazine, Series 7, 41(314), 1950. (A estimativa do número de partidas possíveis no xadrez.)
