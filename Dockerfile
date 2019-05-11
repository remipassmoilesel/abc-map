
FROM node:10-stretch

RUN apt-get update && apt-get install python && npm install -g npm

RUN mkdir /app
WORKDIR /app

COPY deployment deployment
COPY shared shared
COPY api api
COPY gui gui

RUN useradd --no-create-home abcmap
USER abcmap

CMD node /app/api/dist/api-main.js

