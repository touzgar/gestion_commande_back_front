FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --only=production

# Copy .env file (it will be overridden by --env-file at runtime)
COPY .env* ./

EXPOSE 3000
CMD ["npm", "run", "start:prod"]