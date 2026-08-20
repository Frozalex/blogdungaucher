#!/usr/bin/env bash
# Corrige le soft-404 nginx : sert dist/404.html avec un VRAI code HTTP 404.
# À lancer EN ROOT sur le serveur, depuis le repo déployé :
#   sudo bash /var/www/site/repo/deploy/activate-nginx-404.sh            # dry-run (défaut)
#   sudo bash /var/www/site/repo/deploy/activate-nginx-404.sh --apply    # applique
#
# Contexte complet du bug et état visé : voir deploy/nginx-404.conf
#
# CE QUE FAIT LE PATCH, dans le server block du site :
#   1. try_files … /index.html;  →  try_files … =404;     (fin du fallback SPA)
#   2. ajoute `error_page 404 /404.html;`                  (si absent)
#   3. ajoute `location = /404.html { internal; }`         (si absent)
#
# Idempotent : relancer ne change rien une fois le patch en place.
# Sûr : dry-run par défaut, sauvegarde horodatée, `nginx -t` avant reload, et
# ROLLBACK automatique si le test de conf échoue.

set -euo pipefail

APPLY=0
OUT=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply)  APPLY=1; shift ;;
    # --out : écrit la conf patchée dans un fichier tiers, sans rien toucher au
    # système (sert aux tests hors-prod : nginx -t, banc d'essai en conteneur…).
    --out)    OUT="${2:?--out attend un chemin}"; shift 2 ;;
    *) echo "❌ Option inconnue : $1 (attendu : --apply | --out FICHIER)" >&2; exit 1 ;;
  esac
done

# Le dry-run se contente de lire la conf : seul --apply exige root.
if [[ $APPLY -eq 1 && $EUID -ne 0 ]]; then
  echo "❌ Lance ce script en root (sudo) pour --apply." >&2
  exit 1
fi

# ── 1. Localiser le server block du site ─────────────────────────────────────
# Surchargeable :  CONF=/chemin/vers/site.conf sudo -E bash activate-nginx-404.sh
CONF="${CONF:-}"

if [[ -z "$CONF" ]]; then
  for candidate in /etc/nginx/sites-available/blogdungaucher.conf \
                   /etc/nginx/sites-enabled/blogdungaucher.conf; do
    [[ -f "$candidate" && ! -L "$candidate" ]] && { CONF="$candidate"; break; }
  done
fi

if [[ -z "$CONF" ]]; then
  # Repli : chercher le fichier qui déclare le server_name, en ignorant les
  # symlinks de sites-enabled (on veut éditer la source dans sites-available).
  mapfile -t found < <(grep -rl --exclude-dir=snippets \
    -E 'server_name[^;]*blogdungaucher' /etc/nginx/ 2>/dev/null \
    | while read -r f; do [[ -L "$f" ]] || echo "$f"; done)
  if [[ ${#found[@]} -eq 1 ]]; then
    CONF="${found[0]}"
  else
    echo "❌ Server block introuvable ou ambigu : ${found[*]:-aucun}" >&2
    echo "   Relance en forçant :  CONF=/chemin/vers/site.conf bash $0 $*" >&2
    exit 1
  fi
fi
[[ -r "$CONF" ]] || { echo "❌ $CONF illisible." >&2; exit 1; }
[[ $APPLY -eq 0 || -w "$CONF" ]] || { echo "❌ $CONF non inscriptible." >&2; exit 1; }
echo "→ Server block : $CONF"

# ── 2. Vérifier que la page 404 est bien déployée ────────────────────────────
WEBROOT="$(grep -oP '^\s*root\s+\K[^;]+' "$CONF" | head -1 | tr -d ' ')"
WEBROOT="${WEBROOT:-/var/www/site/public}"
if [[ -f "$WEBROOT/404.html" ]]; then
  echo "✓ Page 404 présente : $WEBROOT/404.html ($(stat -c%s "$WEBROOT/404.html") octets)"
else
  echo "⚠️  $WEBROOT/404.html ABSENT — les 404 seront servies par la page nginx par"
  echo "    défaut (code correct, mais page moche). Relance un déploiement ensuite."
fi

echo "── État actuel ──"
grep -nE '^\s*(try_files|error_page|root)\b' "$CONF" || echo "  (aucune directive try_files/error_page/root)"

# ── 3. Construire la version patchée ─────────────────────────────────────────
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

perl -e '
my @l = <STDIN>;
my ($fixed_tryfiles, $added_errorpage, $added_location) = (0, 0, 0);

for my $line (@l) {
    # (1) Dernier argument de try_files == /index.html → =404
    if ($line =~ /^(\s*try_files\s+)(.+?)(;\s*)$/) {
        my ($head, $args, $tail) = ($1, $2, $3);
        my @a = split /\s+/, $args;
        if (@a && $a[-1] =~ m{^/?index\.html$}) {
            $a[-1] = "=404";
            $line = $head . join(" ", @a) . $tail;
            $fixed_tryfiles++;
        }
    }
    # (1 bis) Variante : error_page 404 pointant vers l/index (soft-404 aussi)
    if ($line =~ s{^(\s*error_page\s+[^;]*\b404\b[^;]*?)/index\.html(\s*;)}{$1/404.html$2}) {
        $fixed_tryfiles++;
    }
}

my $src = join "", @l;
my $has_errorpage = ($src =~ m{^\s*error_page\s+[^;]*\b404\b[^;]*/404\.html\s*;}m);
my $has_location  = ($src =~ m{^\s*location\s*=\s*/404\.html\s*\{}m);

# (2)(3) Insérer ce qui manque juste après la PREMIÈRE directive `root`
# (elle est dans le server block HTTPS ; le bloc :80 ne fait que rediriger).
if (!$has_errorpage || !$has_location) {
    my $block = "";
    $block .= "\n    # Vraie 404 : page stylée + code HTTP 404 conservé (cf. deploy/nginx-404.conf).\n"
            . "    error_page 404 /404.html;\n" unless $has_errorpage;
    $block .= "\n    # `internal` : /404.html seulement par redirection interne, jamais en 200 direct.\n"
            . "    location = /404.html {\n        internal;\n    }\n" unless $has_location;

    # Point d ancrage : la premiere directive `root` (elle est dans le server
    # block HTTPS ; le bloc :80 ne fait que rediriger). On glisse ensuite au-dela
    # des `index`/lignes vides qui la suivent, pour ne pas couper root/index en deux.
    my $anchor = -1;
    for my $i (0 .. $#l) {
        if ($l[$i] =~ /^\s*root\s+[^;]+;/) { $anchor = $i; last; }
    }
    die "PATCH_FAILED: aucune directive root trouvee, insertion impossible\n" if $anchor < 0;

    while ($anchor + 1 <= $#l && $l[$anchor + 1] =~ /^\s*index\s+[^;]+;\s*$/) {
        $anchor++;
    }

    $l[$anchor] .= $block;
    $added_errorpage = 1 unless $has_errorpage;
    $added_location  = 1 unless $has_location;
}

print @l;
print STDERR "try_files/error_page corriges : $fixed_tryfiles\n";
print STDERR "error_page ajoute : $added_errorpage | location = /404.html ajoute : $added_location\n";
' < "$CONF" > "$TMP"

if [[ -n "$OUT" ]]; then
  cat "$TMP" > "$OUT"
  echo "✓ Conf patchée écrite dans $OUT (système inchangé)."
fi

echo "── Diff proposé ──"
if diff -u "$CONF" "$TMP"; then
  echo "✓ Rien à changer : le correctif est déjà en place (idempotent)."
  exit 0
fi

if [[ $APPLY -eq 0 ]]; then
  echo
  echo "ℹ️  DRY-RUN — rien n'a été modifié."
  echo "    Pour appliquer :  sudo bash $0 --apply"
  exit 0
fi

# ── 4. Appliquer, tester, recharger (rollback si nginx -t échoue) ────────────
BACKUP="${CONF}.bak-$(date +%Y%m%d-%H%M%S)"
cp -p "$CONF" "$BACKUP"
echo "✓ Sauvegarde : $BACKUP"
cat "$TMP" > "$CONF"

if ! nginx -t; then
  cat "$BACKUP" > "$CONF"
  echo "❌ 'nginx -t' a échoué → configuration restaurée depuis $BACKUP. Rien n'a changé." >&2
  exit 1
fi

systemctl reload nginx
echo "✓ nginx rechargé."

# ── 5. Vérification en direct ────────────────────────────────────────────────
echo "── Vérification ──"
check() { # $1 = URL, $2 = code attendu
  local code
  code="$(curl -sS -o /dev/null -w '%{http_code}' "$1")"
  if [[ "$code" == "$2" ]]; then
    echo "  ✓ $2  $1"
  else
    echo "  ✗ attendu $2, reçu $code  →  $1"
    return 1
  fi
}

rc=0
check "https://blogdungaucher.com/fr/" 200 || rc=1
check "https://blogdungaucher.com/fr/blog/url-qui-nexiste-absolument-pas-xyz123/" 404 || rc=1
check "https://blogdungaucher.com/" 301 || rc=1
check "https://blogdungaucher.com/robots.txt" 200 || rc=1

if [[ $rc -ne 0 ]]; then
  echo "⚠️  Une vérification a échoué. Restaurer si besoin :"
  echo "    cp $BACKUP $CONF && nginx -t && systemctl reload nginx"
  exit 1
fi
echo "✓ Tout est conforme : soft-404 corrigé, apex et pages publiées intacts."
