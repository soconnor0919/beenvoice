#!/usr/bin/env bash

set -euo pipefail

echo "[start.sh] Starting beenvoice in production mode"

# Detect if running inside a Docker container
IS_DOCKER=false
if [ -f /\.dockerenv ]; then
  IS_DOCKER=true
fi

if [ "$IS_DOCKER" = false ]; then
  ## Host mode: prepare env, then run containers
  if [ ! -f ./.env ] && { [ -f ./.env.example ] || [ -f ./env.example ]; }; then
    echo "[start.sh] No .env detected. Creating from env.example with generated secrets..."
    GEN_AUTH_SECRET=$(openssl rand -hex 32 || cat /proc/sys/kernel/random/uuid)
    GEN_DB_PASSWORD=$(openssl rand -hex 16 || cat /proc/sys/kernel/random/uuid)
    tmp_env=$(mktemp)
    ENV_TEMPLATE="./.env.example"
    if [ -f ./env.example ]; then ENV_TEMPLATE="./env.example"; fi
    sed \
      -e "s/^AUTH_SECRET=__GENERATE__/AUTH_SECRET=${GEN_AUTH_SECRET}/" \
      -e "s/^POSTGRES_PASSWORD=__GENERATE__/POSTGRES_PASSWORD=${GEN_DB_PASSWORD}/" \
      "$ENV_TEMPLATE" > "$tmp_env"
    mv "$tmp_env" ./.env
    echo "[start.sh] Created .env. Please review and edit it as needed, then run this script again."
    exit 1
  fi

  # Auto-generate missing placeholders in existing .env
  if [ -f ./.env ]; then
    set -a; . ./.env; set +a
    updated_env=false
    if [ -z "${AUTH_SECRET:-}" ] || grep -qE '^AUTH_SECRET=($|__GENERATE__)' ./.env; then
      new_auth_secret=$(openssl rand -hex 32 || cat /proc/sys/kernel/random/uuid)
      sed -i.bak -e "s/^AUTH_SECRET=.*/AUTH_SECRET=${new_auth_secret}/" ./.env || echo "AUTH_SECRET=${new_auth_secret}" >> ./.env
      updated_env=true
    fi
    if [ -z "${POSTGRES_PASSWORD:-}" ] || grep -qE '^POSTGRES_PASSWORD=($|__GENERATE__)' ./.env; then
      new_db_pw=$(openssl rand -hex 16 || cat /proc/sys/kernel/random/uuid)
      sed -i.bak -e "s/^POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=${new_db_pw}/" ./.env || echo "POSTGRES_PASSWORD=${new_db_pw}" >> ./.env
      updated_env=true
    fi
    if [ "$updated_env" = true ]; then rm -f ./.env.bak || true; fi
  fi

  # Ensure docker is available
  if ! command -v docker >/dev/null 2>&1; then
    echo "[start.sh] ERROR: docker is not installed or not in PATH." >&2
    exit 1
  fi

  echo "[start.sh] Bringing up containers with docker compose..."
  docker compose up -d
  echo "[start.sh] Containers started. View logs with: docker compose logs -f app"
  exit 0
fi

# Container mode: continue to runtime checks and start app

# If .env exists but secrets are missing or placeholders, auto-generate and update file
updated_env=false
if [ -f ./.env ]; then
  if [ -z "${AUTH_SECRET:-}" ] || grep -qE '^AUTH_SECRET=($|__GENERATE__)' ./.env; then
    new_auth_secret=$(openssl rand -hex 32 || cat /proc/sys/kernel/random/uuid)
    sed -i.bak -e "s/^AUTH_SECRET=.*/AUTH_SECRET=${new_auth_secret}/" ./.env || echo "AUTH_SECRET=${new_auth_secret}" >> ./.env
    AUTH_SECRET=${new_auth_secret}
    updated_env=true
  fi
  if [ -z "${POSTGRES_PASSWORD:-}" ] || grep -qE '^POSTGRES_PASSWORD=($|__GENERATE__)' ./.env; then
    new_db_pw=$(openssl rand -hex 16 || cat /proc/sys/kernel/random/uuid)
    sed -i.bak -e "s/^POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=${new_db_pw}/" ./.env || echo "POSTGRES_PASSWORD=${new_db_pw}" >> ./.env
    POSTGRES_PASSWORD=${new_db_pw}
    updated_env=true
  fi
  # Compose DATABASE_URL if missing but POSTGRES_* present
  if [ -z "${DATABASE_URL:-}" ] && [ -n "${POSTGRES_USER:-}" ] && [ -n "${POSTGRES_PASSWORD:-}" ] && [ -n "${POSTGRES_DB:-}" ]; then
    DATABASE_URL="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}"
    echo "DATABASE_URL=${DATABASE_URL}" >> ./.env
    updated_env=true
  fi
  # Reload env if we updated it
  if [ "$updated_env" = true ]; then
    set -a
    # shellcheck disable=SC1091
    . ./.env
    set +a
    rm -f ./.env.bak || true
  fi
fi

# Ensure required env vars are present (fail fast for critical ones)
if [ -z "${DATABASE_URL:-}" ]; then
  echo "[start.sh] ERROR: DATABASE_URL must be set (in .env or environment)." >&2
  exit 1
fi
if [ -z "${AUTH_SECRET:-}" ]; then
  echo "[start.sh] ERROR: AUTH_SECRET must be set (in .env or environment)." >&2
  exit 1
fi
if [ -z "${RESEND_API_KEY:-}" ]; then
  echo "[start.sh] ERROR: RESEND_API_KEY must be set (in .env or environment)." >&2
  exit 1
fi

# Optional: allow skipping migrations with SKIP_DB_MIGRATION=true
SKIP_DB_MIGRATION=${SKIP_DB_MIGRATION:-false}

if [ "$SKIP_DB_MIGRATION" != "true" ]; then
  echo "[start.sh] Applying database migrations (drizzle-kit push via bunx)"
  # Use bunx so we don't need devDependencies inside the container
  SKIP_ENV_VALIDATION=1 bunx -y drizzle-kit@0.30.6 push
else
  echo "[start.sh] Skipping DB migration due to SKIP_DB_MIGRATION=${SKIP_DB_MIGRATION}"
fi

PORT=${PORT:-3000}
HOSTNAME_ENV=${HOSTNAME:-0.0.0.0}

echo "[start.sh] Starting Next.js server on ${HOSTNAME_ENV}:${PORT}"
exec bun run start -p "${PORT}" -H "${HOSTNAME_ENV}"


