FROM node:20-alpine

# OpenSSL necessário para o Prisma no Alpine
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 3001

# prisma db push: cria/sincroniza as tabelas sem precisar de migration files
# seed com || true: não derruba o container se já existirem registros
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node prisma/seed.js || true && npm start"]
