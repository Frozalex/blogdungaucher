# Corrections de l’audit du 27 octobre 2026

Référence initiale : `2c8f917ccfa847eac500d083738633b39c5cd897`.

## Changements

1. Le poll de déploiement compare le commit distant au dernier **déploiement réussi**, conservé dans `.git/blog-last-deployed`. Le repère est remplacé atomiquement après réussite. Sans repère, le premier passage reconstruit, même si HEAD est déjà à jour. Un échec reste réessayable au passage suivant. `DEPLOY_STATE_FILE` permet un emplacement persistant externe au checkout ; ne pas le placer dans un chemin supprimé par `git clean`.
2. Les inscriptions Web Push valident l’URL, les clés et le point P-256. Seuls `fcm.googleapis.com`, `updates.push.services.mozilla.com`, `web.push.apple.com` et les hôtes `notify.windows.com` / `*.notify.windows.com` (Edge/WNS), en HTTPS sans identifiants ni port spécifique, sont admis. Le contrôle est répété avant envoi, y compris pour les anciens abonnements. Le transport vérifie les adresses DNS lors de la connexion et refuse les réseaux privés/réservés ; il ne suit pas de redirections. Un nouveau fournisseur devra être explicitement ajouté et testé.
3. Le bouton et le panneau utilisent le même module et la même préférence `blogdungaucher.cookieConsent.v1`. Le drapeau historique `push_subscribed=1` est migré une fois. L’activation n’est confirmée qu’après inscription serveur ; la désactivation supprime l’inscription serveur avant celle du navigateur. Une erreur reste visible et permet un nouvel essai. L’ancien gestionnaire de chargement contradictoire et l’inscription ntfy directe sont supprimés.
4. Les diffusions distinguent `sent`, `failed`, `expired`, `invalid` et `skipped`. Concurrence maximale : huit requêtes ; délai absolu par requête : dix secondes ; lancement de nouvelles requêtes pendant vingt secondes au maximum par diffusion. Une diffusion incomplète renvoie 503. Les reçus persistants par notification et endpoint évitent de renvoyer aux destinataires déjà servis lors d’une reprise. Ils couvrent les 200 dernières diffusions ; l’état du dispatcher assure la conservation à long terme.
5. Le dispatcher conserve des listes indépendantes `channels.ntfy` et `channels.push` (version 2). Les succès sont écrits immédiatement et seuls les canaux manquants sont repris. Trois tentatives au maximum sont faites pour les erreurs HTTP temporaires. Les anciens slugs `sent` sont conservés dans les deux canaux pour éviter de rejouer l’historique : leur livraison passée ne peut pas être reconstruite à partir de l’ancien fichier.
6. `DRY_RUN=1`, même associé à `SEED=1`, ne crée ni ne modifie le fichier newsletter et ne contacte pas Brevo. Les envois réels persistent chaque succès ; un échec retourne un statut d’échec. Un état corrompu est refusé, sans réinitialiser le backlog. Avant création, la newsletter recherche une campagne Brevo portant le nom stable `article:<slug>` et réutilise une campagne déjà en file ou envoyée. Une campagne dans un autre statut exige une vérification dans Brevo. Cette protection vise les nouvelles campagnes ; les anciennes campagnes nommées avec le titre ne sont pas automatiquement reconstituées.
7. Le workflow newsletter échoue si les secrets manquent, conserve les succès après échec et reprend un push rejeté après rebase. Les deux workflows conservent aussi un artefact d’état en cas d’échec. Un conflit de rebase provoque un échec visible, sans l’ignorer.
8. Pyodide dispose d’un délai maximal de trente secondes et d’un nouvel essai après échec. La CSP autorise les connexions au seul chemin `https://cdn.jsdelivr.net/pyodide/v0.26.4/full/`. Le navigateur de test a exécuté le visualiseur réel sous cet en-tête.
9. Le verrouillage met à jour Puppeteer et sa chaîne, ainsi que fast-uri, sans changement majeur imposé. Installation reproductible et audit : zéro vulnérabilité pour le site et le proxy au moment de la vérification.
10. Le build Pagefind inclut NL. Le modèle NL expose enfin le corps et le titre à Pagefind. Les contrôles vérifient aussi la présence des index. Les URL erronées des traductions NL ont été corrigées vers les slugs existants, sans réécriture du texte. Le lancement reste au 1er novembre à 06:00 UTC ; la politique Google `INDEXED_LANGS` reste inchangée. La recherche interne peut fonctionner indépendamment du référencement Google.

Le workflow `Validation du site` vérifie installation, tests, Astro, compilation, langues, recherche et liens sur les PR et sur main. Il couvre l’heure actuelle et les deux côtés de la frontière de lancement NL. La protection de branche n’a pas été modifiée : rendre ces contrôles obligatoires reste une décision d’administration du dépôt.

## Vérifications

- 44 tests réussis : les 29 existants et 15 nouveaux cas de fiabilité (reprise de déploiement, simulation, état corrompu, succès partiels, migration, destinations/DNS, délais, concurrence, contrôle navigateur, proxy réel avec transport simulé et chargement Python).
- Contrôle Astro : zéro erreur, zéro warning dans le bilan.
- Build du 27 octobre : 418 fichiers HTML ; index FR/EN/PT-BR ; zéro lien interne mort.
- Juste avant lancement NL : 425 fichiers HTML ; aucun article NL exposé ; trois index ; zéro lien interne mort.
- À l’heure du lancement NL : 507 fichiers HTML ; quatre index ; 73 articles NL recherchables ; 25 541 liens internes contrôlés ; zéro cible morte.
- Navigateur Chrome de test : visualiseur Python à l’étape 2/10 avec la CSP du dépôt ; erreur de notifications affichée dans le panneau lorsque l’activation échoue.
- Export PDF d’un article Grand oral avec Puppeteer corrigé : réussi, 271 973 octets. Le PDF versionné initial a été restauré après l’essai.
- Aucun abonnement, email ou message de notification réel créé pendant ces vérifications.

## Application sur le serveur après validation de la PR

Les fichiers de configuration nginx et les services Docker ne sont pas nécessairement mis à jour par le déploiement statique externe, absent du dépôt. Ces opérations restent à réaliser avec l’accès VPS :

1. Éviter un chevauchement des workflows d’envoi pendant le changement de version du proxy. Conserver les fichiers d’état et le volume `push_data` ; ne pas utiliser `docker compose down -v`.
2. Depuis le checkout mis à jour, recréer le proxy avec `docker compose up -d --build newsletter-proxy`. Le nouveau volume en lecture seule `proxy/push.mjs` est nécessaire. Vérifier `/health` et les journaux de démarrage.
3. Installer `deploy/nginx-headers.conf` à l’emplacement réel du snippet nginx (installation décrite dans ce fichier), puis effectuer `nginx -t` et recharger nginx. Vérifier l’en-tête effectivement servi et le visualiseur Python sur le site.
4. Vérifier un déploiement réussi puis le repère `.git/blog-last-deployed`. Le test d’échec/reprise est automatisé en environnement isolé ; ne pas provoquer volontairement un échec en production.
5. Rétablir les workflows d’envoi et consulter leur bilan par canal. Un run vert prouve la programmation Brevo ou l’acceptation par les services push, pas la lecture par le destinataire. Si un push d’état a échoué, récupérer l’artefact avant une reprise manuelle.

La livraison reste de type « au moins une fois » : une coupure entre l’acceptation externe et l’écriture d’un reçu peut encore provoquer un doublon, notamment pour ntfy. Le nom stable Brevo, les reçus push et la persistance immédiate réduisent ce risque ; ils ne constituent pas une transaction distribuée. Aucun accès VPS ou contrôle de réception dans les boîtes des abonnés n’a été effectué.

Référence de l’API de rapprochement : https://developers.brevo.com/reference/get-email-campaigns

Services Microsoft Edge/WNS : https://learn.microsoft.com/en-us/deployedge/microsoft-edge-browser-policies/forcebuiltinpushmessagingclient ; validation du domaine : https://learn.microsoft.com/en-us/windows/apps/develop/notifications/push-notifications/wns-overview
