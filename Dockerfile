FROM node:18

WORKDIR /usr/src/app

COPY prisma /usr/src/app/prisma/


COPY tsconfig.json /usr/src/app

RUN apt-get update && apt-get install -y wget
RUN apt-get update && apt-get install -y telnet


COPY . .

EXPOSE 3002


