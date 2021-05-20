# How toooz

## Fix my broken repo

    $ git checkout master
    $ abc clean
    $ abc install
    $ abc build


In very rare case you may need before all commands above:           

    $ rm -rf packages/abc-cli/build


## Search outdated dependencies

    $ abc install --production
    $ abc npm-registry
    $ lerna exec 'npm outdated --registry http://localhost:4873' --no-bail | tee outdated.log 
