# Images locales pour les scènes Motion Canvas

Les scènes peuvent charger des images depuis deux sources :

1. **URLs distantes** (Wikimedia Commons, etc.) : pratique mais dépend de la connexion au moment du rendu, et certaines URLs peuvent poser des problèmes CORS dans le canvas.
2. **Fichiers locaux** dans ce dossier : recommandé pour la production. Référencés depuis les scènes via `/images/nom.jpg` (Vite sert tout le contenu de `public/` à la racine).

## Images recommandées (à télécharger une fois)

| Fichier | Source recommandée | Licence |
| --- | --- | --- |
| `karpov.jpg` | [Wikimedia Commons, Karpov 2010](https://commons.wikimedia.org/wiki/File:Anatoly_Karpov_2010.jpg) | CC BY-SA 3.0 |
| `library.jpg` | [Unsplash search "library" libre de droit](https://unsplash.com/s/photos/library) | Unsplash License |
| `brain-neuron.jpg` | [Wikimedia Commons, Neurons](https://commons.wikimedia.org/wiki/Category:Neurons) | varie, vérifier par image |

**Toujours créditer la source** dans le `<Lower3rd>` du segment où l'image est utilisée.

## Pour télécharger en ligne de commande (Linux/macOS, Git Bash sous Windows)

```bash
cd motion-canvas/public/images
curl -L -o karpov.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Anatoly_Karpov_2010.jpg/640px-Anatoly_Karpov_2010.jpg"
```

## Fallback dans les scènes

Si une image est manquante, la scène doit gracieusement basculer sur un placeholder (rectangle plein couleur rubrique + label texte). Cf. `summary-echecs-et-memoire.tsx` qui utilise ce pattern.
