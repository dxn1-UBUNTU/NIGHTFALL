#!/usr/bin/env bash
set -euo pipefail

if ! command -v bun >/dev/null 2>&1; then
  echo "Bun is required: https://bun.sh/"
  exit 1
fi

REPO_URL="https://github.com/dxn1-UBUNTU/NIGHTFALL.git"
DEST="${NIGHTFALL_HOME:-$HOME/.local/share/nightfall}"
BIN_DIR="$HOME/.local/bin"
BIN="$BIN_DIR/nightfall"

if [ ! -f "src/main.ts" ]; then
  echo "NIGHTFALL source not found; cloning into $DEST..."
  mkdir -p "$DEST"
  git clone --depth 1 "$REPO_URL" "$DEST"
  cd "$DEST"
fi

bun install
mkdir -p "$BIN_DIR"
bun build src/main.ts --compile --outfile "$BIN"
echo "Installed $BIN"
echo "Add $BIN_DIR to your PATH if it is not already."
