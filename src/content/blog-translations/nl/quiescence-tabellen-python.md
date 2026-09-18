---
title: "Quiescence en veldtabellen: de engine gelooft niet meer in cadeautjes"
excerpt: >-
  Op diepte 4 ziet een engine dat hij de dame pakt, maar niet dat zijn paard wordt teruggenomen. Dieper
  zoeken corrigeert niets, het verschuift het probleem één stap. De enige oplossing is weigeren een
  stelling te evalueren waarin de stukken elkaar nog opeten.
seoTitle: "Quiescence-zoekfunctie en veldtabellen in Python"
seoDescription: >-
  Het horizoneffect van een schaakengine corrigeren met een quiescence-zoekfunctie, en veldtabellen
  toevoegen aan de evaluatie. Python-code, stand pat, en meting van het verschil ervoor en erna.
frSlug: quiescence-et-tables-de-cases-python
draft: false
faq:
  - question: "Wat is het horizoneffect bij het schaken?"
    answer: >-
      Dit is de fout van een engine die zijn zoektocht midden in een reeks slagzetten stopt. Hij ziet
      "ik neem zijn dame", evalueert de stelling op +900 en stopt, zonder te zien dat de volgende halve
      zet, buiten zijn horizon, is "hij neemt mijn stuk terug". De score is fout, en dat is in de zin die
      de slechte zet aantrekkelijk maakt.
  - question: "Volstaat dieper zoeken niet om het horizoneffect te corrigeren?"
    answer: >-
      Nee, dat verschuift het probleem alleen. Op welke diepte je ook stopt, er bestaan stellingen waarin
      op dat precieze punt een reeks slagzetten aan de gang is. Het probleem is niet de diepte, het is het
      feit dat je een instabiele stelling evalueert, en het enige antwoord is haar niet te evalueren.
  - question: "Wat is de 'stand pat' in een quiescence-zoekfunctie?"
    answer: >-
      Dat is de evaluatie van de stelling zoals ze is, gebruikt als bodemscore. Ze is legitiem omdat de
      partij aan zet nooit verplicht is te slaan: als hij iets beters te doen heeft, is de waarde van de
      stelling ten minste die welke ze nu heeft. Hij zal alleen een slag spelen als die deze bodem
      verbetert.
  - question: "Wat zijn veldtabellen (piece-square tables)?"
    answer: >-
      Een tabel van bonussen en malussen per stuktype en per vak: paard in het centrum, bonus; koning in
      het centrum in het middenspel, malus. Het is de goedkoopste manier om positioneel spel in een
      evaluatie te introduceren, omdat alles vooraf berekend is en er slechts een optelling per stuk
      overblijft.
  - question: "Zijn verschillende tabellen nodig voor het middenspel en het eindspel?"
    answer: >-
      Ja, ten minste voor de koning en de pionnen. Een koning moet veilig blijven in het middenspel en
      naar het centrum opklimmen in het eindspel: een enkele tabel vergist zich noodzakelijk in een van
      beide fases. Serieuze engines interpoleren tussen twee tabelsets naargelang het overblijvende
      materiaal.
---

Onze engine [houdt een klok bij](/fr/blog/approfondissement-iteratif-gestion-du-temps/), zoekt met snoeien, ordent zijn zetten. Er blijft hem een gebrek dat zijn evaluaties ernstiger vervalst dan alles wat we tot nu toe hebben gecorrigeerd, en dat niet uit enige bug voortkomt.

## Het probleem

De engine zoekt op diepte 4. Hij onderzoekt de lijn: ik neem zijn dame met mijn paard. De vierde halve zet is verbruikt, hij is aan het einde van zijn zicht gekomen, hij evalueert de stelling: **+900**, een dame voor. Uitstekende zet.

De vijfde halve zet, degene die hij niet zoekt, is: hij neemt mijn paard terug met zijn pion. De echte stelling is +580 waard, niet +900.

Dit is geen kleine onnauwkeurigheid. Het is een **gerichte** fout: ze overschat systematisch de lijnen die eindigen in een gunstige slag, dat wil zeggen precies die welke de engine gaat kiezen. Een engine zonder correctie stort zich in elke val waarin men hem een stuk aanbiedt.

En dieper zoeken lost niets op. Op diepte 6 gebeurt hetzelfde twee halve zetten verder. De horizon verschuift, hij verdwijnt niet.

## De oplossing: niet evalueren, doorgaan

Het probleem is niet de diepte, het is het feit dat je een **instabiele** stelling evalueert. De correctie bestaat er dus in niet te stoppen op diepte nul, maar de zoektocht voort te zetten door **alleen slagzetten** te volgen, tot niemand meer een interessante slag te spelen heeft. Je evalueert dan een rustige stelling.

Dit is de quiescence-zoekfunctie, en ze past in een dertigtal regels.

```python
def quiescence(echiquier, alpha, beta, ply, contexte, restant=QUIESCENCE_MAX):
    contexte.noeuds += 1
    contexte.controler_le_temps()

    coups = echiquier.coups_legaux()
    en_echec = echiquier.en_echec(echiquier.trait == "w")
    if not coups:
        return -(MAT - ply) if en_echec else 0

    if en_echec:
        candidats = coups
    else:
        score = evaluer(echiquier)
        if score >= beta:
            return beta
        alpha = max(alpha, score)
        if restant == 0:
            return alpha
        candidats = [coup for coup in coups if est_une_prise(echiquier, coup)]
        candidats.sort(key=lambda c: score_mvv_lva(echiquier, c), reverse=True)

    for coup in candidats:
        echiquier.jouer(coup)
        score = -quiescence(echiquier, -beta, -alpha, ply + 1, contexte, restant - 1)
        echiquier.annuler()
        if score >= beta:
            return beta
        alpha = max(alpha, score)
    return alpha
```

Drie punten verdienen het om begrepen te worden in plaats van overgeschreven.

### De stand pat

```python
score = evaluer(echiquier)
if score >= beta:
    return beta
alpha = max(alpha, score)
```

Je begint met de stelling **zoals ze is** te evalueren, en gebruikt dit als bodemscore. Dit heet de *stand pat*, letterlijk "blijven staan", een leenwoord uit het poker.

Waarom is dit legitiem? Omdat de partij aan zet nooit **verplicht** is te slaan. Bij schaken, in tegenstelling tot dammen, is slaan niet verplicht. Als hij iets beters te doen heeft dan alle beschikbare slagzetten, is de waarde van de stelling ten minste die welke ze nu heeft. De quiescence verkent de slagzetten dus alleen om te zien of een van hen deze bodem **verbetert**.

Dit garandeert ook dat de recursie stopt: op elk niveau moet een slag beter presteren dan niets doen, wat al snel onmogelijk wordt.

### Schaak is een uitzondering

```python
if en_echec:
    candidats = coups
```

Wanneer de koning schaak staat, bestaat de optie "niets doen" niet meer: er moet gepareerd worden. De stand pat toepassen in dit geval zou neerkomen op het verklaren dat een stelling rustig is terwijl de koning wordt aangevallen, wat precies het tegenovergestelde is van het beoogde doel. Je onderzoekt dus **alle** zetten, niet alleen de slagzetten.

Dit is de meest voorkomende vergetelheid in quiescence-implementaties, en ze produceert een engine die zich laat mat zetten in lijnen die hij rustig acht.

### De begrenzing

De parameter `restant` beperkt de afdaling tot acht halve zetten. In theorie is dit onnodig: een reeks slagzetten raakt noodzakelijk uitgeput, aangezien er een eindig aantal stukken is. In de praktijk kan een zeer geladen stelling een aanzienlijke slagboom voortbrengen, en één knoop kan dan een seconde kosten. Het is een vangnet, geen correctie.

## De veldtabellen

Tweede toevoeging van dit artikel, onafhankelijk van de eerste maar complementair.

Onze evaluatie telt alleen het materiaal. Ze maakt dus geen enkel verschil tussen een paard op e5, dat op acht vakken uitstraalt, en hetzelfde paard op a1, dat er twee beheerst. De **veldtabellen** corrigeren dit voor de prijs van een optelling per stuk: een tabel van bonussen en malussen, geïndexeerd op stuktype en vak, geraadpleegd op het moment van tellen.

```python
def materiel_et_position(echiquier):
    score = 0
    for case in CASES:
        piece = echiquier.cases[case]
        if piece is VIDE:
            continue
        valeur = VALEURS[piece.upper()] + TABLES[piece][case]
        score += valeur if piece in BLANCS else -valeur
    return score
```

Er bestaan kant-en-klare tabelsets, al twintig jaar van engine naar engine overgeschreven. Ik heb ervoor gekozen ze niet over te nemen, maar ze te **genereren** via duidelijk geschreven regels:

```python
def _table_cavalier(case):
    # Le cavalier est la pièce qui souffre le plus du bord : depuis un coin il
    # n'a que deux coups, depuis le centre il en a huit.
    return -30 + 14 * _centralite(case)


def _table_fou(case):
    # Même logique, beaucoup plus douce : un fou au bord garde ses diagonales.
    return -12 + 6 * _centralite(case)
```

De reden is zowel pedagogisch als praktisch. Een overgeschreven tabel van 64 getallen is een tabel die je niet begrijpt, die je niet zult kunnen aanpassen, en waarvan je nooit zult kunnen zeggen of ze past bij je evaluatie. Een gegenereerde tabel kun je regel voor regel bespreken: als de engine zijn paarden aan de rand laat slingeren, weet je welke regel je moet aanpassen.

De tabel voor zwart is de verticale spiegel van die voor wit, wat je verifieert met de symmetrietest uit artikel 6: de evaluatie van de spiegelstelling moet exact het tegenovergestelde blijven.

### Wat aan deze tabel fout is

Een bekentenis, want ze is structureel.

```python
def _table_roi(case):
    # En milieu de partie, le roi doit rester derrière ses pions et sur un
    # côté. Cette table est FAUSSE en finale, où le roi doit au contraire
    # monter au centre : c'est la limite assumée d'une table unique.
```

Een koning moet zich verschuilen in het middenspel en naar het centrum opklimmen in het eindspel. Een enkele tabel vergist zich dus noodzakelijk in een van beide fases. De juiste oplossing bestaat erin twee tabelsets te definiëren en tussen beide te interpoleren naargelang het overblijvende materiaal, wat alle serieuze engines doen. Onze engine zal zijn eindspelen spelen met een te schuchtere koning.

Dit is een gekende beperking, in de code geschreven, en geen verborgen fout.

### Een onmiddellijk zichtbaar effect

De veldtabellen hebben een gevolg dat je bij de eerste uitvoering opmerkt. Tot het vorige artikel speelde onze engine `a2a3` in de startstelling: met een puur materiële evaluatie zijn alle zetten nul waard, en hij nam de eerste van de lijst. Met de tabellen:

```text
$ python3 recherche.py 2
Budget : 2.0 s
  profondeur  1  b1c3       +0.28         40 nœuds    0.01s
  profondeur  2  b1c3       +0.00        140 nœuds    0.04s
  profondeur  3  b1c3       +0.28       1184 nœuds    0.31s
  profondeur  4  b1c3       +0.00       4160 nœuds    1.48s

-> b1c3  +0.00  profondeur 4  6144 nœuds  2.04s
```

`Pc3`. Een paardontwikkeling naar het centrum, wat een echte openingszet is. De engine weet nog steeds niets van theorie: hij stelt alleen vast dat een paard op c3 28 honderdsten van een pion meer waard is dan een paard op b1, wat de tabel hem vertelde.

Merk ook de afwisseling van de score op tussen `+0.28` en `+0.00` naargelang de pariteit van de diepte. Dit is geen bug, het is het **oscillatie-effect**: op oneven diepten heeft wit één zet meer gespeeld dan zwart en oogst hij zijn bonus; op even diepten heeft zwart de tijd gehad om symmetrisch te reageren. Elke engine zonder tempobegrip produceert deze afwisseling in evenwichtige stellingen.

## De metingen

Hoe verifieer je dat een quiescence ergens toe dient? Twee proeven, waarvan de eerste geen beroep doet op een externe scheidsrechter.

**Het interne verschil.** Voor elke stelling vergelijk je de statische evaluatie, die welke de zoekfunctie zoals ze is zou gebruiken bij zijn bladeren, met de rustige evaluatie die verkregen wordt na uitputting van de slagzetten. Wanneer beide duidelijk verschillen, had de stelling nooit in die staat geëvalueerd mogen worden. Dat is het horizoneffect zelf, gemeten zonder scheidsrechter.

**De overeenstemming met Stockfish.** Je vergelijkt de twee evaluaties met wat Stockfish aankondigt na een echte zoektocht op diepte 8. Als de quiescence dient, moet ze het verschil verkleinen.

```text
$ STOCKFISH=... python3 verifier_quiescence.py --stockfish 400
400 positions

1. Écart entre évaluation statique et évaluation calme
   positions où l'écart atteint 1 pion : 113/400 (28.2 %)
   écart médian : 0 centièmes de pion, maximum 98825

2. Écart à la recherche de Stockfish (profondeur 8), 376 positions
   évaluation statique : médiane  120 cp, même camp désigné 89.1 %
   évaluation calme    : médiane  107 cp, même camp désigné 91.8 %
```

Drie interpretaties.

**Het mediane verschil is nul.** De meerderheid van de stellingen is al rustig: geen enkele slag is de moeite waard om gespeeld te worden, de quiescence geeft onmiddellijk de macht terug op zijn *stand pat*, en ze kost dus bijna niets. Dat is wat de techniek levensvatbaar maakt: je betaalt alleen daar waar iets te betalen valt.

**Meer dan één stelling op vier is misleidend.** Bij 28,2% ervan vergist evalueren zonder quiescence zich met minstens één hele pion. Bedenk dat het niet gaat om geselecteerde stellingen: het zijn de gewone stellingen van gewone partijen, die welke de zoekfunctie miljoenen keren tegenkomt bij zijn bladeren.

**Het maximum van 98.825 is geen aberratie.** Het is een matscore. In deze stelling loopt de reeks slagzetten uit op een gedwongen mat dat de statische evaluatie op elf pionnen achterstand becijferde. De quiescence corrigeert niet alleen halve pionnen: ze ziet soms dingen van een heel andere aard.

De winst tegenover Stockfish, zelf, is reëel en bescheiden: het mediane verschil daalt van 120 naar 107 honderdsten van een pion, en de overeenstemming over wie er beter voor staat stijgt van 89,1% naar 91,8%. Dat is wat we kunnen verwachten. De quiescence maakt de evaluatie niet fijner, ze verhindert alleen dat ze op het verkeerde moment liegt. Het echte voordeel lees je niet hier, je leest het in de gespeelde partijen: een engine met quiescence stopt met zich op vergiftigde stukken te storten.

## Wat de engine geworden is

Vatten we samen wat er gebouwd is. Een voorstelling geverifieerd door 41 miljoen opgesomde stellingen. Een zettengenerator geconfronteerd met Stockfish op 41.648 zetten. Een negamax-zoekfunctie met alfa-bèta-snoeien, ordening, iteratieve verdieping, tijdbeheer, en nu quiescence en positionele evaluatie.

Er ontbreekt slechts één ding, en het is precies dat wat hem bruikbaar zal maken: hij weet nog steeds niet met iemand te praten. Hij leeft in een Python-script en speelt tegen zichzelf.

**Volgend artikel, het laatste:** UCI praten, aansluiten op een echte schaakinterface, en vooral, eerlijk meten wat dit alles waard is in Elo-punten.
