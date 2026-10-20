# syntax=docker/dockerfile:1
FROM node:24.17.0-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@11.8.0 --activate
ENV CI=true
WORKDIR /app

FROM base AS builder
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --offline

# NEXT_PUBLIC_* are inlined at build time, so they come in as build args.
ARG NEXT_PUBLIC_POLLAR_BASE_URL
ARG NEXT_PUBLIC_POLLAR_MAINNET_API_KEY
ARG NEXT_PUBLIC_POLLAR_TESTNET_API_KEY
ARG NEXT_PUBLIC_POLLAR_DEFAULT_NETWORK
ARG NEXT_PUBLIC_PRIVY_APP_ID
ARG NEXT_PUBLIC_TW_API_KEY
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:24.17.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3070
ENV HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3070
CMD ["node", "server.js"]
