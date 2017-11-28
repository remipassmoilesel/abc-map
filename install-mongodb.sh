#!/usr/bin/env bash

VERSION=mongodb-linux-x86_64-ubuntu1604-3.4.10

wget https://fastdl.mongodb.org/linux/$VERSION -O mongodb.tar.gz

tar -xvf mongodb.tar.gz

mv $VERSION mongodb

rm mongodb.tar-gz
