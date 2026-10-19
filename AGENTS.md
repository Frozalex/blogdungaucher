# Consignes du projet

## Exigence éditoriale et profondeur des articles

Consigne utilisateur du 19 octobre 2026 : le site est spécialisé et vise des
articles de référence, plus utiles et plus approfondis que les contenus concurrents.
Lire `docs/exigence-editoriale.md` avant toute création ou reprise de fond.
Priorité de reprise confirmée par l’utilisateur : articles déjà publiés, puis
articles programmés.

- Une amélioration technique, SEO ou de lisibilité ne doit pas transformer un
  dossier en résumé. Préserver les explications, démonstrations, exemples,
  objections et applications utiles au lecteur.
- Corriger les affirmations fausses ou non étayées sans les réintroduire pour
  retrouver du volume. Remplacer les passages retirés par des développements
  exacts et sourcés lorsque le sujet le permet.
- Comparer le corps avant et après toute réécriture. Une diminution de plus de
  15 % déclenche une relecture éditoriale et une justification dans le suivi,
  pas une demande automatique d'autorisation. Une consolidation déjà approuvée
  doit être identifiée séparément.
- Vérifier les sources primaires, expliquer leurs résultats et leurs limites,
  puis apporter des exemples échiquéens originaux et contrôlés. Identifier
  explicitement les conseils proposés et les exemples fictifs.
- Exigence explicitement rappelée par l’utilisateur : des sources réelles,
  jamais inventées. Retrouver toute référence ajoutée dans une publication ou
  un catalogue fiable ; ne jamais reconstituer de mémoire un DOI, une citation,
  un effectif ou un résultat. Consigner le lien et le niveau d’accès réel
  (texte intégral, résumé, extrait ou notice), et signaler les accès échoués
  dans le suivi interne sans les présenter comme des lectures intégrales.
- Pour une reprise visant l'excellence, examiner les contenus concurrents
  pertinents et consigner les lacunes que notre article comble réellement.
  Ne pas affirmer être le meilleur sans comparaison documentée.
- Le nombre de mots est un signal de profondeur à examiner, jamais un objectif
  à atteindre avec des répétitions, du remplissage ou des références décoratives.

## Vignettes des articles

La base de vignettes existantes est la référence artistique demandée par l'utilisateur
(consigne du 19 octobre 2026), pour les articles restants et les articles à venir.

Avant de créer ou remplacer une vignette :

- Lire `tools/vignettes/VIGNETTE-SPEC.md` et consulter les prompts de la rubrique.
- Ouvrir plusieurs vignettes existantes, dont une de la même rubrique. Utiliser les
  illustrations maison comme références visuelles lors de la génération, et pas
  uniquement une description textuelle du style.
- Respecter le papier crème, les encres sombres, le grain de sérigraphie, les formes
  simplifiées, l'espace négatif et une métaphore propre au propos de l'article.
- Conserver le code couleur : Science bleu, Esprit ambre, Société vert d'eau,
  Grand oral violet. Aucun texte incrusté dans les nouvelles illustrations.
- Distinguer les illustrations maison des photographies documentaires tierces
  identifiées par `heroImage.sourceUrl` : conserver leurs crédits et leur licence.
  À la demande explicite de l'utilisateur du 19 octobre 2026, toutes les couvertures
  portent le logo du site en filigrane, y compris les photographies. Sur ces dernières,
  le logo identifie le site de publication et ne remplace jamais le crédit de l'auteur.
- Conserver un filigrane déjà présent sans le superposer une seconde fois.
- Livrer les illustrations en 3:2, WebP 1200 × 800, avec le cavalier ajouté par
  `scripts/prepare-vignette.mjs` et le dérivé de partage 1200 × 630.
- Comparer visuellement le résultat aux références à la taille d'une carte avant
  intégration. Une palette correcte seule ne suffit pas à valider le style.

Préserver les vignettes existantes sauf demande de remplacement. Ces consignes
s'appliquent aussi aux futures créations, quel que soit l'outil de génération.

Lors d'une correction éditoriale, conserver les champs `heroImage`, `ogImage` et
`heroImageAlt` tant que l'image correspond au contenu. Ne pas rétablir une image
générique ni retirer ces champs à partir d'une ancienne copie de l'article.
