#!/usr/bin/env bash
# Runs on the target server (piped over SSH by the Jenkinsfile).
# Activates an uploaded release with an atomic symlink switch, restarts PM2,
# health-checks the app and rolls back to the previous release on failure.
set -Eeuo pipefail

: "${APP_NAME:?APP_NAME is required}"
: "${DEPLOY_PATH:?DEPLOY_PATH is required}"
: "${RELEASE_ID:?RELEASE_ID is required}"
: "${APP_PORT:=3000}"
: "${KEEP_RELEASES:=5}"
: "${HEALTH_PATH:=/}"
: "${HEALTH_RETRIES:=30}"

RELEASES_DIR="$DEPLOY_PATH/releases"
SHARED_DIR="$DEPLOY_PATH/shared"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_ID"
CURRENT_LINK="$DEPLOY_PATH/current"
HEALTH_URL="http://127.0.0.1:${APP_PORT}${HEALTH_PATH}"

log() { printf '[remote %s] %s\n' "$(date '+%H:%M:%S')" "$*"; }
die() { log "ERROR: $*" >&2; exit 1; }

log "Starting deployment of $RELEASE_ID"

# Non-interactive SSH sessions don't read the login profile; load nvm if present.
# nvm.sh is not safe under `set -euo pipefail` (it returns non-zero, e.g. 3, during
# normal operation), so relax the shell options while loading it.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  saved_opts="$(set +o)"
  set +Eeuo pipefail
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh" --no-use
  nvm use --silent default >/dev/null 2>&1 || nvm use --silent node >/dev/null 2>&1
  eval "$saved_opts"
  log "Loaded nvm (node $(node --version 2>/dev/null || echo 'not found'))"
fi

# Report the failing command instead of exiting silently.
trap 'rc=$?; log "ERROR: \"$BASH_COMMAND\" failed with exit code $rc (line $LINENO)" >&2' ERR

for bin in node npm pm2 curl tar flock; do
  command -v "$bin" >/dev/null 2>&1 || die "'$bin' is not installed on the server"
done

[ -d "$RELEASE_DIR" ] || die "release directory $RELEASE_DIR does not exist"
[ -f "$SHARED_DIR/.env" ] || die "$SHARED_DIR/.env is missing"

# Never let two deployments run against the same server at once.
exec 9>"$DEPLOY_PATH/.deploy.lock"
flock -n 9 || die "another deployment is already in progress"

PREVIOUS_RELEASE="$(readlink -f "$CURRENT_LINK" 2>/dev/null || true)"

switch_to() {
  ln -sfn "$1" "$DEPLOY_PATH/.current.tmp"
  mv -Tf "$DEPLOY_PATH/.current.tmp" "$CURRENT_LINK"
}

pm2_cwd() {
  pm2 jlist 2>/dev/null | node -e '
    let s = "";
    process.stdin.on("data", (d) => (s += d)).on("end", () => {
      try {
        const p = JSON.parse(s).find((x) => x.name === process.argv[1]);
        process.stdout.write(p ? p.pm2_env.pm_cwd || "" : "");
      } catch { /* no processes / unparsable output */ }
    });' "$APP_NAME"
}

restart_app() {
  # A process started outside this pipeline (different cwd) would keep serving
  # the old code after a restart, so recreate it pointing at the symlink.
  local cwd
  cwd="$(pm2_cwd)"
  if [ -n "$cwd" ] && [ "$cwd" != "$CURRENT_LINK" ]; then
    log "PM2 process '$APP_NAME' runs from $cwd; recreating it"
    pm2 delete "$APP_NAME" >/dev/null
  fi
  APP_DIR="$CURRENT_LINK" PORT="$APP_PORT" \
    pm2 startOrRestart "$CURRENT_LINK/ecosystem.config.js" --update-env
  pm2 save >/dev/null
}

health_check() {
  local code i
  for ((i = 1; i <= HEALTH_RETRIES; i++)); do
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$HEALTH_URL" || true)"
    if [[ "$code" =~ ^[23][0-9][0-9]$ ]]; then
      log "Health check passed (HTTP $code) after $i attempt(s)"
      return 0
    fi
    log "Waiting for app... attempt $i/$HEALTH_RETRIES (HTTP ${code:-000})"
    sleep 2
  done
  return 1
}

rollback() {
  log "Deployment of $RELEASE_ID failed"
  if [ -n "$PREVIOUS_RELEASE" ] && [ -d "$PREVIOUS_RELEASE" ] && [ "$PREVIOUS_RELEASE" != "$RELEASE_DIR" ]; then
    log "Rolling back to $(basename "$PREVIOUS_RELEASE")"
    switch_to "$PREVIOUS_RELEASE"
    restart_app
    health_check || log "WARNING: previous release is not healthy either"
  else
    log "No previous release to roll back to"
  fi
  pm2 logs "$APP_NAME" --lines 50 --nostream --raw || true
  rm -rf "$RELEASE_DIR"
  exit 1
}

log "Preparing release $RELEASE_ID"
cd "$RELEASE_DIR"
tar -xzf release.tar.gz
rm -f release.tar.gz
ln -sfn "$SHARED_DIR/.env" .env

# devDependencies are included on purpose: `next start` needs the `typescript`
# package to load next.config.ts, and would otherwise try to install it at boot.
log "Installing dependencies"
npm ci --include=dev --no-audit --no-fund --loglevel=error

log "Activating release"
switch_to "$RELEASE_DIR"
restart_app || rollback
health_check || rollback

log "Pruning old releases (keeping $KEEP_RELEASES)"
ls -1dt "$RELEASES_DIR"/*/ 2>/dev/null | tail -n +"$((KEEP_RELEASES + 1))" | while read -r dir; do
  dir="${dir%/}"
  [ "$dir" = "$RELEASE_DIR" ] && continue
  log "Removing $(basename "$dir")"
  rm -rf "$dir"
done

log "Release $RELEASE_ID is live"
