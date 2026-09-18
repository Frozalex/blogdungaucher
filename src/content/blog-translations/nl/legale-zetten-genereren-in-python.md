---
title: "Legale zetten genereren in Python: de helft van een schaakengine"
excerpt: >-
  De zetten van een stuk vinden is eenvoudig. Diegene elimineren die de eigen koning schaak laten staan, is veel
  moeilijker, en daar zitten bijna alle bugs. Op 1.498 echte stellingen is 10,5% van de door een naïeve generator
  geproduceerde zetten illegaal.
seoTitle: "Legale zetten genereren bij schaken in Python: de complete gids"
seoDescription: >-
  Hoe genereer je de legale zetten van een schaakstelling in Python: verplaatsingen, pion, rokade, en passant,
  promoties, en het legaliteitsfilter dat zetten elimineert die de koning schaak laten staan.
frSlug: generer-les-coups-legaux-en-python
draft: false
faq:
  - question: "Wat is het verschil tussen een pseudolegale en een legale zet?"
    answer: >-
      Een <strong>pseudolegale</strong> zet respecteert de verplaatsing van het stuk: het paard maakt een L,
      de loper blijft op zijn diagonaal, de pion trekt niet achteruit. Een <strong>legale</strong> zet is een
      pseudolegale zet die bovendien de eigen koning niet schaak laat staan. Het verschil is niet marginaal:
      op 1.498 stellingen uit echte partijen is 10,5% van de pseudolegale zetten illegaal, en meer dan de helft
      van de stellingen is betrokken.
  - question: "Waarom penningen niet rechtstreeks detecteren?"
    answer: >-
      Dat kan, en dat doen de snelle engines: men berekent de gepende stukken één keer per stelling, en beperkt
      dan hun zetten. Maar deze aanpak moet apart rekening houden met de koning, meervoudige schaakstanden, en
      vooral en passant, dat twee velden tegelijk vrijmaakt. Luie legaliteitscontrole (spelen, kijken, terugdraaien)
      is ongeveer zeven keer trager, maar juist door constructie: dat is het goede compromis zolang de juistheid
      niet is verworven.
  - question: "Hoeveel legale zetten zijn er in de beginstelling?"
    answer: >-
      Twintig: zestien pionzetten (één of twee velden voor elk van de acht) en vier paardzetten. Dat is de eerste
      waarde van <code>perft</code>, en de eerste test die elke zettengenerator moet doorstaan.
  - question: "Telt een promotie als één zet of als vier?"
    answer: >-
      Als vier. Een pion die op de laatste rij aankomt kan dame, toren, loper of paard worden, en dat zijn vier
      afzonderlijke zetten die naar vier verschillende stellingen leiden. Ze vergeten vervalst onmiddellijk de
      <code>perft</code>-tellingen, en ontneemt de engine de onderpromotie tot paard, die soms de enige winnende
      zet is.
  - question: "Kan de rokade over een aangevallen veld gaan?"
    answer: >-
      Nee. De koning mag noch schaak staan vóór de rokade, noch een aangevallen veld doorkruisen, noch op een
      aangevallen veld terechtkomen. De <strong>toren</strong> daarentegen mag wel degelijk een aangevallen veld
      doorkruisen: bij de lange rokade mag veld b1 onder vuur van de tegenstander liggen zonder dat dit hindert.
      Dit is een klassieke bron van fouten.
---

Op dit punt in de reeks heb je een [schaakbord dat een stelling bijhoudt en kan herstellen](/fr/blog/representer-un-echiquier-en-python/). Het weet nog niet welke zetten toegestaan zijn, wat er een even nuttige schaakengine van maakt als een auto zonder wielen.

Dit artikel vult dat gat. Het is verreweg het artikel waar de meeste bugs zitten: in een beginnersengine concentreert het genereren van zetten alleen al het merendeel van de fouten. Niet omdat de regels moeilijk zijn, maar omdat ze **talrijk en onregelmatig zijn, en omissies geen zichtbare fout veroorzaken**.

Het goede nieuws is dat er een manier is om het probleem netjes in tweeën te splitsen, waarvan één helft eenvoudig is.

## De stukken die glijden en die welke springen

Laten we de [mailbox](https://www.chessprogramming.org/Mailbox)-structuur van het vorige artikel hernemen: een array van 120 velden, een rij telt 10 velden, en een rand van sentinels omringt het schaakbord. Eén rij omhoog gaan is `-10`, één kolom vooruit is `+1`.

Alle verplaatsingen worden dan optellingen.

```python
SAUTS = {
    "N": (-21, -19, -12, -8, 8, 12, 19, 21),
    "B": (-11, -9, 9, 11),
    "R": (-10, -1, 1, 10),
    "Q": (-11, -10, -9, -1, 1, 9, 10, 11),
    "K": (-11, -10, -9, -1, 1, 9, 10, 11),
}

GLISSENT = {"B", "R", "Q"}
```

Het paard springt twee rijen en één kolom, dat is `2 × 10 + 1 = 21`, of één rij en twee kolommen, dat is `1 × 10 + 2 = 12`, met de vier tekencombinaties. De dame heeft precies de richtingen van de loper plus die van de toren, wat geen toeval is maar de definitie van het stuk.

Het enige verschil tussen dame en koning, die dezelfde acht richtingen hebben, zit in één boolean: de dame **glijdt** tot ze een obstakel tegenkomt, de koning zet één stap. Vandaar één enkele lus voor de vijf stukken:

```python
glisse = type_piece in GLISSENT
for saut in SAUTS[type_piece]:
    arrivee = depart + saut
    while True:
        cible = self.cases[arrivee]
        if cible is BORD:
            break
        if cible is VIDE:
            coups.append(Coup(depart, arrivee))
        else:
            if cible not in nos_pieces:
                coups.append(Coup(depart, arrivee))
            break
        if not glisse:
            break
        arrivee += saut
```

Twintig regels voor paard, loper, toren, dame en koning. Dat is het eenvoudige deel, en het is klaar.

## De pion, of het ingewikkeldste stuk van het spel

De pion komt niet voor in de tabel hierboven, omdat geen enkele van zijn regels wordt gedeeld met een ander stuk. Hij heeft er vier.

**Hij trekt vooruit zonder te slaan, en slaat zonder vooruit te trekken.** Het is het enige stuk waarvan verplaatsing en slag twee verschillende bewegingen zijn. Een bezet veld vóór een pion blokkeert hem, zelfs door een vijandig stuk.

**Hij kan twee velden vooruit trekken, maar alleen vanaf zijn startrij, en alleen als beide velden vrij zijn.** De klassieke fout is alleen het aankomstveld te testen, wat een pion toelaat over een stuk heen te springen.

**Hij slaat en passant.** De enige slag bij schaken naar een leeg veld, en de enige zet waarbij het geslagen stuk niet op het aankomstveld staat.

**Hij promoveert.** En hier schuilt de duurste fout voor het vervolg: een pion die de laatste rij bereikt, levert niet één zet op, maar **vier**. Dame, toren, loper, paard. Dat zijn vier verschillende stellingen.

```python
@staticmethod
def _ajouter_poussee(depart, arrivee, rangee_promotion, coups):
    """Un pion qui atteint la dernière rangée produit QUATRE coups, pas un."""
    if arrivee in rangee_promotion:
        for promotion in PROMOTIONS:
            coups.append(Coup(depart, arrivee, promotion))
    else:
        coups.append(Coup(depart, arrivee))
```

Men zou verleid kunnen zijn alleen de dame te behouden, want dat is bijna altijd de beste keuze. Twee redenen om dat niet te doen. De eerste is dat de controletellingen van het volgende artikel dan onmiddellijk fout zouden zijn. De tweede is dat er stellingen bestaan waarin de [onderpromotie](https://nl.wikipedia.org/wiki/Promotie_(schaken)) tot paard de enige winnende zet is, typisch wanneer die schaak geeft, en een engine die deze niet kan spelen, verliest ze allemaal.

## De rokade: drie verboden, één tabel

De rokade vereist te controleren dat het recht nog bestaat, dat de velden tussen koning en toren leeg zijn, en dat de koning noch schaak staat, noch een aangevallen veld doorkruist, noch zichzelf schaak zet.

Deze laatste drie punten zijn in werkelijkheid **dezelfde regel** toegepast op drie velden: dat van de koning, dat waar hij doorheen gaat, dat waar hij aankomt. Vandaar een tabel in plaats van verspreide voorwaarden:

```python
# letter van het recht -> (veld van de koning, aankomst, velden om te legen, velden die niet aangevallen mogen worden)
ROQUES = {
    "K": (95, 97, (96, 97), (95, 96, 97)),
    "Q": (95, 93, (94, 93, 92), (95, 94, 93)),
    "k": (25, 27, (26, 27), (25, 26, 27)),
    "q": (25, 23, (24, 23, 22), (25, 24, 23)),
}
```

Kijk goed naar de regel van de lange rokade. Drie velden moeten **leeg** zijn (d1, c1, b1), maar slechts twee velden naast dat van de koning moeten **niet aangevallen** zijn (d1, c1). Veld b1 mag prima onder vuur liggen van een vijandige toren: de koning doorkruist het niet, alleen de toren doorkruist het, en een toren mag een aangevallen veld doorkruisen. Dit is de klassieke rokadefout, en ze is onzichtbaar zonder een exacte telling.

## Het echte onderwerp: pseudolegaal versus legaal

Dit zijn de verplaatsingsregels. Ze produceren wat men **pseudolegale** zetten noemt: conform de beweging van het stuk, zonder garantie dat de koning overleeft.

Men zou kunnen denken dat het geval marginaal is. Laten we het meten, op de 1.498 stellingen uit echte partijen samengesteld in het vorige artikel:

```text
$ python3 pourquoi_le_filtre.py
1498 positions
  coups pseudo-légaux : 46553
  coups légaux        : 41648
  illégaux            : 4905 (10.54 %)
  positions concernées : 778 (51.9 %)

Pire position du jeu d'essai :
  7r/2P2p1k/p3b1B1/7p/1b3p1P/6P1/7K/2q5 b - - 0 41
  52 pseudo-légaux, 5 légaux, soit 47 coups illégaux
```

**Eén op de tien zetten is illegaal, en meer dan de helft van de stellingen is betrokken.** In de slechtste stelling van de testset staat de zwarte koning schaak: van 52 zetten die de verplaatsing van de stukken respecteren, zijn er slechts 5 speelbaar. Een engine die dit filter negeert, speelt niet slecht schaak, hij speelt een ander spel.

Drie situaties produceren deze illegale zetten, met toenemende moeilijkheidsgraad:

1. **De koning zet zichzelf schaak.** Gemakkelijk apart te detecteren.
2. **Een gepend stuk beweegt.** Een paard voor zijn koning, met een vijandige loper in dezelfde lijn, heeft geen enkele legale zet. Detecteerbaar, maar men moet de penningen berekenen.
3. **Een en-passantslag maakt twee velden tegelijk vrij.** De pion die slaat verlaat zijn kolom, en de geslagen pion verdwijnt van een naburig veld: twee velden worden tegelijk leeg op dezelfde rij. Als koning en vijandige toren zich op die rij bevinden, is de zet illegaal. Geen enkele klassieke penningtest vangt dit, omdat geen van beide pionnen gepend was.

Het derde geval is de reden waarom we de brute methode kiezen.

## De luie legaliteitscontrole

De procedure past in vier regels, en is juist door constructie.

```python
def coups_legaux(self):
    blanc = self.trait == "w"
    legaux = []
    for coup in self.coups_pseudo_legaux():
        self.jouer(coup)
        if not self.en_echec(blanc):
            legaux.append(coup)
        self.annuler()
    return legaux
```

Men speelt de zet, kijkt of de eigen koning geslagen wordt, en draait terug. Geen redenering over penningen, ontdekkingen of vreemde gevallen: men constateert. Elk speciaal geval van de regels dat niet was voorzien, wordt correct behandeld, inclusief en passant dat een schaak ontdekt, aangezien men enkel het schaakbord achteraf bekijkt.

Dit is ook wat de functies `jouer` en `annuler` uit het vorige artikel absoluut cruciaal maakt. Een terugdraaiing die de toestand slecht herstelt, veroorzaakt geen geïsoleerde illegale zet: ze **corrumpeert de stelling voor de rest van het hele zoekproces**.

Wat het kost:

```text
Génération pseudo-légale seule : 0.08 s
Génération légale complète     : 0.62 s  (x7.3)
```

Een factor 7,3. Dat is enorm, en het wordt voorlopig geaccepteerd. Eerst de juistheid, dan de snelheid: artikel 9 komt terug op dit onderdeel, dat de eerste kandidaat voor optimalisatie is in elke engine. Een foute generator optimaliseren heeft geen enkel nut.

## Een aangevallen veld detecteren door achteruit te redeneren

Er rest nog `en_echec` te schrijven, dat berust op `case_attaquee`. De naïeve aanpak is alle vijandige zetten te genereren en te kijken of ze het veld bereiken. Dat werkt, is traag, en is circulair: het genereren van vijandige zetten zou hun legaliteit moeten controleren, dus schaakstanden moeten detecteren.

Men redeneert dus in de andere richting. Men vertrekt vanaf het veld, en gaat elke richting terug om te kijken wie zich daar bevindt. Het werk is hetzelfde, maar begrensd door de acht richtingen in plaats van het aantal vijandige stukken.

```python
# Pièces qui glissent. On avance dans chaque direction jusqu'au premier
# obstacle : s'il s'agit d'une pièce adverse du bon type, la case est attaquée.
diagonales = ("B", "Q") if par_les_blancs else ("b", "q")
lignes = ("R", "Q") if par_les_blancs else ("r", "q")
for sauts, attaquants in ((SAUTS["B"], diagonales), (SAUTS["R"], lignes)):
    for saut in sauts:
        arrivee = case + saut
        while cases[arrivee] is VIDE:
            arrivee += saut
        if cases[arrivee] in attaquants:
            return True
```

Merk op dat er geen uitgangstest in de `while`-lus staat. Ze stopt sowieso, omdat de rand van sentinels nooit `VIDE` is. Dat is opnieuw het voordeel van de mailbox.

Het geval van de pion verdient een moment aandacht, omdat de richting omkeert. Een witte pion slaat naar boven op het bord; om een veld aan te vallen moet hij zich dus **eronder** bevinden:

```python
pion = "P" if par_les_blancs else "p"
sens = 1 if par_les_blancs else -1
if cases[case + 9 * sens] == pion or cases[case + 11 * sens] == pion:
    return True
```

## De schuld van artikel 2, afgelost

Het vorige artikel eindigde met een aanvaarde discrepantie: 78 van de 1.498 stellingen waar onze FEN verschilde van die van Stockfish, uitsluitend op het en-passantveld. Wij kondigden het veld aan na elke pionzet van twee velden; moderne engines kondigen het alleen aan als de slag daadwerkelijk speelbaar is.

Onmogelijk te beslissen zonder zettengenerator. Nu we die hebben:

```python
def prise_en_passant_possible(self):
    if self.en_passant is None:
        return False
    blanc = self.trait == "w"
    pion = "P" if blanc else "p"
    avant = -10 if blanc else 10
    for cote in (-1, 1):
        depart = self.en_passant - avant + cote
        if self.cases[depart] != pion:
            continue
        coup = Coup(depart, self.en_passant)
        self.jouer(coup)
        legal = not self.en_echec(blanc)
        self.annuler()
        if legal:
            return True
    return False
```

Het lastige punt is dat het niet volstaat de aanwezigheid van een pion ernaast vast te stellen. Deze pion kan gepend zijn, of de slag kan een schaak op de rij ontdekken: in die gevallen is de slag illegaal en mag het veld niet worden aangekondigd. Men speelt de zet dus daadwerkelijk opnieuw. Het is hetzelfde filter als voor de andere, en om dezelfde reden.

Deze conventie is niet cosmetisch. Het is die van de referentiestellingen van `perft`, het onderwerp van het volgende artikel: een stelling waarvan het en-passantveld ten onrechte wordt aangekondigd, zou zetten laten meetellen die niet bestaan, en de telling zou fout zijn zonder dat de generatie het is.

## De controle: 41.648 vergeleken zetten

De test van dit artikel gebruikt een commando van Stockfish dat een oude bekende gaat worden: `go perft 1`. Het laat de engine alle legale zetten van de huidige stelling opsommen. We vergelijken verzameling tegen verzameling, op dezelfde 1.498 stellingen.

```text
$ STOCKFISH=... python3 verifier_coups.py
1498 positions dans le jeu d'essai

1. Coups légaux            : 1498/1498 positions (41648 coups comparés)
2. Aller-retour FEN        : 1498/1498
3. Position après le coup  : 1498/1498

Tout est vert.
```

Eenenveertigduizend zeshonderdachtenveertig zetten, elk vergeleken met de referentie. En de tweede regel bevestigt het aflossen van de schuld: de 78 discrepanties uit het vorige artikel zijn verdwenen.

Rest te weten wat het script zegt wanneer het misgaat, want daar wordt een test op beoordeeld. Laten we een aannemelijke fout introduceren: in de tabel `ROQUES`, schrijven we het aankomstveld van de lange witte rokade als b1 (index 92) in plaats van c1 (index 93). Eén veld verschil, het soort fout dat men tien keer herleest zonder het te zien.

```text
$ STOCKFISH=... python3 verifier_coups.py
1 positions dans le jeu d'essai

  position r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1
    coups en trop    : e1b1
    coups manquants  : e1c1
1. Coups légaux            : 0/1 positions (48 coups comparés)

1 échec(s).
```

De foute stelling, de teveel gespeelde zet, de ontbrekende zet. Dat is precies wat men nodig heeft, want een bug in de zettengeneratie vindt men niet door de code te herlezen: men vindt hem door de stelling te isoleren die hem veroorzaakt.

## Kiwipete

Een laatste controle, in afwachting van de echte balans van het volgende artikel. In de kleine wereld van schaakengines bestaat een beroemde stelling, van Peter McKenzie, bekend als **Kiwipete**:

```text
r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1
```

Ze werd geconstrueerd om lastig te zijn. Beide kampen kunnen aan beide kanten rokeren, er zijn gepende stukken, een zwarte pion op b4 staat klaar om en passant te slaan, en er is genoeg materiaal om elke kleine vergetelheid in de telling te laten zien. Ze heeft precies **48 legale zetten**.

```text
$ python3 echiquier.py
20 coups légaux : a2a3 a2a4 b1a3 b1c3 b2b3 b2b4 c2c3 c2c4 d2d3 d2d4 e2e3 e2e4
                  f2f3 f2f4 g1f3 g1h3 g2g3 g2g4 h2h3 h2h4

Kiwipete : 48 coups légaux (48 attendus)
```

Twintig zetten in de beginstelling, achtenveertig in Kiwipete. Dat zijn de eerste twee waarden van een reeks getallen die de enige rechter van jouw generator gaat worden.

Want een generator die correct is op diepte 1 kan fout zijn op diepte 2: het volstaat dat hij een licht foute stelling produceert waarvan de zetten zelf wel correct worden gegenereerd. Het tellen van de zetten van één stelling bewijst niets over de miljoenen stellingen die daaruit voortvloeien.

**Volgend artikel:** `perft`, de recursieve telling die, referentiestelling na referentiestelling, bewijst dat jouw zettengenerator exact is. En de techniek waarmee, wanneer de telling fout is, de foute zet in enkele minuten gevonden kan worden in plaats van enkele dagen.
