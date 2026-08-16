# ── Build ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .

# Variable d'environnement pour le build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# ── Runtime ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app

RUN addgroup -S avisaas && adduser -S avisaas -G avisaas

COPY --from=build --chown=avisaas:avisaas /app/.next/standalone ./
COPY --from=build --chown=avisaas:avisaas /app/.next/static ./.next/static
COPY --from=build --chown=avisaas:avisaas /app/public ./public

USER avisaas
EXPOSE 3000

CMD ["node", "server.js"]