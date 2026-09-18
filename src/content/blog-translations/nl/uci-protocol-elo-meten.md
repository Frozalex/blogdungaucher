---
title: "UCI spreken en je Elo meten: de engine verlaat de terminal"
excerpt: >-
  Een honderdtal regels scheiden een Python-script van een engine die je laadt in een echte
  schaakinterface. En eenmaal aangesloten, blijft er nog maar één vraag over die echt telt: hoeveel is hij
  waard? Met zijn foutmarge, anders betekent het cijfer niets.
seoTitle: "UCI-protocol in Python en het meten van de Elo van een schaakengine"
seoDescription: >-
  Het UCI-protocol implementeren in Python om je engine aan te sluiten op een schaakinterface, en dan
  zijn echte sterkte meten tegen een verzwakte Stockfish, met betrouwbaarheidsinterval.
frSlug: protocole-uci-python-et-mesurer-son-elo
draft: false
faq:
  - question: "Hoe sluit je een Python-engine aan op een schaakinterface?"
    answer: >-
      De interface start de engine als een gewoon programma en communiceert met hem via zijn standaard
      invoer en uitvoer. Onder Linux of macOS volstaat het het script als UCI-engine te declareren, ervoor
      te zorgen dat het uitvoerbaar is en begint met een regel <code>#!/usr/bin/env python3</code>; onder
      Windows declareer je de interpreter met het script als argument.
  - question: "Welke UCI-commando's moet je minstens implementeren?"
    answer: >-
      Zes: <code>uci</code> (jezelf voorstellen), <code>isready</code> (synchroniseren),
      <code>ucinewgame</code> (opnieuw beginnen), <code>position</code> (de stelling ontvangen),
      <code>go</code> (nadenken en antwoorden met <code>bestmove</code>) en <code>quit</code>. Al de rest
      (opties, <code>ponder</code>, <code>stop</code>) is optioneel voor een eerste engine.
  - question: "Waarom blokkeert mijn engine de interface?"
    answer: >-
      Drie oorzaken, in volgorde van frequentie. Een niet-geleegde buffer: het antwoord wordt geschreven
      maar nooit verzonden. Een ontbrekende <code>bestmove</code> in een bijzonder geval, typisch een
      stelling zonder legale zet, en de interface wacht oneindig. Of een regel geschreven op de standaard
      uitvoer die niet tot het protocol behoort, vaak een vergeten debug-<code>print</code>.
  - question: "Hoe meet je de Elo van je engine?"
    answer: >-
      Door hem een even aantal partijen te laten spelen tegen een tegenstander met bekende Elo, met
      afwisselende kleuren, in identiek tempo. De score wordt omgezet in een Elo-verschil via de logistieke
      formule $-400 \log_{10}(1/p - 1)$, waarbij $p$ de score als proportie is. Stockfish met
      <code>UCI_LimitStrength</code> levert deze gekalibreerde tegenstander, van 1320 tot 3190 Elo.
  - question: "Hoeveel partijen zijn nodig voor een betrouwbare Elo-meting?"
    answer: >-
      Veel meer dan je zou denken. Op twintig partijen overschrijdt het betrouwbaarheidsinterval van 95%
      makkelijk tweehonderd Elo-punten, wat nauwelijks toelaat een clubengine van een beginner te
      onderscheiden. De serieuze tests van Stockfish tellen tienduizenden partijen, omdat ze verschillen
      van twee of drie punten proberen te detecteren.
---

De engine van deze serie kan alles, behalve met iemand praten. Hij leeft in een script, speelt tegen zichzelf, en toont zijn resultaten in een terminal. Dit laatste artikel haalt hem daaruit, en beantwoordt dan de enige overgebleven vraag: **hoeveel is hij waard?**

## UCI, of waarom er geen interface te schrijven valt

*Universal Chess Interface*, gepubliceerd door Stefan Meyer-Kahlen in 2000. Het protocol heeft een kwaliteit die zijn universele adoptie verklaart: het is **tekst**. De interface schrijft regels op de standaard invoer van de engine, de engine antwoordt op zijn standaard uitvoer. Niets anders.

Direct gevolg: elke taal die op de console kan schrijven, kan UCI spreken. En vooral, je hebt **geen grafische interface te schrijven**. Arena, Cute Chess, Banksia, Nibbler en de anderen weten al hoe ze je engine moeten gebruiken, op voorwaarde dat hij de conventie respecteert.

Zes commando's volstaan.

| Commando | Wat het vraagt | Verwacht antwoord |
|---|---|---|
| `uci` | Stel jezelf voor | `id name`, `id author`, dan `uciok` |
| `isready` | Ben je klaar? | `readyok` |
| `ucinewgame` | Nieuwe partij | niets |
| `position ...` | Hier is de stelling | niets |
| `go ...` | Denk na | regels `info`, dan `bestmove` |
| `quit` | Stop | niets |

## De drie regels die je niet overtreedt

Elk komt overeen met een bug die de interface blokkeert, zonder foutmelding, tot de gebruiker het proces afsluit.

**De buffer legen.** Python bufferiseert zijn standaard uitvoer zodra die geen terminal is, wat precies het geval is wanneer een interface de engine start. Zonder `flush()` wordt het antwoord geschreven en nooit verzonden.

```python
def ecrire(ligne):
    sys.stdout.write(ligne + "\n")
    sys.stdout.flush()
```

**Niets schrijven buiten het protocol.** Een verdwaalde debug-`print`, en de interface ontvangt een regel die ze niet begrijpt. De goede interfaces herstellen zich, de andere breken de communicatie af. Het protocol voorziet `info string` voor alles wat je tegen mensen wilt zeggen.

**Altijd antwoorden met `bestmove`.** Bij elke `go`, wat er ook gebeurt. Inclusief bij een stelling zonder legale zet, waar het conventionele antwoord `bestmove (none)` is.

```python
coup, _, _, _, _ = chercher(echiquier, budget, profondeur_max, rapporter=rapporter)
# Même sans coup légal, l'interface DOIT recevoir une réponse.
ecrire(f"bestmove {coup if coup else '(none)'}")
```

Dit laatste geval is degene die je nooit test, omdat een normale interface geen `go` stuurt op een matte stelling. Behalve in analyse, waar de gebruiker perfect kan teruggaan in een partij tot aan het uiteindelijke mat.

## De tijd vertalen

De interface stuurt geen diepte, ze stuurt een klok:

```text
go wtime 248000 btime 251000 winc 3000 binc 3000
```

Tweehonderdachtenveertig seconden voor wit, met drie seconden increment per zet. Rest er een budget uit te halen, wat de regel uit het vorige artikel hervat:

```python
cle = "wtime" if trait_blanc else "btime"
restant = int(arguments[arguments.index(cle) + 1]) / 1000
...
return max(0.05, restant / DIVISEUR_DE_TEMPS + increment * 0.8)
```

Merk de `max(0.05, ...)` op. Aan het einde van een bliksempartij kan `restant / 30` drie milliseconden waard zijn, en een zoekfunctie die geen tijd heeft voor iets geeft eender wat terug. De ondergrens garandeert minstens een volledige diepte 1.

## Het protocol verifiëren door de interface te spelen

Een UCI-engine test je door hem te besturen zoals een interface dat zou doen: je start hem als subproces, stuurt hem opdrachten, controleert zijn antwoorden. De scheidsrechter blijft Stockfish, aan wie je vraagt of de teruggegeven zet legaal is.

```text
$ STOCKFISH=... python3 verifier_uci.py
  OK   uci -> uciok
  OK   id name annoncé
  OK   id author annoncé
  OK   isready -> readyok
  OK   readyok après ucinewgame
  OK   coup légal après « position startpos »
  OK     lignes info émises
  OK   coup légal après « position startpos moves e2e4 e7e5 g1f3 »
  OK     lignes info émises
  OK   coup légal après « position fen r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5 »
  OK     lignes info émises
  OK   coup légal après « position fen 8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w »
  OK     lignes info émises
  OK   go movetime 200 respecté
  OK   go movetime 1000 respecté
  OK   go depth 1 répond vite
  OK   bestmove même sans coup légal
  OK   aucune ligne parasite

Protocole conforme.
```

### Wat deze test me over mijn eigen engine leerde

Bij het schrijven van deze test koos ik als testgeval stelling 3 van `perft` gevolgd door een zet, en nam ik de eerste zet die me natuurlijk leek: `b5b6`, een pionopstoot.

De engine crashte, met een onverwachte fout: **"geen witte koning op het bord"**.

Uitleg. In deze stelling is de pion op b5 gepend door de zwarte toren op h5 tegenover de witte koning op a5. `b5b6` is dus illegaal: het stelt de koning bloot. Onze UCI-implementatie past de ontvangen zetten echter toe zonder ze te controleren; de zoekfunctie verkende vervolgens een stelling waarin de witte koning geslagen kon worden, werd geslagen, en de functie die de koning zoekt faalde.

Is dit een bug? **Nee, het is een conventie**, en ze is opzettelijk. Een UCI-engine vertrouwt de interface: de legaliteit van elke ontvangen zet controleren zou een volledige generatie per zet kosten bij het laden van een partij van honderd zetten, om zich te wapenen tegen een geval dat nooit voorkomt met een correcte interface.

Maar het is een conventie die je moet kennen, omdat ze de kleinste typfout in een handmatig getypt commando omzet in een onbegrijpelijke crash. Daarom verdient het ook dat de foutmelding expliciet is: `case_du_roi` gooit een genoemde uitzondering in plaats van `None` terug te geven en de bug vijf functies verder te laten voortplanten.

## De Elo meten

Rest de vraag. Stockfish weet zich op gekalibreerde wijze te verzwakken:

```text
option name UCI_LimitStrength type check default false
option name UCI_Elo type spin default 1320 min 1320 max 3190
```

De schaal begint bij 1320, ongeveer het niveau van een beginnende clubspeler. Dat is de zwakste tegenstander die je hem kunt vragen te zijn, en dat is degene die we nodig hebben.

De methode is die van alle enginetests: een even aantal partijen, afwisselende kleuren om het voordeel van wit te annuleren, identiek tempo aan beide kanten. De score wordt omgezet in een Elo-verschil via de standaard logistieke formule:

$$\Delta_{\text{Elo}} = -400 \log_{10}\left(\frac{1}{p} - 1\right)$$

waarbij $p$ de score als proportie is. Een score van 50% geeft een nulverschil, 75% geeft ongeveer +191.

### De juiste tegenstander vinden

Eerste poging, aan de onderkant van de schaal. Twee partijen volstaan om te begrijpen dat we het verkeerde niveau kozen:

```text
$ STOCKFISH=... python3 match_stockfish.py 1320 1 0.5
Gaucher 1.0 contre Stockfish bridé à 1320 Elo
  score : 2.0 / 2 (100.0 %)
  Score extrême : l'écart Elo n'est pas mesurable, il est seulement
  au-dessus de 120 points. Il faut un adversaire mieux calibré.
```

Een perfecte score levert geen enkele meting op: de logistieke formule divergeert, en alles wat je kunt zeggen is "sterker dan dit". Gaan we naar 1900:

```text
$ STOCKFISH=... python3 match_stockfish.py 1900 2 0.5
  score : 0.0 / 4 (0.0 %)
  Score extrême : l'écart Elo n'est pas mesurable, il est seulement
  en dessous de 241 points.
```

Te sterk in de andere richting, en even onbruikbaar. Onze engine bevindt zich ergens tussen beide. Mikken we op het midden.

### De meting

```text
$ STOCKFISH=... python3 match_stockfish.py 1600 6 0.5
Gaucher 1.0 contre Stockfish bridé à 1600 Elo
cadence : 0.50 s par coup des deux côtés, 12 parties

  score : 3.0 / 12 (25.0 %)
  2 victoires, 2 nulles, 8 défaites
    échec et mat                 10
    triple répétition            2

  écart Elo : -191 ± 227
  Elo estimé de Gaucher 1.0 : 1409 ± 227
  (intervalle à 95 % : 1182 à 1636)
```

Daar is het cijfer, en daar is vooral zijn marge.

**Ongeveer 1400 Elo**, tegen een halve seconde per zet, over een dozijn partijen. Dat is het niveau van een clubspeler die de regels kent, zijn stukken niet dom weggeeft, en verslagen wordt door eender wie getraind. Het is ook, zeer waarschijnlijk, sterker dan de auteur van deze regels in bullet.

En twee van de twaalf partijen eindigen in remise door **drievoudige zetherhaling**: de engine, in gewonnen of verloren stelling, draait rond bij gebrek aan een idee wat te ondernemen. Dat is het klassieke symptoom van een evaluatie zonder voortgangsbegrip, en dat is wat een transpositietabel gecombineerd met een eindspelevaluatie zou verbeteren.

## Waarom de foutmarge niet decoratief is

Dit is het punt waarop je streng moet zijn, omdat het daar is dat Elo-aankondigingen folklore worden.

Een matchresultaat is een steekproef. Op twintig partijen overschrijdt het betrouwbaarheidsinterval van 95% makkelijk tweehonderd Elo-punten. Tweehonderd punten, dat is het verschil tussen een clubspeler en een bevestigde toernooispeler: het valt dus te stellen dat de meting bijna niets toelaat te beweren.

Om de schaal te geven: de non-regressietests van Stockfish tellen **tienduizenden partijen**, omdat ze verschillen van twee of drie Elo-punten proberen te detecteren. Onze eigen meting zegt één ding, en slechts één, maar ze zegt het eerlijk: de orde van grootte, met haar grenzen.

Een engine waarvan de auteur "ongeveer 2000 Elo" aankondigt zonder de tegenstander, het tempo, of het aantal partijen te preciseren, heeft niet veel gemeten.

## Wat je gebouwd hebt

Twaalf artikelen, enkele honderden regels Python zonder een enkele afhankelijkheid, en een complete schaakengine:

- een mailbox 10x12-voorstelling, waarvan de FEN-heen-en-terug geverifieerd is op 1498 stellingen;
- een legale-zettengenerator bewezen exact via `perft` op zes referentiestellingen, ofwel **41.812.668 opgesomde stellingen zonder een verschil van één eenheid**;
- een materiële en positionele evaluatie, symmetrisch door constructie;
- een negamax-zoekfunctie met alfa-bèta-snoeien, MVV-LVA-ordening, killers en geschiedenis;
- een iteratieve verdieping die een tijdsbudget respecteert;
- een quiescence-zoekfunctie die het horizoneffect onderdrukt;
- een conforme UCI-interface, getest door de engine te besturen zoals een grafische interface dat zou doen.

En vooral, bij elke stap, een manier om te weten of het klopte. Dat is wat een schaakengine onderscheidt van een programma dat eruitziet alsof het schaakt: beide lijken enorm op elkaar, tot de dag dat je gaat tellen.

## En nu

Drie richtingen, in volgorde van winst-inspanningsverhouding.

**Transpositietabellen.** Dezelfde stelling wordt bereikt via verschillende zetvolgordes; ze herberekenen is een aanzienlijke verspilling. Een Zobrist-hashtabel, die de al berekende score voor elke stelling onthoudt, is verreweg de grootste overgebleven winst.

**Null move-snoeien.** De tegenstander twee keer na elkaar laten spelen, en als de stelling ondanks dit geschenk goed blijft, de tak afsnijden. Enkele regels, meerdere honderden Elo-punten, en een valstrik bij zugzwang.

**Een andere taal.** Op een gegeven moment wordt de echte grens Python. De hier geschreven engine draait rond de 3000 stellingen per seconde; hetzelfde algoritme in C of Rust zou er honderd keer meer doen. Maar dan weet je precies wat je herschrijft, en dat was het hele doel van deze serie.
