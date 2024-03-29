FROM node:16-alpine

MAINTAINER test

RUN apk add --no-cache bash



RUN mkdir /app && chown -R node:node /app

#COPY ./wait-for-it.sh /
#RUN chmod +x /wait-for-it.sh
#RUN chown node:node /wait-for-it.sh

USER node
WORKDIR /app

COPY ./backend/package.json .
RUN npm install