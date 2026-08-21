---
title: "O viés do sobrevivente no xadrez: o cemitério que você não vê"
excerpt: >-
  A teoria das aberturas é construída sobre as partidas que foram publicadas. Os conselhos de grandes
  mestres vêm de quem virou grande mestre. Em 502 000 jogadores com rating, cerca de 1 750
  têm o título. Tudo o que você aprende vem dos sobreviventes.
seoTitle: "Viés do sobrevivente no xadrez: aberturas, conselhos de GM e prodígios"
seoDescription: >-
  O viés do sobrevivente aplicado ao xadrez: por que a teoria das aberturas, os conselhos de grandes
  mestres e as histórias de prodígios descrevem todos uma amostra da qual os perdedores sumiram.
frSlug: biais-du-survivant-aux-echecs
draft: false
tags:
  - viés do sobrevivente
  - vieses cognitivos
  - Abraham Wald
  - aberturas
  - progressão
  - estatísticas
  - xadrez
faq:
  - question: "O que é o viés do sobrevivente?"
    answer: >-
      É o erro de tirar conclusões a partir apenas dos elementos que passaram por um
      filtro, esquecendo os que o filtro eliminou porque eles são, por construção, invisíveis.
      A ilustração clássica vem dos trabalhos do estatístico Abraham Wald em 1943 sobre os aviões
      que voltavam das missões: os impactos observados nos sobreviventes indicam onde um avião aguenta
      levar dano, não onde ele é vulnerável.
  - question: "Em que a teoria das aberturas é enviesada pelos sobreviventes?"
    answer: >-
      Porque ela se constrói sobre as partidas que entram nas bases: essencialmente partidas
      de torneio entre jogadores com rating, publicadas e comentadas. As posições que não levam a lugar nenhum não
      produzem partidas célebres, logo não produzem análise, logo não produzem teoria. A ausência de uma linha
      na teoria raramente significa que ela foi refutada: quase sempre significa que
      ninguém teve motivo para publicá-la.
  - question: "Por que o meu gambito funciona tão bem se ele tem fama de duvidoso?"
    answer: >-
      Porque você está observando uma amostra filtrada. As partidas em que o gambito produziu um ataque
      espetacular são memoráveis e viram história. Aquelas em que o adversário aceitou, devolveu o material
      na hora certa e ganhou um final sem graça não viram história. A taxa de sucesso que você percebe
      é a das suas lembranças, não a da sua base de dados.
  - question: "O caso das irmãs Polgár prova que o treino basta?"
    answer: >-
      Não, por duas razões. Primeiro porque um protocolo sem grupo de controle e sem replicação não
      permite concluir. Segundo porque o próprio resultado é mais matizado do que se diz:
      Robert Howard mostrou em 2011 que, apesar de um treino comparável, as três irmãs não
      chegaram ao mesmo nível. Todas as famílias que tentaram algo parecido sem sucesso nunca
      viraram tema de livro.
  - question: "Como se proteger do viés do sobrevivente ao evoluir no xadrez?"
    answer: >-
      Buscando sistematicamente a amostra completa em vez dos casos notáveis. Na prática:
      consultar a porcentagem real numa base de dados em vez de confiar na impressão, manter um
      registro de todas as partidas e não só das marcantes, e se perguntar diante de cada conselho
      de jogador forte quantas pessoas o aplicaram sem que funcionasse.
---

Sempre tem alguém no clube que joga o mesmo gambito há quinze anos. Ele o defende com uma convicção tranquila: "objetivamente é duvidoso, mas em nível de clube funciona sempre".

E ele tem provas. Te mostra a partida em que o adversário pegou o peão, depois o segundo, e tomou mate no lance 19. Outra em que o rei preto nunca conseguiu rocar. Uma terceira, magnífica, com sacrifício de torre.

São partidas de verdade. Aconteceram mesmo. E, ainda assim, a conclusão dele está errada, por uma razão que não tem nada a ver com xadrez e tudo a ver com o que é possível contar.

## Os aviões que voltavam

A história virou o atalho universal para explicar esse viés, e merece ser contada direito, porque a versão que circula é ela mesma deformada.

Durante a Segunda Guerra Mundial, o [Statistical Research Group](https://pt.wikipedia.org/wiki/Vi%C3%A9s_de_sobreviv%C3%AAncia) da universidade Columbia trabalha para o exército americano. Entre os membros, um matemático de origem húngara, [Abraham Wald](https://pt.wikipedia.org/wiki/Abraham_Wald).

O problema colocado é concreto: os bombardeiros voltam das missões crivados de impactos. A blindagem custa peso, logo custa combustível e carga útil. Só dá para colocá-la numa parte do aparelho. Onde?

A resposta intuitiva consiste em levantar a distribuição dos impactos nos aviões que voltaram e reforçar as zonas mais atingidas. É razoável. E está errado.

Wald produz em 1943 uma série de memorandos técnicos cujo título já anuncia o raciocínio: um método de estimativa da vulnerabilidade de um avião a partir dos danos observados nos sobreviventes. O ponto dele é que **a amostra disponível não é a amostra pertinente**. Os aviões estudados são os que voltaram. Se voltaram com buracos nas asas, é justamente porque buracos nas asas não impedem de voltar. As zonas sem impacto nos sobreviventes são aquelas cujo dano foi fatal, e esses aparelhos não estão nos dados.

### A lenda é ela mesma uma sobrevivente

Uma ironia pequena que vale registrar, porque é instrutiva.

A imagem que todo mundo associa a essa história, uma silhueta de bombardeiro coberta de pontos vermelhos com a legenda "blinde as zonas vazias", é **uma ilustração moderna**. Wald nunca a desenhou. A frase de efeito que atribuem a ele, "blinde onde não tem buraco", não aparece em nenhum dos escritos dele: o trabalho real consistia num cálculo de probabilidades de sobrevivência por zona, bem menos espetacular e bem mais rigoroso.

Os memorandos dele ficaram confidenciais até 1980, e foram levados ao conhecimento do público por Marc Mangel e Francisco Samaniego no *Journal of the American Statistical Association* em 1984. A Sociedade Americana de Matemática observa que vários dos detalhes mais saborosos da anedota são inverificáveis.

Ou seja: a história mais famosa sobre o viés do sobrevivente sobreviveu perdendo tudo o que a tornava complicada. Ela passou pelo filtro da repetição porque era contável. É exatamente o mecanismo que ela descreve.

## O que o filtro elimina no xadrez

O raciocínio se transpõe para qualquer lugar em que um filtro separa o que se observa do que existiu. No xadrez existem pelo menos quatro, e o primeiro é enorme.

### 1. A teoria das aberturas é um corpus de sobreviventes

Esse é o ponto mais importante deste artigo, e o menos formulado.

O seu conhecimento das aberturas vem de algum lugar: livros, vídeos, bases de dados. Pergunte-se o que entra nessas fontes.

Uma partida entra numa base porque foi jogada em torneio oficial entre jogadores com rating, enviada a uma federação e integrada. Uma linha vira "teórica" porque alguém a jogou num nível que torna a partida digna de interesse, e depois ela foi analisada, publicada, discutida.

O filtro é, portanto, duplo: **o nível dos jogadores** e **o interesse da partida**.

Consequência direta: a teoria descreve os caminhos que jogadores fortes tiveram razão de tomar, e sobre os quais alguém teve razão de escrever. Ela não descreve o espaço dos lances jogáveis. Uma linha ausente da teoria raramente foi refutada. Quase sempre, ninguém teve motivo para publicá-la, o que não é nem de longe a mesma coisa.

É por isso que aberturas consideradas mortas há um século ressuscitam periodicamente quando um jogador forte decide olhá-las a sério. Elas não eram ruins. Elas estavam ausentes.

A era dos motores acrescentou um segundo filtro por cima do primeiro. As linhas refutadas por análise computacional somem dos repertórios, logo das partidas, logo das bases. A teoria converge para o que sobreviveu ao exame, o que é excelente para a solidez e discutível para a diversidade: ela descreve cada vez melhor um espaço cada vez mais estreito.

### 2. Os conselhos vêm de quem deu certo

Em maio de 2025, a FIDE tinha cerca de **502 000 jogadores** na lista de rating standard, e um pouco mais de 1,6 milhão de jogadores com rating em todos os ritmos somados. O número de grandes mestres é estimado entre **1 730 e 1 800**, dos quais **700 a 1 000 ativos**.

Faça a conta. O título de grande mestre diz respeito a algo em torno de **0,35%** dos jogadores com rating standard e, se ficarmos só nos ativos, cai para menos de 0,2%.

Agora pense na origem dos conselhos que você recebe. Os livros de método são escritos por jogadores fortes. Os vídeos de treinamento são produzidos por jogadores fortes. As entrevistas do tipo "como eu evoluí" são dadas por gente cuja evolução funcionou.

Isso não é um escândalo, é até normal: ninguém pergunta a quem fracassou como ter sucesso. Mas o corpus que resulta disso tem uma propriedade incômoda. **Só temos o ramo vencedor.** Se dez mil jogadores aplicaram o mesmo método e quinze ficaram fortes, são esses quinze que vão escrever o livro, e vão descrever honestamente o que fizeram. Nada no depoimento deles permite distinguir o que causou o sucesso do que apenas o acompanhou.

A pergunta a se fazer diante de cada conselho, portanto, não é "isso funcionou para ele", e sim **"quantas pessoas fizeram igual sem que funcionasse"**. Essa informação quase nunca existe. A ausência dela é o viés.

### 3. Os prodígios, e a família de que ninguém falou

O caso das irmãs Polgár é o exemplo mais citado. László Polgár afirmava que o gênio se educa, formou as três filhas no xadrez desde a primeira infância, e as três viraram jogadoras de nível internacional.

Dois problemas, nesta ordem.

O primeiro é estatístico. Um protocolo com três sujeitos, sem grupo de controle, sem replicação, não permite concluir. Polgár nunca reproduziu o experimento. E principalmente: **quantas famílias tentaram algo comparável sem resultado notável?** Não se sabe, e nunca se saberá, porque um fracasso desse tipo não gera livro nem documentário. Gera uma criança que parou de jogar xadrez aos catorze anos. São os aviões que não voltaram.

O segundo problema é mais interessante, porque diz respeito ao próprio resultado. Em 2011, o pesquisador Robert Howard publicou na *Cognitive Development* uma análise do caso mostrando que **apesar de um treino comparável, as três irmãs não chegaram ao mesmo nível**. Judit foi número 8 do mundo; Sofia, jogadora forte, não seguiu a mesma trajetória. Com protocolo igual, os resultados divergem. A conclusão dele: a expertise enxadrística não depende só da prática.

O debate de fundo entre inato e adquirido é tratado no nosso artigo sobre [genética e talento no xadrez](/pt-br/blog/echecs-et-genetique/). O que nos ocupa aqui é mais estreito: mesmo o exemplo invocado para provar a tese não a prova, e a amostra que permitiria decidir é invisível por construção.

### 4. O seu próprio gambito

Voltando ao jogador do começo.

Ele não inventa nada. As três partidas dele são reais. O filtro não está nos fatos, está **no que é memorável**.

Uma partida em que o gambito produz um ataque fulminante e mate no lance 19 é uma história. Ela se conta, se mostra, fica na memória dez anos. Uma partida em que o adversário aceita o peão, o devolve direitinho na hora certa, troca as damas e ganha um final de torres em cinquenta lances não é uma história. É chata, não se conta, e se esquece em uma semana.

A taxa de sucesso que ele percebe é a taxa de sucesso **das lembranças dele**. E as lembranças dele foram selecionadas por um critério que não tem nada a ver com eficácia: o quanto rendem uma boa história.

E o remédio, aqui, é trivial. A base de partidas dele contém a resposta exata. Basta filtrar pela abertura e ler a porcentagem. É o único dos quatro filtros que dá para levantar em trinta segundos, e é provavelmente por isso que tão pouca gente o levanta.

## Quatro reflexos

**Peça o denominador.** Diante de qualquer afirmação de sucesso, a pergunta útil não é "quantos conseguiram" e sim "de quantos". Um número sem denominador não é uma estatística, é uma anedota.

**Consulte a base, não a sua memória.** Para tudo o que envolve os seus próprios resultados por abertura, por cor, por ritmo, o dado existe e é gratuito. A sua memória não é uma amostra, é uma seleção editorial.

**Mantenha o registro completo.** Anote todas as suas partidas, inclusive os empates sem graça e as derrotas sem história. Um caderno que só contém as partidas marcantes acaba descrevendo um jogador que não existe. É o princípio básico de uma [análise de partidas que serve para alguma coisa](/pt-br/blog/analyser-ses-parties/).

**Procure os ausentes.** Toda vez que te apresentarem uma trajetória bem-sucedida, pergunte-se como seria o mesmo caminho para alguém em quem ele fracassou, e por que você nunca ouviria falar dessa pessoa. A resposta quase sempre é: porque não haveria nada a contar.

## O que ficar

O viés do sobrevivente não é um erro de raciocínio, é um erro de amostra. O raciocínio pode estar impecável: se os dados foram filtrados antes de chegar, a conclusão vai estar errada do mesmo jeito.

No xadrez, o filtro está em todo lugar e é especialmente discreto, porque o que foi eliminado não deixou traço nenhum. A teoria das aberturas descreve os caminhos publicados. Os métodos de treinamento vêm dos 0,35% que conseguiram o título. As histórias de prodígios são contadas pelas famílias em que deu certo. O seu gambito preferido é avaliado pelas suas lembranças mais contáveis.

Nenhuma dessas fontes mente. Todas descrevem fielmente os aviões que voltaram.

**Depois da leitura:** abra a sua base de partidas, filtre pela sua abertura preferida, e leia a sua porcentagem real. Compare com a que você teria anunciado de cabeça. A diferença é o viés, medido em você.

---

*Este artigo faz parte de uma série sobre a psicologia aplicada ao xadrez. Veja também [o efeito Dunning-Kruger no xadrez](/pt-br/blog/effet-dunning-kruger-aux-echecs/) e [a dissonância cognitiva no xadrez](/pt-br/blog/dissonance-cognitive-aux-echecs/).*

## Fontes

- Wald, A. (1943). *A Method of Estimating Plane Vulnerability Based on Damage of Survivors*. Statistical Research Group, Columbia University. Publicado em 1980 pelo Defense Technical Information Center.
- Mangel, M., & Samaniego, F. J. (1984). Abraham Wald's work on aircraft survivability. *Journal of the American Statistical Association*, 79(386), 259–267.
- Howard, R. W. (2011). Does high-level intellectual performance depend on practice alone? Debunking the Polgár sisters case. *Cognitive Development*, 26(3), 196–202.
- ChessBase (2025). *Chess statistics today*. Dados da lista de rating FIDE, maio de 2025.
