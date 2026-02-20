FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Build
RUN npm run build

# Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.medusa ./.medusa
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/medusa-config.ts ./medusa-config.ts
COPY --from=base /app/tsconfig.json ./tsconfig.json
COPY --from=base /app/src ./src

# Railway assigns PORT dynamically
EXPOSE ${PORT:-9000}

CMD ["npx", "medusa", "start"]
