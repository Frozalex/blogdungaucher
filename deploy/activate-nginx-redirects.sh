#!/usr/bin/env bash
# Active/met à jour les redirections 301 nginx sur le VPS.
# À lancer EN ROOT sur le serveur, depuis le repo déployé :
#   sudo bash /var/www/site/repo/deploy/activate-nginx-redirects.sh
#
# Idempotent : copie le snippet, vérifie la présence de l'include, teste la conf
# puis recharge nginx. N'édite PAS le server block (l'include s'ajoute une fois
# à la main — voir message en bas si absent).

set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/nginx-redirects.conf"
DEST="/etc/nginx/snippets/blog-redirects.conf"
INCLUDE_LINE="include ${DEST};"

if [[ $EUID -ne 0 ]]; then
  echo "❌ Lance ce script en root (sudo)." >&2
  exit 1
fi

if [[ ! -f "$SRC" ]]; then
  echo "❌ Introuvable : $SRC (as-tu bien pull le repo ?)" >&2
  exit 1
fi

mkdir -p /etc/nginx/snippets
cp "$SRC" "$DEST"
echo "✓ Snippet copié → $DEST ($(grep -c 'return 301\|rewrite' "$DEST") règles)"

# L'include est-il présent dans la conf chargée ?
if nginx -T 2>/dev/null | grep -qF "$INCLUDE_LINE"; then
  echo "✓ include déjà présent dans la conf nginx."
else
  cat >&2 <<EOF

⚠️  L'include n'est PAS encore dans ton server block. Ajoute UNE fois, à
    l'intérieur du bloc « server { … } » HTTPS (listen 443) de ton site :

        ${INCLUDE_LINE}

    Trouver le fichier :
        grep -rl "blogdungaucher" /etc/nginx/sites-enabled/ /etc/nginx/conf.d/
    Puis relance ce script.
EOF
  exit 2
fi

# Teste puis recharge.
nginx -t
systemctl reload nginx
echo "✓ nginx rechargé. Vérifie :"
echo "    curl -sI https://blogdungaucher.com/en/blog/echecs-et-femmes/ | grep -i location"
echo "    # attendu : location: /en/blog/chess-and-women/"
