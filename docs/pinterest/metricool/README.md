# Vignettes pixel art via Metricool

Compte : Blog d’un Gaucher (8276044), Pinterest @blogdungaucher.

134 vignettes reprises sans modification des images approuvées. L’épingle sur
l’immigration, déjà publiée, est exclue. Les images sont des JPEG 1200 × 800.
Chaque lien mène à l’article français correspondant avec des paramètres UTM.
Les articles futurs ne sont jamais programmés avant leur date de publication.

Créneaux : lundi et jeudi à 10 h, America/Guadeloupe, du 23 novembre 2026 au
2 mars 2028. La campagne historique conserve mardi, vendredi et dimanche.

`queue.json` est le contenu préparé ; seuls les reçus Metricool et la relecture
du calendrier distant prouvent que la programmation a été acceptée.
`pinterest-pixel-art.csv` est un export de secours au format Pinterest natif,
pas au format Metricool. Ne pas le réimporter après une programmation par API :
cela créerait des doublons.

Les 99 vidéos précédemment vues dans le calendrier Pinterest ne sont pas
recréées dans Metricool. L’API Metricool ne permet pas de contrôler ces
programmations natives ; elle ne prouve pas l’importation des 243 vidéos.

## Résultat contrôlé

Le 22 novembre 2026 à 21:49 UTC, le calendrier distant contient exactement
134 identifiants uniques, tous PENDING, sans brouillon, avec autoPublish activé,
une image hébergée chez Metricool et les titres, descriptions, dates, tableaux
et liens attendus. Voir `receipts.json` et `verification.json`.

Les 20 tests RSS et de migration passent. Les 134 images sont identiques
aux originaux et les 67 semaines contiennent chacune deux nouvelles épingles.
Le flux réserve ces créneaux pour éviter de publier aussi les mêmes nouveaux
articles à leur sortie. Les futurs articles non inclus attendent un créneau
complémentaire libre. Les images de Metricool ont été importées depuis le
commit GitHub immuable f9f0135b8feb170818c9dd72cc8110a06f9d4d03 ;
elles sont aussi déployées sur le domaine du site.
