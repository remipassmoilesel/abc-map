#!/usr/bin/env bash

set -x
set -e

# TODO: add tests

cd shared && npm install && npm run lint && npm run build && \
    cd ../api && npm install && npm run lint && npm run build && \
    cd ../gui && npm install && npm run lint && npm run build

