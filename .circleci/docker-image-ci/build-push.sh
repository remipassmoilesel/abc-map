#!/usr/bin/env bash

set -x
set -e

IMAGE_NAME=remipassmoilesel/nodejs-build:0.2

docker build . -t ${IMAGE_NAME}
docker push ${IMAGE_NAME}
