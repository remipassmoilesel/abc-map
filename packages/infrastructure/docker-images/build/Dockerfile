FROM node:14-buster

# Cypress dependencies
RUN apt-get update && \
      apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

# NodeJS
RUN npm i -g npm && npm install -g yarn --force && npm install -g lerna
