---
title: "Schaken versus Go: welk spel vraagt meer intelligentie?"
excerpt: >-
  Go-fans zeggen dat hun spel oneindig complexer is. Schaakfans antwoorden dat het anders is, niet inferieur.
  Wat zeggen de cijfers, de cognitieve wetenschap en de kunstmatige intelligentie werkelijk?
seoTitle: "Schaken versus Go: volledige vergelijking (complexiteit, cognitie, AI)"
seoDescription: "Welk spel vraagt meer intelligentie: schaken of Go? Combinatorische complexiteit, menselijke cognitie, AI: de volledige vergelijking in één rigoureuze analyse."
frSlug: echecs-vs-go-complexite-intelligence
draft: false
faq:
  - question: "Is Go werkelijk complexer dan schaken?"
    answer: >-
      Combinatorisch gezien, ja: ongeveer 10^170 legale posities tegen 10^46 bij schaken. Maar de complexiteit
      van een spel voor een mens beperkt zich niet tot het aantal posities. Cognitief onderzoek toont aan dat
      beide spelen verschillende hogere mechanismen aanspreken, en dat geen van beide 'moeilijker' is in
      absolute zin.
  - question: "Heeft AlphaGo Go opgelost?"
    answer: >-
      Nee. AlphaGo en zijn opvolgers (AlphaZero, KataGo) spelen ver voorbij menselijk niveau, maar Go blijft
      wiskundig niet opgelost: men kent het perfecte resultaat bij optimaal spel van beide kanten niet.
  - question: "Kan men sterk zijn in beide?"
    answer: >-
      Ja, maar dat is zeldzaam. De vaardigheden overlappen gedeeltelijk (patroonherkenning, situatiegeheugen),
      maar de heuristieken van elk spel interfereren vaak. De meeste zeer goede spelers specialiseren zich
      in slechts één spel.
---

Er is een vraag die spelers van beide kampen bij elke ontmoeting terugnemen: welk van beide spelen is het meest complex? Go-liefhebbers tonen de astronomische cijfers van hun spelruimte. Schaakspelers antwoorden dat hun spel een tactische nauwkeurigheid vereist die Go niet kent. Beide hebben gedeeltelijk gelijk. En de vraag zelf is verkeerd gesteld.

Deze vergelijking streeft er niet naar een winnaar te kronen. Ze tracht te begrijpen wat elk spel werkelijk van het menselijk brein vraagt, en wat hun respectieve trajecten tegenover kunstmatige intelligentie ons leren over de aard van deze vereisten.

## Combinatorische complexiteit: de cijfers en wat ze niet zeggen

Het aantal legaal speelbare schaakpartijen wordt geschat op 10^120 tot 10^123, wat men het getal van Shannon noemt. De ruimte van legale posities bereikt ongeveer 10^46. Dit zijn duizelingwekkende cijfers.

Bij Go, op een goban van 19×19, overstijgt het aantal legale posities 10^170. Het aantal mogelijke partijen is nog groter. Om deze cijfers in perspectief te plaatsen: het aantal atomen in het waarneembare heelal bedraagt ongeveer 10^80. Go overtreft de atomen van het heelal, schaken niet.

Maar wat betekent dit werkelijk voor een menselijke speler?

Niets direct. Een menselijke speler doorzoekt de boom van mogelijkheden niet op uitputtende wijze. Hij evalueert posities, herkent structuren, past heuristieken toe. De absolute combinatorische complexiteit zegt weinig over de werkelijke cognitieve complexiteit van elk spel. Wat telt, is de granulariteit van de beslissingen en de diepte van de strategische horizon zoals waargenomen door een topspeler.

Op dit punt zijn de twee spelen eerder verschillend dan ongelijk.

## Wat schaken specifiek vraagt

Cognitieve studies over schaakspelers zijn talrijk sinds het baanbrekende werk van Adriaan de Groot in de jaren 1940. Zijn experimenten toonden aan dat grootmeesters niet meer zetten berekenen dan amateurspelers: ze berekenen beter, door onmiddellijk de relevante takken te selecteren.

Dit mechanisme berust op wat men tegenwoordig patroonherkenning noemt. Een grootmeester heeft tussen 50.000 en 100.000 positionele structuren gememoriseerd, volgens de schattingen van Chase en Simon (1973). Geconfronteerd met een positie, voert zijn brein een snelle vergelijking uit met deze sjablonen, wat zijn zoekactie onmiddellijk oriënteert naar de nuttige kandidaatzetten.

Wat schaken veeleisend maakt, is de tactische nauwkeurigheid. Een reeks van 7 zetten kan een licht betere positie transformeren in een winnende of verliezende positie. De evaluatie van een schaakpositie is vaak binair met hoge nauwkeurigheid: er is een beste zet of een hoofdlijn, die men moet vinden. Deze nauwkeurigheidseis is uniek.

De meest aangesproken cognitieve functies bij schaken zijn de uitvoerende functies (planning, inhibitie, flexibiliteit), het visueel-ruimtelijk werkgeheugen en het sequentieel deductief redeneren.

## Wat Go anders vraagt

Go wordt gespeeld op een leeg goban. De eerste zetten hebben geen onmiddellijk zichtbare tactische waarde: ze vestigen invloeden, potentiële territoria, speelrichtingen. Een beginner kijkt naar een goban in een lopende partij en begrijpt niet hoe het te evalueren. Een meester ziet globale structuren, evenwichten van territorium en kracht.

Wat cognitieve studies bij Go tonen, is dat expertise meer berust op een holistische evaluatie van globale posities dan op de berekening van nauwkeurige sequenties. Go-topspelers berekenen tactische sequenties in lokale gevechten (de "ladders", de reeksgevangenmames), maar het overgrote deel van hun superioriteit ligt in de globale strategische evaluatie, die moeilijk te formaliseren is.

Michael Redmond, een van de zeldzame westerse spelers die het niveau van professionele 9-dan heeft bereikt, beschrijft de beslissing in Go als een beredeneerde intuïtie: men voelt dat een bepaalde zone urgenter is, dat een bepaalde zet een globale harmonie creëert, zonder het altijd expliciet te kunnen berekenen.

Deze intuïtieve en globale dimensie is precies wat Go zo moeilijk maakte voor de alpha-beta-algoritmen die bij schaken worden gebruikt. Deze algoritmen doorzoeken een zoekboom en evalueren posities. Bij Go is de vertakkingsruimte veel te groot, en de posities zijn te moeilijk lokaal te evalueren.

## De les van de kunstmatige intelligentie

De trajectorie van AI in beide spelen is leerzaam.

Deep Blue verslaat Kasparov in 1997. De aanpak is die van brute kracht geleid door heuristieken: met de hand gecodeerde positie-evaluatie, massaal parallelle alpha-beta-zoekactie. Schaken blijkt relatief toegankelijk voor dit algoritme omdat de vertakkingsruimte beheersbaar is en de posities evalueerbaar zijn met duidelijke materiële en positionele criteria.

AlphaGo verslaat Lee Sedol in 2016, twintig jaar later. En de aanpak is radicaal anders: neurale netwerken getraind op miljoenen menselijke partijen, vervolgens vervolmaakt door reinforcement learning tegen zichzelf. AlphaGo evalueert posities niet met met de hand gecodeerde criteria: het heeft een vorm van positionele intuïtie ontwikkeld door massale blootstelling.

Dit verschil van twintig jaar is niet te wijten aan de luiheid van informatici. Het is te wijten aan de aard van elk spel. Schaken leende zich voor klassieke analytische benaderingen. Go had een AI nodig die in staat was tot holistische intuïtie, wat pas mogelijk werd met deep learning.

AlphaZero, gepubliceerd door DeepMind in 2017, speelt beide spelen. Vertrekkend van nul en uitsluitend trainend via zelfspel, bereikt het een bovenmenselijk niveau bij schaken in 4 uur en bij Go in 8 uur. Dit resultaat suggereert dat beide spelen gelijksoortige leervormen vragen in hun diepe architectuur, ook al verschillen de oppervlaktestrategieën.

## Vergeleken cognitieve profielen

Cognitieve neurowetenschappelijke studies hebben geprobeerd de expertspelers in beide spelen te karakteriseren. De resultaten convergeren op één punt: beide spelen rekruteren sterk de prefrontale cortex en de regio's gerelateerd aan patroongeheugen (occipito-parietale en temporale regio's).

Verschillen komen naar voren in de details. Schaakspelers tonen een meer uitgesproken activering van de regio's gerelateerd aan sequentiële berekening en deductief redeneren. Go-spelers tonen een meer gedistribueerde activering, met een grotere deelname van de regio's gerelateerd aan holistische evaluatie en globale ruimtelijke integratie.

Men moet deze verschillen niet overinterpreteren: ze weerspiegelen de vereisten van elk spel, geen verschillen in algemene intelligentie. Een groot schaakspeler en een groot Go-speler hebben beiden hersenen die informatie op uitzonderlijke wijze verwerken. Ze hebben die simpelweg in gedeeltelijk verschillende richtingen getraind.

## Waarom de vraag verkeerd gesteld is

"Welk spel vraagt de meeste intelligentie?" veronderstelt dat er een algemene intelligentiefactor bestaat die de spelen meten en ontwikkelen. Cognitief onderzoek ontkracht dit idee al meerdere decennia.

Intelligentie is meervoudig, gecontextualiseerd, domeinafhankelijk. Schaakspelers zijn uitzonderlijk goed in het evalueren van tactische posities en het plannen van sequenties. Go-spelers zijn uitzonderlijk goed in het evalueren van territoriale evenwichten en het nemen van beslissingen onder diepe ambiguïteit. Deze twee vormen van uitmuntendheid zijn niet op één schaal te vergelijken.

Wat zeker is: beide spelen behoren tot de meest cognitief veeleisende activiteiten die de mens heeft uitgevonden. Zeggen dat het ene "moeilijker" is dan het andere komt neer op vragen of bergbeklimmen moeilijker is dan zwemmen. Het hangt af van wie je bent, hoe je leert, en wat je bedoelt met moeilijk.

## Wat elk spel het andere leert

Spelers die beide serieus hebben beoefend, beschrijven echte maar gedeeltelijke kruislingse lessen.

Schaken leert de Go-speler een tactische rigeur in lokale gevechten. De vangstsequenties, de dubbele dreigingen, de nauwkeurige berekening van een ko-sequentie: deze instrumenten worden gedeeltelijk overgedragen van de schaakspeler naar Go.

Go leert de schaakspeler een globale strategische lezing en een tolerantie voor ambiguïteit. Een schaakspeler die Go benadert met zijn instinct voor lokale evaluatie raakt snel de weg kwijt. Leren een globale situatie te evalueren zonder onmiddellijke zekerheid is een vaardigheid die Go beter ontwikkelt dan schaken.

Beide spelen delen ten slotte iets essentieels: ze eisen van hun beoefenaar een radicale eerlijkheid tegenover zijn eigen fouten. Een schaak- of Go-partij besluit met een onweerlegbare waarheid. Geen geluk, geen excuus. Deze epistemische deugd is gemeenschappelijk aan beide tradities, en het is misschien de kostbaarste van alles wat deze spelen doorgeven.

Max Euwe, die van 1935 tot 1937 wereldkampioen schaken was en van beroep wiskundeprofessor, beschreef ooit hoe zijn leerervaring in beide domeinen hem onderwees dat exacte regels en holistische intuïtie niet tegengesteld maar complementair zijn. Een les die even geldig is voor schaken als voor Go.
