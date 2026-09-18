---
title: "Grand Oral onderwerp Wiskunde: Waarom bewijst de wiskunde dat schaken nooit door brute kracht opgelost zal worden?"
excerpt: >-
  Volledig uitgeschreven onderwerp voor de Grand Oral, specialisatie Wiskunde (Frans eindexamenvak): de stelling van
  Zermelo, algoritmische complexiteit, brute kracht, fysieke grenzen van rekenkracht. Tekst van 10 minuten, klaar om
  voor te dragen.
seoTitle: "Grand Oral wiskunde Zermelo en complexiteit schaken: volledige tekst om voor te dragen"
seoDescription: >-
  Grand Oral onderwerp Wiskunde over de stelling van Zermelo en complexiteit, volledig uitgeschreven voor 10 minuten.
  Brute kracht, perfect spel, fysieke grenzen: examenklare tekst.
frSlug: sujet-grand-oral-maths-zermelo-complexite
draft: false
---

> **Wat is de Grand Oral?** Dit is een mondeling eindexamenonderdeel van het Franse baccalauréat, waarbij leerlingen in hun specialisatievak een zelfgekozen onderwerp tien minuten lang moeten presenteren voor een jury. Dit artikel is een volledig uitgeschreven voorbeeldtekst voor het **specialisatievak Wiskunde** in het laatste schooljaar van het Franse voortgezet onderwijs.

Goedendag. Ik ga u een paradox voorleggen die mij intrigeerde: we weten dat schaken een wiskundig vastgesteld resultaat heeft, en toch zullen we het waarschijnlijk nooit kennen. Dat is een paradox uit de zuivere wiskunde die raakt aan de fysieke grenzen van rekenkracht.

Het **onderwerp** is precies: waarom bewijst de wiskunde dat schaken nooit door brute kracht opgelost zal worden? Deze vraag interesseert mij omdat ze meerdere begrippen uit het programma van het specialisatievak wiskunde in het laatste schooljaar gebruikt: **algoritmische complexiteit**, exponentiële groei, en dieper nog het idee dat een wiskundig object theoretisch gedefinieerd maar praktisch ontoegankelijk kan zijn.

Ik ga in drie stappen te werk. Eerst presenteer ik de stelling van Zermelo, die bewijst dat schaken onder perfect spel een vastgesteld resultaat heeft. Vervolgens bespreek ik de combinatorische complexiteit van het spel en de berekening van het getal van Shannon. Tot slot confronteer ik dit getal met de fysieke grenzen van rekenkracht om te concluderen dat brute kracht niet alleen onpraktisch, maar fysiek onmogelijk is.

## De stelling van Zermelo: een resultaat bestaat

Laten we beginnen met een resultaat uit de zuivere wiskunde, bewezen door Ernst Zermelo in negentienhonderddertien, ter gelegenheid van het vijfde Internationale Congres van Wiskundigen. De stelling luidt als volgt: elk eindig spel voor twee spelers, met volledige informatie en zonder toeval, heeft onder perfect spel een vastgesteld resultaat.

Laten we de aannames preciseren. **Eindig spel**: de partij eindigt in een eindig aantal zetten. Dat klopt bij schaken, dankzij de vijftig-zettenregel en de drievoudige zetherhaling. **Twee spelers**: wit en zwart, die elkaar afwisselen. **Volledige informatie**: elke speler ziet de volledige stelling; er is geen verborgen kaart zoals bij pokeren. **Zonder toeval**: geen dobbelsteen, geen willekeurige trekking.

Onder deze aannames bewijst Zermelo door middel van recursie op de diepte van de spelboom dat een van deze drie gevallen onvermijdelijk is: hetzij hebben de witten een winnende strategie, hetzij hebben de zwarten een winnende strategie, hetzij hebben beide een remisestrategie. Dit resultaat is buitengewoon sterk. Het betekent dat schaken deterministisch is: bij perfect spel van beide kanten eindigt de partij altijd op dezelfde manier, ongeacht het gevolgde scenario.

De schoonheid van de stelling is dat het om een bestaansresultaat gaat. Zermelo zegt ons niet wat dit resultaat is. Hij bewijst alleen dat het bestaat. Voor schaken weten we niet of de beginpositie winnend is voor wit, winnend voor zwart, of remise. De meest gedeelde vermoeden is dat het remise is, maar dat is niet bewezen.

Dit resultaat is vergelijkbaar met veel bestaansstellingen in de wiskunde: men bewijst dat een object bestaat zonder het te kunnen construeren. Dat is bijvoorbeeld het geval bij de tussenwaardestelling, die het bestaan van een oplossing van een continue vergelijking bewijst zonder die oplossing te geven. Zermelo geeft ons niet de oplossing van het schaakspel, hij zegt ons alleen dat die bestaat.

## De combinatorische complexiteit: een berekening die explodeert

Als we weten dat de oplossing bestaat, waarom berekenen we haar dan niet? Het antwoord zit in één woord: **complexiteit**.

Om schaken door brute kracht op te lossen, zou men de volledige spelboom moeten construeren en analyseren met minimax. Bij elke beurt heeft elke speler gemiddeld vijfendertig zetten. Een partij duurt ongeveer tachtig halve zetten. Volgens het vermenigvuldigingsprincipe is het aantal mogelijke partijen van de orde van vijfendertig tot de macht tachtig. De berekening geeft ongeveer tien tot de macht honderdtwintig. Dat is het **getal van Shannon**, berekend door Claude Shannon in negentienhonderdvijftig.

Ter vergelijking: het aantal atomen in het waarneembare heelal wordt geschat op tien tot de macht tachtig. Het getal van Shannon is dus tien tot de macht veertig keer groter. Als men elke schaakpartij aan een atoom zou koppelen, zouden er tien tot de macht veertig heelallen nodig zijn om ze allemaal te bevatten.

In grote-O-notatie is de complexiteit van brute kracht O(b tot de macht d), waarbij b de vertakkingsfactor is en d de diepte. Dat is een **exponentiële complexiteit**. Deze complexiteitsklasse, uit het programma van het laatste schooljaar, is de slechtste die men kan tegenkomen bij het analyseren van een algoritme: ze verslaat ruimschoots de polynomiale complexiteit, en maakt de berekening onpraktisch zodra de omvang van het probleem enkele tientallen overschrijdt.

Om dit in perspectief te plaatsen, vergelijken we met andere opgeloste spellen. Boter-kaas-en-eieren heeft een boom van ongeveer vijfduizend posities, triviaal opgelost. Vier-op-een-rij heeft zevenduizend miljard posities, opgelost in negentienhonderdachtentachtig: wit wint altijd bij perfect spel. Dammen heeft ongeveer tien tot de macht twintig posities, opgelost in tweeduizendzeven door Jonathan Schaeffer na achttien jaar rekenen: het is remise bij perfect spel. Schaken, met tien tot de macht honderdtwintig, ligt vijftig ordes van grootte boven dammen. Geen enkele redelijke extrapolatie laat toe om de oplossing ervan voor te stellen.

## De fysieke grenzen van rekenkracht

Maar misschien zou men in de toekomst, met veel krachtigere computers, wel kunnen rekenen? Het wiskundige antwoord is nee, om fysieke redenen.

De natuurkundige Hans Bremermann berekende in de jaren zestig een fundamentele theoretische grens, genaamd de **Bremermann-limiet**. Deze luidt: geen enkele klassieke computer kan meer dan mc² gedeeld door h bewerkingen per seconde per kilogram uitvoeren, waarbij m de massa is, c de lichtsnelheid, en h de constante van Planck. De berekening geeft ongeveer twee tot de macht vierenzestig bewerkingen per gram per seconde.

Op basis van deze grens kan men schatten hoeveel bewerkingen zouden kunnen worden uitgevoerd door een computer ter grootte van de aarde, werkend gedurende de leeftijd van het heelal. Het resultaat is van de orde van tien tot de macht drieënnegentig bewerkingen. Dat is zevenentwintig ordes van grootte onder het getal van Shannon.

Met andere woorden, zelfs als men de hele aarde tot computer zou omvormen, en die vanaf de oerknal tot vandaag zou laten draaien, zou men niet genoeg bewerkingen hebben uitgevoerd om de schaakboom door brute kracht te doorzoeken. Dat is een fysieke grens, geen technologische grens: geen enkele vooruitgang zal daar iets aan veranderen.

Deze grens is wat de wiskunde van AlphaZero zo treffend maakt. In plaats van de boom exhaustief te doorzoeken, leert AlphaZero goede posities te herkennen via een neuraal netwerk. Het speelt op menselijk niveau niet door meer te berekenen, maar door anders te berekenen. Dat is een pragmatisch antwoord op de stelling van Zermelo: de oplossing bestaat in theorie, maar is praktisch ontoegankelijk; dus bouwt men benaderingen die goed genoeg werken.

Dit idee komt terug in alle toegepaste wiskunde. In cryptografie beschermt men data door gebruik te maken van problemen waarvan de oplossing bestaat maar miljarden jaren zou vergen. In optimalisatie aanvaardt men suboptimale oplossingen omdat de optimale oplossing ontoegankelijk is. In statistiek werkt men met benaderende schatters omdat de werkelijke waarde onbekend is. De wiskunde van de complexiteit zegt ons niet alleen wat we kunnen berekenen: ze zegt ons wat we nooit zullen kunnen berekenen.

## Conclusie

Om mijn oorspronkelijke vraag te beantwoorden: de wiskunde bewijst dat schaken nooit door brute kracht opgelost zal worden, om drie samenhangende redenen. Ten eerste zegt de stelling van Zermelo ons dat het resultaat bestaat, maar geeft het ons niet. Ten tweede overstijgt het getal van Shannon, tien tot de macht honderdtwintig, elke denkbare opslag- en rekencapaciteit. Tot slot legt de Bremermann-limiet een fysieke grens vast waar geen enkele klassieke computer voorbij kan, en deze grens is ruim onvoldoende voor schaken.

De diepste opening is dat deze onmogelijkheid geen mislukking van de wiskunde is: het is haar succes. Wiskunde beschermt ons niet tegen moeilijke problemen, ze zegt ons precies wat we wel en niet kunnen doen. Het kennen van de grens is op zich al een vorm van intellectuele overwinning. En precies omdat we deze grens kennen, hebben we de alternatieve benaderingen uitgevonden, van symbolische engines tot neurale netwerken. Schaken is, door zijn weerstand tegen oplossing, een motor geweest van de toegepaste wiskunde van de twintigste eeuw.

Ik dank u voor uw aandacht en ben bereid om uw vragen te beantwoorden.
