---
title: "Een schaakbord voorstellen in Python: de tabel van 64 vakken is een valstrik"
excerpt: >-
  Een lijst van 64 elementen voor 64 vakken lijkt vanzelfsprekend. Het is de eerste bug van elke beginnende
  schaakengine: het paard verlaat het bord rechts en komt links weer binnen. Hier is de structuur die je in
  plaats daarvan moet gebruiken, en de twee functies die je zoekfunctie miljoenen keren zal aanroepen.
seoTitle: "Een schaakbord voorstellen in Python: mailbox 10x12 en FEN"
seoDescription: >-
  Hoe je een schaakbord voorstelt in Python voor een engine: waarom de tabel van 64 vakken faalt, de mailbox
  10x12-structuur, het lezen en schrijven van FEN, en de functies spelen/terugdraaien.
frSlug: representer-un-echiquier-en-python
draft: false
faq:
  - question: "Waarom 10x12 vakken in plaats van 8x8?"
    answer: >-
      Omdat de rand de overloopcontrole overbodig maakt. In een tabel van 8x8 landt een paard op h4 dat
      "twee naar rechts, één omhoog" springt op een perfect geldig vak aan de andere kant van het bord, en
      niets in de code signaleert de afwijking. Met twee rijen sentinels boven en onder en een kolom aan
      elke kant, landt het op een sentinel: het volstaat het vak te lezen om te weten dat je eraf bent. Twee
      rijen en niet één, omdat een paard twee rijen tegelijk kan springen.
  - question: "Zijn bitboards niet beter?"
    answer: >-
      Sneller, ja, en dat is wat alle serieuze engines gebruiken, Stockfish inbegrepen: de stelling past in
      een dozijn 64-bits gehele getallen en het genereren van zetten wordt een reeks bitsgewijze operaties.
      Maar het voordeel komt van het feit dat de processor een 64-bits geheel getal in één instructie
      verwerkt, wat Python niet doet: zijn gehele getallen zijn objecten van onbeperkte grootte. Je zou dus
      de complexiteit van bitboards betalen zonder het voordeel ervan te krijgen.
  - question: "Waarom een zet terugdraaien in plaats van de stelling te kopiëren?"
    answer: >-
      Voor de snelheid. Een zoekfunctie op diepte 6 bezoekt honderdduizenden stellingen, en elke stap zou
      betekenen dat de hele structuur wordt gekopieerd. De techniek make/unmake wijzigt het bord ter
      plaatse, daalt af in de boom, en herstelt vervolgens precies de vorige toestand. Ze is een orde van
      grootte sneller, tegen een prijs: alles wat niet herberekenbaar is, moet zijn opgeslagen.
  - question: "Heb je echt een teller van halve zetten nodig in de FEN?"
    answer: >-
      Ja, en het is precies het veld dat implementaties vergeten te herstellen. Het telt de halve zetten
      sinds de laatste slag of de laatste pionzet, voor de vijftig-zettenregel. Je kunt het niet herberekenen
      nadat er gespeeld is: eenmaal teruggezet op nul door een slag, is de informatie "het stond op 37"
      definitief verloren als je het niet had opgeslagen.
  - question: "Waarom verschilt mijn FEN van die van Stockfish op het en passant-vak?"
    answer: >-
      Omdat er twee conventies bestaan. De oorspronkelijke FEN kondigt het overvlogen vak aan na elke zet
      van twee vakken. Stockfish en de meeste moderne engines kondigen het alleen aan als de en
      passant-slag <strong>echt speelbaar</strong> is voor de partij aan zet. Beide stellingen zijn
      identiek op het bord, maar de tekenreeksen verschillen. De tweede conventie aannemen vereist te weten
      hoe je zetten genereert, wat in het volgende artikel aan bod komt.
---

Een schaakbord heeft vierenzestig vakken. Python heeft lijsten. De conclusie lijkt zichzelf op te dringen, en precies daarom is ze verraderlijk.

Dit artikel bouwt de datastructuur op waarop de rest van de serie zal rusten: de tien volgende artikelen zullen alleen haar functies aanroepen. Een verkeerde keuze hier valt niet meer goed te maken, ze wordt betaald in traagheid en bugs tot het einde. Goed nieuws: de juiste keuze voor een engine in Python is ook de meest leesbare van de drie kandidaten.

*Dit artikel volgt op [Een schaakengine programmeren in Python: waar te beginnen](/fr/blog/moteur-echecs-python-par-ou-commencer/), dat de werkplaats inricht.*

## Het paard dat door de muur gaat

Beginnen we met de voor de hand liggende versie. Een lijst van 64 elementen, index 0 voor a8, index 63 voor h1, in de leesvolgorde van een FEN. De kolom vind je terug met `index % 8`, de rij met `index // 8`.

De verplaatsingen van een paard worden dan acht indexverschuivingen: twee kolommen en één rij, of omgekeerd, in de vier richtingen. Dus `±6`, `±10`, `±15` en `±17`.

```python
SAUTS_64 = [-17, -15, -10, -6, 6, 10, 15, 17]


def cavalier_64(depart):
    arrivees = []
    for saut in SAUTS_64:
        arrivee = depart + saut
        if 0 <= arrivee <= 63:  # de enige mogelijke controle hier
            arrivees.append(nom_64(arrivee))
    return arrivees
```

De test `0 <= arrivee <= 63` lijkt te volstaan. Dat is niet zo. Hier is wat deze code echt oplevert:

```text
$ python3 le_piege_des_64_cases.py
Cavalier en h4
  64 cases  : a1 a5 b2 b4 f3 f5 g2 g6   (8 coups)
  mailbox   : f3 f5 g2 g6   (4 coups)

Cavalier en a4
  64 cases  : b2 b6 c3 c5 g4 g6 h3 h7   (8 coups)
  mailbox   : b2 b6 c3 c5   (4 coups)
```

Een paard op h4 heeft vier zetten. De code vindt er acht. De vier extra (a1, a5, b2, b4) zijn die waar het stuk via de rechterrand van het bord is verdwenen en links is teruggekomen, één of twee rijen verder. Beschouwd als een band van 64 vakken, is de verplaatsing volkomen legitiem: h4 heeft index 39, min zes geeft 33, en index 33 bestaat. Dat is b4.

Deze bug heeft drie eigenschappen die hem tot de ergste vijand van de beginner maken. Hij gooit **geen enkele uitzondering**. Hij treedt alleen op bij de kolommen a en h, dus niet in de stellingen die je aan het begin test. En hij produceert plausibele zetten: in een partij zie je een paard iets bizars doen zonder ooit de datastructuur te verdenken, aangezien de zettengenerator elders "werkt".

Je kunt het corrigeren door bij elke zet de start- en aankomstkolommen te vergelijken. Dat kan, het is lelijk, en vooral het is een controle die je in elke generatiefunctie moet herhalen, dus ergens vergeten.

## Drie manieren om een schaakbord voor te stellen

| Voorstelling | Idee | Voor | Tegen |
|---|---|---|---|
| Tabel 8x8 | 64 vakken, expliciete grenscontroles | Onmiddellijk te begrijpen | Een overloopcontrole die je nooit mag vergeten, in elke functie |
| Mailbox 10x12 | 64 nuttige vakken omringd door sentinels | De overloop is direct af te lezen in de tabel zelf | 56 ongebruikte vakken, minder intuïtieve indices |
| Bitboards | 12 gehele getallen van 64 bits, één per stuktype | Zeer snel, generatie via bitsgewijze operaties | Onleesbaar voor een beginner, en zonder nut in Python |

De keuze voor bitboards verdient het om erbij stil te staan, omdat het de keuze is van alle serieuze engines en men zou kunnen denken aan een tekortkoming van onze kant. Hun voordeel berust op een eigenschap van de processor: hij verwerkt een geheel getal van 64 bits in één enkele instructie. Een schaakbord dat in een geheel getal van 64 bits past, "alle vakken aangevallen door de witte torens" wordt berekend in enkele operaties. Maar de gehele getallen van Python zijn geen machinewoorden: het zijn objecten van onbeperkte grootte, toegewezen op de heap. Je zou dus de hele conceptuele complexiteit van bitboards betalen zonder het voordeel ervan te raken.

Rest de mailbox, en dat is onze keuze voor de rest van de serie.

## De rand van sentinels

Het idee past in één zin: je omringt het schaakbord met vakken die geen vakken zijn.

```text
    0   1   2   3   4   5   6   7   8   9
   10  11  12  13  14  15  16  17  18  19
   20 [21  22  23  24  25  26  27  28] 29   <- rij 8 (a8 = 21, h8 = 28)
   30 [31  32  33  34  35  36  37  38] 39
   ...
   90 [91  92  93  94  95  96  97  98] 99   <- rij 1 (a1 = 91, h1 = 98)
  100 101 102 103 104 105 106 107 108 109
  110 111 112 113 114 115 116 117 118 119
```

De tabel telt 120 vakken. De 64 nuttige liggen in het midden, omringd door een kolom sentinels links en rechts, en **twee** rijen boven en onder. Twee, en niet één: een paard kan twee rijen tegelijk springen, dus zijn er twee bewakingsrijen nodig zodat het niet over de rand heen kan.

Aangezien een rij nu tien vakken telt, veranderen de verschuivingen: een rij omhoog gaan is `-10`, een kolom vooruit is `+1`. Het paard wordt `±21`, `±19`, `±12`, `±8`. En de overloopcontrole verdwijnt:

```python
def cavalier_120(depart, plateau):
    arrivees = []
    for saut in SAUTS_120:
        arrivee = depart + saut
        if plateau[arrivee] is not BORD:  # een eenvoudige veldlezing
            arrivees.append(nom_120(arrivee))
    return arrivees
```

Het paard op h4 verlaat het bord rechts en landt op de kolom sentinels. Vier zetten, zoals het hoort. Er is niets meer te vergeten, omdat er geen bijzondere controle meer nodig is: de rand maakt deel uit van de tabel.

Twee omzettingsfuncties volstaan voor de rest:

```python
CASES = [21 + rangee * 10 + colonne for rangee in range(8) for colonne in range(8)]


def nom_de_case(index):
    """21 -> 'a8', 98 -> 'h1'."""
    colonne = (index % 10) - 1
    rangee = (index // 10) - 2
    return "abcdefgh"[colonne] + "87654321"[rangee]


def index_de_case(nom):
    """'a8' -> 21, 'h1' -> 98."""
    colonne = "abcdefgh".index(nom[0])
    rangee = "87654321".index(nom[1])
    return 21 + rangee * 10 + colonne
```

`CASES` is de lijst van de 64 nuttige indices, in de leesvolgorde van een FEN. Je gebruikt hem zowel om de stelling te laden **als** om hem te schrijven, wat garandeert dat je je niet in de ene richting kunt vergissen zonder je ook in de andere te vergissen: een mislukte heen-en-terugvertaling valt onmiddellijk op.

## Een FEN laden en schrijven

Het laden hervat het principe uit het vorige artikel, maar schrijft nu naar de tabel van 120 vakken. Je begint met de hele tabel met sentinels te vullen, en maakt vervolgens de 64 nuttige vakken leeg:

```python
self.cases = [BORD] * 120
for index in CASES:
    self.cases[index] = VIDE
```

De rest van de velden wordt rechtstreeks gelezen, met één subtiliteit: het en passant-vak wordt meteen omgezet naar een index, zodat er geen tekenreeks door de rest van de engine hoeft te worden meegesleept.

```python
self.trait = champs[1]
self.roques = champs[2]
self.en_passant = index_de_case(champs[3]) if champs[3] != "-" else None
self.demi_coups = int(champs[4])
self.numero = int(champs[5])
```

Het schrijven doorloopt dezelfde 64 indices, acht per acht, terwijl het opeenvolgende lege vakken telt:

```python
def fen(self):
    rangees = []
    for debut in range(0, 64, 8):
        texte = ""
        vides = 0
        for index in CASES[debut:debut + 8]:
            piece = self.cases[index]
            if piece is VIDE:
                vides += 1
            else:
                if vides:
                    texte += str(vides)
                    vides = 0
                texte += piece
        if vides:
            texte += str(vides)
        rangees.append(texte)
    ...
```

Er is een praktische reden om een FEN te kunnen schrijven, naast de symmetrie: het is de enige manier om je stelling te vergelijken met die van een ander programma. Alle verificatie in dit artikel berust daarop.

## De zet, opzettelijk arm

```python
class Coup:
    __slots__ = ("depart", "arrivee", "promotion")
```

Drie velden. Niet "dit is een rokade", niet "dit is en passant", niet "dit is een slagzet".

De verleiding om deze klasse te verrijken is groot, en je moet weerstand bieden. Deze informatie is **afleidbaar** uit de stelling op het moment dat de zet wordt gespeeld: een koning die twee kolommen verplaatst rokeert, een pion die op het en passant-vak aankomt slaat en passant. Ze dubbel opslaan creëert de mogelijkheid dat een zet "rokade" zegt in een stelling waar dat niet het geval is. En een object met drie attributen wordt veel sneller aangemaakt en vergeleken dan een object met zeven, wat telt wanneer je er honderdduizenden per seconde aanmaakt.

De uitvoernotatie is die welke het UCI-protocol vereist, en niets anders:

```python
def __str__(self):
    """Notation UCI : e2e4, e7e8q."""
    return nom_de_case(self.depart) + nom_de_case(self.arrivee) + (self.promotion or "")
```

Geen algebraïsche notatie (`Cf3`, `O-O`, `e8=D`) voorlopig: ze is dubbelzinnig zonder de context van de stelling, ze vereist te weten of een ander paard hetzelfde vak kan bereiken, en de engine heeft ze strikt niet nodig. Ze komt bij artikel 5, alleen om leesbare PGN's te schrijven.

## Spelen en terugdraaien: de twee meest aangeroepen functies van de engine

Hier bereikt het artikel het punt waar het van comfortabel naar delicaat overgaat.

Een engine verkent een boom van varianten. Op diepte 6 bezoekt hij honderdduizenden stellingen. De naïeve manier om te verkennen is het bord te kopiëren voordat je een zet speelt, en de kopie weg te gooien bij het teruggaan. De manier waarop alle engines te werk gaan is **de zet op het bord zelf spelen, afdalen, en hem dan terugdraaien**. Dit is de zogenaamde *make/unmake*-techniek, en het prestatieverschil is een orde van grootte.

Het heeft een prijs: terugdraaien vereist dat alles wat niet herberekenbaar is, is opgeslagen. Je stapelt dus een registratie op vóór elke zet.

```python
self.historique.append(
    (coup, capturee, case_capture, self.roques, self.en_passant,
     self.demi_coups, self.numero)
)
```

Kijk naar de teller `demi_coups`, die van de vijftig-zettenregel. Na een slagzet staat hij op 0. Het is dan onmogelijk te weten of hij op 37 of 12 stond net ervoor. Sommige toestanden zijn achteraf reconstrueerbaar (de rokaderechten, door afleiding), andere niet. Omdat het onderscheid subtiel is en het vergeten stil, is de regel eenvoudig: je stapelt alles op.

### Valstrik nr. 1: en passant slaan

Dit is de enige zet in het schaken waar het geslagen stuk niet op het aankomstvak staat. Een witte pion op e5 die en passant slaat komt aan op d6, maar de zwarte pion die hij slaat staat op d5.

```python
if pion and coup.arrivee == self.en_passant:
    case_capture = coup.arrivee + (10 if blanc else -10)
else:
    case_capture = coup.arrivee
capturee = self.cases[case_capture]
```

Je onthoudt dus **het vak van de slag**, niet alleen het geslagen stuk. Een functie `annuler` die het geslagen stuk terugzet op het aankomstvak laat bij elke teruggedraaide en passant-slag een pion van het bord verdwijnen. De engine blijft draaien, met één pion minder, in een zoektak op de duizend.

### Valstrik nr. 2: rokaderechten verloren zonder dat de koning beweegt

Het klassieke geval is het rokaderecht in te trekken wanneer de koning of de toren beweegt. Er ontbreekt er één: wanneer de toren **op zijn oorspronkelijke vak wordt geslagen**, verdwijnt het recht ook. Een loper die de toren op h1 slaat annuleert de korte rokade van wit, zonder dat er ook maar één wit stuk heeft bewogen.

De oplossing zit in een tabel geïndexeerd op vak, toegepast op zowel het vertrek- als het aankomstvak van de zet:

```python
ROQUES_PERDUS = {
    95: "KQ",  # e1, de witte koning
    98: "K",   # h1
    91: "Q",   # a1
    25: "kq",  # e8, de zwarte koning
    28: "k",   # h8
    21: "q",   # a8
}

for case in (coup.depart, coup.arrivee):
    for lettre in ROQUES_PERDUS.get(case, ""):
        self.roques = self.roques.replace(lettre, "")
```

Zes regels tabel, en het geval van de geslagen toren wordt door constructie afgehandeld. Dat is veiliger dan zes verspreide `if`-statements in de functie.

### Valstrik nr. 3: de promotie, heen en terug

Bij het spelen schrijft de UCI-notatie de promotie altijd in kleine letters, ook voor wit: `e7e8q`. Het is aan ons om de hoofdletter te herstellen naargelang de partij.

```python
if coup.promotion:
    self.cases[coup.arrivee] = coup.promotion.upper() if blanc else coup.promotion
else:
    self.cases[coup.arrivee] = piece
```

Bij het terugdraaien is de fout subtieler: `annuler` neemt het stuk op het aankomstvak terug om het op het vertrekvak te herplaatsen. Als de zet een promotie was, is dat stuk een dame, en zet je dus een dame terug op de zevende rij. Je moet hem terugveranderen in een pion.

```python
piece = self.cases[coup.arrivee]
if coup.promotion:
    piece = "P" if piece in BLANCS else "p"
```

Deze drie valstrikken hebben één punt gemeen: ze breken niets zichtbaars. De engine speelt, de partij vordert, en de stelling is één keer op de duizend fout in een variant die niemand bekijkt. Vandaar wat volgt.

## De verificatie: 1498 stellingen, drie proeven

Het bestand [`verifier_echiquier.py`](https://github.com/Frozalex/blogdungaucher/blob/main/tools/moteur-python/02-echiquier/verifier_echiquier.py) onderwerpt de structuur aan drie proeven, van de minst veeleisende naar de meest veeleisende.

**Proef 1, de FEN heen-en-terug.** Een FEN laden en vervolgens herschrijven moet exact dezelfde tekenreeks opleveren. Dit is een interne proef: ze bewijst alleen de consistentie van de code met zichzelf, maar vangt rijinversies en telfouten van lege vakken op.

**Proef 2, spelen en dan terugdraaien.** Je laadt een stelling, speelt de zet, draait hem terug, en de verkregen FEN moet karakter voor karakter identiek zijn aan die van het begin. Dit is de proef die de drie valstrikken uit de vorige sectie vangt.

**Proef 3, de confrontatie met Stockfish.** Je speelt de zet, en vergelijkt de verkregen stelling met die welke Stockfish krijgt door dezelfde zet vanuit dezelfde stelling te spelen. Dit is de enige externe proef, dus de enige die bewijst dat onze definitie van een zet de juiste is en niet alleen consistent.

Rest het vinden van stellingen. Aangezien we nog niet weten hoe we legale zetten genereren, is het Stockfish die de partijen speelt: [`generer_positions.py`](https://github.com/Frozalex/blogdungaucher/blob/main/tools/moteur-python/02-echiquier/generer_positions.py) laat hem twaalf partijen spelen door elke zet willekeurig uit zijn vier beste te kiezen, wat twaalf keer dezelfde opening vermijdt. Je krijgt 1489 stellingen, elk vergezeld van de gespeelde zet.

Met een gat. Op deze 1489 stellingen zijn er acht promoties, dertien rokades, en **nul en passant-slagen**: het is te zeldzaam om toevallig te verschijnen in twaalf partijen. Maar dat is precies de zet die `annuler` breekt. Een testset die het geval niet bevat dat je vreest, bewijst niets.

Vandaar een tweede script, [`generer_cas_particuliers.py`](https://github.com/Frozalex/blogdungaucher/blob/main/tools/moteur-python/02-echiquier/generer_cas_particuliers.py), dat negen met de hand geschreven reeksen naspeelt: de twee en passant-slagen, de vier rokades, twee promoties waarvan één onderpromotie naar een paard, en de slag op de toren h8 die de korte rokade van zwart doet vervallen. Ook hier is het Stockfish die de FEN's produceert, zodat geen enkele stelling met de hand wordt overgeschreven in de testset.

Het resultaat:

```text
$ STOCKFISH=... python3 verifier_echiquier.py --stockfish
1498 positions dans le jeu d'essai

1. Aller-retour FEN        : 1498/1498
2. jouer puis annuler      : 1498/1498
3. Position après le coup  : 1420/1498 identiques à Stockfish, 78 écarts sur la seule case en passant

Tout est vert.
```

## De 78 afwijkingen, en waarom we ze behouden

Het derde cijfer vraagt om uitleg, want een eerlijke tutorial veegt afwijkingen niet onder het tapijt.

Deze 78 stellingen zijn niet fout: het bord, de partij aan zet, de rokaderechten en de tellers zijn identiek aan die van Stockfish. Alleen het en passant-veld verschilt. Er bestaan namelijk **twee conventies** voor dit veld.

De oorspronkelijke FEN kondigt het overvlogen vak aan na elke zet van twee vakken. Dat is wat onze code doet: na 1.e4 schrijft hij `e3`.

Stockfish, en de meeste moderne engines, kondigen het alleen aan als de en passant-slag **echt speelbaar** is voor de partij aan zet. Na 1.e4 zonder zwarte pion op d4 of f4 schrijft hij `-`. Dat is de conventie die gebruikt wordt door de referentiestellingen van `perft`, wat geen detail is: in het volgende artikel zou een stelling waarvan het en passant-vak ten onrechte wordt aangekondigd, zetten tellen die niet bestaan.

Waarom niet meteen corrigeren? Omdat weten of een en passant-slag speelbaar is, veronderstelt dat je zetten kunt genereren, en kunt controleren dat geen enkele daarvan de eigen koning in schaak laat staan. Dat is precies het onderwerp van artikel 3. Nu corrigeren zou verplichten een halve zettengenerator te schrijven in een FEN-schrijffunctie.

Het is een schuld, geen vergissing. Ze staat zwart op wit in de testuitvoer, met haar teller, en ze wordt terugbetaald in het volgende artikel.

## Wat je nu hebt

Een datastructuur van 120 vakken waar overlopen onmogelijk is, het lezen en schrijven van FEN geverifieerd op 1498 echte stellingen, en een koppel `jouer` / `annuler` dat de toestand exact herstelt, zelfs in de drie gevallen die elke beginnersengine breken.

Dit is nog geen engine: hij weet niet welke zetten toegestaan zijn. Dat is het onderwerp van het volgende artikel, het langste en meest ondankbare van de serie, dat alleen al de meerderheid van de bugs van een schaakengine bevat.

**Volgend artikel:** legale zetten genereren in Python, waar we ontdekken dat de moeilijkheid niet is de zetten te vinden, maar diegene te elimineren die de eigen koning in schaak laten.
