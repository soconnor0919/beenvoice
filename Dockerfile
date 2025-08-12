FROM oven/bun:1.2.19 as deps
WORKDIR /app

# Install dependencies (only package manifests copied first for better caching)
COPY package.json bun.lock ./
# Install minimal toolchain for native devDependencies (e.g., better-sqlite3) during build
# Minimal toolchain (kept for safety, but we skip dev deps)
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && ln -sf /usr/bin/python3 /usr/bin/python \
  && rm -rf /var/lib/apt/lists/*
# Install all deps (including dev) for build tooling like @tailwindcss/postcss
RUN bun install --frozen-lockfile --verbose

FROM oven/bun:1.2.19 as builder
WORKDIR /app

ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js app (no memory constraints)
RUN bun run build

FROM oven/bun:1.2.19 as runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user and group
RUN addgroup --system --gid 1001 beenvoice \
  && adduser  --system --uid 1001 --ingroup beenvoice beenvoice

# Copy runtime artifacts and install production deps
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock
RUN bun install --frozen-lockfile --production --verbose
COPY --from=builder /app/start.sh ./start.sh
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/src ./src
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/.env.example ./.env.example

RUN chmod +x ./start.sh

USER 1001

EXPOSE 3000

CMD ["./start.sh"]


