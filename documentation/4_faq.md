# Frequently Asked Questions

## How to start Abc-Map locally ?

Check [setup-workstation.md](./1_setup-workstation.md) first, then:

    $ ./abc-cli install     # Install all dependencies
    $ ./abc-cli build       # Build all packages, needed the first time or after many changes
    $ ./abc-cli watch       # Watch and compile sources
    $ ./abc-cli start       # Start application

## How to fix my broken repository ?

    $ git checkout master
    $ abc clean
    $ abc install
    $ abc build

In very rare case you may need before all commands above:

    $ rm -rf packages/abc-cli/build

## React: functional component or class component ?

Functional components must be privileged.

## How to add a dependency ?

1. Edit target `package.json`, add your dependency
1. Run `$ abc install`

## How to search outdated dependencies ?

    $ abc install --production
    $ abc npm-registry
    $ lerna exec 'npm outdated --registry http://localhost:4873' --no-bail | tee outdated.log

## How to generate a markdown TOC ?

See https://github.com/jonschlinkert/markdown-toc#cli

    $ npm i -g markdown-toc
    $ markdown-toc file.md
