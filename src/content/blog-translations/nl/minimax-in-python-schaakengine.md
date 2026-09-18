---
title: "Minimax in Python: de engine begint vooruit te kijken"
excerpt: >-
  De hebzuchtige engine zette zijn tegenstander twee van de drie keer pat. Minimax corrigeert dit door
  aan te nemen dat de tegenstander goed speelt. Twintig regels volstaan, en de engine vindt dan alle
  matten in twee zetten. Tegen de prijs van een combinatorische explosie die hem bij de volgende
  diepte abrupt tot stilstand brengt.
seoTitle: "Minimax implementeren in Python voor een schaakengine"
seoDescription: >-
  Het minimax-algoritme coderen in Python voor een schaakengine: recursie, matscores, matafstand,
  testvolgorde, en waarom diepte 5 buiten bereik raakt zonder snoeien.
frSlug: minimax-en-python-moteur-echecs
draft: false
faq:
  - question: "Wat is het verschil tussen minimax en negamax?"
    answer: >-
      Inhoudelijk geen. Minimax schrijft twee takken, een die maximaliseert voor Wit en een die
      minimaliseert voor Zwart, waarbij vanuit het perspectief van Wit wordt geteld. Negamax gebruikt
      de identiteit $\min(a,b) = -\max(-a,-b)$ om slechts één tak te schrijven, geteld vanuit het
      perspectief van de partij aan zet. Het resultaat is identiek; de code telt half zoveel regels.
  - question: "Waarom moet de afstand in de matscore worden verwerkt?"
    answer: >-
      Zonder die afstand zijn alle matten evenveel waard, en heeft de engine geen enkele reden om mat
      in één zet te verkiezen boven mat in drie. In de praktijk draait hij dan rondjes: hij ziet het
      mat, speelt een zet die het behoudt zonder dichterbij te komen, en begint opnieuw. Door
      <code>MAT - afstand</code> te tellen wordt het nabije mat strikt te verkiezen.
  - question: "Tot welke diepte moet je zoeken om een mat in 2 te vinden?"
    answer: >-
      Drie halve zetten: de zet die mat zet in twee, het antwoord van de tegenstander, en dan de
      mattende zet. De algemene regel is <strong>2n-1</strong> halve zetten voor een mat in n zetten.
      Een mat in 3 vereist dus diepte 5, wat zonder snoeien al buiten bereik ligt voor een Python-engine.
  - question: "Waarom ziet mijn engine geen matten terwijl minimax correct is?"
    answer: >-
      Controleer de volgorde van je tests. Als de dieptebegrenzing (<code>if diepte == 0</code>) vóór
      de test op afwezigheid van legale zetten komt, wordt een matstelling die precies op de horizon
      ligt geëvalueerd als een gewone stelling, en wordt de materiële score teruggegeven in plaats van
      de matscore. Het mat bestaat wel in de boom, maar de engine ziet het niet.
  - question: "Garandeert minimax de beste zet?"
    answer: >-
      Het garandeert de beste zet <em>volgens de gebruikte evaluatie en diepte</em>, wat niet hetzelfde
      is. Bij eindige diepte met een heuristische evaluatie is minimax optimaal ten opzichte van zijn
      eigen aannames. Zijn fouten komen altijd van de evaluatie of de horizon, nooit van het algoritme.
---

Het vorige artikel eindigde met een beschamend cijfer: onze hebzuchtige engine, die altijd de zet speelt die het meeste materiaal oplevert, sluit partijen af met **achtentwintig pionnen voorsprong** en wint er maar één op vier. Twee derde van zijn partijen eindigt in pat, omdat hij alles opeet wat beweegt totdat de tegenstander geen enkele legale zet meer heeft.

Het probleem is niet zijn evaluatie. Het probleem is dat hij niet kijkt naar wat er **daarna** gebeurt.

## De aanname die alles verandert

Het idee achter [minimax](/nl/blog/minimax-in-het-schaken/) past in één zin: de beste zet is die welke, **ervan uitgaande dat de tegenstander zo goed mogelijk antwoordt**, leidt naar de beste bereikbare stelling.

Deze aanname is niet onschuldig. Ze is zelfs onjuist in de praktijk, aangezien de tegenstander zelden perfect speelt. Maar het is de enige veilige aanname: een engine die uitgaat van een zwakke tegenstander bouwt vallen die alleen werken als de tegenstander erin trapt, en wordt afgestraft zodra hij tegen iemand correct speelt.

Formeel is het een recurrentie op de resterende diepte:

$$\text{minimax}(p, d) = \begin{cases} \text{eval}(p) & \text{als } d = 0 \\ \max_{z} \text{minimax}(\text{opv}(p,z), d-1) & \text{als Wit speelt} \\ \min_{z} \text{minimax}(\text{opv}(p,z), d-1) & \text{als Zwart speelt} \end{cases}$$

En het pat verdwijnt vanzelf, zonder dat je er iets voor hoeft te doen. Waar de hebzuchtige engine overwoog de laatste zwarte pion te veroveren, evalueerde hij de stelling op +2800 en stopte daar. Minimax duwt een halve zet verder, stelt vast dat de tegenstander dan geen enkele legale zet heeft, herkent een pat, en kent het een score van **nul** toe. De zet die naar het pat leidde, wordt plotseling de slechtste van allemaal.

## De code

Bewust in twee takken geschreven, zo dicht mogelijk bij de definitie. Het volgende artikel condenseert dit.

```python
def minimax(echiquier, profondeur, ply, compteur):
    """Score de la position, DU POINT DE VUE DES BLANCS."""
    compteur[0] += 1

    coups = echiquier.coups_legaux()
    if not coups:
        if echiquier.en_echec(echiquier.trait == "w"):
            return -(MAT - ply) if echiquier.trait == "w" else MAT - ply
        return 0  # pat

    if profondeur == 0:
        return materiel(echiquier)

    if echiquier.trait == "w":
        meilleur = -INFINI
        for coup in coups:
            echiquier.jouer(coup)
            meilleur = max(meilleur, minimax(echiquier, profondeur - 1, ply + 1, compteur))
            echiquier.annuler()
        return meilleur

    meilleur = INFINI
    for coup in coups:
        echiquier.jouer(coup)
        meilleur = min(meilleur, minimax(echiquier, profondeur - 1, ply + 1, compteur))
        echiquier.annuler()
    return meilleur
```

Twintig regels. Drie details maken ze correct, en elk ervan is een klassieke bug als hij ontbreekt.

### De volgorde van de tests

De test "geen legale zet" komt **vóór** de dieptebegrenzing. Dit is geen stijlkeuze.

Als je `if profondeur == 0: return materiel(...)` als eerste schrijft, wordt een matstelling die precies op de horizon ligt geëvalueerd als een gewone stelling: de engine geeft zijn materiële score terug, negeert dat het een mat is, en mist het. Het mat bestaat nochtans wel in de boom. Deze bug is bijzonder vervelend omdat de engine de matten op diepte 3 vindt en ze mist op diepte 2, wat lijkt op een gebrek aan diepte in plaats van een fout.

### De waarde van een mat

```python
MAT = 100_000
```

Honderdduizend honderdsten van een pion, oftewel duizend pionnen. De score van een mat moet elke materiële overweging overtreffen: je geeft een mat niet op om een dame te winnen. Een te kleine waarde, zeg 5.000, en de engine promoveert liever vijf dames dan dat hij mat zet.

### De matafstand

Dit is de parameter `ply`, en het is de subtielste van de drie. De score is niet `MAT` maar `MAT - ply`, waarbij `ply` de afstand tot de wortel is.

Zonder deze parameter zijn alle matten precies evenveel waard, en heeft de engine **geen enkele reden om mat in één zet te verkiezen boven mat in drie**. In de praktijk draait hij dan rondjes: hij ziet het mat, speelt een zet die het behoudt zonder dichterbij te komen, ziet het mat opnieuw, en begint weer. Dit is het gedrag dat je gek maakt, omdat de engine trots vijftig zetten lang een mat aankondigt zonder het ooit uit te voeren, tot remise door herhaling.

## Wat de engine nu ziet

```text
$ python3 recherche.py 4
diepte 1 : a2a3  score      +0.00          20 knopen
diepte 2 : a2a3  score      +0.00         420 knopen
diepte 3 : a2a3  score      +0.00        9322 knopen
diepte 4 : a2a3  score      +0.00      206603 knopen
```

Vanaf de startstelling geven alle dieptes dezelfde score: nul. Dat is normaal, onze evaluatie telt alleen materiaal, en geen van beide partijen kan er iets aan winnen in vier halve zetten. De gekozen zet is de eerste in de lijst bij gelijkspel, bij gebrek aan beter.

Deze cijfers zijn dus niet interessant voor de speelkwaliteit. Ze zijn interessant voor iets anders: **20, dan 420, dan 9.322, dan 206.603**. Bij elke extra halve zet wordt het aantal bezochte stellingen ongeveer met twintig vermenigvuldigd. Dat is de muur, en daar komen we aan het eind op terug.

## De verificatie: 43 geforceerde matten

Een evaluatie kan niet als juist worden verklaard. Een zoekopdracht wel, althans op één punt: **geforceerde matten**. Er is geen mening over een mat. Als de engine diep genoeg zoekt en correct is, moet hij het vinden.

De testset wordt opgebouwd door de al verzamelde 1.498 partijstellingen te doorlopen en Stockfish te vragen of hij er een geforceerd mat in ziet voor de partij aan zet. Dat levert 43 stellingen op: 20 matten in één zet, 14 in twee, 9 in drie.

En daar heeft deze test me iets geleerd.

### Het valse alarm dat een correctie waard was

Mijn eerste versie vroeg Stockfish, in MultiPV, **de lijst van alle zetten die mat zetten** in elke stelling. De test controleerde vervolgens of de zet van onze engine in die lijst voorkwam.

De engine faalde op één stelling:

```text
Mat in 2 (diepte 3) : 14/15
  1k6/2b1R3/p7/Pp1Q1B1p/1Pp1p2P/2P1B3/4P3/1N3KR1 w - - 1 46
    verwacht een van b1a3 b1d2 d5c6 ... g1h1, verkregen e7d7 (mat in 2)
```

Negentien zetten zetten mat in twee in deze stelling, en onze engine vond een twintigste, `Rd7`, die niet in de lijst voorkwam. Twee hypothesen: ofwel kondigt onze zoekfunctie een mat aan die niet bestaat, ofwel is de lijst onvolledig.

Handmatige verificatie: na 1.Td7 heeft Zwart negen zetten. Op 1...Lh2 is 2.Db7 mat, omdat de dame beschermd wordt door de toren op de zevende rij. Op 1...Kc8 is 2.Td8 mat: dit is een **dubbelschaak**, van de loper f5 en de toren, en een dubbelschaak kan alleen worden gepareerd door de koning te verplaatsen, die geen veld meer heeft. Het mat is echt.

De lijst was dus fout. Toen ik opnieuw bij Stockfish navroeg op oplopende diepte:

```text
depth 8 : 58 varianten, 19 zetten mat in 2, e7d7 erbij? False
depth 14: 58 varianten, 20 zetten mat in 2, e7d7 erbij? True
```

Op diepte 8 had Stockfish deze variant nog niet opgelost. Mijn oracle was onvolledig, en liet een correcte engine falen.

De les is meer waard dan de test: **controleer nooit via lidmaatschap van een lijst waarvan je de volledigheid niet beheerst.** De gecorrigeerde versie vraagt geen lijst meer. Ze neemt de zet die onze engine heeft geproduceerd, wat het ook is, speelt hem, en vraagt Stockfish of de partij aan zet nu mat staat in `n-1` zetten. Elke mattende zet slaagt, inclusief een zet die Stockfish zelf niet zou spelen.

```text
$ STOCKFISH=... python3 verifier_mats.py
43 geforceerde matten in de testset

Mat in 1 (diepte 1) : 20/20         870 knopen      0,2 s
Mat in 2 (diepte 3) : 14/14      248593 knopen     77,9 s

Alle matten gevonden.
```

Merk terloops het verschil tussen de twee regels op. Twintig matten in één zet kosten 870 stellingen en twee tiende van een seconde. Veertien matten in twee zetten kosten er 248.593 en **achtenzeventig seconden**. Twee halve zetten meer, driehonderd keer meer werk.

## De muur

Je zult gemerkt hebben dat de test stopt bij matten in twee zetten, terwijl de testset er negen in drie zetten bevat. Dat is geen vergetelheid.

Een mat in drie vereist een zoekopdracht op diepte 5. Ik heb de meting op **slechts één** van deze negen stellingen gestart, en na enkele minuten onderbroken zonder resultaat. De orde van grootte valt af te leiden uit de vorige regel: twee halve zetten diepte extra vermenigvuldigen het werk met ongeveer 300, dus de 78 seconden van de matten-in-twee-set worden meerdere uren. Voor negen stellingen. Op een engine die niets anders doet.

Matten in drie liggen dus niet buiten het bereik van het programma: ze liggen buiten het bereik van **dit algoritme**. Ze komen terug in het volgende artikel, waar ze in enkele seconden voorbijgaan.

Dit is de structurele beperking van minimax, en het heeft niets met Python te maken. De vertakkingsfactor bij schaken bedraagt gemiddeld een dertigtal zetten: elke extra halve zet vermenigvuldigt de boom met dertig. Een engine die zoekt op diepte $d$ bezoekt in de orde van $30^d$ stellingen.

| Diepte | Bezochte stellingen (startstelling) |
|---|---|
| 1 | 20 |
| 2 | 420 |
| 3 | 9.322 |
| 4 | 206.603 |

En toch zoeken engines gewoonlijk twintig halve zetten diep. $30^{20}$ is een getal van dertig cijfers; het heelal heeft niet genoeg atomen. Ze bezoeken dus vanzelfsprekend niet de hele boom.

De sleutel is niet sneller zoeken. De sleutel is de overweldigende meerderheid van de takken **niet doorzoeken**, door te bewijzen dat ze de beste zet niet kunnen bevatten. En het mooiste is dat dit bewijs bijna niets kost, en dat het het resultaat **nooit** verandert.

**Volgend artikel:** negamax en alfa-bèta-snoeien. Dezelfde zet gespeeld, dezelfde scores, een boom tien keer kleiner.
