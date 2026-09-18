---
title: "Grand Oral onderwerp Wiskunde: In hoeverre maakt kansrekening het mogelijk om schaakprestaties te modelleren?"
excerpt: >-
  Volledig uitgeschreven onderwerp voor de Grand Oral, specialisatie Wiskunde (Frans eindexamenvak): binomiale
  verdeling, de Elo-formule, recursieve rijen, convergentie en de wet van de grote aantallen. Tekst van 10 minuten,
  klaar om voor te dragen.
seoTitle: "Grand Oral wiskunde kansrekening Elo schaken: volledige tekst om voor te dragen"
seoDescription: >-
  Grand Oral onderwerp Wiskunde over kansrekening en de Elo-rating bij schaken, volledig uitgeschreven voor 10
  minuten. Binomiale verdeling, recursieve rijen, convergentie: examenklare tekst.
frSlug: sujet-grand-oral-maths-elo-probabilites
draft: false
---

> **Wat is de Grand Oral?** Dit is een mondeling eindexamenonderdeel van het Franse baccalauréat, waarbij leerlingen in hun specialisatievak een zelfgekozen onderwerp tien minuten lang moeten presenteren voor een jury. Dit artikel is een volledig uitgeschreven voorbeeldtekst voor het **specialisatievak Wiskunde** in het laatste schooljaar van het Franse voortgezet onderwijs.

Goedendag. Ik ga het hebben over een geval waarin de abstracte wiskunde van het lesprogramma een concreet object ontmoet: de rating van schaakspelers.

Het **onderwerp** is precies: in hoeverre maakt kansrekening het mogelijk om schaakprestaties te modelleren? Deze **vraag** lijkt mij perfect voor de Grand Oral omdat ze meerdere hoofdstukken van het programma gebruikt: de **binomiale verdeling**, **recursieve rijen**, **logistische functies**, en de **wet van de grote aantallen**.

De inzet is concreet. Wanneer een grootmeester tegen een beginner speelt, verwacht men dat hij wint. Maar wat is precies de winkans? Hoe bereken je die? Hoe werk je die bij na elke partij? De Elo-rating, gecreëerd door de natuurkundige Arpad Elo in de jaren zestig, beantwoordt deze vragen met een elegant model. Ik ga het hier vanuit wiskundig oogpunt analyseren.

Ik ga in drie stappen te werk. Eerst pas ik de binomiale verdeling toe op een partij tussen spelers van verondersteld gelijk niveau. Vervolgens presenteer ik de Elo-formule en laat ik zien dat ze overeenkomt met een convergente recursieve rij. Tot slot bespreek ik de beperkingen van het model en de alternatieve benaderingen.

## De binomiale verdeling toegepast op een partij

Laten we beginnen met de meest directe modellering. Stel je twee spelers van gelijk niveau voor die tien opeenvolgende partijen spelen. Bij schaken zijn er drie mogelijke uitkomsten: winst, remise, verlies. Voor de eenvoud telt een remise als een halve overwinning. Over tien partijen volgt het aantal overwinningen (of meegetelde halve overwinningen), onder aannames, een **binomiale verdeling**.

Preciezer gezegd: als X de stochastische variabele is die het aantal overwinningen van speler A over n partijen telt, en als elke partij een Bernoulli-experiment is met parameter p (winkans van A bij elke partij), dan volgt X de verdeling B(n, p). De kans op precies k overwinningen wordt gegeven door de formule uit het programma van het laatste schooljaar: P(X = k) is gelijk aan het combinatiegetal n boven k, vermenigvuldigd met p tot de macht k, vermenigvuldigd met (1 - p) tot de macht (n - k).

Laten we een numeriek voorbeeld berekenen. Voor n gelijk aan tien en p gelijk aan nul komma vijf (spelers van verondersteld gelijk niveau) is de kans om precies zes van de tien partijen te winnen gelijk aan het combinatiegetal tien boven zes, oftewel tweehonderdtien, vermenigvuldigd met nul komma vijf tot de macht tien, oftewel één op duizendvierentwintig. De berekening geeft ongeveer nul komma tweehonderdvijf, oftewel twintig komma vijf procent.

Nog interessanter: de kans om de wedstrijd te winnen, dat wil zeggen minstens zes van de tien partijen te winnen, verkrijgt men door P(X = 6) + P(X = 7) + ... + P(X = 10) op te tellen. De berekening geeft ongeveer nul komma driehonderdzevenenzeventig, oftewel zevenendertig komma zeven procent.

Dat is een contra-intuïtief resultaat. Zelfs tussen perfect gelijke spelers heeft de perfect eerlijke uitslag van vijf-vijf slechts vijfentwintig procent kans. Met andere woorden, een "ongelijke" score is waarschijnlijker dan een "gelijke" score. De binomiale verdeling verklaart waarom zoveel wedstrijden onevenwichtig lijken terwijl de spelers op hetzelfde niveau staan: het is het toeval van de verdeling, geen krachtsverschil.

De belangrijkste beperking van deze modellering is de aanname p gelijk aan nul komma vijf. In de praktijk staan twee spelers nooit exact op hetzelfde niveau. Er is dus een methode nodig om p te schatten op basis van de ratings van beide spelers. Dat is wat de Elo-formule doet.

## De Elo-formule en de recursieve rij van de bijwerking

Het Elo-systeem bestaat uit twee essentiële wiskundige functies. De eerste schat de winkans op basis van de ratings. De tweede werkt de ratings bij na elke partij.

De **kansformule** luidt: P(A verslaat B) is gelijk aan één gedeeld door (één plus tien tot de macht (R_B min R_A gedeeld door vierhonderd)), waarbij R_A en R_B de ratings van beide spelers zijn. Deze functie is een **sigmoïde**: ze ligt altijd tussen nul en één, ze is stijgend in (R_A min R_B), en ze neemt de waarde nul komma vijf aan wanneer de ratings gelijk zijn.

Laten we een voorbeeld berekenen. Als R_A duizendzeshonderd is en R_B duizendachthonderd, is het verschil tweehonderd punten in het voordeel van B. Men berekent P is gelijk aan één gedeeld door (één plus tien tot de macht nul komma vijf), oftewel één gedeeld door ongeveer vier komma zestien, oftewel ongeveer nul komma vierentwintig. Speler A, de zwakkere, heeft dus ongeveer vierentwintig procent kans om B te verslaan. Dit cijfer, vierentwintig procent, is waardevol: het kwantificeert een kwalitatieve intuïtie ("A is zwakker maar kan winnen").

De **rating-bijwerking**, na een partij, volgt de formule R'_A is gelijk aan R_A plus K vermenigvuldigd met (resultaat min P), waarbij het resultaat één is bij winst, nul komma vijf bij remise, nul bij verlies, en waarbij K een coëfficiënt is die doorgaans tussen zestien en tweeëndertig ligt.

Als A tegen alle verwachting in wint van B, dan is R'_A gelijk aan duizendzeshonderd plus zestien vermenigvuldigd met (één min nul komma vierentwintig), oftewel duizendzeshonderd plus zestien vermenigvuldigd met nul komma zesenzeventig, oftewel duizendzeshonderd plus twaalf, oftewel duizendzeshonderdtwaalf. A wint twaalf punten. Symmetrisch verliest B twaalf punten: het is een nulsomsysteem.

Als A daarentegen verliest, wat verwacht werd, dan is R'_A gelijk aan duizendzeshonderd plus zestien vermenigvuldigd met (nul min nul komma vierentwintig), oftewel duizendzeshonderd min vier, oftewel duizendvijfhonderdzesennegentig. A verliest slechts vier punten: zijn rating beweegt weinig omdat het verlies overeenstemt met de voorspelling.

Vanuit het perspectief van het programma van het laatste schooljaar is dit mechanisme een **recursieve rij**. Als u_n de rating van speler A na de n-de partij is, geldt de relatie u_{n+1} is gelijk aan u_n plus K vermenigvuldigd met (r_n min p_n), waarbij r_n het resultaat van de n-de partij is en p_n de door de Elo-formule voorspelde kans. Convergeert deze rij?

Onder de aanname dat speler A een constant **werkelijk niveau** E heeft, kan men aantonen dat u_n naar E convergeert. Het intuïtieve idee: bij elke partij is de verwachting van (r_n min p_n) nul als de voorspelde kans exact is. Gemiddeld drift de rating dus niet weg van E. Dit is een directe toepassing van de **wet van de grote aantallen**: het empirisch gemiddelde van de resultaten convergeert naar de theoretische verwachting, en de rating stelt zich in rond E.

## Beperkingen van het model en alternatieve benaderingen

Het Elo-systeem is een elegant model, maar het berust op drie aannames die eerlijk besproken moeten worden.

Eerste aanname: **stationariteit**. De rating veronderstelt dat het niveau van de speler constant blijft tussen partijen. Dat klopt in de praktijk niet: de ene speler verbetert, de andere vermoeidt, een derde wordt ouder. De coëfficiënt K, hoger voor beginners en lager voor gevestigde spelers, is een gedeeltelijk lapmiddel. Het is de klassieke bias-variantie-afweging uit de statistiek: hoe groter K, hoe meer de rating niveauveranderingen volgt, maar hoe meer ze ook fluctueert door ruis.

Tweede aanname: de **onafhankelijkheid** van de partijen. De binomiale verdeling veronderstelt dat elke partij onafhankelijk is van de vorige. Maar een overwinning versterkt psychologisch, een nederlaag kan een reeks fouten veroorzaken. De correlaties zijn reëel maar moeilijk te modelleren.

Derde aanname: de **geldigheid van de sigmoïde**. De Elo-formule is gekalibreerd op populaties westerse spelers in de jaren zestig. Bij extremen (verschillen van meer dan vierhonderd punten) extrapoleert de formule buiten haar kalibratiedomein. Om te kwantificeren: de kans dat een speler met twaalfhonderd Elo Magnus Carlsen verslaat, op tweeduizendachthonderdvijftig, is gelijk aan één gedeeld door (één plus tien tot de macht vier komma honderdvijfentwintig), oftewel ongeveer nul komma zevenenzeventig honderdduizendste, dat wil zeggen ongeveer één kans op dertienduizend. Deze precisie is verdacht: in werkelijkheid heeft de beginner Carlsen nooit verslagen, en de formule kan bij deze verschillen empirisch niet worden gevalideerd.

Een alternatieve, modernere benadering is die van AlphaZero. Dit programma gebruikt geen expliciet probabilistisch model. Zijn neurale netwerk schat rechtstreeks een positiewaarde en een kansverdeling over de zetten, maar deze kansen zijn impliciet, voortkomend uit het leerproces. AlphaZero stelt het idee ter discussie dat kansen door formules gemodelleerd moeten worden: ze kunnen door ervaring worden aangeleerd. Dit is een paradigmaverschuiving, die de beperkingen van de parametrische benadering toont.

## Conclusie

Om mijn oorspronkelijke vraag te beantwoorden: kansrekening maakt het mogelijk om schaakprestaties te modelleren met een opmerkelijke maar begrensde precisie. De binomiale verdeling verklaart waarom onevenwichtige wedstrijden kunnen ontstaan tussen gelijke spelers. De Elo-formule, via een convergente recursieve rij, maakt het mogelijk om de winkans tussen twee willekeurige spelers te schatten en hun ratings bij te werken naarmate er partijen worden gespeeld. De wet van de grote aantallen garandeert dat deze schatting convergeert naar de werkelijke kracht van de spelers, onder aannames van stationariteit.

De beperkingen zijn precies: stationariteit, onafhankelijkheid, kalibratie bij extremen. De moderne modellen op basis van machinaal leren bieden een niet-parametrisch maar ondoorzichtig alternatief. Naar mijn mening is deze discussie tussen expliciete modellering en statistisch leren een van de grote vraagstukken van de hedendaagse toegepaste wiskunde, en schaken is een van de meest didactische voorbeelden daarvan.

Ik dank u voor uw aandacht en ben bereid om uw vragen te beantwoorden.
