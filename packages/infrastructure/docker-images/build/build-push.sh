#!/usr/bin/env bash

IMAGE_NAME="registry.gitlab.com/remipassmoilesel/abc-map-2/build-image:0.1"

docker build . -t $IMAGE_NAME
docker push $IMAGE_NAME