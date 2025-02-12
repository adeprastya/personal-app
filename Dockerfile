FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env.example .env

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE ${PORT}

CMD ["npm", "run", "start"]

# docker build --tag local-personal-app:latest .
# docker run -d --name personal-app --env-file .env --publish 3000:3000 local-personal-app:latest
