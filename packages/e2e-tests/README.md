# End-to-end tests

By default, tests run on frontend served on port 10082.

## Run tests

    $ abc start
    $ yarn run e2e:interactive:3005     # Use frontend from Webpack dev server, with hot-reload
    $ yarn run e2e:interactive:10082    # Use production frontend from server

## How to, Troubleshooting

### Rendering test does not pass with GUI, does not pass on my computer

Yes ! That's true, and I don't know to improve this. So for the moment it passes only with headless Chromium provided by Ubuntu repositories
(current continuous integration setup)

You can inspect differences in `generated/` folder.

Pass only rendering test:

    $ yarn run e2e:ci:3005 --spec src/integration/rendering-spec.ts

### Run only one test headless

    $ yarn run e2e:ci:3005 --spec src/integration/tool-linestring-spec.ts

### Show debug console output

    $ DEBUG=true yarn run e2e:ci

### Error: attempt to perform an operation not allowed by the security policy `gs' @ error/delegate.c/ExternalDelegateCommand/378

You must modify Image Magick configuration:

    $ sudo vim /etc/ImageMagick-7/policy.xml

    ...
      <policy domain="delegate" rights="none" pattern="gs" />  <- Comment this line
    </policymap>

### Why numTestsKeptInMemory = 0 ?

It helps to avoid memory errors with Cypress.

### About dependencies

All dependencies declared in `package.json` must be registered in `dependencies` section.

In continuous integration, development dependencies are pruned before tests.
