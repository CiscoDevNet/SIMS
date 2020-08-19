FROM node:12.18.2-slim

WORKDIR /usr/src/app

COPY src ./src
COPY index.js ./
COPY package.json ./
COPY .env ./

RUN npm i

ENTRYPOINT [ "npm", "run", "start" ]