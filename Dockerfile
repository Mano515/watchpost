FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/api/package.json ./apps/api/
RUN npm ci --workspace=@watchpost/api --workspace=@watchpost/shared-types

FROM base AS build
COPY packages/shared-types ./packages/shared-types
COPY apps/api ./apps/api
RUN npm run build --workspace=@watchpost/api

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/shared-types ./packages/shared-types
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
EXPOSE 3001
CMD ["node", "apps/api/dist/index.js"]
