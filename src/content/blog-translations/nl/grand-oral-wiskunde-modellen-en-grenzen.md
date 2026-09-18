---
title: "Grand Oral onderwerp Wiskunde: Welke wiskundige modellen helpen schaken te begrijpen, en waar liggen hun grenzen?"
excerpt: >-
  Volledig uitgeschreven onderwerp voor de Grand Oral, specialisatie Wiskunde (Frans eindexamenvak): vergelijking van
  combinatorische, probabilistische, algoritmische en statistische leerbenaderingen. Meta-analyse van modellering.
  Tekst van 10 minuten, klaar om voor te dragen.
seoTitle: "Grand Oral wiskunde modellen en grenzen schaken: volledige tekst om voor te dragen"
seoDescription: >-
  Grand Oral onderwerp Wiskunde over de modellering van schaken en de grenzen ervan, volledig uitgeschreven voor 10
  minuten. Combinatoriek, kansrekening, complexiteit, leren: examenklare tekst.
frSlug: sujet-grand-oral-maths-modeles-limites
draft: false
---

> **Wat is de Grand Oral?** Dit is een mondeling eindexamenonderdeel van het Franse baccalauréat, waarbij leerlingen in hun specialisatievak een zelfgekozen onderwerp tien minuten lang moeten presenteren voor een jury. Dit artikel is een volledig uitgeschreven voorbeeldtekst voor het **specialisatievak Wiskunde** in het laatste schooljaar van het Franse voortgezet onderwijs.

Goedendag. Ik ga het hebben over een vraag die me na aan het hart ligt, en die in werkelijkheid het schaken zelf overstijgt: wat betekent het om een object wiskundig te modelleren, en hoe weet je waar een model ophoudt?

Het **onderwerp** is precies: welke wiskundige modellen helpen schaken te begrijpen, en waar liggen hun grenzen? Deze vraag interesseert mij omdat ze een meta-perspectief inneemt op het programma van het specialisatievak wiskunde in het laatste schooljaar. In plaats van één model toe te passen, ga ik meerdere modellen vergelijken en bespreken wat elk ervan vangt, wat elk ervan mist, en waarom geen enkel volledig is.

Schaken is in de loop van de twintigste eeuw door wiskundigen benaderd vanuit ten minste vier verschillende invalshoeken: combinatoriek, speltheorie, kansrekening en statistisch leren. Elk model heeft iets bijgedragen, en elk heeft zijn grenzen getoond. Dat is het verhaal dat ik ga vertellen, omdat het een breder idee illustreert: modellering is nooit neutraal, het is altijd een keuze die evenzeer bepaalt wat je ziet als wat je mist.

Ik ga in drie stappen te werk. Eerst presenteer ik de deterministische modellen: combinatoriek en speltheorie. Vervolgens analyseer ik het probabilistisch model, belichaamd door het Elo-systeem. Tot slot bespreek ik de moderne benadering via statistisch leren, die het idee van een expliciet model deels loslaat.

## De deterministische modellen: combinatoriek en speltheorie

Het eerste model, historisch en logisch gezien, is combinatorisch. Men beschouwt het spel als een eindig object: een eindig aantal posities, een eindig aantal zetten, een eindig aantal partijen. Vanuit dat gegeven kan men alles tellen.

Het belangrijkste resultaat van deze benadering is het **getal van Shannon**, berekend in negentienhonderdvijftig: er zijn ongeveer tien tot de macht honderdtwintig mogelijke schaakpartijen. Deze berekening gebruikt het **vermenigvuldigingsprincipe** dat in het laatste schooljaar wordt geleerd: vertakkingsfactor ongeveer vijfendertig, gemiddelde diepte tachtig halve zetten, dus vijfendertig tot de macht tachtig. Dat is elementaire combinatoriek toegepast op een immens object.

De grens van dit model is duidelijk: het telt zonder te evalueren. Alle partijen worden op één lijn gezet, ook die waarbij een speler op de tweede zet zijn dame verliest. Het combinatorische model is exact maar blind: het beschrijft de mogelijke ruimte zonder te hiërarchiseren wat speelbaar is.

Het tweede deterministische model is de **speltheorie**. Met de stelling van Zermelo, bewezen in negentienhonderddertien, bewijst men dat schaken onder perfect spel een vastgesteld resultaat heeft: hetzij winnen de witten, hetzij winnen de zwarten, hetzij is het remise. Dit resultaat is buitengewoon in de zuivere wiskunde: het garandeert het bestaan van een oplossing. Maar het zegt ons niet welke oplossing.

De grens van dit model is het niet-constructieve karakter ervan. Zermelo bewijst dat er een winnende strategie bestaat, maar levert hem niet. Dit is een wiskunde van bestaan zonder constructie, en die nuance is essentieel: het kennen van het bestaan van een object volstaat niet om het te gebruiken. Precies zoals de tussenwaardestelling: die bewijst dat een vergelijking een oplossing heeft, maar er zijn andere instrumenten nodig om die te vinden.

Samen zeggen deze twee deterministische modellen ons: het spel heeft een eindig aantal partijen (tien tot de macht honderdtwintig), en het heeft een vastgesteld resultaat (volgens Zermelo). En toch weten we niet wat dat resultaat is, omdat we de boom niet kunnen doorzoeken. De deterministische modellen tonen ons tegelijk de rigueur en de machteloosheid van de klassieke wiskunde tegenover een te groot object.

## Het probabilistisch model: Elo en de binomiale verdeling

Geconfronteerd met de onmogelijkheid om de volledige boom te doorzoeken, kozen wiskundigen een ander perspectief: niet langer het spel zelf modelleren, maar de **prestatie** van de spelers. Dat is de probabilistische benadering, waarvan het meest zichtbare succes het Elo-systeem is.

Het Elo-systeem, gecreëerd door Arpad Elo in de jaren zestig, berust op twee wiskundige functies. De eerste is een logistische functie die een ratingverschil omzet in een winkans: P(A verslaat B) is gelijk aan één gedeeld door (één plus tien tot de macht (R_B min R_A gedeeld door vierhonderd)). Dit is een **sigmoïde**, een functie uit het programma van het laatste schooljaar, die altijd waarden tussen nul en één aanneemt.

De tweede functie is een rating-bijwerking, geschreven als een **recursieve rij**: R_{n+1} is gelijk aan R_n plus K vermenigvuldigd met (resultaat min P). Deze rij convergeert naar de werkelijke kracht van de speler onder de aanname van stationariteit, door toepassing van de **wet van de grote aantallen**. Dat is een mooi wiskundig resultaat: een niet-observeerbaar object, het werkelijke niveau van een speler, wordt steeds beter geschat naarmate er partijen worden opgestapeld.

Het Elo-model heeft enorm succes gehad. Het wordt gebruikt in alle competitieve sporten: tennis, voetbal, esports. Het is de standaard geworden voor de modellering van individuele prestaties. Maar de grenzen ervan zijn reëel. Ten eerste is de aanname van stationariteit onjuist: spelers verbeteren of gaan achteruit. Ten tweede is de aanname van onafhankelijkheid van partijen onjuist: een verlies kan tot een tilt leiden. Ten derde extrapoleert de formule slecht bij extreme verschillen: de kans dat een speler met twaalfhonderd Elo Magnus Carlsen (tweeduizendachthonderdvijftig) verslaat, wordt berekend op één op dertienduizend, maar deze precisie is empirisch niet verifieerbaar.

Fundamenteler nog: het Elo-model modelleert de prestatie, niet het spel. Het zegt ons wie zal winnen en met welke kans, maar niet waarom. Het is nuttig om spelers te rangschikken en wedstrijden te organiseren, maar het helpt ons niet om schaken als spel te begrijpen. Dat is een structurele grens: van invalshoek veranderen komt neer op van object veranderen.

## Het model van statistisch leren: AlphaZero en het opgeven van formules

Het derde model, het meest recente, geeft het idee van een expliciet model deels op. Dat is de benadering van **statistisch leren**, belichaamd door AlphaZero in tweeduizendzeventien.

AlphaZero stelt geen aannames over schaken op. Het berekent het getal van Shannon niet, veronderstelt Zermelo niet, gebruikt de Elo-formule niet. Het speelt miljoenen partijen tegen zichzelf en past een neuraal netwerk aan om te voorspellen wie zal winnen vanuit elke positie. Aan het eind heeft het netwerk iets geleerd dat geen enkele menselijke formule heeft kunnen vangen.

Wiskundig gezien is AlphaZero een functie van de ruimte van posities naar het interval min één, plus één. Deze functie wordt geparametriseerd door tientallen miljoenen coëfficiënten, bijgesteld door **gradiëntafdaling** op de data van zelfspel. Het centrale idee is dat deze functie niet is afgeleid van expliciet redeneren: ze is aangeleerd. Dat is een wiskundige paradigmaverschuiving.

Om zijn prestaties te evalueren speelde AlphaZero in tweeduizendzeventien honderd partijen tegen Stockfish: achtentwintig overwinningen, geen enkel verlies, tweeënzeventig remises. Dit resultaat suggereert dat het leermodel iets vangt dat de klassieke modellen missen. Maar tegen welke prijs? De grenzen zijn aanzienlijk.

Eerste grens: de ondoorzichtigheid. Men weet niet waarom AlphaZero een bepaalde zet speelt. Men kan het resultaat zien, men kan de redenering niet navertellen. Dat is precies het tegenovergestelde van de klassieke wiskunde, die het bewijs waardeert. Deze ondoorzichtigheid stelt een filosofisch probleem: kan men kennis aanvaarden die men niet kan verklaren?

Tweede grens: de kosten. AlphaZero vereiste vijfduizend gespecialiseerde processoren gedurende uren, oftewel meerdere miljoenen euro's aan infrastructuur. Deze toegangsdrempel concentreert het onderzoek in enkele grote bedrijven en werpt vraagstukken van toegankelijkheid op.

Derde grens: de niet-algemeenheid. Het model is specifiek: een op schaken getraind AlphaZero weet niet zonder volledige herscholing dammen te spelen. Het mist abstractie. De menselijke modellen zijn, ondanks hun grenzen, algemener: de formule van het vermenigvuldigingsprincipe geldt voor elk willekeurig spel.

## Conclusie

Om mijn oorspronkelijke vraag te beantwoorden: meerdere wiskundige modellen helpen schaken te begrijpen, en elk heeft zijn precieze grenzen. Het combinatorische model telt maar evalueert niet. Het model van de speltheorie bewijst het bestaan van een oplossing maar construeert die niet. Het probabilistische model evalueert de prestatie maar niet het spel. Het leermodel evalueert het spel maar zonder verklaring. Geen enkel model is volledig.

Deze observatie lijkt mij centraal in de toegepaste wiskunde: modelleren betekent kiezen wat je bekijkt en wat je verwaarloost. Elk model is een lens met zijn eigen blinde vlekken. De volwassen wiskundige praktijk bestaat erin de grenzen van je model even goed te begrijpen als de successen ervan. Precies deze discipline van twijfel onderscheidt wiskunde van het simpelweg toepassen van formules. En dat is, naar mijn mening, wat schaken ons het diepst heeft geleerd: niet hoe je schaken wint, maar hoe je denkt wanneer het object het instrument overstijgt.

Ik dank u voor uw aandacht en ben bereid om uw vragen te beantwoorden.
