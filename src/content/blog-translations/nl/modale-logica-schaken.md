---
title: "Modale logica bij schaken: redeneren in 'winnend als...'"
excerpt: >-
  Elke speler redeneert in termen van mogelijkheden en noodzakelijkheden: "hij kan mat forceren",
  "ik moet dit veld verdedigen". Dit type redenering heeft een naam in de formele logica: modale
  logica. En het verandert alles aan hoe je een stelling denkt.
seoTitle: "Modale logica bij schaken: denken in mogelijkheden en noodzakelijkheden"
seoDescription: "Hoe formele modale logica het schaakdenken structureert. Noodzakelijkheid, mogelijkheid, mogelijke werelden: de instrumenten van de logica op het schaakbord."
frSlug: logique-modale-aux-echecs
draft: false
---

Wanneer je een stelling analyseert, denk je niet in termen van zekerheden. Je denkt in termen van mogelijkheden en noodzakelijkheden. "Hij kan daar spelen." "Ik moet dit stuk beschermen." "Als ik deze pion opschuif, is hij gedwongen zo te antwoorden." Deze modale taal, die van het mogelijke en het noodzakelijke, staat centraal in het schaakdenken. En ze correspondeert precies met een formele tak van de logica: de [modale logica](https://nl.wikipedia.org/wiki/Modale_logica).

## Wat is modale logica?

[Modale logica](https://nl.wikipedia.org/wiki/Modale_logica) is een uitbreiding van de klassieke logica die operatoren introduceert voor modaliteiten: wat mogelijk is, wat noodzakelijk is, wat contingent is. De wortels reiken terug tot [Aristoteles](https://nl.wikipedia.org/wiki/Aristoteles), maar de moderne formalisering is het werk van twintigste-eeuwse logici, onder wie [C.I. Lewis](https://nl.wikipedia.org/wiki/C.I._Lewis) en [Saul Kripke](https://nl.wikipedia.org/wiki/Saul_Kripke).

De twee fundamentele operatoren van de modale logica zijn:

- **$\Diamond P$** (diamant): "het is mogelijk dat P waar is"
- **$\Box P$** (vierkant): "het is noodzakelijk dat P waar is" (P is waar in alle toegankelijke werelden)

Deze twee operatoren zijn duaal: $\Diamond P$ is equivalent aan $\neg \Box \neg P$ (P is mogelijk dan en slechts dan als de negatie van P niet noodzakelijk is).

De [semantiek van mogelijke werelden](https://nl.wikipedia.org/wiki/Mogelijke-wereldensemantiek), ontwikkeld door [Saul Kripke](https://nl.wikipedia.org/wiki/Saul_Kripke) in de jaren zestig, biedt het interpretatieve kader: een modale formule wordt geëvalueerd ten opzichte van een verzameling mogelijke werelden en een toegankelijkheidsrelatie daartussen. "Het is mogelijk dat P" betekent dat er een wereld bestaat die vanuit de actuele wereld toegankelijk is, en waarin P waar is.

## De schaakboom als structuur van mogelijke werelden

De variantenboom van een schaakpartij is precies een structuur van mogelijke werelden in Kripke's zin. Elke stelling is een wereld. De toegankelijkheidsrelatie is: "je kunt deze stelling vanuit de andere bereiken met een legale zet."

Vanuit de beginpositie is een immense verzameling werelden (stellingen) toegankelijk. Naarmate de partij vordert, worden sommige werelden ontoegankelijk (de niet-gespeelde partijen), en worden nieuwe werelden toegankelijk (de bereikte stellingen).

### "Winnend als..." in modale logica

De formule "winnend als [voorwaarde]" is een voorwaardelijke modale formule. Ze drukt uit dat in de toegankelijke werelden waar [voorwaarde] geldt, de overwinning noodzakelijk of mogelijk is.

Laten we typische redeneringen ontleden:

**"Ik kan mat in 3 forceren"** correspondeert met $\Diamond \text{mat}(3)$: er bestaat een toegankelijke wereld (een speellijn) waarbij ik in 3 zetten mat geef.

**"Hij is gedwongen zijn pion te verliezen"** correspondeert met $\Box \text{pionverlies}$: in alle toegankelijke werelden voor hem (alle zijn legale zetten) verliest hij zijn pion. Geen enkele verdediging werkt.

**"Als ik daar speel, moet hij zo antwoorden"** correspondeert met een modale implicatie: $\text{zet}_a \Rightarrow \Box_{tegenstander} \text{zet}_b$. Na mijn zet is in alle toegankelijke werelden voor de tegenstander de enige goede zet $\text{zet}_b$.

Deze formele vertaling is niet louter academisch. Ze preciseert wat "forceren" in schaken betekent. Een geforceerde overwinning is een noodzakelijke propositie ($\Box$) in de deelboom van de tegenantwoorden. Een idee dat "kan werken" is een mogelijke propositie ($\Diamond$) in die deelboom.

## Profylactisch redeneren en modale logica

[Tigran Petrosian](https://nl.wikipedia.org/wiki/Tigran_Petrosian) is beroemd om zijn profylactische spel: hij speelde regelmatig zetten die dreigingen van de tegenstander "voorkwamen" voordat die concreet aanwezig waren. Zijn tegenstanders vonden zijn zetten vaak raadselachtig omdat ze niet begrepen wat hij voorkwam.

Profylaxe is rechtstreeks een toepassing van modale logica. Een profylactische zet beantwoordt aan de formule: "als ik deze zet niet speel, is het mogelijk dat [dreiging] zich realiseert in een toekomstig toegankelijke wereld." Door de profylactische zet te spelen maak je deze dreiging ontoegankelijk: je sluit die mogelijke wereld.

Formeel: als $\Diamond_{toekomst} \text{dreiging}$ waar is in de huidige stelling, verandert de profylactische zet de stelling in een stelling waar $\neg \Diamond_{toekomst} \text{dreiging}$ waar is. De zet heeft de structuur van de toekomstige toegankelijke werelden gewijzigd.

### De preventietheorie van Nimzowitsch

[Aaron Nimzowitsch](https://nl.wikipedia.org/wiki/Aron_Nimzowitsch) theoretiseerde het concept van "preventie" in zijn boek *Mijn systeem* (1925). Hij legde uit dat soms de sterkste zet die is welke een dreiging van de tegenstander neutraliseert voordat die reëel wordt, zelfs als die dreiging nog niet onmiddellijk is.

In modale taal zei Nimzowitsch: men moet niet alleen naar actuele dreigingen kijken (de onmiddellijk toegankelijke werelden), maar ook naar potentiële dreigingen (de werelden die na meerdere zetten toegankelijk zijn). Modaal redeneren over mogelijke toekomsten is rijker dan redeneren over onmiddellijke dreigingen.

## De logica van de geforceerde variant

Een geforceerde variant is in modale termen een keten van noodzakelijkheden. Elke zet van de tegenstander is gedwongen: in alle toegankelijke werelden voor hem is er slechts één redelijke zet. De geforceerde variant is dus een propositie van de vorm:

$$\Box_{A}(\text{zet}_1) \Rightarrow \Box_{B}(\text{zet}_2) \Rightarrow \Box_{A}(\text{zet}_3) \Rightarrow \ldots \Rightarrow \text{mat}$$

Een geforceerde variant vinden betekent deze keten van noodzakelijkheden bewijzen. Voor elk antwoord van de tegenstander (elke toegankelijke wereld voor hem) leidt de vervolging onvermijdelijk naar mat. De berekening van mat in n zetten is een verificatie van deze keten bij elke vertakking.

Deze logica verklaart waarom schaakcomposities (problemen met een unieke oplossing) zo intellectueel veeleisend zijn. Ze vereisen de verificatie van een keten van noodzakelijkheden in alle deelbomen van de tegenantwoorden, zonder uitzondering. Één tegenvoetrpoed (een verdedigingszet die werkt in een niet-meegenomen wereld) maakt de hele oplossing ongeldig.

## Zoegtswang en de logica van de verplichting

Een [zoegtswang](https://nl.wikipedia.org/wiki/Zoegtswang) is een stelling waarbij de speler aan zet in een verliezende positie verkeert precies omdat hij verplicht is te zetten. Als deze speler zijn beurt zou kunnen overslaan, zou hij het evenwicht bewaren. Maar de zetverplichting verslechtert zijn positie.

In modale logica is zoegtswang een stelling waarbij:

$$\forall z \in \text{legale\_zetten} : \Box \text{verliezend na } z$$

Met andere woorden: in alle toegankelijke werelden (alle legale zetten) is de stelling verliezend. De speler zit gevangen door modale noodzakelijkheid: hij is noodzakelijkerwijs genoodzaakt te zetten, en alle mogelijke zetten leiden naar verlies.

De wederzijdse zoegtswang (of "afstandszoegtswang") is nog complexer: een stelling waarbij welke partij ook aan zet is, verliest. In modale logica zijn beide richtingen symmetrisch gedwongen. Deze stellingen onthullen de diepste structuur van de spellogica: soms is het bewegen zelf de nederlaag.

## Modale onzekerheid in de praktijk

In praktisch spel wordt modale logica toegepast onder onzekerheid. De speler kan niet alle toegankelijke werelden uitputtend verifiëren; hij moet heuristisch schatten welke mogelijk zijn en welke waarschijnlijk.

Dit onderscheid tussen logische mogelijkheid en praktische waarschijnlijkheid is cruciaal. Een zet kan logisch mogelijk maar praktisch onwaarschijnlijk zijn: de tegenstander kan hem technisch spelen, maar het zou slecht voor hem zijn. Een ervaren speler leert "logisch mogelijke" dreigingen te onderscheiden van "praktisch relevante" dreigingen.

[Michail Botvinnik](https://nl.wikipedia.org/wiki/Michail_Botvinnik) leerde zijn leerlingen systematisch "kandidaatzetten" te zoeken: alvorens te berekenen, alle zetten identificeren die het overwegen waard zijn. Dit is een filterprocedure voor relevante mogelijke werelden. In plaats van de boom uitputtend te verkennen, elimineer je eerst de duidelijk slechte takken.

## Epistemische logica en wat je niet weet

Een belangrijke uitbreiding van modale logica is de [epistemische logica](https://nl.wikipedia.org/wiki/Epistemische_logica), die niet het mogelijke en noodzakelijke in het algemeen behandelt, maar wat actoren weten of niet weten. In schaken is deze dimensie relevant in het kader van openingsvoorbereiding.

Wanneer je een theoretische noviteit voorbereidt, creëer je een epistemische asymmetrie: je weet wat de tegenstander niet weet. In termen van epistemische logica heb je toegang tot mogelijke werelden (de vervolgingen van je voorbereiding) die de tegenstander niet op hetzelfde tempo kan evalueren. Deze asymmetrie van toegang tot mogelijke werelden is een strategisch wapen.

De tactische verrassing berust op dezelfde logica: een zet spelen die de tegenstander niet mogelijk acht ($\neg \Diamond_{tegenstander} \text{zet}$), maar die legaal en sterk is. Stukoffers creëren dikwijls precies deze situatie: de tegenstander had deze mogelijkheid niet als levensvatbaar berekend.

Bij Tata Steel Wijk aan Zee kan men jaarlijks zien hoe topspelers als Anish Giri noviteiten inzetten om precies deze epistemische asymmetrie te creëren: voorbereide werelden die de tegenstander aan het bord moet ontdekken.

## Modaal redeneren en speelniveaus

Het beheersen van modaal redeneren groeit met het speelniveau. De beginner redeneert hoofdzakelijk over onmiddellijke zetten: hij ziet directe dreigingen, slagen in één zet. Zijn modale universum beperkt zich tot de onmiddellijk toegankelijke werelden.

De gemiddelde speler begint over reeksen van 2-3 zetten na te denken. Zijn modale universum strekt zich uit tot de werelden die na enkele overgangen toegankelijk zijn. Hij begint noodzakelijkheid ($\Box$) te begrijpen: sommige zetten zijn gedwongen.

De grootmeester redeneert over langetermijnplannen, pionnenstructuren die zich over 10 tot 15 zetten ontwikkelen, kwalitatieve transformaties van de stelling die pas in het eindspel voelbaar zijn. Zijn modale universum omvat werelden die zeer ver in de boom liggen, bereikbaar via lange zettenketens.

Deze progressie is een progressie in de diepte en rijkdom van modaal redeneren. Het is misschien de meest precieze beschrijving van wat "schaken begrijpen" betekent: toegang hebben tot een breder universum van mogelijke werelden, en er met grotere strengheid over redeneren.

**Na het lezen:** analyseer bij een trainingsopening voor **twee kandidaatzetten** de zin "als ik X speel, in welke **werelden** kom ik terecht op de volgende zet?" voordat je dieper berekent.

---

## Kernpunten

- Modale logica formaliseert redeneren over het **mogelijke en het noodzakelijke**
- In schaken is elke stelling een "mogelijke wereld" in de variantenboom
- "Winnend als..." is een modale formule: de overwinning is **mogelijk (toegankelijk)** in sommige werelden, **noodzakelijk** in andere
- Profylactisch redeneren is een rechtstreekse toepassing van modale logica in de praktijk

### Bronnen en referenties

- **Kripke, S.** [*Semantical Considerations on Modal Logic.*](https://www.jstor.org/stable/20009997) Acta Philosophica Fennica, 16, 83-94, 1963. (De semantiek van mogelijke werelden, fundament van de moderne modale logica.)
- **Lewis, C. I., & Langford, C. H.** *Symbolic Logic.* Dover Publications, 1932. (De eerste formele systemen van modale logica.)
- **Nimzowitsch, A.** *Mijn systeem.* Payot, 1925. (De theorie van profylaxe en preventie bij schaken.)
- **Botvinnik, M.** *Achieving the Aim.* Pergamon Press, 1981. (De methode van kandidaatzetten en het strategisch denken bij schaken.)
- **Hughes, G. E., & Cresswell, M. J.** *An Introduction to Modal Logic.* Methuen, 1968. (Klassieke inleiding tot modale logica en haar toepassingen.)
