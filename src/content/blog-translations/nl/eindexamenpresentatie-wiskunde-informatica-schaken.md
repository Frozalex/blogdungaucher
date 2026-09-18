---
title: "Profielwerkstuk Wiskunde + Informatica: schaken als brug tussen twee vakken"
excerpt: >-
  Het krachtigste vakoverstijgende onderwerp voor leerlingen met Wiskunde en Informatica: hoe combinatoriek
  (Wiskunde) verklaart waarom het minimax-algoritme (Informatica) nodig is, en hoe kansrekening (Wiskunde)
  de basis vormt van de AI (Informatica) die schaken heeft veranderd.
seoTitle: "Schaken bij Wiskunde en Informatica: de brug tussen beide vakken"
seoDescription: >-
  Schaken als eindwerkstuk voor Wiskunde en Informatica: combinatoriek, minimax, Elo-kansrekening,
  grafen en datastructuren. Plan, formules en Python-code kant-en-klaar.
frSlug: grand-oral-mathematiques-echecs
draft: false
faq:
  - question: "Waarom is de link tussen wiskunde en schaken een goed onderwerp voor een profielwerkstuk?"
    answer: >-
      Dit onderwerp combineert onderwerpen uit het eindexamenprogramma (combinatoriek, kansrekening,
      grafentheorie, algoritmiek) met een concreet en bekend cultureel object. Het maakt een visuele
      demonstratie op het schaakbord mogelijk, een opening naar kunstmatige intelligentie en een
      filosofische conclusie over formeel denken, wat de structurering in drie delen vergemakkelijkt."
  - question: "Wat is het aandeel van wiskunde in het schaakspel?"
    answer: >-
      Schaken steunt op meerdere wiskundige domeinen: combinatoriek (het getal van Shannon schat het
      aantal mogelijke partijen op 10^120), speltheorie (het minimax-algoritme, geformaliseerd door John
      von Neumann), grafentheorie (het paardenprobleem, de grafiek van stukverplaatsingen), kansrekening
      (statistische evaluatie van openingen) en lineaire algebra (reinforcement learning in AlphaZero).
  - question: "Hoe leg je de Elo-rating uit tijdens een presentatie?"
    answer: >-
      De Elo-rating, bedacht door natuurkundige Arpad Elo, berust op de logistische wet: de kans dat
      speler A wint van speler B is gelijk aan 1/(1+10^((Rb-Ra)/400)). Elke partij werkt beide ratings
      bij op basis van het verschil tussen het verwachte en het werkelijke resultaat."
  - question: "Wat is het paardenprobleem?"
    answer: >-
      Het paardenprobleem bestaat uit het vinden van een pad op een schaakbord van 8x8 waarbij het
      paard exact één keer elk van de 64 velden bezoekt. Het behoort tot de grafentheorie en kan worden
      opgelost met backtracking-algoritmes of de regel van Warnsdorff."
  - question: "Hoe gebruik je AlphaZero als argument in een profielwerkstuk over wiskunde en schaken?"
    answer: >-
      AlphaZero (DeepMind, 2017) is een reinforcement-learningprogramma dat geen enkele menselijke
      partij gebruikte: het leerde alleen door tegen zichzelf te spelen. Binnen 24 uur bereikte het een
      niveau boven Stockfish. Het illustreert de overgang van klassieke algoritmische benaderingen naar
      machine learning."
  - question: "Welke vragen kan de examencommissie stellen over wiskunde en schaken?"
    answer: >-
      Veelgestelde vragen gaan over: de expliciete berekening van het aantal mogelijke partijen, het
      bewijs van het paardenprobleem, de Elo-formule en de kansmatige interpretatie ervan, het verschil
      tussen de minimax-boom en reinforcement learning, en de grenzen van het model."
---

Je hebt zowel Wiskunde als Informatica in je profiel. En je wilt een onderwerp dat **beide** benut: geen wiskundeonderwerp met een informaticasausje, en ook geen informaticaonderwerp met een decoratieve formule.

Schaken is dat vakoverstijgende onderwerp. Combinatoriek (Wiskunde) verklaart *waarom* het minimax-algoritme (Informatica) onmisbaar is. Kansrekening (Wiskunde) vormt de basis van de Elo-rating die databases (Informatica) opslaan en bevragen. Grafen (Wiskunde) zijn de datastructuur (Informatica) waarop het paardenprobleem is gedefinieerd. AlphaZero berust op lineaire algebra (Wiskunde) geïmplementeerd als neuraal netwerk (Informatica).

Dit is geen onderwerp waar Wiskunde en Informatica toevallig naast elkaar staan. Het is een onderwerp waar elk wiskundig begrip een informaticabehoefte *genereert*, en elke informatica-implementatie een wiskundige basis *veronderstelt*. Dat is de echte brug tussen de twee vakken.

Dit artikel geeft je het complete plan, de inhoud van beide vakgebieden, de verbindingspunten tussen de disciplines, en de tips om stand te houden tegenover een commissie die beide vakken kent.

## De drie bruggen Wiskunde-Informatica: de unieke invalshoek van het vakoverstijgende onderwerp

Voordat we de inhoud induiken, is de denkstructuur essentieel. Een commissie die je hoort over een vakoverstijgend onderwerp Wiskunde+Informatica verwacht geen twee aan elkaar geplakte betogen. Ze verwacht een leerling die **laat zien hoe de twee vakken elkaar nodig hebben**.

| Kant Wiskunde | Brug | Kant Informatica |
|---|---|---|
| Combinatoriek: $\sim 10^{120}$ partijen | → vereist → | Minimax-algoritme (geen brute kracht mogelijk) |
| Kansrekening: Elo-formule | → wordt opgeslagen en berekend via → | SQL-databases, statistische query's |
| Grafentheorie: hamiltoniaans pad | → wordt geïmplementeerd als → | Beslisboom, recursieve DFS |
| Lineaire algebra: matrices, functies | → is de structuur van → | Neurale netwerken van AlphaZero |

Deze tabel is de ruggengraat van je presentatie. Elke rij is een overgang tussen een deel en het volgende. En dit is wat leerlingen met alleen Wiskunde of alleen Informatica **niet kunnen doen**: laten zien dat het één het ander voortbrengt.

## Waarom Wiskunde + Informatica een ideaal onderwerp vormen

### Een onderwerp op het kruispunt van twee vakken

Een leerling die legt uit **waarom wiskunde schaken begrijpelijk maakt, en waarom schaken wiskunde zichtbaar maakt**, doet iets zeldzamers: hij bouwt een brug die bewijst dat hij beide oevers beheerst.

De examinatoren hebben duizenden onderwerpen voorbij zien komen. Wat hen raakt, is het vermogen van de leerling om twee werelden te laten resoneren. Hier vindt elk wiskundig begrip een directe fysieke illustratie op het schaakbord. En elk mechanisme van het spel verbergt een formele structuur die de wiskunde precies benoemt en beschrijft.

### De begrippen uit het programma die direct van toepassing zijn

Dit onderwerp is op maat gesneden voor het eindexamenjaar, want het mobiliseert begrippen die expliciet in het programma staan:

- **Combinatoriek** (tellen, faculteiten, rangschikkingen): aantal partijen, zettenboom
- **Kansrekening**: statistische evaluatie van openingen, Elo-formule, verwachte winst
- **Grafentheorie**: paardenprobleem, hamiltoniaans pad
- **Algoritmiek**: minimax, alfa-bèta-snoeiing, complexiteitsorde
- **Statistiek**: regressie, data-analyse van partijen
- **Lineaire algebra**: neurale netwerken, AlphaZero

### De kracht van het concrete object

Veel leerlingen presenteren zonder effectieve visuele ondersteuning. Jij legt een schaakbord op tafel. Dat is een gebaar dat de sfeer verandert: je maakt het onderwerp tastbaar. De commissie kan het zien, aanraken. Je kunt het paardenprobleem demonstreren door een stuk te verplaatsen. Je kunt de explosie van mogelijkheden na twee zetten laten zien door snel een boomstructuur op het bord te tekenen.

## De wiskundige fundamenten van het schaakspel

### Speltheorie toegepast op schaken

Speltheorie is de tak van de wiskunde die strategische beslissingssituaties tussen rationele actoren bestudeert. Ze werd geformaliseerd door [John von Neumann](https://nl.wikipedia.org/wiki/John_von_Neumann) en Oskar Morgenstern in 1944 in hun grondleggende verhandeling *Theory of Games and Economic Behavior*.

Schaken is wat men een **nulsomspel met twee spelers, volledige informatie en zuivere strategie** noemt. Elk van deze vier eigenschappen heeft een precieze wiskundige definitie:

- **Nulsom**: wat de een wint, verliest de ander. De som van de winsten van beide spelers is altijd nul.
- **Volledige informatie**: beide spelers zien altijd de complete staat van het bord. Geen verborgen kaarten, geen dobbelstenen.
- **Zuivere strategie**: een strategie is een geheel van beslissingsregels die aan elke spelstatus een precieze zet koppelt.
- **Deterministisch spel**: het resultaat van een reeks zetten wordt volledig bepaald door de zetten zelf, zonder toeval.

Dit formele kader heeft een belangrijk gevolg, bekend als de **stelling van Zermelo** (1913): in elk eindig tweepersoonsspel met volledige informatie en nulsom heeft een van de twee spelers een winnende strategie, of beide kunnen remise forceren. Schaken heeft dus **een theoretisch vastgestelde uitkomst**: ofwel wint wit met perfect spel, ofwel wint zwart, ofwel is het remise. Niemand weet het nog. Maar we weten dat een van deze drie uitkomsten het "echte" antwoord op schaken is.

### Combinatoriek en permutaties: de kunst van het tellen van mogelijkheden

Combinatoriek is waarschijnlijk de meest direct zichtbare wiskundige tak bij schaken.

[Claude Shannon](https://nl.wikipedia.org/wiki/Claude_Shannon), grondlegger van de informatietheorie, berekende in 1950 het aantal verschillende schaakpartijen. Zijn schatting, het **getal van Shannon**, is in de orde van $10^{120}$. Ter vergelijking: het aantal atomen in het waarneembare heelal wordt geschat op ongeveer $10^{80}$. Het aantal mogelijke schaakpartijen overtreft dus met **veertig ordes van grootte** het aantal bekende deeltjes in het heelal.

Hoe kom je tot dit getal? Hier is de telredenering die je voor de commissie kunt uitwerken:

1. Bij de eerste zet van wit zijn er **20 mogelijke zetten** (16 pionzetten + 4 paardzetten).
2. Bij de eerste zet van zwart zijn er eveneens **20 mogelijke antwoorden**.
3. Na één zet van elke kant heb je dus **20 × 20 = 400 stellingen**.
4. Bij de tweede zet zijn er gemiddeld ongeveer **29 mogelijke zetten** per speler.
5. De zettenboom groeit exponentieel: na 3 zetten van elke kant overschrijd je **9 miljoen stellingen**.

De algemene formule is $N \approx b^d$, waarbij $b$ de gemiddelde vertakkingsfactor is ($\approx 35$ bij schaken) en $d$ de diepte ($\approx 80$ halve zetten). Je krijgt $35^{80} \approx 10^{124}$, dezelfde orde van grootte als de schatting van Shannon.

#### De zettenboom als wiskundig object

Formeel is deze boom een **gewortelde gerichte boom**: de wortel is de beginstelling, elk knooppunt is een stelling, elke pijl is een legale zet, en de bladeren zijn de eindstellingen (mat, remise, opgave). Het aantal knooppunten van deze boom is het totale aantal legale stellingen, geschat op ongeveer $10^{44}$.

### Logica en probleemoplossing: strategisch denken als formeel redeneren

Schaken is een **formeel logisch systeem**: er zijn axioma's (de spelregels), toestanden (de stellingen), en geldige transformaties (de legale zetten). Een tactische stelling oplossen is een bewijs construeren: "Als ik A speel, antwoordt hij B of C. Als B, dan is D forcerend. Als C, dan is E mat in twee zetten."

Deze structuur is precies die van een **bewijs door gevalsonderscheiding** in de wiskunde, een fundamenteel instrument van de formele logica dat de commissie onmiddellijk zal herkennen.

## Kansrekening en analyse in het schaakspel

### Winstkansen berekenen: de Elo-formule

De [Elo-rating](https://nl.wikipedia.org/wiki/Elo-rating), bedacht door natuurkundige en wiskundige [Arpad Elo](https://nl.wikipedia.org/wiki/Arpad_Elo) in de jaren 1960, is een van de elegantste toepassingen van kansrekening op een spel. Ze berust op een eenvoudig idee: **het ratingverschil tussen twee spelers moet de winstkans van elk voorspellen**.

De kans dat speler A wint van speler B is:

$$
\mathbb{P}(\text{A wint van B}) = \frac{1}{1 + 10^{(R_B - R_A)/400}}
$$

waarbij $R_A$ en $R_B$ de respectieve Elo-ratings zijn. Als $R_A = R_B$, krijg je $\mathbb{P} = \tfrac{1}{2}$. Als $R_A = 2000$ en $R_B = 1600$, krijg je $\mathbb{P} \approx 91\,\%$.

Deze formule is de **logistische functie**, een S-vormige functie die je ook tegenkomt in demografische modellering, geneeskunde en neurale netwerken (sigmoïde activeringsfunctie).

#### Code (Wiskunde → Informatica): een Elo-kans berekenen in Python

<div data-pytrace></div>

```python
def kans_elo(ra: int, rb: int) -> float:
    return 1 / (1 + 10 ** ((rb - ra) / 400))

print(round(kans_elo(1800, 2000), 3))  # ≈ 0.240
print(round(kans_elo(2000, 2000), 3))  # 0.500
```

De bijwerking van de ratings na elke partij volgt een eenvoudige regel:

$$\text{Nieuwe rating van } A = R_A + K\,(\text{werkelijk resultaat} - \text{verwacht resultaat})$$

waarbij $K$ een coëfficiënt is (32 of 16 afhankelijk van het niveau), het werkelijke resultaat $1$, $\tfrac{1}{2}$ of $0$ is, en het verwachte resultaat de kans $\mathbb{P}$ hierboven is.

Dit is een **bayesiaanse schatter**: elke partij levert informatie op over de werkelijke kracht van een speler, en de rating convergeert na verloop van tijd naar deze werkelijke waarde.

### De invloed van kansrekening op openingen en strategieën

De partijdatabases (Lichess heeft een publieke database van meer dan **3 miljard partijen**) maken het mogelijk om de frequentie van elke opening en het bijbehorende winstpercentage te berekenen.

#### Code (Informatica): eenvoudige SQL-query op een partijdatabase

```sql
SELECT
  opening,
  COUNT(*) AS aantal_partijen,
  ROUND(100.0 * SUM(CASE WHEN resultaat = '1-0' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_wit
FROM partijen
GROUP BY opening
ORDER BY aantal_partijen DESC
LIMIT 10;
```

Deze statistische aanpak vormt de basis van de voorbereiding van professionele spelers: ze kiezen hun openingen door hun wiskundige winstverwachting te optimaliseren.

## Kunstmatige intelligentie en schaken: een wiskundige revolutie

### Zoekalgoritmes: minimax en alfa-bèta-snoeiing

De vraag na de berekening van het getal van Shannon is: hoe kan een computer schaken als de volledige boom van partijen onbegaanbaar is? Het antwoord is het **minimax-algoritme**, geformaliseerd door John von Neumann in zijn speltheorie.

Het principe is eenvoudig: bij elk knooppunt van de boom probeert de speler aan zet zijn evaluatie te **maximaliseren** (als hij het is) of die van de tegenstander te **minimaliseren** (als de tegenstander aan zet is).

#### Code (Informatica): minimax (recursie in Python)

```python
def minimax(stelling, diepte, is_max):
    if diepte == 0 or stelling.beeindigd():
        return stelling.evalueer()

    zetten = stelling.legale_zetten()

    if is_max:
        beste = float("-inf")
        for zet in zetten:
            beste = max(beste, minimax(stelling.speel(zet), diepte - 1, False))
        return beste
    else:
        beste = float("+inf")
        for zet in zetten:
            beste = min(beste, minimax(stelling.speel(zet), diepte - 1, True))
        return beste
```

De **alfa-bèta-snoeiing**, ontwikkeld door [John McCarthy](https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)) en zijn medewerkers, is een optimalisatie van minimax die hele takken van de boom kan elimineren zonder ze te verkennen. In de praktijk reduceert het de effectieve complexiteit van $O(b^d)$ naar ongeveer $O(b^{d/2})$.

#### Code (Informatica): alfa-bèta (de "zichtbare" optimalisatie)

```python
def alfa_beta(stelling, diepte, alfa, beta, is_max):
    if diepte == 0 or stelling.beeindigd():
        return stelling.evalueer()

    zetten = stelling.legale_zetten()

    if is_max:
        for zet in zetten:
            alfa = max(alfa, alfa_beta(stelling.speel(zet), diepte - 1, alfa, beta, False))
            if beta <= alfa:
                break
        return alfa
    else:
        for zet in zetten:
            beta = min(beta, alfa_beta(stelling.speel(zet), diepte - 1, alfa, beta, True))
            if beta <= alfa:
                break
        return beta
```

### Machine learning en schaaksupercomputers

In 2017 publiceerde [DeepMind](https://en.wikipedia.org/wiki/DeepMind) [AlphaZero](https://en.wikipedia.org/wiki/AlphaZero), een reinforcement-learningprogramma dat de schaakwereld op zijn kop zette. In tegenstelling tot [Stockfish](https://en.wikipedia.org/wiki/Stockfish_(chess)), dat een met de hand gecodeerde evaluatiefunctie gebruikt, **kreeg AlphaZero alleen de spelregels**. Het speelde vervolgens minder dan 24 uur tegen zichzelf, en bereikte een niveau boven Stockfish.

AlphaZero gebruikt een **convolutioneel neuraal netwerk** om stellingen te evalueren, en een **Monte Carlo Tree Search (MCTS)**-methode om zijn verkenning van de zettenboom te sturen.

Dit resultaat toont: **kunstmatige intelligentie bij schaken is overgegaan van expliciete programmering naar impliciet leren**. Deze wiskundige verschuiving komt overeen met de overgang van combinatorische optimalisatie naar statistisch leren.

## Toepassingen en concrete voorbeelden

### Het paardenprobleem en de grafentheorie

Het paardenprobleem is als volgt: **is het mogelijk om een paard op een schaakbord van 8×8 te verplaatsen zodat het exact elk van de 64 velden één keer bezoekt?**

Geherformuleerd in grafentheorie is dit een probleem van **hamiltoniaans pad**: je construeert een grafiek G = (V, E) waarbij de 64 velden de knooppunten zijn, en je trekt een verbinding tussen twee velden als een paard er in één zet naartoe kan gaan.

Het antwoord is **ja**: er bestaan paardentochten op het standaardbord. Er zijn er duizenden bekend (Leonard Euler was in de achttiende eeuw een van de eersten die ze systematisch bestudeerde).

**De regel van Warnsdorff** (1823) is een heuristiek die vaak snel een paardentocht vindt: ga vanaf het huidige veld altijd naar het veld met **de minste nog niet bezochte opvolgers**.

### De analyse van zetten en de optimalisatie van strategieën

Moderne schaakengines zoals Stockfish produceren, voor elke stelling, een **evaluatie in honderdsten van een pion**: +0.30 betekent een licht voordeel voor wit, +2.50 een beslissend voordeel, −1.20 een voordeel voor zwart.

### Hoe wiskunde helpt bij het classificeren van schakers

Om de cirkel rond te maken over de Elo-rating: [Arpad Elo](https://nl.wikipedia.org/wiki/Arpad_Elo) was natuurkundeprofessor. Hij observeerde dat de prestatieverdeling van een speler over een lange periode ongeveer een **normale verdeling** (Gauss-verdeling) volgde.

Dit model heeft een echte wiskundige elegantie: het is **coherent**, **adaptief**, en **gekalibreerd**. De Elo-rating is sindsdien overgenomen in vele andere domeinen: competitieve videogames, voetbalwedstrijden (FIFA World Rankings), evaluatie van AI-modellen.

## Drie kant-en-klare vakoverstijgende probleemstellingen

*"Hoe vullen wiskunde en informatica elkaar aan om intelligentie bij schaken te modelleren?"*
→ Invalshoek: combinatoriek stelt het probleem, algoritmiek omzeilt het, AI overstijgt het.

*"In hoeverre illustreert het schaakspel de interacties tussen discrete wiskunde en algoritmiek?"*
→ Invalshoek: elk wiskundig begrip (grafiek, kans, rij) heeft een directe informatica-implementatie.

*"Van de wiskunde van Shannon tot de AI van AlphaZero: hoe heeft informatica schaken getransformeerd?"*
→ Invalshoek: historische ontwikkeling van 1950 tot 2017.

## Je presentatie structureren: een gedetailleerd plan

### Herformulering van het plan voor de vakoverstijgende invalshoek

Het plan in drie delen wordt:
1. **Waarom schaken de berekening overstijgt** → Wiskunde (combinatoriek) + Informatica (algoritmische complexiteit)
2. **Hoe je ze meet en modelleert** → Wiskunde (kansrekening, Elo, grafen) + Informatica (SQL, datastructuren)
3. **Hoe AI de programmering heeft overtroffen** → Wiskunde (lineaire algebra) + Informatica (neurale netwerken, AlphaZero)

### Pakkende introductie

Begin met de enscenering: *"Hier is een schaakbord. Er zijn 64 velden, 32 stukken, en een aantal mogelijke partijen groter dan het aantal atomen in het heelal."* Noem dit getal (10^120) op het bord. De commissie noteert het getal.

Formuleer dan je **probleemstelling**: *"In hoeverre is schaken een wiskundig object, en hoe heeft deze wiskundige aard onze manier veranderd om kunstmatige intelligentie te denken?"*

### Conclusie en verruiming

**Samenvatting** in drie zinnen: schaken is een eindig maar combinatorisch onuitputtelijk spel, kansrekening maakt het mogelijk het statistisch te meten, en AI heeft laten zien dat leren programmering kan overtreffen.

**Verruiming**: *"De stelling van Zermelo zegt ons dat de perfecte uitkomst van schaken bepaald is. We kennen die nog niet. En misschien zal de machine die haar uiteindelijk vindt door niemand geprogrammeerd zijn: ze zal het zelf hebben geleerd."*

## Anticiperen op de vakoverstijgende commissie

**1. "U zegt dat combinatoriek minimax verklaart: kunt u dit verband preciseren?"**
De groei b^d (Wiskunde) maakt volledige verkenning onmogelijk. Minimax (Informatica) is het algoritmische antwoord.

**2. "Wat is het verband tussen de logistische Elo-functie en de sigmoïde van neurale netwerken?"**
Het is dezelfde functie: f(x) = 1/(1+e^(−x)) versus 1/(1+10^(−x/400)) voor Elo.

**3. "Waarom reduceert alfa-bèta-snoeiing de complexiteit van O(b^d) naar O(b^(d/2))?"**
In het beste geval verkent alfa-bèta slechts √(b^d) = b^(d/2) knooppunten.

**4. "Hoe verschilt AlphaZero wiskundig van Stockfish?"**
Stockfish maximaliseert een handmatig gecodeerde evaluatiefunctie. AlphaZero minimaliseert een verliesfunctie via gradient descent.

**5. "Wat is het verband tussen het hamiltoniaanse pad (Wiskunde) en DFS (Informatica)?"**
Een diepte-eerst-zoekalgoritme (DFS) is precies het algoritme dat een grafiek verkent op zoek naar een hamiltoniaans pad via backtracking.

## Tips voor een geslaagde presentatie

De gouden regel is eenvoudig: **zet alleen dingen in je presentatie die je kunt uitleggen en verdedigen**. Als je het neurale netwerk van AlphaZero noemt, moet je "wat is een neuraal netwerk?" kunnen beantwoorden.

Voor de begrippen die direct uit het programma komen (combinatoriek, kansrekening, grafische weergave), wordt exactheid verwacht.

**Na het lezen:** oefen een **hybride herhaling**: vijf minuten wiskunde op het bord (Elo of combinatoriek), vijf minuten mondeling over de link met een informatica-idee (minimax of data), zonder ondersteuning, zoals bij de commissie.

---
