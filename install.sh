#!/usr/bin/env bash
set -euo pipefail

if ! command -v bun >/dev/null 2>&1; then
  echo "Bun is required: https://bun.sh/"
  exit 1
fi

bun install
mkdir -p "$HOME/.local/bin"
bun build src/main.ts --compile --outfile "$HOME/.local/bin/nightfall"
echo "Installed $HOME/.local/bin/nightfall"
