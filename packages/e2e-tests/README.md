# End-to-end tests 

Tests here are separated in two groupes:    
- `src/integration/ci`: these tests pass in continuous integration
- `src/integration/others`: these tests does not pass in continuous integration


For the moment and despite several trials, some tests does not pass when using Cypress headless mode.      


## Run all tests, the quick way

    $ abc start
    $ yarn run test:e2e:interactive


## Run tests with production code

    $ abc build
    $ lerna run start:e2e --parallel
    $ yarn run test:e2e:interactive



