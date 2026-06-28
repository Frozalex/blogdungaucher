---
title: "De algoritmische complexiteit van schaken: waarom het 50 jaar duurde voor AI de mens versloeg"
excerpt: >-
  Het aantal mogelijke schaakpartijen overstijgt het aantal atomen in het waarneembare heelal. De algoritmische
  complexiteit van schaken begrijpen betekent begrijpen waarom Deep Blue in 1997 een prestatie was, en waarom
  AlphaZero in 2017 een revolutie van een geheel andere aard was.
seoTitle: "Algoritmische complexiteit van schaken: waarom AI 50 jaar nodig had"
seoDescription: "Getal van Shannon, alpha-beta snoei, Deep Blue, AlphaZero: de algoritmische complexiteit van schaken uitgelegd, en waarom het zo moeilijk was de mens te verslaan."
frSlug: echecs-et-complexite-algorithmique
draft: false
faq:
  - question: "Wat is het 'getal van Shannon'?"
    answer: >-
      Het is een schatting van het aantal legale schaakposities, voorgesteld door Claude Shannon in 1950. Hij
      schatte het op circa 10^43. Later werk verfijnde dit tot tussen 10^44 en 10^47. Ter referentie: het
      waarneembare heelal bevat ongeveer 10^80 atomen, en één seconde telt 10^43 femtoseconden. Het getal van
      Shannon illustreert waarom een uitputtende zoektocht door alle posities fysiek onmogelijk is, zelfs met
      oneindig snelle computers.
  - question: "Hoe versloeg Deep Blue Kasparov als het niet alles kon berekenen?"
    answer: >-
      Via twee gecombineerde technieken. De <strong>alpha-beta snoei</strong> snoeit intelligent de zoekboom:
      als een tak niet tot een beter resultaat kan leiden dan wat al gevonden is, wordt ze verlaten. Dit
      verkleint de zoekruimte exponentieel. Gecombineerd met een zeer uitgebreide positie-evaluatiefunctie
      (ontwikkeld met grootmeesters) evalueerde Deep Blue ongeveer 200 miljoen posities per seconde en zocht
      typisch 12 tot 15 zetten diep. Indrukwekkend, maar geen volledige oplossing: het is een zeer krachtige
      heuristiek.
  - question: "Leerde AlphaZero schaken in slechts 9 uur?"
    answer: >-
      Ja, in een precieze betekenis: vanuit nul menselijke kennis (alleen de regels), door met zichzelf te
      spelen via reinforcement learning en diepe neurale netwerken, bereikte AlphaZero na 9 uur training op
      gespecialiseerde hardware (Google TPU's) een niveau dat Stockfish (de beste 'klassieke' motor)
      overtrof. Wat opmerkelijk is, is niet alleen de snelheid maar ook de ontwikkelde speelstijl: dynamisch,
      offervaardig, met positionele intuïties die theoretici nooit hadden gecodificeerd.
  - question: "Is schaken wiskundig 'opgelost'?"
    answer: >-
      Nee. Een spel is 'opgelost' wanneer men de optimale beslissing vanuit elke positie kan berekenen.
      Dammen werd in 2007 opgelost door Jonathan Schaeffer: een perfect remise. Schaken is niet opgelost en
      zal dat waarschijnlijk nooit worden met voorzienbare technologie: de spelruimte is te groot. Men kan
      schaken spelen beter dan elke mens, maar niet op een aantoonbaar perfecte manier.
  - question: "Waarom kunnen mensen toch schaken ondanks deze complexiteit?"
    answer: >-
      Omdat mensen niet zoeken in de ruimte van alle posities. Ze herkennen patronen, snoeien intuïtief
      slechte zetten weg, en redeneren voornamelijk vanuit concepten (druk, pionstructuur, stukactiviteit)
      in plaats van brutale berekening. Een grootmeester berekent zelden meer dan 3 tot 5 zetten diep in een
      normale positie: hij elimineert 95% door intuïtie voordat hij begint te rekenen. Dit is een radicaal
      ander type verwerking dan boomzoekactie, met zijn eigen sterktes (creativiteit, positionele intuïtie)
      en zwaktes (minder nauwkeurig rekenen onder tijdnood).
---

In 1950 publiceerde Claude Shannon (de grondlegger van de informatietheorie) een artikel getiteld "Programming a Computer for Playing Chess." Hij had de programma's nog niet geschreven. Hij berekende of het überhaupt *mogelijk* was.

Zijn conclusie: het aantal legale schaakposities bedraagt ongeveer 10^43. Het aantal mogelijke afzonderlijke partijen is nog groter. Een uitputtende zoektocht door de volledige spelenboom zou de capaciteiten van elke fysiek realiseerbare computer te boven gaan: niet door gebrek aan snelheid, maar omdat de benodigde tijd de leeftijd van het heelal zou overstijgen.

Er moest dus iets anders worden gevonden.

## Wat is algoritmische complexiteit?

Algoritmische complexiteit is een tak van de theoretische informatica die de middelen (tijd, geheugen) bestudeert die nodig zijn om problemen op te lossen. Ze classificeert problemen naar hun "fundamentele moeilijkheid": niet in de praktijk op een gegeven computer, maar in theorie, asymptotisch, naarmate de omvang van het probleem groeit.

De bekendste klassen:
- **P**: problemen oplosbaar in polynomiale tijd (snel)
- **NP**: problemen waarvan de oplossingen in polynomiale tijd *geverifieerd* kunnen worden (potentieel traag op te lossen, snel te verifiëren)
- **PSPACE**: problemen oplosbaar met polynomiaal geheugen (zelfs als de tijd exponentieel is)
- **EXPTIME**: problemen die in het slechtste geval exponentiële tijd vereisen
- **EXPSPACE**: de meest gevreesde klasse, die zowel exponentiële tijd als geheugen vereist

Gegeneraliseerd schaken (op een n×n bord in plaats van 8×8) behoort tot de klasse **EXPTIME-volledig** volgens de resultaten van Fraenkel en Lichtenstein (1981). Dit betekent dat de exacte oplossing van schaken op een willekeurig bord, in formele zin, even moeilijk is als de hardste problemen in zijn klasse, en dat geen enkel polynomiaal algoritme ze in het algemeen kan oplossen.

Voor schaken op het standaard 8×8 bord is de vraag iets anders: de partij eindigt altijd (50-zetenregel, drievoudige herhaling), dus het probleem is eindig. Maar de zoekruimte blijft astronomisch.

## De spelenboom en de vloek van de combinatorische explosie

Stel u de spelenboom van een schaakpartij voor. Aan de wortel, de beginpositie. Na de eerste zet van Wit (20 mogelijk), 20 knopen. Na de eerste zet van Zwart (20 mogelijk), 400 knopen. Na twee zetten van elke kant: ongeveer 8.902 posities. Na vijf zetten van elke kant: ongeveer 69 miljard.

De gemiddelde vertakkingsfactor van een schaakpartij is ongeveer 35 (het aantal legale zetten in een typische positie). De gemiddelde lengte van een partij is ongeveer 40 zetten per speler. De volledige boom telt dus bij benadering 35^80 ≈ 10^123 knopen.

Dit is het **aantal mogelijke afzonderlijke partijen**. Het overtreft verre het aantal atomen in het waarneembare heelal (10^80). Zelfs als elk atoom van het heelal een computer was die een miljard posities per seconde analyseerde sinds de Oerknal, zou slechts een infinitesimaal klein deel van deze ruimte zijn verkend.

Deze combinatorische explosie verklaart waarom de eerste schaakprogramma's, in de jaren 1950 tot 1970, zo zwak waren ondanks steeds krachtigere computers. Brute kracht alleen kon niet werken. Er waren heuristieken nodig: intelligente snelkoppelingen die de garantie van optimaliteit opofferen voor praktische uitvoerbaarheid.

## Alpha-beta snoei: de eerste grote sprong

Het **alpha-beta snoei**-algoritme, ontwikkeld in de jaren 1950 tot 1960 door meerdere onderzoekers (waaronder John McCarthy en Donald Knuth), is de fundamentele heuristiek van klassieke schaakprogramma's.

Het idee: als men de spelenboom doorzoekt en een tak vindt die niet beter kan zijn dan wat al gevonden is, stopt men met het verkennen ervan. Preciezer: men handhaaft twee waarden, alpha (de beste score die Wit kan garanderen) en beta (de beste score die Zwart kan garanderen). Zodra een tak een score buiten dit venster [alpha, beta] oplevert, wordt ze verlaten.

In het beste geval reduceert alpha-beta snoei het aantal te verkennen knopen tot de vierkantswortel van de volledige boom. Vanuit een ruimte van 10^123 kan men hopen 10^61 te doorzoeken, nog steeds astronomisch, maar veel beter beheersbaar met goede heuristieken voor het ordenen van zetten (eerst de waarschijnlijk goede zetten doorzoeken maakt de snoei efficiënter).

Gecombineerd met een **evaluatiefunctie**: een formule die de waarde van een positie schat zonder naar de bladeren van de boom te gaan, maakt alpha-beta het mogelijk tot een vaste diepte te zoeken en de resulterende posities te evalueren. Dat is precies wat Deep Blue in 1997 deed.

## Deep Blue: de overwinning van de techniek

Deep Blue was geen subtiel programma. Het was een ingenieursmasterwerk van brute kracht toegepast op schaakheuristieken.

IBM had **gespecialiseerde chips** (ASIC's) gebouwd die uitsluitend waren ontworpen om schaakposities te evalueren: honderden parallel. Deep Blue evalueerde tussen 100 en 300 miljoen posities per seconde. Met goed geoptimaliseerde alpha-beta snoei en verfijnde ordeningsheuristieken zocht het typisch tot een diepte van 12 tot 16 zetten, soms meer in kritieke posities ("uitbreidingszoekactie").

De evaluatiefunctie was ontwikkeld met de hulp van grootmeesters: ze codificeerde expliciet concepten als pionstructuur, koningsveiligheid, stukactiviteit en zwakke velden. Elk concept werd in numerieke termen vertaald, met gewichten aangepast door de ingenieurs.

Kasparov had Deep Blue in 1996 verslagen (4-2). Hij verloor in 1997 (3,5-2,5). Zijn nederlaag was niet te wijten aan het "begrip" van het spel door Deep Blue: dat was er in cognitieve zin helemaal niet. Het was rekenkracht plus gecodificeerde menselijke heuristieken plus hardware-engineering, opgedreven tot een drempel waarop de brute rekenkracht de beperkingen van de aanpak compenseerde.

## AlphaZero: een revolutie van een andere aard

Twintig jaar later presenteerde DeepMind AlphaZero. Het verschil was niet kwantitatief: het was kwalitatief.

AlphaZero ontving alleen de **spelregels**: welke stukken bestaan, hoe ze bewegen, wanneer een partij eindigt. Geen database van menselijke partijen. Geen expliciete heuristieken. Geen concepten gecodificeerd door grootmeesters.

Het speelde tegen zichzelf: miljoenen partijen. Na elke partij leerde een diep neuraal netwerk: welke posities de neiging hebben winnend te zijn, welke zetten de neiging hebben goed te zijn vanuit welke posities. Na **9 uur** training op TPU's (gespecialiseerde processors van Google) had AlphaZero een niveau bereikt dat Stockfish overtrof, de beste "klassieke" motor van die tijd.

De speelstijl die AlphaZero had ontwikkeld fascineerde grootmeesters: dynamisch, gretig offerend, met positionele intuïties die theoretici nooit expliciet hadden gecodificeerd. AlphaZero doorzocht aanzienlijk minder posities dan Stockfish (circa 80.000 per seconde tegen 60 miljoen), maar elke positie werd geëvalueerd door een neuraal netwerk dat een door ervaring aangeleerde "intuïtie" encodeerde in plaats van expliciete regels.

Dit was niet langer verbeterd uitputtend zoeken. Het was iets structureel anders: een benadering van intuïtie door diep leren.

## Wat AI onthult over menselijke cognitie bij schaken

De trajectorie Deep Blue naar AlphaZero onthult iets belangrijks over de aard van de menselijke cognitie bij schaken.

Deep Blue versloeg mensen door het *anders* te doen: meer brute berekening, sneller, dieper. AlphaZero verslaat mensen door iets te doen dat *meer lijkt* op wat mensen doen: patroonherkenning, intuïtieve evaluatie, sterk gesnoeide boomzoekactie.

Functionele MRI-studies op ervaren schaakspelers tonen dat hun hersenen geen brute rekenmachine zijn. Geconfronteerd met een positie "berekent" een grootmeester niet eerst alle varianten. Hij **herkent** de positie als behorend tot een familie, identificeert de sleutelthema's, en verkent slechts 3 tot 5 kandidaatzetten diepgaand. De meeste van de 35 beschikbare legale zetten worden in fracties van een seconde verworpen door een intuïtief proces, voordat de bewuste redenering zelfs maar begint.

Deze verwerking (snel, patroongebaseerd, economisch) is wat AlphaZero beter reproduceert dan Deep Blue. En dat is waarschijnlijk waarom AlphaZero speelconcepten heeft ontwikkeld die mensen als "mooi" of "gedurfd" herkennen: in tegenstelling tot het solide maar mechanische spel van Stockfish.

## Deep Blue vs. Kasparov: het volledige verhaal van 's werelds beroemdste schaakwedstrijd

De rematch van 1997 tussen Deep Blue en Garry Kasparov is de beroemdste schaakwedstrijd ooit gespeeld, niet in de eerste plaats vanwege het schaken zelf maar vanwege wat het betekende: de eerste keer dat een computersysteem de regerende wereldkampioen versloeg in een klassieke wedstrijd onder standaard competitieomstandigheden.

### De weg naar 1997

Het verhaal van Deep Blue begint in de jaren 1980 aan de Carnegie Mellon University, waar de informatica-promovendi Feng-hsiung Hsu en Murray Campbell ChipTest ontwikkelden, een schaakprogramma dat een nieuwe aanpak vertegenwoordigde. In plaats van verfijnde evaluatiefuncties die menselijke schaakkennis codificeerden, gebruikte ChipTest aangepaste VLSI-chips om posities met extreem hoge snelheid te doorzoeken.

IBM nam Hsu en Campbell in dienst in 1989, en het project werd omgedoopt tot Deep Thought, vervolgens Deep Blue. Het ontwikkelteam besteedde jaren aan het verfijnen van zowel de hardware als de evaluatiefunctie, waarbij expertschaakkennis werd toegevoegd via overleg met grootmeesters, waaronder Joel Benjamin.

In 1996 stond Deep Blue tegenover Kasparov in een wedstrijd van zes partijen. Kasparov won met 4-2, maar het resultaat was dichter bij dan de meesten hadden verwacht. De eerste-partijoverwinning van Deep Blue was een schok: geen computer had ooit de wereldkampioen verslagen in een partij met klassieke bedenktijd.

### De wedstrijd van 1997: partij voor partij

De rematch van 1997 was gelijker en beroemder. IBM had Deep Blue aanzienlijk verbeterd: snellere hardware, een meer uitgewerkte evaluatiefunctie, en de mogelijkheid om openingsposities uit een grotere database te halen.

Partij 1 werd gewonnen door Kasparov op overtuigende wijze. Partij 2 werd beroemd om één zet in een laat eindspel: Deep Blue speelde Ld6, een diep contraintuitieve defensieve zet die passief leek maar objectief correct was. Kasparov was ervan overtuigd dat IBM moest hebben vals gespeeld of menselijke assistentie had ontvangen. Kasparov gaf op in een positie die in feite remise was. Dit opgeven in een remisepositie blijft een van de beroemdste fouten in de schaakgeschiedenis.

Partijen 3, 4 en 5 waren remises. Partij 6 was catastrofaal voor Kasparov: onder druk van de wedstrijdsituatie en met duidelijke tekenen van psychologische verstoring maakte hij een snel verliezende fout in de opening en gaf op na minder dan 20 zetten. Deep Blue won de wedstrijd met 3,5-2,5.

### Wat Deep Blue werkelijk aantoonde over schaakcomplexiteit

De aanpak van Deep Blue voor schaakcomplexiteit bestond er in wezen uit om rekenmiddelen op het probleem te gooien. Het systeem evalueerde ongeveer 200 miljoen posities per seconde. Met alpha-beta snoei en ordeningsheuristieken zocht het typisch 12 tot 16 zetten vooruit in de meeste posities, en kon het tot 30 tot 40 zetten uitbreiden in tactische posities.

Deep Blue loste schaken niet op. Het toonde aan dat sterk gespecialiseerde brute kracht, met intelligentie toegepast, de beste menselijke speler kon overtreffen.

## AlphaZero en de revolutie van neurale netwerken in schaken

Twintig jaar na Deep Blue vertegenwoordigde AlphaZero van DeepMind een revolutie in de schaakcomputers, niet omdat het sneller of sterker was dan Deep Blue (hoewel het veel sterker was), maar omdat de aanpak fundamenteel anders was.

### Hoe AlphaZero schaken leerde

AlphaZero ontving alleen de regels van schaken. Geen openingsdatabases. Geen eindspelstabellen. Geen evaluatiefunctie ontworpen door menselijke schaakexperts. Geen partijen van menselijke grootmeesters. Alleen de legale zetten, de overwinnings- en verliesomstandigheden, en een reinforcement learning algoritme.

Het systeem speelde schaken tegen zichzelf: miljoenen partijen, elke partij voedde gegevens terug in het neurale netwerk dat zetselectie stuurde. Het neurale netwerk leerde, door dit zelfspel, welke bordposities waarschijnlijk tot winst leiden en welke zetten vanuit gegeven posities de moeite waard zijn om te verkennen. Na 9 uur training op de TPU-hardware van Google had AlphaZero een niveau bereikt dat Stockfish overtrof.

### AlphaZero's speelstijl: wat de grootmeesters zeiden

Toen de sterkste menselijke grootmeesters de partijen van AlphaZero analyseerden, was hun reactie consistent en opvallend: de partijen zagen er anders uit dan traditionele computerschaak. De partijen van Deep Blue hadden geleken op wat ze waren: extreem nauwkeurige tactische berekening met competent positioneel spel. De partijen van AlphaZero leken op iets heel anders.

Grootmeesters beschreven langetermijn strategische offers: materiaal opgeven voor positionele voordelen die pas 20 of 30 zetten later doorslaggevend zouden worden. Ze zagen stukplaatsing die contraintuitief was maar objectief superieur. Ze zagen koningsveiligheidsevaluaties die gevestigde theorie tegenspraken maar correct bleken.

Garry Kasparov schreef na het bestuderen van de partijen van AlphaZero dat het systeem posities had ontwikkeld die leken op zijn eigen stijl: dynamisch, energetisch, gebaseerd op activiteit en initiatief in plaats van materiaal tellen. Anish Giri, Nederlands beste schaakkaart en zelf een van de sterkste spelers ter wereld, merkte op dat AlphaZero concepten had herontdekt die aan de Tata Steel in Wijk aan Zee door de beste spelers ter wereld worden gepraktiseerd, maar dan uitgevoerd met bovenmenselijke precisie.

## Stockfish, Leela Chess Zero en het huidige schaakprogrammalandschap

Het landschap van schaakprogramma's is vandaag complexer en interessanter dan op elk eerder punt in de geschiedenis van schaakcomputers. Twee fundamenteel verschillende benaderingen van schak-AI bestaan naast elkaar.

### Stockfish: de technische aanpak

Stockfish is de opvolger van de Deep Blue-traditie: een schaakprogramma ontwikkeld door een open-source gemeenschap van programmeurs en schaakexperts. Stockfish gebruikt traditioneel alpha-beta zoeken met een enorme hoeveelheid door mensen ontworpen evaluatiekennis over schaakposities.

In recente jaren heeft Stockfish elementen van neurale netwerktechnologie opgenomen (NNUE, Neural Network Updated Efficiently), waarbij een hybride aanpak wordt gecreëerd die de snelheid en tactische nauwkeurigheid van traditioneel alpha-beta zoeken combineert met de positionele evaluatiekwaliteit van neurale netwerken.

### Leela Chess Zero: de open-source AlphaZero

Leela Chess Zero (LCZero) is een open-source recreatie van de AlphaZero-aanpak, ontwikkeld door een gemeenschap van programmeurs en schaakliefhebbers. Net als AlphaZero gebruikt LCZero een diep neuraal netwerk getraind via zelfspel.

De competitie tussen Stockfish en Leela Chess Zero is een van de interessantste lopende experimenten in schaakcomputers geworden.

## Schaakprogramma's en menselijke grootmeesters: de nieuwe verhouding

De verhouding tussen menselijke schaakspelers en schaakprogramma's is volledig veranderd sinds de overwinning van Deep Blue in 1997. De Koninklijke Nederlandse Schaakbond (KNSB) heeft dit erkend in haar trainingsaanbevelingen: programma's zijn geen tegenstanders meer maar instrumenten. Vandaag concurreren grootmeesters niet meer serieus tegen programma's: de kloof is te groot. In plaats daarvan zijn programma's het primaire instrument voor schaakvoorbereiding.

Professionele schaakvoorbereiding in het moderne tijdperk is onmogelijk te begrijpen zonder verwijzing naar schaakprogramma's. De diepte van de openingstheorie is dramatisch uitgebreid omdat programma's openingsposities kunnen analyseren tot diepten die menselijke berekening niet bereikt.

## De toekomst van AI en schaken: voorbij menselijk begrip

Schaakprogramma's hebben menselijk begrip nu overtroffen, niet alleen in tactische berekening maar ook in positionele evaluatie. Huidige schaakprogramma's spelen veel zetten die er zelfs voor de sterkste grootmeesters verkeerd uitzien maar objectief correct blijken.

Schaken heeft gediend als benchmark voor onderzoek naar kunstmatige intelligentie sinds het artikel van Claude Shannon uit 1950. De trajectorie van Shannons berekening van theoretische onmogelijkheid naar de overwinning van Deep Blue naar AlphaZero's intuïtieve beheersing vertegenwoordigt een van de meest significante prestaties in de geschiedenis van AI-onderzoek.

De algoritmische complexiteit van schaken, ooit gezien als een barrière die overwonnen moest worden door steeds snellere hardware, bleek productiever benaderd te kunnen worden via leren in plaats van zoeken. Shannon had het in 1950 bij het rechte eind. Uitputtend zoeken was onmogelijk. De oplossing was niet sneller zoeken. Het was leren om niet te zoeken.

---

*Claude Shannon speelde zelf schaken, met een "redelijk" niveau volgens zijn tijdgenoten. Hij had het waarschijnlijk ironisch gevonden dat de beste oplossing voor zijn probleem niet de computer imiteerde, maar de mens.*

## Bronnen

- Shannon, C. E. (1950). Programming a computer for playing chess. *Philosophical Magazine*, 41(314), 256-275.
- Fraenkel, A. S., & Lichtenstein, D. (1981). Computing a perfect strategy for n×n chess requires time exponential in n. *Journal of Combinatorial Theory*, 31(2), 199-214.
- Silver, D., et al. (2018). A general reinforcement learning algorithm that masters chess, shogi, and Go through self-play. *Science*, 362(6419), 1140-1144.
- Campbell, M., Hoane, A. J., & Hsu, F. H. (2002). Deep Blue. *Artificial Intelligence*, 134(1-2), 57-83.

## Kernpunten

- Het aantal legale schaakposities wordt geschat op **10^44 tot 10^47** (getal van Shannon). Het waarneembare heelal bevat ongeveer 10^80 atomen
- **Deep Blue** versloeg Kasparov in 1997 door versterkte brute kracht: 200 miljoen posities per seconde + alpha-beta snoeiheuristieken
- **AlphaZero** (2017) ontving alleen de regels en speelde 44 miljoen partijen tegen zichzelf in 9 uur, waarbij het concepten ontwikkelde die theoretici niet kenden
- Schaakcomplexiteit is **EXPTIME-volledig** in de gegeneraliseerde versie (n×n bord): geen polynomiaal algoritme kan schaken in het algemeen oplossen
- Menselijk schaakbegrip is geen gedegradeerde versie van boomzoekactie: het is **radicaal verschillende cognitie** gebaseerd op patroonherkenning en intuïtie
