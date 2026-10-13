# =======================================
# BUILD STAGE
# =======================================
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

# Try to make install more robust
RUN npm ci --prefer-offline --no-audit --no-fund


COPY . .

ARG NEXT_PUBLIC_APP_ENV
ARG NEXT_PUBLIC_PAGE_SIZE
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_GOOGLE_PLACE_API_KEY
ARG NEXT_PUBLIC_TOKEN
ARG NEXT_PUBLIC_PAGE_SIZES
ARG NEXT_PUBLIC_BASE_PATH

ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_PAGE_SIZE=$NEXT_PUBLIC_PAGE_SIZE
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_PLACE_API_KEY=$NEXT_PUBLIC_GOOGLE_PLACE_API_KEY
ENV NEXT_PUBLIC_TOKEN=$NEXT_PUBLIC_TOKEN
ENV NEXT_PUBLIC_PAGE_SIZES=$NEXT_PUBLIC_PAGE_SIZES
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH

RUN npm run build

# =======================================
# PRODUCTION STAGE
# =======================================
FROM node:20-slim

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/next.config.* ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "server.js"]
