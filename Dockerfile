
FROM node:10-stretch

RUN apt-get update && apt-get install python && npm install -g npm

RUN mkdir /app
WORKDIR /app

COPY . .

RUN ./abc build

RUN useradd --no-create-home abcmap
USER abcmap

CMD node /app/dist/api-main.js

