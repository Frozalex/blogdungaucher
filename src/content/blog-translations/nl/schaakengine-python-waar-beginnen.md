---
title: "Een schaakengine programmeren in Python: waar te beginnen"
excerpt: >-
  Een schaakengine is niet de site waarop je speelt, noch de evaluatiebalk waar je naar kijkt. Het is
  een commandoregelprogramma van een paar honderd regels. Eerste artikel van een reeks die er een van
  nul af aan bouwt, met een objectieve verificatie bij elke stap.
seoTitle: "Een schaakengine programmeren in Python: waar te beginnen"
seoDescription: >-
  Hoe werkt een schaakengine, en hoe schrijf je er een in Python zonder enige bibliotheek. Installatie,
  UCI-protocol, FEN lezen: het eerste artikel van een reeks van 12.
frSlug: moteur-echecs-python-par-ou-commencer
draft: false
faq:
  - question: "Moet je goed zijn in schaken om een engine te programmeren?"
    answer: >-
      Nee, en dat is zelfs contra-intuïtief: de vereiste vaardigheden zijn vooral algoritmisch. Je moet
      de <strong>volledige regels</strong> van het spel kennen, inclusief de zeldzame gevallen (en
      passant slaan, rokade verboden over een aangevallen veld, suboptimale promotie, remise door
      herhaling), want dat zijn precies degene die je code zal vergeten. Weten hoe je een Siciliaans
      speelt, helpt daarentegen niets. Veel makers van engines zijn programmeurs rond 1.500 Elo.
  - question: "Waarom niet de bibliotheek python-chess gebruiken?"
    answer: >-
      Omdat die al doet wat de reeks je leert doen. <code>python-chess</code> beheert de weergave van
      het bord, het genereren van legale zetten, het lezen van FEN en PGN, en de UCI-communicatie. Het
      gebruiken ervan zou de reeks veranderen in een API-tutorial: je zou methodenamen leren, niet hoe
      een engine werkt. Het blijft een uitstekend hulpmiddel voor een echt project, alleen niet voor deze
      reeks.
  - question: "Kan een engine geschreven in Python sterk zijn?"
    answer: >-
      Sterk voor een mens, ja. Sterk tegenover Stockfish, nee. Python is ongeveer duizend keer
      langzamer dan een engine in C++ voor de kritieke taak (zetten genereren en spelen), wat ongeveer
      <strong>vier tot vijf zoekdieptes</strong> kost bij gelijke tijd. Een verzorgde Python-engine
      bereikt het niveau van een goede clubspeler. Dat is ruim voldoende om zijn maker te verslaan, wat
      het echte doel is.
  - question: "Hoeveel regels code telt een minimale schaakengine?"
    answer: >-
      Een engine die legaal speelt, een stelling evalueert en een paar zetten vooruit zoekt, past in
      <strong>400 tot 600 regels Python</strong>. Het genereren van zetten neemt daarvan alleen al bijna
      de helft in beslag, en daar bevindt zich ook vrijwel alle bugs. Ter vergelijking: Stockfish
      overschrijdt de 60.000 regels C++, maar het grootste deel van dat volume dient om de laatste Elo-
      punten te winnen, niet om correct te spelen.
  - question: "Wat is het UCI-protocol precies?"
    answer: >-
      <em>Universal Chess Interface</em>, gepubliceerd door Stefan Meyer-Kahlen in 2000. Het is een
      conventie voor platte-tekstcommunicatie tussen een engine en een grafische interface: de interface
      stuurt <code>position</code> en dan <code>go</code>, de engine antwoordt met <code>info</code>-
      regels en dan een <code>bestmove</code>-regel. Omdat het tekst is op de standaardinvoer en -uitvoer,
      kan elke taal die op de console kan schrijven UCI spreken, Python inbegrepen.
---

Je hebt waarschijnlijk ooit uit nieuwsgierigheid de repository van Stockfish geopend. Zestigduizend regels C++, bestanden met namen als `bitboard.cpp` en `nnue_architecture.h`, tabellen met magische constanten waar geen enkel commentaar uitlegt waar ze vandaan komen. En je hebt het tabblad weer gesloten.

Dat is jammer, want het misverstand zit daar meteen al: wat je hebt geopend, is geen schaakengine. Het is een schaakengine na twintig jaar optimalisatie door honderden bijdragers. De engine zelf, het conceptuele object, past in vier ideeën en een paar honderd regels.

Deze reeks bouwt ze een voor een op. Twaalf artikelen, van het lege bestand tot een programma dat je kunt laden in een echte schaakinterface en waartegen je kunt spelen. Met een regel die het onderscheidt van de meeste tutorials: **aan het eind van elk artikel beschik je over een objectieve manier om te weten of je code klopt**. Geen "het lijkt te werken". Een getal, vergeleken met een gepubliceerde referentiewaarde.

Dit eerste artikel codeert bijna niets. Het dient om te begrijpen wat we gaan bouwen, de werkplaats in te richten, en te controleren of alles draait.

## Een schaakengine is niet wat je denkt

Als je een partij analyseert op Lichess of Chess.com, zie je een bord, een evaluatiebalk die overhelt, een lijst kandidaatzetten. Niets daarvan is de engine. Het zijn pixels getekend door je browser.

De engine zelf is een programma zonder enige interface. Hij weet niet wat een scherm is. Hij leest regels tekst op zijn standaardinvoer, en schrijft regels tekst op zijn standaarduitvoer. Dat is alles. Je kunt het in dertig seconden verifiëren: download Stockfish, start hem in een terminal, en typ er rechtstreeks in.

```text
$ ./stockfish
Stockfish 18 by the Stockfish developers (see AUTHORS file)
uci
id name Stockfish 18
id author the Stockfish developers (see AUTHORS file)

option name Debug Log File type string default <empty>
...
uciok
position startpos
go movetime 1000
info depth 20 seldepth 32 multipv 1 score cp 36 nodes 701669 nps 701669 time 1000 pv e2e4 e7e5
bestmove e2e4 ponder e7e5
```

Dat is een schaakengine in zijn natuurlijke staat. Je hebt hem gezegd "hier is de startstelling, denk een seconde na", en hij antwoordde "ik speel e4, en ik verwacht e5". De evaluatiebalk die je kent, is gewoon de `score cp 36` van deze regel, mooi getekend: 36 honderdsten van een pion voorsprong voor Wit.

Deze strikte scheiding maakt het project haalbaar. Je hoeft **geen enkele grafische interface te schrijven**. Je schrijft een programma dat dit dialect spreekt, en alle bestaande interfaces weten het al te gebruiken.

## De vier organen

Een schaakengine, welke dan ook, doet vier dingen. Niets meer.

**1. De stelling weergeven.** Waar staan de stukken, wie is aan zet, welke rokades zijn nog mogelijk, is en-passant beschikbaar, hoeveel halve zetten sinds de laatste slag. Dit is het skelet: al het andere steunt erop, en een middelmatige keuze hier ondermijnt permanent de snelheid van de engine.

**2. De legale zetten genereren.** Vanuit een stelling de uitputtende lijst van toegestane zetten produceren. Uitputtend en exact: geen een teveel, geen een te weinig. Dit is verreweg het meest vervelende deel, het minst spectaculaire, en het deel dat 90% van de bugs van een beginnende engine bevat. De vreemde regels van het schaakspel zitten er allemaal: de rokade die niet over een aangevallen veld mag, en-passant dat maar één zet lang beschikbaar is, promotie tot paard, de absolute penning die verbiedt een stuk te verplaatsen.

**3. Een stelling evalueren.** Antwoord geven op de vraag "wie staat beter, en met hoeveel?" zonder ook maar één zet verder te spelen. Het is een heuristiek, nooit een waarheid: de engine telt het materiaal, kijkt waar de stukken staan, en geeft een getal terug.

**4. Zoeken.** De boom van mogelijke zetten verkennen, ervan uitgaande dat de tegenstander goed speelt, om de zet te kiezen die leidt naar de beste bereikbare stelling. Dit is het [minimax](/nl/blog/minimax-in-het-schaken/)-algoritme, en alles wat sindsdien is uitgevonden, bestaat eruit er een minuscuul deel van te verkennen zonder de goede zet onderweg te verliezen.

Aan deze vier organen voegt zich een loodgieterswerk toe: het UCI-protocol, dat ze verbindt met de buitenwereld. Een dertigtal regels, als laatste.

De opdeling van de reeks volgt precies deze volgorde.

| Fase | Artikelen | Wat we bouwen |
|---|---|---|
| 1 | 1 tot 4 | De weergave en het genereren van zetten, bewezen correct |
| 2 | 5 tot 8 | De evaluatie en het zoeken: de engine speelt echt |
| 3 | 9 tot 11 | De snelheid: dieper zoeken in dezelfde tijd |
| 4 | 12 | UCI, en de eerlijke meting van de behaalde sterkte |

Het volledige plan, artikel per artikel, staat op de [pagina van de reeks](/nl/series/moteur-python/).

## Waarom Python de slechtste keuze is, en waarom we hem toch nemen

Laten we het meteen zeggen, met cijfers in plaats van indrukken.

De meest voorkomende taak van een engine is het genereren van legale zetten van een stelling en ze spelen. Deze snelheid wordt gemeten met `perft`, een teller die alle mogelijke partijen tot een gegeven diepte opsomt. Vanaf de startstelling, op zes halve zetten, zijn er precies 119.060.324 stellingen. Stockfish doorloopt ze op mijn machine (een laptop, AMD Ryzen 7 5700U) in 1,60 seconde. Ongeveer **74 miljoen gegenereerde zetten per seconde**.

Een verzorgde Python-engine zit rond de honderdduizend. Drie ordes van grootte lager.

Deze factor duizend wordt betaald in zoekdiepte. De gemiddelde vertakkingsfactor bij schaken is een dertigtal zetten, teruggebracht tot ongeveer 5 of 6 na goed snoeien: elk extra dieptenniveau kost dus grofweg een factor 5. Een factor 1.000 verliezen is ongeveer **vierenhalf niveau** verliezen. Waar een C++-engine vijftien zetten ver ziet, ziet de jouwe er tien.

Waarom dan Python?

Omdat het doel niet is Stockfish te verslaan. Niemand verslaat Stockfish, inclusief mensen die al vijftien jaar engines in C++ schrijven. Het doel is begrijpen, en Python heeft een eigenschap die C++ niet heeft: **de code lijkt op het idee**. Een alfa-bèta-zoekfunctie in Python past in twaalf regels die je hardop kunt lezen. Dezelfde in geoptimaliseerd C++ is onleesbaar voor wie het algoritme nog niet begrijpt.

En de werkelijke drempel is lager dan je denkt. Een engine die tien halve zetten ver ziet met een correcte evaluatie speelt al beter dan vrijwel alle clubspelers. Hij zal zijn maker verslaan, wat een vreemd onaangename ervaring is en het echte doel van de oefening.

## De werkplaats: drie dingen te installeren, waarvan je er twee al hebt

### Python 3.10 of recenter

Verder niets. **Geen enkele externe bibliotheek wordt geïnstalleerd in de hele reeks.** Geen `pip install`, geen virtuele omgeving, geen `requirements.txt`. De hele engine past in de standaardbibliotheek.

Dit is geen puritanisme. Er bestaat een uitstekende schaakbibliotheek in Python, `python-chess`, die zijn werk heel goed doet. Het probleem is dat die precies doet wat de reeks je probeert te leren: hij representeert het bord, genereert legale zetten, leest FEN en PGN, spreekt UCI. Het gebruiken ervan zou neerkomen op het schrijven van een tutorial over hoe je `board.legal_moves` aanroept. Je zou weten hoe je een API gebruikt, niet hoe een engine werkt.

Het blijft de juiste keuze voor een echt project. Alleen niet voor deze reeks.

### Stockfish, als ijkpunt en niets anders

Stockfish maakt nooit deel uit van je engine. Hij dient als **meetinstrument**, om drie redenen:

- hij berekent de referentiewaarden van `perft`, waarmee je zult bewijzen dat je zetgeneratie klopt (artikel 4);
- hij geeft een referentie-evaluatie, waarmee je de jouwe vergelijkt (artikel 6);
- hij dient als gekalibreerde tegenstander, die je stapsgewijs kunt afremmen, om de Elo van je engine te schatten (artikel 12).

Hij is te downloaden op [stockfishchess.org](https://stockfishchess.org/download/). De in deze reeks gepubliceerde cijfers komen van **Stockfish 18**, uitgebracht in januari 2026. Noteer na het uitpakken het pad naar het binaire bestand en zet het in een omgevingsvariabele, we zullen het de hele reeks gebruiken:

```sh
export STOCKFISH=/pad/naar/stockfish
```

### Een editor en een terminal

Die je al hebt. Er is geen grafische interface te installeren vóór artikel 12.

## Eerste programma: een stelling weergeven

Laten we beginnen met het bescheidenste bruikbare programma: een stelling in FEN-formaat lezen en tekenen.

FEN (*Forsyth-Edwards Notation*) is de standaardmanier om een stelling op één regel te schrijven. De startstelling wordt geschreven als:

```text
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

Zes velden gescheiden door spaties. Het eerste beschrijft de stukken, rij voor rij vanaf de 8e: de letters zijn de stukken (hoofdletters voor Wit), de cijfers tellen opeenvolgende lege velden, de schuine strepen scheiden de rijen. De vijf andere velden geven wie aan zet is (`w`), de nog mogelijke rokades (`KQkq`), het en-passantveld (`-` als er geen is), de teller van de vijftigzettenregel (`0`) en het zetnummer (`1`).

Het decoderen past in een dertigtal regels:

```python
SYMBOLES = {
    "P": "♙", "N": "♘", "B": "♗", "R": "♖", "Q": "♕", "K": "♔",
    "p": "♟", "n": "♞", "b": "♝", "r": "♜", "q": "♛", "k": "♚",
}


def lire_fen(fen):
    """Découper une FEN en (cases, trait, roques, en_passant, demi_coups, coup).

    `cases` est une liste de 64 éléments, indexée de a8 (0) à h1 (63), c'est à
    dire dans l'ordre de lecture de la FEN elle-même. Une case vide vaut None.
    """
    champs = fen.split()
    if len(champs) != 6:
        raise ValueError(f"FEN invalide : 6 champs attendus, {len(champs)} reçus")

    rangees = champs[0].split("/")
    if len(rangees) != 8:
        raise ValueError(f"FEN invalide : 8 rangées attendues, {len(rangees)} reçues")

    cases = []
    for rangee in rangees:
        debut = len(cases)
        for caractere in rangee:
            if caractere.isdigit():
                cases.extend([None] * int(caractere))
            elif caractere in SYMBOLES:
                cases.append(caractere)
            else:
                raise ValueError(f"FEN invalide : caractère inattendu {caractere!r}")
        if len(cases) - debut != 8:
            raise ValueError(f"FEN invalide : la rangée {rangee!r} ne fait pas 8 cases")

    return cases, champs[1], champs[2], champs[3], int(champs[4]), int(champs[5])
```

Merk op hoeveel controles er zijn voor dertig regels nuttig werk. Dit is geen decoratieve paranoia: bij artikel 3 zul je veel tijd besteden aan het handmatig schrijven van FEN's om bijzondere gevallen te testen, en een verkeerd gevormde FEN die stilletjes doorglipt, zal je een bug in de zetgeneratie doen zoeken waar er geen is.

Het weergeven is nog eenvoudiger. De velden staan in de leesvolgorde van de FEN, dus a8 eerst: we doorlopen de acht rijen en nummeren achterstevoren.

```python
def afficher(cases, trait):
    """Dessiner l'échiquier vu du côté des Blancs."""
    lignes = []
    for rangee in range(8):
        numero = 8 - rangee
        contenu = []
        for colonne in range(8):
            piece = cases[rangee * 8 + colonne]
            contenu.append(SYMBOLES[piece] if piece else "·")
        lignes.append(f"{numero} | " + " ".join(contenu))
    lignes.append("  +" + "-" * 17)
    lignes.append("    a b c d e f g h")
    lignes.append("")
    lignes.append("Trait aux " + ("Blancs" if trait == "w" else "Noirs"))
    return "\n".join(lignes)
```

Het volledige bestand, met zijn commandoregel, is [`afficher_position.py`](https://github.com/Frozalex/blogdungaucher/blob/main/tools/moteur-python/01-par-ou-commencer/afficher_position.py) in de repository van de site. Zonder argument gestart toont het de startstelling; met een FEN als argument toont het die stelling:

```text
$ python3 afficher_position.py "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 4 4"
8 | ♜ · ♝ ♛ ♚ ♝ ♞ ♜
7 | ♟ ♟ ♟ ♟ · ♟ ♟ ♟
6 | · · ♞ · · · · ·
5 | · · · · ♟ · · ·
4 | · · ♗ · ♙ · · ·
3 | · · · · · ♕ · ·
2 | ♙ ♙ ♙ ♙ · ♙ ♙ ♙
1 | ♖ ♘ ♗ · ♔ · ♘ ♖
  +-----------------
    a b c d e f g h

Trait aux Noirs
Roques possibles : KQkq   Prise en passant : -
Règle des 50 coups : 4 demi-coups   Coup n° 4
```

Dit is het herdersmat vlak voordat het valt. Je programma weet een stelling te lezen. Het is weinig, en het is onmisbaar: zonder weergave zouden alle bugs van de volgende tien artikelen onzichtbaar zijn.

## Tweede programma: praten met Stockfish

De tweede oefening dient voor twee dingen: verifiëren dat je Stockfish-installatie antwoordt, en je nu al het UCI-protocol laten hanteren, aangezien dat is wat je eigen engine uiteindelijk moet spreken.

Een UCI-engine is een subproces waarvan je beide uiteinden van de pijp vasthoudt.

```python
import subprocess


class Moteur:
    """Un moteur UCI vu comme un tuyau : on écrit des lignes, on lit des lignes."""

    def __init__(self, chemin):
        self.processus = subprocess.Popen(
            [chemin],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            text=True,
            bufsize=1,  # ligne par ligne : sans ça, on attend un tampon plein
        )

    def envoyer(self, commande):
        print(f">>> {commande}")
        self.processus.stdin.write(commande + "\n")
        self.processus.stdin.flush()

    def lire_jusqu_a(self, prefixe):
        """Lire la sortie jusqu'à la ligne attendue, et renvoyer tout le bloc."""
        lignes = []
        for ligne in self.processus.stdout:
            ligne = ligne.rstrip("\n")
            lignes.append(ligne)
            if ligne.startswith(prefixe):
                return lignes
        raise RuntimeError(f"le moteur s'est arrêté sans envoyer {prefixe!r}")
```

Twee details verdienen het om erbij stil te staan, omdat ze het grootste deel veroorzaken van de "mijn script blijft hangen"-vragen die je op forums leest.

De eerste is `flush()`. Zonder deze blijft je commando in de buffer van Python steken en bereikt het de engine nooit, die dus voor onbepaalde tijd wacht op iets waarvan jij denkt dat je het hebt verstuurd.

De tweede is `lire_jusqu_a`. Het UCI-protocol is **asynchroon**, en elk blokkerend commando heeft een afgesproken eindregel: `uci` eindigt met `uciok`, `isready` met `readyok`, `go` met `bestmove`. Als je het volgende commando verstuurt zonder op deze regel te hebben gewacht, praat je in het luchtledige. Het meest verraderlijke geval is een te vroeg verzonden `quit`: de engine onderbreekt zijn zoekopdracht en geeft een willekeurige zet terug, zonder fout, zonder waarschuwing. Je krijgt een volkomen fout en volkomen stil resultaat.

De volledige dialoog ziet er zo uit:

```python
moteur = Moteur(os.environ["STOCKFISH"])

# 1. Poignée de main : le moteur annonce son nom et ses options réglables.
moteur.envoyer("uci")
presentation = moteur.lire_jusqu_a("uciok")

# 2. Synchronisation : « tu as fini de t'initialiser ? »
moteur.envoyer("isready")
moteur.lire_jusqu_a("readyok")

# 3. On pose une position, puis on demande à réfléchir 1 seconde.
moteur.envoyer("ucinewgame")
moteur.envoyer(f"position fen {POSITION_DE_DEPART}")
moteur.envoyer("go movetime 1000")
analyse = moteur.lire_jusqu_a("bestmove")
```

Het volledige bestand is [`parler_a_stockfish.py`](https://github.com/Frozalex/blogdungaucher/blob/main/tools/moteur-python/01-par-ou-commencer/parler_a_stockfish.py). Hier is zijn werkelijke output:

```text
$ python3 parler_a_stockfish.py
>>> uci
    id name Stockfish 18
    id author the Stockfish developers (see AUTHORS file)
    (25 lignes reçues, dont les options réglables)
>>> isready
    readyok
>>> ucinewgame
>>> position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
>>> go movetime 1000
    profondeur 19, évaluation +0.44 pion
    bestmove e2e4 ponder c7c6
>>> quit
```

Vijfentwintig regels als antwoord op `uci`: twee identiteitsregels, een `uciok`, en tweeëntwintig instelbare opties. Daar bevindt zich `UCI_LimitStrength`, de optie waarmee je Stockfish kunt afremmen om er een sparringpartner van 1.400 Elo van te maken in plaats van 3.600.

Als dit script `bestmove e2e4` toont, is je werkplaats klaar.

## Het contract van de reeks: je zult altijd weten of je code klopt

Dit is het punt waarop deze reeks het meest verschilt van bestaande tutorials, dus laten we het expliciet maken.

Het probleem van een schaakengine is dat hij **lijkt te werken** heel lang nadat hij is opgehouden correct te zijn. Een zetgenerator die en-passant vergeet, speelt hele partijen zonder dat er iets abnormaal lijkt. Een evaluatiefunctie met een tekenfout geeft een engine die slecht speelt, zonder dat je weet of het een bug is of een gebrek aan diepte. Een slecht begrensde alfa-bèta-zoekopdracht geeft één keer op vijftig de verkeerde zet terug.

Er bestaat een antwoord hierop, en het is ouder dan de meeste engines: `perft`. Het idee is brutaal simpel. Vanaf een stelling tel je alle stellingen die in `n` halve zetten bereikbaar zijn. Als je zetgenerator exact is, krijg je precies hetzelfde getal als iedereen. Als het met een eenheid verschilt, heb je een bug, en de `perft divide`-variant vertelt je onder welke zet die zich verbergt.

Vanaf de startstelling:

| Diepte | Stellingen |
|---|---|
| 1 | 20 |
| 2 | 400 |
| 3 | 8.902 |
| 4 | 197.281 |
| 5 | 4.865.609 |
| 6 | 119.060.324 |

Deze waarden staan niet ter discussie. Ze zijn al decennialang gepubliceerd, en je kunt ze zelf op elk moment herberekenen met Stockfish (`go perft 5`) zonder het antwoord van tevoren te kennen. Zes referentiestellingen, gekozen om elk een ander bijzonder geval te vangen, dienen als technische controle bij artikel 4.

Hetzelfde principe geldt voor de sterkte van de engine, met een ander ijkpunt: een wedstrijd tegen een afgeremde Stockfish op een gegeven niveau. Het resultaat van de wedstrijd geeft een Elo-schatting, met zijn foutmarge. Geen enkel artikel van de reeks eindigt met "zo, het werkt". Elk eindigt met een getal.

## Wat je hebt na twaalf artikelen

Een volledige schaakengine: mailbox-weergave, zetgeneratie geverifieerd met `perft`, materiële en positionele evaluatie, negamax-zoekfunctie met alfa-bèta-snoeien, zetordening, iteratieve verdieping met tijdbeheer, rustzoekfunctie, en een UCI-lus waarmee je hem kunt laden in de interface van je keuze en ertegen kunt spelen.

Alles in zuiver Python, in een paar honderd regels die je zelf hebt geschreven en begrepen, één voor één.

En iets waar je zelden aan denkt voordat je het meemaakt: de eerste keer dat je eigen programma een mat in drie vindt dat jij niet zag, begrijp je in één klap waarom mensen dit doen.

**Volgend artikel:** een schaakbord representeren in Python, en waarom het voor de hand liggende array van 64 velden precies datgene is dat je niet moet gebruiken.
