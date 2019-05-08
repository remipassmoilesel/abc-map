FROM node:10-stretch AS builder

RUN apt-get update && apt-get install python && npm install -g npm

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install && npm run build


FROM node:10-alpine

RUN mkdir /app
WORKDIR /app

COPY --from=builder /app/dist .
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/tsconfig.json .
COPY --from=builder /app/tslint.json .

RUN npm install --production
RUN useradd -D -H abcmap

USER abcmap

CMD node /app/dist/api-main.js

