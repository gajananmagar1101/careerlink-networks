#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ ! -d "$ROOT_DIR/.run-pids" ]]; then
  echo "No PID directory found."
  exit 0
fi

for pid_file in "$ROOT_DIR"/.run-pids/*.pid; do
  [[ -e "$pid_file" ]] || continue
  pid="$(cat "$pid_file")"
  name="$(basename "$pid_file" .pid)"
  if kill -0 "$pid" >/dev/null 2>&1; then
    echo "Stopping $name ($pid)"
    kill "$pid"
  fi
  rm -f "$pid_file"
done
