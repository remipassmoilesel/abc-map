#!/usr/bin/env bash

# This script is designed to be run from the root directory

set -x
set -e

lerna bootstrap
lerna run lint
lerna run clean-build
#lerna run test
