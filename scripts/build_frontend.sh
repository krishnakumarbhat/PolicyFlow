#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$PROJECT_ROOT/frontend"
npm run build

mkdir -p "$PROJECT_ROOT/backend/static"
rm -rf "$PROJECT_ROOT/backend/static"/*
cp -R "$PROJECT_ROOT/frontend/dist/." "$PROJECT_ROOT/backend/static/"

printf 'Frontend build copied to backend/static\n'