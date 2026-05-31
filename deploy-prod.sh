#!/bin/bash
# aiFamilyFirst — Phase 1 production deploy on the shared droplet, behind host Caddy.
# Usage: bash ./deploy-prod.sh
#
# Phase 1 is a STATIC DEMO (frontend only, built-in sample data — no real health
# data, no backend, no Gemini/ICM pipeline). Frontend on host 127.0.0.1:3004;
# Caddy reverse-proxies aifamilyfirst.aibuell.com -> there. Idempotent; safe to re-run.
#
# Phase 2 (NOT in this script): the ICM/Gemini backend + real medical data must be
# gated behind auth and stays off the public demo until privacy hardening is done.

set -euo pipefail
cd "$(dirname "$0")"

DOMAIN="aifamilyfirst.aibuell.com"
NET="aifamilyfirst-net"
FE="aifamilyfirst-frontend"
FE_PORT=3004          # host 127.0.0.1:3004 -> container 3000

echo "=== aiFamilyFirst Phase 1 (demo) deploy ==="

# ---------- 1. Network ----------
echo "[1/3] Network"
docker network inspect "$NET" >/dev/null 2>&1 || docker network create "$NET"

# ---------- 2. Frontend image + container ----------
echo "[2/3] Frontend (build + run on :$FE_PORT)"
docker build -t aifamilyfirst-frontend:latest ./frontend
docker rm -f "$FE" >/dev/null 2>&1 || true
docker run -d --name "$FE" --restart always --network "$NET" \
  -p "127.0.0.1:${FE_PORT}:3000" \
  aifamilyfirst-frontend:latest >/dev/null

# ---------- 3. Verify (local) ----------
echo "[3/3] Verify (local host port)"
until curl -sf -o /dev/null "http://127.0.0.1:${FE_PORT}/"; do sleep 1; done
echo "  - frontend HTTP: $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:${FE_PORT}/)"
echo ""
echo "=== container up. Add Caddy block for ${DOMAIN} + DNS A record (Wix) -> 198.199.77.46 ==="
