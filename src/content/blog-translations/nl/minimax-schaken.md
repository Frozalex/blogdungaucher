---
title: "Minimax bij schaken: het algoritme dat voor je denkt"
excerpt: >-
  Minimax is het fundamentele algoritme van het strategisch denken bij schaken. Van moderne engines
  tot je eigen denken aan het bord: zo structureert dit wiskundig instrument elke beslissing.
seoTitle: "Minimax bij schaken: alfa-bèta, negamax en de berekening van engines"
seoDescription: "Minimax, alfa-bèta-snoei, negamax, null-move pruning, MCTS: hoe engines de optimale zet berekenen bij schaken en wat je brein doet zonder het te weten."
frSlug: minimax-aux-echecs
draft: false
faq:
  - question: "Produceert minimax altijd de beste zet?"
    answer: >-
      Ja, <strong>als de zoekactie tot eindstellingen reikt</strong> (mat of pat). Bij eindige diepte
      met een heuristische evaluatiefunctie produceert minimax de optimale zet <em>volgens de gebruikte
      evaluatie en diepte</em>. Dat is waarom een engine met 3500 Elo een mens verslaat: zijn
      evaluatiefunctie + diepte liggen dichter bij de waarheid dan die van een mens, niet omdat hij
      "perfect" berekent.
  - question: "Waarom spreekt men van 'negamax' in plaats van 'minimax' in de code?"
    answer: >-
      Omdat in een nulsomspel $\min(a,b) = -\max(-a,-b)$. Negamax benut deze symmetrie om
      <strong>één enkele recursieve functie</strong> te gebruiken in plaats van twee. Het is puur een
      codervereenvoudiging, zonder algoritmische wijziging. Nagenoeg alle moderne engines (Stockfish,
      Komodo, Leela Chess Zero) gebruiken negamax + alfa-bèta.
  - question: "Verandert alfa-bèta-snoei het resultaat van minimax?"
    answer: >-
      Nee, <strong>nooit</strong>. Dat is de fundamentele eigenschap: alfa-bèta produceert precies
      dezelfde zet als zuivere minimax, maar met veel minder verkende knopen. De snoeikracht hangt
      af van de <strong>zettenorde</strong>: als je de beste zet als eerste test, snoei je massief; als
      je de slechtste als eerste test, snoei je nauwelijks. Daarom investeren engines zoveel in
      zettenordening (killer moves, geschiedenis van goede zetten).
  - question: "Waarom verlaat AlphaZero minimax?"
    answer: >-
      Niet echt: het behoudt een boomgebaseerde zoekopdracht (MCTS), maar vervangt de uitputtende
      verkenning van alfa-bèta door een <strong>probabilistische verkenning, gestuurd</strong> door
      een neuraal netwerk. Het voordeel: in stellingen waar de klassieke evaluatiefunctie het moeilijk
      heeft (langetermijnoffers, subtiel positioneel spel) geeft het neurale netwerk een nauwkeuriger
      schatting. Het nadeel: dat netwerk moet worden getraind op miljoenen partijen, wat aanzienlijke
      hardwareresources vereist.
  - question: "Voert mijn brein werkelijk minimax uit bij het berekenen?"
    answer: >-
      Bij benadering wel. Je voert een boomgebaseerde zoekactie uit met een zeer lage vertakkingsfactor
      (3-5 kandidaatzetten in plaats van 35), een zeer beperkte diepte (3-8 halfzetten) en een
      intuïtieve evaluatiefunctie (positioneel gevoel). Je gebruikt ook zeer krachtige snoei-heuristieken:
      je <strong>verwerpt</strong> de meeste zetten op het eerste gezicht zonder ze te berekenen. Het
      verschil met een engine is niet kwalitatief, maar kwantitatief.
---

Er is iets merkwaardigs aan het feit dat de strategie bij schaken, dit millenniumspel van intuïtie en kunst, herleidbaar is tot een algoritme van enkele regels. Het minimax-algoritme doet precies dat: het formaliseert de kern van strategisch redeneren in een nulsomspel tot een elegante wiskundige recursie. En het is niet alleen de ziel van moderne schaakengines: het is ook de formele beschrijving van wat je in je hoofd doet wanneer je varianten berekent.

## De intuïtie achter minimax

Stel je voor dat je met Wit speelt en de best mogelijke zet wilt kiezen. Hoe definieer je die? De beste zet is die welke, ervan uitgaande dat je tegenstander ook perfect speelt, je het beste eindresultaat geeft.

Deze recursieve definitie is de essentie van minimax. Wit wil het resultaat maximaliseren (vanuit Wits standpunt). Zwart wil het resultaat minimaliseren (vanuit Wits standpunt, of symmetrisch maximaliseren vanuit zijn eigen standpunt). Beide spelers wisselen af, en op elk niveau van de boom speelt de een of de ander.

De wiskundige formalisering is rechtstreeks:

$$\text{minimax}(p, d) = \begin{cases} \text{evaluatie}(p) & \text{als } d = 0 \text{ of terminaal} \\ \max_{z \in Z(p)} \text{minimax}(\text{volg}(p,z), d-1) & \text{beurt van Wit} \\ \min_{z \in Z(p)} \text{minimax}(\text{volg}(p,z), d-1) & \text{beurt van Zwart} \end{cases}$$

Waarbij $p$ de huidige stelling is, $d$ de resterende zoekdiepte, $Z(p)$ de verzameling legale zetten in $p$, en $\text{volg}(p,z)$ de stelling die resulteert uit zet $z$ in $p$.

## De evaluatiefunctie: het hart van de engine

Zuivere minimax zou schaken perfect oplossen als je de volledige boom tot eindstellingen kon verkennen. In de praktijk is dat onmogelijk vanwege de combinatorische complexiteit ($10^{120}$ bladeren volgens [Claude Shannon](https://nl.wikipedia.org/wiki/Claude_Shannon)). De zoekactie moet worden gestopt op een eindige diepte en niet-eindstellingen moeten worden geëvalueerd met een **heuristische evaluatiefunctie**.

Moderne engines zoals [Stockfish](https://nl.wikipedia.org/wiki/Stockfish_(schaakprogramma)) gebruiken uiterst geavanceerde evaluatiefuncties die integreren:

**De materiaalwaarde** met contextafhankelijke waardetabellen die variëren per fase van het spel. Een paard is meer waard in een gesloten middenspel dan in een open eindspel.

**De stukkenbeweeglijkheid**: het aantal beschikbare legale zetten voor elk stuk. Een stuk met meer beweeglijkheid is in het algemeen sterker.

**De koningsveiligheid**: de soliditeit van de pionnenstructuur rondom de koning, de open lijnen naar hem, de dreigende tegenstukken.

**De pionnenstructuur**: dubbele pionnen (verzwakt), geïsoleerde pionnen (zonder steun), achtergebleven pionnen (kunnen niet meer vooruit), gedekte vrijpionnen (zonder tegenpionnen op hun weg naar promotie).

**De centrumcontrole**: bezetting en controle van de centrale velden e4, d4, e5, d5 en hun omgeving.

Deze elementen worden gewogen en gecombineerd in een formule die de "werkelijke" waarde van de stelling tracht te benaderen.

## Alfa-bèta-snoei: de intelligentie van het opgeven

Het brute minimax-algoritme is spectaculair inefficiënt. Voor een zoekdiepte van $d$ zetten en een vertakkingsfactor van $b$ (gemiddeld aantal legale zetten) moeten $b^d$ stellingen worden geëvalueerd. Bij $b = 35$ en $d = 10$ is dat $35^{10} \approx 2{,}8 \times 10^{15}$ stellingen. In de praktijk onmogelijk.

[Alfa-bèta-snoei](https://nl.wikipedia.org/wiki/Alfa-bèta-algoritme), onafhankelijk ontwikkeld door meerdere onderzoekers in de jaren vijftig en zestig en geformaliseerd door [John McCarthy](https://nl.wikipedia.org/wiki/John_McCarthy_(informaticus)), lost dit op door takken te snoeien die de eindbeslissing niet kunnen beïnvloeden.

Het principe: als je al een optie voor Wit hebt gevonden die een resultaat van waarde $\alpha$ garandeert, en je een tak verkent waar Zwart een resultaat onder $\alpha$ voor Wit kan forceren, kan deze tak worden verlaten. Wit kiest hem nooit, want hij heeft al beter.

Formeel worden twee grenzen bijgehouden:
- $\alpha$: de beste waarde al gegarandeerd voor de maximaliserende speler (Wit)
- $\beta$: de beste waarde al gegarandeerd voor de minimaliserende speler (Zwart)

Wanneer $\alpha \geq \beta$, wordt de huidige tak gesnoeid: hij kan geen beter resultaat produceren dan wat al bekend is.

In het optimale geval (als zetten gerangschikt zijn op aflopende kwaliteit) reduceert alfa-bèta het aantal knopen van $b^d$ naar $b^{d/2}$, wat de mogelijke zoekdiepte bij eenzelfde rekenbudget effectief verdubbelt.

### Negamax: de vereenvoudiging die de code verandert

In de praktijk implementeert nagenoeg geen enkele engine minimax in zijn tweevormige vorm (max voor Wit, min voor Zwart). Alle gebruiken de **negamax**-formulering, die de identiteit $\min(a,b) = -\max(-a,-b)$ in een nulsomspel benut. De code gaat van twee afzonderlijke functies naar één, met een tekenomkering bij elke recursieve aanroep. Conceptueel identiek, maar veel korter (15 regels code versus 40) en gemakkelijker te onderhouden. Wanneer een ontwikkelaar zegt "ik implementeer minimax", bedoelt hij bijna altijd "ik implementeer negamax met alfa-bèta".

### Null-move pruning: je beurt doorgeven om tijd te winnen

Een krachtige heuristiek: wat als je **je beurt doorgeeft**? Als de stelling goed voor je blijft ondanks deze gratis zet gegeven aan de tegenstander, is ze waarschijnlijk *erg* goed voor je, en kun je de rest van de analyse diep snoeien. Dat is de **null-move pruning**, een standaardtechniek sinds de jaren negentig. In schaken heeft de truc een bekende beperking (de zoegtswang: een situatie waarbij elke zet de positie verslechtert, typisch in pionnenendspelen), dus schakelen engines de heuristiek uit in eindspelen of in stellingen die als potentieel zoegtswang zijn geïdentificeerd. Typische winst: nog een factor 2 tot 4 op de effectieve snelheid.

## Geavanceerde technieken in moderne engines

**Transpositietabellen**: een cache van al geanalyseerde stellingen. Als dezelfde stelling via verschillende zettenorders wordt bereikt (transpositie), hergebruikt de engine de vorige analyse in plaats van hem opnieuw te berekenen. Transpositietabellen kunnen de rekentijd met grootteordes reduceren.

**Iteratieve verdieping**: in plaats van rechtstreeks een zoekactie op diepte $d$ uit te voeren, ketent de engine opeenvolgende zoekacties op diepte 1, 2, 3, ..., $d$ aaneen. Elke iteratie levert een betere zettenordening op voor de volgende iteratie, wat de snoeïefficiëntie verbetert.

**Rustigezoekactie**: op de maximale diepte, in plaats van statisch te evalueren, wordt de zoekactie voortgezet tot een "rustige" (stabiele) stelling, waarbij enkel slagen en promoties worden verkend. Dit voorkomt dat stellingen worden geëvalueerd waarbij een onopgelost stukkenruil de evaluatie zou vertekenen.

**Zoekuitbreidingen**: in bepaalde stellingen (mat in zicht, gevorderde vrijpion, kritieke stelling) wordt de zoekdiepte automatisch uitgebreid boven het nominale limiet om het horizoneffect te vermijden.

**Zoekreduccties (LMR)**: omgekeerd wordt voor weinig veelbelovende zetten (late move reduction) de diepte gereduceerd om tijd te besparen. Als deze zetten beter blijken dan verwacht, wordt de diepte hersteld.

## De geschiedenis van minimax-engines: van Claude Shannon tot Stockfish

De geschiedenis van schaakengines is de geschiedenis van opeenvolgende verbeteringen van minimax.

In 1950 legde [Claude Shannon](https://nl.wikipedia.org/wiki/Claude_Shannon) de theoretische grondslagen in zijn artikel "Programming a Computer for Playing Chess", waarbij hij de twee benaderingen identificeerde (brute kracht versus heuristische selectie) en de fundamentele uitdagingen.

In 1957 creëerde Alex Bernstein het eerste werkende schaakprogramma op de IBM 704, met een vereenvoudigde versie van minimax met een rudimentaire evaluatie.

De jaren zeventig en tachtig zagen de opkomst van dedicated schaakchips. Belle van Ken Thompson en Joe Condon was het eerste programma dat het meesters-niveau bereikte. Deep Thought van Hsu en Campbell bereikte het grootmeestersniveau.

Het hoogtepunt van het klassieke minimax was [Deep Blue](https://nl.wikipedia.org/wiki/Deep_Blue_(schaakcomputer)), dat [Kasparov](https://nl.wikipedia.org/wiki/Garri_Kasparov) in 1997 versloeg. Deep Blue evalueerde 200 miljoen stellingen per seconde met een evaluatiefunctie ontwikkeld in samenwerking met grootmeesters.

[Stockfish](https://nl.wikipedia.org/wiki/Stockfish_(schaakprogramma)), in ontwikkeling sinds 2008, vertegenwoordigt het eindpunt van de klassieke minimax-benadering met handmatige evaluatie. Sinds 2020 integreert het [NNUE](https://nl.wikipedia.org/wiki/NNUE) (Efficiently Updatable Neural Network), een neuraal netwerk ingebed in de evaluatiefunctie.

## AlphaZero en het overstijgen van minimax

In 2017 publiceerde [DeepMind](https://nl.wikipedia.org/wiki/DeepMind) de resultaten van [AlphaZero](https://nl.wikipedia.org/wiki/AlphaZero), een programma dat schaken leerde door zelfspel in enkele uren en Stockfish overtuigend versloeg.

AlphaZero gebruikt geen klassieke minimax maar een [Monte Carlo Tree Search](https://nl.wikipedia.org/wiki/Monte-Carloboomzoeken) (MCTS) gestuurd door een diep neuraal netwerk. In plaats van de boom uitputtend met snoei te verkennen, verkent MCTS stochastisch de meest veelbelovende takken volgens een aangeleerde strategie.

Wat de schaakgemeenschap trof was niet alleen de prestatie van AlphaZero, maar zijn speelstijl. AlphaZero speelt stoutmoedig en creatief, met langetermijn-materiaaloffers en een voorkeur voor stukkenactiviteit boven onmiddellijke materiaalvoordelen. Deze stijl doet meer denken aan een intuïtieve menselijke speler dan aan een bruteforce-engine.

AlphaZero toonde aan dat minimax niet de enige weg is naar schaakbeheersing. Versterkend leren kan een ander en soms dieper begrip van het spel produceren.

## Minimax in je hoofd

Het fascinantste aspect van minimax voor de praktische speler is dat het beschrijft wat je al doet wanneer je varianten berekent. Wanneer je denkt "als ik daar speel, kan hij dit of dat antwoorden. Als hij dit antwoordt, speel ik dit en hij is gedwongen...", voer je mentaal een afgekapt minimax-algoritme uit.

Je menselijke beperkingen bepalen de "diepte" van je zoekactie. Een speler van 1200 verkent misschien 2-3 niveaus betrouwbaar. Een grootmeester verkent 7-10 niveaus in strategische stellingen en meer in geforceerde tactische stellingen.

Het verschil tussen een gemiddelde speler en een grootmeester is niet alleen de diepte: het is ook de kwaliteit van de interne evaluatiefunctie (positionele intuïtie) en de efficiëntie van de snoei (het vermogen om snel relevante zetten te identificeren en slechte zetten te negeren zonder ze te berekenen).

Het trainen van deze twee aspecten staat centraal in de ontwikkeling van een speler: het positionele gevoel verrijken om de evaluatie te verbeteren, en het instinct voor "kandidaatzetten" aanscherpen om de snoei te verbeteren. Minimax is de formele beschrijving van dit proces.

**Na het lezen:** stel bij een tactisch probleem een **vaste diepte** in (bijv. drie halfzetten) voordat je de oplossing bekijkt: je kalibreert je interne minimax.

---

## Veelgestelde vragen

### Produceert minimax altijd de beste zet?

Ja, **als de zoekactie tot eindstellingen reikt** (mat of pat). Bij eindige diepte met heuristische evaluatiefunctie produceert minimax de optimale zet *volgens de gebruikte evaluatie en diepte*. Dat is waarom een engine met 3500 Elo een mens verslaat: zijn evaluatiefunctie + diepte liggen dichter bij de waarheid dan die van een mens, niet omdat hij "perfect" berekent.

### Waarom spreekt men van "negamax" in plaats van "minimax" in de code?

Omdat in een nulsomspel $\min(a,b) = -\max(-a,-b)$. Negamax benut deze symmetrie om **één enkele recursieve functie** te gebruiken in plaats van twee. Het is puur een codevereenvoudiging, zonder algoritmische wijziging. Nagenoeg alle moderne engines (Stockfish, Komodo, Leela Chess Zero) gebruiken negamax + alfa-bèta.

### Verandert alfa-bèta-snoei het resultaat van minimax?

Nee, **nooit**. Dat is de fundamentele eigenschap: alfa-bèta produceert precies dezelfde zet als zuivere minimax, maar met veel minder verkende knopen. De snoeikracht hangt af van de **zettenorde**: als je de beste zet als eerste test, snoei je massief; als je de slechtste als eerste test, snoei je nauwelijks. Daarom investeren engines zoveel in zettenordening (killer moves, geschiedenis van goede zetten).

### Waarom verlaat AlphaZero minimax?

Niet echt: het behoudt een boomgebaseerde zoekopdracht (MCTS), maar vervangt de uitputtende verkenning van alfa-bèta door een **probabilistische verkenning, gestuurd** door een neuraal netwerk. Het voordeel: in stellingen waar de klassieke evaluatiefunctie het moeilijk heeft (langetermijnoffers, subtiel positioneel spel) geeft het neurale netwerk een nauwkeuriger schatting. Het nadeel: dat netwerk moet worden getraind op miljoenen partijen, wat aanzienlijke hardwareresources vereist.

### Voert mijn brein werkelijk minimax uit bij het berekenen?

Bij benadering wel. Je voert een boomgebaseerde zoekactie uit met een zeer lage vertakkingsfactor (3-5 kandidaatzetten in plaats van 35), een zeer beperkte diepte (3-8 halfzetten) en een intuïtieve evaluatiefunctie (positioneel gevoel). Je gebruikt ook zeer krachtige snoei-heuristieken: je **verwerpt** de meeste zetten op het eerste gezicht zonder ze te berekenen. Het verschil met een engine is niet kwalitatief, maar kwantitatief.

---

## Kernpunten

- Minimax is het algoritme dat de spelboom verkent door afwisselend te maximaliseren (Wit) en te minimaliseren (Zwart)
- **Negamax** is de moderne, kortere formulering, wiskundig equivalent
- **Alfa-bèta-snoei** reduceert het aantal te verkennen knopen dramatisch zonder het resultaat te wijzigen
- Moderne engines voegen heuristische evaluatiefuncties, **transpositietabellen**, null-move pruning, iteratieve verdieping en rustzoekacties toe
- AlphaZero toonde aan dat een **MCTS + neuraal netwerk**-benadering pure minimax kan overtreffen bij complexe spellen
- Je brein voert mentaal een vereenvoudigde versie van minimax uit (lage vertakking + sterke intuïtieve snoei)

### Bronnen en referenties

- **Shannon, C. E.** *Programming a Computer for Playing Chess.* Philosophical Magazine, Series 7, 41(314), 256-275, 1950. (Het grondleggende artikel over schaakengines en de toepassing van minimax.)
- **Silver, D., et al.** [*Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm.*](https://arxiv.org/abs/1712.01815) arXiv, 2017. (De originele publicatie van AlphaZero.)
- **Knuth, D. E., & Moore, R. W.** *An Analysis of Alpha-Beta Pruning.* Artificial Intelligence, 6(4), 293-326, 1975. (De formele analyse van het alfa-bèta-algoritme.)
- **Campbell, M., Hoane, A. J., & Hsu, F.** [*Deep Blue.*](https://www.sciencedirect.com/science/article/pii/S0004370201001291) Artificial Intelligence, 134(1-2), 57-83, 2002. (De beschrijving van het Deep Blue-systeem dat Kasparov versloeg.)
- **Iyengar, S.** *Chess Programming: From Minimax to Neural Networks.* ACM Computing Surveys, 2019. (Een overzicht van algoritmische benaderingen in schaakcomputing.)
