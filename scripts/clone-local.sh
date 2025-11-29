#!/bin/bash

# Function to read a variable from a specific env file
read_env_var() {
  local file="$1"
  local var="$2"
  if [ -f "$file" ]; then
    grep "^$var=" "$file" | cut -d '=' -f2- | tr -d '"' | tr -d "'"
  fi
}

# 1. Get Production URL
# Priority: Argument > .env.production > .env
PROD_DB_URL="$1"

if [ -z "$PROD_DB_URL" ]; then
  echo "Checking .env.production for DATABASE_URL..."
  PROD_DB_URL=$(read_env_var ".env.production" "DATABASE_URL")
fi

if [ -z "$PROD_DB_URL" ]; then
  echo "Checking .env for PROD_DATABASE_URL..."
  PROD_DB_URL=$(read_env_var ".env" "PROD_DATABASE_URL")
fi

if [ -z "$PROD_DB_URL" ]; then
  echo "Error: Could not find production database URL."
  echo "Please provide it as an argument, or set DATABASE_URL in .env.production, or PROD_DATABASE_URL in .env"
  echo "Usage: $0 <PROD_DATABASE_URL>"
  exit 1
fi

# 2. Get Target URL
# Priority: .env.local > .env
TARGET_DB_URL=$(read_env_var ".env.local" "DATABASE_URL")
if [ -z "$TARGET_DB_URL" ]; then TARGET_DB_URL=$(read_env_var ".env" "DATABASE_URL"); fi

if [ -z "$TARGET_DB_URL" ]; then
  echo "Error: Could not find target DATABASE_URL in .env.local or .env"
  exit 1
fi

echo "Configuration:"
echo "  Source: Production (Found in env/arg)"
echo "  Target: $TARGET_DB_URL"
echo
echo "⚠️  WARNING: This will OVERWRITE the target database at the above URL."
echo "This is a one-time migration script."
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo "Cloning database..."

# Pipe pg_dump from a temporary container to another temporary container running psql
# This avoids needing local tools and ensures consistent environment
docker run --rm -i postgres:17-alpine pg_dump "$PROD_DB_URL" \
  --clean --if-exists \
  --no-owner --no-privileges \
  --format=plain \
  | docker run --rm -i postgres:17-alpine psql "$TARGET_DB_URL"

if [ $? -eq 0 ]; then
  echo "✅ Database cloned successfully!"
else
  echo "❌ Database clone failed."
  exit 1
fi
