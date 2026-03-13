#!/bin/sh
# Catalyst AppSail startup script
# Install production dependencies (node_modules not included in deploy)
npm install --omit=dev --prefer-offline
# Start the server in production mode
NODE_ENV=production node dist/server/index.cjs
