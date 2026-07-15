# syntax=docker/dockerfile:1

FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The build never touches the database (no static generation reads from Postgres),
# so no DATABASE_URL is needed at build time — only at runtime and pre-deploy migrate.
RUN npm run build
# Bundles db/migrate.ts + its deps into a single dependency-free JS file, since the
# standalone runtime image below only carries node_modules traced from the Next.js app.
RUN npm run db:bundle-migrate

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
# migrate.js resolves migrations relative to its own __dirname (dist/), so the .sql
# files need to sit alongside the bundled script, not at the repo's db/migrations path.
COPY --from=builder --chown=nextjs:nodejs /app/db/migrations ./dist/migrations

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
