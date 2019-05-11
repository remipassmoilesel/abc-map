#!/usr/bin/env bash

set -x
set -e

mkdir -p /data/db && /usr/bin/mongod &

./builder build
./builder test
