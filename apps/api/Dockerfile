# Build from monorepo root so file:../../packages/shared resolves.
# docker-compose sets context to repo root and dockerfile to apps/api/Dockerfile.

FROM node:20-alpine

RUN apk add --no-cache wget

WORKDIR /app

# Copy api manifest and lockfile (optional)
COPY apps/api/package.json apps/api/package-lock.json* ./
# Copy shared package so "file:../../packages/shared" resolves to /packages/shared
COPY packages /packages

# Install shared's deps so its prepare (tsc) can run when api installs
RUN cd /packages/shared && npm install

RUN npm install

# Copy api source (node_modules already in place; root .dockerignore excludes node_modules)
COPY apps/api .

EXPOSE 5002
CMD ["npm", "run", "dev"]
