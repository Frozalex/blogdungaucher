---
title: "Speltheorie bij schaken: waarom elke zet een strategische beslissing is"
frSlug: "theorie-des-jeux-aux-echecs"
excerpt: "Schaken is het terrein waarop de speltheorie werd geboren. Minimax, Nash-evenwicht, perfecte informatie: een wiskundige ontleding van wat er werkelijk gebeurt als je speelt."
seoTitle: "Speltheorie bij schaken: Nash, minimax, Zermelo uitgelegd | Blog van een Linkshandige"
seoDescription: "Minimax, Nash-evenwicht, gemengde strategieën, stelling van Zermelo: de speltheorie toegepast op schaken, van openingen tot voorbereiding op een specifieke tegenstander."
publishDate: "2026-05-05"
category: "science"
tags: ["speltheorie", "schaken", "wiskunde", "Nash", "minimax", "Zermelo", "dominante strategie", "gemengde strategie", "wetenschap"]
draft: false
faq:
  - question: "Is schaken een nulsomspel in de strikte zin?"
    answer: "Ja, wiskundig gezien. De som van de opbrengsten (1 voor een overwinning, 0 voor een verlies) is constant ongeacht het resultaat: de overwinning van de één is precies het verlies van de ander, remise wordt 0,5-0,5 gedeeld. Het is juist deze eigenschap die minimax zonder complicaties toepasbaar maakt. 'Matchen' (reeksen partijen met tactische bonussen) zijn niet meer strikt nulsomspelen, en dat is precies waar de theorie van herhaalde spellen interessant wordt."
  - question: "Wat is het verschil tussen minimax en Nash-evenwicht bij schaken?"
    answer: "Minimax is een <strong>berekeningstechniek</strong>: het zegt hoe je de beste zet vindt door ervan uit te gaan dat de tegenstander optimaal speelt. Het Nash-evenwicht is een <strong>toestand van het systeem</strong>: een configuratie waarbij geen speler er belang bij heeft om alleen af te wijken. In een nulsomspel met twee spelers zoals schaken <em>valt</em> de minimax-oplossing <em>samen</em> met het Nash-evenwicht (stelling van von Neumann, 1928). Bij complexere spellen (niet-nulsom, meer dan twee spelers) lopen de twee concepten uiteen."
  - question: "Bestaat er een dominante strategie bij de eerste zet?"
    answer: "Empirisch gezien <strong>nee</strong>. Statistieken over tientallen miljoenen toppartijen geven 1.e4, 1.d4, 1.c4 en 1.Pf3 als speelbaar met een vergelijkbaar voordeel voor Wit (~54-56% score). Geen ervan <em>domineert</em> de anderen in de strikte zin. Dit suggereert ofwel dat de 'waarheid' van het schaken meerdere evenwichten bij zet 1 toelaat, ofwel dat de menselijke en machinale rekeningshorizon ze nog niet kan onderscheiden."
  - question: "Waarom spreekt men van 'gemengde strategieën' als je altijd de beste zet speelt?"
    answer: "Omdat 'de beste zet' afhangt van je model van de tegenstander. Als je systematisch 1.e4 speelt, geef je de tegenstander perfecte informatie over je voorbereiding: hij kan al zijn studietijd in jouw lijnen investeren. Diversifiëren (40% 1.e4, 40% 1.d4, 20% 1.Pf3) verdunt zijn voorbereidingsinspanning. Boven een bepaald niveau wordt de gemengde strategie een defensieve investering in informatie."
  - question: "Kan de speltheorie voorspellen wie een partij wint?"
    answer: "Nee, en dat is belangrijk. Ze zegt dat <strong>onder perfect spel</strong> het resultaat bepaald is. Maar perfect spel bestaat noch bij de mens (cognitieve beperkingen) noch bij de machine (rekenbeperkingen voorbij eindspe-len met 7 stukken). De theorie voorspelt <em>asymptotische evenwichten</em> (de Spaanse opening stabiel gedurende 200 jaar), niet <em>individuele uitkomsten</em>. Daarvoor moet je krachtsverschil, voorbereiding, vermoeidheid en het tijdstip van de partij modelleren, en dan maakt de speltheorie plaats voor statistiek en psychologie."
---

Ronde 9. Zet 14. Je hebt de dertien voorgaande gespeeld zonder te nadenken: je kent ze van buiten. Je tegenstander ook. Jullie kijken allebei naar de klok, niet naar het schaakbord. Op dit moment zijn jullie twee volkomen rationele actoren die opgesloten zitten in hetzelfde evenwicht.

Jullie weten het. Hij ook.

Dát is het onderwerp van de speltheorie. Het is geen metafoor: schaken is **het schoolvoorbeeld** waarop von Neumann en Nash hun modellen hebben gebouwd.

## Waarom schaken een bijna perfect wiskundig object is

Vier eigenschappen maken schaken tot een zeldzaam object in de speltheorie. Ze lijken vanzelfsprekend. Dat zijn ze niet.

**Twee spelers, klaar.** Geen allianties, geen coalities, geen derde partijen. Wit tegen Zwart, wat de één wint verliest de ander precies.

**Nulsomspel.** Geen uitkomst waarbij jullie allebei winnen. Geen waarbij jullie allebei verliezen. Remise is een strikte verdeling, geen compromis. Deze eigenschap maakt schaken analyseerbaar: het is een *nulsomspel met twee spelers*, de eenvoudigste klasse in de speltheorie.

**Perfecte informatie.** Bij poker zie je de kaarten van de tegenstander niet. Bij backgammon gooi je met dobbelstenen. Bij schaken staat *alles* op het bord. Op elk moment hebben beide spelers toegang tot exact dezelfde informatie. Geen verborgen element, geen toeval.

**Eindig.** Het aantal legale partijen is Shannons schatting: $10^{120}$. Astronomisch groot, groter dan het aantal atomen in het waarneembare heelal. Maar **eindig**. En het is precies deze eindigheid die de volgende stelling mogelijk maakt.

## De 110 jaar oude stelling die zegt dat een schaakpartij al een resultaat heeft

In 1913 bewees wiskundige [Ernst Zermelo](https://nl.wikipedia.org/wiki/Ernst_Zermelo) een resultaat dat je moet duizelen. (De stelling, de reikwijdte ervan, de beperkingen en de combinatorische subtiliteit worden uitgewerkt in het speciale artikel over [de paradox van Zermelo](/nl/blog/paradoxe-de-zermelo/).)

In elk spel met twee spelers, met perfecte informatie, zonder toeval, en eindig, is *noodzakelijkerwijs* één van de drie stellingen waar:
1. De eerste speler heeft een winnende strategie.
2. De tweede speler heeft een winnende strategie.
3. Beide kunnen remise afdwingen.

Toegepast op schaken: er bestaat **nu al** een waarheid van de beginpositie. Wit wint bij perfect spel, of Zwart wint, of de partij is remise bij perfect spel.

Niemand weet welke. Niemand zal het waarschijnlijk ooit weten: je zou $10^{120}$ partijen moeten verkennen. Maar **het antwoord bestaat**. Het is gegraveerd in de structuur van het spel zelf, onafhankelijk van wie er speelt.

De meerderheidsopvatting van experts is dat het remise is. Maar dat is een overtuiging, geen stelling.

## Minimax: wat je brein al uitvoert, zonder het te weten

Als je nadenkt over een zet, doe je iets als: *"Als ik het paard hier speel, slaat hij. Als ik terugslaa, heeft hij Df3, dat dreigt... nee, ik heb Te1 ertussen."*

Wat je net deed heeft een naam: het **minimax**-algoritme. En je hebt het geleerd zonder dat iemand het je heeft bijgebracht, omdat het de enige logische manier is om te redeneren tegen een intelligente tegenstander.

Het idee past in twee zinnen. Je zoekt de zet die je het **best mogelijke resultaat** geeft, ervan uitgaande dat je tegenstander systematisch het antwoord kiest dat jou het **slechtste mogelijke resultaat** geeft.

Voor de formule: stel je twee spelers voor die een lamp aan elkaar doorgeven. Wie de lamp vasthoudt, kiest in een kamer welke lamp hij aanzet: de helderste voor zijn team en de minst heldere voor het tegenovergestelde team. Maximaliseer voor jezelf, minimaliseer voor de ander, elke beurt. Dat is alles.

Als je $v(p)$ noteert voor de waarde van een positie $p$ voor Wit:

$$v(p) = \max_{c \in C(p)} v(\text{resultaat}(p, c)) \quad \text{als het de beurt van Wit is}$$
$$v(p) = \min_{c \in C(p)} v(\text{resultaat}(p, c)) \quad \text{als het de beurt van Zwart is}$$

$C(p)$ is de verzameling legale zetten in positie $p$.

Wat deze formule je bespaart opnieuw te berekenen: op elke diepte gaat ze ervan uit dat de tegenstander *zijn* beste zet speelt, wat je bespaart zijn waarschijnlijke fouten in te beelden (die berekening zouden kosten zonder veiligheidswinst).

Precies dit voeren Stockfish, Leela en alle moderne motoren uit. Het verschil met jou: zij doen het op miljoenen knooppunten per seconde, terwijl jouw brein er misschien drie of vier verwerkt. De details van het algoritme, zijn verfijningen (transpositietabellen, *iterative deepening*) en zijn moderne neurale-netwerkversie worden behandeld in het artikel [minimax bij schaken](/nl/blog/minimax-aux-echecs/).

### Waarom een motor niet $35^{10}$ posities verkent

Een probleem: de combinatorische groei is exponentieel. Bij elke zet gemiddeld 35 legale zetten. Op diepte 10 is dat $35^{10}$ ≈ 2.700 biljoen posities. Onbereikbaar zelfs voor de beste supercomputer.

De truc die alles redt: **alfa-bèta-snoei**. Het principe is helder.

Stel dat je al een variant hebt gevonden die je een voordeel garandeert. Als je bij het verkennen van een andere tak ontdekt dat de tegenstander je onder dat referentiepunt kan brengen, **heeft het geen zin de rest van de tak te verkennen**. Je weet al dat hij slecht is. Je knipt.

Snoei maakt van $35^d$ een $35^{d/2}$: met andere woorden, het **verdubbelt de bereikbare diepte** met hetzelfde rekenbudget. Dat is de technische reden waarom een motor uit 1997 (Deep Blue) Kasparov al kon verslaan.

## Nash, of waarom 1.e4 e5 2.Pf3 Pc6 3.Lb5 al 200 jaar overleeft

John Nash heeft minimax gegeneraliseerd naar spellen waar meerdere evenwichten naast elkaar bestaan. Het **Nash-evenwicht** is een toestand waarbij geen enkele speler er belang bij heeft zijn strategie **eenzijdig** te wijzigen, op voorwaarde dat de ander de zijne behoudt.

> **Snelle definitie: Nash-evenwicht.** Stelt je twee bedrijven voor die hun prijzen vaststellen. Als het ene bedrijf verlaagt, wint het klanten maar verliest het marges. Het andere volgt. Beiden belanden bij een prijs waar geen van beiden er belang bij heeft als eerste te bewegen. Dat is een Nash-evenwicht: niet het collectieve optimum, maar een punt waarop niemand iets wint door alleen af te wijken.

Bij schaken vertaalt dit zich naar de openingen.

Als men zegt dat een variant *"theoretisch gelijk"* is, betekent dat precies dit: beide partijen hebben middelen die het evenwicht handhaven, en de eerste die eenzijdig afwijkt, riskeert bestraft te worden. Dat is waarom de Spaanse opening (1.e4 e5 2.Pf3 Pc6 3.Lb5) eeuwen overleeft: het is een stabiel evenwicht dat niemand heeft weten te doorbreken.

Onder perfect spel van beide kanten zou *de hele partij* één gigantisch Nash-evenwicht zijn. En als de waarheid van het schaken remise is, dan is dat evenwicht remise. De volledige kartering van deze evenwichten in de huidige openingen is het onderwerp van [Nash-grafen en het evenwicht van openingen](/nl/blog/graphes-de-nash-equilibre-ouvertures/); een enkel repertoire kan meerdere evenwichten bevatten, en de keuze daartussen maakt al deel uit van het meta-spel.

### Dominante strategieën en gedomineerde strategieën

Een verwant concept, vaak verward met Nash: de **dominante strategie**. Een zet is *dominant* als hij beter is dan zijn alternatieven ongeacht het antwoord van de tegenstander. Een zet is *gedomineerd* als een andere optie strikt beter is ongeacht wat de ander speelt. Bij schaken zijn pure dominante strategieën zeldzaam (bijna elke stelling biedt een afweging), maar **gedomineerde** strategieën zijn frequent: een zet die materiaal verliest zonder compensatie is gedomineerd door bijna elke andere legale zet. Dit is de wiskundige basis van wat trainers "de absurde zetten elimineren" noemen vóór het berekenen.

Dominantie-analyse is wat je brein gebruikt om *niet* elke lijn te berekenen: je verwerpt 30 van de 35 legale zetten in minder dan een seconde omdat ze gedomineerd zijn. Je analyseert serieus alleen de 3 tot 5 resterende.

## Perfecte informatie bestaat eigenlijk niet (en dat is wat het spel speelbaar maakt)

Handboeken zeggen dat schaken een spel is met *perfecte informatie*. Technisch juist. Praktisch onjuist.

De ontbrekende informatie is niet op het bord. Ze zit in de schedel van je tegenstander.

Je weet niet hoe diep hij heeft berekend. Je weet niet of hij de variant kent die je gisteravond hebt voorbereid. Je weet niet of zijn ogenschijnlijke kalmte een stelling verbergt die hij als verloren ziet, of een verwoestende combinatie die hij wacht op zet 27 te laten vallen.

Deze subjectieve asymmetrie maakt schaken in de praktijk tot een spel met onvolmaakte informatie. Dat is waar de [psychologie van de schaakspeler](/nl/blog/psychologie-du-joueur-d-echecs/) om de hoek komt kijken. Dat is waar de pure speltheorie stopt het menselijk gedrag correct te voorspellen.

## De Bobby Fischer-paradox: waarom de meest voorspelbare speler van de 20e eeuw won

De speltheorie zegt: diversifieer je openingen, anders word je voorspelbaar en word je voorbereid. Dat heet een **gemengde strategie**: meerdere lijnen spelen met gevarieerde kansen in plaats van altijd dezelfde.

Bobby Fischer speelde **1.e4** in bijna al zijn partijen.

Pure strategie, volledige voorspelbaarheid, ogenschijnlijke schending van het principe van de gemengde strategie. En toch domineerde hij. Waarom?

Omdat zijn voorbereiding in de lijnen van 1.e4 zo diep was dat hij *de voorkeur gaf aan vertrouwde posities*, zelfs verwachte, boven het verrassen in posities die hij minder goed beheerste. Zijn pure strategie domineerde elke gemengde strategie van een minder voorbereide tegenstander. Dit is een volledig speltheoretisch resultaat: wanneer het voorbereidingsverschil groot genoeg is, wordt voorspelbaarheid een voordeel.

Jij, met 1500 Elo, bent geen Fischer. Diversifieer je openingen.

## Waarom Magnus Carlsen bijna nooit een geïsoleerde partij speelt

Toernooi-schaken is een *herhaald spel*: je zult dezelfde tegenstanders over meerdere jaren tegenkomen, tientallen keren. En de theorie van herhaalde spellen zegt dat in dat kader **reputatie** een strategisch bezit op zich wordt.

Bekend om je aanvalslust? Je tegenstanders komen gewapend met solide defensieve systemen, en je kunt ze vangen door op een gegeven dag rustig te spelen. Bekend om eindspeltechniek? Ze vermijden vereenvoudigingen, zodat het middenspel jouw terrein wordt.

Dit is de technische reden waarom Magnus Carlsen en zijn team honderden uren per match besteden aan het *voorbereiden van de specifieke tegenstander*. Ze zoeken niet de absolute beste zet. Ze zoeken de subtiele afwijking die de bekende paden van **deze** tegenstander **precies** verlaat, terwijl ze een theoretisch voordeel behouden.

Het is ook waarom WK-matchen vaak vreemde openingen produceren: dat zijn geen objectief betere zetten, dat zijn strategisch betere zetten *tegen deze persoon, op dit moment, gezien wat hij heeft voorbereid*.

In Nederland is dit mechanisme goed zichtbaar bij het KNSB-kampioenschap, waar spelers die elkaar kennen van tientallen partijen bewust afwijken van hun gebruikelijke repertoire om de bekende voorbereiding van de tegenstander te omzeilen.

## Wat de speltheorie opgeeft (en waarschijnlijk nooit terugkrijgt)

Ondanks haar kracht stuit de speltheorie op combinatorische complexiteit. "Schaken oplossen" (weten of Wit wint, Zwart wint, of het remise is bij perfect spel) vereist het verkennen van een boom met $10^{120}$ bladeren. Geen computer zal dat doen. Geen toekomstige klassieke computer ook niet, zonder fysieke revolutie.

Ter vergelijking:
- **Boter-kaas-en-eieren**: triviaal opgelost. Remise bij perfect spel.
- **Vier op een rij**: opgelost in 1988. De eerste speler wint.
- **Dammen**: opgelost in 2007 door Jonathan Schaeffer en zijn team (gepubliceerd in *Science*). Remise bij perfect spel, na 18 jaar berekening.
- **Nim**: analytisch opgelost (stelling van Sprague-Grundy).
- **Schaken**: blijft open. Voor zeer lange tijd.

Dit is geen beperking van de discipline. De theorie bevestigt dat het antwoord bestaat. Het is gewoon dat de benodigde rekenresources fysiek onbereikbaar zijn. (Voor de gedetailleerde uiteenzetting van deze praktische onmogelijkheid en de manier waarop AI deze muur omzeilt, zie [waarom schaken een bijna onmogelijk wiskundig probleem is](/nl/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/).)

## De les die in één zin past

Op 64 velden, net als bij een levensbeslissing, bestaat er geen *absolute* goede zet. Er bestaan goede zetten **ten opzichte van een model van de tegenstander**.

Dat model verbeteren (begrijpen hoe de ander denkt, wat hij heeft voorbereid, wat hij vreest) is wat de goede speler scheidt van de uitstekende.

Von Neumann heeft de speltheorie niet uitgevonden voor schaken. Hij heeft ze uitgevonden om de Koude Oorlog te modelleren. Maar beide objecten hebben hetzelfde skelet: twee rationele actoren, onderling afhankelijke beslissingen, een uitkomst die afhangt van wat elk *gelooft* dat de ander gaat doen.

**Na het lezen:** schrijf vóór je volgende lange partij één zin over **de hypothese over de bedoelingen** die je maakt over de tegenstander (aanvalsspeler, vermijdt complicaties, speelt snel in blitz, enz.); confronteer die achteraf met de werkelijke partij.

---

## Veelgestelde vragen

### Is schaken een nulsomspel in de strikte zin?

Ja, wiskundig gezien. De som van de opbrengsten (1 voor een overwinning, 0 voor een verlies) is constant ongeacht het resultaat: de overwinning van de één is precies het verlies van de ander, remise wordt 0,5-0,5 gedeeld. Het is juist deze eigenschap die minimax zonder complicaties toepasbaar maakt. "Matchen" (reeksen partijen met tactische bonussen) zijn niet meer strikt nulsomspelen, en dat is precies waar de theorie van herhaalde spellen interessant wordt.

### Wat is het verschil tussen minimax en Nash-evenwicht bij schaken?

Minimax is een **berekeningstechniek**: het zegt hoe je de beste zet vindt door ervan uit te gaan dat de tegenstander optimaal speelt. Het Nash-evenwicht is een **toestand van het systeem**: een configuratie waarbij geen speler er belang bij heeft om alleen af te wijken. In een nulsomspel met twee spelers zoals schaken *valt* de minimax-oplossing *samen* met het Nash-evenwicht (stelling van von Neumann, 1928). Bij complexere spellen (niet-nulsom, meer dan twee spelers) lopen de twee concepten uiteen.

### Bestaat er een dominante strategie bij de eerste zet?

Empirisch gezien **nee**. Statistieken over tientallen miljoenen toppartijen geven 1.e4, 1.d4, 1.c4 en 1.Pf3 als speelbaar met een vergelijkbaar voordeel voor Wit (~54-56% score). Geen ervan *domineert* de anderen in de strikte zin. Dit suggereert ofwel dat de "waarheid" van het schaken meerdere evenwichten bij zet 1 toelaat, ofwel dat de menselijke en machinale rekeningshorizon ze nog niet kan onderscheiden.

### Waarom spreekt men van "gemengde strategieën" als je altijd de beste zet speelt?

Omdat "de beste zet" afhangt van je model van de tegenstander. Als je systematisch 1.e4 speelt, geef je de tegenstander perfecte informatie over je voorbereiding: hij kan al zijn studietijd in jouw lijnen investeren. Diversifiëren (40% 1.e4, 40% 1.d4, 20% 1.Pf3) verdunt zijn voorbereidingsinspanning. Boven een bepaald niveau wordt de gemengde strategie een defensieve investering in informatie.

### Kan de speltheorie voorspellen wie een partij wint?

Nee, en dat is belangrijk. Ze zegt dat **onder perfect spel** het resultaat bepaald is. Maar perfect spel bestaat noch bij de mens (cognitieve beperkingen) noch bij de machine (rekenbeperkingen voorbij eindspelen met 7 stukken). De theorie voorspelt *asymptotische evenwichten* (de Spaanse opening stabiel gedurende 200 jaar), niet *individuele uitkomsten*. Daarvoor moet je krachtsverschil, voorbereiding, vermoeidheid en het tijdstip van de partij modelleren, en dan maakt de speltheorie plaats voor statistiek en psychologie.

---

## Kernpunten

- Schaken is een eindig, nulsomspel met twee spelers en perfecte informatie, dus analyseerbaar via Zermelo (1913).
- Een "waarheid" van het spel bestaat al (Wit wint, Zwart wint, of remise bij perfect spel), maar $10^{120}$ partijen maken haar onbereikbaar.
- Minimax = maximaliseer voor jezelf ervan uitgaande dat de ander minimaliseert voor jou. Dat is wat je brein doet zonder het te weten.
- Alfa-bèta-snoei verdubbelt de bereikbare diepte: de reden waarom Deep Blue Kasparov versloeg in 1997.
- Het Nash-evenwicht verklaart waarom bepaalde openingen (de Spaanse opening) eeuwen overleven: niemand heeft er belang bij alleen af te wijken.
- **Eliminatie van gedomineerde strategieën** is wat je in staat stelt slechts 3-5 van de 35 zetten te berekenen: je verwerpt intuïtief wat strikt slechter is.
- In de praktijk is informatie nooit perfect: de onzekerheid zit in het hoofd van de tegenstander, niet op het bord. Dat is waar psychologie de wiskunde vervangt.

### Bronnen en referenties

- **von Neumann, J., & Morgenstern, O.** *Theory of Games and Economic Behavior.* Princeton University Press, 1944. (De grondleggende tekst van de moderne speltheorie.)
- **Nash, J.** [*Non-Cooperative Games.*](https://www.jstor.org/stable/1969529) Annals of Mathematics, 54(2), 286-295, 1951. (De formele introductie van het Nash-evenwicht.)
- **Zermelo, E.** *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels.* Proceedings of the Fifth International Congress of Mathematicians, 1913. (De grondleggende stelling over de oplosbaarheid van eindige spellen.)
- **Schaeffer, J., et al.** [*Checkers Is Solved.*](https://www.science.org/doi/10.1126/science.1144079) Science, 317(5844), 1518-1522, 2007. (De volledige oplossing van het damspel door de computer.)
- **Shannon, C. E.** *Programming a Computer for Playing Chess.* Philosophical Magazine, Series 7, 41(314), 1950. (De schatting van het aantal mogelijke schaakpartijen.)
