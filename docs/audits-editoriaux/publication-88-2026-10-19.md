# Publication des 88 reprises éditoriales

Périmètre : 48 articles déjà publiés et 40 articles programmés, depuis la référence de production `c17879b58c5582cd4c06e02baecbc60001b83618`.

Les 88 fichiers de production correspondaient exactement aux copies initiales de la reprise. Les corps passent de 67 730 à 132 000 mots selon le comptage documenté. Le contenu enrichi et les 88 fiches de sources sont intégrés ; les références conservent leur niveau réel d’accès et leurs réserves.

Les champs `heroImage` (dont crédits/licence), `heroImageAlt`, `ogImage`, `publishDate`, `updatedDate`, `draft` et `noindex` sont identiques à la production. Aucun fichier de vignette n’est modifié. Les 176 couvertures et dérivés OG ont leurs empreintes dans [le relevé de conservation](publication-88-preservation-2026-10-19.json).

Les huit PDF Grand oral sont les versions déjà rendues et inspectées, sans nouvelle modification. Leurs empreintes correspondent aux fichiers publics et à la construction.

## Vérifications avant fusion

- 48/48 publiés et 40/40 programmés : corps modifiés, fiches présentes, rendu Markdown/formules, images et liens internes contrôlés sans anomalie.
- Exceptions SEO factuelles limitées aux valeurs précisément consignées dans les manifestes de répartition.
- `npm run check` : zéro erreur, zéro avertissement.
- `npm test` : huit tests réussis.
- `npm run build` : réussi ; 393 pages HTML, 18 802 liens internes vérifiés, aucun lien interne mort.
- Les dates programmées sont conservées ; les 40 routes futures restent absentes de la construction.

Les validations de lot restent dans `validation-parallele-publies-2026-10-19.json` et `validation-parallele-programmes-2026-10-19.json`. La comparaison est reproductible en reconstruisant un dossier de référence depuis le commit de production indiqué, puis en passant ce dossier avec `--baseline` au vérificateur.

La vérification après déploiement porte sur les 48 pages publiques (texte construit, dates, image OG), les 40 routes futures non publiées, les 176 fichiers de vignette/OG, les huit PDF et les index publics. Les résultats effectifs de cette vérification seront conservés dans le rapport de livraison local et le compte rendu de publication.
