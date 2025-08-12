#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." &>/dev/null && pwd)"
cd "${PROJECT_ROOT}"

echo "[setup-env] Project root: ${PROJECT_ROOT}"

ENV_EXAMPLE_FILE="${PROJECT_ROOT}/env.example"
ENV_FILE="${PROJECT_ROOT}/.env"

FORCE=${FORCE:-false}

if [[ ! -f "${ENV_EXAMPLE_FILE}" ]]; then
  echo "[setup-env] ERROR: env.example not found at ${ENV_EXAMPLE_FILE}" >&2
  exit 1
fi

if [[ -f "${ENV_FILE}" && "${FORCE}" != "true" ]]; then
  echo "[setup-env] .env already exists. Set FORCE=true to overwrite. Skipping."
  exit 0
fi

echo "[setup-env] Generating secrets for .env"

GEN_AUTH_SECRET=$(openssl rand -hex 32 2>/dev/null || cat /proc/sys/kernel/random/uuid)
GEN_DB_PASSWORD=$(openssl rand -hex 16 2>/dev/null || cat /proc/sys/kernel/random/uuid)

TMP_FILE=$(mktemp)

sed \
  -e "s/^AUTH_SECRET=__GENERATE__/AUTH_SECRET=${GEN_AUTH_SECRET}/" \
  -e "s/^POSTGRES_PASSWORD=__GENERATE__/POSTGRES_PASSWORD=${GEN_DB_PASSWORD}/" \
  "${ENV_EXAMPLE_FILE}" > "${TMP_FILE}"

mv "${TMP_FILE}" "${ENV_FILE}"

echo "[setup-env] Wrote ${ENV_FILE} with generated AUTH_SECRET and POSTGRES_PASSWORD"
echo "[setup-env] You can edit ${ENV_FILE} to adjust PORT, RESEND_* and other values."

exit 0

#!/usr/bin/env bash

set -euo pipefail

# Resolve project root (directory containing this script's parent)
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." &>/dev/null && pwd)"
cd "${PROJECT_ROOT}"

echo "[setup-env] Project root: ${PROJECT_ROOT}"

ENV_EXAMPLE_FILE="${PROJECT_ROOT}/env.example"
ENV_FILE="${PROJECT_ROOT}/.env"

FORCE=${FORCE:-false}

if [[ ! -f "${ENV_EXAMPLE_FILE}" ]]; then
  echo "[setup-env] ERROR: env.example not found at ${ENV_EXAMPLE_FILE}" >&2
  exit 1
fi

if [[ -f "${ENV_FILE}" && "${FORCE}" != "true" ]]; then
  echo "[setup-env] .env already exists. Set FORCE=true to overwrite. Skipping."
  exit 0
fi

echo "[setup-env] Generating secrets for .env"

# Generate secrets
GEN_AUTH_SECRET=$(openssl rand -hex 32 2>/dev/null || cat /proc/sys/kernel/random/uuid)
GEN_DB_PASSWORD=$(openssl rand -hex 16 2>/dev/null || cat /proc/sys/kernel/random/uuid)

TMP_FILE=$(mktemp)

# Perform replacements
sed \
  -e "s/^AUTH_SECRET=__GENERATE__/AUTH_SECRET=${GEN_AUTH_SECRET}/" \
  -e "s/^POSTGRES_PASSWORD=__GENERATE__/POSTGRES_PASSWORD=${GEN_DB_PASSWORD}/" \
  "${ENV_EXAMPLE_FILE}" > "${TMP_FILE}"

mv "${TMP_FILE}" "${ENV_FILE}"

echo "[setup-env] Wrote ${ENV_FILE} with generated AUTH_SECRET and POSTGRES_PASSWORD"
echo "[setup-env] You can edit ${ENV_FILE} to adjust PORT, RESEND_* and other values."

exit 0


