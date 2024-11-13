# Usa una imagen base oficial de Node.js
FROM node:lts

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN yarn install

RUN mkdir -p /app/db && touch /app/db/agronova.db

# Copia el resto de la aplicación
COPY . .

ENV DATABASE_URL="file:./app/db/agronova.db"

# Expone el puerto en el que la aplicación correrá
EXPOSE 3000

# Comando para compilar y correr la aplicación
RUN yarn build

RUN npx keystone prisma migrate dev

CMD ["yarn", "start"]