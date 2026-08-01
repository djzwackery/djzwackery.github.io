#!/usr/bin/env bash
# Resolves ambient-data-push.plist.template's placeholders for this machine
# and installs it.
#
# To run it immediately after installing, use kickstart (load only starts the
# schedule; the agent's already loaded by this script, and re-loading an
# already-loaded agent is a no-op): `launchctl kickstart -k gui/$(id -u)/com.djzwackery.ambient-data-push`
set -euo pipefail
cd "$(dirname "$0")/.."
REPO_DIR="$(pwd)"
LABEL=com.djzwackery.ambient-data-push
DEST="$HOME/Library/LaunchAgents/$LABEL.plist"

mkdir -p "$HOME/Library/LaunchAgents"
sed -e "s#__REPO_DIR__#$REPO_DIR#g" -e "s#__HOME__#$HOME#g" \
  scripts/ambient-data-push.plist.template > "$DEST"

launchctl unload "$DEST" 2>/dev/null || true
launchctl load "$DEST"
echo "Installed and loaded $LABEL from $DEST"
