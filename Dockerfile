FROM node:22-alpine AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# Build stage
FROM base AS builder
WORKDIR /app

# Dummy values for build - will be overridden at runtime via env vars
ENV SUPABASE_URL=https://placeholder.supabase.co
ENV SUPABASE_KEY=placeholder-key

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Increase Node memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm build

# Production stage
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxt

# Create releases storage directory
RUN mkdir -p /data/releases && chown -R nuxt:nodejs /data/releases

COPY --from=builder /app/.output ./.output

USER nuxt

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
