# Brief de traduction — série « Psychologie » (41 articles)

Document de référence pour la traduction EN et PT-BR des 41 articles de la série.
Toute personne (ou agent) qui traduit un article de la série lit ce fichier d'abord.

---

## 1. Où écrire

### Anglais
- Chemin : `src/content/blog-translations/en/<SLUG-FR>.md`
- **Le nom du fichier est le slug FR**, pas le slug anglais. C'est la clé de résolution
  vers l'article source.
- Le slug anglais visible dans l'URL vit dans le frontmatter, champ `enSlug`.

### Portugais brésilien
- Chemin : `src/content/blog-translations/pt-br/<SLUG-PT-BR>.md`
- **Le nom du fichier est le slug portugais localisé** (convention inverse de l'anglais).
- Le slug FR source vit dans le frontmatter, champ `frSlug`.

---

## 2. Frontmatter

### Anglais

```yaml
---
title: "…"
excerpt: >-
  …
seoTitle: "…"
seoDescription: >-
  …
enSlug: "…"
draft: false
tags:
  - …
faq:
  - question: "…"
    answer: >-
      …
---
```

### Portugais brésilien

```yaml
---
title: "…"
excerpt: >-
  …
seoTitle: "…"
seoDescription: >-
  …
frSlug: <slug-fr>
draft: false
tags:
  - …
faq:
  - question: "…"
    answer: >-
      …
---
```

Règles communes :
- Traduire `title`, `excerpt`, `seoTitle`, `seoDescription`, `tags` et **toutes** les entrées `faq`
  depuis le frontmatter FR. La `faq` est le principal levier SEO/GEO de la série : ne jamais
  l'abréger ni en sauter une question.
- Ne PAS reporter `publishDate`, `category`, `pillar`, `readingTime`, `featured`, `featuredRank` :
  ces champs n'existent pas dans le schéma de traduction et feraient échouer le build.
- `seoTitle` : viser 50-60 caractères. `seoDescription` : 140-160 caractères.
- Les noms propres de tags (Kramnik, Festinger…) restent tels quels ; les tags communs se
  traduisent (`psychologie` → `psychology` / `psicologia`).

---

## 3. Liens internes

Un lien interne garde **toujours le slug FR** dans le chemin, seul le préfixe de langue change :

```
FR      ](/fr/blog/effet-dunning-kruger-aux-echecs/)
EN      ](/en/blog/effet-dunning-kruger-aux-echecs/)
PT-BR   ](/pt-br/blog/effet-dunning-kruger-aux-echecs/)
```

Ne jamais remplacer le slug FR par le slug localisé dans une URL interne : le lien casserait.
Les chemins d'images (`/images/…`) restent identiques.

Les liens Wikipédia externes basculent de langue quand l'article existe :
`fr.wikipedia.org` → `en.wikipedia.org` en anglais, → `pt.wikipedia.org` en portugais.
Si la page n'existe pas dans la langue cible, garder la version anglaise plutôt que la française.
Les liens vers des études, DOI, PDF et sites académiques ne changent pas.

---

## 4. Interdits de forme

- **Aucun tiret cadratin (—) ni tiret demi-cadratin (–) dans le texte.** C'est non négociable :
  c'est la signature typographique n°1 du texte généré. Remplacer par `:` devant une explication,
  par `,` devant une apposition, ou par des parenthèses pour une incise courte.
  Réécrire la phrase si aucune des trois ne passe bien.
- Pas de « In conclusion », « It's worth noting that », « Moreover », « Furthermore »,
  « delve », « landscape », « testament to », « navigate the complexities », « unlock »,
  « game-changer », « robust » en tics de langage. En portugais : pas de « vale ressaltar que »,
  « em suma », « é importante notar », « nesse sentido » à répétition.
- Pas de listes à puces là où le FR fait des paragraphes. La structure du FR fait foi.
- Pas d'emoji, pas de gras décoratif ajouté.

---

## 5. Ce qui fait qu'un texte sonne humain

L'objectif n'est pas une traduction fidèle mot à mot, c'est un article qui se lit comme s'il avait
été écrit dans la langue cible par un joueur d'échecs qui connaît son sujet.

- **Varier la longueur des phrases.** Le FR de ce blog alterne des phrases de 30 mots et des
  phrases de 4 mots. Garder ce rythme. Une phrase courte isolée après un long développement,
  c'est voulu.
- **Garder l'adresse directe au lecteur.** Le FR tutoie (« ton cerveau », « tu perds »).
  En anglais : « you », ton direct, contractions naturelles (*you're*, *don't*, *it's*).
  En portugais brésilien : « você », registre parlé brésilien, pas de « tu » lusitanien.
- **Garder les scènes d'ouverture.** Chaque article de la série ouvre sur une position ou une
  scène de partie, jamais sur une définition. Ne pas « améliorer » ça en résumé introductif.
- **Adapter les exemples culturels** quand la référence est franco-française et perd le lecteur
  cible, sans jamais toucher aux exemples échiquéens ni aux données chiffrées.
- **Ne rien ajouter, ne rien couper.** Pas de section bonus, pas de conclusion synthétique
  supplémentaire. Le nombre de `##` doit correspondre à celui du FR.

---

## 6. Rigueur : ce qui ne bouge JAMAIS

La série vaut par sa rigueur méthodologique. Une erreur de chiffre la détruit.

- Noms d'auteurs, années de publication, revues, tailles d'échantillon, pourcentages, Elo,
  noms de joueurs, dates de tournois : recopiés à l'identique.
- Les titres d'ouvrages et d'articles scientifiques gardent leur langue d'origine, en italique.
  Si le FR donne une traduction entre parenthèses, l'adapter à la langue cible.
- La section `## Sources` en fin d'article se traduit dans son libellé (`## Sources` en anglais,
  `## Fontes` en portugais) mais les références elles-mêmes restent intactes.
- Les termes échiquéens utilisent la terminologie officielle de la langue :
  - EN : *blunder, endgame, opening repertoire, rating, tempo, zugzwang, fork, pin, skewer,
    the exchange, time trouble, draw offer, resign*.
  - PT-BR : *lance, blunder (usuel au Brésil), final, abertura, rating, tempo, zugzwang,
    garfo, cravada, espeto, qualidade, apuros de tempo, oferta de empate, abandonar*.
    Les pièces : rei, dama, torre, bispo, cavalo, peão.

---

## 7. Table des slugs (41 articles)

| # | Slug FR | `enSlug` | Fichier PT-BR |
|---|---|---|---|
| 1 | aversion-a-la-perte-aux-echecs | loss-aversion-in-chess | aversao-a-perda-no-xadrez |
| 2 | biais-d-ancrage-aux-echecs | anchoring-bias-in-chess | vies-de-ancoragem-no-xadrez |
| 3 | biais-de-confirmation-aux-echecs | confirmation-bias-in-chess | vies-de-confirmacao-no-xadrez |
| 4 | biais-du-survivant-aux-echecs | survivorship-bias-in-chess | vies-do-sobrevivente-no-xadrez |
| 5 | comparaison-sociale-aux-echecs | social-comparison-in-chess | comparacao-social-no-xadrez |
| 6 | conditionnement-classique-aux-echecs | classical-conditioning-in-chess | condicionamento-classico-no-xadrez |
| 7 | conditionnement-operant-aux-echecs | operant-conditioning-in-chess | condicionamento-operante-no-xadrez |
| 8 | conformisme-aux-echecs | conformity-in-chess | conformismo-no-xadrez |
| 9 | dissonance-cognitive-aux-echecs | cognitive-dissonance-in-chess | dissonancia-cognitiva-no-xadrez |
| 10 | effet-barnum-aux-echecs | barnum-effect-in-chess | efeito-barnum-no-xadrez |
| 11 | effet-de-halo-aux-echecs | halo-effect-in-chess | efeito-halo-no-xadrez |
| 12 | effet-dunning-kruger-aux-echecs | dunning-kruger-effect-in-chess | efeito-dunning-kruger-no-xadrez |
| 13 | effet-placebo-aux-echecs | placebo-effect-in-chess | efeito-placebo-no-xadrez |
| 14 | effet-spectateur-aux-echecs | bystander-effect-in-chess | efeito-espectador-no-xadrez |
| 15 | faux-souvenirs-aux-echecs | false-memories-in-chess | falsas-memorias-no-xadrez |
| 16 | formation-des-habitudes-aux-echecs | habit-formation-in-chess | formacao-de-habitos-no-xadrez |
| 17 | gaslighting-aux-echecs | gaslighting-in-chess | gaslighting-no-xadrez |
| 18 | gratification-differee-aux-echecs | delayed-gratification-in-chess | gratificacao-adiada-no-xadrez |
| 19 | impuissance-apprise-aux-echecs | learned-helplessness-in-chess | desamparo-aprendido-no-xadrez |
| 20 | intelligence-emotionnelle-aux-echecs | emotional-intelligence-in-chess | inteligencia-emocional-no-xadrez |
| 21 | manipulation-emotionnelle-aux-echecs | emotional-manipulation-in-chess | manipulacao-emocional-no-xadrez |
| 22 | mecanismes-de-defense-aux-echecs | defense-mechanisms-in-chess | mecanismos-de-defesa-no-xadrez |
| 23 | memoire-reconstructive-aux-echecs | reconstructive-memory-in-chess | memoria-reconstrutiva-no-xadrez |
| 24 | motivation-intrinseque-aux-echecs | intrinsic-motivation-in-chess | motivacao-intrinseca-no-xadrez |
| 25 | neuroplasticite-aux-echecs | neuroplasticity-and-chess | neuroplasticidade-e-xadrez |
| 26 | obeissance-a-l-autorite-aux-echecs | obedience-to-authority-in-chess | obediencia-a-autoridade-no-xadrez |
| 27 | paradoxe-du-choix-aux-echecs | paradox-of-choice-in-chess | paradoxo-da-escolha-no-xadrez |
| 28 | pourquoi-ton-cerveau-prefere-avoir-raison | why-your-brain-prefers-being-right | por-que-seu-cerebro-prefere-ter-razao |
| 29 | preuve-sociale-aux-echecs | social-proof-in-chess | prova-social-no-xadrez |
| 30 | projection-aux-echecs | projection-in-chess | projecao-no-xadrez |
| 31 | prophetie-auto-realisatrice-aux-echecs | self-fulfilling-prophecy-in-chess | profecia-autorrealizavel-no-xadrez |
| 32 | psychologie-de-la-persuasion-aux-echecs | psychology-of-persuasion-in-chess | psicologia-da-persuasao-no-xadrez |
| 33 | psychologie-des-foules-aux-echecs | crowd-psychology-in-chess | psicologia-das-multidoes-no-xadrez |
| 34 | psychologie-du-statut-aux-echecs | psychology-of-status-in-chess | psicologia-do-status-no-xadrez |
| 35 | rarete-aux-echecs | scarcity-principle-in-chess | escassez-no-xadrez |
| 36 | rationalisation-aux-echecs | rationalization-in-chess | racionalizacao-no-xadrez |
| 37 | reciprocite-aux-echecs | reciprocity-in-chess | reciprocidade-no-xadrez |
| 38 | stress-chronique-aux-echecs | chronic-stress-in-chess | estresse-cronico-no-xadrez |
| 39 | theorie-auto-determination-aux-echecs | self-determination-theory-in-chess | teoria-da-autodeterminacao-no-xadrez |
| 40 | theorie-de-l-attachement-aux-echecs | attachment-theory-in-chess | teoria-do-apego-no-xadrez |
| 41 | theorie-de-l-esprit-aux-echecs | theory-of-mind-in-chess | teoria-da-mente-no-xadrez |

---

## 8. Vérification avant de rendre

Pour chaque fichier écrit :

1. `grep -n '—\|–' <fichier>` ne renvoie rien.
2. Le nombre de titres `##` correspond au FR.
3. Le nombre d'entrées `faq` correspond au FR.
4. Aucun lien interne ne contient un slug localisé.
5. Aucune phrase française résiduelle.
