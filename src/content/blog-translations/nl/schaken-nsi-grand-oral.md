---
title: "Grand oral specialisatie NSI: schaken als schoolvoorbeeld van algoritmiek en AI"
excerpt: >-
  Minimax in Python, beslisbomen, PGN-formaat, bitboard-representatie, AlphaZero en neurale netwerken: het volledige
  programma van de Franse informaticaspecialisatie NSI verbeeld in 64 velden, met methodologie, tijdschema, FAQ voor
  de jury en spiekbriefje.
frSlug: grand-oral-nsi-echecs
draft: false
faq:
  - question: "Waarom zijn schaken een ideaal onderwerp voor een Grand Oral in de specialisatie NSI?"
    answer: >-
      Schaken belichamen de vier pijlers van het NSI-programma: algoritmen (minimax, alpha-bèta, recursie),
      datastructuren (spelbomen, grafen), programmeren (representatie van het schaakbord in Python, recursieve
      functies) en kunstmatige intelligentie (van Stockfish naar AlphaZero). Het is een van de weinige onderwerpen
      waarmee je concreet de link tussen algoritmische theorie en een echte, bij de jury bekende toepassing kunt
      laten zien.
  - question: "Hoe codeer je een minimax in Python voor een Grand Oral NSI?"
    answer: >-
      De basisstructuur van minimax in Python is een recursieve functie: def minimax(pos, depth, is_max): if depth
      == 0: return evalueer(pos) ; zetten = genereer_zetten(pos) ; if is_max: return max(minimax(pas_toe(pos,z),
      depth-1, False) for z in zetten) ; else: return min(minimax(pas_toe(pos,z), depth-1, True) for z in zetten).
      Deze structuur toont recursie, boombeheer en functies van hogere orde uit het NSI-programma van het laatste
      schooljaar.
  - question: "Wat is het PGN-formaat en hoe gebruik je het in NSI?"
    answer: >-
      PGN (Portable Game Notation) is het standaardformaat voor het opslaan van schaakpartijen. Het is een
      gestructureerd tekstbestand: metadata tussen vierkante haken ([Event 'Testpartij'][Date '2026.04.28']) gevolgd
      door de lijst met zetten (1. e4 e5 2. Nf3 Nc6...). In NSI illustreert het het begrip gestructureerde
      dataformaten, te parsen in Python met reguliere expressies of een specifieke bibliotheek. Het kan ook worden
      opgeslagen en bevraagd in een SQL-database.
  - question: "Wat is een bitboard bij schaken en waarom is dat belangrijk voor NSI?"
    answer: >-
      Een bitboard geeft de status van een bepaald stuktype op het schaakbord weer met een geheel getal van 64 bits.
      Elk bit komt overeen met een veld: bit i is 1 als het stuk op veld i staat, anders 0. De witte pionnen in de
      beginstelling staan bijvoorbeeld op de velden 8 tot 15, oftewel het getal 0xFF00 in hexadecimaal. Bewerkingen
      op bitboards (EN, OF, bitverschuiving) zijn zeer snelle geheeltallige bewerkingen. Dit is een directe
      toepassing van het NSI-programma over binaire representatie en logische operatoren.
  - question: "Wat is het verschil tussen Stockfish en AlphaZero voor een Grand Oral NSI?"
    answer: >-
      Stockfish gebruikt een minimax-algoritme met alpha-bèta-snoeiing en een evaluatiefunctie die door menselijke
      experts is geprogrammeerd (symbolische, 'top-down'-aanpak). AlphaZero gebruikt een diep neuraal netwerk dat
      uitsluitend door zelflerend spel is getraind, zonder voorafgaande menselijke kennis (connectionistische,
      'bottom-up'-aanpak). Voor NSI is het kernverschil dat tussen expliciet programmeren (gecodeerde regels) en
      machinaal leren (regels die door ervaring worden ontdekt). AlphaZero versloeg Stockfish na minder dan 24 uur
      training in 2017.
  - question: "Welke vragen kan de jury stellen over schaken bij de specialisatie NSI?"
    answer: >-
      De vijf meest waarschijnlijke vragen zijn: (1) Wat is de tijdcomplexiteit van minimax? (O(b^d), exponentieel).
      (2) Hoe vermindert alpha-bèta-snoeiing deze complexiteit? (O(b^(d/2)) in het beste geval). (3) Wat is een
      transpositietabel en waarom is die nuttig? (Memoïsatie van al berekende stellingen). (4) Waarom gebruikt men
      bitboards in plaats van een 2D-array in Python voor een serieuze engine? (Snelheid van bitsgewijze bewerkingen
      versus arraytoegang). (5) Wat is het verschil tussen gesuperviseerd leren en reinforcement learning in de
      context van AlphaZero?
---

Je hebt de specialisatie **NSI** (informatica) in het laatste schooljaar van de Franse middelbare school en je zoekt een **onderwerp voor je Grand Oral** waarmee je kunt laten zien wat je echt kunt: coderen, redeneren over **complexiteit**, begrijpen hoe machines beslissen. Deze **mondelinge eindpresentatie**, uniek in het Franse onderwijssysteem, weegt zwaar mee in het eindexamen (**baccalauréat**): het is een van de **proeven** waarbij je in een paar **minuten** het meeste verschil kunt maken.

Onder de **mogelijke onderwerpen** voor de Grand Oral in de specialisatie **NSI** vinken schaken alle vakjes van het **programma** van het laatste jaar af: algoritmiek, datastructuren, databases, kunstmatige intelligentie. Tegenover klassiekere **onderwerpen** (**informatiebeveiliging**, **sociale media**, programmeertalen) is dit een zeldzaam onderwerp dat toelichtbare code combineert met een cultureel beeld dat elke jury herkent.

Dit **artikel** geeft je een compleet pakket dat je direct kunt gebruiken om je **mondeling** voor te bereiden: de methodologie van de **proef**, een tijdschema van **twintig minuten**, Python-code die je regel voor regel kunt uitleggen, een FAQ met vijftien vragen van de jury al ingedeeld naar moeilijkheidsgraad, een afdrukbaar spiekbriefje en **tips** voor je houding op de grote dag.

> **Tip:** klik op de knop "Download als PDF" boven aan de pagina om de hele **gids** in afdrukbare vorm te krijgen, en stop hem in je revisiemap.

## De proef begrijpen: Grand Oral bij de specialisatie NSI

### Weging, duur, opbouw

De **Grand Oral van het eindexamen** is een eindexamenonderdeel met een totale duur van **20 minuten** (plus 20 **minuten** voorbereiding). De indeling is precies en de **jury** houdt zich aan de klok:

| Tijd | Fase | Wat je doet | Wat de **jury** beoordeelt |
|---|---|---|---|
| 20 min | Voorbereiding | Je krijgt twee **vragen** uit je programma. Je kiest er één. Kladpapier toegestaan. |, |
| 5 min | Presentatie staand | Je presenteert je **vraag** staand, zonder aantekeningen (of nauwelijks). | **Houding**, stem, structuur |
| 10 min | Gesprek met de jury | De **jury** bevraagt je over het **onderwerp**, het **programma**, je **methode**. | Beheersing, reactievermogen, openheid |
| 5 min | Studiekeuzeproject | Je legt uit hoe dit **onderwerp** past in je studiekeuze na het eindexamen. | Samenhang met je traject |

**Weging bij het algemene eindexamen: 10** (op een totaal van 100). Bij een gemiddelde van 12 voor het schriftelijk gedeelte kan het winnen van 3 punten bij de Grand Oral net het verschil maken voor een onderscheiding. Het is het onderdeel met de beste verhouding tussen voorbereidingstijd en impact op het cijfer.

### De officiële verwachtingen

De **jury** bestaat uit **twee** docenten: één uit je specialisatie (vaak NSI), de ander uit een ander vakgebied. De tweede is **geen** expert in jouw onderwerp: je presentatie moet begrijpelijk zijn voor een niet-specialist. Dit is een punt waarop veel kandidaten struikelen: ze gooien technisch jargon eruit in plaats van uit te leggen.

Het officiële reglement (Bulletin officiel, BO) geeft aan dat de **jury** het volgende beoordeelt:
1. De mondelinge kwaliteit (uitspraak, rustige **spreekstijl**, overtuigende toon)
2. De beheersing van het **onderwerp** (het vermogen om uit te leggen, te onderbouwen, te nuanceren)
3. De opbouw van de argumentatie (probleemstelling, structuur, conclusie)
4. De link met je **studiekeuzeproject**

Een **onderwerp** als schaken bij NSI doorstaat alle vier de filters: de code is te tonen, de argumentatie bouwt op algoritmische **complexiteit**, en de link met een technische universiteit of hbo-informatica is direct.

### Wat een goed onderwerp onderscheidt van een middelmatig onderwerp

Een goed **onderwerp** voor de Grand Oral NSI heeft drie eigenschappen die je in vijf minuten kunt controleren:

- **Het bevat zichtbare code** die je hardop kunt beschrijven (variabelen, lussen, **werking**, **vragen** over de **complexiteit**)
- **Het heeft een herkenbaar belang** dat verder gaat dan de techniek (maatschappij, economie, ethiek, wetenschap)
- **Het sluit aan bij een domein dat de jury herkent** (spellen, AI, web, beveiliging, big data)

Schaken vinkt alle drie af. Je kunt concreet Python laten zien, praten over de omslag van symbolische AI naar connectionistische AI (maatschappelijk belang), en steunen op **AlphaZero**, dat **elke** informaticajury kent.

## Waarom schaken het juiste onderwerp is bij de specialisatie NSI

Schaken behoren tot de meest bestudeerde **onderwerpen** uit de hele geschiedenis van de **informatica**. Het is een **onderwerp** waarbij de **vraag** "kunnen machines denken?" voor het eerst op een operationele manier werd gesteld: niet als abstracte filosofie, maar als uitvoerbare regels code.

### Drie historische feiten die de jury zal waarderen

1. **1950**, [Alan Turing](https://nl.wikipedia.org/wiki/Alan_Turing) schrijft het eerste schaakprogramma op papier (bij gebrek aan een machine die krachtig genoeg was om het uit te voeren). Hij bedenkt daarbij een groot **deel** van het vocabulaire van de moderne AI.
2. **1950**, [Claude Shannon](https://nl.wikipedia.org/wiki/Claude_Shannon) publiceert *Programming a Computer for Playing Chess*. Hij onderscheidt twee strategieën om op een machine te schaken: **type A** (brute kracht, volledige verkenning) en **type B** (selectie gestuurd door expertise). Dit onderscheid structureert nog altijd de hedendaagse AI.
3. **2017**, [DeepMind](https://en.wikipedia.org/wiki/DeepMind) publiceert [AlphaZero](https://nl.wikipedia.org/wiki/AlphaZero), dat Stockfish (toen de sterkste engine ter wereld) verslaat na **vier uur** zelflerend spel. Dit is de belichaming van een paradigmaverschuiving: van symbolisch naar connectionistisch.

Je kunt je **mondeling** dus opbouwen rond 67 jaar informaticageschiedenis, samengebald in één **voorbeeld**, met Python-code te tonen bij elke stap.

### De programma-onderdelen die je gaat gebruiken

Dit **onderwerp** stelt je in staat om **alle** inhoud van de **specialisatie** NSI aan te raken:

- **Algoritmiek**: recursie (minimax), snoeiing (alpha-bèta), memoïsatie (transpositietabel)
- **Datastructuren**: n-aire bomen, hashtabel-**systemen**, Python-dictionaries
- **Python-programmeren**: recursieve functies, bitsgewijze operatoren, beschrijvings-**talen**
- **Data en databases**: PGN-formaat, SQL-query's, Zobrist-hashing
- **Kunstmatige intelligentie**: gesuperviseerd leren versus reinforcement learning, neurale netwerken
- **Complexiteit**: analyse in O(b^d) en vervolgens O(b^(d/2)), empirische vergelijking
- **Computerarchitectuur**: waarom bitsgewijze bewerkingen efficiënt zijn (CPU-cycli)

Geen enkel ander **onderwerp** brengt zoveel **vragen** uit het **programma** samen in zo weinig **tijd**.

### De valkuil om te vermijden

Het grootste risico van een **mondeling** over schaken bij NSI is dat je vervalt in puur verhalend vertellen (Kasparov tegen Deep Blue, anekdotes uit **partijen**). De **jury** verwacht code en **informatica**-precisie. Je mag en moet Deep Blue noemen, maar als overgangspunt naar het alpha-bèta-algoritme, niet als verhaal op zich.

Gouden regel: **elke minuut verhaal moet gevolgd worden door een minuut code of berekening**.

## Andere ideeën voor Grand Oral-onderwerpen bij de specialisatie NSI

Om je keuze voor schaken te plaatsen tegenover andere **onderwerpideeën**, hier een snel overzicht. Deze alternatieven zijn allemaal geldig; sommige hebben hun eigen **beperkingen**.

| **Onderwerp** | Sterke punten | **Beperkingen** | Risiconiveau |
|---|---|---|---|
| **Informaticabeveiliging** (RSA-encryptie, aanvallen) | Sterk actueel, verbonden met het moderne **internet** | Vaak behandeld, **jury** eraan gewend, hoog wiskundeniveau voor RSA | Gemiddeld |
| **Sociale media** en aanbevelingsalgoritmen | Sterk maatschappelijk onderwerp, veel mogelijke invalshoeken | Moeilijk om code te tonen, snel buiten het programma | Hoog |
| **Generatieve kunstmatige intelligentie** (ChatGPT, LLM's) | Brandend actueel | Risico op een niet-technisch verhaal (je beschrijft het hulpmiddel zonder het uit te leggen) | Hoog |
| **Programmeertalen** vergeleken | Puur technisch | Weinig maatschappelijk belang, weinig verbeeldingskracht | Laag |
| **Embedded systemen** (IoT, Raspberry Pi) | Zeer concreet als je een project hebt | Vereist een hardwareproject om te tonen | Gemiddeld |
| **Kwantumcryptografie** | Geavanceerd onderwerp, indrukwekkend | Zeer hoog moeilijkheidsniveau, weinig kandidaten houden het vol | Hoog |
| **Sorteeralgoritmen** en **complexiteit** | Kern van het **programma** | Wordt als "schools" gezien, moeilijk om de invalshoek te **vernieuwen** | Laag |
| **Schaken en AI** (onze keuze) | Combineert algoritmen, structuren en AI, cultureel beeld | Risico van puur verhaal | Laag als je deze gids volgt |
| **Enorme databases** (Lichess, GitHub) | Concreet geval van big data | Vereist omgaan met SQL en statistiek | Gemiddeld |
| **Datacompressie** (PNG, MP3) | Wiskunde plus structuur | Veeleisend technisch onderwerp | Gemiddeld |
| **Databases** enorm groot (Lichess, GitHub) | Concreet geval van big data | Vereist omgang met SQL en statistiek | Gemiddeld |

Wat je **studierichting** ook is, houd in gedachten dat de **jury** zoekt naar een **onderwerp** waarbij je code kunt tonen, technische **vragen** kunt anticiperen, en je invalshoek kunt **vernieuwen** om niet gewoon de stof te reciteren. Schaken combineert deze drie criteria beter dan de meeste andere **ideeën**.

## Je probleemstelling opbouwen: drie mogelijke invalshoeken

De **jury** verwacht **geen** betoog: hij verwacht een precieze **vraag** die je presentatie zal sturen. Drie invalshoeken werken bijzonder goed:

### Invalshoek 1, De strijd tussen twee paradigma's

> **"Hoe hebben schaken de overgang van symbolische AI naar lerende AI mogelijk gemaakt?"**

Deze invalshoek laat je Deep Blue (1997, symbolisch) en daarna AlphaZero (2017, connectionistisch) vertellen aan de hand van de code van beide benaderingen. Dit is het **onderwerp** dat de perceptie van de **jury** over je denkniveau het meest **vernieuwt**.

### Invalshoek 2, Complexiteit als beperking

> **"Waarom dwingen 10^120 mogelijke stellingen de informatica om nieuwe algoritmen uit te vinden?"**

Deze invalshoek is meer wiskundig. Je begint met het getal van Shannon (10^120 mogelijke schaakpartijen), laat zien dat brute kracht onmogelijk is, en rolt de oplossingen uit: alpha-bèta, wegings-**systemen**, MCTS. Dit is de favoriete invalshoek van wiskundig aangelegde kandidaten.

### Invalshoek 3, Van spel naar fundamentele wetenschap

> **"Zijn schaken een experimenteerterrein voor moderne kunstmatige intelligentie?"**

Brede invalshoek, gericht op **belangen** en **studiekeuze**. Je presenteert schaken als proeftuin (AlphaZero loste daarna Go, shogi en vervolgens eiwitvouwing op met AlphaFold). Dit is de invalshoek die het beste doorloopt in het **studiekeuze**-onderdeel.

**Aanbeveling:** kies invalshoek 1 als je code wilt tonen, invalshoek 2 als je je wiskundige beheersing wilt tonen, invalshoek 3 als je op een technische universiteit of vooropleiding mikt.

## Tijdschema voor 20 minuten mondeling

Hier is het gedetailleerde schema dat je kunt aanpassen. De tijden zijn indicatief maar houden de klok in de gaten.

### Fase 1, Introductie (3 minuten)

- **Openingszin** (30 s): "In 1997 verliest Garry Kasparov van Deep Blue, en verklaart: 'ik heb een paradigmaverschuiving gezien'. Twintig jaar later leert AlphaZero schaken in **vier uur**, zonder menselijke kennis. **Vraag**: wat is er tussen die twee gebeurd?"
- **Context** (1 min): korte herhaling van de plaats van schaken in de **informatica** (Turing 1950, Shannon 1950, Deep Blue-**systemen** 1997, AlphaZero 2017).
- **Probleemstelling** (30 s): duidelijke aankondiging van je **vraag**.
- **Aangekondigde structuur** (1 min): "Ik zal eerst het minimax-algoritme presenteren, dan de datastructuren die het ondersteunen, dan de omslag naar machinaal leren."

### Fase 2, Algoritmen en complexiteit (6 minuten)

- **Minimax** (2 min): presentatie van de Python-code regel voor regel op bord of dia.
- **Alpha-bèta** (2 min): optimalisatie, snoeiing uitgelegd op een getekende boom.
- **Complexiteit** (1 min): O(b^d) naar O(b^(d/2)), vertaling naar aantal verkende stellingen.
- **Memoïsatie** (1 min): transpositietabel, Python-dictionary.

### Fase 3, Structuren en representatie (4 minuten)

- **2D-array versus bitboard** (2 min): vergelijking qua **toegangstijd** en bitsgewijze bewerkingen.
- **PGN-formaat** (1 min): gestructureerde data, parsen met Python-regex.
- **Zobrist-hashing** (1 min): XOR om een stelling in 64 bits op te slaan.

### Fase 4, AI en leren (5 minuten)

- **Stockfish** (1 min): symbolische aanpak, expliciete evaluatiefunctie.
- **AlphaZero** (2 min): waarde-netwerk plus beleidsnetwerk plus MCTS.
- **Reinforcement learning** (1 min): beloningssignaal, zelflerend spel.
- **Vergelijking** (1 min): tabel Stockfish versus AlphaZero, 28-0-72 op 100 partijen.

### Fase 5, Conclusie (2 minuten)

- **Samenvatting** (45 s): schaken hebben de **informatica** in staat gesteld om van expliciete algoritmen naar impliciet leren over te gaan.
- **Verbreding** (45 s): overgang naar AlphaFold (eiwitvouwing), naar Go, naar andere spellen met perfecte informatie.
- **Brug naar studiekeuze** (30 s): wat je na het **eindexamen** wilt doen en waarom dit **onderwerp** je daarop voorbereidt.

## Algoritmen en datastructuren

### Het minimax-algoritme: pure recursie

Het **programma** van het laatste schooljaar NSI omvat recursie als fundamenteel concept. **Minimax** is het schoonste voorbeeld dat er bestaat: een functie die zichzelf aanroept, op een van nature recursief probleem (het verkennen van een spelboom).

Hier is de structuur in pseudo-Python die je regel voor regel voor de **jury** kunt uitleggen:

#### Code (Python) - minimax (recursie)

```python
def minimax(positie, diepte, is_maximizer):
    # Basisgeval: diepte bereikt of partij beëindigd
    if diepte == 0 or partij_beeindigd(positie):
        return evalueer(positie)
    
    zetten = genereer_legale_zetten(positie)
    
    if is_maximizer:
        beste = float('-inf')
        for zet in zetten:
            nieuwe_pos = pas_zet_toe(positie, zet)
            waarde = minimax(nieuwe_pos, diepte - 1, False)
            beste = max(beste, waarde)
        return beste
    else:
        beste = float('+inf')
        for zet in zetten:
            nieuwe_pos = pas_zet_toe(positie, zet)
            waarde = minimax(nieuwe_pos, diepte - 1, True)
            beste = min(beste, waarde)
        return beste
```

Deze code toont de begrippen uit het **programma**:
- **Recursie**: de aanroep `minimax(nieuwe_pos, diepte - 1, ...)` binnen de functie zelf
- **Basisgeval**: de voorwaarde `diepte == 0` die de recursie stopt
- **Boomstructuur**: het verkennen van de kinderen van een knoop voordat de waarde teruggaat naar de ouder
- **Functies van hogere orde**: `max()` en `min()` toegepast op een generator

De **tijdcomplexiteit** is $O(b^d)$, waarbij $b$ de gemiddelde vertakkingsfactor is ($\approx 35$ bij schaken) en $d$ de diepte. Voor $d = 4$: $35^4 \approx 1{,}5 \times 10^6$ recursieve aanroepen. Voor $d = 6$: $35^6 \approx 1{,}8 \times 10^9$. De exponentiële groei is de eerste **vraag** die de **jury** zal openen.

### Alpha-bèta-snoeiing: algoritmische optimalisatie

**Alpha-bèta**-snoeiing is een optimalisatie van minimax die voorkomt dat takken worden verkend waarvan je kunt bewijzen dat ze het eindresultaat **niet** zullen veranderen. In NSI is dit een **voorbeeld** van een **snoeialgoritme** (*pruning*), een algemene optimalisatietechniek.

Het idee: je houdt twee grenzen bij, **alpha** (de beste score die de maximizerende speler kan garanderen) en **beta** (de beste score die de minimizerende speler kan garanderen). Als je bij een knoop ontdekt dat de waarde altijd slechter zal zijn dan wat je al kunt garanderen, geef je de verkenning van die deelboom op.

#### Code (Python) - alpha-bèta (snoeiing)

```python
def alpha_beta(positie, diepte, alpha, beta, is_maximizer):
    if diepte == 0 or partij_beeindigd(positie):
        return evalueer(positie)
    
    zetten = genereer_legale_zetten(positie)
    
    if is_maximizer:
        for zet in zetten:
            waarde = alpha_beta(pas_zet_toe(positie, zet),
                                 diepte - 1, alpha, beta, False)
            alpha = max(alpha, waarde)
            if beta <= alpha:
                break  # Beta-snoei: verder verkennen is nutteloos
        return alpha
    else:
        for zet in zetten:
            waarde = alpha_beta(pas_zet_toe(positie, zet),
                                 diepte - 1, alpha, beta, True)
            beta = min(beta, waarde)
            if beta <= alpha:
                break  # Alpha-snoei: verder verkennen is nutteloos
        return beta
```

De regel `break`, de **snoei**, is de kern van de optimalisatie. In het beste geval (goed geordende zetten) vermindert alpha-bèta de **complexiteit** tot $O(b^{d/2})$: je verkent ongeveer de vierkantswortel van het aantal knopen van de naïeve minimax. Voor $d = 6$ ga je van ongeveer $1{,}8 \times 10^9$ naar $\sim 4{,}2 \times 10^4$ knopen.

Teken voor de presentatie aan de **jury** een kleine boom met 3 niveaus en laat live zien welke tak wordt afgesneden en waarom. Dit is het **voorbeeld** waarover de **jury** de meeste **vragen** zal stellen.

### Bomen als datastructuur

Het **programma** omvat **binaire bomen**: definitie, doorlopingen (prefix, infix, suffix), hoogte. De boom van schaakzetten is een **n-aire boom** (elke knoop heeft tot 35 kinderen), maar hetzelfde vocabulaire is van toepassing.

Belangrijke punten voor de **jury**:
- De **wortel** is de beginstelling
- De **interne knopen** zijn stellingen tijdens de partij
- De **bladeren** zijn eindstellingen (mat, remise, opgave) of stellingen op de maximale verkenningsdiepte
- De **hoogte** van de boom is het aantal nog te verkennen zetten
- Een **diepte-eerst-doorloop** (DFS) is wat minimax van nature uitvoert via de recursieve aanroepstack

Het verschil met een binaire zoekboom: in een zettenboom zoek je **niet** naar een waarde, je **propageert scores** van onder naar boven. Dit heet **terugpropagatie van waarden**, een concept dat terugkomt in neurale netwerken (backpropagation).

![Alpha-bèta-snoeiing op een minimax-boom: een tak wordt afgesneden omdat die het resultaat dat MAX al kan garanderen niet kan verbeteren.](/images/go-nsi-01-alphabeta-coupure.svg)

![N-aire boom van zetten doorlopen door een recursieve DFS, van de wortel naar de bladeren.](/images/go-nsi-03-arbre-naire-dfs.svg)

## Python-programmeren: het schaakbord representeren

### 2D-array: de naïeve representatie

De meest directe representatie van een schaakbord in Python is een tweedimensionale array van 8×8:

#### Code (Python) - schaakbord in 2D-array

```python
# Representatie van het schaakbord bij het begin van de partij
# P=pion, T=toren, C=paard, F=loper, D=dame, R=koning
# Hoofdletter = wit, kleine letter = zwart

schaakbord = [
    ['t', 'c', 'f', 'd', 'r', 'f', 'c', 't'],  # rij 8 (zwart)
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],  # rij 7
    ['.', '.', '.', '.', '.', '.', '.', '.'],   # rij 6
    ['.', '.', '.', '.', '.', '.', '.', '.'],   # rij 5
    ['.', '.', '.', '.', '.', '.', '.', '.'],   # rij 4
    ['.', '.', '.', '.', '.', '.', '.', '.'],   # rij 3
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],  # rij 2 (wit)
    ['T', 'C', 'F', 'D', 'R', 'F', 'C', 'T'],  # rij 1
]

# Toegang tot veld e4 (kolom 4, rij 3 in onze index 0-7)
def haal_stuk(schaakbord, kol, rij):
    return schaakbord[7 - rij][kol]
```

Deze representatie is eenvoudig te begrijpen en te presenteren. Ze illustreert de begrippen **2D-array**, **indexering** en Python-**slicing**. Het nadeel: bewerkingen op velden (controleren of een stuk wordt aangevallen, legale zetten genereren) vereisen geneste lussen, wat traag is voor een echte engine.

### Bitboard: de efficiënte representatie

De **bitboard**-representatie wordt gebruikt in **elke** professionele engine (Stockfish, Leela Chess Zero). Ze illustreert direct het **programma** over **binaire representatie** en **bitsgewijze logische operatoren**.

Principe: elk stuktype (witte pionnen, zwarte torens, enzovoort) wordt weergegeven door een **geheel getal van 64 bits**. Bit *i* is 1 als het stuk op veld *i* staat (velden genummerd van 0 tot 63, van a1 tot h8).

#### Code (Python) - bitboard (bitsgewijze bewerkingen)

```python
# In Python hebben gehele getallen willekeurige precisie
# We kunnen een 64-bits bitboard simuleren

# Beginstelling: witte pionnen op de velden 8 tot 15
# Velden 8-15 = bits 8 tot 15 geactiveerd
witte_pionnen = 0xFF00  # 65280 decimaal

# Controleren of er een witte pion op veld e2 staat (veld 12 in onze nummering)
veld_e2 = 1 << 12  # 0b0001000000000000
pion_op_e2 = (witte_pionnen & veld_e2) != 0
print(pion_op_e2)  # True

# Een pion van e2 naar e4 verplaatsen (veld 12 naar veld 28)
witte_pionnen = (witte_pionnen & ~veld_e2) | (1 << 28)
```

Deze code gebruikt de Python **bitsgewijze operatoren**: `&` (EN), `|` (OF), `~` (NIET), `<<` (schuiven naar links). Deze operatoren staan op het **programma** en zijn hier direct nuttig. Een engine kan alle legale zetten van een stuk berekenen met een paar bitsgewijze bewerkingen in microseconden, terwijl een 2D-array lussen nodig heeft.

![Twee representaties van het schaakbord: leesbare 2D-array tegenover performante bitboard (64 bits).](/images/go-nsi-04-bitboard-vs-tableau2d.svg)

## Kunstmatige intelligentie: van Stockfish naar AlphaZero

### Stockfish: de klassieke symbolische aanpak

[Stockfish](https://en.wikipedia.org/wiki/Stockfish_(chess)) is een opensource-engine, een van de sterkste ter wereld. Ze steunt op het alpha-bèta-algoritme met massale optimalisaties:

- **Transpositietabel**: een hashtabel die al geëvalueerde stellingen opslaat om herberekening te voorkomen (memoïsatie)
- **Iterative deepening**: je verkent eerst tot diepte 1, dan 2, dan 3... om snel een goed antwoord te krijgen, zelfs als de **tijd** opraakt
- **Move ordering**: zetten worden voor de verkenning gesorteerd (eerst slagzetten) om alpha-bèta-snoeiingen te maximaliseren

De **transpositietabel** is een direct **voorbeeld** van een sleutel-waardestructuur (dictionary in Python) die wordt gebruikt voor memoïsatie:

#### Code (Python) - transpositietabel (memoïsatie)

```python
# Vereenvoudigde transpositietabel
transpositie_tabel = {}

def minimax_memo(positie, diepte, is_max):
    # Hash de positie om er een sleutel van te maken
    sleutel = (hash(str(positie)), diepte, is_max)
    
    if sleutel in transpositie_tabel:
        return transpositie_tabel[sleutel]  # Al berekend resultaat
    
    # ... normale minimax-berekening ...
    resultaat = ...
    
    transpositie_tabel[sleutel] = resultaat  # Opslaan voor hergebruik
    return resultaat
```

Het concept is dat van **dynamisch programmeren**: in plaats van identieke deelproblemen opnieuw te berekenen, sla je hun oplossingen op. Schaken produceert identieke stellingen via verschillende zetreeksen (*transposities*), wat memoïsatie bijzonder effectief maakt.

### AlphaZero: de aanpak door leren

In 2017 publiceerde [DeepMind](https://en.wikipedia.org/wiki/DeepMind) [AlphaZero](https://nl.wikipedia.org/wiki/AlphaZero), een programma dat radicaal verschilt van Stockfish. Voor NSI is het fundamentele onderscheid als volgt:

| | **Stockfish** | **AlphaZero** |
|---|---|---|
| Aanpak | Expliciet programmeren | Reinforcement learning |
| Evaluatie | Formule gecodeerd door experts | Geleerd neuraal netwerk |
| Menselijke kennis | Ja (openingen, strategie) | **Nee** (alleen regels) |
| Training | Geen | **4 uur** zelflerend spel |
| Resultaat tegen Stockfish | / | 28 overwinningen, 0 nederlagen (100 partijen, 2017) |
| Stellingen per seconde | 200 miljoen | ~60.000 |

AlphaZero gebruikt twee neurale netwerken tegelijk:
1. **Het waardenetwerk** (*value network*): geeft een numerieke evaluatie van de stelling
2. **Het beleidsnetwerk** (*policy network*): geeft een kansverdeling over de legale zetten

Deze twee netwerken sturen de **Monte Carlo Tree Search (MCTS)**: in plaats van de boom uniform te verkennen, richt MCTS de middelen op de zetten die het beleidsnetwerk kansrijk acht, en corrigeert deze inschatting op basis van de simulatieresultaten.

Voor NSI is het kernargument dat van het **paradigma**: Stockfish vertelt de machine *expliciet* wat een goede stelling is. AlphaZero *leert* wat een goede stelling is. Het eerste paradigma is dat van **imperatief programmeren**, het tweede dat van **machinaal leren**: beide staan op het **programma**.

### Machinaal leren versus klassieke algoritmen

Schaken maken het mogelijk om het onderscheid tussen de grote families van aanpakken te illustreren:

**Gesuperviseerd leren**: je levert miljoenen geannoteerde stellingen (stelling naar beste zet), en het netwerk leert deze annotaties te reproduceren. Het is als leren oefeningen op te lossen aan de hand van uitwerkingen.

**Reinforcement learning** (AlphaZero): je levert alleen de spelregels en een beloningssignaal (winnen = +1, verliezen = -1). Het programma speelt tegen zichzelf, verbetert zijn strategie op basis van de resultaten, zonder ooit een menselijke partij te zien.

Dit onderscheid is een van de meest waarschijnlijke **vragen** van de **jury** bij een AI/NSI-**onderwerp**.

![Twee AI-paradigma's bij schaken: Stockfish (alpha-bèta, deskundige evaluatie) tegenover AlphaZero (neuraal netwerk, zelflerend).](/images/go-nsi-02-stockfish-alphazero.svg)

![Gesuperviseerd leren (partijen nabootsen) tegenover reinforcement learning (zelflerend spel van AlphaZero).](/images/go-nsi-07-apprentissage-supervise-vs-renforcement.svg)

![Alpha-bèta (volledige gesnoeide verkenning) tegenover MCTS (selectieve verkenning door simulaties).](/images/go-nsi-06-mcts-vs-alphabeta.svg)

## Data en databases

### Het PGN-formaat: gestructureerde data

**PGN** (*Portable Game Notation*) is het standaardformaat voor het opslaan van schaakpartijen. Een PGN-bestand bevat **gestructureerde metadata** tussen vierkante haken, gevolgd door de lijst met zetten:

#### Voorbeeld (PGN) - gestructureerd tekstbestand

```text
[Event "World Chess Championship 1997"]
[Date "1997.05.03"]
[White "Deep Blue"]
[Black "Kasparov, G"]
[Result "1-0"]
[WhiteElo "?"]
[BlackElo "2795"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6
8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 ... 1-0
```

Voor NSI illustreert dit formaat verschillende begrippen:
- **Formaat van gestructureerde data**: de metadata volgt een voorspelbaar schema
- **Parsen**: je kunt de informatie extraheren met reguliere expressies
- **Codering**: de zetnotatie (e4, Nf3, O-O) is een formele **taal** met een eigen grammatica

Een eenvoudige **PGN-parser** in Python:

#### Code (Python) - PGN-parser (regex)

```python
import re

def extraheer_metadata(pgn_tekst):
    """Extraheert de metadata van een PGN-partij."""
    patroon = r'\[(\w+)\s+"([^"]+)"\]'
    return dict(re.findall(patroon, pgn_tekst))

pgn = '[Event "Test"][Date "2026.04.28"][White "Alice"][Black "Bob"]'
metadata = extraheer_metadata(pgn)
# {'Event': 'Test', 'Date': '2026.04.28', 'White': 'Alice', 'Black': 'Bob'}
```

### SQL op een partijendatabase

[Lichess](https://lichess.org) publiceert een **openbare database** met meer dan 3 miljard partijen in PGN-formaat. Deze database is een perfect **voorbeeld** van **big data** voor NSI:

```sql
-- Vereenvoudigd schema van een schaakpartijendatabase
CREATE TABLE partijen (
    id INTEGER PRIMARY KEY,
    datum DATE,
    speler_wit VARCHAR(50),
    speler_zwart VARCHAR(50),
    elo_wit INTEGER,
    elo_zwart INTEGER,
    opening VARCHAR(10),
    resultaat CHAR(3),
    aantal_zetten INTEGER
);

-- Query: winstpercentage van Wit per opening
SELECT 
    opening,
    COUNT(*) AS aantal_partijen,
    ROUND(100.0 * SUM(CASE WHEN resultaat = '1-0' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_wit
FROM partijen
GROUP BY opening
ORDER BY aantal_partijen DESC
LIMIT 10;
```

Deze SQL-query illustreert de begrippen **relationele databases**, **aggregatie**, **filteren** en **sorteren**.

### Numerieke representatie en compressie

Om een stelling efficiënt op te slaan, gebruiken engines **Zobrist-hashing**: je koppelt aan elk paar (stuk, veld) een willekeurig getal van 64 bits, en de hashwaarde van de hele stelling is de XOR van al deze getallen.

#### Code (Python) - Zobrist-hashing (XOR)

```python
import random

ZOBRIST_TABEL = {}
stukken = ['P', 'p', 'T', 't', 'C', 'c', 'F', 'f', 'D', 'd', 'R', 'r']
for stuk in stukken:
    for veld in range(64):
        ZOBRIST_TABEL[(stuk, veld)] = random.getrandbits(64)

def bereken_hash(schaakbord_lijst):
    """Berekent de Zobrist-hash van een stelling."""
    h = 0
    for veld, stuk in enumerate(schaakbord_lijst):
        if stuk != '.':
            h ^= ZOBRIST_TABEL[(stuk, veld)]
    return h
```

Deze code illustreert de begrippen **XOR-operatoren**, **hashtabellen** en **hashcollisies**.

![Transpositietabel en Zobrist-hashing: twee zetreeksen die tot dezelfde stelling leiden, worden maar één keer berekend.](/images/go-nsi-05-table-transposition-zobrist.svg)

## FAQ voor de jury: 15 vragen ingedeeld naar moeilijkheidsgraad

Hier zijn de **vragen** die de **jury** het meest waarschijnlijk zal stellen. Leer de antwoorden uit je hoofd: niet om ze te reciteren, maar om de **vragen** op de grote dag paraat te hebben.

### Makkelijk niveau (de jury test of je het vocabulaire beheerst)

**1. Wat is een recursieve functie?**
Een functie die zichzelf aanroept, met een stopvoorwaarde (basisgeval) om niet oneindig te blijven lopen. Minimax is het **standaardvoorbeeld**.

**2. Wat betekent de complexiteit O(b^d)?**
Het aantal bewerkingen groeit exponentieel met de diepte d: voor b=35 en d=6 overschrijd je het miljard bewerkingen. Dit heet **exponentiële complexiteit**.

**3. Wat is een dictionary in Python?**
Een sleutel-naar-waarde-datastructuur, geïmplementeerd als hashtabel. Maakt gemiddeld O(1)-toegang mogelijk. De transpositietabel is een dictionary.

### Gemiddeld niveau (de jury test of je de concepten begrijpt)

**4. Waarom verbetert alpha-bèta-snoeiing minimax zonder het resultaat te veranderen?**
Omdat ze takken afsnijdt waarvan je **wiskundig kunt bewijzen** dat ze **niet** de beste zet bevatten. Het eindresultaat is identiek aan pure minimax; alleen de rekentijd verandert.

**5. Waarom zijn bitboards sneller dan een 2D-array?**
Bitsgewijze bewerkingen (AND, OR, NOT, shift) worden in één CPU-cyclus uitgevoerd, ongeacht de grootte (op een 64-bits processor). Alle legale zetten van een toren genereren met bitboards kost 3-4 logische bewerkingen; met een 2D-array zijn 4 geneste lussen nodig.

**6. Heeft AlphaZero meer of minder rekenkracht nodig dan Stockfish?**
AlphaZero evalueert ongeveer 60.000 stellingen per seconde, tegen 200 miljoen voor Stockfish. AlphaZero is veel trager qua geëvalueerde stellingen, maar zijn neurale netwerk stelt hem in staat kansrijke takken zo precies te selecteren dat hij er **niet** zoveel hoeft te verkennen.

**7. Wat is het verschil tussen gesuperviseerd leren en reinforcement learning?**
Gesuperviseerd: je geeft geannoteerde **voorbeelden** (stellingen naar beste zet), het netwerk leert imiteren. Reinforcement: je geeft alleen de regels plus een beloningssignaal (winst/verlies), het programma leert door vallen en opstaan door tegen zichzelf te spelen.

**8. Wat is een transpositietabel en waarom is die nodig bij schaken?**
Het is een dictionary (sleutel = hash van de stelling, waarde = al berekende score en diepte). Nodig omdat dezelfde stelling via meerdere verschillende zetreeksen kan worden bereikt (*transposities*). Zonder haar zou je dezelfde stelling onnodig tientallen keren herberekenen.

### Moeilijk niveau (de jury test of je kunt nuanceren)

**9. Is AlphaZero een voorbeeld van niet-gesuperviseerd leren?**
**Nee**, belangrijke precisering: AlphaZero is **reinforcement learning**, **niet** niet-gesuperviseerd. Hij ontvangt een beloningssignaal (winst/verlies). Niet-gesuperviseerd leren zou stellingen zonder labels groeperen zijn. Deze nuance toont dat je de taxonomie van AI beheerst.

**10. Wat is de theoretische grens van engines zoals Stockfish?**
Hun **werking** steunt op een evaluatiefunctie die door mensen is geprogrammeerd. Ze kunnen de kwaliteit van deze functie **niet** overtreffen. AlphaZero heeft laten zien dat een geleerd netwerk deze functie kan overtreffen.

**11. Waarom is het getal 10^120 (getal van Shannon) een fundamentele grens?**
Dit is het geschatte aantal mogelijke schaak**partijen**. Dit getal overschrijdt het aantal atomen in het waarneembare heelal (≈ 10^80). Geen enkele computer zal ooit alle partijen met brute kracht kunnen verkennen: vandaar de noodzaak van intelligente algoritmen.

**12. Wat is het verschil tussen MCTS en alpha-bèta?**
Alpha-bèta verkent de boom deterministisch en volledig tot een vaste diepte, en snoeit wat bewezen nutteloos is. MCTS bemonstert willekeurig kansrijke zetten en speelt willekeurige simulaties tot het einde van de partij. AlphaZero combineert MCTS met een neuraal netwerk dat de bemonstering stuurt.

### Expertniveau (de jury wil zien of je verder kunt gaan)

**13. Heeft AlphaZero echt "vanaf nul geleerd" zonder menselijke kennis?**
Subtiele **vraag**. AlphaZero heeft **geen** menselijke **partij** gezien, maar hij kende de spelregels (gecodeerd door mensen). De term "zero" duidt op de afwezigheid van menselijke trainingsdata, **niet** op de afwezigheid van elke geprogrammeerde structuur.

**14. Waarom gebruikt Stockfish nu neurale netwerken (NNUE)?**
Sinds 2020 integreert Stockfish een klein neuraal netwerk genaamd NNUE (*Efficiently Updatable Neural Network*) voor de evaluatie. Dit is een hybride: alpha-bèta voor het zoeken, netwerk voor de evaluatie. Dit is de convergentie van de twee paradigma's.

**15. Wat zijn de ethische grenzen van AI toegepast op schaken?**
De belangrijkste **vraag** is vals spelen: omdat engines sterker zijn dan elke mens, is hun gebruik in competitie verboden. Dit roept detectie-**vraagstukken** op (Hans Niemann tegen Magnus Carlsen, 2022). Breder gezien roepen de technieken van AlphaZero, toegepast op andere domeinen, vragen op over verklaarbaarheid: een neuraal netwerk kan zijn beslissingen **niet** verantwoorden, wat een probleem is in de geneeskunde of de rechtspraak.

## Afdrukbaar spiekbriefje: om in je zak te vouwen

**Drie getallen om absoluut te onthouden:**
- 35: gemiddelde vertakkingsfactor bij schaken
- 10^120: aantal mogelijke partijen (getal van Shannon)
- 28-0-72: score van AlphaZero tegen Stockfish (2017, 100 partijen)

**Drie data:**
- 1950: Turing en Shannon, algoritmische fundamenten
- 1997: Deep Blue verslaat Kasparov (symbolisch, brute berekening)
- 2017: AlphaZero verslaat Stockfish in 4 uur (connectionistisch, leren)

**Drie complexiteiten:**
- O(b^d): pure minimax
- O(b^(d/2)): alpha-bèta in het beste geval
- O(1) gemiddeld: toegang transpositietabel

**Drie namen:** Turing, Shannon, Silver (DeepMind).

**Drie sleutelwoorden:** recursie, memoïsatie, reinforcement.

## Tips om te slagen op de grote dag

### Houding en stem

Je staat gedurende de eerste vijf **minuten** van je presentatie. De **houding** telt meer dan je denkt: voeten stevig op schouderbreedte, handen zichtbaar (**niet** in je zakken), blik verdeeld tussen de **twee** juryleden.

Vermijd te snel **spreken**: angst versnelt altijd. Herken een precies technisch feit ("de vertakkingsfactor is 35") en gebruik het als baken om te vertragen. Als je merkt dat je te snel gaat, las na elk sleutelgetal een korte pauze in.

### Stressbeheersing voor de proef

**Stress** voor het **mondeling** is normaal. Drie snelle technieken:

1. **Vierkante ademhaling**: 4 seconden inademen, 4 seconden pauze, 4 seconden uitademen, 4 seconden pauze. Drie cycli, net voor je naar binnen gaat.
2. **Lichamelijke verankering**: voel je voeten op de grond, bal je vuisten 5 seconden en laat los. Herverbind met je lichaam.
3. **Mentaal herhalen van je opening**: de eerste zin moet automatisch zijn. Als je zonder aarzelen begint, volgt de rest vanzelf.

### Wat je absoluut moet vermijden

- **Je aantekeningen lezen** tijdens de presentatie: gediskwalificeerd. Je mag ze bij je hebben, maar nauwelijks bekijken.
- **"Ik weet het niet" antwoorden** zonder iets voor te stellen. Geef de voorkeur aan "ik ben er niet zeker van, maar ik zou zeggen dat...". De **jury** waardeert de poging.
- **Kritiek geven op het onderwerp** of zeggen dat je je specialisatie niet leuk vindt. Je hebt dit **onderwerp** gekozen, verdedig het.
- **De tijd overschrijden**: op precies 5 minuten moet je afronden, ook als je **niet** klaar bent. Anders onderbreekt de **jury** je.

### Link met je studiekeuzeproject

De laatste vijf **minuten** gaan over je project na het eindexamen. Bereid een korte, samenhangende **reactie** voor:

- Als je een **technische universiteit** wilt: "Dit **onderwerp** heeft me kennis laten maken met geavanceerde algoritmiek, en dat is wat ik verder wil verdiepen in een vooropleiding of technische universiteit."
- Als je hbo-informatica wilt: "Ik vond het leuk om concrete code te maken, en ik wil doorgaan in een opleiding die de praktijk vooropstelt."
- Als je wiskunde-informatica wilt studeren: "De wiskundige modellering van **complexiteit** interesseerde me, ik wil dat verder verdiepen aan de universiteit."

**Advies**: lieg **niet** over je project. De **jury** voelt inconsistentie aan. Eerlijkheid over je twijfels werkt beter dan een verzonnen project.

## De grote dag: checklist

**De avond ervoor:**
- [ ] Het afdrukbare spiekbriefje herlezen (maximaal vijf minuten, **niet** meer)
- [ ] De kleding klaarleggen (nette broek plus overhemd/blouse; **geen** gescheurde spijkerbroek)
- [ ] Het tijdstip en adres van de oproep controleren
- [ ] Vroeg naar bed (**stress** verstoort de slaap al genoeg)

**'s Ochtends:**
- [ ] Normaal eten (**niet** meer, **niet** minder; een lege maag versterkt de **stress**)
- [ ] 30 minuten van tevoren aankomen
- [ ] Water in de wachtruimte, **geen** koffie op een lege maag

**Tijdens de proef:**
- [ ] Voorbereidingsfase: 20 minuten om te kiezen en te organiseren. Verspil **niet** meer dan 2 minuten aan het kiezen.
- [ ] Presentatie: 5 minuten staand, rustige stem, verdeelde blik.
- [ ] Gesprek: 10 minuten. Als je een **vraag** **niet** begrijpt, laat hem herformuleren.
- [ ] **Studiekeuze**: 5 minuten. Blijf consistent met je studiekeuzedossier.

**Daarna:**
- Geen enkele actie meer nodig. De **jury** overlegt, jij hebt niets meer te doen.

## Bronnen en referenties

- **Shannon, C. E. (1950).** *Programming a Computer for Playing Chess.* *Philosophical Magazine*, 41(314). (Basis van het minimax-algoritme toegepast op schaken.)
- **Silver, D., et al. (DeepMind, 2018).** [*A general reinforcement learning algorithm that masters chess, shogi, and Go.*](https://www.science.org/doi/10.1126/science.aar6404) *Science*, 362(6419). (AlphaZero: reinforcement learning en MCTS.)
- **Knuth, D. & Moore, R. (1975).** [*An Analysis of Alpha-Beta Pruning.*](https://www.sciencedirect.com/science/article/pii/0004370275900193) *Artificial Intelligence*, 6(4), 293-326. (Formele analyse van de complexiteit van alpha-bèta-snoeiing.)
- **Zobrist, A. L. (1970).** *A New Hashing Method with Application for Game Playing.* ICCA Journal. (Uitvinding van Zobrist-hashing voor transpositietabellen.)
- **Bulletin officiel, Note de service 2020-014.** [Reglement van de Grand Oral bij het Franse algemene eindexamen.](https://www.education.gouv.fr/bo/) (Officieel kader van de proef.)
- **Documentatie Stockfish.** [*Stockfish Chess Engine: broncode.*](https://github.com/official-stockfish/Stockfish) GitHub. (Broncode van de opensource-engine, referentie voor de echte implementatie.)
- **Lichess Open Database.** [*lichess.org/database*](https://database.lichess.org). (Openbare database van schaakpartijen in PGN-formaat.)
- **Sadler, M. & Regan, N. (2019).** *Game Changer: AlphaZero's Groundbreaking Chess Strategies.* New In Chess. (Diepgaande analyse van de speelstijl van AlphaZero, toegankelijk voor scholieren.)
