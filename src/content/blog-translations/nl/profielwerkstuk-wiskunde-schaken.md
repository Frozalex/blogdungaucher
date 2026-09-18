---
title: "Profielwerkstuk Wiskunde: schaken als toepassingsgebied van het eindexamenprogramma"
excerpt: >-
  Recurrente rijen, binomiale verdeling, combinatoriek, verwachtingswaarde en algoritmiek: hoe elk
  hoofdstuk van eindexamenwiskunde zijn perfecte illustratie vindt op het schaakbord.
seoTitle: "Profielwerkstuk Wiskunde: schaken en het eindexamenprogramma, compleet plan"
seoDescription: >-
  Profielwerkstuk Wiskunde over schaken: combinatoriek, kansrekening, Elo-rijen, binomiale verdeling.
  Gedetailleerd plan, formules en vragen van de commissie.
frSlug: grand-oral-maths-spe-echecs
draft: false
faq:
  - question: "Welke begrippen uit het eindexamenprogramma Wiskunde kun je met schaken illustreren?"
    answer: >-
      Schaken bestrijkt de vier grote delen van het eindexamenprogramma Wiskunde: combinatoriek en
      tellen (getal van Shannon, $10^{120}$ mogelijke partijen), kansrekening en de binomiale verdeling
      (modellering van een toernooi, verwachte Elo-uitkomst), recurrente rijen (de Elo-bijwerking is een
      rij $u_{n+1} = u_n + K(r_n - p_n)$), en algoritmiek (minimax als voorbeeld van recursie en
      complexiteit)."
  - question: "Hoe modelleer je de Elo-rating met rijen in het eindexamenprogramma?"
    answer: >-
      De Elo-rating is een recurrente rij: $u_{n+1} = u_n + K(r_n - p_n)$, waarbij $u_n$ de rating is na
      $n$ partijen, $K$ de correctiecoëfficiënt (16 of 32), $r_n$ het werkelijke resultaat (1, 0,5 of 0)
      en $p_n$ de door de logistische formule voorspelde winstkans. Deze rij convergeert naar de "ware"
      kracht van de speler."
  - question: "Hoe pas je de binomiale verdeling toe op schaaktoernooien?"
    answer: >-
      Als twee even sterke spelers (p=0,5) elkaar treffen in een match van 10 partijen, volgt het aantal
      keer dat een van hen exact k partijen wint een binomiale verdeling B(10, 0,5). Je kunt de kans
      berekenen om minstens 5,5 punten van de 10 te halen, de kans op een exacte uitslag van 6-4, of het
      histogram van de verdeling opbouwen."
  - question: "Wat is de convergente rij toegepast op schaken?"
    answer: >-
      De Elo-bijwerkingsrij convergeert: als een speler wiens werkelijke kracht $E$ is veel partijen
      speelt, neigt zijn rating $u_n$ naar $E$. Je kunt aantonen dat $|u_{n+1} - E| < |u_n - E|$ onder
      bepaalde voorwaarden, wat de convergentie bewijst."
  - question: "Welke probleemstellingen kun je kiezen voor een profielwerkstuk Wiskunde over schaken?"
    answer: >-
      De drie beste probleemstellingen zijn: (1) 'In hoeverre vormt het schaakspel een model van
      combinatorisch denken?' (invalshoek: tellen + zettenboom), (2) 'In hoeverre maakt kansrekening het
      mogelijk om schaakprestaties te modelleren en te voorspellen?' (invalshoek: binomiale verdeling +
      Elo-formule), en (3) 'Hoe verklaart wiskunde waarom schaken nooit door brute kracht opgelost zal
      worden?' (invalshoek: algoritmische complexiteit + getal van Shannon)."
---
Je hebt het profiel **Natuur en Techniek** met wiskunde als sterk vak, of je volgt **wiskunde** op een hoog niveau, en je zoekt een **onderwerp** dat **stevig verankerd is in het programma**, persoonlijk, en minder afgezaagd dan de zoveelste fractal of de rij van Fibonacci.

**Centrale stelling:** schaken als **compleet** toepassingsgebied van het **programma**: combinatoriek (explosie van stellingen), kansrekening (toernooi, Elo), recurrente rijen (rating-bijwerking), algoritmiek (minimax). Geen overzicht: een tabel met vergelijkingen hoofdstuk-schaakbord, gevolgd door de leveringen hieronder (formules, cijfervoorbeelden, plannen, vragen van de commissie, spiekbriefjes en voorbereidingstips).

## De begrippen achter het schaakspel begrijpen

### Coëfficiënt, duur, structuur

Een goed onderwerp voor je profielwerkstuk moet stevig verankerd zijn in het programma. Je **presentatie** moet begrijpelijk zijn voor niet-specialisten: een formule zomaar gooien kost punten. Je moet haar uitwerken, de notatie vertalen naar duidelijke taal, een cijfervoorbeeld geven vóór de abstracte formule.

### Bijzonderheden van een wiskundig onderwerp

Een commissie die wiskunde beoordeelt, verwacht drie specifieke elementen:
- **Minstens twee precieze berekeningen** die je uit het hoofd of op het bord uitvoert tijdens de presentatie
- **Een formule beheerst tot in de aannames ervan**: je moet weten wanneer ze van toepassing is en wanneer ze faalt
- **Een wiskundige nuance**: de grenzen van geldigheid van een model erkennen is even belangrijk als het presenteren ervan

## Combinatoriek en tellen: de explosie van mogelijkheden

### Het getal van Shannon, een ideaal openingsargument

[Claude Shannon](https://nl.wikipedia.org/wiki/Claude_Shannon), wiskundige en grondlegger van de informatietheorie, berekende in 1950 het aantal verschillende schaakpartijen. Zijn schatting: $10^{120}$. Hier is de telredenering die je kunt uitwerken voor de commissie.

Bij de eerste zet van wit: **20 mogelijke zetten** (16 pionzetten + 4 paardsprongen). Bij de eerste zet van zwart: **20 antwoorden**. Na één zet van elke kant: $20 \times 20 = 400$ stellingen. Deze berekening gebruikt het **vermenigvuldigingsprincipe**.

In het algemeen: als elke speler gemiddeld $b \approx 35$ legale zetten heeft bij elke beurt, en een partij gemiddeld $d \approx 80$ halve zetten duurt, is het aantal partijen ongeveer:

$$
N \approx b^d = 35^{80} \approx 10^{124}
$$

Dit is het **principe van de telboom**: bij elk knooppunt vermenigvuldigt het aantal takken zich met de vertakkingsfactor. Ter vergelijking: het aantal atomen in het waarneembare heelal wordt geschat op $10^{80}$. Het aantal schaakpartijen overtreft dat met **44 ordes van grootte**.

### Rangschikkingen en combinaties in openingen

Het eindexamenprogramma onderscheidt rangschikkingen (volgorde telt) van combinaties (volgorde telt niet). Schaakopeningen mobiliseren direct deze twee begrippen.

Het aantal **rangschikkingen** van 5 verschillende zetten uit 20 mogelijke zetten is $A(20,5) = 20 \times 19 \times 18 \times 17 \times 16 = 1\,860\,480$. Dit is het aantal verschillende openingsreeksen op de eerste 5 zetten van wit alleen.

Als de volgorde daarentegen niet uitmaakt, spreken we van **combinaties** $C(20,5) = 15\,504$.

## Kansrekening en stochastische variabelen

### De Elo-formule: een logistische wet uit het eindexamenprogramma

De [Elo-rating](https://nl.wikipedia.org/wiki/Elo-rating), bedacht door natuurkundige [Arpad Elo](https://nl.wikipedia.org/wiki/Arpad_Elo), berust op de **logistische functie**, die je in het eindexamenprogramma tegenkomt bij rijen en functies onder de naam sigmoïde functie.

De kans dat speler A wint van speler B is:

$$
\mathbb{P}(\text{A wint van B}) = \frac{1}{1 + 10^{(R_B - R_A)/400}}
$$

waarbij $R_A$ en $R_B$ de respectieve Elo-ratings zijn. Twee bijzondere gevallen die de commissie zal waarderen:

- Als $R_A = R_B$ (gelijke spelers): $P = \frac{1}{2}$ (**50 %**)
- Als $R_A - R_B = 400$: $P = \dfrac{1}{1+10^{-1}} \approx 0{,}91$ (**91 %**)
- Als $R_A - R_B = -200$: $P = \dfrac{1}{1+10^{1/2}} \approx 0{,}24$ (**24 %**)

### De binomiale verdeling toegepast op toernooien

Een wereldkampioenschapmatch schaken wordt gespeeld in **14 partijen** (huidig FIDE-format). Stel dat beide spelers even sterk zijn: $p = \mathbb{P}(\text{winst per partij}) = \tfrac{1}{2}$.

Het aantal overwinningen van een van de spelers op 14 partijen volgt een **binomiale verdeling** $\mathcal{B}(14,\tfrac{1}{2})$.

De kans om precies $k$ partijen te winnen is:

$$
\mathbb{P}(X = k) = \binom{14}{k} \left(\tfrac{1}{2}\right)^k \left(\tfrac{1}{2}\right)^{14-k} = \frac{\binom{14}{k}}{2^{14}}
$$

Enkele berekenbare waarden op eindexamenniveau:

- $\mathbb{P}(X = 7) = \binom{14}{7} / 2^{14} \approx$ **21 %** (perfect gelijkspel)
- $\mathbb{P}(X \geq 8) = \sum_{k=8}^{14} \binom{14}{k} / 2^{14} \approx$ **39,5 %**
- $\mathbb{P}(X = 10) = \binom{14}{10} / 2^{14} \approx$ **6,1 %**

De **verwachtingswaarde** van deze stochastische variabele is $\mathbb{E}(X) = np = 7$. De **standaardafwijking** is $\sigma = \sqrt{npq} = \sqrt{14 \times \tfrac{1}{4}} = \sqrt{3{,}5} \approx 1{,}87$.

### Verwachtingswaarde en standaardafwijking bij carrièrebeheer

De **verwachte Elo-uitkomst** van een partij wordt direct gegeven door de logistische formule. Als je speelt tegen een tegenstander met 200 punten minder dan jij, is je verwachte resultaat $\mathbb{E} = 1 \times 0{,}76 + \tfrac{1}{2} \times 0 + 0 \times 0{,}24 = 0{,}76$ punten.

De **variantie** van de resultaten is $\mathrm{Var}(X) = \mathbb{E}(X^2) - (\mathbb{E}(X))^2 = 0{,}76 - 0{,}76^2 \approx 0{,}182$. De standaardafwijking $\sigma \approx 0{,}43$ meet de "volatiliteit" van een ontmoeting tussen deze twee spelers.

## Recurrente rijen: Elo als dynamisch model

Dit is het minst benutte hoofdstuk van het eindexamenprogramma over schaken, en juist daar kun je het verschil maken.

### De Elo-bijwerking als recurrente rij

De Elo-rating van een speler na $n$ partijen is een **recurrente rij**:

$$
u_{n+1} = u_n + K\,(r_n - p_n)
$$

waarbij:
- $u_n$ de rating is na $n$ partijen
- $K$ de **correctiecoëfficiënt** is ($K = 32$ voor beginners, $K = 16$ voor gevestigde spelers)
- $r_n$ het **werkelijke resultaat** is van de $(n+1)$-de partij: $1$ (winst), $\tfrac{1}{2}$ (remise), $0$ (verlies)
- $p_n$ de **voorspelde winstkans** is volgens de logistische formule vóór de partij

### Convergentie en limiet

Een elegant wiskundig resultaat: als een speler een oneindig aantal partijen speelt tegen representatieve tegenstanders, **convergeert** zijn Elo-rating naar zijn werkelijke kracht.

Om de convergentie te bewijzen kun je als volgt redeneren: als $u_n$ te hoog is (overschatte speler), zullen zijn resultaten $r_n$ gemiddeld lager zijn dan $p_n$, dus $u_{n+1} < u_n$ (de rij daalt). Als $u_n$ te laag is (onderschatte speler), $r_n > p_n$ gemiddeld, dus $u_{n+1} > u_n$ (de rij stijgt). De rij is dus **contractief** rond de werkelijke kracht, wat convergentie impliceert.

### De asymptoot: hoeveel partijen zijn nodig voor een betrouwbare rating?

De praktische vraag "hoeveel partijen moet je spelen om je rating betrouwbaar te maken?" is een vraag over de **convergentiesnelheid**. Ze hangt af van K: met K = 32 fluctueert de rating sneller en convergeert sneller, maar met meer variantie; met K = 10 is de convergentie trager maar stabieler.

## Algoritmiek: recursie geïllustreerd door minimax

### Het minimax-algoritme als schoolvoorbeeld

Het hoofdstuk algoritmiek behandelt **recursie**: een functie die zichzelf aanroept. Minimax is het krachtigste voorbeeld van recursie dat een leerling intuïtief kan begrijpen.

Hier is de logische structuur van het algoritme, die je zonder code kunt presenteren:

> **minimax(stelling, diepte, speler)**:
> - Als diepte = 0 of partij beëindigd: geef evaluatie(stelling) terug
> - Als het de beurt is van speler MAX: geef het maximum terug over alle zetten van minimax(nieuwe_stelling, diepte−1, MIN)
> - Als het de beurt is van speler MIN: geef het minimum terug over alle zetten van minimax(nieuwe_stelling, diepte−1, MAX)

De **recursiediepte** is de sleutelparameter: bij diepte $d$ verkent het algoritme $b^d$ knooppunten (waarbij $b \approx 35$). Voor $d = 4$: $35^4 = 1\,500\,625$ knooppunten. Voor $d = 8$: $35^8 \approx 2{,}25 \times 10^{12}$ knooppunten. De **tijdcomplexiteit** is $O(b^d)$ (exponentiële groei).

### Algoritmische complexiteit: waarom schaken niet is opgelost

De complexiteit in $O(b^d)$ is exponentieel. Om schaken "op te lossen" (de perfecte zet vinden vanaf elke stelling), zou je de hele boom tot de bladeren moeten verkennen, ongeveer $10^{120}$ knooppunten. Zelfs een computer die $10^{18}$ stellingen per seconde kan evalueren, zou ongeveer $10^{102}$ seconden nodig hebben, ofwel **$10^{94}$ keer de leeftijd van het heelal**.

De **alfa-bèta-snoeiing** reduceert de effectieve complexiteit tot $O(b^{d/2})$ in het optimale geval.

## Je probleemstelling opbouwen: stap voor stap

### Stap 1: Het centrale hoofdstuk identificeren

Kies een hoofdstuk uit de **stof** dat je goed beheerst: combinatoriek, kansrekening, rijen, functies, algebra.

### Stap 2: De spanning vinden

Een goede probleemstelling bevat een **spanning**: "in hoeverre", "in welke mate", "waarom kan (of kan niet)". Vermijd het beschrijvende "wat is".

## Drie kant-en-klare probleemstellingen

### Probleemstelling 1: combinatoriek

*"In hoeverre vormt schaken een model van combinatorisch denken, en waarom overstijgt de complexiteit van dit spel de rekencapaciteit van elke machine?"*

**Voorgesteld plan:**
1. Berekening van het aantal partijen via de telboom (vermenigvuldigingsprincipe, $10^{120}$)
2. Rangschikkingen en combinaties in openingen ($A(n,k)$ en $C(n,k)$)
3. Algoritmische complexiteit: exponentiële groei $b^d$ en de onmogelijkheid van oplossing door brute kracht
4. **Conclusie**: discrete wiskunde stelt een formele grens aan wat berekening kan bereiken

### Probleemstelling 2: kansrekening

*"In hoeverre maken kansrekening en de binomiale verdeling het mogelijk om schaakprestaties te modelleren en de uitkomst van een match te voorspellen?"*

**Voorgesteld plan:**
1. De binomiale verdeling $\mathcal{B}(n,p)$ toegepast op een match van 14 partijen
2. De logistische Elo-formule: winstkans als functie van het ratingverschil
3. Verwachtingswaarde en standaardafwijking: interpretatie en cijferwaarden
4. **Conclusie**: kansrekening vermindert onzekerheid zonder haar weg te nemen

### Probleemstelling 3: rijen en analyse

*"Hoe modelleert de recurrente Elo-rij de vooruitgang van een speler, en in hoeverre illustreert de convergentie ervan het wiskundige begrip limiet?"*

**Voorgesteld plan:**
1. De rij $u_{n+1} = u_n + K(r_n - p_n)$: definitie en interpretatie
2. Studie van monotonie en convergentie
3. Convergentiesnelheid en parameter K: de bias-variantieafweging
4. **Conclusie**: een probabilistisch zelfcorrigerend systeem, microkosmos van bayesiaanse statistiek

## Anticiperen op vragen van de commissie

**1. "Kunt u P(A wint van B) berekenen voor R_A = 1800, R_B = 2200?"**
$\mathbb{P} = \dfrac{1}{1+10^{(2200-1800)/400}} = \dfrac{1}{11} \approx 9\,\%$. Directe berekening.

**2. "Veronderstelt de binomiale verdeling onafhankelijkheid van de partijen?"**
Ja, en dat is een beperking van het model: in de praktijk creëren moraal, vermoeidheid en voorbereiding correlaties tussen partijen.

**3. "Wat garandeert de convergentie van de Elo-rij?"**
Het feit dat de correctie $K(r_n - p_n)$ gemiddeld tegengesteld is aan het teken van de fout $(u_n - E)$, als de resultaten de voorspellingen volgen.

**4. "Waarom zegt men dat minimax in $O(b^d)$ is?"**
Bij elk niveau wordt het aantal knooppunten vermenigvuldigd met $b$. Na $d$ niveaus: $b^d$ knooppunten.

**Na het lezen:** film jezelf terwijl je **één** complete Elo-berekening op het bord uitvoert (fictieve gegevens) in minder dan vier minuten; glij weg als je vastloopt, niet als je een fout maakt.

## Bronnen en referenties

- **Shannon, C. E. (1950).** *Programming a Computer for Playing Chess.* *Philosophical Magazine*, 41(314).
- **Zermelo, E. (1913).** *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels.* Congres van wiskundigen.
- **Elo, A. E. (1978).** *The Rating of Chessplayers, Past and Present.* Arco Publishing.
- **Knuth, D. & Moore, R. (1975).** *An Analysis of Alpha-Beta Pruning.* *Artificial Intelligence*, 6(4).
- **Sala, G. & Gobet, F. (2016).** *Do the benefits of chess instruction transfer to academic and cognitive skills?* *Educational Research Review.*
- **von Neumann, J. & Morgenstern, O. (1944).** *Theory of Games and Economic Behavior.* Princeton University Press.
- **Silver, D., et al. (2018).** *A general reinforcement learning algorithm that masters chess, shogi, and Go.* *Science*, 362(6419).
- **Lichess Open Database.** [lichess.org/database](https://database.lichess.org).
- **FIDE - Handbook (2024).** [fide.com/regulations](https://www.fide.com/regulations).
