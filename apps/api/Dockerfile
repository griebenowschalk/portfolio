FROM node:20-alpine

WORKDIR /app

# Install deps first for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Dev: nodemon runs from docker-compose
EXPOSE 5000
CMD ["npm", "run", "dev"]
