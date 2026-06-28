---
title: "Waarom schaken een (bijna) onoplosbaar wiskundig probleem is - en hoe AI het toch aanpakt"
frSlug: "pourquoi-echecs-probleme-mathematique-impossible-et-ia"
excerpt: "De zettenboom explodeert, het getal van Shannon geeft duizeling, en toch corrigeert een motor je in seconden. Is schaken werkelijk 'onoplosbaar'? Hier is wat wiskunde, informatica en AI werkelijk doen onder de motorkap."
seoTitle: "Schaken en AI: het wiskundig onmogelijke oplossen | Blog van een Linkshandige"
seoDescription: "Is schaken wiskundig oplosbaar? Ontdek hoe AI het spel revolutioneerde en waarom motoren nu mensen verslaan bij elke gelegenheid."
publishDate: "2026-04-09"
category: "science"
tags: ["échecs", "mathématiques", "complexité", "EXPTIME", "nombre de Shannon", "arbre des coups", "minimax", "alpha-bêta", "moteur d'échecs", "IA", "Stockfish"]
draft: false
faq:
  - question: "Zal schaken ooit 'opgelost' worden?"
    answer: "In de sterke zin (resultaat bewezen vanuit de beginpositie, zoals dammen sinds 2007), <strong>waarschijnlijk nooit</strong>. De grens van $10^{120}$ plus het EXPTIME-complete resultaat maken brute-kracht-oplossing fysiek onbereikbaar. Een <strong>indirect bewijs</strong> (symmetrie, invariant, gedeeltelijke spiegelstrategie) blijft theoretisch mogelijk maar er bestaat geen serieus pad. Kwantumcomputing verandert de grens door de exponent te halveren, maar $10^{60}$ is nog steeds astronomisch."
  - question: "Wat is het verschil tussen 'oplossen' en 'mensen verslaan'?"
    answer: "'Oplossen' betekent het exacte wiskundige resultaat bewijzen onder perfect spel. 'Mensen verslaan' betekent gemiddeld dichter bij de optimale strategie zijn dan een menselijk brein. Stockfish verslaat elke mens op circa 3500 Elo zonder ooit op te lossen. Omgekeerd zou een programma dat schaken oplost per definitie elke tegenstander verslaan, maar dat programma bestaat dus niet."
  - question: "Waarom 'versloeg' AlphaZero Stockfish als beiden benaderingen zijn?"
    answer: "Omdat op dat moment AlphaZero's neurale netwerk plus MCTS-benadering dichter bij de Zermelo-waarheid zat dan Stockfish's alpha-bèta plus handmatige evaluatie (versie 8 destijds). Sinds 2020 heeft Stockfish NNUE (Efficiently Updatable Neural Network) geïntegreerd en domineert opnieuw. Hardware-vooruitgang en verfijning van neurale netwerken verschuiven de leider voortdurend."
  - question: "Is het getal van Shannon een exacte maat?"
    answer: "Nee. Het is een <strong>grootteorde-schatting</strong> van mogelijke partijen (ongeveer $10^{120}$), niet van afzonderlijke legale stellingen (ongeveer $10^{43}$ volgens recentere schattingen, nog steeds betwist). De verwarring tussen beide is zeer gangbaar maar belangrijk: het aantal legale stellingen meet de toestandsruimte, het aantal partijen meet de trajectruimte."
  - question: "Als een mens niet alles kan berekenen, waarom dan nog progressie?"
    answer: "Om twee redenen: (1) je <strong>interne evaluatiefunctie</strong> verbeteren (positioneel gevoel), (2) je <strong>intuïtieve snoei</strong> verbeteren (slechte kandidaten snel verwerpen). Dat is precies de motorstrategie. Het verschil tussen een 1200- en een 2000-speler is niet de berekende ruwe snelheid maar de kwaliteit van de evaluatiefunctie en de efficiëntie van de snoei. Dat is het menselijke pad: niet meer zoeken, maar beter zoeken."
---

Je hebt deze paradox vast al ervaren: mensen verkopen je [schaken](https://nl.wikipedia.org/wiki/Schaken) als kosmisch complex, een spel waarbij elke speler lange termijnstrategie uitstippelt; dan open je een app, speelt een redelijke zet, en de motor corrigeert je en legt een lijn uit die je nooit alleen had kunnen vinden.

Dus wat is het? Kan alles echt herleid worden tot formules? Is dit spel een wiskundig probleem dat wiskunde en informatica slechts gedeeltelijk beantwoorden, of een verhaal dat we onszelf vertellen om diepzinnig te klinken? Het antwoord heeft twee delen: dit vakgebied kan niet door brute kracht over de gehele ruimte van partijen worden aangepakt, maar het wordt speelbaar op bovenmenselijk niveau zodra je accepteert de werkelijkheid te meten met programma's die zoeken, evaluatie, snoei en tegenwoordig leren combineren op zeer krachtige machines.

De waarheid is interessanter dan de mythe: geen eindige lijst van zetten "sluit" het spel af als een verzegelde formele verklaring, toch verslaan programma's regelmatig de sterkste menselijke spelers omdat ze geen absolute perfectie nastreven, slechts een goede genoege beslissing tegen een echte tegenstander.

## Het bord van binnen: een toestandsgraph, geen chaos

Voor een wiskundige of informaticus biedt [schaken](https://nl.wikipedia.org/wiki/Schaken) een zeldzame kwaliteit: de regels zijn exact, openbaar, en het spel is deterministisch. Een [paard](https://nl.wikipedia.org/wiki/Paard_(schaakstuk)) beweegt altijd in een L-vorm, een loper blijft op zijn kleur: elke legale zet in dit schaakspel is reproduceerbaar, zonder willekeurige regelverrassingen, ook al kan het tegenover een onvoorspelbare mens onzeker aanvoelen.

- een complete stelling (stukken, beurt, rokaderechten, en passant...) = een spelerstoestand;
- een legale zet = een overgang naar een andere toestand;
- een partij = een traject, een opeenvolging van toestanden in een gigantische ruimte.

Als je wat formeler wil, kun je het zien als een [gerichte graaf](https://nl.wikipedia.org/wiki/Gerichte_graaf): elk knooppunt is een toestand, elke pijl is een legale zet; vanuit een vaste toestand kun je een zoekboom visualiseren waarbij spelers beurtelings vertakkingen nemen. Dat kader grenst aan de [speltheorie](https://nl.wikipedia.org/wiki/Speltheorie), een echte brug tussen wiskunde en informatica.

## De zettenboom: waarom "ik berekende alles" een mythe is

Op clubniveau heb je misschien een speler horen zeggen: "Ik berekende alles." Dat klinkt goed maar het is bijna nooit strikt waar: zelfs grootmeesters en kampioenen doorlopen geen complete fractie van de boom; van clubspeler tot grootmeester schamen we alleen de takken. Ze berekenen een klein deel, en dat doen ze goed.

Men duidt vaak $b$ aan als het gemiddelde aantal legale zetten (vertakkingsfactor), $d$ als de zoekdiepte in halve zetten (*plies*), en $N(b,d)$ als het benaderende aantal te verkennen knopen; een naïeve benadering geeft $N(b,d) \approx b^d$. Zodra de diepte groeit voeg je niet "een beetje" werk toe: je vermenigvuldigt werk; dat is een wet van de wiskunde: de exponentiële. Ze verklaart waarom zelfs de snelste machines begrensd blijven door beschikbare tijd en geheugen, zelfs met de beste bekende algoritmen.

$$
N(b,d) \approx b^d
$$

In het middenspel ligt $b$ vaak rond 30 tot 40. Als je $b=35$ neemt, dan is bij $d=6$ het al enorm, bij $d=10$ astronomisch, bij $d=16$ een andere planeet. Het menselijk brein is niet gebouwd om miljoenen takken te doorlopen: het is gebouwd om te overleven, patronen te herkennen, energie te besparen, en dat is goed nieuws want moderne motoren doen hetzelfde, waarbij ze algoritme en heuristiek combineren.

Om deze explosie in te tomen is er geen magie: je moet snoeien, schatten, zetten ordenen; methoden die dit artikel verderop uitpakt.

## Het getal van Shannon: de "wauw" die geen trucje is

[Claude Shannon](https://nl.wikipedia.org/wiki/Claude_Shannon), professor aan [MIT](https://nl.wikipedia.org/wiki/Massachusetts_Institute_of_Technology) en vader van de [informatietheorie](https://nl.wikipedia.org/wiki/Informatietheorie), stelde een wiskundige vraag in het midden van de twintigste eeuw: hoeveel schaakpartijen zijn er mogelijk? Zijn beroemde schatting belandt rond $10^{120}$, het [getal van Shannon](https://en.wikipedia.org/wiki/Shannon_number). Opgelet: dit getal is geen eeuwige waarheid in steen gehouwen; het is een grootteorde-greep, geen uitputtende lijst van bereikbare configuraties. Wat het fascinerend maakt is dat de onmogelijkheid niet voortkomt uit een technisch detail maar uit een diepe wet: de ruimte van mogelijkheden is zo uitgestrekt dat "alles verkennen" buiten bereik blijft zelfs voor de meest geavanceerde algoritmen.

## Waarom dit spel niet "opgelost" is (en waarom dat je niet belet te winnen)

Een spel is "[opgelost](https://en.wikipedia.org/wiki/Solved_game)" in wiskundige zin wanneer je vanuit de beginpositie de uitkomst van perfect spel kent (winst, verlies, remise) en/of een optimale strategie bezit. De [speltheorie](https://nl.wikipedia.org/wiki/Speltheorie), geërfd van [John von Neumann](https://nl.wikipedia.org/wiki/John_von_Neumann), geeft instrumenten om te spreken over rationele spelers en [Nash-evenwicht](https://nl.wikipedia.org/wiki/Nash-evenwicht); hier is de structuur voornamelijk een duel met bijna perfecte informatie.

De volgende tabel vat het verschil samen tussen een paar beroemde spellen en schaken.

| Spel | Opgelost? | Korte opmerking |
| --- | --- | --- |
| [Boter-kaas-en-eieren](https://nl.wikipedia.org/wiki/Boter-kaas-en-eieren) | Ja | Kleine ruimte: optimale strategie bekend |
| [Dammen](https://nl.wikipedia.org/wiki/Dammen) | Ja | Perfect spel is remise; massaal computerbewijs |
| **Schaken** | Nee | Ruimte te groot; geen volledig bewijs van uitkomst |
| [Go](https://nl.wikipedia.org/wiki/Go_(bordspel)) | Gedeeltelijk verkend | AI ([AlphaGo](https://nl.wikipedia.org/wiki/AlphaGo)) verschoof het debat |

Een veelvoorkomende verwarring: "Als het niet opgelost is, kan een motor er niet zeker van zijn." Dat is formeel waar, maar het is niet het doel. In werkelijk gebruik hoeft een motor de beginpositie niet op te lossen om je te verslaan: hij moet dicht genoeg bij optimaal spelen in werkelijke situaties.

Een spel oplossen en het heel goed spelen zijn niet hetzelfde. Je kunt onklopbaar zijn voor de grote meerderheid van spelers zonder een volledig formeel bewijs van de perfect-spel-uitkomst. Machines imponeren omdat ze uitblinken in zoeken en evalueren, niet in het "afsluiten" van het spel door uitputtend bewijs.

## Wat een "klassieke" motor doet: minimax, maar niet naïef

Traditionele motoren (zoals [Stockfish](https://nl.wikipedia.org/wiki/Stockfish)) bestaan uit drie blokken:

- zoeken: de zettenboom doorlopen;
- evalueren: schatten wie beter staat op het diagram;
- optimalisaties: voorkomen dat je verdrinkt in takken.

Het idee achter [minimax](https://nl.wikipedia.org/wiki/Minimax) is bijna filosofisch: je probeert je voordeel te maximaliseren; je tegenstander probeert je voordeel te minimaliseren; je kiest de zet die het gegarandeerde minimum tegen de beste verdediging maximaliseert. Een sterk vereenvoudigde versie ziet eruit als recursie op de knopen van de graaf:

$$
f(x) = \max_{z \in Z} \min_{r \in R} f(x_{z,r})
$$

In clubtermen: minimax betekent "ik speel geen zet die alleen werkt als de tegenstander slaapt." Het is een heldere logica van rationele voorzichtigheid, geen garantie tegen tilt, maar een worst-case-model.

Rauwe minimax alleen verkent een veel te grote boom: zonder optimalisatie sterf je voordat je klaar bent met denken; het goede nieuws is dat een enorm deel van de boom nutteloos is als je weet hoe je kan snoeien zonder spijt.

## Alfa-bèta: de kunst van snoeien zonder spijt

[Alfa-bèta-snoei](https://nl.wikipedia.org/wiki/Alfa-bètasnoei) optimaliseert het minimax-doorlopen: het doel is niet een andere waarheid te vinden maar te voorkomen dat je berekent wat de beslissing toch niet meer kan veranderen. **Alfa** is de beste waarde die al gegarandeerd is voor de maximaliserende speler; bèta is de beste waarde al gegarandeerd voor de minimaliserende speler; als een tak nooit kan verbeteren wat je elders al gevonden hebt, snij je hem af.

Het is hetzelfde gebaar als wanneer je tactiek berekent: je verkent een lijn, ziet dat zelfs als alles werkt je een ander plan niet overtreft, dus je blijft er niet bij hangen. De consequentie is enorm: met goede zetordening kan alfa-bèta de verkende knopen drastisch verminderen; de motor wint "gratis" diepte voor wat op het scherm verschijnt.

## Evaluatie: het echte hart, want niet alles kan berekend worden

Zelfs met alfa-bèta kun je het einde van de boom niet bereiken: je treft bladeren op beperkte diepte en moet een vraag beantwoorden die op magie lijkt: "wat is deze configuratie waard?" Klassieke motoren gebruiken evaluatiefuncties opgebouwd uit criteria zoals:

- materiaal;
- pionnenstructuur;
- stukactiviteit;
- koningsveiligheid;
- veldcontrole (en veel meer in topmotoren).

Het is geen naïeve puntenoptelling: sterke motoren combineren heuristieken, aanpassingen en geoptimaliseerde parameters om evaluatie te correleren met eindresultaten zonder die resultaten te bereiken. In de praktijk is het als een stelling "veelbelovend" beoordelen zonder mat in achtentwintig zetten te berekenen: je herkent een schema waarbij initiatief en het loperpaar "goed aanvoelen", ook al is geen enkele lijn volledig bewijs. De motor formaliseert die vakkennis onvermoeibaar voor duizenden spelers.

## AI: leren evalueren en kiezen in plaats van alles handmatig te schrijven

De afgelopen jaren heeft een idee enorm aan populariteit gewonnen: in plaats van handmatig gecodeerde geavanceerde evaluatie, kun je evaluatie *leren* uit gegevens of zelfspeelpartijen. [Neurale netwerken](https://nl.wikipedia.org/wiki/Kunstmatig_neuraal_netwerk) en [machinaal leren](https://nl.wikipedia.org/wiki/Machinaal_leren) staan centraal in deze golf. Mensen verwarren "AI" vaak met "het berekent meer": in werkelijkheid blinkt moderne AI hoofdzakelijk uit op twee taken:

- een stelling rijkelijk evalueren (gecomprimeerde representatie);
- goede kandidaatzetten voorstellen om het zoeken te sturen.

Resultaat: de motor hoeft niet "alles" te verkennen: hij verkent beter. Je kunt het zien als geïndustrialiseerd sterke-speler-gedrag: ze kijken niet naar vijfendertig willekeurige zetten; ze kiezen een paar "serieuze", dan berekenen ze. AI doet hetzelfde met coherentie en trainingsdiepte voorbij intuïtie.

Het spectaculaire aan bepaalde benaderingen is zelfspeelpartijen: een machine speelt tegen zichzelf, leert van stellingen die ze genereert, verbetert evaluaties, herhaalt. Het is geen wonder; het is een eenvoudige lus:

1. ervaring genereren;
2. leren voorspellen wat leidt naar goede resultaten;
3. winnende keuzes versterken;
4. herhalen.

Wat fascinerend is: startend vanuit een spel met strikte regels kunnen strategische voorkeuren naar boven komen zonder ze regel voor regel te schrijven.

## IBM versus Kasparov: een historische dag voor software (zonder het spel op te lossen)

In 1997 versloeg [Deep Blue](https://nl.wikipedia.org/wiki/Deep_Blue) [Garry Kasparov](https://nl.wikipedia.org/wiki/Garri_Kasparov), destijds [wereldkampioen schaken](https://nl.wikipedia.org/wiki/Wereldkampioen_schaken), tegen een [IBM](https://nl.wikipedia.org/wiki/IBM)-machine die speciaal voor schaken gebouwd was. Dat succes markeert zijn tijdperk: de wereld ontdekte de kracht van gespecialiseerde computing.

Toch lost dat succes schaken niet op in theoretische zin: je kunt partijen winnen van de sterkste mens zonder een perfecte strategie te bezitten vanuit de beginpositie. Programmeurs vandaag, in Nederland en wereldwijd, halen veel meer uit het spel dan in 1997 zonder het onderliggende wiskundige substraat af te schaffen.

## Strategische modellen en wiskunde: wat spelwetenschap bijdraagt

[Speltheorie](https://nl.wikipedia.org/wiki/Speltheorie) verbindt schaken, via wiskunde, met een hele familie van modellen waarbij spelers handelingen kiezen als reactie op anderen. Het formalisme doorkruist economie, beslissingsondersteuning en geautomatiseerde berekening.

Voor een clubspeler is de conclusie simpel: je navigeert in een spel waarbij puur toeval laag is maar onzekerheid over keuzes van de tegenstander reëel is, een structuur dicht bij duels bestudeerd door spelwetenschap, ook al behoudt het spel zijn eigen karakter.

**Bewijspogingen.** De gemeenschap heeft massa's werk gepubliceerd over deelproblemen (eindspelen, openingen, tablebases), maar geen enkel bewijs stelt de perfect-spel-uitkomst vast vanuit de beginpositie: de ruimte van partijen weerstaat uitputtende verkenning.

Noties van [beslisbaarheid](https://nl.wikipedia.org/wiki/Beslisbaarheid) en [computationele complexiteit](https://nl.wikipedia.org/wiki/Complexiteitstheorie_(informatica)) verklaren waarom "alles testen" onrealistisch is. Die grens verarmt het spel niet: ze mengt strengheid en intuïtie.

## "Onmogelijk" betekent niet "onbruikbaar": de les voorbij het bord

Schaken is een uitstekend mentaal model voor moderne problemen, bijvoorbeeld:

- [cyberbeveiliging](https://nl.wikipedia.org/wiki/Informatiebeveiliging) (aanval/verdediging);
- strategie (een tegenstander anticiperen);
- optimalisatie (waar machine-inspanning te investeren);
- beslissen als je niet alles tegelijk kunt weten.

De belangrijkste boodschap is niet "AI is magie": de kracht komt minder van het berekenen van alles dan van het berekenen van wat telt.

Op jouw niveau als speler is de les dezelfde: je kunt niet alles zien; je kunt leren beter te kiezen wat je bekijkt. Het bord vergroot wie je bent: als je overal controle zoekt gooit het dat je terug; als je accepteert te verbeteren zonder jezelf te definiëren via een enkel getal, kun je elke partij omzetten in een oefenterrein.

## Wat dit voor jou als speler betekent

**Probeer dit.** Als je wilt zien wat een motor doet op een stelling, open de analysewerkruimte van de site (Stockfish in de browser): diepte, score en variaties live.

Schaken is "onmogelijk" als je een brute oplossing voorstelt: alles verkennen, alles bewijzen, alles tegelijk oplossen. Het wordt "mogelijk" zodra je de werkelijkheid accepteert: je wint door te selecteren, evalueren en snoeien. Kracht is niet hoeveel zetten je berekent maar hoe goed je sorteert. Een lucide speler weet dat al.

**Voor verdere studie:** [chessprogramming.org](https://www.chessprogramming.org/Main_Page), [ICGA](https://www.icga.org/), [arXiv](https://arxiv.org/).
