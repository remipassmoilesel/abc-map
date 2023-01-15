# This file allow to load CI environment variable for debug purposes
# Usage: "cd abc-map && source ci-env.sh"

export PROJECT_DIR=`pwd`

export CI="true"
export ABC_CONFIGURATION="resources/configuration/continuous-integration.js"
export YARN_CACHE_FOLDER="$PROJECT_DIR/.yarn-cache"
export CYPRESS_CACHE_FOLDER="$PROJECT_DIR/.cypress-cache"
export NODE_OPTIONS="--max-old-space-size=4000"


