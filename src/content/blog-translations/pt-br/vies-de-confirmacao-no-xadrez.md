---
title: "O viés de confirmação no xadrez: você calcula o seu plano, nunca a refutação dele"
excerpt: >-
  Oito minutos numa combinação, e ele joga uma defesa que você nem tinha olhado. Não é
  falta de tempo. Um estudo feito com enxadristas mostra que os mestres tentam
  refutar o próprio plano, e que os novatos tentam confirmá-lo.
seoTitle: "Viés de confirmação no xadrez: buscar a refutação do próprio plano"
seoDescription: >-
  O viés de confirmação aplicado ao cálculo no xadrez. O que a tarefa de Wason revela, e por que
  os mestres refutam os próprios planos enquanto os novatos os confirmam.
frSlug: biais-de-confirmation-aux-echecs
draft: false
tags:
  - viés de confirmação
  - Wason
  - falsificação
  - cálculo
  - expertise
  - vieses cognitivos
  - xadrez
faq:
  - question: "O que é o viés de confirmação?"
    answer: >-
      É a tendência a buscar, interpretar e memorizar a informação de um jeito que sustente o que a gente
      já acredita, em vez de colocá-la à prova. Peter Wason demonstrou isso em 1960 com uma tarefa
      que ficou famosa, na qual os participantes testavam a própria hipótese com exemplos feitos para confirmá-la
      em vez de procurar exemplos que a invalidassem.
  - question: "Como o viés de confirmação aparece durante o cálculo?"
    answer: >-
      Como uma assimetria na árvore de variantes. Você calcula longamente a sequência que deixa o seu plano
      brilhante, e bem menos as respostas do adversário que o destroem. A árvore não é
      curta demais, ela é desequilibrada: profunda do lado que te dá razão, superficial do outro.
  - question: "Os jogadores fortes escapam do viés de confirmação?"
    answer: >-
      Em parte, e esse é um resultado importante. Cowley e Byrne mostraram em 2004 que os mestres
      geravam com mais facilidade sequências que refutavam os próprios planos, enquanto os novatos tendiam
      a confirmá-los. Isso sugere que a capacidade de falsificação não é um traço de caráter,
      e sim uma competência ligada à expertise numa área.
  - question: "Como treinar para refutar os meus próprios planos?"
    answer: >-
      Com uma regra explícita, não com boa vontade. Antes de jogar um lance calculado,
      formule a pergunta: qual resposta do adversário deixaria esse lance ruim? Depois procure por ela
      durante um tempo fixo. O importante é que a busca seja obrigatória e limitada, não que seja
      sincera: sinceridade contra si mesmo raramente se consegue.
  - question: "O motor de análise ajuda a corrigir esse viés?"
    answer: >-
      Só parcialmente. Ele te diz que o seu lance era ruim, mas não te diz que você nunca
      olhou a refutação. E é justamente essa informação que importa. Para recuperá-la, é preciso
      anotar antes da análise o que você tinha calculado de verdade, senão a memória vai reconstruir uma
      versão em que você tinha visto tudo.
---

Você vê no lance 24. Uma combinação. Sacrifício de cavalo, xeque à descoberta, a dama cai.

Você calcula oito minutos. Confere a ordem dos lances. Estende até o lance 31 para se certificar de que o final está ganho. Você joga.

Ele responde em quarenta segundos com um lance que você não tinha olhado. Não é um lance difícil: é um lance que você teria achado em trinta segundos se tivesse procurado. Mas você não procurou.

É esse o assunto. O seu problema não era o tempo, você gastou oito minutos. O seu problema é **a direção em que esses oito minutos foram gastos**.

## A demonstração de Wason

Em 1960, o psicólogo britânico [Peter Wason](https://pt.wikipedia.org/wiki/Peter_Wason) publica um experimento de uma simplicidade desconcertante.

Você recebe três números: **2, 4, 6**. Eles obedecem a uma regra que o experimentador tem em mente. A sua tarefa é descobrir essa regra. Para isso você pode propor quantos trios quiser, e a cada vez alguém vai te dizer apenas se o seu trio respeita a regra ou não. Quando tiver certeza, você anuncia.

O que quase todos os participantes fazem parece perfeitamente racional. Eles formulam uma hipótese, tipicamente "números pares crescendo de dois em dois". Depois testam: 8, 10, 12. Sim. 20, 22, 24. Sim. 100, 102, 104. Sim.

Três confirmações. Eles anunciam a regra com confiança. E estão errados.

A regra era **"três números em ordem crescente"**. Bem mais ampla. E a razão de não terem descoberto é cruel na sua simplicidade: os testes deles não podiam revelar nada. Todos os trios foram escolhidos para serem compatíveis com a hipótese deles. Uma resposta positiva estava garantida de antemão, logo não carregava informação nenhuma.

O único teste útil teria sido tentar algo como **1, 2, 3**, ou mesmo **3, 17, 42**. Um trio que a própria hipótese deles rejeitaria. A resposta "sim" teria demolido a hipótese na hora e feito a investigação avançar.

Wason estendeu esse trabalho em 1968 com a tarefa de seleção, ainda mais célebre, na qual a esmagadora maioria dos participantes vira as cartas que poderiam confirmar uma regra em vez das que poderiam desmenti-la.

Em 1998, Raymond Nickerson dedica ao tema uma revisão que virou referência, na *Review of General Psychology*, e a conclusão dele é ampla: esse viés atravessa a ciência, a medicina, a justiça e a vida comum.

## A forma que isso toma no tabuleiro

Volte à sua combinação e veja como os seus oito minutos se distribuíram.

Você calculou: jogo Cxf7, ele recaptura Rxf7, tenho Dh5+, ele precisa jogar Rg8, e aí Bxh7+ ganha a dama. Cada etapa foi conferida. A linha está correta. Você até a estendeu.

Agora conte o tempo gasto **nas outras respostas dele**. No que acontece se ele não recapturar. No lance intermediário que dá xeque antes de recapturar. Na defesa que abandona o material mas quebra a sua coordenação.

Provavelmente alguns segundos, ou nada.

A sua árvore de variantes não estava curta demais. Ela estava **desequilibrada**. Profunda, precisa e caprichada do lado que te dá razão. Quase inexistente do lado que te contradiria. E é exatamente o trio 8-10-12 de Wason: um teste que só podia produzir uma confirmação.

Dois mecanismos deixam a coisa especialmente teimosa no xadrez.

**O investimento.** Quanto mais você calculou uma ideia, mais caro custa abandoná-la. Depois de seis minutos numa combinação, o cérebro não procura mais se ela é boa: procura como fazê-la funcionar. É o mecanismo de justificação descrito no nosso artigo sobre [a dissonância cognitiva no xadrez](/pt-br/blog/dissonance-cognitive-aux-echecs/).

**A beleza.** Uma combinação é esteticamente satisfatória. O prazer que ela dá é uma recompensa recebida **antes** de você saber se ela funciona, e essa recompensa contamina o exame que vem depois. As ideias feias são examinadas com mais honestidade que as bonitas.

## O resultado que muda tudo

Agora vem o ponto que sozinho justifica este artigo, e ele vem de um estudo feito diretamente com enxadristas.

Em 2004, Michelle Cowley e Ruth Byrne, do Trinity College de Dublin, apresentam na conferência anual da Cognitive Science Society um trabalho intitulado "Chess masters' hypothesis testing". A pergunta deles: o viés de confirmação resiste à expertise?

O protocolo consiste em pedir a jogadores de níveis diferentes que formulem um plano para uma posição, e depois gerem as sequências de lances que permitem avaliá-lo.

Resultado: **os mestres geram com mais facilidade sequências que refutam o próprio plano. Os novatos tendem a confirmá-lo.**

Os mestres também são melhores em detectar o lance adversário exato que invalida uma hipótese. Os autores propõem uma explicação: o acesso a um repertório amplo de conhecimento permite considerar mais lances possíveis, tanto para si quanto para o adversário, o que torna a refutação materialmente acessível.

### Por que isso importa

Esse resultado corrige uma ideia difundida que aparece em todo lugar, inclusive no nosso próprio panorama dos [5 vieses cognitivos que te fazem dar blunder](/pt-br/blog/5-biais-cognitifs-blunder/), onde está escrito que esse viés afeta novatos e especialistas do mesmo jeito. Dentro da área de expertise, não é isso que Cowley e Byrne mostram.

E a implicação é otimista. Se os mestres refutassem melhor por terem um temperamento mais cético, não haveria nada a fazer. Mas a explicação proposta é outra: eles refutam melhor **porque conhecem mais lances**. A falsificação não é uma virtude, é uma consequência do repertório.

Os autores chegam a sugerir que essa capacidade poderia ser um componente do que é a expertise. Não achar mais rápido a ideia certa, e sim eliminar mais rápido as ruins.

O que tem uma consequência prática direta: **treinar os seus padrões táticos não melhora só a sua capacidade de achar, mas também a sua capacidade de duvidar**. Você não consegue procurar uma refutação cuja forma nunca encontrou antes.

## Quatro protocolos

Lucidez por boa vontade não funciona aqui. É preciso ter regras aplicáveis com o relógio andando.

### 1. A pergunta obrigatória, e limitada

Antes de jogar um lance que você calculou por mais de dois minutos, uma só pergunta: **qual resposta deixaria esse lance ruim?**

Dois detalhes contam mais que a pergunta em si. Ela precisa ser **obrigatória**, disparada por um critério mecânico como a duração do cálculo, e não pela sua sensação de incerteza, que é justamente o que o viés distorce. E precisa ser **limitada**: um minuto, não mais. Uma busca sem limite não vai ser feita.

Você não está tentando ser honesto consigo mesmo, o que é difícil. Você está disparando um procedimento, o que é fácil.

### 2. Troque de cadeira

O método mais eficaz, e o menos praticado.

Não procure "os defeitos do meu plano", formulação que te deixa dono do plano. Pergunte-se: **se eu tivesse as peças dele, o que eu jogaria agora?**

A mudança de ponto de vista faz muito mais que a mudança de intenção. Da cadeira dele, a sua combinação não é mais a sua ideia a defender: é uma ameaça a parar. E parar uma ameaça é uma tarefa na qual você é bem mais competente do que em criticar o próprio trabalho.

### 3. O candidato obrigatório

Antes de calcular qualquer coisa, liste **três** lances candidatos. Não um. Três.

A regra vem do método de Kotov, mas aqui ela tem uma função precisa: impedir que você entre no cálculo com uma hipótese única já instalada. Wason mostrou que o problema nasce no momento em que a hipótese vira única, porque todo o resto do trabalho passa a ser organizado em torno dela.

### 4. Anote antes de analisar

Este vale para o pós-partida, e é o único jeito de medir o seu próprio viés.

Quando você analisa no motor, aprende que o seu lance 24 era ruim. Não aprende que **você nunca tinha olhado a refutação**. E é essa informação que tem valor, porque ela fala do seu processo e não da posição.

O único jeito de preservá-la: anotar, durante ou logo depois da partida, o que você realmente calculou. Sem essa anotação, a sua memória vai reconstruir uma versão na qual você tinha considerado a resposta dele mas avaliou mal a continuação. Isso quase nunca é verdade, e é o tema de um artigo desta série ainda por vir, sobre a memória reconstrutiva. O método geral está detalhado no nosso guia sobre [analisar as próprias partidas](/pt-br/blog/analyser-ses-parties/).

## O que ficar

O viés de confirmação não te faz calcular menos. Ele te faz calcular **numa direção só**. Wason mostrou isso em 1960 com três números: os participantes testavam a hipótese com exemplos incapazes de desmenti-la, e se declaravam seguros ao fim de uma demonstração vazia.

No xadrez, isso produz uma árvore de variantes assimétrica. Oito minutos do lado que te dá razão, alguns segundos do outro. E dois fatores agravantes próprios do jogo: o tempo já investido na ideia, e o prazer estético que ela dá antes mesmo de ser verificada.

A boa notícia vem de um estudo feito com jogadores. Os mestres refutam os próprios planos melhor que os novatos, e provavelmente porque conhecem mais lances, não porque sejam mais lúcidos por natureza. A capacidade de duvidar de si mesmo, numa área, se compra com o conhecimento dessa área.

Em outras palavras: a pergunta "o que me mostraria que estou errado" só tem valor se você tiver meios de respondê-la. O resto do trabalho serve para adquiri-los.

**Depois da leitura:** na sua próxima partida, se imponha a regra uma única vez. Um lance calculado por mais de dois minutos, um minuto obrigatório procurando a refutação, a partir da cadeira do adversário. Uma vez basta para ver quanta coisa aparece.

---

*Este artigo faz parte de uma série sobre a psicologia aplicada ao xadrez. Veja também [o efeito Dunning-Kruger no xadrez](/pt-br/blog/effet-dunning-kruger-aux-echecs/), [a dissonância cognitiva no xadrez](/pt-br/blog/dissonance-cognitive-aux-echecs/) e [o viés do sobrevivente no xadrez](/pt-br/blog/biais-du-survivant-aux-echecs/).*

## Fontes

- Wason, P. C. (1960). On the failure to eliminate hypotheses in a conceptual task. *Quarterly Journal of Experimental Psychology*, 12(3), 129–140.
- Wason, P. C. (1968). Reasoning about a rule. *Quarterly Journal of Experimental Psychology*, 20(3), 273–281.
- Nickerson, R. S. (1998). Confirmation bias : A ubiquitous phenomenon in many guises. *Review of General Psychology*, 2(2), 175–220.
- Cowley, M., & Byrne, R. M. J. (2004). Chess masters' hypothesis testing. In *Proceedings of the 26th Annual Conference of the Cognitive Science Society*, 705–710.
