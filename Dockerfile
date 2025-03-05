FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
# LOCAL / DOCKER HUB
COPY .env.build.local .env
# docker build --tag local-personal-app:latest .
# docker run -d --name personal-app --env-file .env.local --publish 3000:3000 local-personal-app:latest
# docker tag local-personal-app:latest adeprastya/personal-app:{tag}
# docker push adeprastya/personal-app:{tag}

# PRODUCTION / ARTIFACT REGISTRY
# COPY .env.build.prod .env
# docker build --tag local-personal-app:latest .
# docker run -d --name personal-app --env-file .env.prod --publish 3000:3000 local-personal-app:latest
# docker tag local-personal-app:latest asia-southeast2-docker.pkg.dev/personal-447310/adeprastya/personal-app:{tag}
# docker push asia-southeast2-docker.pkg.dev/personal-447310/adeprastya/personal-app:{tag}

# docker exec -ti personal-app /bin/sh

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
