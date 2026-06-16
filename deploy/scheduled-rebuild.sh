#!/usr/bin/env bash
# Rebuild PLANIFIÉ (publication différée) — force un rebuild même SANS nouveau commit.
#
# POURQUOI : auto-deploy-poll.sh ne reconstruit QUE quand `main` avance. Or un
# article daté en avance (publishDate future) doit apparaître le jour J SANS
# nouveau commit. Avant, c'était le workflow GitHub `scheduled-publish.yml` qui
# poussait un commit-trigger — mais les crons `schedule` de GitHub partent 3 à 6 h
# en retard, voire échouent (ex. run du 8 juin 2026 : conclusion=failure). Ce
# script déplace le déclenchement côté VPS, où cron est exact et fiable.
#
# INSTALLATION (sur le VPS, une fois) :
#   chmod +x /var/www/site/repo/deploy/scheduled-rebuild.sh
#   ( crontab -l 2>/dev/null; \
#     echo "10 5 * * * /var/www/site/repo/deploy/scheduled-rebuild.sh"; \
#     echo "10 7 * * * /var/www/site/repo/deploy/scheduled-rebuild.sh" ) | crontab -
#   # vérif : tail -f /var/www/site/deploy.log
#
# Heures en UTC (TZ du VPS). 05:10 / 07:10 UTC ≈ 06:10 / 08:10 Paris l'hiver,
# 07:10 / 09:10 l'été — deux passes pour couvrir la matinée quelle que soit
# l'heure exacte de publishDate. Ajuste selon ton créneau de publication.
#
# Idempotent : si aucun article n'est nouvellement éligible, le build reproduit le
# même `dist/`, sans effet de bord. Le déploiement effectif reste délégué à
# /usr/local/bin/deploy-site.sh (git pull + build + sert dist/), inchangé.

set -euo pipefail

DEPLOY_CMD="${DEPLOY_CMD:-/usr/local/bin/deploy-site.sh}"
LOG="${DEPLOY_LOG:-/var/www/site/deploy.log}"
LOCK="${DEPLOY_LOCK:-/tmp/blog-deploy.lock}"

log() { echo "$(date -Is) [scheduled] $*" >> "$LOG"; }

# Même verrou que auto-deploy-poll.sh : jamais deux builds concurrents. On ATTEND
# (jusqu'à 5 min) plutôt que de sauter, pour ne pas rater une publication si le
# poll est justement en train de construire à la minute pile du cron.
exec 9>"$LOCK"
if ! flock -w 300 9; then
  log "verrou non obtenu après 5 min — rebuild planifié abandonné"
  exit 1
fi

log "rebuild planifié (publication différée) → déploiement"
if "$DEPLOY_CMD" >> "$LOG" 2>&1; then
  log "rebuild planifié OK"
else
  code=$?
  log "ÉCHEC rebuild planifié (code ${code}) — voir ci-dessus"
  exit "$code"
fi
