# ─── Stage 1: Builder ──────────────────────────────────────────────────────
FROM node:20-alpine AS builder
ENV TZ="Asia/Ho_Chi_Minh"
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ─── Stage 2: Runtime ──────────────────────────────────────────────────────
FROM node:20-alpine
ENV TZ="Asia/Ho_Chi_Minh"
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/server.js"]
