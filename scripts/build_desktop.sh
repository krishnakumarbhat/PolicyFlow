#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

bash "$PROJECT_ROOT/scripts/build_frontend.sh"
pip install -r "$PROJECT_ROOT/backend/requirements.txt" -r "$PROJECT_ROOT/backend/requirements-desktop.txt"
pyinstaller "$PROJECT_ROOT/desktop/pyinstaller/ml_forge.spec" --noconfirm

printf 'Desktop bundle available in %s/dist\n' "$PROJECT_ROOT"