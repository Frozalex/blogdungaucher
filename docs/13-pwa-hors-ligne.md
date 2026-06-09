# 13 — L'application installable et le hors-ligne (PWA)

Le site n'est pas qu'un site : c'est aussi une **PWA**, c'est-à-dire une *Progressive Web App* (« application web progressive »). Ce chapitre explique ce que ça veut dire et comment c'est fait.

## C'est quoi une PWA ?

Une PWA est un site web qui se comporte **comme une application** :
- on peut **l'installer** sur l'écran d'accueil d'un téléphone (ou sur le bureau d'un PC), avec une icône, comme une vraie appli ;
- une fois lancée, elle s'ouvre **en plein écran**, sans la barre d'adresse du navigateur ;
- elle peut fonctionner **(partiellement) hors ligne** ;
- elle peut recevoir des **notifications**.

Le tout **sans passer par un magasin d'applications** (App Store, Play Store). Deux pièces rendent cela possible : le **manifeste** et le **service worker**.

## 1. Le manifeste : `manifest.json`

Le fichier `public/manifest.json` est la **carte d'identité de l'application**. Il dit au système :

- son **nom** (« Blog d'un Gaucher ») et son nom court (« Gaucher ») ;
- sa **description** ;
- ses **icônes** (en plusieurs tailles : 32, 192, 512 pixels, plus une version SVG) ;
- comment l'afficher : **`display: standalone`** (= en plein écran, sans barre de navigateur) ;
- l'**orientation** (portrait) ;
- les **couleurs** : le fond (`#fcfaf6`, le blanc cassé) et la couleur de thème (`#3d8b37`, le vert) ;
- la **langue** (français) et les **catégories** (éducation, sport, divertissement).

C'est ce fichier qui permet au navigateur de proposer « Ajouter à l'écran d'accueil ».

## 2. Le service worker : `sw.js`

Le **service worker** (`public/sw.js`) est la pièce maîtresse. C'est un **petit programme qui tourne en arrière-plan dans le navigateur**, séparé de la page, et qui agit comme un **intermédiaire entre le site et le réseau**. Chaque fois que la page demande quelque chose (une page, une image, une police), le service worker peut **intercepter** la demande et décider : « je sers depuis ma réserve locale (le cache) » ou « je vais chercher sur le réseau ».

> **Image mentale.** Le service worker est un **majordome** posté entre toi et l'extérieur. Quand tu demandes quelque chose, c'est lui qui décide s'il te le donne depuis le placard (rapide, marche hors ligne) ou s'il sort l'acheter (le réseau).

### Le « précache » : ce qui est gardé d'avance
À son installation, le service worker met **immédiatement en réserve** quelques pages et fichiers essentiels (`PRECACHE`) : l'accueil, les pages de rubriques, la page hors-ligne, le manifeste, le logo et les icônes. Ainsi, même si le visiteur n'a jamais ouvert la page « Science », elle reste **atteignable hors ligne**.

### Les stratégies de cache (selon le type de fichier)
Le service worker applique une **stratégie différente** selon ce qui est demandé — c'est tout l'art de la chose :

| Type de fichier | Stratégie | Pourquoi |
|---|---|---|
| **Polices** (`.woff2`…) | *Cache-first* (le cache d'abord) | Elles ne changent jamais : autant les servir instantanément depuis le cache. |
| **CSS/JS d'Astro** (noms avec un code unique) | *Cache-first* | Idem : leur nom change s'ils changent, donc le cache est toujours valide. |
| **Images** | *Stale-while-revalidate* | On sert l'image du cache **immédiatement**, et on va en chercher une version fraîche **en arrière-plan** pour la prochaine fois. Le meilleur des deux mondes : rapide *et* à jour. |
| **Pages HTML** | *Network-first* (le réseau d'abord) | On veut toujours la **version la plus récente** d'une page ; si le réseau échoue, on sert la version en cache ; et en dernier recours, la **page hors-ligne**. |

### La page hors-ligne : `offline.html`
Si le visiteur demande une page jamais visitée alors qu'il n'a **aucune** connexion, le service worker lui sert `public/offline.html` : une page de repli soignée qui explique poliment qu'il faut une connexion, plutôt que l'affreux message d'erreur du navigateur.

### Le nettoyage des vieux caches
Le cache porte un **numéro de version** (`v6`). Quand on publie une nouvelle version du service worker, il **efface automatiquement les anciens caches** pour ne pas servir de vieux contenus. C'est pourquoi, après une grosse mise à jour, on incrémente ce numéro.

## 3. Les notifications push

Le service worker sait aussi **recevoir des notifications** (« Web Push »). Quand un nouvel article paraît, le système **ntfy** (un service de notifications) peut envoyer une notification ; le service worker l'affiche (avec titre, message, icône), et un clic ouvre la bonne page. La configuration (l'adresse du service, la clé de sécurité) est transmise par le gabarit via des variables (`__NTFY_URL__`, etc.).

## Ce que ça donne pour le visiteur

- Il peut **installer** le blog sur son téléphone.
- Les pages déjà visitées s'ouvrent **instantanément**, même dans le métro sans réseau.
- Il peut **recevoir une alerte** à chaque nouvel article (s'il l'a autorisé).
- L'ensemble fonctionne **sans aucun magasin d'applications**.

---

⬅️ Précédent : [12 — La performance](12-performance.md) | ➡️ Suivant : [14 — Les fonctionnalités interactives](14-fonctionnalites-interactives.md)
