#!/usr/bin/env bash

set -x
set -e

IMAGE_NAME=remipassmoilesel/nodejs-build:0.2

docker run -ti -v /var/run/docker.sock:/var/run/docker.sock \
               -v $(pwd)/../..:/git/abc-map \
               -v ~/.ssh:/root/.ssh \
               -v ~/.npm:/root/.npm \
               -v ~/.m2:/root/.m2 \
               ${IMAGE_NAME} bash
