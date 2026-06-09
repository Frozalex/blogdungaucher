---
title: "Decisão sob incerteza no xadrez: escolher sem conhecer todas as variantes"
excerpt: >-
  Nenhuma partida de xadrez é jogada com informação completa. Você decide sempre sem calcular até o fim, sem saber
  o que o adversário vai responder, sem certeza sobre sua avaliação. A teoria da decisão sob incerteza tem cem anos
  de ferramentas para esse momento preciso. Aqui estão as que se aplicam ao tabuleiro.
seoTitle: "Decisão sob incerteza no xadrez: utilidade esperada, Bayes e racionalidade limitada"
seoDescription: "Utilidade esperada, critério bayesiano, aversão à perda, racionalidade limitada: as ferramentas da teoria da decisão aplicadas ao momento em que você escolhe um lance sem saber tudo."
frSlug: decision-sous-incertitude-aux-echecs
---

Você tem quatro lances candidatos. Não tem tempo para calcular cada um até o fim. Sabe que sua avaliação é aproximada. Sabe que o adversário não vai necessariamente jogar a melhor resposta teórica. Precisa escolher mesmo assim.

Esse momento não tem nada de excepcional: é a situação padrão no xadrez. Uma partida inteira é uma série de decisões tomadas sem informação completa. A teoria da decisão sob incerteza estuda exatamente esse momento. Ela tem um século de ferramentas matemáticas e experimentais para oferecer ao jogador que quer compreender o que faz quando escolhe.

## Primeiro: do que este artigo não trata

No xadrez, a palavra "incerteza" está em todo lugar. Antes de avançar, é preciso separar este artigo de alguns vizinhos próximos.

**Não é teoria dos jogos.** A teoria dos jogos no xadrez estuda a interação estratégica entre jogadores: equilíbrios, antecipações mútuas, estratégias ótimas com informação completa. Aqui o foco é mais preciso: a decisão *individual* diante de uma incerteza.

**Não é estatística bayesiana pura.** O artigo sobre redes bayesianas no xadrez olha para como construir modelos estatísticos para prever eventos (erros graves, vitórias). Aqui o interesse é o uso do raciocínio bayesiano como método de decisão em tempo real.

**Não é complexidade algorítmica.** O fato de o xadrez ser um problema EXPTIME-completo explica *por que* você precisa decidir sob incerteza. Mas o *como*, isso é aqui.

O tema próprio deste artigo: o que fazer no momento preciso em que você hesita entre vários lances e sabe que não vai saber tudo.

## O quadro clássico: a utilidade esperada

O primeiro quadro matemático da decisão sob incerteza foi formalizado por [John von Neumann](https://pt.wikipedia.org/wiki/John_von_Neumann) e [Oskar Morgenstern](https://pt.wikipedia.org/wiki/Oskar_Morgenstern) em 1944 em *Theory of Games and Economic Behavior*. O princípio é simples: diante de uma decisão, atribua a cada resultado possível uma **utilidade** (um número que representa seu valor para você) e uma **probabilidade**, multiplique os dois, some sobre os resultados, e escolha a opção com a maior utilidade esperada.

Matematicamente: $E[U(a)] = \sum_s p(s|a) \cdot U(s)$, onde $a$ é a ação escolhida e $s$ os estados do mundo possíveis.

No xadrez, aplique esse quadro a uma escolha entre dois lances:

Lance A: 60% de chance de chegar a +0,8, 40% de chance de cair para 0,0. Esperança = 0,48.
Lance B: 30% de chance de chegar a +2,0, 70% de chance de cair para -0,3. Esperança = 0,39.

A utilidade esperada recomenda o lance A. Mas muitos jogadores escolhem intuitivamente o lance B: "se der certo, ganho". Essa é já a primeira lição: nossas intuições frequentemente divergem do critério de utilidade esperada. E isso não é necessariamente um erro.

## Por que a utilidade esperada sozinha não basta

O critério de utilidade esperada tem um defeito fundamental: ele pressupõe que você conhece as probabilidades. No xadrez, você as *estima*, e suas estimativas são imprecisas. Não é um detalhe: é uma diferença de natureza.

[Frank Knight](https://pt.wikipedia.org/wiki/Frank_Knight) introduziu em 1921 a distinção entre **risco** (probabilidades conhecidas) e **incerteza** (probabilidades desconhecidas). O pôquer é globalmente um jogo de risco: a distribuição das cartas é conhecida, apostamos em probabilidades calculáveis. O xadrez é um jogo de incerteza knightiana: você não tem uma tabela de probabilidades para "o adversário vai jogar Tc4 depois do meu Cf5".

Quando passamos do risco para a incerteza knightiana, a utilidade esperada pura se torna um guia imperfeito. Vários critérios alternativos foram propostos, levando em conta o desconhecimento das próprias probabilidades.

## O critério maximin: segurança contra otimização

O **critério maximin** diz: escolha a ação cujo pior resultado possível é o menos ruim. É o critério do pessimista racional.

Matematicamente: escolha a ação $a$ que maximiza $\min_s U(s, a)$.

No xadrez, esse critério corresponde ao jogo **sólido**: você escolhe o lance cujo pior resposta adversária possível ainda te deixa em posição jogável. Jogadores como [Tigran Petrossian](https://pt.wikipedia.org/wiki/Tigran_Petrossian) ou [Anatoli Karpov](https://pt.wikipedia.org/wiki/Anatoli_Karpov) fundaram grande parte do seu jogo em critérios próximos do maximin.

A vantagem: você se protege dos erros de estimativa. Pode se enganar sobre as probabilidades e ainda conservar um resultado aceitável.

A desvantagem: você pode deixar passar ganhos importantes. Um lance brilhante com 80% de chances de sucesso pode ter um pior cenário em -1,5, contra um lance sólido com 30% de ganho mas pior cenário em 0,0. O maximin escolherá o sólido mesmo que a esperança penda para o audacioso.

O maximin tem seu lugar: em zeitnot, no final de torneio com uma vitória suficiente para o ranking, contra um adversário imprevisível. Fora desses casos, é um critério excessivamente prudente.

## O critério bayesiano: decidir com um prior

O critério **bayesiano** combina dois ingredientes: seu *prior* (o que você pensa antes de analisar esta posição específica) e seu *likelihood* (o que a análise da posição revela).

A fórmula de Bayes: $p(\text{hipótese}|\text{dados}) \propto p(\text{dados}|\text{hipótese}) \cdot p(\text{hipótese})$.

Em termos de xadrez: sua estimativa final de uma variante combina o que você sabe em geral sobre esse tipo de posição (prior) com o que esta posição precisa te diz (likelihood). Os dois contam. Um jogador que se apoia apenas no prior joga lances corretos mas cegos às particularidades. Um jogador que se apoia apenas na posição à sua frente perde elementos que o conhecimento geral teria valorizado.

A ponderação entre prior e likelihood deve depender da qualidade de cada um:

- Posição conhecida, estrutura clássica, abertura dominada: você pode dar mais peso ao seu prior. Sua experiência compensa a imprecisão do cálculo.
- Posição incomum, fora do seu repertório, estrutura rara: seu prior é pouco confiável, dê mais peso à análise concreta, mesmo imperfeita.

Essa atualização bayesiana acontece naturalmente nos jogadores fortes: eles sabem quando "ouvir" a intuição (prior sólido) e quando deixá-la de lado (prior pouco confiável nesta posição).

## A aversão à perda e a função de utilidade não linear

[Daniel Kahneman](https://pt.wikipedia.org/wiki/Daniel_Kahneman) e [Amos Tversky](https://pt.wikipedia.org/wiki/Amos_Tversky) mostraram na *Prospect Theory* (1979) que os humanos não tratam simetricamente ganhos e perdas. Uma perda de X é sentida aproximadamente duas vezes mais forte do que um ganho equivalente. É a **aversão à perda**.

No xadrez, essa assimetria produz vieses sistemáticos:

- Preferência por lances sólidos quando se está em igualdade ou com leve vantagem: protege-se o que foi conquistado.
- Tomada de risco excessiva quando se está em desvantagem: busca-se o lance milagroso porque "já está perdendo".
- Recusa de propostas de empate em posições efetivamente iguais: aceitar o empate é sentido como uma perda em relação à expectativa de ganho.

Essa assimetria não é irracional no sentido estrito. Ela reflete uma função de utilidade não linear e côncava nos ganhos, convexa nas perdas. Mas ela se afasta da maximização da utilidade esperada matemática. E esses desvios custam pontos.

Reconhecer seus próprios vieses de aversão à perda é o primeiro passo para corrigi-los. Quando você hesita entre um lance sólido em +0,3 e um lance ambicioso em +0,8 de esperança, pergunte-se se a hesitação vem de uma genuína incerteza sobre as probabilidades, ou simplesmente do medo de perder o que já conquistou.

## A racionalidade limitada: Simon e o satisficing

[Herbert Simon](https://pt.wikipedia.org/wiki/Herbert_Simon), Prêmio Nobel de Economia em 1978, mostrou que a otimização matemática pura é inacessível a agentes reais porque o cálculo tem um custo. Ele propõe o conceito de **racionalidade limitada** (*bounded rationality*) e a estratégia do **satisficing**: não buscar o melhor, buscar um suficientemente bom.

Essa intuição é central no xadrez. Você não tem tempo para encontrar o melhor lance matemático em uma posição complexa. Você busca um lance que satisfaça um limiar de qualidade aceitável, e joga. O tempo ganho pode servir em outro momento da partida onde será mais rentável.

Simon até formalizou essa ideia para o xadrez em seus trabalhos sobre expertise. Jogadores fortes não calculam exaustivamente: usam heurísticas baseadas no reconhecimento de padrões para reduzir o espaço de busca a alguns lances candidatos, depois analisam esses candidatos com mais profundidade.

O satisficing no xadrez se desdobra assim:

- **Posição calma**: jogue o primeiro lance candidato que passar na sua verificação de segurança (1-2 minutos). Não busque mais.
- **Posição tática**: aprofunde em 2-3 candidatos, escolha o mais bem avaliado dos três (5-10 minutos).
- **Posição crítica**: analise os 3-4 candidatos até um horizonte profundo, aceite gastar 15-20 minutos.

Aprender a dosar o tempo conforme a criticidade da posição é provavelmente o critério mais discriminante entre jogadores intermediários e jogadores fortes.

## Decisão sob risco vs sob ambiguidade: Ellsberg e o caso Siciliana

[Daniel Ellsberg](https://pt.wikipedia.org/wiki/Daniel_Ellsberg) mostrou em sua tese de 1961 que os humanos geralmente preferem escolhas onde *conhecem* as probabilidades, mesmo imperfeitas, àquelas onde estão na incerteza knightiana pura. É o **paradoxo de Ellsberg**.

No xadrez, esse paradoxo explica uma assimetria conhecida. Imagine que você escolhe entre duas aberturas:

- Variante A: você a domina bem, estima que ganha 55% contra jogadores do seu nível.
- Variante B: você a conhece pouco, *acredita* que é melhor, talvez 60%, mas não tem certeza.

A maximização da esperança sugere B. Mas a aversão à ambiguidade empurra para A. E empiricamente, A é frequentemente a escolha certa: suas estimativas sobre B são menos confiáveis, então os 60% têm uma variância importante em torno. A segurança informacional tem valor.

Essa lógica justifica certas escolhas conservadoras em repertório de abertura, especialmente em torneio com apostas. Ela não justifica o recuo sistemático ao que se conhece: no treino e fora de apostas, sair da zona de ambiguidade é exatamente o que amplia seu domínio de risco controlado.

## A decisão no tempo limitado: o fator relógio

Todas as teorias acima pressupõem implicitamente um tempo de decisão ilimitado. No xadrez, o relógio é parte integrante do problema. A questão não é apenas "qual lance escolher?", mas "quantos minutos dedicar a essa escolha?".

Economicamente, é um problema de **valor marginal do tempo**. Cada minuto adicional de cálculo tem uma utilidade decrescente: passar de 1 para 2 minutos melhora muito seu lance, passar de 30 para 31 minutos quase nada. E cada minuto dedicado a esta decisão é um minuto a menos para decisões futuras.

Uma aproximação útil: aloque seu tempo proporcionalmente à **criticidade** estimada da posição, e inversamente à **liquidez** das decisões futuras. Mais precisamente:

- Se você vê claramente os 5 próximos lances (posição líquida), dedique pouco tempo ao lance atual.
- Se a posição é crítica mas clara (um único lance ganha, você o viu), valide rapidamente e jogue.
- Se a posição é crítica e ambígua, é o momento de investir. É raro: talvez 3 ou 4 momentos por partida.

Jogadores fortes têm uma leitura instintiva dessas zonas críticas, aprendida ao longo de milhares de partidas. Para os demais, uma regra prática: se a avaliação dos seus lances candidatos varia mais de 0,5 entre eles, você está em uma zona crítica.

## Decisão baseada em reconhecimento: o modelo de Klein

[Gary Klein](https://en.wikipedia.org/wiki/Gary_A._Klein), psicólogo cognitivo, estudou como especialistas (bombeiros, pilotos, médicos emergencistas) tomam decisões sob pressão e incerteza. Seu modelo de **recognition-primed decision** (RPD), publicado em 1998 em *Sources of Power*, descreve como eles procedem:

1. Reconhecimento de um padrão na situação.
2. Ativação de uma ação associada a esse padrão na memória especializada.
3. Simulação mental rápida dessa ação.
4. Se a simulação valida, execução imediata. Caso contrário, busca de um padrão alternativo.

Esse modelo descreve bem a tomada de decisão dos Grandes Mestres em partidas rápidas ou blitz. Eles não procedem por exploração exaustiva: reconhecem um tipo de posição, ativam um tipo de plano associado na memória, simulam rapidamente, e jogam.

A implicação prática para jogadores em progressão: a qualidade da sua base de padrões reconhecíveis é o que determina a qualidade das suas decisões sob pressão. Trabalhar posições típicas, memorizar estruturas, estudar finais tipo: tudo isso constrói o repertório que servirá em RPD quando você não tiver tempo para analisar.

## O princípio do menor compromisso

Uma heurística subestimada na teoria da decisão sob incerteza é o **princípio do menor compromisso**: quando você não sabe, mantenha suas opções abertas pelo maior tempo possível.

No xadrez, esse princípio se traduz por:

- Preferir um lance que mantém vários planos plausíveis a um que se compromete definitivamente com um único plano.
- Escolher um lance que não fecha a posição se a avaliação é incerta.
- Adiar decisões estruturais (trocas, sacrifícios, aberturas de colunas) enquanto a avaliação permanece ambígua.

Esse princípio tem um custo: você pode parecer indeciso ou passivo. Mas na presença de incerteza real sobre a posição, é uma estratégia estatisticamente vencedora. Você obtém mais informações sem pagar o preço de um compromisso prematuro.

É um princípio que [José Raúl Capablanca](https://pt.wikipedia.org/wiki/Jos%C3%A9_Ra%C3%BAl_Capablanca) aplicava sistematicamente no meio-jogo. Em vez de forçar uma decisão, ele melhorava sua posição progressivamente, esperando que o adversário se comprometesse primeiro ou que a posição ficasse mais clara.

## Um protocolo de decisão em 7 etapas

Para integrar tudo isso numa rotina concreta, aqui está um protocolo utilizável em partida clássica. Não é para aplicar rigorosamente em cada lance, mas para mobilizar nas posições onde você sente que precisa "realmente pensar".

1. **Quadro temporal.** Quantos minutos custa uma decisão desta importância? Resposta a dar em menos de 30 segundos. Estabeleça um orçamento.

2. **Identificação dos candidatos.** Três a cinco lances no máximo. Além disso, seu tempo está mal investido em exploração superficial. Se você não tem candidatos claros, é um sinal de que o prior é fraco e que você precisa se apoiar mais na análise concreta.

3. **Avaliação rápida de cada candidato.** Uma a duas frases mentais por candidato. Objetivo: eliminar os lances manifestamente inferiores.

4. **Identificação das zonas de incerteza.** Nos lances restantes, qual é a principal incerteza? A avaliação final? A resposta adversária precisa? As consequências a longo prazo?

5. **Critério de escolha.** Você privilegia a esperança mais alta? O pior cenário menos ruim (maximin)? O menor compromisso? A escolha do critério depende do contexto (pontuação no torneio, adversário, posição na partida).

6. **Verificação anti-erro grave.** Antes de jogar, uma última passagem: seu lance deixa alguma ameaça adversária descoberta? Verifique xeques, capturas, garfos, baterias.

7. **Decisão.** Você joga. Não volta atrás. A ruminação pós-lance é gerenciada por outros mecanismos.

Esse protocolo, aplicado aos 5 ou 6 momentos críticos de uma partida, consome pouco tempo cumulado. Nos lances não críticos, a experiência é suficiente.

**Após a leitura:** identifique na sua última partida *um* lance em que você escolheu entre dois candidatos sem um procedimento claro. Reconstrua a posteriori qual critério implícito você usou. O resultado pode surpreender.

---

## O que guardar

- Toda decisão no xadrez é tomada sob incerteza knightiana: você não conhece nem todas as variantes nem as probabilidades exatas.
- A utilidade esperada é um critério útil mas insuficiente. O maximin, o critério bayesiano, o satisficing e o princípio do menor compromisso se aplicam conforme o contexto.
- A aversão à perda e a aversão à ambiguidade distorcem sistematicamente as escolhas humanas. Reconhecê-las é o primeiro passo para corrigi-las.
- A racionalidade limitada de Simon implica alocar o tempo de reflexão proporcionalmente à criticidade estimada de cada decisão.
- Os Grandes Mestres não procedem por exploração exaustiva, mas por decisão baseada em reconhecimento: a qualidade da sua base de padrões determina a qualidade das suas decisões rápidas.

### Fontes e referências

- **von Neumann, J., & Morgenstern, O.** *Theory of Games and Economic Behavior.* Princeton University Press, 1944.
- **Knight, F. H.** *Risk, Uncertainty and Profit.* Houghton Mifflin, 1921.
- **Kahneman, D., & Tversky, A.** *Prospect Theory: An Analysis of Decision under Risk.* *Econometrica*, 47(2), 263-291, 1979.
- **Simon, H. A.** *A Behavioral Model of Rational Choice.* *Quarterly Journal of Economics*, 69(1), 99-118, 1955.
- **Ellsberg, D.** *Risk, Ambiguity, and the Savage Axioms.* *Quarterly Journal of Economics*, 75(4), 643-669, 1961.
- **Klein, G. A.** *Sources of Power: How People Make Decisions.* MIT Press, 1998.
- **Gigerenzer, G., & Selten, R. (Eds.).** *Bounded Rationality: The Adaptive Toolbox.* MIT Press, 2001.
