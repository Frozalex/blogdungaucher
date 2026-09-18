---
title: "Grand Oral onderwerp NSI: waarom vormt AlphaZero een doorbraak in kunstmatige intelligentie?"
excerpt: >-
  Volledig uitgeschreven onderwerp voor het Franse eindexamenonderdeel Grand Oral, specialisatie NSI: reinforcement
  learning, neurale netwerken, Monte Carlo Tree Search, de epistemologische breuk van AlphaZero. Tekst van 10 minuten, klaar om voor te dragen.
seoTitle: "Grand Oral onderwerp NSI AlphaZero schaken: volledige tekst"
seoDescription: >-
  Grand Oral onderwerp NSI over AlphaZero en reinforcement learning, volledig uitgeschreven voor 10 minuten voordracht.
  Neurale netwerken, MCTS, epistemologische breuk: examenklare tekst.
frSlug: sujet-grand-oral-nsi-alphazero
draft: false
---

> **Download dit onderwerp als PDF** om het offline te herhalen. Tekst geschreven voor **tien minuten** aaneengesloten voordracht, klaar om zo te gebruiken.

---

Goedendag. Ik ga het hebben over een gebeurtenis die de geschiedenis van de **informatica** heeft gemarkeerd: de overwinning van AlphaZero op Stockfish in tweeduizendzeventien.

Het **onderwerp** is precies: waarom vormt AlphaZero een doorbraak in kunstmatige intelligentie toegepast op strategische spellen? Deze **vraag** interesseert mij omdat ze op het snijvlak ligt van het programma van de specialisatie **NSI** (numerieke en informaticawetenschappen) in het Franse eindexamenjaar: ze maakt gebruik van begrippen als machine learning en neurale netwerken, en breder van het onderscheid tussen **imperatief programmeren** en **statistisch leren**.

Vóór tweeduizendzeventien berustten alle schaakprogramma's op hetzelfde paradigma: een boomzoekalgoritme zoals alfa-bèta, gestuurd door een evaluatiefunctie geschreven door menselijke experts. Deze aanpak, geërfd van Claude Shannon uit 1950, kende vijftig jaar geleidelijke verbeteringen. AlphaZero, ontwikkeld door DeepMind, versloeg Stockfish, destijds het beste programma ter wereld, na vier **uur** training, zonder enige voorafgaande menselijke kennis. Dat ga ik hier analyseren.

Ik behandel drie stappen. Eerst herhaal ik kort de klassieke aanpak om te meten wat er verandert. Vervolgens presenteer ik de architectuur van AlphaZero en de werking ervan. Ten slotte bespreek ik de aard van deze doorbraak en de **beperkingen** ervan.

## De klassieke aanpak: minimax en evaluatiefuncties

Om te begrijpen wat AlphaZero heeft veranderd, moet men eerst begrijpen wat het heeft vervangen. Vijftig jaar lang werkten schaakprogramma's met twee onderdelen. Enerzijds een zoekalgoritme: minimax met alfa-bètasnoei, dat een boom van zetten verkent tot een gegeven diepte. Anderzijds een evaluatiefunctie: een formule die een score toekent aan een niet-eindstelling, gebaseerd op de waarde van stukken, controle van het centrum, koningsveiligheid en andere handmatig gecodeerde criteria.

Het beste **voorbeeld** van deze aanpak is Stockfish, een opensourceprogramma dat sinds tweeduizendacht wordt ontwikkeld. Het evalueert ongeveer tweehonderd miljoen stellingen per seconde. Zijn evaluatiefunctie is het resultaat van vijftien jaar fijnafstemming door een gemeenschap van honderden ontwikkelaars. Het is een hoogtepunt van **imperatief programmeren**: elke regel code vertelt de machine expliciet wat ze moet doen en waarom.

Het voordeel van deze aanpak is **verklaarbaarheid**: men kan begrijpen waarom het programma een bepaalde zet speelt. De evaluatiefunctie is leesbaar, de verkende boom is traceerbaar. Dat is ook de belangrijkste **beperking** ervan: de evaluatiefunctie weerspiegelt menselijke intuïties, en erft dus de vooroordelen en blinde vlekken van de experts die haar schreven.

In tweeduizendzeventien overtrof de engine Stockfish het niveau van alle menselijke spelers, inclusief de wereldkampioen. Men kon zich voorstellen dat het plafond was bereikt, en dat toekomstige vooruitgang incrementeel zou zijn. Het is precies die overtuiging die AlphaZero heeft doorbroken.

## AlphaZero: architectuur en werking

AlphaZero werd gepresenteerd door DeepMind, een dochteronderneming van Google, in een artikel gepubliceerd in Science in tweeduizendachttien. Het programma berust op drie nieuwe onderdelen ten opzichte van Stockfish.

Ten eerste, een diep **neuraal netwerk**. Dit netwerk krijgt als invoer een schaakstelling (gecodeerd als een tensor met afmetingen 8×8×planes), en produceert twee uitvoeren. De eerste is een waardescore, tussen min één en plus één, die schat wie vanuit deze stelling gaat winnen. De tweede is een kansverdeling over de mogelijke zetten, die aangeeft welke prioriteit verdienen om verkend te worden.

Ten tweede, een zoekalgoritme genaamd **Monte Carlo Tree Search**, of MCTS. In tegenstelling tot minimax, dat de boom deterministisch en uitputtend verkent, verkent MCTS selectief en stochastisch. Het bezoekt bij voorkeur de knopen die het neurale netwerk veelbelovend acht, verzamelt win- en verliesstatistieken per simulatie, en geeft de meest bezochte zet terug.

![Contrast tussen minimax (uitputtende verkenning van alle knopen op vaste diepte) en de MCTS van AlphaZero (selectieve verkenning gestuurd door de kansen van het neurale netwerk).](/images/sujet-alphazero-02-mcts-vs-minimax.svg)

Ten derde, een mechanisme van **reinforcement learning**. AlphaZero speelt miljoenen partijen tegen zichzelf. Bij elke partij observeert het het resultaat (winst, verlies, remise) en past het de gewichten van zijn neurale netwerk aan om de volgende keer winnende stellingen beter te voorspellen. Dit is een zelfverbeterende lus: het netwerk stuurt MCTS, MCTS produceert **data**, deze **data** trainen het netwerk, en de cyclus herhaalt zich.

![Zelfverbeterende cyclus van AlphaZero: het neurale netwerk stuurt MCTS, dat partijen tegen zichzelf speelt, waarvan de resultaten het netwerk opnieuw trainen, zonder enige geïnjecteerde menselijke kennis.](/images/sujet-alphazero-01-boucle-self-play.svg)

Het resultaat is spectaculair. Na vier **uur** training op gespecialiseerde hardware (5.000 TPU's) bereikt AlphaZero een niveau boven dat van Stockfish. Tijdens de officiële match, over honderd partijen, won AlphaZero achtentwintig keer, verloor het nooit, en speelde het tweeënzeventig keer remise. Er werd geen enkele menselijke kennis geïnjecteerd: AlphaZero herontdekte zelf de principes van openingen, pionstructuren en positionele offers. Sterker nog: het bedacht strategieën die menselijke commentatoren diepgaand origineel noemden.

Hier is een vereenvoudigde weergave van de kern van het algoritme in Python-pseudocode.

```python
def alphazero_self_play():
    reseau = ReseauNeurones()
    for partie in range(millions):
        position = position_initiale()
        historique = []
        while not position.est_terminee():
            distribution = mcts(position, reseau, simulations=800)
            coup = echantillonner(distribution)
            historique.append((position, distribution))
            position.joue(coup)
        resultat = position.resultat()
        for pos, dist in historique:
            reseau.entrainer(pos, dist, resultat)
```

De kern van deze code is de MCTS-functie, die het netwerk gebruikt om haar zoektocht te sturen, en de trainingsfunctie, die de gewichten van het netwerk aanpast op basis van de partijresultaten. Er is geen enkele schaakkennis expliciet gecodeerd: men geeft de spelregels en een beloningssignaal, en het netwerk ontdekt zelf de rest.

## De aard van de doorbraak en de beperkingen ervan

In welk opzicht vormt AlphaZero een epistemologische breuk, en niet alleen een verbetering? Het antwoord bestaat uit drie punten.

Ten eerste is het een **paradigmawisseling**. De klassieke aanpak behoort tot **imperatief programmeren**: de ontwikkelaar vertelt de machine hoe ze het probleem moet oplossen. AlphaZero behoort tot **machine learning** via reinforcement: de ontwikkelaar vertelt de machine wat ze moet bereiken, en de machine ontdekt zelf hoe. Deze twee paradigma's bestaan naast elkaar in het NSI-programma, maar AlphaZero is een van de meest spectaculaire **voorbeelden** van het tweede.

Ten tweede is het een doorbraak op het gebied van **algemeenheid**. Stockfish kan alleen schaken: zijn evaluatiefunctie is specifiek voor dit spel. AlphaZero kan, met exact dezelfde code, Go, Shogi of elk spel met volledige informatie leren. Het volstaat om de regels te geven. Dat is een indrukwekkende generalisatie. Enkele maanden later leerde het afgeleide systeem MuZero spellen waarvan het zelfs de regels niet kreeg. De reikwijdte van deze **methode** overstijgt ruimschoots het schaken.

Ten derde is het een doorbraak op het gebied van **verklaarbaarheid**. Stockfish is verklaarbaar: voor elke zet kan men de boom terugvoeren en de varianten identificeren die tot de keuze hebben geleid. AlphaZero is een zwarte doos: zijn neurale netwerk heeft tientallen miljoenen parameters, en niemand kan in woorden uitleggen waarom het een bepaalde zet speelt. Deze ondoorzichtigheid is een van de grote filosofische **vraagstukken** van de moderne **informatica**. Ze roept de **vraag** op: kan men zeer performante maar niet-verklaarbare beslissingen accepteren? In de context van schaken is dat een bijzaak. In een medische of juridische context is het een groot probleem.

De **beperkingen** van AlphaZero zijn ook aanzienlijk. Ten eerste kost de training veel: 5.000 TPU's gedurende meerdere **uren**, oftewel meerdere miljoenen dollars aan infrastructuur. Deze toetredingsdrempel concentreert het onderzoek bij enkele grote bedrijven. Ten tweede blijft AlphaZero traag in termen van geëvalueerde stellingen: ongeveer zestigduizend per seconde, tegenover tweehonderd miljoen voor Stockfish. Zijn superioriteit komt van de kwaliteit van de evaluatie, niet van het rekenvolume. Ten derde kan het systeem niet generaliseren buiten zijn trainingsdomein: een AlphaZero getraind op schaken kan niet spontaan dammen spelen.

## Conclusie

Om mijn oorspronkelijke **vraag** te beantwoorden: AlphaZero vormt een doorbraak in kunstmatige intelligentie omdat het expliciet programmeren loslaat ten gunste van **reinforcement learning**, en aantoont dat deze aanpak vijftig jaar menselijke expertise in vier **uur** kan overtreffen. Deze doorbraak is niet alleen kwantitatief: ze verandert de betekenis van wat het inhoudt om kunstmatige intelligentie te "programmeren".

De diepste openingsvraag is dat de principes van AlphaZero later zijn toegepast op grote wetenschappelijke problemen. AlphaFold, rechtstreeks afgeleid van AlphaZero, loste in tweeduizendtwintig het eiwitvouwingsprobleem op, dat vijftig jaar open had gestaan. Deze doorbraak leverde de auteurs ervan in tweeduizendvierentwintig de Nobelprijs voor Scheikunde op. Schaken was dus het laboratorium van een informaticarevolutie waarvan de impact het speldomein verre overstijgt.

Dank u voor uw aandacht, ik sta klaar om uw vragen te beantwoorden.
