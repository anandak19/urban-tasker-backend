# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all deps (needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build NestJS app
RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy only package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled app from builder
COPY --from=builder /usr/src/app/dist ./dist

# Logs directory (for winston / promtail)
RUN mkdir -p /var/log/app

# Expose app port
EXPOSE 3000

# Run the compiled app
CMD ["node", "dist/main.js"]
