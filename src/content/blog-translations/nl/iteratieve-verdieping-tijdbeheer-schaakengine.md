---
title: "Iteratieve verdieping: alles opnieuw doen, en waarom het de moeite waard is"
excerpt: >-
  Een engine kiest niet zijn eigen diepte, hij krijgt tijd toegewezen. De oplossing is zoeken op diepte 1,
  dan 2, dan 3, en telkens alles opnieuw doen. Overal lees je dat dit gratis is. Gemeten op onze engine
  kost het 25% op diepte 4 en 5% op diepte 5. En toch loont het.
seoTitle: "Iteratieve verdieping en tijdbeheer van een schaakengine"
seoDescription: >-
  Waarom een schaakengine zoekt op diepte 1, dan 2, dan 3, in plaats van direct naar de einddiepte te gaan.
  Implementatie in Python, tijdbudgetbeheer en metingen.
frSlug: approfondissement-iteratif-gestion-du-temps
draft: false
faq:
  - question: "Wat is iteratieve verdieping?"
    answer: >-
      Eerst zoeken op diepte 1, dan opnieuw beginnen op diepte 2, dan op 3, enzovoort tot de beschikbare
      tijd op is. Je bewaart het resultaat van de laatst volledig afgeronde diepte. Dit is de standaardmanier
      waarop alle schaakengines hun bedenktijd beheren.
  - question: "Is het geen verspilling om alles opnieuw te beginnen?"
    answer: >-
      Het is een reële kost, in tegenstelling tot wat vaak beweerd wordt. Gemeten op onze engine op diepte 4
      bezoekt iteratieve verdieping <strong>25% meer posities</strong> dan directe zoektocht. De informatie
      uit de vorige iteratie vermindert deze meerkost zonder haar op deze diepte te niet te doen. Men accepteert
      dit omdat het iets anders koopt: het vermogen om op tijd te stoppen met een bruikbare zet.
  - question: "Waarom niet gewoon een diepe zoektocht stoppen bij de deadline?"
    answer: >-
      Omdat het resultaat onbruikbaar zou zijn. Als de engine twaalf van de vijfendertig zetten heeft
      onderzocht wanneer de tijd om is, is de beste van die twaalf niet noodzakelijk goed: de drieëntwintig
      andere zijn niet bekeken, en het kan gaan om een zet die een stuk verliest. Een gedeeltelijke zoektocht
      biedt geen enkele garantie.
  - question: "Hoeveel tijd moet een engine aan een zet besteden?"
    answer: >-
      De meest verspreide voorzichtige regel is <strong>de resterende tijd gedeeld door dertig</strong>, plus
      een groot deel van het increment. Ze veronderstelt dat er nog een dertigtal zetten te spelen zijn, wat
      pessimistisch is in het eindspel en dus veilig. Verliezen op tijd kost de hele partij; iets minder
      nadenken kost slechts enkele Elo-punten.
  - question: "Hoe onderbreek je een recursieve zoektocht netjes in Python?"
    answer: >-
      Met een exception. Een boolean vlag zou elk niveau van de recursie dwingen deze te testen en een
      vroegtijdige terugkeer door te geven; een exception die diep opgeworpen wordt, stijgt in één keer op tot
      de wortel, waar hij wordt opgevangen. Men moet alleen erop letten de klok slechts eens per paar honderd
      knopen te raadplegen, anders kost de tijdmeting zelf meer dan de zoektocht.
---

Onze engine heeft een gebrek dat geen enkele schaakinterface zou tolereren. Je geeft hem een diepte, hij levert een zet op wanneer hij klaar is, en hij kan zowel in een seconde als in tien minuten klaar zijn.

Maar geen enkele speeltempo werkt zo. Een interface meldt "je hebt nog 4 minuten 12 en 3 seconden increment over" en verwacht een zet. Het is aan de engine om zijn diepte te bepalen, en die beslissing moet genomen worden **voordat** bekend is hoeveel tijd die diepte gaat kosten.

## Waarom je niet zomaar kunt stoppen

De voor de hand liggende oplossing zou zijn om een diepe zoektocht te starten en die te onderbreken bij de deadline, waarbij de tot dan toe gevonden beste zet wordt teruggegeven.

Dat werkt niet, en het loont de moeite te begrijpen waarom, want dat verantwoordt de rest van het artikel.

Een zoektocht onderzoekt de zetten een voor een. Als de tijd om is terwijl er twaalf van de vijfendertig zijn onderzocht, kent hij de beste van die twaalf. Die zet is niet de beste van de vijfendertig. Hij is zelfs niet gegarandeerd correct: de drieëntwintig niet-onderzochte zetten kunnen allemaal beter zijn, en de twaalfde zou de zet kunnen zijn die een stuk verliest, gewoon minder slecht dan de eerste elf.

**Een gedeeltelijke zoektocht biedt geen enkele garantie.** Het is geen benadering, het is een resultaat zonder waarde.

## De oplossing die absurd lijkt

Iteratieve verdieping bestaat uit zoeken op diepte 1. Dan helemaal opnieuw beginnen op diepte 2. Dan op 3. Enzovoort tot de tijd op is.

Je doet dus het werk volledig opnieuw bij elke ronde.

```python
for profondeur in range(1, profondeur_max + 1):
    try:
        coup, score = chercher_a_profondeur(echiquier, profondeur, contexte)
    except TempsEcoule:
        break

    meilleur_coup, meilleur_score, atteinte = coup, score, profondeur
    contexte.coup_principal = coup
```

Het voordeel is onmiddellijk: **op elk moment beschik je over een complete zet**, afkomstig van de laatst volledig afgeronde diepte. De tijd kan wanneer dan ook opraken, je hebt altijd iets goeds om te spelen.

Blijft de vraag wat het herhaalde werk kost. Het gebruikelijke argument is dat het verwaarloosbaar is: omdat het aantal posities bij elke diepte wordt vermenigvuldigd met de vertakkingsfactor, wordt de som van alle voorgaande iteraties gedomineerd door de laatste. Met een effectieve vertakkingsfactor van 5 na snoeien kosten de diepten 1 tot 5 samen ongeveer een kwart van diepte 6.

Een kwart is niet niets. En er bestaat een mechanisme dat dit zou moeten terugbetalen.

## De informatie die alles terugbetaalt

Herinner je het vorige artikel: de effectiviteit van alfa-bèta hangt volledig af van de volgorde van de zetten, en ons beste hulpmiddel om die volgorde te raden blijft grof.

Iteratieve verdieping levert gratis de meest betrouwbare informatie die er is. De beste zet op diepte 5 is, in de overgrote meerderheid van de gevallen, een uitstekende kandidaat op diepte 6. Je probeert hem dus **eerst**.

```python
def score(coup):
    # De beste zet van de vorige iteratie gaat vóór al de rest,
    # zelfs vóór de beste slagzet.
    if ply == 0 and coup == contexte.coup_principal:
        return 10_000_000
    ...
```

Die zet, als eerste geprobeerd, laat `alpha` onmiddellijk stijgen tot bijna zijn uiteindelijke waarde, waardoor alle volgende takken veel eerder afgesneden kunnen worden.

Dit is het klassieke argument voor iteratieve verdieping, en je leest het overal in een categorische vorm: "iteratief is sneller dan directe zoektocht". De tweede benchmark van dit artikel test dit, en het resultaat is niet wat men gewoonlijk beweert.

## Een recursie netjes onderbreken

Blijft de mechaniek. Hoe stop je een recursieve functie die twaalf niveaus diep is afgedaald?

Een boolean vlag zou elk niveau dwingen deze te testen en een vroegtijdige terugkeer door te geven, waarbij "ik ben klaar" onderscheiden wordt van "ik ben onderbroken". Dat is lelijk en makkelijk te missen. Een **exception** stijgt in één keer op tot de wortel:

```python
class TempsEcoule(Exception):
    """Opgeworpen op de bodem van de recursie om in één keer op te stijgen tot de wortel."""
```

Blijft over: niet failliet gaan aan klokraadplegingen. `time.perf_counter()` aanroepen bij elke knoop zou een niet te verwaarlozen fractie van de zoektijd kosten.

```python
NOEUDS_ENTRE_CONTROLES = 256

def controler_le_temps(self):
    if self.limite is None:
        return
    if self.noeuds % NOEUDS_ENTRE_CONTROLES == 0 and time.perf_counter() > self.limite:
        raise TempsEcoule
```

De keuze van 256 is niet willekeurig: bij ongeveer 3.000 knopen per seconde vertegenwoordigt het minder dan een tiende van een seconde mogelijke vertraging op de deadline. Dit is een instelling die herzien moet worden als de engine veel sneller wordt, en de enige plek in de code waar je hieraan moet denken.

## De valkuil: de onvolledige iteratie weggooien

Hier is de fout die de engine subtiel minder sterk maakt, en die nooit zichtbaar is.

Wanneer de exception midden in de iteratie van diepte 7 valt, is de verleiding groot om zijn gedeeltelijke beste zet te behouden: die komt immers uit een diepere zoektocht dan die van iteratie 6.

Je moet weerstand bieden. Dit is precies het probleem van het begin van het artikel, één verdieping lager: de gedeeltelijke beste zet van iteratie 7 is niet vergeleken met al zijn concurrenten. Hij kan perfect slechter zijn dan de complete zet van iteratie 6.

```python
try:
    coup, score = chercher_a_profondeur(echiquier, profondeur, contexte)
except TempsEcoule:
    break                    # de hele iteratie is verloren, en dat is normaal

meilleur_coup, meilleur_score, atteinte = coup, score, profondeur
```

De toewijzing komt **na** de `try`. Een onderbroken iteratie laat geen enkel spoor na.

Een bijzonder geval verdient apart behandeld te worden: wanneer een mat gevonden wordt, stopt men. Dieper zoeken kan niets opleveren, en het iteratieve zou blijven draaien tot de tijd op is om hetzelfde mat opnieuw te ontdekken.

## Het budget

Hoeveel tijd geef je aan een zet? De meest verspreide voorzichtige regel:

```python
DIVISEUR_DE_TEMPS = 30

restant = int(arguments[arguments.index(cle) + 1]) / 1000
return max(0.05, restant / DIVISEUR_DE_TEMPS + increment * 0.8)
```

Delen door dertig komt neer op de veronderstelling dat er nog een dertigtal zetten te spelen zijn. Dat is pessimistisch in het eindspel, wat precies de juiste kant van de fout is: **verliezen op tijd kost de hele partij**, terwijl iets minder nadenken maar enkele Elo-punten kost. Het increment wordt voor 80% verbruikt: het wordt bij elke zet vernieuwd, het zou absurd zijn het op te potten.

## De metingen

### Houdt de engine zich aan zijn woord?

```text
$ python3 banc_temps.py 1 20 4
1. Budget de 1.00 s sur 20 positions
   durée médiane 1.029 s, maximum 1.142 s
   dépassements de plus de 5 % : 7/20
   profondeur atteinte : de 2 à 5, moyenne 3.35
```

Zeven overschrijdingen op twintig. Niet met veel (de ergste is 1,142 s in plaats van 1,000), maar toch zeven.

De verklaring ligt in de granulariteit van de controle. Men raadpleegt de klok maar eens per 256 knopen, wat op onze snelheid ongeveer 85 milliseconden vertegenwoordigt. Op een budget van een seconde vormen 85 milliseconden al 8,5%: de tolerantiedrempel van 5% die de test zichzelf oplegt, is mechanisch onmogelijk te halen.

Dit is een hypothese, dus wordt ze getest. Als ze juist is, zou dezelfde engine met een drie keer groter budget binnen de perken moeten blijven zonder dat er een regel code wordt aangeraakt:

```text
$ python3 banc_temps.py 3 20 5
1. Budget de 3.00 s sur 20 positions
   durée médiane 3.042 s, maximum 3.078 s
   dépassements de plus de 5 % : 0/20
   profondeur atteinte : de 3 à 6, moyenne 3.85
```

Nul overschrijdingen, en een maximum van 3,078 s. De absolute vertraging is dezelfde gebleven, rond de 40 tot 80 milliseconden; het is haar relatieve aandeel dat gesmolten is.

De praktische conclusie is niet "onze engine is nauwkeurig", het is **"de nauwkeurigheid van de tijdcontrole is absoluut, niet relatief"**. Een engine die de klok elke 256 knopen controleert, kan niet netjes spelen onder een budget van enkele tienden van een seconde, en precies daarom deel je de resterende tijd door dertig in plaats van zo nauwkeurig mogelijk te mikken.

### Wat het herhaalde werk echt kost

```text
2. Atteindre la profondeur 4, en direct ou par étapes
   directement à 4   :      84925 nœuds     39.5 s
   par 1, 2, ... 4   :     105816 nœuds     48.8 s
   l'itératif est 1.25x plus cher

2. Atteindre la profondeur 5, en direct ou par étapes
   directement à 5   :     893863 nœuds    423.4 s
   par 1, 2, ... 5   :     936074 nœuds    450.6 s
   l'itératif est 1.05x plus cher
```

Dit verdient duidelijk gezegd te worden, want het is niet wat men gewoonlijk leest: **bij ons is iteratieve verdieping duurder dan directe zoektocht.** 25% op diepte 4, 5% op diepte 5.

De informatie van de vorige beste zet annuleert het herhaalde werk dus niet, ze vermindert het. Maar de tendens is ondubbelzinnig: de meerkost wordt gedeeld door vijf wanneer je één enkele diepte wint. Het is redelijk te denken dat hij zich een of twee halve zetten verder annuleert, en daarna negatief wordt, op de diepten waarop echte engines werken. We hebben dit niet kunnen verifiëren: diepte 6 op twintig posities overschrijdt het uur in Python, en een niet-gemeten bewering heeft hier geen plaats.

Wat we wel kunnen bevestigen, is dat de kwestie van de kost **secundair** is. Men kiest niet voor iteratieve verdieping om sneller te gaan. Men kiest ervoor omdat de engine zonder haar niet weet hoe te stoppen, en een engine die niet weet hoe te stoppen alle partijen op de klok verliest, ongeacht zijn speelniveau. Vijf procent meer knopen is een belachelijk lage prijs hiervoor.

## Wat er nog fout is

Onze engine kan nu een klok bijhouden. Wat overblijft is een gebrek dat zijn evaluaties veel ernstiger vervalst dan alles wat tot nu toe gecorrigeerd is, en dat inherent is aan het principe zelf van een zoektocht op vaste diepte.

Op diepte 4 onderzoekt de engine "ik neem zijn dame met mijn paard", komt aan het einde van zijn zicht, telt +900 en verheugt zich. De vijfde halve zet, degene die hij niet zoekt, is "hij neemt mijn paard terug". De score is fout, en hij is fout op de gevaarlijkste manier: hij maakt de zet aantrekkelijk.

Dit is het horizoneffect, en het wordt noch gecorrigeerd door dieper te zoeken, noch door beter te evalueren. Het wordt gecorrigeerd door te weigeren posities te evalueren waar het nog steeds slaat.

**Volgend artikel:** de quiescentiezoektocht, en de zettabellen. De engine houdt op te geloven in cadeaus.
