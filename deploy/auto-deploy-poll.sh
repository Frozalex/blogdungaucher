#!/usr/bin/env bash
# Déploiement PULL-BASED : le VPS interroge GitHub et déploie quand `main` avance.
#
# POURQUOI : le push SSH GitHub→VPS (ancien deploy.yml) timeoutait en boucle
# (`ssh: connect to host *** port 22: Connection timed out`, route Azure→VPS
# instable). En inversant le sens (le VPS tire), on supprime toute dépendance au
# SSH entrant : le VPS sort vers GitHub (HTTPS), ce qui fonctionne de façon fiable.
#
# INSTALLATION (sur le VPS, une fois) :
#   chmod +x /var/www/site/repo/deploy/auto-deploy-poll.sh
#   # cron toutes les 2 min, pour l'utilisateur qui possède le repo + le webroot :
#   ( crontab -l 2>/dev/null; \
#     echo "*/2 * * * * /var/www/site/repo/deploy/auto-deploy-poll.sh" ) | crontab -
#   # vérif : tail -f /var/www/site/deploy.log
#
# Le déploiement effectif reste délégué à /usr/local/bin/deploy-site.sh (inchangé).

set -euo pipefail

REPO="${REPO:-/var/www/site/repo}"
BRANCH="${BRANCH:-main}"
DEPLOY_CMD="${DEPLOY_CMD:-/usr/local/bin/deploy-site.sh}"
LOG="${DEPLOY_LOG:-/var/www/site/deploy.log}"
LOCK="${DEPLOY_LOCK:-/tmp/blog-deploy.lock}"

log() { echo "$(date -Is) $*" >> "$LOG"; }

# Verrou : empêche deux déploiements concurrents (poll qui se chevauche).
exec 9>"$LOCK"
flock -n 9 || exit 0

cd "$REPO"
git fetch --quiet origin "$BRANCH"
LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/${BRANCH}")"

# Rien de neuf : on sort sans bruit (cas le plus fréquent).
[ "$LOCAL" = "$REMOTE" ] && exit 0

log "nouveau commit ${REMOTE} (local ${LOCAL}) → déploiement"

# ─────────────────────────────────────────────────────────────────────────────
# SYNCHRONISATION FORCÉE de l'arbre de travail sur origin/main AVANT le build.
#
# POURQUOI : deploy-site.sh fait un `git pull`, qui AVORTE dès que l'arbre local
# a la moindre dérive — et c'est précisément ce qui faisait échouer le déploiement
# les jours de publication (artefact de build régénéré dans un chemin suivi,
# bits de permission qui bougent, fins de ligne CRLF, édition manuelle sur le VPS).
# `reset --hard` recale tous les fichiers SUIVIS sur la version GitHub ; `clean -fd`
# retire les fichiers non suivis NON ignorés (ceux qui bloquent un checkout), tout
# en PRÉSERVANT node_modules/, dist/ et les artefacts gitignorés (pas de -x).
# Après ça, le `git pull` de deploy-site.sh ne peut plus que réussir (no-op).
# ─────────────────────────────────────────────────────────────────────────────
git reset --hard "origin/${BRANCH}" >> "$LOG" 2>&1
git clean -fd >> "$LOG" 2>&1

if "$DEPLOY_CMD" >> "$LOG" 2>&1; then
  log "déploiement OK (${REMOTE})"
else
  log "ÉCHEC déploiement (code $?) — voir ci-dessus"
  exit 1
fi
