---
title: "De stelling van Zermelo: de onvolmaaktheid van het perfecte spel"
frSlug: "paradoxe-de-zermelo"
excerpt: "Schaken heeft een wiskundige waarheid die niemand kent. Zermelo bewees het in 1913: het resultaat onder perfect spel staat van tevoren vast. Maar achter die theoretische zekerheid schuilt een fascinerend praktisch duizelen."
seoTitle: "De stelling van Zermelo bij schaken: bepaalde maar onbereikbare waarheid | Blog van een Linkshandige"
seoDescription: "Ernst Zermelo (1913) bewees dat schaken een resultaat heeft onder perfect spel: wit wint, zwart wint of remise. Waarom die zekerheid buiten bereik blijft."
publishDate: "2026-05-07"
category: "science"
tags: ["Zermelo", "échecs", "mathématiques", "théorie des jeux", "tablebases", "induction rétrograde", "König", "complexité", "logique"]
draft: false
faq:
  - question: "Bewijst de stelling van Zermelo dat wit wint?"
    answer: "Nee. Hij bewijst dat <strong>een</strong> antwoord bestaat onder drie mogelijkheden: winst voor wit, winst voor zwart, of remise. Hij zegt niet welke. De meerderheidshypothese is remise (consistent met het elitespel en de motorenanalyse rond +0,2/+0,3), maar dat is een overtuiging gebaseerd op observatie, geen bewijs."
  - question: "Waarom noemt men dit een 'paradox'?"
    answer: "In wiskundige zin is het er geen: het is een volkomen coherent resultaat. De 'paradox' is <strong>epistemisch</strong>: we weten dat er een uniek antwoord bestaat, maar we kunnen het in de praktijk niet kennen en ook niet in enige redelijke extrapolatie van rekencapaciteiten. Zelden zijn er proposities waarbij <em>zekerheid over bestaan</em> zo zuiver gescheiden is van <em>mogelijkheid van toegang</em>."
  - question: "Weerleggen tablebases de stelling van Zermelo niet?"
    answer: "Integendeel, ze <strong>bevestigen</strong> hem op een deelverzameling van het probleem. Voor elke stelling met 7 of minder stukken is de Zermelo-waarde exact bekend (winst, verlies of remise, en exacte diepte). Tablebases zijn het constructieve bewijs dat Zermelo's demonstratie niet leeg is: toegepast op een eindige, bereikbare hoeveelheid stellingen produceert het inderdaad een unieke berekenbare waarheid."
  - question: "Waarom kan AlphaZero Stockfish verslaan als beiden niet 'perfect' spelen?"
    answer: "Omdat geen van beiden perfect speelt in de zin van Zermelo. Beiden zijn <strong>benaderingen</strong> van de optimale strategie, gewoon met verschillende architecturen (zoeken plus heuristieken voor Stockfish, neuraal netwerk plus Monte Carlo Tree Search voor AlphaZero). Wanneer AlphaZero Stockfish verslaat, zijn zijn keuzes op dat benaderingsniveau gemiddeld dichter bij de Zermelo-waarheid. Maar geen van beiden bereikt die waarheid."
  - question: "Zou deze wiskundige waarheid ooit ontdekt kunnen worden?"
    answer: "Waarschijnlijk niet door pure brute kracht: de boom van $10^{120}$ is definitief fysiek onbereikbaar. Een <strong>indirect bewijs</strong> (via symmetrie, invariant, gedeeltelijke spiegelstrategie) blijft theoretisch mogelijk, maar er bestaat geen serieus pad. Kwantumcomputing verandert de grens (Grover halveert de exponent), maar $10^{60}$ is nog steeds astronomisch. Schaken oplossen in strikte zin is eerder een horizon dan een doel."
---

In 1913, op het vijfde Internationale Congres van Wiskundigen in Cambridge, presenteerde de Duitse wiskundige [Ernst Zermelo](https://nl.wikipedia.org/wiki/Ernst_Zermelo) een resultaat dat de manier waarop wiskundigen, en later informatici, over strategiespellen denken voorgoed zou veranderen. Zijn stelling is kort. De bewijsvoering is elegant. En de implicaties voor schaken zijn tegelijk gerustststellend en duizelingwekkend.

## Ernst Zermelo en de verzamelingsleer

Voor we over schaken spreken, is het goed te begrijpen wie Zermelo was. Hij staat voornamelijk bekend om zijn fundamentele bijdragen aan de verzamelingsleer, met name het [keuzeaxioma](https://nl.wikipedia.org/wiki/Keuzeaxioma) en de [Zermelo-Fraenkel-axioma's](https://nl.wikipedia.org/wiki/Axioma%27s_van_Zermelo-Fraenkel) die nog steeds de standaardgrondslagen van de wiskunde vormen.

In 1913 was zijn interesse in schaken niet toevallig. Wiskundigen van die tijd probeerden logisch redeneren te formaliseren in zo rigoureuze systemen als mogelijk. Perfecte informatieve spellen vormden ideaal terrein.

## De stelling van Zermelo: formulering en bewijs

De stelling van Zermelo is van toepassing op een klasse van spellen waartoe schaken behoort: spellen voor twee spelers met directe confrontatie, volledige informatie, geen kanscomponent, waarbij de spelers beurtelings spelen en die altijd eindigen in een eindig aantal zetten.

**Formulering:** In elk spel van dit type is noodzakelijkerwijs een van drie situaties waar: speler 1 heeft een winnende strategie, of speler 2 heeft een winnende strategie, of beide spelers kunnen remise forceren.

Het bewijs gebruikt **achterwaartse inductie** op de maximale mogelijke spellengte. Het is precies hetzelfde mechanisme als de moderne minimax-versie, 35 jaar eerder.

Stel je een eindspelstelling voor die bereikt is. Elke eindstelling is ofwel winst voor wit, winst voor zwart, of remise. Ga nu een zet terug. Als het witwit is, kan wit kiezen uit de bereikbare eindstellingen de meest gunstige voor zichzelf. Door recursief terug te gaan van alle eindstellingen naar de beginpositie, krijgt elke stelling in de spelenboom een bepaalde waarde.

De waarde van de beginpositie is daarmee vastgesteld. De eerste speler heeft ofwel een strategie om winst te forceren, of beide spelers kunnen remise forceren, of de tweede speler heeft een strategie om winst te forceren.

### Een verfijnd bewijs achteraf

Een historisch detail dat vaak vergeten wordt: de originele tekst van Zermelo uit 1913 bevat een **niet-triviale subtiliteit** over eindigheid. Zermelo neemt impliciet aan dat elk spel eindigt in een eindig aantal zetten, maar hij behandelt het geval niet correct waarbij de verliezende partij mat oneindig lang kan uitstellen. [Dénes König](https://nl.wikipedia.org/wiki/D%C3%A9nes_K%C5%91nig) (1927) en vervolgens [László Kalmár](https://en.wikipedia.org/wiki/L%C3%A1szl%C3%B3_Kalm%C3%A1r) (1928) voltooiden het bewijs met wat nu het lemma van König heet. Bij schaken is dit detail in de praktijk geregeld via de 50-zettenregel en de driemaalherhalingsregel.

### Waarom het paradoxaal is

De paradox van Zermelo is niet logisch. Het is een praktische paradox. De stelling garandeert dat het antwoord bestaat en uniek is. Maar ze zegt niet wat het is. En vooral zegt ze niet hoe je het kunt vinden.

Om de werkelijke waarde van de beginpositie van schaken te vinden, zou je de gehele spelenboom moeten doorlopen. Deze boom bevat naar schatting van Shannon zo'n $10^{120}$ bladeren. Ter vergelijking: de leeftijd van het universum is ongeveer $4 \times 10^{17}$ seconden, en het aantal atomen in het waarneembare universum is ongeveer $10^{80}$.

De volledige oplossing van schaken door uitputtende verkenning is **fysiek onmogelijk** met enige denkbare technologie.

## De onbekende waarheid van schaken

De grote vraag die de stelling van Zermelo openlaat: wat is de waarde van schaken onder perfect spel?

De meerderheid van grootmeesters en theoretici denkt dat het antwoord remise is. Het empirische argument is sterk: op het hoogste niveau zijn remises zeer frequent, en de beginpositie wordt beschouwd als licht voordelig voor wit maar niet genoeg om winst te forceren tegen optimale verdediging.

Maar dit is slechts intuïtie gebaseerd op observatie van menselijk spel. Het is geen bewijs. Het is wiskundig mogelijk dat wit een geforceerde winst heeft verborgen in diepten die geen mens ooit heeft verkend. Max Euwe, de Nederlandse wereldkampioen (1935-1937) en wiskundige, benadrukte in zijn geschriften altijd de kloof tussen wat berekend kan worden en wat theoretisch bepaald is.

## Opgeloste eindspelen: een venster op de waarheid

Als het volledig oplossen van schaken onmogelijk is, is er een domein waar volledige oplossing wel bereikt is: eindspelen met weinig stukken.

[Eindspeltabellen](https://nl.wikipedia.org/wiki/Tablebase) (tablebases) ontwikkeld door Ken Thompson en daarna Marc Bourzutschky en anderen hebben alle eindspelen tot en met zeven stukken opgelost. Dit monumentale werk heeft verrassende resultaten opgeleverd.

Het eindspel Dame+Toren tegen Dame+Toren werd lang als remise beschouwd. Tablebases onthulden dat in bepaalde configuraties een partij winst kan forceren in... 517 zetten. Geen mens, zelfs niet de beste grootmeester ter wereld, zou dit pad kunnen vinden door eigen redenering.

### Het DTM/DTZ-onderscheid: twee waarheden voor dezelfde stelling

Tablebases onderscheiden twee maten van "geforceerde winst": DTM (*Distance to Mate*, afstand tot mat) en DTZ (*Distance to Zero*, afstand tot de volgende pionzet of slagzet die de 50-zettenteller nulstelt). Hetzelfde winnende eindspel kan DTM = 517 en DTZ = 7 hebben. Dit dualisme illustreert iets dieps over Zermelo: de **wiskundige waarheid** van een stelling hangt af van het gekozen "winst"-criterium.

## De structurele onvolmaaktheid van de menselijke speler

De paradox van Zermelo onthult iets fundamenteels over de conditie van de menselijke speler. Ze spelen een spel waarvan de "perfectie" wiskundig bepaald maar fysiek onbereikbaar is.

Een menselijke speler, zelfs de beste ter wereld, speelt een benadering van de optimale strategie. Zijn speelniveau wordt bepaald door de kwaliteit van die benadering.

[Magnus Carlsen](https://nl.wikipedia.org/wiki/Magnus_Carlsen), door velen beschouwd als de beste speler in de geschiedenis, maakt nog steeds fouten. Stockfish, de beste schaakmotor momenteel, maakt ook fouten ten opzichte van theoretisch perfect spel.

Het verschil tussen Carlsen en Stockfish is niet kwalitatief (de een speelt perfect en de ander niet), maar kwantitatief (de een is een verfijndere benadering dan de ander).

## Perfect spel is niet ideaal spel

Een andere dimensie van de paradox van Zermelo is filosofisch. Zelfs als de perfecte strategie zwart op wit geschreven was, zou je die echt willen spelen?

Stel je voor dat wit een geforceerde winst heeft in 80 zetten vanuit de beginpositie. Die geforceerde winst spelen zou betekenen dat elke partij in werkelijkheid al voorbij is op zet 1. De tegenstander kan spelen wat hij wil, het resultaat zou hetzelfde zijn. Schaken als spel zou ophouden te bestaan.

Het feit dat schaken zo complex is dat geen perfecte strategie bekend is, is juist wat het levend houdt.

## Zermelo en de hiërarchie van opgeloste spelen

De informaticagemeenschap heeft geleidelijk complexere spelen opgelost. [Boter-kaas-en-eieren](https://nl.wikipedia.org/wiki/Boter-kaas-en-eieren) is remise onder perfect spel. [Vier op een rij](https://nl.wikipedia.org/wiki/Vier_op_een_rij) werd in 1988 opgelost: de eerste speler wint. [Dammen](https://nl.wikipedia.org/wiki/Dammen) werd in 2007 opgelost door [Jonathan Schaeffer](https://en.wikipedia.org/wiki/Jonathan_Schaeffer): remise onder perfect spel, na 18 jaar rekenen.

Schaken blijft open. Net als Go.

## Wat Zermelo verandert voor jou aan het bord

Als je weet dat schaken een onbereikbare wiskundige waarheid heeft, verandert dat iets voor de praktische speler? Niet direct aan het bord. Maar het verandert hoe je over het spel nadenkt.

Elke zet die je speelt is een benadering. Elke positiebeoordeling is een schatting. Elk plan dat je bouwt is een heuristiek. Er is geen zekerheid, zelfs niet voor de meest solide grootmeester.

Deze wiskundige bescheidenheid is gezond. Ze betekent dat zelfs tegenover een tegenstander die veel sterker is dan jij, ook hij de waarheid van de stelling niet kent.

## Bronnen

- Zermelo, E. (1913). Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels. *Proceedings of the Fifth International Congress of Mathematicians*.
- Schwalbe, U., & Walker, P. (2001). Zermelo and the early history of game theory. *Games and Economic Behavior*, 34(1), 123-137.
- Schaeffer, J., et al. (2007). Checkers is solved. *Science*, 317(5844), 1518-1522.
- Fraenkel, A. S., & Lichtenstein, D. (1981). Computing a perfect strategy for n×n chess. *Journal of Combinatorial Theory*.

## Kernpunten

- Zermelo bewijst dat in elk eindig tweespelers-volledige-informatiespel het resultaat onder perfect spel **van tevoren bepaald is**
- Voor schaken betekent dit dat ofwel wit wint, zwart wint, of de partij remise is onder perfect spel van beide kanten
- Niemand weet nog welke van deze drie mogelijkheden waar is; de meerderheidshypothese is **remise**
- De bewijsvoering werd verfijnd door **König (1927) en Kalmár (1928)** om eindigheid rigoureus te behandelen
- **Tablebases tot 7 stukken** zijn de constructieve bevestiging van de stelling op een bereikbare deelverzameling
- Deze paradox onthult dat "perfectie" in schaken een **wiskundig bepaald maar fysiek onbereikbaar** ideaal is
