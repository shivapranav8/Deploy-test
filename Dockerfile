FROM node:20-slim

WORKDIR /app

# Copy manifests first for layer caching
COPY package*.json ./

# Install ALL dependencies (devDeps needed for vite + tsup build)
RUN npm ci

# Copy source files
COPY . .

# Build: vite compiles React → dist/,  tsup compiles server → dist/server/index.js
RUN npm run build

# Remove devDependencies after build (keeps runtime deps like express, tsx, etc.)
RUN npm prune --omit=dev

# Catalyst injects the port via X_ZOHO_CATALYST_LISTEN_PORT
EXPOSE 9000

CMD ["node", "dist/server/index.cjs"]
