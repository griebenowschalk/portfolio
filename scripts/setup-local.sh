#!/usr/bin/env bash
# ============================================================
# Portfolio monorepo — local development setup
# Run once after a fresh clone: bash scripts/setup-local.sh
# ============================================================
set -euo pipefail

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

step() { echo -e "${BOLD}▶ $1${NC}"; }
ok()   { echo -e "${GREEN}  ✓ $1${NC}"; }
warn() { echo -e "${YELLOW}  ⚠ $1${NC}"; }
err()  { echo -e "${RED}  ✗ $1${NC}"; }

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}║   Portfolio — Local Setup             ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""

# ── 1. Node version check ───────────────────────────────────
step "Checking Node.js version"
NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 22 ]; then
  err "Node.js 22+ required (found: $(node -v)). Use nvm: nvm use 22"
  exit 1
fi
ok "Node.js $(node -v)"

# ── 2. .env files ───────────────────────────────────────────
step "Setting up environment files"

# apps/api
if [ ! -f apps/api/.env.development ]; then
  cp apps/api/.env.example apps/api/.env.development
  warn "Created apps/api/.env.development — UPDATE MONGODB_URI, JWT secrets, and AWS keys before running"
else
  ok "apps/api/.env.development already exists"
fi

# apps/web
if [ ! -f apps/web/.env.local ]; then
  cp apps/web/.env.local.example apps/web/.env.local
  ok "Created apps/web/.env.local"
else
  ok "apps/web/.env.local already exists"
fi

# apps/cms
if [ ! -f apps/cms/.env.development ]; then
  printf "VITE_API_URL=http://localhost:5002\n" > apps/cms/.env.development
  ok "Created apps/cms/.env.development"
else
  ok "apps/cms/.env.development already exists"
fi

# ── 3. Install dependencies ─────────────────────────────────
step "Installing npm dependencies (all workspaces)"
npm install
ok "Dependencies installed"

# ── 4. Build shared package ─────────────────────────────────
step "Building @portfolio/shared package"
npm run build --workspace=packages/shared
ok "Shared package built"

# ── 5. Verify MongoDB URI is set ────────────────────────────
step "Checking API configuration"
if grep -q "MONGODB_URI=mongodb+srv://username:password" apps/api/.env.development 2>/dev/null; then
  warn "apps/api/.env.development still has placeholder MONGODB_URI"
  warn "Edit the file and set your real MongoDB Atlas URI, then re-run: npm run seed:api"
  NEEDS_SEED=false
else
  ok "MongoDB URI looks configured"
  NEEDS_SEED=true
fi

# ── 6. Seed (optional) ──────────────────────────────────────
if [ "${1:-}" = "--seed" ] && [ "$NEEDS_SEED" = "true" ]; then
  step "Seeding database"
  npm run seed:api
  ok "Database seeded"
fi

# ── Done ────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}✅  Setup complete!${NC}"
echo ""
echo -e "${BOLD}Start all three apps in parallel:${NC}"
echo "  npm run dev:all"
echo ""
echo -e "${BOLD}Or start individually (3 terminals):${NC}"
echo "  npm run dev:api    → http://localhost:5002"
echo "  npm run dev:web    → http://localhost:3000"
echo "  npm run dev:cms    → http://localhost:5173"
echo ""
echo -e "${BOLD}First time? Run seed after configuring .env.development:${NC}"
echo "  npm run seed:api"
echo ""
echo -e "${BOLD}API docs (Swagger):${NC}"
echo "  http://localhost:5002/api-docs"
echo ""
