# syntax=docker/dockerfile:1
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID=
ARG NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://analytics.umami.is/script.js
ARG NEXT_PUBLIC_AUTHENTIK_ENABLED=false
ARG NEXT_PUBLIC_BRAND_NAME=beenvoice
ARG NEXT_PUBLIC_BRAND_TAGLINE="Simple and efficient invoicing for freelancers and small businesses"
ARG NEXT_PUBLIC_BRAND_LOGO_TEXT=beenvoice
ARG NEXT_PUBLIC_BRAND_ICON=$
ARG NEXT_PUBLIC_DEFAULT_INTERFACE_THEME=beenvoice
ARG NEXT_PUBLIC_DEFAULT_FONT=brand
ARG NEXT_PUBLIC_DEFAULT_BODY_FONT=brand
ARG NEXT_PUBLIC_DEFAULT_HEADING_FONT=brand
ARG NEXT_PUBLIC_DEFAULT_RADIUS=xl
ARG NEXT_PUBLIC_DEFAULT_SIDEBAR_STYLE=floating

ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1
ENV NODE_OPTIONS=--max-old-space-size=4096
ENV BETTER_AUTH_URL=http://localhost:3000
ENV AUTH_SECRET=docker-build-placeholder-secret-do-not-use
ENV DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID=$NEXT_PUBLIC_UMAMI_WEBSITE_ID
ENV NEXT_PUBLIC_UMAMI_SCRIPT_URL=$NEXT_PUBLIC_UMAMI_SCRIPT_URL
ENV NEXT_PUBLIC_AUTHENTIK_ENABLED=$NEXT_PUBLIC_AUTHENTIK_ENABLED
ENV NEXT_PUBLIC_BRAND_NAME=$NEXT_PUBLIC_BRAND_NAME
ENV NEXT_PUBLIC_BRAND_TAGLINE=$NEXT_PUBLIC_BRAND_TAGLINE
ENV NEXT_PUBLIC_BRAND_LOGO_TEXT=$NEXT_PUBLIC_BRAND_LOGO_TEXT
ENV NEXT_PUBLIC_BRAND_ICON=$NEXT_PUBLIC_BRAND_ICON
ENV NEXT_PUBLIC_DEFAULT_INTERFACE_THEME=$NEXT_PUBLIC_DEFAULT_INTERFACE_THEME
ENV NEXT_PUBLIC_DEFAULT_FONT=$NEXT_PUBLIC_DEFAULT_FONT
ENV NEXT_PUBLIC_DEFAULT_BODY_FONT=$NEXT_PUBLIC_DEFAULT_BODY_FONT
ENV NEXT_PUBLIC_DEFAULT_HEADING_FONT=$NEXT_PUBLIC_DEFAULT_HEADING_FONT
ENV NEXT_PUBLIC_DEFAULT_RADIUS=$NEXT_PUBLIC_DEFAULT_RADIUS
ENV NEXT_PUBLIC_DEFAULT_SIDEBAR_STYLE=$NEXT_PUBLIC_DEFAULT_SIDEBAR_STYLE
RUN bun run build

FROM base AS release
ENV NODE_ENV=production

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/src/server/db/migrate.ts ./src/server/db/migrate.ts
COPY --from=build /usr/src/app/drizzle ./drizzle

RUN chown -R bun:bun /usr/src/app

USER bun
EXPOSE 3000
CMD ["bun", "run", "start", "-p", "3000", "-H", "0.0.0.0"]
