FROM node:20-alpine

WORKDIR /app

# Install deps first for better layer caching (npm install: no lockfile in apps/api)
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Dev: nodemon runs from docker-compose
EXPOSE 5002
CMD ["npm", "run", "dev"]
