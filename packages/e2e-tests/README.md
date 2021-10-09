# End-to-end tests 

By default, tests run on frontend served on port 10082.


## Run all tests, the quick way

    $ abc start
    $ yarn run e2e:dev:interactive


## Debug console output

    $ DEBUG=true yarn run e2e:ci


## Troubleshooting

### Run tests with webpack dev server (port 3005)

Edit `packages/e2e-tests/config/development.json`, settings `baseUrl`.

```
  "baseUrl": "http://localhost:3005",
```

You may need to modify public URL too, in `packages/server/resources/configuration/local.js`
```
  externalUrl: 'http://localhost:3005/',
```


### Error: attempt to perform an operation not allowed by the security policy `gs' @ error/delegate.c/ExternalDelegateCommand/378

You must modify Image Magick configuration:       

    $ sudo vim /etc/ImageMagick-7/policy.xml

    ...
      <!-- <policy domain="system" name="max-memory-request" value="256MiB"/> -->
      <!-- <policy domain="system" name="shred" value="2"/> -->
      <!-- <policy domain="system" name="precision" value="6"/> -->
      <!-- <policy domain="system" name="font" value="/path/to/unicode-font.ttf"/> -->
      <policy domain="delegate" rights="none" pattern="gs" />  <- Comment this line
    </policymap>


### Rendering test does not pass with GUI

Yes ! That's true, and I don't know to make this f.... work head and headless. So for the moment it passes only 
with Chromium headless.

Pass only rendering test: 

    $ ./node_modules/.bin/cypress run --browser chromium --headless --config-file ./config/ci.json --spec src/integration/rendering-spec.ts



  

