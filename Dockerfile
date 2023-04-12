FROM node:18

WORKDIR /usr/src/app

COPY prisma /usr/src/app/prisma/

COPY .env /usr/src/app

COPY tsconfig.json /usr/src/app

RUN apt-get update && apt-get install -y wget

COPY . .

EXPOSE 3002


