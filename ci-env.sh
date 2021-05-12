# This file allow to load CI environment variable for debug purposes

export CI="true"
export ABC_CONFIGURATION="resources/configuration/continuous-integration.js"
export YARN_CACHE_FOLDER="$CI_PROJECT_DIR/.yarn-cache"
export CYPRESS_CACHE_FOLDER="$CI_PROJECT_DIR/.cypress-cache"
export NODE_OPTIONS="--max-old-space-size=3500"
