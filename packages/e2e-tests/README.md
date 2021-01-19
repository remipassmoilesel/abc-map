# End-to-end tests 

Tests here are separated in two groupes:    
- `src/integration/ci`: these tests pass in continuous integration
- `src/integration/others`: these tests does not pass in continuous integration


For the moment and despite several trials, some tests does not pass when using Cypress headless mode.      

## WMS credentials

In order to test WMS authentication, you will need credentials following this template:

    #!/usr/bin/env bash
    
    export CYPRESS_WMS_URL="https://domain"
    export CYPRESS_WMS_USERNAME="username"
    export CYPRESS_WMS_PASSWORD="password"


Loaded like this before launching Cypress:

    $ source credentials.sh
    $ yarn run e2e-test:interactive
