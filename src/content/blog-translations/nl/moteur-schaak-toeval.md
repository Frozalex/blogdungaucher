---
title: "Een schaakengine die willekeurig speelt: de eerste die echt speelt"
excerpt: >-
  De slechtst mogelijke engine is ook de leerzaamste om te schrijven. Hij zet alles op zijn plaats wat rond
  de zetkeuze draait: de partijlus, de vijf manieren om te eindigen, de notatie. Na hem blijft er nog maar
  één regel over om te veranderen om de engine intelligent te maken.
seoTitle: "Een schaakengine coderen die een volledige partij speelt in Python"
seoDescription: >-
  De partijlus van een schaakengine in Python: detectie van mat en pat, vijftig-zettenregel, onvoldoende
  materiaal, drievoudige zetherhaling, en het genereren van een leesbare PGN.
frSlug: un-moteur-qui-joue-au-hasard
draft: false
faq:
  - question: "Hoe detecteer je schaakmat in programmeren?"
    answer: >-
      Met twee tests, in deze volgorde. Eerst: heeft de partij aan zet minstens één legale zet? Zo ja,
      gaat de partij door. Zo niet, tweede test: staat zijn koning schaak? Zo ja, is het mat, zo niet is
      het pat. Er bestaat geen directe test voor mat, en dat is maar goed ook: die volgt volledig uit de
      reeds geschreven zettengenerator.
  - question: "Eindigt een willekeurig gespeelde partij altijd?"
    answer: >-
      Ja, en dat is bewijsbaar. De vijftig-zettenregel maakt een einde aan de partij na honderd halve
      zetten zonder slag of pionzet. De teller wordt alleen op nul gezet bij een slag of een pionzet, en
      er is maar een eindig aantal stukken om te slaan en vakken vóór de pionnen, die nooit achteruitgaan.
      Het aantal resets is dus begrensd, dus de partij ook.
  - question: "Wat zijn de vijf manieren om een schaakpartij te beëindigen?"
    answer: >-
      Schaakmat, pat, de vijftig-zettenregel, onvoldoende materiaal en drievoudige zetherhaling. Een
      engine moet ze allemaal implementeren: de drievoudige herhaling vergeten, bijvoorbeeld, laat hem
      oneindig een gewonnen stelling spelen die hij niet weet om te zetten.
  - question: "Wat is onvoldoende materiaal precies?"
    answer: >-
      De stellingen waarin geen van beide partijen mat kan zetten, zelfs met medewerking van de ander:
      koning tegen koning, koning en loper tegen koning, koning en paard tegen koning, en koning en loper
      tegen koning en loper van dezelfde veldkleur. Let op het klassieke geval van <strong>koning en twee
      paarden</strong>: mat is er mogelijk maar niet af te dwingen, de partij wordt dus niet onmiddellijk
      remise verklaard.
  - question: "Waarom heeft mijn engine algebraïsche notatie nodig?"
    answer: >-
      Dat heeft hij niet nodig. Het UCI-protocol en alle grafische interfaces werken in lange notatie
      (<code>e2e4</code>, <code>e7e8q</code>), die ondubbelzinnig is. De verkorte algebraïsche notatie
      bestaat alleen om leesbare PGN's voor een mens te produceren, en de enige echte kost ervan is de
      desambiguatie wanneer twee identieke stukken hetzelfde vak kunnen bereiken.
---

[Fase 1 van deze serie](/fr/blog/perft-verifier-son-generateur-de-coups/) eindigde met een programma dat de schaakregels perfect kent en niet speelt. Het weet wat toegestaan is. Het heeft geen idee wat goed is.

Je zou direct de evaluatie en de zoekfunctie kunnen aanpakken. Dat zou een vergissing zijn, omdat er tussen "de zetten kennen" en "een partij spelen" nog een hele loodgieterij ligt: de lus die de partijen afwisselt, de vijf manieren om te eindigen, het schrijven van de partij in een leesbaar formaat. Beter dit nu eens en voorgoed schrijven terwijl de zetkeuze triviaal is.

Vandaar de engine van dit artikel, de slechtste die je kunt schrijven terwijl je toch legaal blijft.

```python
class MoteurAuHasard:
    nom = "Hasard"

    def __init__(self, graine=None):
        self.alea = random.Random(graine)

    def choisir(self, echiquier, coups):
        return self.alea.choice(coups)
```

Dat is alles. En het belang van de zaak zit precies daar: **vanaf nu zullen alle engines van de serie enkel verschillen in de inhoud van `choisir`**. Het hele vervolg zal erin bestaan die ene regel te vervangen.

## De partijlus

```python
def jouer_une_partie(blancs, noirs, avec_notation=True):
    echiquier = Echiquier()
    cles_vues = Counter()
    coups_san = []
    coups_uci = []

    while True:
        cles_vues[echiquier.cle_position()] += 1
        verdict = echiquier.resultat(cles_vues)
        if verdict:
            resultat, motif = verdict
            return resultat, motif, coups_san, coups_uci

        coups = echiquier.coups_legaux()
        moteur = blancs if echiquier.trait == "w" else noirs
        coup = moteur.choisir(echiquier, coups)

        if avec_notation:
            coups_san.append(san(echiquier, coup))
        coups_uci.append(str(coup))
        echiquier.jouer(coup)
```

Niets verrassends, op één detail na: je telt de stelling **voordat** je het verdict test, nooit erna. De drievoudige herhaling wordt beoordeeld op de huidige stelling, die waarin de partij aan zet op het punt staat te spelen; het omkeren verschuift de telling met een halve zet en laat de remise een herhaling te vroeg of te laat verklaren.

Nog een detail dat de lus niet bevat: geen enkele zetlimiet. Dat is geen vergetelheid, en het is bewijsbaar.

De vijftig-zettenregel maakt een einde aan de partij na honderd halve zetten zonder slag of pionzet. De teller wordt alleen in deze twee gevallen op nul gezet. Maar er is maar een eindig aantal stukken om te slaan, en pionnen gaan nooit achteruit: het aantal mogelijke resets is dus begrensd. Een willekeurig gespeelde partij, hoe absurd ook, eindigt altijd.

## De vijf manieren om te eindigen, en de volgorde om ze te testen

```python
def resultat(self, cles_vues=None):
    if not self.coups_legaux():
        if self.en_echec(self.trait == "w"):
            return ("0-1" if self.trait == "w" else "1-0", "échec et mat")
        return ("1/2-1/2", "pat")

    if self.demi_coups >= 100:
        return ("1/2-1/2", "règle des cinquante coups")
    if self.materiel_insuffisant():
        return ("1/2-1/2", "matériel insuffisant")
    if cles_vues is not None and cles_vues.get(self.cle_position(), 0) >= 3:
        return ("1/2-1/2", "triple répétition")
    return None
```

**Mat en pat zijn dezelfde test.** Er bestaat geen functie "detecteer mat": er is een afwezigheid van legale zet, gevolgd door een aanvullende vraag: staat de koning schaak. Deze elegantie wordt geboden door de zettengenerator van artikel 3; een engine die mat rechtstreeks zou willen detecteren, zou de helft van deze generator herschrijven, en slechter.

**De volgorde telt.** Mat gaat boven alles. Een stelling waarin de teller van de vijftig zetten 100 bereikt door een zet die mat zet, is een mat, geen remise: de FIDE-regel is daar expliciet over, en het is precies het soort geval dat een engine één keer op de honderdduizend partijen tegenkomt, op het slechtst mogelijke moment.

## Onvoldoende materiaal, subtieler dan het lijkt

```python
mineures = [case for case in occupees if self.cases[case] in "BbNn"]
if len(mineures) <= 1:
    return True
if len(mineures) == 2 and all(self.cases[case] in "Bb" for case in mineures):
    couleurs = {(case // 10 + case % 10) % 2 for case in mineures}
    return len(couleurs) == 1
return False
```

Slechts vier gevallen zijn onmiddellijke remises: koning tegen koning, koning en loper, koning en paard, en de twee lopers van dezelfde veldkleur. De voorwaarde over de kleur van de vakken lees je direct af uit de mailbox-indices: de som van rij en kolom heeft dezelfde pariteit voor alle vakken van dezelfde tint.

De valstrik zit elders, in een geval dat je zou denken dat het erbij hoort: **koning en twee paarden tegen koning**. Mat is er mogelijk, het is alleen niet af te dwingen als de tegenstander goed speelt. De FIDE verklaart de remise dus niet: de partij gaat verder, en eindigt via de vijftig-zettenregel. Een engine die dit geval bij de onmiddellijke remises indeelt, geeft een stelling op die hij tegen een afgeleide tegenstander had kunnen winnen.

## Wat "dezelfde stelling" is

De drievoudige herhaling vereist het vergelijken van stellingen, wat veronderstelt dat je gelijkheid definieert.

```python
def cle_position(self):
    return (
        tuple(self.cases[case] for case in CASES),
        self.trait,
        self.roques,
        self.en_passant if self.prise_en_passant_possible() else None,
    )
```

Twee stellingen zijn hetzelfde als het bord, de partij aan zet, de rokaderechten en de beschikbare en passant-slagen overeenkomen. **De twee tellers maken er geen deel van uit.** Een herhaalde stelling is dat ook als de vijftig-zettenteller ondertussen is opgelopen: anders zou geen enkele stelling ooit herhaald worden, aangezien deze teller alleen maar stijgt.

Merk op dat het en passant-veld alleen in de sleutel opgenomen wordt als de slag **speelbaar** is, precies zoals in de FEN van artikel 3. Twee identieke stellingen waarvan de ene volgt op een zet van twee vakken zonder mogelijke slag zijn wel degelijk dezelfde stelling volgens de regels.

Deze sleutel is correct en traag: hij bouwt een tuple van 64 elementen bij elke zet, en roept `prise_en_passant_possible` aan, die zetten speelt en terugdraait. Dat is hier acceptabel, waar hij eenmaal per halve zet wordt aangeroepen. Dat zal niet meer zo zijn wanneer de zoekfunctie er honderdduizenden per seconde van vraagt, en artikel 10 vervangt hem door een [Zobrist-hash](https://www.chessprogramming.org/Zobrist_Hashing), die bij elke zet een eenvoudig geheel getal bijwerkt.

## Algebraïsche notatie is niet voor de engine

De engine werkt van begin tot eind in UCI-notatie: `e2e4`, `e7e8q`, twee stukjes van twee tekens en een eventuele promotie. Dat is ondubbelzinnig, het valt te lezen zonder de stelling te kennen, en het is wat het UCI-protocol en alle grafische interfaces verwachten.

De verkorte algebraïsche notatie bestaat alleen voor ons. Ze heeft een kost, en die zit volledig in één enkel geval: wanneer twee identieke stukken hetzelfde vak kunnen bereiken, volstaat `Cf3` niet meer.

```python
def _desambiguiser(echiquier, coup, piece):
    rivales = [
        autre.depart
        for autre in echiquier.coups_legaux()
        if autre.arrivee == coup.arrivee
        and autre.depart != coup.depart
        and echiquier.cases[autre.depart] == piece
    ]
    if not rivales:
        return ""

    depart = nom_de_case(coup.depart)
    if all(nom_de_case(case)[0] != depart[0] for case in rivales):
        return depart[0]
    if all(nom_de_case(case)[1] != depart[1] for case in rivales):
        return depart[1]
    return depart
```

Eerst de kolom, dan de rij, allebei als laatste redmiddel. En merk op dat de rivalen worden gezocht onder de **legale** zetten: twee paarden kunnen naar f3 gaan, maar als een van beide gepend is, is er geen dubbelzinnigheid en blijft de notatie `Cf3`.

## Een echte partij

Hier is een fragment van een volledige partij geproduceerd door twee willekeurige engines, zoals het programma het schrijft:

```text
[Event "Partie au hasard"]
[Site "blogdungaucher.com"]
[White "Hasard"]
[Black "Hasard"]
[Result "1/2-1/2"]
[Termination "matériel insuffisant"]

1.b3 g6 2.h4 Fh6 3.e3 a6 4.Ch3 Fg5 5.Fb2 Fxh4 6.c4 Ch6 7.Fe5 Tf8 8.a3 Ta7 9.
Df3 d6 10.Dxf7+ Txf7 11.Fc3 c5 12.Fa5 Ff5 13.Ta2 Ff6 14.Tb2 Fd3 15.f3 Cc6 16.
[...]
95.Rb2 Tb3+ 96.Rxb3 Rf8 97.e7+ Rf7 98.e8=T a5 99.Te5 a4+ 100.Rc2 Rf8 101.Tc5
[...]
141.Tg3 Rc4 142.Tc3+ Rb4 143.Rb7 Rxc3
1/2-1/2

286 demi-coups, matériel insuffisant
```

Deze PGN opent in elke willekeurige viewer. Twee details zijn een blik waard. Bij zet 10, `Dxf7+`: de witte dame geeft zich gratis weg met schaak, en de zet is correct genoteerd. Bij zet 98, `e8=T`: het toeval promoveerde naar een toren in plaats van een dame, wat niet zou zijn gebeurd met een generator die onderpromoties vergeet.

## Vijfhonderd willekeurige partijen

Eenmaal de lus op zijn plaats, weerhoudt niets ons ervan hem vijfhonderd keer uit te voeren. Je krijgt daarbij een statistisch portret van toeval bij het schaken, dat ik nergens anders in deze vorm heb gevonden.

```text
$ python3 partie.py 500
500 parties au hasard

Résultats
  0-1         30  (  6.0 %)
  1-0         39  (  7.8 %)
  1/2-1/2    431  ( 86.2 %)

Motifs de fin
  matériel insuffisant           271  ( 54.2 %)
  règle des cinquante coups      117  ( 23.4 %)
  échec et mat                    69  ( 13.8 %)
  pat                             35  (  7.0 %)
  triple répétition                8  (  1.6 %)

Longueur : 27 à 628 demi-coups, médiane 356
```

Drie dingen zijn het waard om erbij stil te staan.

**Toeval eindigt in 86% van de gevallen in remise**, en voor het grootste deel door uitputting van het materiaal: beide partijen verslinden elkaar tot er niets meer overblijft om mee mat te zetten. Het is het exacte portret van een spel zonder plan, waarin elk stuk dat aangeboden wordt, wordt genomen.

**Mat komt toch nog voor in een op de zeven partijen.** Dat is meer dan je zou verwachten, en de verklaring is een beetje vernederend voor het toeval: met een koning die in het centrum rondwandelt en een tegenstandersdame nog op het bord, komt het mat vanzelf. Het wordt niet opgebouwd, het wordt ondergaan.

**Pat vertegenwoordigt 7% van de eindes**, tegen een fractie van een procent in menselijke partijen. De uitgeklede stellingen waarin een koning geen vak meer heeft, zijn precies die waarin het toeval de meeste tijd doorbrengt.

De mediaan van 356 halve zetten, oftewel 178 zetten, zegt de rest: een menselijke partij duurt zelden meer dan tachtig zetten. Het toeval gaat nergens heen, heel lang.

Dat is een goede meting van het probleem dat de rest van de serie moet oplossen. De engine mist geen winnende zetten, hij mist **continuïteit**: om mat te zetten heb je een reeks zetten nodig die onderling samenhangen, en het toeval breekt bij de volgende zet af wat het bij de vorige heeft opgebouwd.

## De verificatie: volledige partijen, stelling na stelling

De artikelen 3 en 4 verifieerden de generator op een vaste testset. Hier zijn de stellingen bij elke uitvoering nieuw, en vooral zijn ze vreemd: een willekeurige partij gaat waar geen enkele menselijke partij gaat, in stellingen met drie dames waarin alles gepend is en de koning in het centrum rondwandelt. Het is een uitstekend jachtterrein.

Voor elke halve zet van elke partij vergelijk je onze verzameling legale zetten met die van Stockfish. Aan het einde controleer je het verdict zelf: dat geen enkele zet legaal is wanneer mat of pat wordt aangekondigd, en dat de partij inderdaad schaak staat in het eerste geval en niet in het tweede.

```text
$ STOCKFISH=... python3 verifier_partie.py 20
20 parties, 6150 demi-coups vérifiés position par position
  matériel insuffisant         8
  règle des cinquante coups    5
  échec et mat                 4
  pat                          3

Aucun coup illégal.
```

Zesduizend honderdvijftig stellingen, waarvan er geen enkele in de testset van de vorige artikelen zat, en waarop onze generator exact de verzameling zetten van Stockfish produceert. Elke uitvoering verkent er zesduizend andere.

## Wat je nu hebt

Een programma dat volledige schaakpartijen speelt, van de eerste zet tot het definitieve verdict, zonder ooit een illegale zet te produceren of zich in het einde te vergissen. Er ontbreekt hem maar één ding: een reden om de ene zet boven een andere te verkiezen.

Dat is het onderwerp van het volgende artikel, en het eerste moment in de serie waarin de engine ergens op begint te lijken.

**Volgend artikel:** een stelling evalueren, beginnend met wat iedereen kan: materiaal tellen. Met een verrassing als beloning: een engine die alleen dat doet, zonder verder dan een halve zet vooruit te kijken, is al oneindig veel beter dan het toeval, en blijft toch zeer slecht.
