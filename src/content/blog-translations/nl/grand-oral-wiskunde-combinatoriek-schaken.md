---
title: "Grand Oral onderwerp Wiskunde: In hoeverre vormt het schaakspel een model van combinatorisch denken?"
excerpt: >-
  Volledig uitgeschreven onderwerp voor de Grand Oral, specialisatie Wiskunde (Frans eindexamenvak): het
  vermenigvuldigingsprincipe, het getal van Shannon, telbomen, exponentiële groei. Tekst van 10 minuten, klaar om
  voor te dragen.
seoTitle: "Grand Oral wiskunde combinatoriek schaken: volledige tekst om voor te dragen"
seoDescription: >-
  Grand Oral onderwerp Wiskunde over combinatoriek en schaken, volledig uitgeschreven voor een voordracht van 10
  minuten. Vermenigvuldigingsprincipe, getal van Shannon, telbomen: examenklare tekst.
frSlug: sujet-grand-oral-maths-combinatoire
draft: false
---

> **Wat is de Grand Oral?** Dit is een mondeling eindexamenonderdeel van het Franse baccalauréat, waarbij leerlingen in hun specialisatievak een zelfgekozen onderwerp tien minuten lang moeten presenteren voor een jury. Dit artikel is een volledig uitgeschreven voorbeeldtekst voor het **specialisatievak Wiskunde** in het laatste schooljaar van het Franse voortgezet onderwijs.

Goedendag. Ik ga het hebben over een getal dat me fascineerde toen ik het ontdekte: tien tot de macht honderdtwintig. Dat is het geschatte aantal mogelijke schaakpartijen. Om een idee te geven: dat is meer dan het aantal atomen in het waarneembare heelal, geschat op ongeveer tien tot de macht tachtig.

Het **onderwerp** dat ik ga behandelen is precies: in hoeverre vormt het schaakspel een model van combinatorisch denken? Deze **vraag** interesseert mij omdat ze centraal staat in het **programma van het specialisatievak wiskunde** in het laatste schooljaar: ze gebruikt het **vermenigvuldigingsprincipe**, meetkundige rijen, **telproblemen**, en het begrip exponentiële groei. Het schaakspel is een van de meest spectaculaire voorbeelden om deze abstracte begrippen te illustreren met een concreet object.

Ik ga in drie stappen te werk. Eerst presenteer ik het vermenigvuldigingsprincipe toegepast op een schaakzet en bereken ik het getal van Shannon. Vervolgens laat ik zien hoe dit getal kan worden gemodelleerd als een telboom en hoe het exponentiële groei illustreert. Tot slot bespreek ik de beperkingen van deze combinatorische modellering en de alternatieve benaderingen.

## Het vermenigvuldigingsprincipe en het getal van Shannon

Om het aantal mogelijke schaakpartijen te berekenen, gebruikt men een instrument uit het laatste schooljaar: het **vermenigvuldigingsprincipe**. Als een experiment bestaat uit n opeenvolgende keuzes, en de k-de keuze m_k mogelijkheden biedt, dan is het totale aantal combinaties het product m_1 × m_2 × ... × m_n.

Bij schaken heeft elke speler gemiddeld vijfendertig legale zetten per beurt. Dit getal wordt de **vertakkingsfactor** genoemd, meestal aangeduid met b. Een typische schaakpartij duurt ongeveer tachtig halve zetten, dat wil zeggen veertig zetten per speler. Noem d deze diepte.

Het aantal verschillende partijen is dus, in eerste benadering, b tot de macht d, oftewel vijfendertig tot de macht tachtig. Laten we berekenen: vijfendertig tot de macht tachtig, via de logaritme, geeft tachtig maal de logaritme van vijfendertig, oftewel ongeveer tachtig maal een komma vierenvijftig, dat is ongeveer honderddrieëntwintig komma drie. Men krijgt dus ongeveer tien tot de macht honderddrieëntwintig, traditioneel afgerond naar tien tot de macht honderdtwintig. Dit heet het **getal van Shannon**, berekend door Claude Shannon in negentienhonderdvijftig.

Om een gevoel te geven: dit getal schrijf je met honderdtwintig nullen. Als je aan elke mogelijke partij een zandkorrel zou koppelen, zou je hiermee ons melkwegstelsel vullen. Als je aan elke partij een milliseconde rekentijd zou koppelen, zou de leeftijd van het heelal niet volstaan om ze allemaal op te sommen.

De berekening is wiskundig eenvoudig, maar de fysieke betekenis ervan is diepgaand. Het vermenigvuldigingsprincipe, dat op de middelbare school wordt gebruikt voor triviale voorbeelden (hoeveel outfits met drie hemden en twee broeken), levert hier een getal op dat de menselijke geest niet kan bevatten.

## De telboom en de exponentiële groei

Men kan het getal van Shannon visualiseren als een **telboom**. De wortel is de beginpositie, waar de Witspeler twintig mogelijke zetten heeft. Elk knooppunt vertegenwoordigt een positie, en heeft gemiddeld vijfendertig kinderen, dat zijn de posities die in één zet bereikbaar zijn. De bladeren zijn de eindposities, of de posities bereikt op de vastgestelde analysediepte.

Wiskundig gezien is het aantal knopen op diepte k gelijk aan b tot de macht k. Voor k gelijk aan één: vijfendertig posities. Voor k gelijk aan twee: vijfendertig in het kwadraat, oftewel duizend tweehonderdvijfentwintig. Voor k gelijk aan vier: vijfendertig tot de macht vier, oftewel ongeveer anderhalf miljoen. Dit is precies een **meetkundige rij** met reden b, dat wil zeggen de rij (u_n) gedefinieerd door u_0 = 1 en u_{n+1} = 35 × u_n.

Deze rij illustreert perfect het begrip **exponentiële groei** uit het programma van het laatste schooljaar. De algemene term is u_n = b tot de macht n. De groei ervan is geen intuïtie voor het menselijk brein, dat eerder in lineaire of polynomiale termen denkt. Daarom zijn wiskundige middelen onmisbaar: ze stellen ons in staat te redeneren over objecten die we niet kunnen visualiseren.

De telboom bij schaken heeft een opmerkelijke eigenschap: hij groeit niet lineair met de duur van de partij, hij explodeert. Deze explosie wordt de **combinatorische explosie** genoemd, en het is een van de belangrijkste verschijnselen in toegepaste wiskunde en informatica. Ze komt voor in cryptografie (brute kracht), in biologie (DNA-combinaties), in chemie (moleculaire conformaties), en in alle problemen waarbij men moet zoeken in een zeer grote ruimte.

Voor de jury kan ik een kleine boom met drie niveaus en vertakking drie tekenen (in plaats van vijfendertig, voor de leesbaarheid). Dat geeft een schema met een wortelknoop, drie kinderen, negen kleinkinderen, zevenentwintig achterkleinkinderen. Zelfs met deze verkleinde vertakking overschrijdt men op tien niveaus al vijftigduizend knopen. Op twintig niveaus overschrijdt men drie miljard. De boodschap is helder: exponentiële groei verslaat elke intuïtie.

## Beperkingen van de combinatorische modellering en alternatieve benaderingen

De berekening van het getal van Shannon heeft twee grote beperkingen die eerlijk aan de jury gemeld moeten worden.

Ten eerste gaat het om een **grove schatting**. De vertakkingsfactor varieert per fase van de partij: hij is lager in de opening (ongeveer twintig), hoger in het middenspel (tot veertig), en daalt weer in het eindspel. De gemiddelde diepte varieert ook: sommige partijen duren twintig zetten, andere honderd. Een preciezere schatting, van Allis uit negentienhonderdvierennegentig, geeft eerder tien tot de macht honderddrieëntwintig voor het totale aantal bereikbare posities, en ongeveer tien tot de macht honderdvijfenveertig voor het aantal verschillende partijen. Deze getallen overstijgen nog altijd ruimschoots elk menselijk voorstellingsvermogen.

Ten tweede, en dit is de diepste beperking, zegt het **tellen** ons niets over de **kwaliteit** van de zetten. Posities tellen is evenveel ruis als signaal tellen. De meeste van de tien tot de macht honderdtwintig theoretische partijen zijn absurd: reeksen slechte zetten die geen enkele speler, zelfs geen beginner, zou spelen. Het aantal daadwerkelijk gespeelde partijen in de hele geschiedenis van de mensheid ligt in de orde van tien tot de macht negen, dat is honderdelf ordes van grootte lager. Zuivere combinatoriek meet een potentiële ruimte, geen verkenbare ruimte.

Daarom beperkt de wiskunde van de schaakprestatie zich niet tot combinatoriek. De Elo-rating bijvoorbeeld berust op een probabilistische benadering: men telt niet de mogelijke partijen, men modelleert de winkans tussen twee spelers op basis van het verschil in hun ratings. Deze benadering, van Arpad Elo in de jaren zestig, is complementair aan en niet concurrerend met de combinatoriek. Ze erkent dat men niet alles kan berekenen, en dat men dus moet modelleren wat men niet kan berekenen.

Een andere complementaire benadering is die van de **speltheorie**, met name de **stelling van Zermelo**, gepubliceerd in negentienhonderddertien. Deze stelling bewijst dat elk spel met volledige informatie, zonder toeval, met een eindig aantal zetten (dus schaken) onder perfect spel een vastgesteld resultaat heeft: een van beide spelers wint gedwongen, of de partij eindigt gedwongen in remise. Maar Zermelo zegt ons niet welke. De combinatoriek en de speltheorie komen hier samen: het resultaat is theoretisch vastgesteld, maar de ruimte is te groot om te kunnen berekenen.

## Conclusie

Om mijn oorspronkelijke vraag te beantwoorden: het schaakspel vormt een model van combinatorisch denken om drie redenen. Ten eerste, omdat het de meest spectaculaire toepassing van het vermenigvuldigingsprincipe biedt: vijfendertig zetten per beurt, tachtig halve zetten, geeft tien tot de macht honderdtwintig partijen. Ten tweede, omdat het het begrip exponentiële groei van een meetkundige rij belichaamt, waarvan de snelheid de menselijke intuïtie overstijgt. Tot slot, omdat het de beperkingen van zuivere combinatoriek onthult: mogelijkheden tellen volstaat niet om ze te verkennen, noch om ze te evalueren.

Deze vraag overstijgt het schaken verre. Ze doet zich telkens opnieuw voor wanneer men werkt met een ruimte van grote dimensie: genomica, cryptografie, optimalisatie, wetenschappelijk onderzoek. Telkens zegt de combinatorische telling ons dat de ruimte te groot is om op te sommen, en dwingt ze ons andere benaderingen te bedenken: probabilistisch, heuristisch, algoritmisch. Schaken is misschien maar een spel, maar het is ook een concrete introductie tot een van de grote ideeën van de moderne wiskunde.

Ik dank u voor uw aandacht en ben bereid om uw vragen te beantwoorden.
