#!/usr/bin/env bash

set -x
set -e

# TODO: add tests

mkdir -p /data/db && /usr/bin/mongod &

cd shared && npm install && npm run build

cd ..

cd api && npm install && npm run build

cd ..

cd gui && npm install && npm run build

