---
title: "AlphaZero tegen Stockfish: de revolutie van kunstmatige intelligentie in het schaken"
excerpt: >-
  In december 2017 publiceerde DeepMind de resultaten van een match die de manier waarop we denken over zowel
  kunstmatige intelligentie als schaken heeft veranderd. AlphaZero, getraind zonder menselijke data, versloeg
  Stockfish met een speelstijl die niemand had voorzien.
seoTitle: "AlphaZero tegen Stockfish: de AI-revolutie in het schaken"
seoDescription: >-
  AlphaZero vs Stockfish 2017: versterkend leren, neuraal netwerk, revolutionaire speelstijl. Hoe AI het begrip van
  schaken veranderde.
frSlug: echecs-alphazero-stockfish
draft: false
faq:
  - question: "Is AlphaZero nog steeds het beste schaakprogramma?"
    answer: >-
      De vraag is complex. DeepMind heeft nooit een publieke versie van AlphaZero uitgebracht. Stockfish is sinds
      2017 enorm verbeterd, met neurale netwerken geïntegreerd in de evaluatie (NNUE, Efficiently Updatable Neural
      Network). De huidige versie van Stockfish (Stockfish 16/17) is waarschijnlijk sterker dan AlphaZero zoals het
      in 2017 was. Leela Chess Zero (Lc0), het open-source-equivalent van AlphaZero, wordt nog steeds ontwikkeld en
      vertegenwoordigt de deep learning-aanpak. De grens tussen de twee benaderingen is vervaagd.
  - question: "Waarom worden de omstandigheden van de AlphaZero-Stockfish-match betwist?"
    answer: >-
      Vooral omdat Stockfish draaide zonder de Syzygy-eindspeltabellen (een bibliotheek van perfect berekende
      eindspelen die Stockfish normaal gesproken gebruikt), en omdat de hardwareconfiguratie van AlphaZero (Google
      TPU's, gespecialiseerde hardware) niet direct vergelijkbaar was met die van Stockfish (standaard-CPU).
      Resultaten die later werden gepubliceerd in Science (december 2018), met evenwichtiger omstandigheden,
      bevestigden niettemin de superioriteit van AlphaZero, maar met een minder overweldigend voordeel.
  - question: "Wat is het NNUE-systeem dat Stockfish revolutioneerde?"
    answer: >-
      NNUE (Efficiently Updatable Neural Network) is een architectuur van neurale netwerken ontworpen om zeer snel
      te werken op standaard-CPU's. Sinds 2020 geïntegreerd in Stockfish, vervangt het de oude heuristische
      evaluatiefunctie door een neuraal netwerk getraind op miljoenen posities die door Stockfish zelf zijn
      geëvalueerd. Resultaat: Stockfish NNUE combineert de zoeksnelheid van alpha-bèta met de rijkdom van evaluatie
      van neurale netwerken: een hybride die het niveau met ongeveer 80-100 Elo-punten verhoogde.
  - question: "Heeft AlphaZero echt 'verloren gegane' schaakconcepten herontdekt?"
    answer: >-
      Preciezer gezegd: het speelde ideeën die theoretisch bekend waren maar 'te riskant' of 'onvoldoende solide'
      werden geacht volgens de normen van klassieke engines. Pionoffers die vele zetten lang werden aangehouden voor
      dynamische compensatie, asymmetrische pionstructuren die Stockfish negatief zou evalueren maar die tactisch
      'vergif' bevatten. Grootmeesters als Kasparov en Seirawan hebben opgemerkt dat de stijl van AlphaZero soms leek
      op die van romantische spelers uit de negentiende eeuw: het maximaliseren van actieve stukken in plaats van de
      materiaaltelling.
  - question: "Is Leela Chess Zero (Lc0) toegankelijk voor het publiek?"
    answer: >-
      Ja, volledig. Lc0 is een opensourceproject dat de architectuur van AlphaZero implementeert met behulp van
      netwerkgewichten die door de gemeenschap zijn getraind. Het is gratis te downloaden en integreert met
      analyse-interfaces zoals Arena of Chessbase. Op een goede GPU speelt het op een niveau vergelijkbaar met de
      beste Stockfish-versies. Het is de manier voor gewone spelers om toegang te krijgen tot een
      "AlphaZero-achtige" analysestijl, die leerzamer kan zijn dan Stockfish om posities met intuïtieve compensatie
      te begrijpen.
---

December 2017. Het team van DeepMind publiceert een onderzoekspaper en, als bijlage, 10 becommentarieerde partijen. Deze 10 partijen hebben de schaakgemeenschap geëlektriseerd op een manier die sinds de Fischer-Spassky-match van 1972 niet meer was voorgekomen.

Het was niet gewoon dat het ene programma het andere versloeg. Het was de manier waarop het dat deed.

## De architectuur van AlphaZero

Om te begrijpen waarom AlphaZero een breuk vertegenwoordigt, moet je begrijpen wat het doet, en wat het niet doet.

AlphaZero is een systeem van **deep reinforcement learning** (diep versterkend leren). Het combineert twee technologieën:

**Een diep neuraal netwerk** dat als invoer de schaakpositie neemt en twee uitvoeren produceert: een kansverdeling over alle legale zetten (de "policy head": welke zetten veelbelovend lijken), en een evaluatie van de positie (-1 tot +1, overeenkomend met een zwartwinst, remise, of een witwinst: de "value head").

**De Monte Carlo-boomzoekmethode (MCTS)** die het neurale netwerk gebruikt om de zoektocht te sturen. In plaats van de spelboom uitputtend te verkennen met alpha-bèta-snoei, simuleert MCTS partijen tot het einde door zetten te kiezen volgens de kansen van de policy head en de resultaten terug te propageren naar de wortel.

Wat opmerkelijk is: AlphaZero had alleen **de regels van het spel** ontvangen. Geen enkele menselijke partij. Geen enkele positionele heuristiek. Geen eindspeldatabase. Geen kennis over wat een "goede" positie is: alleen de regel dat mat winst betekent.

Het speelde 44 miljoen partijen tegen zichzelf in 9 uur (op Google TPU's, gespecialiseerde hardware), waarbij het na elke partij zijn netwerkgewichten aanpaste. Aan het eind had het een begrip van het spel ontwikkeld op een manier die niemand had geprogrammeerd.

## De match: 28-0-72

In de match van december 2017 speelde AlphaZero 100 partijen tegen Stockfish 8 (de beste versie destijds) op klassieke bedenktijd. Resultaat: 28 overwinningen voor AlphaZero, 72 remises, 0 nederlagen.

Deze score is verbluffend om meerdere redenen. Een programma dat Stockfish verslaat *zonder ooit te verliezen* is buitengewoon, Stockfish 8 was zelf al ver superieur aan elke mens. En de overwinningen waren geen technische overwinningen in gecompliceerde eindspelen: ze werden opgebouwd rond duidelijke positionele thema's.

Er bestaan legitieme kritieken op de omstandigheden van de match:
- Stockfish draaide zonder zijn Syzygy-eindspeltabellen
- De hardware van AlphaZero (TPU's) is niet direct vergelijkbaar met de CPU's van Stockfish
- Stockfish was niet opnieuw geoptimaliseerd voor de beschikbare hardware

Deze kritieken hebben DeepMind ertoe gebracht om in december 2018 een herziene versie te publiceren in het tijdschrift *Science*, met evenwichtiger omstandigheden. Het resultaat bevestigde de superioriteit van AlphaZero, maar met een minder overweldigend voordeel: ongeveer 64% overwinningen in open posities, een globaal gunstige score maar niet 28-0.

## De speelstijl: wat de Grootmeesters fascineerde

De score maakte indruk. De stijl verbijsterde.

De Grootmeesters die de 10 gepubliceerde partijen becommentarieerden (Kasparov, Nakamura, Seirawan) gebruikten ongebruikelijke termen in de context van engine-analyse: "creatief", "menselijk", "romantisch", "levend".

**De positionele offers**. AlphaZero was opmerkelijk bereid om materiaal te offeren (meestal een pion, soms meer) voor dynamische compensatie. Stockfish, met zijn precieze materiële evaluatie, zou deze offers vaak hebben geweigerd of als negatief hebben geëvalueerd. AlphaZero speelde ze en hield de compensatie vele zetten lang vast, tot het materiaal zich omzette in een positioneel voordeel.

**Het vertrouwen in "biologisch winnende" posities**. Posities waar de numerieke evaluatie van Stockfish ~+0.2 was (licht gunstig voor Wit, bijna gelijk) maar waar AlphaZero continue druk hield, waardoor Zwart gedwongen werd oncomfortabele posities zet na zet te verdedigen, tot de fout kwam.

**De "actieve koning"-stijl in eindspelen**. AlphaZero gebruikte zijn koning offensiever en eerder dan klassieke engines: een praktijk bekend in eindspelen (de koning is een sterk stuk in eindspelen) maar vaak uitgesteld door engines die de veilige koning als absolute prioriteit evalueren.

Garry Kasparov, die de partijen analyseerde, zei dat hij deze stijl "herkende": niet als die van een programma, maar als die van een briljante menselijke speler met een diep positioneel begrip. "Zo speelde ik graag toen ik op mijn hoogtepunt was."

## Wat AlphaZero (her)ontdekte in de openingstheorie

De duurzaamste impact van AlphaZero op de schaakpraktijk is niet de match zelf: het is de invloed op de openingstheorie.

AlphaZero speelde regelmatig verschillende systemen die klassieke engines hadden gedepriotiseerd:

**De Londen-opbouw (1.d4 d5 2.Lf4)**: door engines beschouwd als solide maar zonder venijn. AlphaZero speelde het met een positionele energie die menselijke spelers inspireerde om het op hoog niveau opnieuw te integreren. Vandaag gebruiken Magnus Carlsen en andere topspelers het regelmatig.

**Het Koningsgambiet (1.e4 e5 2.f4)**: een romantische opening uit de negentiende eeuw, over het algemeen beschouwd als onvoldoende op het hoogste niveau. AlphaZero speelde het en won: het onthulde bronnen die de moderne theorie niet volledig had verkend.

**Pionstructuren met meerdere eilanden** die Stockfish licht negatief evalueerde, maar die compenserende dynamiek bevatten.

Deze "herontdekkingen" hebben de voorbereidende analyses van de top beïnvloed. Sommige Grootmeesters gebruiken expliciet Leela Chess Zero (het open-source-equivalent van AlphaZero) om ideeën te vinden die Stockfish zou hebben verworpen.

## De convergentie: Stockfish NNUE en het einde van de tweedeling

In 2020 integreerde Stockfish een neurale-netwerkarchitectuur genaamd **NNUE** (Efficiently Updatable Neural Network), oorspronkelijk ontwikkeld voor shogi.

NNUE vervangt de heuristische evaluatiefunctie van Stockfish door een neuraal netwerk getraind op miljoenen posities die door Stockfish zelf zijn geëvalueerd. Resultaat: Stockfish NNUE combineert de zoeksnelheid van de oude alpha-bèta-architectuur met de rijkdom van positionele evaluatie van neurale netwerken.

De niveauverbetering was onmiddellijk: ongeveer 80-100 Elo-punten winst, waardoor Stockfish NNUE het beste publiek beschikbare programma werd.

De tweedeling "Stockfish (brute kracht) tegen AlphaZero (deep learning)" is achterhaald geworden. Beide benaderingen zijn samengesmolten. Leela Chess Zero zet zijn ontwikkeling voort met een architectuur die dichter bij die van AlphaZero staat, en beide programma's staan tegenwoordig dicht bij elkaar qua absolute sterkte.

## Implicaties voor het menselijk begrip van schaken

De diepste vraag die door AlphaZero wordt opgeworpen, is niet "welk programma is het beste?": het is "wat leert een programma dat zo speelt ons over de aard van het begrip in het schaken?"

AlphaZero suggereert dat er een vorm van positioneel begrip bestaat die niet herleidbaar is tot precieze materiële evaluatie plus diepe zoektocht. Posities die Stockfish evalueert als ~0 (gelijk) bevatten subtiele "gradiënten" van druk en kans die AlphaZero detecteert en uitbuit.

Deze gradiënten, moeilijk numeriek te kwantificeren maar intuïtief herkenbaar door een ervaren Grootmeester, lijken op wat menselijke spelers "het initiatief", "de dynamiek", "de actieve stukken" noemen. AlphaZero heeft een vorm van meting van deze kwaliteiten ontwikkeld die de klassieke heuristieken niet hadden.

Voor menselijke spelers is de les contra-intuïtief: soms is de "objectief" licht inferieure maar dynamisch rijke positie beter dan de "objectief" gelijkwaardige maar statische positie. De numerieke evaluaties van engines, nuttig maar onvolmaakt, vangen deze dynamiek niet altijd.

Dat is misschien de meest blijvende bijdrage van AlphaZero aan het schaken: eraan herinneren dat de maatstaf voor de goede zet niet alleen numeriek is. Schoonheid, druk, offer, initiatief (concepten die menselijke spelers altijd hebben gebruikt) hebben een computationele realiteit, niet alleen een poëtische.

---

*AlphaZero heeft nooit een partij tegen een mens gespeeld. Zijn tegenstanders waren engines en zijn eigen eerdere kopieën. Het heeft nooit de druk van een toernooi gevoeld, het ongemak van een verliezende positie, de vreugde van een mooie gevonden combinatie. En toch zeiden de Grootmeesters over zijn spel dat het het meest "menselijke" was dat ze ooit hadden geanalyseerd. Er zit iets in die ironie dat het overwegen waard is.*
