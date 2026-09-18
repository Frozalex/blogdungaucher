---
title: "Een stelling evalueren in Python: materiaal tellen is niet genoeg"
excerpt: >-
  Een engine die altijd de zet speelt die het meeste materiaal wint, verplettert het toeval. Hij staat
  gemiddeld achtentwintig pionnen voor op het moment dat de partij stopt. En hij wint slechts één op de
  vier partijen, omdat hij zijn tegenstander twee van de drie keer pat zet.
seoTitle: "Evaluatiefunctie van een schaakengine in Python: het materiaal"
seoDescription: >-
  De evaluatiefunctie van een schaakengine coderen in Python: waarde van de stukken, centipawns,
  gezichtspunt van de aan zet zijnde partij, symmetrietest en confrontatie met de evaluatie van Stockfish.
frSlug: fonction-evaluation-materiel-python
draft: false
faq:
  - question: "Hoeveel is elk stuk waard in een schaakengine?"
    answer: >-
      De gebruikelijke schaal, in centipawns: pion 100, paard 320, loper 330, toren 500, dame 900. De
      gehele waarden 1/3/3/5/9 gaan terug op Claude Shannon in 1949; het lichte voordeel dat aan de
      loper boven het paard wordt gegeven, is een latere correctie, afgeleid uit statistieken van
      partijen. De koning is nul waard.
  - question: "Waarom is de koning nul waard in de evaluatie?"
    answer: >-
      Omdat hij altijd aan beide kanten van het bord aanwezig is. Hem een waarde geven, hoe groot ook,
      zou precies dezelfde constante aan beide kanten toevoegen en zou het verschil dus nooit veranderen.
      Het verlies van de koning wordt niet door de evaluatie afgehandeld, maar door de zettengenerator:
      een stelling zonder legale zet is mat, met een apart resultaat.
  - question: "Wat is een centipawn?"
    answer: >-
      De universele eenheid van engines: een honderdste van de waarde van een pion. Het maakt het
      mogelijk om met gehele getallen te werken, sneller en zonder afrondingsfouten, terwijl er nog
      genoeg finesse overblijft om positionele verschillen uit te drukken. De <code>score cp 36</code>
      uit een UCI-uitvoer en de evaluatiebalk van een schaaksite zijn hetzelfde.
  - question: "Moet je evalueren vanuit het gezichtspunt van Wit of van de aan zet zijnde partij?"
    answer: >-
      Beide, apart. De weergave gebeurt vanuit het gezichtspunt van Wit (een positieve score betekent
      "Wit staat beter"), dat is de conventie van de evaluatiebalken. De zoekfunctie eist juist het
      gezichtspunt van de <strong>aan zet zijnde partij</strong>, anders speelt het negamax-algoritme uit
      artikel 8 de beste zetten voor de ene kant en de slechtste voor de andere.
  - question: "Waarom wint een engine die materiaal wint de partij niet?"
    answer: >-
      Omdat materiaal een middel is, geen doel. Gemeten over 500 partijen eindigt een puur gulzige
      engine met gemiddeld 28 pionnen voorsprong en wint slechts één op de vier partijen: hij zet zijn
      tegenstander in twee derde van de gevallen <strong>pat</strong>, omdat hij niet weet dat een
      stelling zonder legale zet en zonder schaak remise is. Ver vooruit kijken is belangrijker dan goed
      tellen.
---

Je engine [speelt volledige partijen](/nl/blog/un-moteur-qui-joue-au-hasard/) en heeft geen enkele reden om de ene zet boven de andere te verkiezen. Tijd om hem die te geven.

Dat is de rol van de **evaluatiefunctie**: antwoord geven op "wie staat beter, en hoeveel?" door alleen naar de stelling te kijken, zonder ook maar één zet extra te spelen. Ze geeft een getal terug, en dat getal is een mening. De enige exacte evaluatie zou zijn "gewonnen, remise of verloren", en [niemand weet hoe hij dat bij schaken moet berekenen](/nl/blog/paradoxe-de-zermelo/).

Dit artikel codeert de eenvoudigste van alle evaluaties, degene die iedereen kent: de stukken tellen. En het eindigt met een resultaat dat ik niet had verwacht zo scherp te meten.

## De eenheid: de centipawn

Engines tellen niet in pionnen, ze tellen in **centipawns**, de honderdste van een pion. Twee redenen: je werkt met gehele getallen, sneller en zonder afrondingsfouten, en je houdt genoeg finesse over om positionele verschillen uit te drukken die geen hele pion waard zijn.

Dit is de eenheid die verschijnt wanneer Stockfish `score cp 36` antwoordt, en het is degene die de evaluatiebalk van je schaaksite tekent.

```python
VALEURS = {
    "P": 100,
    "N": 320,
    "B": 330,
    "R": 500,
    "Q": 900,
    "K": 0,
}
```

De gehele waarden 1, 3, 3, 5, 9 gaan terug op [Claude Shannon](https://nl.wikipedia.org/wiki/Claude_Shannon) en zijn baanbrekende artikel uit 1949, *Programming a Computer for Playing Chess*. Ze zijn sindsdien nauwelijks veranderd, wat opmerkelijk is voor een gebied waar al het andere drie keer is veranderd. Het lichte voordeel dat hier aan de loper boven het paard wordt gegeven, is een latere correctie, afgeleid uit statistieken over grote partijendatabases.

**De koning is nul waard**, en dat is het punt dat altijd verrast. Het is geen nalatigheid: hij is permanent aan beide kanten van het bord aanwezig. Hem een waarde geven, hoe groot ook, zou dezelfde constante aan beide kanten toevoegen en zou het verschil nooit veranderen. Het verlies van de koning wordt niet door de evaluatie afgehandeld: het wordt afgehandeld door de zettengenerator, aangezien een stelling zonder legale zet mat is.

## De tekenfout, en hoe je die niet schrijft

Hier is de functie, en ze is zo kort als je je kunt voorstellen.

```python
def materiel(echiquier):
    """Différence de matériel, en centièmes de pion, du point de vue des Blancs."""
    score = 0
    for case in CASES:
        piece = echiquier.cases[case]
        if piece is VIDE:
            continue
        valeur = VALEURS[piece.upper()]
        score += valeur if piece in BLANCS else -valeur
    return score
```

Wat volgt is belangrijker dan de functie zelf.

Er bestaan **twee gezichtspunten** op een evaluatie, en ze verwarren is de meest klassieke bug van elke beginnende engine.

Het eerste is dat van Wit: een positieve score betekent "Wit staat beter", ongeacht wie aan zet is. Dat is de weergaveconventie, die van de evaluatiebalken, die van de uitvoer van Stockfish.

Het tweede is dat van de **aan zet zijnde partij**: een positieve score betekent "wie moet spelen, staat beter". Het wisselt dus van teken bij elke halve zet. Dit is wat het negamax-algoritme van artikel 8 zal eisen, en daarom schrijven we het meteen apart.

```python
def evaluer(echiquier):
    """Évaluation du point de vue du camp au trait."""
    score = materiel(echiquier)
    return score if echiquier.trait == "w" else -score
```

Vier regels. Zonder deze zoekt de engine de beste zetten voor de ene kant en de **slechtste** voor de andere, wat een programma oplevert dat min of meer correct speelt met Wit en zich methodisch verzelfmoordt met Zwart. Het symptoom is zo vreemd dat je de bug overal elders gaat zoeken.

## De test die tekenfouten opvangt

Je kunt niet bewijzen dat een evaluatie "juist" is, aangezien ze een mening is. Je kunt wel bewijzen dat ze **consistent** is, en de standaardtest heet symmetrie.

Het idee: bouw de spiegelstelling, bord omgedraaid en kanten verwisseld. Een correcte evaluatie moet daar exact het tegenovergestelde teruggeven. Als ze dat niet doet, bevoordeelt ze structureel één kant, wat altijd een bug is.

```python
def miroir(echiquier):
    champs = echiquier.fen().split()
    rangees = champs[0].split("/")
    # On inverse l'ordre des rangées et on change la casse de chaque pièce :
    # un pion blanc en e2 devient un pion noir en e7.
    inversees = [rangee.swapcase() for rangee in reversed(rangees)]
    ...
```

De omkering gebeurt op de FEN in plaats van op de veldentabel, omdat de FEN al alles codeert wat omgekeerd moet worden: de rijen in volgorde, de hoofdlettercode voor de kleur, de rokaderechten en het en-passantveld. Drie regels in plaats van dertig.

Een voorzorgsmaatregel is het vermelden waard: de test controleert ook dat **de spiegel van de spiegel de oorspronkelijke stelling teruggeeft**. Zonder dit zou een foute spiegelfunctie een foute evaluatie kunnen bevestigen, waarbij de twee fouten elkaar compenseren.

```text
$ STOCKFISH=... python3 verifier_evaluation.py --stockfish
1498 positions

1. Symétrie de l'évaluation : 1498/1498
2. Accord avec Stockfish    : 1305 positions comparées (193 en échec, non évaluables)
   même camp désigné meilleur      : 1129 (86.5 %)
   désaccords nets (≥ 1 pion des deux côtés) : 31 (2.4 %)
   écart médian : 151 centièmes de pion, 9e décile : 765

Tout est vert.
```

De tweede proef vraagt om uitleg, omdat ze **niet** naar gelijkheid zoekt. Stockfish evalueert met een neuraal netwerk dat op miljarden stellingen is getraind; wij tellen pionnen. Dezelfde getallen verwachten zou geen zin hebben.

Wat we meten, is de overeenstemming over wat telt: **dezelfde kant als beter aanwijzen**. Op 1.305 evalueerbare stellingen is dat 86,5 % van de tijd het geval, met slechts 2,4 % duidelijke onenigheden waarbij beide minstens een pion voorsprong in tegengestelde richting aankondigen. De mediane afwijking van 1,5 pion meet precies wat het materiaal niet ziet: de activiteit van de stukken, de veiligheid van de koning, de pionnenstructuur.

Een woord over de 193 uitgesloten stellingen. Stockfish weigert een stelling te evalueren waarin de aan zet zijnde partij schaak staat, met als reden dat een statische evaluatie geen zin heeft zolang er een gedwongen verovering in de lucht hangt. Dat is precies het probleem dat artikel 11 zal behandelen onder de naam horizoneffect, en het is interessant om vast te stellen dat de beste engine ter wereld dit omzeilt door te weigeren te antwoorden.

## De gulzige engine

Een evaluatie alleen speelt nog steeds niet. De kleinste engine die je eruit kunt halen, bekijkt elk van zijn zetten, evalueert de verkregen stelling, en houdt de beste. Slechts één halve zet vooruitzicht.

```python
def choisir(self, echiquier, coups):
    meilleurs = []
    meilleur_score = None

    for coup in coups:
        echiquier.jouer(coup)
        # `evaluer` renvoie le score du camp au trait, or après `jouer`
        # c'est l'adversaire qui a le trait : on prend donc l'opposé pour
        # revenir à notre point de vue.
        score = -evaluer(echiquier)
        echiquier.annuler()

        if meilleur_score is None or score > meilleur_score:
            meilleur_score, meilleurs = score, [coup]
        elif score == meilleur_score:
            meilleurs.append(coup)

    return self.alea.choice(meilleurs)
```

De `-evaluer(...)` na `jouer` is de eerste concrete toepassing van de vorige sectie. Zodra de zet is gespeeld, is het de tegenstander die aan zet is: de evaluatie is vanuit zijn gezichtspunt, ze moet worden omgekeerd.

En de laatste regel is geen grap. Zonder de loting tussen zetten met gelijke score speelt de engine systematisch de eerste zet uit de lijst, dat wil zeggen de zet van het stuk dat het dichtst bij a8 staat. In elke rustige stelling, waar alle zetten nul waard zijn, duwt hij eindeloos dezelfde pion door. Willekeurig kiezen kost één regel en voorkomt absurd gedrag.

## Vijfhonderd partijen tegen het toeval

```text
$ python3 tournoi.py 250
Glouton contre Hasard : 314.5 / 500 (62.9 %)
  130 victoires, 369 nulles, 1 défaites
  écart Elo estimé : +92 ± 32

  Motifs de fin
    pat                            331  ( 66.2 %)
    échec et mat                   131  ( 26.2 %)
    matériel insuffisant            29  (  5.8 %)
    règle des cinquante coups        8  (  1.6 %)
    triple répétition                1  (  0.2 %)

  Avance matérielle de Glouton au moment des nulles :
    moyenne +27.82 pion, médiane +29.50, maximum +50.70
```

Het eerste cijfer is wat we verwachtten: de gulzige engine verliest vrijwel nooit, **één partij op vijfhonderd**. Het materiaal tellen volstaat om je stukken niet meer weg te geven, en een willekeurige tegenstander geeft de zijne voortdurend weg.

De rest is veel interessanter.

**De gulzige engine staat achtentwintig pionnen voor op het moment dat de partij stopt.** Achtentwintig. Dat is meer dan het beginmateriaal van één kant. Hij heeft absoluut alles opgegeten wat langskwam, pionnen tot dames gepromoveerd, en hij wint nog steeds niet.

**Twee derde van de partijen eindigt in patstelling.** Daar draait alles om. De gulzige engine verslindt de zwarte stukken tot er niet één meer kan bewegen, en de zwarte koning komt zonder legale zet te staan, zonder schaak. Remise. Hij heeft precies gedaan wat hem gevraagd werd, het materiaal maximaliseren, en die instructie zegt niets over het overlaten van een zet aan de tegenstander.

Niemand heeft een betere evaluatiefunctie nodig om dit te corrigeren. Een engine die **slechts één halve zet verder** zou kijken, zou constateren dat de tegenstander na zijn verovering geen zet meer heeft, en dat de score dus remise is in plaats van +2800. Precies dat doet de zoekfunctie.

## Wat dit artikel aantoont, en wat niet vanzelfsprekend was

Materiaal is een middel, geen doel. We weten dat als we schaken; we meten het hier: **+28 pionnen voorsprong zijn slechts 62,9 % score waard** wanneer het vooruitzicht bij een halve zet stopt.

Dat is ook goed nieuws voor het vervolg van de serie. Het geeft aan dat de inspanning niet in de eerste plaats op de finesse van de evaluatie moet liggen, maar op de diepte van de zoekfunctie. Een engine die vier zetten vooruit ziet met een grove evaluatie verslaat ruim een engine die één zet vooruit ziet met een verfijnde evaluatie. Daarom gaan de volgende zes artikelen bijna uitsluitend over zoekfuncties.

**Volgend artikel:** minimax, het algoritme dat veronderstelt dat de tegenstander goed speelt. De engine stopt eindelijk met zijn tegenstander pat te zetten, en begint mat in twee te vinden.
