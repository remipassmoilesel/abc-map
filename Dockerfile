
FROM node:10-stretch

RUN apt-get update && apt-get install -y python gdal-bin && npm install -g npm

RUN mkdir /app
RUN mkdir -p /app/data/public
WORKDIR /app

COPY deployment deployment
COPY shared shared
COPY api api
COPY gui gui
COPY data/public data/public

RUN useradd --no-create-home abcmap
USER abcmap

CMD node /app/api/dist/api-main.js

