---
title: "Grand Oral onderwerp NSI: Hoe illustreert alfa-bèta-snoeien de optimalisatie van een boomzoekactie?"
excerpt: >-
  Volledig uitgeschreven onderwerp voor de Grand Oral, specialisatie NSI (Frans eindexamenvak informatica):
  algoritmische optimalisatie, alfa-bèta-snoeien, reductie van complexiteit O(b^d) naar O(b^(d/2)), toegelichte
  Python-code. Tekst van 10 minuten, klaar om voor te dragen.
seoTitle: "Grand Oral NSI alfa-bèta-snoeien schaken: volledige tekst om voor te dragen"
seoDescription: >-
  Grand Oral onderwerp NSI over alfa-bèta-snoeien bij schaken, volledig uitgeschreven voor 10 minuten. Optimalisatie,
  afkapping, complexiteit, Python-code: examenklare tekst.
frSlug: sujet-grand-oral-nsi-alpha-beta
draft: false
---

> **Wat is de Grand Oral?** Dit is een mondeling eindexamenonderdeel van het Franse baccalauréat, waarbij leerlingen in hun specialisatievak een zelfgekozen onderwerp tien minuten lang moeten presenteren voor een jury. Dit artikel is een volledig uitgeschreven voorbeeldtekst voor het **specialisatievak NSI** (numerieke en informaticawetenschappen), het Franse eindexamenvak informatica in het laatste schooljaar.

Goedendag. Ik ga het hebben over een algoritme dat mij de elegantie van informaticaoptimalisatie deed ontdekken: het alfa-bèta-snoeien, toegepast op het schaakspel.

Het **onderwerp** is precies: hoe illustreert alfa-bèta-snoeien de optimalisatie van een boomzoekactie? Deze vraag interesseert mij omdat ze centraal staat in het programma van het specialisatievak NSI in het laatste schooljaar: ze gebruikt het begrip **boom**, het concept van **algoritmische complexiteit**, **recursie**, en het bredere idee dat elke datastructuur op naïeve of intelligente wijze doorlopen kan worden.

Bij schaken moet het programma bij elke beurt uit ongeveer vijfendertig mogelijkheden een zet kiezen. Als je meerdere zetten vooruit wilt anticiperen, explodeert het aantal opties: dat heet **combinatorische explosie**. Het minimax-algoritme, dat exhaustief alle takken van een spelboom doorzoekt, stuit al snel op zijn grenzen. Alfa-bèta-snoeien lost dit probleem op door intelligent onnodige takken af te kappen, zonder het eindresultaat te veranderen.

Ik ga in drie stappen te werk. Eerst presenteer ik het minimax-algoritme en zijn complexiteitsprobleem. Vervolgens leg ik het idee van alfa-bèta-snoeien uit en de bijbehorende Python-code. Tot slot kwantificeer ik de werkelijke winst en bespreek ik de grenzen van deze optimalisatie.

## Minimax en het probleem van exponentiële complexiteit

Het minimax-algoritme, geformaliseerd door Claude Shannon in 1950, modelleert het schaakspel als een beslissingsboom. De wortel is de huidige positie. Elke tak vertegenwoordigt een mogelijke zet. Het programma doorzoekt deze boom in de diepte, en bij elk knooppunt berekent het de waarde van de positie volgens een eenvoudige logica: ik speel om mijn voordeel te maximaliseren, mijn tegenstander speelt om mij te laten verliezen, dus wisselen we bij elk niveau af tussen maximaliseren en minimaliseren.

Hier volgt de Python-code van het klassieke minimax.

```python
def minimax(position, profondeur, maximise):
    if profondeur == 0 or position.est_terminee():
        return evaluer(position)
    if maximise:
        meilleur = -float('inf')
        for coup in position.coups_possibles():
            position.joue(coup)
            score = minimax(position, profondeur - 1, False)
            position.annule(coup)
            meilleur = max(meilleur, score)
        return meilleur
    else:
        meilleur = +float('inf')
        for coup in position.coups_possibles():
            position.joue(coup)
            score = minimax(position, profondeur - 1, True)
            position.annule(coup)
            meilleur = min(meilleur, score)
        return meilleur
```

Het probleem van dit algoritme is zijn complexiteit. Bij elk knooppunt doorzoekt men gemiddeld vijfendertig kinderen. Bij vier niveaus diepte heeft men vijfendertig tot de macht vier, oftewel ongeveer anderhalf miljoen posities. Bij zes niveaus overschrijdt men het miljard en een half. De complexiteit wordt geschreven als O(b tot de macht d), waarbij b de vertakkingsfactor is en d de diepte. Deze exponentiële groei is, in de termen van het specialisatievak, een functie die explodeert: onhandelbaar zonder optimalisatie.

Voor het historisch perspectief: er zijn ongeveer tien tot de macht honderdtwintig mogelijke schaakpartijen. Dat is het getal van Shannon. Geen enkele computer zal ooit de volledige boom kunnen doorzoeken, zelfs niet met de volledige rekenkracht van de mensheid gedurende de leeftijd van het heelal. Het programma moet zich dus tevredenstellen met een gedeeltelijke, op een vaste diepte begrensde verkenning, en juist hier wordt optimalisatie cruciaal: elke extra gewonnen diepte vertaalt zich in een meetbare verbetering van de kracht van het programma.

## Het idee van alfa-bèta-snoeien

Alfa-bèta-snoeien berust op een eenvoudige intuïtie. Als ik al weet dat een tak mijn bekende beste optie niet kan verbeteren, hoeft die niet verder verkend te worden. Men wint tijd door hele deelbomen op te geven zodra men kan bewijzen dat ze het resultaat niet zullen veranderen.

Concreet houdt men tijdens de verkenning twee grenzen bij. **Alfa** is de beste score die wit op de huidige tak kan garanderen. **Beta** is de beste score die zwart kan garanderen. Als men bij een knooppunt ontdekt dat beta kleiner dan of gelijk is aan alfa, betekent dit dat de tak noch voor wit noch voor zwart interessant zal zijn: men kan haar onmiddellijk opgeven. Deze afkapping heet **snoeien**.

De bijbehorende Python-code voegt twee parameters toe aan het klassieke minimax.

```python
def alpha_beta(position, profondeur, alpha, beta, maximise):
    if profondeur == 0 or position.est_terminee():
        return evaluer(position)
    if maximise:
        meilleur = -float('inf')
        for coup in position.coups_possibles():
            position.joue(coup)
            score = alpha_beta(position, profondeur - 1, alpha, beta, False)
            position.annule(coup)
            meilleur = max(meilleur, score)
            alpha = max(alpha, meilleur)
            if beta <= alpha:
                break
        return meilleur
    else:
        meilleur = +float('inf')
        for coup in position.coups_possibles():
            position.joue(coup)
            score = alpha_beta(position, profondeur - 1, alpha, beta, True)
            position.annule(coup)
            meilleur = min(meilleur, score)
            beta = min(beta, meilleur)
            if beta <= alpha:
                break
        return meilleur
```

De twee sleutelinstructies zijn `if beta <= alpha: break`. Deze voorwaarde, de **afkapping** genoemd, is de kern van de optimalisatie. Wanneer ze wordt geactiveerd, stopt de lus onmiddellijk: men verkent de resterende zetten niet, men geeft het huidige resultaat door aan het ouderknooppunt. Het subtiele punt is dat deze afkapping de door het algoritme teruggegeven waarde niet verandert: men bewijst wiskundig dat de afgekapte takken geen beter antwoord bevatten.

Voor de jury kan ik een kleine boom met drie niveaus tekenen en live laten zien welke tak wordt afgekapt en waarom. Dat is de oefening die indruk maakt: een complexiteit visualiseren die met enkele penseelstreken verandert.

## De winst kwantificeren en de grenzen bespreken

Alfa-bèta-snoeien reduceert de complexiteit in het beste geval van O(b tot de macht d) naar O(b tot de macht d gedeeld door twee). Deze formule is van Donald Knuth uit 1975. Concreet gaat men bij een diepte van zes van vijfendertig tot de macht zes, oftewel ongeveer een miljard achthonderd miljoen, naar vijfendertig tot de macht drie, oftewel ongeveer tweeënveertigduizend. De winst is een factor veertigduizend. Dat is wat programma's als Stockfish in staat stelt om binnen enkele seconden dieptes van twintig tot dertig zetten te verkennen, terwijl puur minimax bij vijf of zes zou blijven steken.

Deze winst wordt echter alleen behaald in het beste geval, dat wil zeggen wanneer de zetten in de beste mogelijke volgorde worden verkend. In het slechtste geval, dat wil zeggen wanneer men eerst de minst veelbelovende zetten verkent, degenereert alfa-bèta-snoeien tot puur minimax: er vindt geen enkele afkapping plaats. Daarom investeren moderne programma's enorm in heuristieken voor het sorteren van zetten: transpositietabel, killer heuristic, history heuristic. Al deze technieken proberen de zetten in de juiste volgorde te presenteren om zoveel mogelijk afkappingen te bereiken.

Naast de ruwe prestatie illustreert alfa-bèta-snoeien een fundamenteel principe van de informatica: optimaliseren betekent niet alle oplossingen zoeken, maar intelligent de slechte elimineren. Dat is precies de filosofie die men terugvindt in andere optimalisatiealgoritmes uit het programma van het specialisatievak, zoals dynamisch programmeren of memoïsatie.

De grenzen van deze aanpak blijven reëel. Ten eerste kan men zelfs met alfa-bèta geen dieptes van meer dan dertig zetten bereiken, wat nog ver van het einde van de partij is. Ten tweede blijft de kwaliteit van de evaluatie van de op de begrensde diepte bereikte posities afhankelijk van een door mensen geschreven functie, dus imperfect. Ten derde, en dit is de diepste breuk, blijft alfa-bèta-snoeien een deductieve redenering: men verkent een vooraf gedefinieerde boom. AlphaZero echter toonde in tweeduizendzeventien aan dat men betere resultaten kon behalen door de hele boom op te geven ten gunste van een neuraal netwerk dat leert posities te herkennen zonder ze op te sommen.

## Conclusie

Om mijn oorspronkelijke vraag te beantwoorden: alfa-bèta-snoeien illustreert de optimalisatie van een boomzoekactie op de duidelijkst mogelijke manier: het neemt een probleem van exponentiële complexiteit en maakt het hanteerbaar door de structuur van het probleem te benutten, zonder het resultaat te veranderen. Het verandert het onmogelijke in het haalbare, in enkele regels code.

Dit idee om intelligent te elimineren in plaats van exhaustief op te sommen is, naar mijn mening, een van de mooiste vraagstukken van de moderne informatica. Het komt voor in datacompressie, in zoeksystemen op het web, in beperkingsoplossers. Schaken was het historische experimenteerterrein van dit idee, en alfa-bèta blijft de meest elegante formulering ervan.

De natuurlijke opening is de vraag of de leerbenadering van AlphaZero alfa-bèta-snoeien overbodig maakt. Mijn antwoord is nee. Sinds tweeduizendtwintig integreert Stockfish zelf een neuraal netwerk voor de evaluatie, maar behoudt het alfa-bèta voor het zoeken. De twee paradigma's vullen elkaar aan, en waarschijnlijk ligt in precies die hybridisering de toekomst van de engines.

Ik dank u en ben bereid om uw vragen te beantwoorden.
