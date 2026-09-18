---
title: "Zetten ordenen: de optimalisatie die het algoritme niet aanraakt"
excerpt: >-
  Alfa-bèta kan alleen afkappen als het al iets goeds heeft gevonden. Veelbelovende zetten eerst
  aanbieden verandert geen regel van de zoekopdracht en verdeelt toch de boom. Drie heuristieken
  volstaan, waarvan er een neerkomt op een vermenigvuldiging met tien.
seoTitle: "Zetordening van een schaakengine: MVV-LVA, killers"
seoDescription: >-
  Hoe je zetten ordent om alfa-bèta snoeien effectief te maken: MVV-LVA op slagzetten, killer moves,
  historiekheuristiek. Meting van de winst in knopen en bereikte diepte.
frSlug: ordonnancement-des-coups-moteur-echecs
draft: false
faq:
  - question: "Wat is MVV-LVA?"
    answer: >-
      <em>Most Valuable Victim, Least Valuable Attacker</em>: eerst proberen het duurste stuk te
      slaan met het goedkoopste. De score wordt geschreven als
      <code>10 × waarde(slachtoffer) - waarde(aanvaller)</code>; de factor tien garandeert dat de
      waarde van het slachtoffer altijd domineert, zodat "dame geslagen door pion" altijd vóór "pion
      geslagen door dame" komt, welke stukken er ook in het spel zijn.
  - question: "Wat is een killer move?"
    answer: >-
      Een <strong>stille</strong> zet (zonder slag) die elders in de boom, op dezelfde ply, een
      alfa-bèta-afkapping heeft veroorzaakt. Het idee is dat een zet die een lijn weerlegt vaak ook
      een naburige lijn weerlegt: dezelfde vork, dezelfde matdreiging. Er worden er twee per ply
      bewaard, en ze worden direct na de slagzetten geprobeerd.
  - question: "Waarom beloont de historiekheuristiek met het kwadraat van de diepte?"
    answer: >-
      Omdat een afkapping dicht bij de wortel een gigantische deelboom elimineert, terwijl een
      afkapping in de bladeren bijna niets elimineert. Wegen met <code>diepte²</code> zorgt ervoor
      dat de nuttige zetten bovenaan de boom de tabel domineren, zonder dat ze vaak moet worden
      gereset.
  - question: "Kost het ordenen van zetten niet meer dan het oplevert?"
    answer: >-
      Een dertigtal zetten bij elk knooppunt sorteren is niet gratis, en daarom is de juiste maatstaf
      niet het aantal knopen maar de <strong>bereikte diepte bij vaste tijd</strong>. In de praktijk
      overtreft de snoeiwinst ruimschoots de sorteerkosten, omdat één vermeden knoop de hele deelboom
      eronder bespaart.
  - question: "Verandert de ordening de gespeelde zet?"
    answer: >-
      Ze verandert nooit de teruggegeven score bij gelijke diepte: het is dezelfde alfa-bèta, dus
      dezelfde garantie als in het vorige artikel. Ze kan een andere zet teruggeven bij gelijkspel.
      Ze verandert echter wel degelijk het praktische spel van de engine, omdat ze bij gelijke tijd
      dieper laat zoeken.
---

Het [vorige artikel](/fr/blog/negamax-et-elagage-alpha-beta-python/) eindigde met een frustrerende vaststelling. Het alfa-bèta snoeien leverde ons een factor 22 winst op op een positie, terwijl de theorie veel meer toestaat. De berekening van Knuth en Moore zegt dat met een perfecte zetvolgorde het aantal bezochte posities daalt van $b^d$ naar ongeveer $b^{d/2}$, wat neerkomt op het verdubbelen van de bereikbare diepte.

We zijn daar ver van verwijderd, om een reden die niets algoritmisch heeft: onze zetten worden onderzocht in de volgorde waarin de generator ze produceert, dat wil zeggen per vertrekveld, van a8 naar h1. Deze volgorde heeft **geen enkel verband** met de kwaliteit van de zetten.

Dit artikel verandert geen regel van de zoekopdracht. Het verandert alleen de volgorde waarin de zetten worden aangeboden.

## Waarom de volgorde alles beslist

Herinner je het mechanisme van de afkapping. Alfa-bèta geeft een tak op zodra een zet `beta` overschrijdt, dat wil zeggen zodra hij **te goed** is opdat de tegenstander de partij daar zou laten komen.

Daarvoor moet je echter al iets goeds hebben gevonden. Als de beste zet als eerste wordt onderzocht, stijgt `alpha` onmiddellijk, vernauwt het venster zich, en worden alle volgende zetten in enkele knopen weerlegd. Als de beste zet als laatste wordt onderzocht, blijft `alpha` laag tijdens de hele verkenning, treedt geen enkele afkapping op, en bezoek je exact dezelfde boom als minimax, maar trager.

Het probleem is dus: **raden welke zetten goed zijn, voordat je ze hebt gezocht**. Wat op een paradox lijkt, en wordt opgelost met drie grove heuristieken.

## MVV-LVA: de slagzetten, van de sappigste naar de riskantste

*Most Valuable Victim, Least Valuable Attacker*. Het duurste stuk slaan met het goedkoopste.

De intuïtie is onmiddellijk: een dame slaan met een pion is bijna altijd uitstekend, een pion slaan met een dame is bijna altijd twijfelachtig. Rest om het zo te schrijven dat alle combinaties correct worden gerangschikt.

```python
return 1_000_000 + 10 * VALEURS[victime.upper()] - VALEURS[agresseur.upper()]
```

De factor **tien** is wat de formule laat werken. Ze garandeert dat de waarde van het slachtoffer altijd die van de aanvaller domineert: de slechtste damebuit (dame geslagen door dame, $10 \times 900 - 900 = 8100$) blijft hoger gerangschikt dan de beste torenbuit (toren geslagen door pion, $10 \times 500 - 100 = 4900$). Zonder deze factor zouden beide criteria door elkaar lopen.

Het is een ronduit rudimentaire heuristiek. Ze negeert volledig of het aankomstveld verdedigd is: "dame slaat pion verdedigd door pion" wordt vóór veel goede zetten gerangschikt. Er bestaat beter, de statische uitwisseling (*SEE*), die de hele reeks slagzetten op een veld simuleert. Maar MVV-LVA vereist slechts twee tabelopzoekingen, en het grootste deel van het voordeel is er al.

## De killers: wat een lijn weerlegt, weerlegt een andere

De slagzetten gerangschikt, blijven de stille zetten over, dat wil zeggen de overweldigende meerderheid. Hoe sorteer je die?

De observatie die de heuristiek van de zogenaamde *killer moves* onderbouwt: wanneer een zet op één plek in de boom een afkapping veroorzaakt, veroorzaakt hij **vaak dezelfde afkapping in de naburige posities**. Een paardvork die een variant weerlegt, weerlegt meestal ook de variant ernaast, waar de tegenstander elders iets anders heeft gespeeld.

```python
def retenir_killer(self, coup, ply):
    etage = self.killers[ply]
    if coup != etage[0]:
        etage[1] = etage[0]
        etage[0] = coup
```

Twee killers per ply, beheerd als een minuscule stapel. Eén detail telt: ze worden geïndexeerd op **`ply`**, de afstand tot de wortel, en niet op de resterende diepte. Wat een lijn drie halve zetten van de wortel weerlegt, heeft kans om een andere lijn op dezelfde plek in de partij te weerleggen, niet in een heel andere sector van de boom.

Tweede detail: er worden alleen **stille** zetten bewaard. De slagzetten zijn al goed gerangschikt door MVV-LVA; ze bovendien onthouden zou alleen de nuttige informatie verdunnen.

## De historiek: een lang geheugen

De killers zijn een lokaal geheugen, twee zetten per ply. De historiekheuristiek is de globale versie ervan: een teller per koppel (vertrekveld, aankomstveld), verhoogd bij elke afkapping, geldig voor de hele zoekopdracht.

```python
def recompenser(self, coup, profondeur):
    cle = (coup.depart, coup.arrivee)
    self.historique[cle] = self.historique.get(cle, 0) + profondeur * profondeur
```

De beloning is het **kwadraat van de resterende diepte**, niet de diepte zelf. De reden is een schaalkwestie: een afkapping gevonden dicht bij de wortel elimineert een gigantische deelboom, een afkapping gevonden net boven de bladeren elimineert bijna niets. Zonder deze weging zou de tabel overspoeld worden door de duizenden oninteressante afkappingen van de diepe niveaus.

Het geheel geeft een sorteerfunctie die in vijftien regels past:

```python
def score(coup):
    victime = echiquier.cases[coup.arrivee]
    agresseur = echiquier.cases[coup.depart]

    if victime is VIDE and agresseur in "Pp" and coup.arrivee == echiquier.en_passant:
        return 1_000_000 + 10 * VALEURS["P"] - VALEURS["P"]
    if victime is not VIDE:
        return 1_000_000 + 10 * VALEURS[victime.upper()] - VALEURS[agresseur.upper()]
    if coup.promotion:
        return 900_000 + VALEURS[coup.promotion.upper()]
    if coup in contexte.killers[ply]:
        return 800_000
    return contexte.historique.get((coup.depart, coup.arrivee), 0)
```

Het geval van de en-passantslag verdient zijn eigen regel: het aankomstveld is leeg, dus de test `victime is not VIDE` zou hem missen, en hij zou als een stille zet worden gerangschikt. Niet dramatisch, maar precies het soort vergissing waardoor een heuristiek "niet zo goed werkt als in het artikel".

## De bug die deze regel wakker maakte

```python
if coup in contexte.killers[ply]:
```

Deze schijnbaar onschuldige regel liet de engine crashen bij de eerste poging:

```text
AttributeError: 'NoneType' object has no attribute 'depart'
```

De killertabel is geïnitialiseerd op `None`, aangezien er nog geen afkapping heeft plaatsgevonden. De operator `in` vergelijkt onze zet dus met `None`, wat de methode `__eq__` aanroept die in artikel 2 werd geschreven:

```python
def __eq__(self, autre):
    return (self.depart, self.arrivee, self.promotion) == (
        autre.depart, autre.arrivee, autre.promotion
    )
```

Die veronderstelt dat de andere operand een zet is. Ze heeft zeven artikelen probleemloos doorstaan, omdat tot nu toe alleen zetten met zetten werden vergeleken.

De correctie past in twee regels, en het is de moeite waard te begrijpen waarom het niet `return False` is:

```python
def __eq__(self, autre):
    if not isinstance(autre, Coup):
        return NotImplemented
    return (self.depart, self.arrivee, self.promotion) == (
        autre.depart, autre.arrivee, autre.promotion
    )
```

`NotImplemented` zegt Python "ik weet niet hoe ik deze twee objecten moet vergelijken, probeer anders". Python probeert dan de symmetrische vergelijking, mislukt ook daar, en valt terug op identiteitsgelijkheid, wat `False` oplevert. Met `return False` zou je hier hetzelfde resultaat krijgen, maar je zou een toekomstige klasse verbieden om zijn eigen gelijkheid met een `Coup` te definiëren. Dat is de Python-conventie, en ze kost één woord.

## De meting

Twee cijfers zijn mogelijk, en ze vertellen niet hetzelfde verhaal.

Het eerste is het **aantal knopen bij vaste diepte**. Dat is de zuivere maatstaf: de teruggegeven score moet identiek blijven, alleen de doorzochte boom verandert. Maar ze bevoordeelt de ordening, omdat ze de kosten van het sorteren zelf niet meetelt.

Het tweede is de **bereikte diepte bij vast tijdsbudget**. Dat is de eerlijke maatstaf, en de enige die telt voor een speler. Een dertigtal zetten bij elk knooppunt sorteren kost, en er moet worden gecontroleerd of het de moeite waard is.

```text
$ python3 banc_ordonnancement.py 4 5 12
12 posities

Bij vaste diepte 4
  zonder sortering    405660 knopen     251.7 s
  met sortering         66886 knopen      33.8 s
  winst : 6.1x op knopen, 7.5x op tijd
  identieke scores : 12/12

Met een budget van 5 s per positie
  zonder sortering  gemiddelde diepte 3.58  (min 3, max 6)
  met sortering     gemiddelde diepte 4.08  (min 3, max 6)
  6 halve zetten diepte gewonnen in totaal over 12 posities
```

Zes keer minder bezochte posities voor hetzelfde resultaat, en de scores blijven identiek: de ordening heeft niets veranderd aan wat de engine denkt, alleen aan wat het hem kost.

Eén detail verdient aandacht: de winst in tijd (7,5x) overtreft de winst in knopen (6,1x), terwijl het sorteren extra werk kost bij elk knooppunt. Dat is geen anomalie. De knopen die door het snoeien worden geëlimineerd, zijn geen gemiddelde knopen: het zijn die uit het diepste deel van de boom, de talrijkste en de duurste om te verwerken aangezien elk een volledige zetgeneratie vereist. Een diepe knoop besparen is meer waard dan een knoop dicht bij de wortel besparen.

## Een halve diepte, en waarom dat al veel is

De tweede tabel is aanzienlijk minder spectaculair, en die vertelt de waarheid.

Zes keer minder knopen geeft geen zes keer meer diepte, maar **een halve diepte** gemiddeld: 3,58 zonder sortering, 4,08 met sortering. Over twaalf posities, zes halve zetten in totaal gewonnen.

De teleurstelling is rekenkundig. Met een effectieve vertakkingsfactor van ongeveer 5 na snoeien, vereist het winnen van een volledige halve zet diepte dat het werk door 5 wordt gedeeld. Onze factor 6 geeft ons dus amper meer dan één, en nog niet eens overal: op de twaalf geteste posities beweegt de bereikte diepte niet overal.

En toch, een halve diepte, in de praktijk, is enorm. Dat is het verschil tussen de paardvork zien en hem niet zien. Elke halve zet extra vooruitzicht is, volgens de gangbare schattingen, tussen de 50 en 100 Elo-punten waard op dit spelniveau.

Dat is ook de algemene les van al het optimalisatiewerk dat volgt: **de winsten worden geteld in vermenigvuldigende factoren op de knopen en betaald in fracties van diepte.** Een engine die een factor 1.000 wint op zijn boom, wint vier diepten, geen duizend.

## De grens van deze meting, en wat het volgende artikel corrigeert

Er zit een onhandigheid in de manier waarop deze test de in vijf seconden bereikte diepte meet, en ze is leerzaam.

Het programma probeert diepte 1, dan 2, dan 3, waarbij de tijden worden opgeteld, en stopt zodra het totaal het budget overschrijdt. Het houdt de laatste **volledig voltooide** diepte. Waarom niet gewoon een diepe zoekopdracht starten en die na vijf seconden stoppen?

Omdat een onderbroken zoekopdracht niets bruikbaars oplevert. Als de engine twaalf van de vijfendertig zetten heeft onderzocht wanneer de tijd om is, is de beste van deze twaalf niet de beste van de vijfendertig, en niets garandeert dat hij zelfs correct is: de drieëntwintig anderen zijn niet gezien.

Dat laat onze engine met een fataal gebrek voor een echte speler: **hij weet niet wanneer hij moet stoppen**. Je geeft hem een diepte, hij geeft een zet terug wanneer hij klaar is, of dat nu een seconde of tien minuten duurt. Geen enkele interface, geen enkel speeltempo werkt zo.

**Volgend artikel:** iteratieve verdieping, die erin bestaat al het werk bij elke diepte over te doen, en die toch sneller is dan rechtstreeks op de uiteindelijke diepte zoeken.
