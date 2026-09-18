---
title: "Gids Grand Oral NSI, schaken: script, becommentarieerde Python-code en juryvragen"
excerpt: >-
  De complete gids voor je Grand Oral in de specialisatie NSI met schaken: methodologie van de proef, tijdschema van
  10 minuten, Python-code regel voor regel uitgelegd, 25 uitgewerkte juryvragen, alternatieve onderwerpideeën.
frSlug: guide-grand-oral-echecs-nsi
draft: false
faq:
  - question: "Welke probleemstelling kies je voor een Grand Oral NSI met schaken?"
    answer: >-
      Drie solide invalshoeken: (1) 'Hoe kan een computerprogramma beslissingen nemen om te schaken?': ideaal om de
      minimax-boom, recursie en de evaluatiefunctie te verkennen. (2) 'In hoeverre illustreert alpha-bèta-snoeiing de
      optimalisatie van een boomzoekmethode?': technischer, laat een vermindering van O(b^d) naar O(b^(d/2)) zien.
      (3) 'Waarom vormt AlphaZero een breuk in de geschiedenis van kunstmatige intelligentie toegepast op spellen?':
      epistemologische invalshoek, ideaal met een aanvullende specialisatie Wiskunde of Filosofie.
  - question: "Kan je Python-code tonen aan de Grand Oral-jury?"
    answer: >-
      Ja, het wordt zelfs aangeraden bij NSI. Je mag afgedrukte bladen met je code bij je hebben. De jury kan je
      vragen een specifieke regel uit te leggen, de uitvoering na te lopen, of een hypothetische fout te
      identificeren. De code moet becommentarieerd zijn (een commentaarregel per logisch blok) en je moet er zonder
      woordelijk voor te lezen over kunnen praten.
  - question: "Hoe leg je de kosten van een algoritme uit aan de jury zonder de draad kwijt te raken?"
    answer: >-
      Gebruik altijd een numeriek voorbeeld voordat je de O-notatie noemt. 'Minimax verkent 35 mogelijke zetten op
      elk niveau. Over 4 dieptes komt dat neer op 35^4 = 1,5 miljoen stellingen. Dat is exponentiële groei, O(b^d)
      met b=35 en d=4.' Pas daarna laat je zien hoe alpha-bèta dat vermindert. De jury waardeert de redenering, niet
      de opsomming.
  - question: "Staat AlphaZero op het programma van het laatste schooljaar NSI?"
    answer: >-
      Niet rechtstreeks, maar reinforcement learning en neurale netwerken zijn thema's die aansluiten bij het
      programma. AlphaZero is een spectaculair voorbeeld van leren: het illustreert concreet het verschil tussen AI
      op basis van expliciete regels (minimax) en AI op basis van leren (deep reinforcement learning). De
      Grand-Oral-jury waardeert concrete en goed beheerste voorbeelden, ook als die iets buiten het programma vallen.
  - question: "Wat is de ideale duur van elk onderdeel van de NSI-presentatie?"
    answer: >-
      Voor 10 minuten: inleiding 1 minuut (probleemstelling plus structuur), deel 1 van 3 minuten (minimax-algoritme
      plus code), deel 2 van 3 minuten (alpha-bèta plus optimalisatie), deel 3 van 2 minuten (AlphaZero plus
      grenzen), conclusie 1 minuut. De jury ondervraagt je daarna 10 minuten. Neem de tijd absoluut serieus: de jury
      onderbreekt je na 10 minuten.
---

Deze **gids** verzamelt **alles** wat een scholier in het laatste schooljaar met specialisatie **NSI** in handen moet hebben om te slagen voor zijn **Grand Oral van het eindexamen** met schaken als **onderwerp**: methodologie van de **proef**, **keuze** van een probleemstelling uit drie invalshoeken, tijdschema van **10 minuten**, becommentarieerde Python-code, uitgewerkte **juryvragen**, spiekbriefje en **tips** voor je **houding** op de grote dag.

Het doel: dat je geen **voorbeelden** meer hoeft te zoeken, geen verspreide bronnen van **internet** meer hoeft samen te voegen, geen plan meer in laatste-minuut-paniek hoeft te verzinnen. **Alles** staat er, direct te gebruiken.

> **Hoe gebruik je deze gids?** Download de PDF via de knop boven aan de pagina om hem offline te hebben. Lees hem op scherm of afdruk, wat jou het beste past. Oefen om de code hardop, regel voor regel, uit te leggen: dat is de belangrijkste oefening voor het **NSI**-**mondeling**.

## De proef begrijpen: Grand Oral bij de specialisatie NSI

### Weging, duur en verloop minuut voor minuut

De **Grand Oral** is het best gewogen onderdeel van het algemene **eindexamen**, met **weging 10**. De totale duur is **40 minuten**:

| Tijd | Fase | Wat je doet | Wat de **jury** observeert |
|---|---|---|---|
| 20 min | Voorbereiding | Je krijgt twee **vragen** uit je specialisatie**programma**. Je kiest een van de twee. Kladpapier toegestaan. |, |
| 5 min | Presentatie staand | Je presenteert je **vraag** staand, zonder aantekeningen (of nauwelijks). | **Houding**, stem, structuur |
| 10 min | Gesprek met de **jury** | De **jury** bevraagt je over het **onderwerp**, je structuur, je code. | Beheersing, reactievermogen, openheid |
| 5 min | **Studiekeuze**project | Je legt uit hoe dit **onderwerp** past in je traject na het eindexamen. | Samenhang traject |

Op de **10 minuten** presentatie speel je 1 puntweging per minuut. Het is het onderdeel met de beste verhouding tussen voorbereidingstijd en cijferimpact van het hele **eindexamen**.

### Samenstelling van de jury en verwachtingen

De **jury** bestaat uit **twee** docenten:
- Eén komt uit je specialisatie (meestal **NSI** of **wiskunde**)
- De ander komt uit een ander vakgebied (talen, geschiedenis, filosofie, biologie...)

De tweede is **geen** expert in de **informatica**. Je **mondeling** moet begrijpelijk zijn voor een niet-specialist: Python-code alleen is niet genoeg, je moet het navertellen in helder Nederlands (of Frans, in de echte proef). Dit is de valkuil waar te technische kandidaten in trappen.

Het officiële reglement (Bulletin officiel) geeft aan dat de **jury** vier dimensies beoordeelt:
1. **Mondelinge kwaliteit**: uitspraak, rustige **spreekstijl**, overtuigende toon, beheerste gebaren
2. **Beheersing van het onderwerp**: het vermogen om uit te leggen, te onderbouwen, te nuanceren
3. **Opbouw van de argumentatie**: heldere probleemstelling, aangekondigde structuur, conclusie
4. **Samenhang met je studiekeuze**: waarom dit **onderwerp** je voorbereidt op je studie

### Drie valkuilen om absoluut te vermijden

- **Letterlijk uit het hoofd opzeggen**: de **jury** hoort de memorisatie. Kies liever voor een raamwerk dat je aanpast op het moment zelf.
- **Je aantekeningen lezen**: gediskwalificeerd. Je mag een papiertje hebben, maar bekijk het alleen om een cijfermatig **gegeven** te controleren.
- **De tijd overschrijden**: op precies 5 minuten onderbreekt de **jury** je. Beter 30 seconden eerder afronden dan onderbroken worden.

## Je probleemstelling kiezen

De probleemstelling is je ruggengraat. Bij **NSI** moet ze laten zien dat je een begrip beheerst dat verankerd is in het **programma** van het laatste schooljaar: recursie, rekenkosten, bomen, of kunstmatige intelligentie.

### De drie aanbevolen invalshoeken

**Invalshoek A, Beslisboom** *(toegankelijk niveau)*

> *"Hoe kan een computerprogramma beslissingen nemen om te schaken?"*

Deze invalshoek laat je de zettenboom, de evaluatiefunctie, de **werking** van recursie vertellen. Goede **keuze** als je op degelijke, goed beheerste grond wilt blijven.

**Invalshoek B, Algoritmische optimalisatie** *(gemiddeld niveau)*

> *"In hoeverre illustreert alpha-bèta-snoeiing de optimalisatie van een boomzoekmethode?"*

Technischer, deze invalshoek laat zien dat je een kostenanalyse in O(b^d) en vervolgens O(b^(d/2)) kunt maken. Dit is de favoriete **keuze** als je goed bent in **wiskunde** en punten wilt scoren op redenering.

**Invalshoek C, Kunstmatige intelligentie en epistemologische breuk** *(gevorderd niveau)*

> *"Waarom vormt AlphaZero een breuk in de geschiedenis van kunstmatige intelligentie toegepast op strategische spellen?"*

Deze invalshoek plaatst je in een bredere reflectie: tegenstelling symbolische AI/connectionistische AI, **werking** van neurale netwerken, **grenzen** van machinaal leren. Kies deze als je op een technische universiteit of wiskundig georiënteerde vooropleiding mikt.

### Hoe kies je?

- **Als je Wiskunde als aanvullende specialisatie hebt**: invalshoek C onderscheidt zich sterk.
- **Als je een vooropleiding of technische universiteit ambieert**: invalshoek B of C.
- **Als je op zeker wilt spelen** met uitstekende beheersing: invalshoek A.
- **Als je net begint met Python**: invalshoek A, maar beheers de code echt goed.

## Andere ideeën voor Grand Oral-onderwerpen bij NSI

Om de **keuze** voor schaken te plaatsen tegenover andere mogelijke **Grand Oral-onderwerpen** bij **NSI**, hier een overzicht van de sterkste **onderwerpideeën**:

| **Onderwerp** | Belangrijkste sterke punten | **Beperkingen** | Moeilijkheidsgraad |
|---|---|---|---|
| **Informaticabeveiliging** (RSA, encryptie) | Sterk actueel, verbonden met het moderne **internet** | Hoog wiskundeniveau voor RSA, vaak behandeld | Gemiddeld |
| **Kwantumcryptografie** | Geavanceerd onderwerp, indrukwekkend | Zeer veeleisend, weinig kandidaten houden het vol | Hoog |
| **Sociale media** en aanbevelings**algoritmen** | Sterke maatschappelijke dimensie | Weinig code te tonen, snel buiten het programma | Gemiddeld |
| **Embedded systemen** (Raspberry Pi, IoT) | Zeer concreet bij een hardwareproject | Vereist een project om te tonen op de grote dag | Gemiddeld |
| **Schaken en AI** *(onze keuze)* | Combineert algoritmen, structuren en AI, cultureel beeld | Risico van puur verhaal bij slechte voorbereiding | Laag met deze gids |
| **Enorme databases** (Lichess, GitHub) | Concreet geval van big data, echte SQL | Vereist omgang met statistiek | Gemiddeld |
| **Compressie** van beeld/geluid (PNG, MP3) | Wiskunde plus structuur | Veeleisend technisch onderwerp | Gemiddeld |
| **Sorteren** en algoritmische **complexiteit** | Kern van het programma | Wordt als schools gezien, moeilijk te **vernieuwen** | Laag |
| **Generatieve neurale netwerken** (ChatGPT, LLM's) | Brandend actueel | Risico op niet-technisch verhaal | Hoog |
| **Monetaire cryptografie** (Bitcoin, blockchain) | Economie plus **informatica** | Glad onderwerp: valse experts in omloop | Gemiddeld |

### Waarom schaken winnen

Drie criteria onderscheiden een goed **onderwerp** van een middelmatig **onderwerp**:
1. **Het bevat zichtbare code** die je hardop kunt beschrijven
2. **Het heeft een herkenbaar belang** buiten de techniek (maatschappij, wetenschap, filosofie)
3. **Het sluit aan bij een domein** dat de **jury** direct herkent

Schaken vinkt alle drie af. **Cryptografie** vinkt de eerste twee af maar minder de derde bij een letterkundige **jury**. **Sociale media** vinken de laatste twee af maar niet de eerste.

## Je probleemstelling opbouwen: stap voor stap

### Stap 1, Kies een invalshoek uit de drie

Je kiest A, B of C op basis van je niveau. Markeer deze **keuze** groot op je kladpapier, verander niet meer van gedachten.

### Stap 2, Test de probleemstelling met de "test van de derde"

Vertel je probleemstelling aan een derde (ouder, vriend, docent van een ander vak). Als hij zegt "ik zie wat je gaat vertellen", is het goed. Als hij zegt "leg het beter uit", is het te technisch of te vaag: herformuleer.

### Stap 3, Controleer of ze *problematiseerbaar* is

Een goede probleemstelling bevat een **spanning**: "hoe" eerder dan "wat is". Ze suggereert dat er een debat of mechanisme te begrijpen valt. "Wat is minimax?" is een slechte probleemstelling (beschrijvend). "Hoe maakt minimax het mogelijk om binnen redelijke **tijd** te spelen?" is beter (causaal).

### Stap 4, Controleer of ze aansluit bij je studiekeuze

Als je een technische universiteit ambieert, moet je probleemstelling kunnen leiden naar de overgang "daarom wil ik **informatica** studeren". Als dat niet lukt, is ze slecht geformuleerd.

## Tijdschema: probleemstelling B (alpha-bèta-optimalisatie)

*De uitgeschreven overgangen staan cursief. De Python-code staat in blokken om mondeling uit te leggen: je hoeft ze niet woordelijk voor te lezen, maar wel in heldere taal uit te leggen.*

### 0:00-1:00, Inleiding en probleemstelling

> *"Goedendag. Ik ga het hebben over de manier waarop een computer schaakt, en meer precies, hoe hij zijn zet kiest binnen een redelijke **tijd**.*
> 
> *Schaken kent ongeveer 10^120 mogelijke partijen: meer dan atomen in het waarneembare heelal. Een programma dat alles verkent, is onmogelijk. Mijn probleemstelling: in hoeverre illustreert alpha-bèta-snoeiing de optimalisatie van een boomzoekmethode?*
> 
> *Ik behandel dit in drie stappen: het basisalgoritme minimax, de alpha-bèta-snoeiing die het efficiënt maakt, en de **grenzen** van deze aanpak en wat AlphaZero heeft veranderd."*

### 1:00-4:00, Deel 1: het minimax-algoritme

> *"Het basisidee: het spel modelleren als een boom. Elke knoop is een stelling, elke tak een mogelijke zet. De witspeler wil zijn voordeel maximaliseren, zwart wil het minimaliseren: vandaar de naam minimax.*
> 
> *Hier is de code in Python:"*

![Minimax-spelboom met drie niveaus en afwisseling van MAX-knopen (Wit) en MIN-knopen (Zwart) tot aan de bladeren waar de evaluatiefunctie wordt toegepast.](/images/guide-go-nsi-01-arbre-jeu.svg)

```python
def minimax(positie, diepte, maximaliseert):
    # Basisgeval: diepte bereikt of partij beëindigd
    if diepte == 0 or positie.is_beeindigd():
        return evalueer(positie)   # geeft een numerieke score terug
    
    if maximaliseert:  # beurt van Wit: we zoeken het maximum
        beste = -oneindig
        for zet in positie.mogelijke_zetten():
            positie.speel(zet)
            score = minimax(positie, diepte-1, False)
            positie.maak_ongedaan(zet)
            beste = max(beste, score)
        return beste
    
    else:  # beurt van Zwart: we zoeken het minimum
        beste = +oneindig
        for zet in positie.mogelijke_zetten():
            positie.speel(zet)
            score = minimax(positie, diepte-1, True)
            positie.maak_ongedaan(zet)
            beste = min(beste, score)
        return beste
```

> *"Drie belangrijke punten: recursie (de functie roept zichzelf aan), de afwisseling maximaliseert/minimaliseert (de twee spelers wisselen elkaar af), en de functie `evalueer()` die elke stelling een score geeft.*
> 
> *Welke kosten? Met b ≈ 35 mogelijke zetten per stelling en d = 4 dieptes verkent minimax 35^4 ≈ 1,5 miljoen stellingen. Op 6 niveaus: 35^6 ≈ 1,8 miljard. De groei is exponentieel, O(b^d)."*

![Exponentiële groei van de minimax-kosten O(b^d): van 35 stellingen op diepte 1 tot 1,8 miljard op diepte 6 met b=35.](/images/guide-go-nsi-02-cout-minimax.svg)

### 4:00-7:00, Deel 2: alpha-bèta-snoeiing

> *"Het probleem van minimax: het verkent nutteloze takken. Alpha-bèta-snoeiing snijdt die takken af zonder het resultaat te veranderen.*
> 
> *Het idee: als ik al weet dat een tak mijn bekende beste optie niet kan verbeteren, negeer ik hem."*

```python
def alpha_beta(positie, diepte, alpha, beta, maximaliseert):
    if diepte == 0 or positie.is_beeindigd():
        return evalueer(positie)
    
    if maximaliseert:
        beste = -oneindig
        for zet in positie.mogelijke_zetten():
            positie.speel(zet)
            score = alpha_beta(positie, diepte-1, alpha, beta, False)
            positie.maak_ongedaan(zet)
            beste = max(beste, score)
            alpha = max(alpha, beste)
            if beta <= alpha:     # ← bèta-snoei
                break             # deze tak wordt nooit gekozen
        return beste
    
    else:
        beste = +oneindig
        for zet in positie.mogelijke_zetten():
            positie.speel(zet)
            score = alpha_beta(positie, diepte-1, alpha, beta, True)
            positie.maak_ongedaan(zet)
            beste = min(beste, score)
            beta = min(beta, beste)
            if beta <= alpha:     # ← alpha-snoei
                break             # deze tak wordt nooit gekozen
        return beste
```

> *"`alpha` = beste gegarandeerde score voor Wit. `beta` = beste gegarandeerde score voor Zwart. Wanneer `beta ≤ alpha`, heeft verder verkennen geen zin: geen van beide spelers zou deze tak ooit kiezen.*

![Werking van de parameters alpha en bèta in alpha-bèta-snoeiing: de snoeivoorwaarde beta kleiner dan of gelijk aan alpha geïllustreerd op een beslisboom.](/images/guide-go-nsi-03-alpha-beta-params.svg)

> *Praktische winst: in het beste geval (zetten gesorteerd op kwaliteit) vermindert alpha-bèta de kosten tot O(b^(d/2)). Dat is 35^2 = 1225 stellingen voor d = 4, in plaats van 1,5 miljoen. Je gaat van onmogelijk naar haalbaar in enkele milliseconden."*

![Vergelijking minimax versus alpha-bèta voor b=35 d=4: 1.500.000 stellingen tegenover 1225, een winst van meer dan een factor 1000 in het beste geval.](/images/guide-go-nsi-04-gain-complexite.svg)

### 7:00-9:00, Deel 3: grenzen en de AlphaZero-breuk

> *"Alpha-bèta-snoeiing is elegant, maar heeft structurele **grenzen**.*
> 
> ***Grens 1: de evaluatiefunctie.** `evalueer()` is geschreven door mensen. Ze codeert de intuïties van experts (waarde van stukken, controle van het centrum, veiligheid van de koning). Deze regels kunnen onjuist of onvolledig zijn.*
> 
> ***Grens 2: de diepte.** Zelfs met alpha-bèta blijft de diepte beperkt tot 20-30 zetten op de krachtigste machines. Daarna is het onmogelijk.*
> 
> ***De breuk van AlphaZero (2017):** AlphaZero heeft geen evaluatiefunctie die door mensen is geschreven. Hij leert schaken door tegen zichzelf te spelen (reinforcement learning) en ontwikkelt zijn eigen evaluatie via een neuraal netwerk. In 4 uur zelfstandige training versloeg AlphaZero Stockfish, het beste minimax-programma ter wereld.*
> 
> *Dit is geen optimalisatie meer: het is een ander paradigma. In plaats van in een boom te zoeken, leert hij stellingen te herkennen."*

![Tegenstelling tussen symbolische AI-minimax met expliciete menselijke regels en connectionistische AI-AlphaZero die leert via zelflerend spel en neurale netwerken.](/images/guide-go-nsi-05-alphazero-paradigme.svg)

### 9:00-10:00, Conclusie

> *"Alpha-bèta-snoeiing illustreert een fundamenteel principe van de **informatica**: optimaliseren betekent niet alle oplossingen zoeken, maar intelligent de slechte elimineren.*
> 
> *De kosten gaan van O(b^d) naar O(b^(d/2)): een verschil dat het onmogelijke onmiddellijk maakt. Maar AlphaZero laat zien dat zelfs deze optimalisatie zijn **grenzen** heeft wanneer de kennis door mensen is gecodeerd.*
> 
> *Om verder te gaan: als neurale netwerken leren spelen zonder expliciete regels, wat betekent dan "begrijpen" van een spel? Dat is misschien de echte grens tussen kunstmatige en menselijke intelligentie."*

## Voor de andere invalshoeken: scriptvarianten

Als je **invalshoek A (beslisboom)** of **invalshoek C (AlphaZero-breuk)** kiest, hier de aanpassingen:

### Variant invalshoek A (beslisboom)

- Vervang deel 2 (alpha-bèta) door een **deel 2 gewijd aan de evaluatiefunctie**: hoe je een numerieke score aan een stelling toekent. Noem de klassieke wegingen: dame = 9, toren = 5, loper/paard = 3, pion = 1, plus positiebonus.
- Behoud minimax in deel 1 maar vereenvoudig de code (zonder alpha-bèta).
- In deel 3, praat over Deep Blue (1997) in plaats van AlphaZero.

### Variant invalshoek C (AlphaZero-breuk)

- Draai de balans om: 2 minuten over minimax/alpha-bèta (snel), dan 5 minuten over AlphaZero.
- Benadruk de **systemen** van residuele netwerken, door beleid gestuurde MCTS, reinforcement learning (zelflerend spel).
- Sluit af met de **verbreding**: AlphaZero naar AlphaFold (geneeskunde), MuZero (spellen zonder regels).

## De proef voorbereiden: 25 uitgewerkte juryvragen

*De **NSI**-**jury** stelt vaak vragen over de code, de kosten, en de algoritmische onderscheidingen. Bereid je voor om een uitvoering met de hand op kladpapier na te lopen.*

### Niveau 1, Het vocabulaire begrijpen (basisvragen)

**V1. Waarom heb je schaken gekozen voor je Grand Oral NSI?**
> *"Schaken concentreren verschillende kernbegrippen van het specialisatie**programma**: recursie met minimax, beslisbomen, algoritmische kosten, en meer recent machinaal leren met AlphaZero. Het is een historisch goed gedocumenteerde casestudy (van Deep Blue in 1997 tot AlphaZero in 2017) waarmee je de evolutie van paradigma's in kunstmatige intelligentie kunt zien."*

**V2. Leg recursie in minimax uit in één zin.**
> *"Minimax is recursief omdat het de waarde van een stelling definieert aan de hand van de waarden van de kindstellingen, en elke kindstelling wordt geëvalueerd door diezelfde minimax, tot een limietdiepte of eindstelling is bereikt."*

**V3. Wat is een spelboom?**
> *"Een spelboom is een **data**structuur waarin de wortel de huidige stelling voorstelt, elke knoop een spelstelling voorstelt, en elke tak een mogelijke zet voorstelt. De bladeren zijn ofwel eindstellingen (einde van de partij), ofwel knopen waarbij de limietdiepte is bereikt en de evaluatiefunctie wordt toegepast."*

**V4. Wat is het verschil tussen een MAX-knoop en een MIN-knoop in minimax?**
> *"Een MAX-knoop komt overeen met de beurt van de speler die zijn score wil maximaliseren: meestal Wit. Daar kies je de zet die de hoogste score onder de kinderen geeft. Een MIN-knoop komt overeen met de beurt van de speler die de score wil minimaliseren: Zwart. De afwisseling van MAX- en MIN-knopen simuleert de twee spelers die om beurten optimale beslissingen nemen."*

**V5. Bereken de kosten van minimax voor b=30 zetten en d=3 niveaus.**
> *"O(b^d) = 30^3 = 27.000 stellingen om te verkennen. Met alpha-bèta in het beste geval: O(b^(d/2)) = 30^1,5 = 30 × √30 ≈ 30 × 5,5 ≈ 165 stellingen. De winst is een factor 163: je gaat van 27.000 naar 165 evaluaties."*

### Niveau 2, De mechanismen begrijpen (gemiddelde vragen)

**V6. Leg de voorwaarde `if beta <= alpha: break` in de alpha-bèta-code uit.**
> *"Deze voorwaarde is de alpha-bèta-snoei. `alpha` is de beste score die Wit op de huidige tak kan garanderen. `beta` is de beste score die Zwart kan garanderen. Als `beta ≤ alpha`, zal Zwart dit resultaat nooit accepteren: hij heeft al een betere optie elders. Het is dus zinloos om de resterende zetten op deze tak te verkennen: Zwart zal hem hoe dan ook negeren."*

**V7. Wat is het verschil tussen de kosten in het beste geval en het slechtste geval voor alpha-bèta?**
> *"In het beste geval (zetten gesorteerd van beste naar slechtste) bereikt alpha-bèta O(b^(d/2)): het snijdt ongeveer de helft van de takken af. In het slechtste geval (zetten verkeerd gesorteerd) snoeit het helemaal niet en valt terug op minimax: O(b^d). In de praktijk, met heuristisch sorteren van zetten (op vangwaarde, op bekende positie), zit je ertussenin: ongeveer O(b^(3d/4))."*

**V8. Wat is de evaluatiefunctie en waarom is die cruciaal?**
> *"De evaluatiefunctie kent een numerieke score toe aan elke niet-eindstelling op de limietdiepte. Ze codeert menselijke kennis van het spel: waarde van stukken (dame = 9 punten, toren = 5...), controle van het centrum, veiligheid van de koning, pionnenstructuur. Het is het 'oordeel' van het programma over de kwaliteit van een stelling. Een slechte evaluatiefunctie levert een zwakke speler op, zelfs met een perfect algoritme: dit is de belangrijkste **grens** van de aanpak."*

**V9. Waarom zegt men dat het minimax-algoritme een optimale tegenstander veronderstelt?**
> *"Minimax veronderstelt dat de tegenstander altijd de best mogelijke zet speelt: hij minimaliseert altijd. Als de tegenstander een fout maakt, blijft minimax correct: de resulterende stelling is dan zelfs beter voor ons. Minimax probeert echter niet actief fouten van de tegenstander te benutten: het veronderstelt gewoon dat ze niet gebeuren. Deze aanname van optimaal spel is pessimistisch maar veilig."*

**V10. Hoe verschilde Deep Blue (1997) van pure minimax?**
> *"Deep Blue gebruikte alpha-bèta met massale optimalisaties: een openingenbibliotheek (bekende openingen) om niet in de eerste 20 zetten te hoeven zoeken, een eindspelbibliotheek (opgeloste stellingen), en selectieve zoekuitbreiding (dieper zoeken bij tactisch complexe stellingen). Het evalueerde 200 miljoen stellingen per seconde op speciale hardware. Dat was geen pure minimax, maar sterk geoptimaliseerde alpha-bèta met gecodeerde menselijke expertise."*

**V11. Wat is reinforcement learning dat AlphaZero gebruikt?**
> *"Reinforcement learning is een paradigma waarin een agent leert door met zijn omgeving te interageren en beloningen te ontvangen. AlphaZero speelt tegen zichzelf (self-play): hij krijgt +1 als hij wint, -1 als hij verliest, 0 bij remise. Het neurale netwerk past zijn parameters aan om de cumulatieve beloning te maximaliseren. Na miljoenen partijen tegen zichzelf leert het netwerk strategieën die niemand hem heeft aangeleerd."*

**V12. Wat is de structuur van het neurale netwerk in AlphaZero?**
> *"AlphaZero gebruikt een diep residueel netwerk (ResNet) met twee uitvoerkoppen. De waardekop geeft een getal tussen -1 en 1: de schatting van wie gaat winnen vanaf deze stelling. De beleidskop geeft een kansverdeling over de mogelijke zetten: welke het verdienen om verkend te worden. Deze twee uitvoeren sturen een Monte Carlo Tree Search (MCTS), die de klassieke minimax vervangt."*

### Niveau 3, Nuances en grenzen (gevorderde vragen)

**V13. Waarom is AlphaZero moeilijker te analyseren dan een minimax-programma?**
> *"Een minimax-programma is verklaarbaar: voor elke gekozen zet kun je de boom naspelen en de overwogen varianten zien. AlphaZero is een black box: het neurale netwerk heeft honderden miljoenen parameters, en je kunt niet in regels zeggen 'waarom' hij een zet speelt. Dit is het algemene probleem van verklaarbaarheid van diepe neurale netwerken: hun prestatie is opmerkelijk maar hun redenering is ondoorzichtig."*

**V14. Kun je het minimax-algoritme toepassen op andere spellen dan schaken?**
> *"Ja: op elk spel met twee spelers, volledige informatie, zonder toeval en met een eindig aantal zetten. Boter-kaas-en-eieren, dammen, Go, vier-op-een-rij, Othello. Vier-op-een-rij werd in 1988 door minimax opgelost: Wit wint altijd bij perfect spel. Boter-kaas-en-eieren is triviaal. Go bleef lang onbereikbaar (te groot) tot AlphaGo. Spellen met toeval of verborgen informatie (poker) vereisen uitbreidingen van minimax."*

**V15. Hoe verbetert het sorteren van zetten alpha-bèta in de praktijk?**
> *"Door eerst de meest kansrijke zetten te verkennen (vangzetten, zetten die een groot voordeel geven), maximaliseer je de kans om snel een goede `alpha` te vinden. Hoe hoger `alpha` vroeg is, hoe meer takken je kunt snoeien. Goed sorteren verandert een alpha-bèta in het slechtste geval in een alpha-bèta dicht bij het beste geval. In de praktijk gebruiken moderne programma's heuristieken zoals 'killer moves' en de transpositietabel om efficiënt te sorteren."*

**V16. Wat is een transpositietabel in speltheoretische algoritmiek?**
> *"Een transpositietabel is een hashtabel die al geëvalueerde stellingen met hun score onthoudt. Bij schaken kan dezelfde stelling via verschillende zetreeksen worden bereikt; zonder transpositietabel evalueer je haar meerdere keren. De tabel voorkomt deze herberekening: als de stelling al bekend is, geef je direct de score terug. Dit is een toepassing van het memoïsatieprincipe (of dynamisch programmeren) op boomzoekmethoden."*

**V17. Waarom versnellen bitboards schaakprogramma's?**
> *"Een bitboard geeft het schaakbord weer als een geheel getal van 64 bits, waarbij elk bit met een veld overeenkomt. Bewerkingen op bits (AND, OR, XOR, shift) zijn extreem snel op moderne processoren: één CPU-instructie kan 64 velden tegelijk testen. Het genereren van legale zetten, wat miljoenen keren per seconde moet gebeuren, profiteert enorm van deze representatie. Het is een **voorbeeld** van laagniveau-optimalisatie die de orde van grootte van de prestaties verandert."*

**V18. Is Stockfish nog steeds op alpha-bèta gebaseerd of heeft het neurale netwerken overgenomen?**
> *"Sinds Stockfish 12 (2020) integreert Stockfish NNUE (Efficiently Updatable Neural Network). Dit is een neuraal netwerk dat als evaluatiefunctie wordt gebruikt, maar het zoekalgoritme blijft alpha-bèta. Dit is een hybride aanpak: de klassieke zoekstructuur met een geleerde evaluatie via een neuraal netwerk. Resultaat: Stockfish won in één klap 100 tot 150 Elo-punten. Vandaag strijden beide benaderingen (minimax+NNUE en pure NN zoals Lc0) om de eerste plaats."*

**V19. Hoe gebruikt AlphaZero Monte Carlo Tree Search?**
> *"AlphaZero combineert het neurale netwerk met MCTS. Het netwerk stuurt welke knopen bij voorrang worden verkend (de beleidskop geeft kansen op zetten). MCTS verkent deze knopen op stochastische wijze, verzamelt winst/verliesstatistieken en geeft de meest bezochte zet terug. Het netwerk wordt getraind op de resultaten van deze zoekopdrachten. Het is een cirkel: het netwerk stuurt MCTS, en MCTS levert **data** om het netwerk te verbeteren."*

**V20. Is een perfect algoritme bij schaken in principe mogelijk?**
> *"In principe wel: de stelling van Zermelo (1913) garandeert dat schaken een optimaal resultaat heeft bij perfect spel. Dat perfecte algoritme zou een minimax op oneindige diepte zijn: de hele boom verkennen. In de praktijk is dat, met 10^120 bladeren, fysiek onmogelijk, zelfs voor alle rekenkracht van het heelal gedurende zijn hele geschiedenis. Schaken zal nooit 'opgelost' worden zoals dammen (2007) of boter-kaas-en-eieren: hun grootte plaatst ze buiten bereik van brute kracht."*

### Niveau 4, Verbredingen en dwarsverbanden

**V21. Zijn de AI-technieken van schaken toepasbaar op andere domeinen?**
> *"Ja, dat is een van de grootste interesses. DeepMind heeft de principes van AlphaZero toegepast op AlphaFold (eiwitvouwing, Nobelprijs voor de scheikunde 2024) en op MuZero (spellen waarvan je zelfs de regels niet kent). De **wiskunde** van reinforcement learning komt ook voort uit onderzoek naar spellen. Het is een onderzoeksdomein waar schaken het historische proefterrein zijn."*

**V22. Welke informaticabeveiligingsvraagstukken roept AI bij online schaken op?**
> *"De belangrijkste **vraag** is het opsporen van vals spel. Omdat engines sterker zijn dan elke mens, is hun gebruik in online of fysieke competitie verboden. Dit roept detectie-**systemen** op: statistische analyse van precisie (hoe vaak heeft de speler de door de engine aanbevolen zet gespeeld), tests op atypische stellingen, **werking** van servers zoals Chess.com die anti-vals-spel-teams hebben. Het is een concreet geval van toegepaste **informaticabeveiliging**."*

**V23. Welke rol spelen databases in schaakprogramma's?**
> *"Verschillende database**systemen** worden gebruikt: (1) Openingenbibliotheken (Encyclopaedia of Chess Openings, ECO) die miljoenen menselijke partijen opslaan voor de eerste 20 zetten. (2) Eindspelbases (Syzygy tablebase) die alle stellingen met 7 stukken of minder oplossen (1,5 TB aan **data**). (3) Partijendatabases (Lichess publiceert zijn open database van 4 miljard partijen in PGN-formaat). Het is een **voorbeeld** van big data toegepast op een goed afgebakend domein."*

**V24. Hoe illustreren schaken het debat over de grenzen van AI?**
> *"Schaken hebben drie grote fasen van het debat gevoed. (1) Deep Blue 1997: 'machines kunnen mensen verslaan bij rekentaken'. (2) AlphaZero 2017: 'machines kunnen leren zonder menselijke kennis'. (3) GPT-4 (2024) dat matig schaakt maar met taalkundige redenering: 'algemeenheid impliceert geen expertise'. Schaken zijn een rode draad om te meten wat AI wel en niet kan."*

**V25. Als je je onderwerp over tien jaar zou moeten overnemen, wat zou je dan veranderen?**
> *"Over tien jaar zal AI waarschijnlijk nog meer in het dagelijks leven geïntegreerd zijn. Ik zou verwachten dat schaakprogramma's worden gebruikt om de **neurale netwerken** zelf te begrijpen: waarom wordt een zet als beter beoordeeld dan een andere? Onderzoekers beginnen AlphaZero te 'interpreteren', om strategische principes te extraheren die het netwerk heeft ontdekt. Over tien jaar is dat misschien de belangrijkste les: AI gebruiken om AI te begrijpen."*

## Afdrukbaar spiekbriefje: om in je zak te vouwen

Hier is een geconcentreerde geheugensteun die je kunt afdrukken of overschrijven op een A5-blad. Bij twijfel haal je dit briefje mentaal tevoorschijn.

### De drie getallen om uit je hoofd te kennen

- **35**: gemiddelde vertakkingsfactor bij schaken (b)
- **10^120**: getal van Shannon (mogelijke partijen)
- **28-0-72**: score van AlphaZero tegen Stockfish in 2017 (100 partijen)

### De drie sleuteldata

- **1950**: Turing en Shannon, algoritmische fundamenten
- **1997**: Deep Blue verslaat Kasparov (symbolisch, brute kracht)
- **2017**: AlphaZero verslaat Stockfish in 4 uur (connectionistisch, leren)

![Tijdlijn van AI bij schaken: 1950 Shannon en Turing, 1997 Deep Blue verslaat Kasparov, 2017 AlphaZero verslaat Stockfish in 4 uur door reinforcement learning.](/images/guide-go-nsi-06-chronologie-ia.svg)

### De drie kostennotaties om te hanteren

- **O(b^d)**: pure minimax (exponentieel)
- **O(b^(d/2))**: alpha-bèta beste geval (wortel)
- **O(1)**: toegang transpositietabel (constant)

### De drie sleutelwoorden om te plaatsen

- **Recursie** (kern van minimax)
- **Memoïsatie** (transpositietabel)
- **Reinforcement** (leren van AlphaZero)

### Volledige NSI-geheugensteun

```
╔══════════════════════════════════════════════════════════════╗
║       ALGORITMISCHE KOSTEN, GRAND ORAL NSI                   ║
╠══════════════════════════════════════════════════════════════╣
║ MINIMAX (zonder optimalisatie)                                ║
║   Tijdkosten: O(b^d)                                          ║
║   b = vertakkingsfactor (≈35 bij schaken)                     ║
║   d = zoekdiepte                                               ║
║   Voorbeeld: b=35, d=4 → 35^4 ≈ 1.500.000 stellingen           ║
╠══════════════════════════════════════════════════════════════╣
║ ALPHA-BÈTA (beste geval: goed gesorteerde zetten)              ║
║   Tijdkosten: O(b^(d/2))                                       ║
║   Voorbeeld: b=35, d=4 → 35^2 = 1225 stellingen                ║
║   Winstfactor b^(d/2): ongeveer 1000× bij d=6                  ║
╠══════════════════════════════════════════════════════════════╣
║ ALPHA-BÈTA-PARAMETERS                                          ║
║   alpha: beste gegarandeerde score voor de maximizer            ║
║   beta : beste gegarandeerde score voor de minimizer            ║
║   Snoei: als beta ≤ alpha → tak genegeerd                       ║
╠══════════════════════════════════════════════════════════════╣
║ KERNVOCABULAIRE                                                ║
║   Recursie      : functie die zichzelf aanroept                 ║
║   Snoeiing      : verwijderen van nutteloze takken               ║
║   Heuristiek    : benaderde regel om het zoeken te sturen        ║
║   Memoïsatie    : opslaan om herberekening te vermijden          ║
║   Transpositie  : dezelfde stelling via verschillende paden      ║
╠══════════════════════════════════════════════════════════════╣
║ VERGELIJKING VAN AANPAKKEN                                     ║
║   Minimax / Alpha-bèta: expliciete regels, verklaarbaar          ║
║   AlphaZero / MCTS+NN : leren, black box                         ║
║   Stockfish NNUE      : hybride (alpha-bèta + netwerk)           ║
╚══════════════════════════════════════════════════════════════╝
```

## Tips om te slagen op de grote dag

### Houding en aanwezigheid

Je staat gedurende de **vijf minuten** van je presentatie. De details tellen:

- **Voeten stevig** op schouderbreedte, **nooit** gekruist
- **Handen zichtbaar**: op de tafel, in beweging, nooit in de zakken
- **Blik verdeeld** tussen de twee juryleden: 60% voor die van je specialisatie, 40% voor de ander
- **Stem**: geprojecteerd, rustig, **niet** monotoon. Markeer pauzes na sleutelgetallen
- **Glimlach** minstens één keer tijdens de inleiding en één keer bij de conclusie

### Stressbeheersing voor de proef

**Stress** voor het **mondeling** is normaal en zelfs nuttig (het verhoogt de concentratie). Drie snelle technieken:

1. **Vierkante ademhaling** (4-4-4-4): 4 s inademen, 4 s vasthouden, 4 s uitademen, 4 s pauze. Drie cycli net voor je de zaal binnengaat.
2. **Lichamelijke verankering**: voeten plat op de grond, vuisten 5 seconden gebald en dan losgelaten. Herverbind met je lichaam.
3. **Automatisch eerste woord**: je eerste zin moet vanbuiten paraat zijn. Als je zonder aarzelen begint, volgt de rest vanzelf.

### Tijdbeheer tijdens de presentatie

- **Discrete tijdsbewaking**: leg je horloge voor je neer, of gebruik een zichtbare timer. Als je geen van beide hebt, markeer mentaal bij 5 minuten (halverwege).
- **Structuur als houvast**: bij elke overgang zeg je "eerste deel", "tweede deel": dit helpt de **jury** volgen **en** houdt jou op koers.
- **Als je versnelt** door stress: herken een technisch feit (een getal, een naam) en vertraag daarop. Een pauze van een seconde is beter dan een op hol geslagen tempo.

### Tijdens het gesprek: 10 minuten vragen

De **jury** bevraagt je. Enkele regels:

- **Herformuleer de vraag** in je eigen woorden voor je antwoordt. Dat geeft je bedenktijd.
- **Als je het niet weet**, zeg dan "ik weet het niet zeker, maar ik zou zeggen dat..." in plaats van kortaf "ik weet het niet".
- **Onderscheid niveaus**: als je gevraagd wordt "definieer recursie", begin dan met een eenvoudige zin en nuanceer daarna.
- **Als je iets niet begrijpt**, vraag beleefd "zou u het kunnen herformuleren?" in plaats van ernaast te antwoorden.

### Het studiekeuzeproject: de laatste 5 minuten

Dit is het onderdeel waar velen door vermoeidheid afhaken. Houd vol. Bereid een korte, samenhangende reactie voor:

- Als je een **vooropleiding** ambieert: "Dit **onderwerp** heeft me kennis laten maken met formeel redeneren, dat is wat ik verder wil verdiepen in wiskunde-informatica."
- Als je een **technische universiteit** na het eindexamen ambieert: "Algoritmiek toegepast op een concreet geval heeft me gepassioneerd, ik wil doorgaan in een praktisch georiënteerde opleiding."
- Als je **hbo-informatica** ambieert: "Ik gaf de voorkeur aan code boven pure theorie, ik wil een opleiding die de praktijk vooropstelt."
- Als je **informatica** of **wiskunde** aan de universiteit ambieert: "Ik hield ervan om discrete **wiskunde** en **data**structuren te manipuleren, ik wil dat verder verdiepen aan de universiteit."

**Belangrijk**: lieg niet over je project. De **jury** voelt inconsistentie aan. Een project "in ontwikkeling" wordt beter geaccepteerd dan een verzonnen project.

## Checklist voor de voorbereiding

### 30 dagen van tevoren

- [ ] Kies de probleemstelling uit de drie voorgestelde opties
- [ ] Implementeer een eenvoudige minimax in Python (zelfs voor boter-kaas-en-eieren is dat genoeg)
- [ ] Teken de minimax-boom met de hand voor een stelling met 2 niveaus (essentiële oefening)
- [ ] Onthoud de drie data: 1950, 1997, 2017
- [ ] Lees minstens twee **juryvragen** per dag hardop voor

### 15 dagen van tevoren

- [ ] Eerste oefening met stopwatch: 10 minuten volledige presentatie, alleen, voor de spiegel
- [ ] Maak een lijst van de specifieke **wiskunde** die je moet beheersen (b^d, vierkantswortel, logaritme)
- [ ] Bereid de afgedrukte codebladen voor (om op de tafel te leggen op de grote dag)
- [ ] Identificeer twee of drie numerieke **voorbeelden** om uit je hoofd te kennen (35^4, 30^3, enzovoort)

### 7 dagen van tevoren

- [ ] Tweede oefening met stopwatch met iemand die de **jury** speelt
- [ ] Beantwoord minstens 10 **juryvragen** hardop
- [ ] Wees in staat elke coderegel uit te leggen zonder hem te lezen
- [ ] Herbekijk de volledige geheugensteun

### 2 dagen van tevoren

- [ ] Laatste volledige oefening, gestopwatcht, presentatie gefilmd voor herziening
- [ ] Controleer de kleding (nette broek of rok, overhemd/blouse, gesloten schoenen)
- [ ] Bereid de tas voor: identiteitsbewijs, oproep, pennen, water

### De dag ervoor

- [ ] Herlees het afdrukbare spiekbriefje (maximaal vijf minuten, niet meer)
- [ ] Controleer het tijdstip en adres van de oproep
- [ ] Ga vroeg naar bed: **stress** verstoort de slaap al genoeg, anticipeer erop

### De grote dag

- [ ] Eet normaal 's ochtends (niet meer, niet minder; een lege maag versterkt de stress)
- [ ] Kom 30 minuten van tevoren aan
- [ ] Water in de wachtruimte, geen koffie op een lege maag
- [ ] Voorbereidingsfase: 20 minuten om te kiezen en te organiseren. Verspil niet meer dan 2 minuten aan het kiezen.

## Bronnen en referenties

- **Bulletin officiel, Note de service 2020-014.** [Reglement van de Grand Oral bij het Franse algemene eindexamen.](https://www.education.gouv.fr/bo/) (Officieel kader van de **proef**.)
- **Shannon, C. E. (1950).** *Programming a Computer for Playing Chess.* *Philosophical Magazine*. (Basis van het minimax-algoritme.)
- **Silver, D., et al. (DeepMind, 2018).** [*A general reinforcement learning algorithm that masters chess, shogi, and Go.*](https://www.science.org/doi/10.1126/science.aar6404) *Science*, 362(6419). (AlphaZero: reinforcement learning en MCTS.)
- **Knuth, D. & Moore, R. (1975).** [*An Analysis of Alpha-Beta Pruning.*](https://www.sciencedirect.com/science/article/pii/0004370275900193) *Artificial Intelligence*. (Formele analyse van alpha-bèta-snoeiing.)
- **Documentatie Stockfish.** [*Stockfish Chess Engine, broncode.*](https://github.com/official-stockfish/Stockfish) GitHub. (Referentie voor de echte implementatie.)
- **Lichess Open Database.** [*lichess.org/database*](https://database.lichess.org). (Openbare **data**base van schaakpartijen in PGN-formaat.)
- **Sadler, M. & Regan, N. (2019).** *Game Changer: AlphaZero's Groundbreaking Chess Strategies.* New In Chess. (Analyse van de speelstijl van AlphaZero, toegankelijk voor scholieren.)
- **Russell, S. & Norvig, P.** *Artificial Intelligence: A Modern Approach* (4e ed., 2020). Pearson. (Standaardwerk AI, hoofdstukken 5-6 over minimax.)

---

*Deze gids is vrij te gebruiken en af te drukken. Veel succes: je hebt het werk gedaan.*
