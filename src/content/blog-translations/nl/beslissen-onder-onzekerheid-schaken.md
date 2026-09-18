---
title: "Beslissen onder onzekerheid bij schaken: kiezen zonder alle varianten te kennen"
excerpt: >-
  Geen enkele schaakpartij wordt gespeeld met volledige informatie. Je beslist altijd zonder tot het einde
  te berekenen, zonder te weten wat de tegenstander gaat antwoorden, zonder zekerheid over je evaluatie. De
  besliskunde onder onzekerheid heeft een eeuw aan instrumenten voor precies dit moment. Hier zijn degene
  die van toepassing zijn op het schaakbord.
seoTitle: "Beslissen onder onzekerheid bij schaken: verwachte nutswaarde, Bayes en begrensde rationaliteit"
seoDescription: >-
  Verwachte nutswaarde, bayesiaans criterium, verliesaversie, begrensde rationaliteit: de besliskunde
  toegepast op het moment dat je een zet kiest onder onzekerheid.
frSlug: decision-sous-incertitude-aux-echecs
draft: false
---

Je hebt vier kandidaatzetten. Je hebt geen tijd om elk tot het einde te berekenen. Je weet dat je evaluatie bij benadering is. Je weet dat de tegenstander niet noodzakelijk het theoretisch beste antwoord zal spelen. Je moet toch kiezen.

Dit moment is niets uitzonderlijks: het is de standaardsituatie bij schaken. Een hele partij is een reeks beslissingen genomen zonder volledige informatie. De besliskunde onder onzekerheid bestudeert precies dit moment. Ze heeft een eeuw aan wiskundige en experimentele instrumenten te bieden voor de speler die wil begrijpen wat hij doet wanneer hij kiest.

## Eerst: waar dit artikel niet over gaat

Bij schaken staat het woord "onzekerheid" overal. Voordat we verder gaan, moet dit artikel van enkele buren gescheiden worden.

**Dit is geen speltheorie.** De [speltheorie bij schaken](/fr/blog/theorie-des-jeux-aux-echecs/) bestudeert de strategische interactie tussen spelers: evenwichten, wederzijdse verwachtingen, optimale strategieën bij volledige informatie. Hier gaat het om een preciezer onderwerp: de *individuele* beslissing tegenover onzekerheid.

**Dit is geen zuivere bayesiaanse statistiek.** Het artikel over [bayesiaanse netwerken bij schaken](/fr/blog/reseaux-bayesiens-predire-blunder/) bekijkt hoe je statistische modellen bouwt om gebeurtenissen te voorspellen (blunders, winsten). Hier gaat het om het gebruik van bayesiaans redeneren als een besluitvormingsmethode in real time.

**Dit is geen algoritmische complexiteit.** Het feit dat schaken een EXPTIME-compleet probleem is (zie [waarom schaken een onmogelijk wiskundig probleem is](/fr/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/)) verklaart waarom je *moet* beslissen onder onzekerheid. Maar het hoe, dat is hier.

De inzet van dit artikel: wat te doen op het precieze moment dat je aarzelt tussen meerdere zetten en weet dat je niet alles zult weten.

## Het klassieke kader: verwachte nutswaarde

Het eerste wiskundige kader voor beslissen onder onzekerheid werd geformaliseerd door [John von Neumann](https://nl.wikipedia.org/wiki/John_von_Neumann) en [Oskar Morgenstern](https://en.wikipedia.org/wiki/Oskar_Morgenstern) in 1944 in *Theory of Games and Economic Behavior*. Het principe is eenvoudig: ken bij een beslissing aan elke mogelijke uitkomst een **nut** toe (een getal dat de waarde ervan voor jou vertegenwoordigt) en een **waarschijnlijkheid**, vermenigvuldig beide, sommeer over de uitkomsten, en kies de optie met de hoogste verwachte nutswaarde.

Wiskundig: $E[U(a)] = \sum_s p(s|a) \cdot U(s)$ waarbij $a$ de gekozen actie is en $s$ de mogelijke toestanden van de wereld.

Bij schaken pas je dit kader toe op een keuze tussen twee zetten:

Zet A: 60% kans om op +0,8 uit te komen, 40% kans om op 0,0 te vallen. Verwachting = 0,48.
Zet B: 30% kans om op +2,0 uit te komen, 70% kans om op -0,3 te vallen. Verwachting = 0,39.

De verwachte nutswaarde beveelt zet A aan. Maar veel spelers kiezen intuïtief zet B: "als het lukt, win ik". Dit is al de eerste les: onze intuïties wijken vaak af van het criterium van de verwachte nutswaarde. En dat is niet noodzakelijk een fout.

## Waarom verwachte nutswaarde alleen niet volstaat

Het criterium van verwachte nutswaarde heeft een groot gebrek: het veronderstelt dat je de waarschijnlijkheden kent. Bij schaken *schat* je ze, en je schattingen zijn onnauwkeurig. Dat is geen nuance: het is een verschil van aard.

[Frank Knight](https://en.wikipedia.org/wiki/Frank_Knight) introduceerde in 1921 het onderscheid tussen **risico** (bekende waarschijnlijkheden) en **onzekerheid** (onbekende waarschijnlijkheden). Poker (een eenvoudig kaart- en fichespel) is over het algemeen een risicospel: de verdeling van de kaarten is bekend, men wedt op berekenbare waarschijnlijkheden. Schaken is een spel van Knightiaanse onzekerheid: je hebt geen waarschijnlijkheidstabel voor "de tegenstander gaat Tc4 spelen na mijn Pf5".

Wanneer men overgaat van risico naar Knightiaanse onzekerheid, wordt zuivere verwachte nutswaarde een onvolmaakte gids. Verschillende alternatieve criteria zijn voorgesteld, die rekening houden met de onwetendheid over de waarschijnlijkheden zelf.

## Het maximin-criterium: veiligheid tegen optimalisatie

Het **maximin-criterium** zegt: kies de actie waarvan het slechtst mogelijke resultaat het minst slecht is. Dit is het criterium van de rationele pessimist.

Wiskundig: kies de actie $a$ die $\min_s U(s, a)$ maximaliseert.

Bij schaken komt dit criterium overeen met **solide** spel: je kiest de zet waarvan het slechtste mogelijke vijandelijke antwoord je nog in een speelbare stelling laat. Spelers als [Tigran Petrosjan](https://nl.wikipedia.org/wiki/Tigran_Petrosjan) of [Anatoli Karpov](https://nl.wikipedia.org/wiki/Anatoli_Karpov) hebben een groot deel van hun spel gebaseerd op criteria die dicht bij maximin liggen.

Het voordeel: je beschermt jezelf tegen schattingsfouten. Je kunt je vergissen over de waarschijnlijkheden en toch een aanvaardbaar resultaat behouden.

Het nadeel: je kunt belangrijke winsten laten liggen. Een prachtige zet met 80% kans van slagen kan een slechtst geval hebben van -1,5, tegenover een solide zet met 30% winstkans maar slechtst geval van 0,0. Maximin kiest de solide zet, zelfs als de verwachting naar de gedurfde zet neigt.

Maximin heeft zijn plaats: in tijdnood, aan het einde van een toernooi met een winst die voldoende is voor de klassering, tegen een onvoorspelbare tegenstander. Buiten die gevallen is het een te voorzichtig criterium.

## Het bayesiaanse criterium: beslissen met een prior

Het **bayesiaanse** criterium combineert twee ingrediënten: je *prior* (wat je denkt voordat je deze specifieke stelling analyseert) en je *likelihood* (wat de analyse van de stelling je onthult).

De formule van Bayes: $p(\text{hypothese}|\text{gegevens}) \propto p(\text{gegevens}|\text{hypothese}) \cdot p(\text{hypothese})$.

In gewone taal voor schaken: je uiteindelijke inschatting van een variant combineert wat je in het algemeen weet over dit type stelling (prior) met wat deze precieze stelling je vertelt (likelihood). Beide tellen. Een speler die zich alleen baseert op zijn prior (de strategische algemeenheden) zal correcte maar blinde zetten spelen voor de bijzonderheden. Een speler die zich alleen baseert op de stelling voor hem zal elementen missen die de algemene kennis had kunnen benadrukken.

De weging tussen prior en likelihood moet afhangen van de kwaliteit van elk:

- Bekende stelling, klassieke structuur, beheerste opening: je kunt meer gewicht geven aan je prior. Je ervaring compenseert de onnauwkeurigheid van je berekening.
- Ongewone stelling, buiten je repertoire, zeldzame structuur: je prior is weinig betrouwbaar, geef meer gewicht aan de concrete analyse, ook al is die onvolmaakt.

Deze bayesiaanse update gebeurt van nature bij sterke spelers: ze weten wanneer ze "moeten luisteren" naar hun intuïtie (solide prior) en wanneer ze die opzij moeten zetten (weinig betrouwbare prior over deze stelling).

## Verliesaversie en de niet-lineaire nutsfunctie

[Daniel Kahneman](https://nl.wikipedia.org/wiki/Daniel_Kahneman) en [Amos Tversky](https://en.wikipedia.org/wiki/Amos_Tversky) toonden in hun *Prospect Theory* (1979) aan dat mensen winsten en verliezen niet symmetrisch behandelen. Een verlies van X wordt ongeveer twee keer zo sterk gevoeld als een gelijkwaardige winst. Dit is **verliesaversie**.

Bij schaken produceert deze asymmetrie systematische vertekeningen:

- Voorkeur voor solide zetten bij gelijkspel of licht voordeel: men beschermt het verworvene.
- Buitensporig risico nemen bij achterstand: men zoekt de wonderzet omdat men "toch al verloren" heeft.
- Weigeren van remiseaanbiedingen in werkelijk gelijke stellingen: remise accepteren wordt gevoeld als een verlies ten opzichte van de verwachting van winst.

Deze asymmetrie is niet strikt irrationeel. Ze weerspiegelt een niet-lineaire nutsfunctie, concaaf bij winsten, convex bij verliezen. Maar ze wijkt af van de wiskundige maximalisatie van verwachte nutswaarde. En deze afwijkingen kosten punten.

Je eigen verliesaversievertekeningen herkennen is de eerste stap om ze te corrigeren. Wanneer je twijfelt tussen een solide zet op +0,3 en een ambitieuze zet met een verwachting van +0,8, vraag jezelf af of je aarzeling voortkomt uit echte onzekerheid over de waarschijnlijkheden, of gewoon uit angst om te verliezen wat je al hebt.

## Begrensde rationaliteit: Simon en satisficing

[Herbert Simon](https://nl.wikipedia.org/wiki/Herbert_Simon), Nobelprijswinnaar economie 1978, toonde aan dat zuivere wiskundige optimalisatie onbereikbaar is voor reële agenten omdat berekening een kost heeft. Hij stelt het concept van **begrensde rationaliteit** (*bounded rationality*) voor en de strategie van **satisficing**: niet het beste zoeken, maar iets voldoende goeds.

Deze intuïtie is centraal bij schaken. Je hebt geen tijd om de wiskundig beste zet te vinden in een complexe stelling. Je zoekt een zet die aan een aanvaardbaar kwaliteitsdrempel voldoet, en je speelt. De gewonnen tijd kan elders dienen: op een ander moment in de partij waar het rendabeler zal zijn.

Simon heeft dit idee zelfs geformaliseerd voor schaken in zijn werk over expertise. Sterke spelers berekenen niet uitputtend: ze gebruiken heuristieken gebaseerd op patroonherkenning (chunk-theorie, zie [schaken en het brein](/fr/blog/les-echecs-et-le-cerveau/)) om de zoekruimte te reduceren tot enkele kandidaatzetten, en analyseren die kandidaten dan met meer diepgang.

Satisficing bij schaken vertaalt zich als volgt:

- **Rustige stelling**: speel de eerste kandidaatzet die je veiligheidscontrole doorstaat (1-2 minuten). Zoek niet verder.
- **Tactische stelling**: ga dieper op 2-3 kandidaten, kies de best beoordeelde van die drie (5-10 minuten).
- **Kritieke stelling**: analyseer de 3-4 kandidaten tot een diepe horizon, accepteer om 15-20 minuten te nemen.

Leren de tijd doseren naargelang de kriticiteit van de stelling is waarschijnlijk het meest onderscheidende criterium tussen gemiddelde spelers en sterke spelers.

## Beslissen onder risico versus onder ambiguïteit: Ellsberg en het Siciliaanse geval

[Daniel Ellsberg](https://en.wikipedia.org/wiki/Daniel_Ellsberg) (dezelfde die de Pentagon Papers openbaar maakte, ja) toonde in zijn proefschrift van 1961 aan dat mensen over het algemeen de voorkeur geven aan keuzes waarbij ze de waarschijnlijkheden *kennen*, zelfs onvolmaakt, boven keuzes waarbij ze in zuivere Knightiaanse onzekerheid verkeren. Dit is de **Ellsberg-paradox**.

Bij schaken verklaart deze paradox een bekende asymmetrie. Stel je voor dat je kiest tussen twee openingen:

- Variant A: je beheerst haar goed, je schat dat je 55% wint tegen spelers van jouw niveau.
- Variant B: je kent haar weinig, je *gelooft* dat ze beter is, misschien 60%, maar je bent niet zeker.

Maximalisatie van de verwachting suggereert B. Maar aversie tegen ambiguïteit duwt naar A. En empirisch is A vaak de juiste keuze: je schattingen over B zijn minder betrouwbaar, dus de 60% heeft een grote variantie eromheen. Informatieveiligheid heeft een waarde.

Deze logica rechtvaardigt bepaalde conservatieve keuzes in het openingsrepertoire, vooral in toernooien met inzet. Ze rechtvaardigt niet het systematisch terugvallen op wat men kent: in training en zonder inzet is uit de ambiguïteitszone stappen precies wat je beheerste risicodomein verbreedt.

## Beslissen met beperkte tijd: de klokfactor

Alle bovenstaande theorieën veronderstellen impliciet een onbeperkte beslistijd. Bij schaken maakt de klok zelf integraal deel uit van het probleem. De vraag is niet alleen "welke zet kiezen?", maar "hoeveel minuten aan deze keuze besteden?".

Economisch gezien is dit een probleem van **marginale waarde van tijd**. Elke extra minuut berekening heeft een afnemend nut: overgaan van 1 naar 2 minuten verbetert je zet aanzienlijk, overgaan van 30 naar 31 minuten bijna niet. En elke minuut besteed aan deze beslissing is een minuut minder voor toekomstige beslissingen.

Een nuttige benadering: verdeel je tijd proportioneel naar de geschatte **kriticiteit** van de stelling, en omgekeerd evenredig aan de **liquiditeit** van toekomstige beslissingen. Meer precies:

- Als je de volgende 5 zetten duidelijk ziet (liquide stelling), besteed weinig tijd aan de huidige zet.
- Als de stelling kritiek maar helder is (één zet wint, je hebt hem gezien), valideer snel en speel.
- Als de stelling kritiek en ambigu is, is dit het moment om te investeren. Dat is zeldzaam: misschien 3 of 4 momenten per partij.

Sterke spelers hebben een instinctieve lezing van deze kritieke zones, die ze leren door duizenden partijen. Voor de anderen een praktische regel: als de evaluatie van je kandidaatzetten meer dan 0,5 varieert tussen hen, bevind je je in een kritieke zone.

## Recognition-primed decision: het model van Klein

[Gary Klein](https://en.wikipedia.org/wiki/Gary_A._Klein), cognitief psycholoog, bestudeerde hoe experts (brandweerlieden, piloten, spoedartsen) beslissingen nemen onder druk en onzekerheid. Zijn model van **recognition-primed decision** (RPD), gepubliceerd in 1998 in *Sources of Power*, beschrijft hoe ze te werk gaan:

1. Herkenning van een patroon in de situatie.
2. Activering van een actie geassocieerd met dat patroon in het expertgeheugen.
3. Snelle mentale simulatie van die actie.
4. Als de simulatie geldig is, onmiddellijke uitvoering. Zo niet, zoeken naar een alternatief patroon.

Dit model beschrijft goed de besluitvorming van grootmeesters in snelle partijen of blitz. Ze gaan niet over tot een uitputtende verkenning: ze herkennen een type stelling, activeren een type plan geassocieerd in het geheugen, simuleren snel, en spelen.

De praktische implicatie voor spelers in ontwikkeling: de kwaliteit van je basis van herkenbare patronen bepaalt de kwaliteit van je beslissingen onder druk. Werken aan typische stellingen, structuren memoriseren, typische eindspelen bestuderen: dat alles bouwt het repertoire op dat je zal dienen in RPD wanneer je geen tijd hebt om te analyseren.

## Het principe van minimale verbintenis

Een onderschat heuristiek in de besliskunde onder onzekerheid is het **principe van minimale verbintenis**: wanneer je het niet weet, houd je opties zo lang mogelijk open.

Bij schaken vertaalt dit principe zich als volgt:

- De voorkeur geven aan een zet die meerdere plausibele plannen behoudt boven een zet die zich definitief op één enkel plan vastlegt.
- Een zet kiezen die de stelling niet sluit als de evaluatie onzeker is.
- Structurele beslissingen (ruilen, offers, kolommen openen) uitstellen zolang de evaluatie ambigu blijft.

Dit principe heeft een kost: je kunt besluiteloos of passief overkomen. Maar in aanwezigheid van reële onzekerheid over de stelling is dit een statistisch winnende strategie. Je krijgt meer informatie zonder de prijs van een voorbarige verbintenis te betalen.

Dit is een principe dat [José Raúl Capablanca](https://nl.wikipedia.org/wiki/Jos%C3%A9_Ra%C3%BAl_Capablanca) systematisch toepaste in het middenspel. In plaats van een beslissing te forceren, verbeterde hij zijn stelling geleidelijk, wachtend tot de tegenstander zich eerst verbond of de stelling duidelijker werd.

## Een beslissingsprotocol in 7 stappen

Om al het voorgaande te integreren in een concrete routine, hier een protocol bruikbaar in een klassieke partij. Het hoeft niet rigide bij elke zet toegepast te worden, maar ingezet te worden in stellingen waarin je voelt dat je "echt moet nadenken".

1. **Tijdskader.** Hoeveel minuten kost me een beslissing van dit belang? Antwoord in minder dan 30 seconden geven. Geef jezelf een budget.

2. **Identificatie van kandidaten.** Drie tot vijf zetten maximaal. Daarboven is je tijd slecht geïnvesteerd in oppervlakkige verkenning. Als je geen duidelijke kandidaten hebt, is dat een teken dat de prior zwak is en je meer op concrete analyse moet steunen.

3. **Snelle evaluatie van elke kandidaat.** Eén tot twee mentale zinnen per kandidaat. Doel: de duidelijk inferieure zetten elimineren.

4. **Identificatie van onzekerheidszones.** Op de overgebleven zetten, wat is de belangrijkste onzekerheid? De uiteindelijke evaluatie? Het precieze vijandelijke antwoord? De gevolgen op lange termijn?

5. **Keuzecriterium.** Geef je de voorkeur aan de hoogste verwachting? Het minst slechte slechtste geval (maximin)? De minimale verbintenis? De keuze van het criterium hangt af van de context (toernooistand, tegenstander, positie in de partij).

6. **Anti-blunder controle.** Voor je speelt, een laatste doorgang: laat je zet een onbedekte vijandelijke dreiging achter? Je controleert schaakjes, slagzetten, vorken, batterijen.

7. **Beslissing.** Je speelt. Je gaat niet terug. De piekering na de zet wordt beheerd door andere mechanismen (zie het default mode netwerk bij schaken).

Dit protocol, toegepast op de 5 of 6 kritieke beslissingen van een partij, kost weinig cumulatieve tijd. Op de niet-kritieke zetten volstaat de ervaring.

**Na het lezen:** identificeer op je laatste partij *een* zet waarbij je koos tussen twee kandidaten zonder duidelijke procedure. Reconstrueer achteraf welk impliciet criterium je hebt gebruikt. Je zou verrast kunnen zijn door het resultaat.
