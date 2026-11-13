# La lettre du Gaucher

## Résultat

Le pied de page et les invitations d’articles présentent désormais le même format : une idée expliquée, une position commentée et une lecture recommandée. La version française est annoncée dans les quatre langues ; aucune cadence d’envoi n’est promise. Les alertes de nouveaux articles restent un format distinct, sans leur inventer trois rubriques. Le message de bienvenue décrit cette distinction et renvoie à l’exemple.

Exemple public : `/fr/lettre/`. La page indique explicitement qu’il s’agit d’un exemple, pas d’un numéro déjà envoyé. L’échiquier et la solution fonctionnent sans JavaScript. La position est une composition pédagogique, sans attribution historique. La lecture proposée renvoie au guide existant `/fr/blog/analyser-ses-parties/`, consulté dans le dépôt. Aucune nouvelle affirmation scientifique ni référence externe n’a été ajoutée.

Les invitations `NewsletterCta` acceptent `category` (`science`, `esprit`, `societe`, `grand-oral`) et adaptent leur accroche. Le parent les intègre aux articles hors Grand oral. L’ancre `#newsletter` du pied de page et les autres modifications existantes ont été préservées.

## Modèle réutilisable, sans envoi

- `src/data/newsletter-example.json` : exemple entièrement rédigé, commun à la page et au modèle email.
- `emails/letter.html` : modèle de lettre distinct de `emails/new-article.html`.
- `scripts/lib/newsletter-letter.mjs` : validation des trois rubriques, des positions et variantes légales, liens HTTPS, échappement du texte pour le HTML.
- `scripts/preview-newsletter.mjs` : produit uniquement deux fichiers locaux, HTML et texte. Aucun accès réseau, variable d’environnement, secret, liste de contacts ou code d’envoi.
- `preview/lettre.html` et `preview/lettre.txt` : exemple généré et consultable localement.

Pour préparer une nouvelle lettre : copier le JSON exemple dans un nouveau fichier, mettre `status` à `draft`, rédiger les trois rubriques et contrôler la position, la source de l’exemple et la lecture. `solutionSan` emploie la notation internationale (`R` = tour), tandis que les libellés visibles sont en français. Le contre-exemple est facultatif, mais sa FEN et sa variante doivent être fournis ensemble.

Commande locale :

```sh
node scripts/preview-newsletter.mjs chemin/lettre.json chemin/nouvel-apercu
```

L’outil refuse les options inconnues et l’écrasement d’un aperçu existant. Le HTML conserve `{{ unsubscribe }}`, à résoudre par le prestataire lors d’un futur envoi autorisé. Il contient un avertissement d’aperçu, à retirer seulement lors d’une préparation à l’envoi séparée et relue. Le contrôle légal des coups ne certifie pas la qualité stratégique d’une explication : celle-ci reste à relire.

## Formulaire et mesure

Le protocole existant d’inscription, le pot de miel et le délai de remplissage sont conservés. Le bouton reste désactivé sans JavaScript, ce qui évite de soumettre une adresse dans l’URL par défaut du navigateur. Les erreurs conservent l’adresse saisie. Le résultat est annoncé dans une zone de statut et reçoit le focus.

L’événement `newsletter_confirmed` est émis uniquement après une réponse HTTP réussie. Il signifie **acceptation par le serveur**, pas double opt-in, propriété de l’adresse, délivrabilité ou réception d’un email. Son seul attribut est un placement autorisé (`footer`, `article`, rubrique d’article ou `letter-example`). Aucun email, URL ou texte saisi n’est transmis à la mesure. Les échecs HTTP/réseau n’émettent rien. Le respect DNT/GPC dépend du helper commun `trackEngagement` existant.

`proxy/newsletter.mjs` : seuls l’objet et les textes/liens du message de bienvenue ont changé. Aucun comportement serveur, filtrage, destinataire ou mécanisme d’envoi n’a été modifié. Le script d’alerte conserve son mécanisme historique ; son identité de campagne `article:<slug>` est conservée pour protéger la déduplication, tandis que sa documentation précise « alerte de publication ».

## Vérification réalisée le 13 novembre 2026

- `node scripts/newsletter.test.mjs` : **6 tests réussis**, position de mat et fuite du contre-exemple, exigences du modèle et variantes légales, échappement et désabonnement, événements après 201/204, absence d’événements après 400/429/500 et erreur réseau, placement filtré.
- TypeScript ciblé (`newsletter-subscription.ts`, `newsletter.ts`) : réussi.
- Compilation Astro ciblée des deux composants, du pied de page et de la page lettre : aucun diagnostic.
- Vérification syntaxique des scripts serveur/alerte : réussie.
- Génération locale de l’aperçu HTML/texte : réussie.
- Toutes les réponses d’inscription des tests sont simulées sur un domaine `.invalid`. **Aucune inscription réelle, aucun email, aucune campagne et aucun appel au prestataire n’ont été effectués.**

## Contrôle visuel confié au parent

1. Ouvrir `/fr/lettre/` à 1440 et 390 px : hiérarchie, trois rubriques, échiquier carré, aucune barre horizontale, variantes FEN qui se replient.
2. Ouvrir la solution au clavier, vérifier le texte descriptif de l’échiquier et les liens vers le guide / l’inscription.
3. Vérifier le pied de page, son ancre `#newsletter`, l’exemple et les invitations contextuelles sur un article de chaque rubrique.
4. Tester seulement une adresse invalide dans l’interface : message clair, focus du champ. Ne pas soumettre d’adresse valide vers le service réel pendant la QA.
5. Contrôler le HTML email local dans le navigateur. Les principaux clients mail et leur rendu des glyphes d’échecs n’ont pas été testés ; la description textuelle complète reste disponible si un glyphe manque. Aucun test de délivrabilité ou d’envoi n’est revendiqué.

La préparation locale est exploitable, mais aucun calendrier éditorial, numéro futur ni automatisation de la lettre n’est mis en service. Les alertes existantes conservent leur cycle propre. Build global et contrôle navigateur relèvent du parent.

Contrôle global final : lettre et formulaire invalide vérifiés sur mobile et ordinateur. Aucun envoi réel. Le texte de bienvenue serveur nécessite le rechargement habituel du service proxy ; son activation ne peut pas être déduite de la publication du site statique.
