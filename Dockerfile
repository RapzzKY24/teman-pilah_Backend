FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY prisma/ ./prisma/
COPY tsconfig.json ./
COPY src/ ./src/

RUN npx prisma generate
RUN npm run build

COPY prisma.config.ts ./

FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/tsconfig.json ./
RUN sed -i '/paths/,/}/s|"./src/|"./dist/|g' tsconfig.json
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

RUN mkdir -p /app/uploads

EXPOSE 2000

CMD npx prisma migrate deploy && npx prisma db seed && node -r tsconfig-paths/register dist/server.js
