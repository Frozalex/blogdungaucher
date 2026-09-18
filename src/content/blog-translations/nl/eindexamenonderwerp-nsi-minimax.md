---
title: "Grand Oral onderwerp NSI: hoe kan een computerprogramma schaken?"
excerpt: >-
  Volledig uitgeschreven onderwerp voor het Franse eindexamenonderdeel Grand Oral, specialisatie NSI: recursie,
  beslisboom, evaluatiefunctie en minimax uitgelegd in 10 minuten, klaar om voor te dragen, met becommentarieerde Python-code.
seoTitle: "Grand Oral onderwerp NSI minimax schaken: volledige tekst"
seoDescription: >-
  Grand Oral onderwerp NSI over schaken en minimax, volledig uitgeschreven voor 10 minuten voordracht. Recursie,
  beslisboom, evaluatiefunctie, Python-code: examenklare tekst.
frSlug: sujet-grand-oral-nsi-minimax
draft: false
---

> **Download dit onderwerp als PDF** om het af te drukken en hardop te oefenen. Deze tekst is geschreven voor **tien minuten** aaneengesloten voordracht, klaar om zo te gebruiken.

---

Goedendag. Ik ga het hebben over schaken bekeken als een informaticaprobleem. Niet over het spel zelf, maar over de volgende **vraag**: hoe kan een computerprogramma beslissingen nemen om te schaken?

Deze **vraag** interesseert mij omdat ze drie pijlers van het programma van de specialisatie **NSI** (numerieke en informaticawetenschappen) in het Franse eindexamenjaar raakt: recursie, boomvormige datastructuren, en complexiteitsanalyse. Schaken is een van de oudste **onderwerpen** die door de **informatica** zijn bestudeerd: Alan Turing schreef in 1950 het eerste schaakprogramma op papier, en vijfenzeventig jaar later toont AlphaZero aan dat een machine kan leren spelen zonder enige menselijke tussenkomst. Daartussen ligt bijna de hele geschiedenis van kunstmatige intelligentie.

Om mijn **vraag** te beantwoorden, behandel ik drie stappen. Eerst modelleer ik het spel als een beslisboom en presenteer ik het minimax-algoritme dat hem verkent. Vervolgens ga ik in op de evaluatiefunctie, dat wil zeggen de manier waarop het programma een score toekent aan een stelling. Ten slotte bespreek ik de **beperkingen** van deze aanpak en wat AlphaZero heeft veranderd.

## De beslisboom en het minimax-algoritme

Het fundamentele idee is het schaakspel als boom te modelleren. De wortel van deze boom is de beginstelling. Elke tak vertegenwoordigt een mogelijke zet. Elke kindknoop vertegenwoordigt de nieuwe stelling na die zet. In theorie kan men deze boom tot het einde van de partij ontwikkelen: de bladeren zijn dan de matposities, patposities of remisestellingen.

Het **programma** moet de beste zet kiezen uit alle mogelijke zetten. Maar hoe? Het **minimax**-algoritme, geformaliseerd door Claude Shannon in 1950, berust op een heel eenvoudige intuïtie: ik speel om te winnen, mijn tegenstander speelt om mij te laten verliezen. Dus bij elke beurt wissel ik af tussen het maximaliseren van mijn score (mijn beurt) en het minimaliseren van diezelfde score (de beurt van mijn tegenstander, verondersteld optimaal te spelen).

Hier is hoe dit zich vertaalt naar Python.

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

Drie elementen van het NSI-programma komen hier naar voren. Ten eerste, **recursie**: de functie `minimax` roept zichzelf aan, op een stelling die door een zet is getransformeerd. Ten tweede, het **basisgeval**: de voorwaarde `profondeur == 0` of `position.est_terminee()` die de recursie stopt. Zonder dit basisgeval zou men een oneindige recursie krijgen. Ten derde, de **boom**structuur: elke recursieve aanroep verkent de kinderen van een knoop voordat het resultaat wordt teruggegeven aan de ouder. Dat is precies een diepte-eerst-zoektocht.

![Recursieve aanroepstapel van minimax: de functie daalt af tot het basisgeval (evaluer), en geeft dan de MIN- en MAX-scores van knoop naar knoop terug tot de wortel.](/images/sujet-nsi-minimax-01-recursivite-pile.svg)

Om deze doorloop te visualiseren toont de boom hieronder minimax in actie op een klein voorbeeld: de driehoeken die omhoog wijzen zijn **MAX**-knopen (mijn beurt), die omlaag wijzen zijn **MIN**-knopen (de tegenstander), en de vierkanten zijn de geëvalueerde bladeren. Start de weergave om te zien hoe de score van onder naar boven omhoog gaat. Activeer vervolgens de **alfa-bètasnoei**: je zult zien hoe bepaalde takken worden afgesneden, omdat het programma kan bewijzen dat ze het resultaat niet zullen veranderen. Dat is precies de optimalisatie waarover ik het verderop zal hebben.

<minimax-tree leaves="3 5 6 9 1 2 0 -1"></minimax-tree>

De **complexiteit** van het algoritme is cruciaal om te begrijpen. Bij schaken heeft elke speler gemiddeld vijfendertig legale zetten. Als ik alle varianten tot een diepte van vier halve zetten wil verkennen, moet ik vijfendertig tot de macht vier stellingen onderzoeken, ongeveer anderhalf miljoen. Bij diepte zes overschrijdt men het miljard. De **complexiteit** is exponentieel, in grote-O-notatie schrijft men O(b tot de macht d), waarbij b de vertakkingsfactor is en d de diepte.

Schaken heeft echter ongeveer tien tot de macht honderdtwintig mogelijke partijen, meer dan er atomen zijn in het waarneembare heelal. Het is fysiek onmogelijk de volledige boom te verkennen. Het **programma** moet zich dus tevredenstellen met een gedeeltelijke verkenning, tot een vaste diepte, en een evaluatiefunctie gebruiken om de kwaliteit van de bereikte stellingen op die diepte in te schatten.

## De evaluatiefunctie: een stelling beoordelen zonder alles te berekenen

Hier zit de kern van de subtiliteit. Wanneer het **programma** zijn zoektocht op een bepaalde diepte stopt, bereikt het stellingen die geen einde van de partij zijn. Er moet een numerieke score aan worden toegekend om takken onderling te kunnen vergelijken.

De klassieke evaluatiefunctie bij schaken combineert meerdere criteria. Het eenvoudigste is de materiële waarde van de stukken: de dame is negen punten waard, de toren vijf, de loper en het paard drie, de pion één. Als ik de som voor Wit bereken en de som voor Zwart aftrek, krijg ik een positief materieel onevenwicht als Wit in het voordeel is.

![Uitsplitsing van de evaluatiefunctie in drie componenten: materieel voordeel (waarde van de stukken), positiebonus (controle van het centrum en mobiliteit) en koningsveiligheidsbonus, wat een positieve totaalscore geeft in het voordeel van Wit.](/images/sujet-nsi-minimax-02-evaluation-criteres.svg)

Maar materiaal alleen volstaat niet. Een serieus **programma** voegt bonussen toe voor positie: controle van het centrum, koningsveiligheid, mobiliteit van de stukken, pionstructuur. Hier is een vereenvoudigde versie in Python.

```python
VALEURS = {'P': 1, 'C': 3, 'F': 3, 'T': 5, 'D': 9, 'R': 0}

def evaluer(position):
    score = 0
    for case in position.cases():
        piece = position.piece_sur(case)
        if piece is None:
            continue
        v = VALEURS[piece.type]
        if piece.couleur == 'blanc':
            score += v
        else:
            score -= v
    score += bonus_position(position)
    score += bonus_securite_roi(position)
    return score
```

Deze functie is de intelligentie van het **programma**. Ze codeert de menselijke kennis van het spel, opgebouwd over eeuwen. Dat is ook de belangrijkste zwakte ervan: de evaluatiefunctie is door mensen geschreven, en weerspiegelt dus soms onnauwkeurige of onvolledige intuïties. Als de functie de waarde van centrumcontrole onderschat, zal het **programma** systematisch passieve zetten spelen.

Om dit probleem te beperken gebruiken moderne engines zoals Stockfish een geoptimaliseerde versie van minimax genaamd alfa-bètasnoei. Het idee is bepaalde takken af te snijden waarvan men kan bewijzen dat ze het uiteindelijke resultaat niet zullen veranderen. Deze optimalisatie is puur algoritmisch: ze verandert de evaluatiefunctie niet, maar maakt het mogelijk dieper te verkennen in minder tijd. In het beste geval deelt de snoei de **complexiteit** door de vierkantswortel, wat enorm is.

Op mijn eigen computer kan een naïef Python-**programma** een boom op diepte vier in enkele seconden verkennen. Stockfish, geschreven in C++ met alle mogelijke optimalisaties, bereikt regelmatig dieptes van twintig tot dertig zetten in enkele seconden. Deze winst komt zowel van betere evaluatiefuncties, betere snoei als van efficiënte datastructuren zoals bitboards, die het schaakbord voorstellen als één enkel geheel getal van vierenzestig bits.

## Beperkingen van de minimax-aanpak en de doorbraak van AlphaZero

Alles wat ik hierboven heb beschreven, berust op twee sterke aannames. Ten eerste veronderstelt men dat men een goede evaluatiefunctie met de hand kan schrijven. Ten tweede veronderstelt men dat men diep genoeg kan verkennen zodat de evaluatie betrouwbaar is. Deze twee aannames hebben **beperkingen**.

De menselijke evaluatiefunctie is noodzakelijk onvolmaakt. Geen enkele grootmeester kan zijn volledige spelintuïtie in een formule vastleggen. Vijftig jaar lang waren de beste **programma's** reeksen kleine verbeteringen op dezelfde basisformule. Uiteindelijk bereikte dit een plafond.

De doorbraak kwam van DeepMind, in tweeduizendzeventien, met **AlphaZero**. In tegenstelling tot Stockfish heeft AlphaZero geen door mensen geschreven evaluatiefunctie. Het **programma** leert spelen door miljoenen keren tegen zichzelf te spelen, en past bij elke partij een neuraal netwerk aan. Er wordt geen enkele menselijke kennis geïnjecteerd: alleen de spelregels worden gegeven.

Het resultaat is spectaculair. Na vier **uur** training op gespecialiseerde hardware won AlphaZero achtentwintig van de honderd partijen tegen Stockfish, verloor het nooit, en speelde het remise in alle andere partijen. Het **programma** herontdekte zelf klassieke openingen, bedacht nieuwe, en speelde in een stijl die menselijke commentatoren diepgaand origineel noemden.

Op **informatica**vlak is dit een paradigmawisseling. De minimax-aanpak is **imperatief programmeren**: de ontwikkelaar vertelt de machine expliciet wat ze moet doen. De AlphaZero-aanpak is **machine learning** via reinforcement: de ontwikkelaar geeft een doel, en de machine ontdekt zelf hoe ze het bereikt. Beide benaderingen staan op het NSI-programma, en schaken biedt de beste illustratie van de overgang van de ene naar de andere.

Om dit verschil te begrijpen kan men twee **systemen** vergelijken. Stockfish zegt: "hier is de waarde van een dame, hier is het belang van het centrum, hier is hoe te zoeken; zoek tot diepte vijftien". AlphaZero zegt: "hier zijn de regels; speel miljoenen partijen tegen jezelf; je zult je eigen manier vinden om stellingen te evalueren". Beide werken, maar ze denken niet op dezelfde manier.

## Conclusie en opening

Om mijn oorspronkelijke **vraag** te beantwoorden: een computerprogramma kan op twee hoofdmanieren beslissingen nemen om te schaken. De eerste, klassieke manier is het minimax-algoritme gesteund op een door experts geschreven evaluatiefunctie. Deze aanpak wordt beperkt door de exponentiële **complexiteit** van het spel en door de kwaliteit van de evaluatiefunctie. De tweede, moderne manier is reinforcement learning: het **programma** speelt tegen zichzelf en past een neuraal netwerk aan, zonder aanvankelijke menselijke kennis. Deze aanpak heeft met AlphaZero aangetoond dat ze vijftig jaar menselijke expertise in vier uur kan overtreffen.

De meest natuurlijke openingsvraag is of deze paradigmawisseling beperkt blijft tot spellen. Het antwoord lijkt nee: dezelfde technieken zijn toegepast op eiwitvouwing met AlphaFold, Nobelprijs voor Scheikunde tweeduizendvierentwintig, en op andere **systemen** waarbij de **informatica** complexe beslissingen moet nemen zonder alles te kunnen opsommen. Schaken is misschien een klein spel, maar het is het laboratorium van een veel bredere informaticarevolutie.

Dank u voor uw aandacht, ik sta klaar om uw vragen te beantwoorden.
