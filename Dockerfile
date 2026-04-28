# syntax=docker/dockerfile:1
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=install /usr/src/app/node_modules node_modules
COPY . .

ENV NODE_ENV=production \
    SKIP_ENV_VALIDATION=1 \
    NODE_OPTIONS=--max-old-space-size=4096 \
    BETTER_AUTH_URL=http://localhost:3000 \
    AUTH_SECRET=docker-build-placeholder-secret-do-not-use \
    DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
RUN bun run build && bun build src/server/db/migrate.ts --target=bun --outfile=migrate.js

FROM base AS release
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=build /usr/src/app/.next/standalone ./
COPY --from=build /usr/src/app/.next/static ./.next/static
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/migrate.js ./migrate.js
COPY --from=build /usr/src/app/drizzle ./drizzle

RUN chmod -R a+rX drizzle migrate.js public

USER bun
EXPOSE 3000
CMD ["sh", "-c", "bun migrate.js && bun server.js"]
