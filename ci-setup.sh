#!/usr/bin/env bash

set +x
set -e

# This script helps to run test in continuous integration environment.
# You MUST use it from project root:
#
#   $ cd abc-map
#   $ source ./ci-setup.sh


export PROJECT_DIR=`pwd`

export CI="true"
export ABC_CONFIGURATION="$PROJECT_DIR/packages/server/resources/configuration/continuous-integration.mjs"
export CYPRESS_CACHE_FOLDER="$PROJECT_DIR/.cypress-cache"
export NODE_OPTIONS="--max-old-space-size=4096"
export NODE_ENV="production"

# This script may return 3 but it works anyway.
source "$HOME/.nvm/nvm.sh" || true

# If NVM use fail, rebuild docker image or find a way to cache node.
nvm use

corepack enable

# We MUST restore default behavior
set +e