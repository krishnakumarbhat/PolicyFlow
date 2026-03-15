#!/usr/bin/env bash
set -euo pipefail

cd /app/frontend
yarn build

mkdir -p /app/backend/static
rm -rf /app/backend/static/*
cp -R /app/frontend/dist/. /app/backend/static/

printf 'Frontend build copied to backend/static\n'