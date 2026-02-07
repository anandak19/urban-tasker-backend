# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all deps (needed to build)
RUN npm ci

# Copy source
COPY . .

# Build NestJS app
RUN npm run build


# ---------- Runtime stage ----------
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy only what is needed to run
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package*.json ./

# Optional: logs directory
RUN mkdir -p /var/log/app

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
