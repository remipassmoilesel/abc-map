# How toooz

## Start Abc-Map locally

Check [setup-workstation.md](./1_setup-workstation.md) first, then:      

    $ ./abc-cli install     # Install all dependencies
    $ ./abc-cli build       # Build all packages, needed the first time or after many changes
    $ ./abc-cli watch       # Watch and compile sources
    $ ./abc-cli start       # Start application


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


## Generate a markdown TOC

See https://github.com/jonschlinkert/markdown-toc#cli

    $ npm i -g markdown-toc
    $ markdown-toc file.md

