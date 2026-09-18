---
title: "Negamax en alfa-bèta snoeien in Python: dezelfde zet, tien keer minder werk"
excerpt: >-
  Alfa-bèta is de enige optimalisatie van een schaakengine die niets kost. Ze verandert nooit het
  resultaat: op gelijke diepte geeft ze exact dezelfde score als minimax. Ze weigert alleen te
  onderzoeken wat ze al kan bewijzen nutteloos te zijn.
seoTitle: "Negamax en alfa-bèta snoeien in Python: schaakengine"
seoDescription: >-
  Negamax en alfa-bèta snoeien coderen in Python: de min/max-vereenvoudiging, het alfa-bèta-venster,
  de afkapping, en de controle dat de teruggegeven score identiek is aan die van minimax.
frSlug: negamax-et-elagage-alpha-beta-python
draft: false
faq:
  - question: "Verandert alfa-bèta snoeien de zet die de engine speelt?"
    answer: >-
      Het verandert nooit de <strong>score</strong> die wordt teruggegeven, dat is de fundamentele
      eigenschap en ze is bewijsbaar. Het kan wel een andere zet teruggeven wanneer meerdere zetten
      dezelfde beste score delen: omdat niet alles wordt onderzocht, worden niet dezelfde gelijkspelers
      ontdekt. Beide zetten zijn evengoed volgens de evaluatie.
  - question: "Wat stellen alpha en beta voor?"
    answer: >-
      <code>alpha</code> is de beste score die de partij aan zet zich al ergens anders in de boom
      heeft gegarandeerd: die zal nooit een slechtere lijn spelen. <code>beta</code> is de beste score
      die de tegenstander zich hoger al heeft gegarandeerd: die zal ons nooit iets beters laten
      bereiken. Daartussen ligt het venster van scores die nog interessant zijn.
  - question: "Waarom afkappen wanneer de score beta overschrijdt?"
    answer: >-
      Omdat de zet <em>te goed</em> is. Als hij ons meer geeft dan wat de tegenstander zich al hoger
      in de boom heeft gegarandeerd, kiest hij de andere lijn en komt de partij hier nooit aan. Verder
      onderzoeken hoe goed deze zet precies is, zou werk zijn waar niemand iets mee doet.
  - question: "Welke winst kun je van alfa-bèta snoeien verwachten?"
    answer: >-
      Die hangt volledig af van de volgorde waarin de zetten worden geprobeerd. In het slechtste geval
      (de beste zet als laatste onderzocht) is er geen winst. In het beste geval (de beste zet
      eerst) daalt het aantal posities van $b^d$ naar ongeveer $b^{d/2}$, wat neerkomt op het
      <strong>verdubbelen van de bereikbare diepte</strong> bij gelijke tijd. Zonder ordeningsinspanning
      zit je daartussenin.
  - question: "Moet je minimax in je code houden nadat alfa-bèta is geschreven?"
    answer: >-
      In een productie-engine niet. In een engine die je leert schrijven wel: het is het orakel
      waarmee je controleert dat alfa-bèta de scores niet heeft veranderd. Een verkeerd begrensde
      snoeiing geeft eens op de vijftig keer een fout resultaat, wat onopgemerkt blijft tijdens het
      spelen en onmiddellijk zichtbaar is bij vergelijking.
---

Aan het einde van [het vorige artikel](/fr/blog/minimax-en-python-moteur-echecs/) vindt onze engine alle matten in twee zetten, maar botst tegen een muur: elke halve zet extra diepte vermenigvuldigt het werk met een twintigtal. Een mat in drie vinden, op diepte 5, wordt een zaak van minuten per positie.

Dit artikel doorbreekt die muur, met een techniek die het zeldzame kenmerk heeft **niets te kosten**. Geen compromis, geen benadering: op gelijke diepte geeft ze exact dezelfde score als minimax, terwijl ze slechts een fractie van de boom doorzoekt.

Maar laten we beginnen met opruimen.

## Negamax: hetzelfde, in de helft van de code

De minimax van artikel 7 heeft twee takken, een die maximaliseert en een die minimaliseert. Dat is trouw aan de definitie en overbodig, want beide doen op een teken na hetzelfde.

De observatie die ze laat samensmelten past in een regel:

$$\min(a, b) = -\max(-a, -b)$$

Met andere woorden, een score minimaliseren betekent het tegengestelde ervan maximaliseren. Als je niet meer rekent vanuit het standpunt van Wit maar vanuit het standpunt van **de partij aan zet**, doen beide spelers hetzelfde: ze maximaliseren. Er blijft alleen over de score om te draaien telkens als je een niveau omhoog gaat, want het standpunt verandert bij elke halve zet.

```python
def negamax(echiquier, profondeur, ply, compteur):
    compteur[0] += 1

    coups = echiquier.coups_legaux()
    if not coups:
        return -(MAT - ply) if echiquier.en_echec(echiquier.trait == "w") else 0

    if profondeur == 0:
        return evaluer(echiquier)

    meilleur = -INFINI
    for coup in coups:
        echiquier.jouer(coup)
        meilleur = max(meilleur, -negamax(echiquier, profondeur - 1, ply + 1, compteur))
        echiquier.annuler()
    return meilleur
```

De `-` voor de recursieve aanroep doet al het werk. Het is ook de enige plek waar je een fout kunt maken, en de fout produceert een engine die subtiel tegen zichzelf speelt, om de andere halve zet.

Merk in het voorbijgaan op dat de matbehandeling zichzelf heeft vereenvoudigd. In minimax waren er twee gevallen nodig afhankelijk van de partij; hier is een positie zonder legale zet altijd slecht **voor degene die moet spelen**, en de score is dus `-(MAT - ply)` zonder onderscheid naar kleur.

Hier komt ook de functie `evaluer` van pas, geschreven in artikel 6, die rekent vanuit het standpunt van de partij aan zet. Die had toen nog geen gebruik. Nu wel.

## Het snoeien: niet zoeken wat toch nergens toe dient

Hier is het idee, in een concrete situatie.

Je bekijkt je zetten. De eerste garandeert je, na analyse, een score van **+1,00**. Je gaat naar de tweede. Je bekijkt het eerste antwoord van je tegenstander op deze tweede zet, en je stelt vast dat het je op **-3,00** achterlaat.

Moet je de andere antwoorden van de tegenstander op deze tweede zet onderzoeken? Nee. De tegenstander kiest zijn beste antwoord: de tweede zet geeft je dus **hoogstens** -3,00, misschien erger. Hij is al verslagen door de eerste, die je +1,00 garandeert. Of de echte waarde van de tweede zet nu -3,00 of -12,00 is, dat verandert helemaal niets aan je beslissing.

**De rest van deze tak kan worden opgegeven.** Niet benaderd: opgegeven, zonder enig risico om iets te missen.

Deze intuïtie formaliseren vraagt twee getallen, meegevoerd langs de afdaling.

`alpha` is de beste score die de partij aan zet zich al ergens anders heeft gegarandeerd. Die zal nooit een minder goede lijn spelen, dus alles daaronder is oninteressant.

`beta` is de beste score die de **tegenstander** zich al hoger in de boom heeft gegarandeerd. Die zal ons nooit meer laten krijgen, dus alles daarboven is eveneens oninteressant.

Daartussen ligt het venster van scores die de beslissing nog kunnen beïnvloeden.

```python
def alpha_beta(echiquier, profondeur, alpha, beta, ply, compteur):
    compteur[0] += 1

    coups = echiquier.coups_legaux()
    if not coups:
        return -(MAT - ply) if echiquier.en_echec(echiquier.trait == "w") else 0

    if profondeur == 0:
        return evaluer(echiquier)

    for coup in coups:
        echiquier.jouer(coup)
        score = -alpha_beta(echiquier, profondeur - 1, -beta, -alpha, ply + 1, compteur)
        echiquier.annuler()

        if score >= beta:
            return beta  # coupure : l'adversaire évitera cette ligne
        alpha = max(alpha, score)
    return alpha
```

Vier regels meer dan negamax. Het punt om niet te missen is de recursieve aanroep: het venster wordt **omgekeerd en gewisseld** doorgegeven, `(-beta, -alpha)`. Dat is het rechtstreekse gevolg van de standpuntwisseling: wat mijn vloer is, wordt zijn plafond.

## Eén positie, drie zoekopdrachten

Neem de positie van het herdersmat, net voor de fatale zet, en laat de drie draaien.

```text
$ python3 recherche.py 3 "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4"

methode      zet         score        knopen    duur
minimax      f3f7     mat in 1        50421    17.04s
negamax      f3f7     mat in 1        50421    17.22s
alpha_beta   f3f7     mat in 1         2248     0.74s
```

Drie stukjes informatie in deze tabel.

Alle drie vinden `f3f7`, de dame op f7, en kondigen mat in één zet aan. Dat was verwacht, maar het is de eerste keer dat onze engine een echte schaakzet speelt in plaats van een willekeurige zet.

Minimax en negamax bezoeken **exact hetzelfde aantal posities**, 50.421. Dat is geen toeval: het zijn twee schrijfwijzen van hetzelfde algoritme, en de tweede heeft nooit beweerd sneller te zijn, alleen korter.

Alfa-bèta bezoekt er 2.248. **Tweeëntwintig keer minder**, voor dezelfde score, op dezelfde positie, op dezelfde diepte.

Merk ook de absolute snelheid op: ongeveer 3.000 posities per seconde. Dat is twintig keer minder dan de 60.000 van `perft` gemeten in artikel 4, om een eenvoudige reden: de test op afwezigheid van legale zetten verplicht om zetten te genereren **bij elk blad**, inclusief de bladeren waar je alleen gaat evalueren. Dat is de prijs voor de correcte detectie van matten, en artikel 11 komt hierop terug.

## De controle: de score, en niets dan de score

De bewering "alfa-bèta verandert nooit het resultaat" is bewijsbaar, wat een implementatie niet belet ze te verraden. Een verkeerd omgedraaid venster, een afkapping op de verkeerde plek, en de engine geeft eens op de vijftig keer een foute score. Tijdens het spelen blijft dat onopgemerkt. Bij vergelijking is het onmiddellijk zichtbaar.

Vandaar de test van dit artikel: de drie zoekopdrachten laten draaien op dezelfde posities, op dezelfde diepte, en gelijkheid van de scores eisen.

Eén punt verdient toelichting, omdat het op een fout lijkt zonder er een te zijn: **de teruggegeven zet kan wel verschillen**. Wanneer meerdere zetten de beste score delen, heeft alfa-bèta geen enkele reden om dezelfde gelijkspelers te ontdekken, aangezien het niet alles onderzoekt. Beide zetten zijn evengoed volgens de evaluatie. Alleen de score is een invariant, en dat is dus wat, en alleen wat, de test vergelijkt.

```text
$ python3 verifier_elagage.py 3 20
20 posities, diepte 3

methode               knopen      duur   factor
minimax              653956     296.0s     1.00x
negamax              653956     296.7s     1.00x
alpha_beta            71109      30.6s     9.20x

Identieke scores voor alle drie methoden : 20/20
Andere teruggegeven zet (gelijkspel)    : 0/20
Winst van alfa-bèta : van 1.9x (slechtste geval) tot 21.4x (beste geval)

Alles groen.
```

Twintig posities, twintig identieke scores. Vijf minuten volledige zoektocht teruggebracht tot dertig seconden.

Het verschil tussen het slechtste geval (1,9x) en het beste (21,4x) is het meest leerzame deel van deze tabel, en dat is het hele onderwerp van de volgende sectie.

## Wat het snoeien niet doet

De hierboven gemeten winst is reëel en ligt ver onder wat de theorie toestaat. De reden zit helemaal in één zin: **alfa-bèta kapt alleen af wat het al kan afkappen**.

Herneem de situatie uit het begin van de sectie. De afkapping was alleen mogelijk omdat een eerste zet al een garantie van +1,00 had vastgesteld. Als de zetten in de slechtst mogelijke volgorde worden onderzocht, de beste als laatste, is er geen enkele garantie beschikbaar op het moment dat ze nuttig zou zijn, en doorzoekt alfa-bèta exact dezelfde boom als minimax, maar trager.

De referentieberekening komt van Knuth en Moore. In het beste geval, waarin de beste zet altijd als eerste wordt onderzocht, daalt het aantal bezochte posities van $b^d$ naar ongeveer $b^{d/2}$. Voor een vertakkingsfactor van 30 en een diepte van 6 betekent dit een daling van 729 miljoen naar 27.000. Met andere woorden: **bij gelijke tijd verdubbel je de diepte**.

We zijn ver van dat ideale geval, omdat onze zetten worden onderzocht in de volgorde waarin de generator ze produceert, dat wil zeggen per vertrekveld, van a8 naar h1. Deze volgorde heeft geen enkel verband met de kwaliteit van de zetten.

Dat is uitstekend nieuws. Het betekent dat er, gratis, nog een aanzienlijke factor te halen valt, zonder de evaluatie of het algoritme aan te raken: het volstaat de zetten in een slimmere volgorde te onderzoeken.

**Volgend artikel:** de ordening van zetten. Hoe raad je, voordat je ze hebt onderzocht, welke de beste zijn, en waarom een heuristiek zo grof als "eerst de slagzetten" volstaat om de orde van grootte te veranderen.
