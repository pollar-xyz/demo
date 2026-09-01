# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable \
  && corepack install --global pnpm@10.13.1 \
  && pnpm config set fetch-retries 5 \
  && pnpm config set fetch-retry-mintimeout 10000 \
  && pnpm config set fetch-retry-maxtimeout 60000
WORKDIR /app

FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are embedded in the browser bundle by Next.js at build
# time. Configure these build arguments in Dokploy, not only as runtime env vars.
ARG NEXT_PUBLIC_PRIVY_APP_ID
ARG NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID
ARG NEXT_PUBLIC_TURNKEY_AUTH_PROXY_CONFIG_ID
ARG NEXT_PUBLIC_TW_API_KEY
ENV NEXT_PUBLIC_PRIVY_APP_ID=$NEXT_PUBLIC_PRIVY_APP_ID
ENV NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID=$NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID
ENV NEXT_PUBLIC_TURNKEY_AUTH_PROXY_CONFIG_ID=$NEXT_PUBLIC_TURNKEY_AUTH_PROXY_CONFIG_ID
ENV NEXT_PUBLIC_TW_API_KEY=$NEXT_PUBLIC_TW_API_KEY
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build
RUN pnpm prune --prod

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["./node_modules/.bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
