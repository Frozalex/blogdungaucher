---
title: "Perft: bewijzen dat je zetgenerator klopt"
excerpt: >-
  Een zetgenerator kan exact zijn op duizend posities en fout op de miljoenste. Perft is het antwoord
  op dit probleem: een recursieve telling waarvan de waarden al decennialang gepubliceerd zijn. Als
  jouw getal met één afwijkt, heb je een bug, en een techniek lokaliseert die in enkele minuten.
seoTitle: "Perft bij schaken: je zetgenerator verifiëren in Python"
seoDescription: >-
  Perft, de referentietest van schaakengines: principe, Python-code, zes referentieposities, en de
  divide-techniek om een zetgeneratiebug in enkele minuten te lokaliseren.
frSlug: perft-verifier-son-generateur-de-coups
draft: false
faq:
  - question: "Wat betekent perft precies?"
    answer: >-
      <em>Performance test</em>. De functie <code>perft(n)</code> telt het aantal posities dat
      bereikbaar is in exact n halve zetten vanuit een gegeven positie, waarbij alleen legale zetten
      worden gevolgd. De naam is misleidend: hij wordt veel vaker gebruikt om de
      <strong>correctheid</strong> van een zetgenerator te verifiëren dan om zijn snelheid te meten.
  - question: "Hoeveel posities zijn er na n zetten bij schaken?"
    answer: >-
      Vanaf de startpositie: 20 na een halve zet, 400 na twee, 8.902 na drie, 197.281 na vier,
      4.865.609 na vijf en 119.060.324 na zes. Deze waarden zijn al decennialang gepubliceerd en
      geverifieerd; ze dienen als technische controle voor elke nieuwe engine.
  - question: "Mijn perft klopt op diepte 3 maar niet op diepte 4, waarom?"
    answer: >-
      Omdat een generatiebug alleen verschijnt in de posities die hem triggeren, en die zijn zeldzaam
      bij lage diepte. Het vergeten van en-passant bijvoorbeeld vereist dat een tegenstanderspion twee
      velden vooruit is gegaan vlak naast een van je pionnen: dat vraagt minstens drie of vier halve
      zetten om dit geval te construeren.
  - question: "Hoe vind ik een bug wanneer perft fout is?"
    answer: >-
      Met <code>divide</code>, dat het subtotaal van elke zet geeft in plaats van alleen het totaal.
      Je vergelijkt deze subtotalen met die van een referentie-engine: meestal verschilt er slechts
      één. Je speelt die zet, begint opnieuw op de lagere diepte, en daalt zo af tot de positie waar
      een zet te veel wordt geproduceerd of ontbreekt. Enkele seconden per niveau.
  - question: "Garandeert een correcte perft dat mijn engine correct zal spelen?"
    answer: >-
      Nee, het garandeert alleen dat de <strong>zetgeneratie</strong> correct is, wat al het
      belangrijkste is. Perft kijkt niet naar de vijftigzettenregel, niet naar remise door herhaling,
      niet naar de detectie van mat en pat, en uiteraard niet naar de spelkwaliteit. Die punten
      vragen hun eigen tests.
---

Je zetgenerator produceert exact de juiste zetten op 1.498 echte posities. Dat heeft [het vorige artikel](/fr/blog/generer-les-coups-legaux-en-python/) vastgesteld, over 41.648 zetten één voor één vergeleken met Stockfish.

Dat bewijst bijna niets.

Een generator kan exact zijn op alle posities die je hem voorlegt en fout op de posities die je hem niet voorlegt. Erger: hij kan exact zijn op diepte 1 en fout op diepte 2, als hij een licht foute **positie** produceert waarvan de zetten op zich correct worden gegenereerd. Een vergeten rokaderecht, een verkeerd teruggezette teller, en de fout manifesteert zich pas een niveau lager.

Er bestaat een antwoord op dit probleem, en het is ouder dan de meeste engines.

## Tellen, in plaats van redeneren

Het idee is ontwapenend eenvoudig. Vanuit een positie tel je alle posities die bereikbaar zijn in `n` halve zetten, waarbij je alleen legale zetten volgt. Dat heet `perft`, voor *performance test*, een misleidende naam aangezien het vooral wordt gebruikt om de correctheid te verifiëren.

Dit getal heeft een eigenschap die zeldzaam is in de informatica: **het hangt van geen enkele implementatiekeuze af**. Mailbox of bitboards, Python of C++, legale generatie of gefilterde pseudolegale generatie, iedereen moet hetzelfde getal vinden. Het is een vingerafdruk van de spelregels, niet van jouw programma.

Vanaf de startpositie:

| Diepte | Posities |
|---|---|
| 1 | 20 |
| 2 | 400 |
| 3 | 8.902 |
| 4 | 197.281 |
| 5 | 4.865.609 |
| 6 | 119.060.324 |

De code past in tien regels.

```python
def perft(echiquier, profondeur):
    if profondeur == 0:
        return 1
    coups = echiquier.coups_legaux()
    if profondeur == 1:
        return len(coups)

    total = 0
    for coup in coups:
        echiquier.jouer(coup)
        total += perft(echiquier, profondeur - 1)
        echiquier.annuler()
    return total
```

Eén finesse, het geval `profondeur == 1`. Je zou elke zet kunnen spelen om telkens 1 te tellen, maar het laatste niveau van de boom is verreweg het dichtst bevolkt: bij `perft(5)` vanaf de startpositie bevat het 4,8 miljoen posities op een totaal van 5 miljoen. Direct `len(coups)` teruggeven bespaart dus het grootste deel van de `jouer`/`annuler`-aanroepen. Deze truc heet massatelling, *bulk counting*, en ze halveert ongeveer de tijd.

## De startpositie is de slechtste test

Hier is het punt dat de meeste tutorials missen, en het is centraal.

Neem een heel gewone bug: sub-promoties vergeten. Onze generator produceert vier zetten wanneer een pion de laatste rij bereikt (dame, toren, loper, paard); stel dat hij er maar één produceert, de dame. Dat is de fout die vrijwel iedereen bij de eerste poging maakt.

Voer hem echt in, en laat de zes referentieposities draaien:

```text
Positie                 diepte     verwacht      bekomen     duur     snelheid
----------------------------------------------------------------------------
Startpositie                4       197281       197281      2.2s        90k/s
Kiwipete                    3        97862        97862      1.6s        63k/s
Positie 3                   5       674624       674624     10.5s        64k/s
Positie 4                   4       422333       320802      3.8s        85k/s  <-- FOUT
Positie 5                   3        62379        54007      0.9s        58k/s  <-- FOUT
Positie 6                   3        89890        89890      1.4s        66k/s
```

De startpositie slaagt. Kiwipete slaagt. Posities 3 en 6 slagen. Een engine die alleen op de startpositie wordt getest, gelooft dat hij correct is, en dat is hij niet.

Dat is logisch als je erover nadenkt: opdat een promotie in de boom zou verschijnen vanaf de startpositie, moet een pion vijf rijen oversteken. Op diepte 5 heeft geen enkele pion daar de tijd voor gehad. De bug bestaat, hij ligt gewoon buiten het bereik van de test.

Vandaar de regel: **je test een generator nooit alleen op de startpositie**. De zes onderstaande posities vormen de referentieset die door vrijwel alle engine-auteurs wordt gebruikt, en elk vangt iets anders.

| Positie | Wat ze vangt |
|---|---|
| Startpositie | Het makkelijke geval: geen enkel stuk kan nog iets ingewikkelds doen |
| Kiwipete | Rokades aan beide kanten, penningen, en-passant |
| Positie 3 | Kaal eindspel: eeuwig schaak, en-passant die ontdekt |
| Positie 4 | Promoties in alle richtingen, inclusief sub-promoties met slag |
| Positie 5 | Asymmetrische rokaderechten en naderende promotie |
| Positie 6 | Drukke openingspositie: veel zetten, geen zeldzame gevallen |

De tweede, bedacht door Peter McKenzie, staat bekend als **Kiwipete**. Ze is expres gemeen gemaakt en blijft de meest geciteerde test van het domein.

## Divide: de foutieve zet vinden

Weten dat `perft(4)` 320.802 waard is in plaats van 422.333 zegt niet waar de bug zit. Honderdduizend posities ontbreken, verspreid ergens onbekend in de boom.

De oplossing heet `divide`, en het is een vermomde tweedeling. In plaats van alleen het totaal geef je het subtotaal van **elke zet** van de positie:

```python
def divide(echiquier, profondeur):
    resultats = {}
    for coup in echiquier.coups_legaux():
        echiquier.jouer(coup)
        resultats[str(coup)] = perft(echiquier, profondeur - 1)
        echiquier.annuler()
    return resultats
```

Stockfish produceert exact dezelfde uitvoer met `go perft n`, wat een regel-voor-regel vergelijking mogelijk maakt. Er kunnen zich drie gevallen voordoen:

1. Een zet verschijnt bij ons en niet bij hem: **gevonden**, het is een onterecht geproduceerde illegale zet.
2. Een zet verschijnt bij hem en niet bij ons: **gevonden**, het is een vergeten legale zet.
3. Een zet is aanwezig bij beiden met verschillende subtotalen: de bug zit lager. Je speelt die zet en begint opnieuw op de lagere diepte.

Het derde geval is wat de techniek zo interessant maakt. Bij elk niveau elimineer je de hele boom behalve één tak. Een dertigtal vergelijkingen per niveau, vijf niveaus: de bug is in enkele seconden gevonden, in een zoektocht die anders in dagen zou worden gerekend.

Dat is automatiseerbaar, en het script van het vervolg doet het helemaal alleen. Hier is wat het toont op de hierboven ingevoerde sub-promotiebug:

```text
Positie 4                   4       422333       320802      3.8s        85k/s  <-- FOUT
    b4c5 : 43376 bij ons, 58167 bij Stockfish
    positie    r3k2r/Pppp1ppp/1b3nbN/nPB5/B1P1P3/q4N2/Pp1P2PP/R2Q1RK1 b kq - 1 1
    bereikt via  b4c5
    ontbrekende zetten : b2a1b b2a1n b2a1r b2b1b b2b1n b2b1r

Positie 5                   3        62379        54007      0.9s        58k/s  <-- FOUT
    positie    rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8
    bereikt via  (startpositie van de test)
    ontbrekende zetten : d7c8b d7c8n d7c8r
```

De diagnose staat er letterlijk. `b2a1b`, `b2a1n`, `b2a1r` ontbreken: de zwarte pion op b2 kan de toren op a1 slaan met promotie tot loper, paard of toren, en onze generator biedt alleen de dame aan. Zes ontbrekende zetten in deze positie, en het verschil van honderdduizend posities komt van hun vermenigvuldiging in de boom.

Merk in het voorbijgaan de waarde van het tweede geval op: positie 5 wijkt **al vanaf de wortel** af, zonder dat er afgedaald hoeft te worden. Het bericht zegt het, en de getoonde positie is rechtstreeks die van de test.

## De volledige technische controle

Hier is het resultaat op de echte generator van de reeks, zonder deze keer een bug in te voeren.

```text
$ STOCKFISH=... python3 suite_perft.py
Positie                 diepte     verwacht      bekomen     duur     snelheid
----------------------------------------------------------------------------
Startpositie                5      4865609      4865609     78.8s        62k/s
Kiwipete                    4      4085603      4085603     44.4s        92k/s
Positie 3                   6     11030083     11030083    193.4s        57k/s
Positie 4                   5     15833292     15833292    275.1s        58k/s
Positie 5                   4      2103487      2103487     22.7s        92k/s
Positie 6                   4      3894594      3894594     38.0s       103k/s
----------------------------------------------------------------------------
6/6 posities exact, 654 s in totaal
```

Eenenveertig miljoen achthonderdtwaalfduizend zeshonderdachtenzestig posities opgesomd, één voor één, zonder een afwijking van één eenheid.

Elk getal in de kolom "verwacht" is op het moment van de test aan Stockfish gevraagd, niet overgetypt in het script. Een handmatig overgetypte referentiewaarde is een waarde die je verkeerd kunt overtypen, en een test die een fout valideert is erger dan geen test.

De dieptes zijn niet overal gelijk, en dat is een bewuste toegegeven zwakte. Bij 60.000 posities per seconde zou `perft(5)` op Kiwipete 193 miljoen posities vragen, oftewel bijna een uur; `perft(6)` vanaf de startpositie, een half uur. Voor elke positie wordt dus de grootste diepte gekozen die het totaal onder de elf minuten houdt. De positieset dekt de familie van bugs, wat meer telt dan de ruwe diepte: dat heeft de demonstratie van de sub-promotiebug net getoond, aangezien die op alle diepten van de startpositie onopgemerkt bleef.

De optie `--rapide` haalt bij elke positie één diepte af en brengt het geheel terug tot een twintigtal seconden. Die wordt gebruikt na elke wijziging; de volledige versie af en toe.

## Wat perft niet bewijst

Een test die beweert alles te bewijzen, bewijst niets. Hier is precies wat deze test buiten beschouwing laat.

**De vijftigzettenregel en remise door herhaling.** Perft telt posities, het stopt nooit bij een remise. Onze halve-zettenteller zou volledig fout kunnen zijn zonder dat enige `perft` reageert. Daarom blijft de tweede proef van artikel 2, de heen-en-terugreis `jouer`/`annuler` op de volledige FEN, nodig: die kijkt wel naar deze teller.

**De detectie van mat en pat.** Perft komt daar vanzelf mee overweg, aangezien een positie zonder legale zet gewoon nul bijdraagt. Weten of het een mat of een pat is, is een ander probleem, en dat is dat van het volgende artikel.

**Alles wat met spelkwaliteit te maken heeft.** Evaluatie, zoekopdracht, tijdsbeheer: perft weet daar niets van en zal daar nooit iets van weten.

Wat perft wel bewijst, bewijst het volledig: op deze dieptes, op deze zes posities, produceert je generator exact de volledige verzameling legale zetten, geen een meer, geen een minder. Dat is het enige onderdeel van de engine waarvan je dit kunt beweren.

## De snelheid, nu je die kunt meten

Een woord over het cijfer dat in het eerste artikel werd aangekondigd, dat je nu eindelijk kunt verifiëren.

Onze engine draait tussen de 60.000 en 90.000 posities per seconde. Stockfish, op dezelfde machine, doet `perft(6)` vanaf de startpositie, oftewel 119.060.324 posities, in 1,60 seconde: ongeveer 74 miljoen per seconde.

Een factor duizend, zoals aangekondigd. Die verdeelt zich ongeveer in drie derden: Python tegenover C++, mailbox tegenover bitboards, en ons luie legaliteitsfilter dat elke kandidaatzet speelt en dan terugdraait om zijn legaliteit te controleren. Dit laatste derde is het enige waarop je kunt ingrijpen zonder van taal te veranderen, en artikel 9 pakt dat aan.

Voorlopig heeft snelheid geen enkel belang. Een snelle en foute generator is een foute generator.

## Wat je nu hebt

Een fase 1 afgerond, en een fundament waarvan de correctheid geen mening is. Voorstelling, FEN, `jouer`/`annuler`, generatie van legale zetten, alles bewezen op zes referentieposities en 1.498 partijposities.

Dit is het goede moment voor een bekentenis: niets van wat je tot nu toe hebt geschreven speelt schaak. Je programma weet wat toegestaan is, niet wat goed is. De rest van de reeks doet niets anders meer dan die tweede vraag beantwoorden, en ze begint met de domste manier om dat te doen.

**Volgend artikel:** een engine die willekeurig speelt. Belachelijk, onmisbaar, en al in staat om een volledige partij te verliezen zonder ooit een illegale zet te spelen.
