FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY packages/shared-types ./packages/shared-types
COPY apps/api ./apps/api
RUN npm install --workspace=packages/shared-types --workspace=apps/api
RUN npm run build --workspace=packages/shared-types
RUN npm run build --workspace=apps/api

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/index.js"]
