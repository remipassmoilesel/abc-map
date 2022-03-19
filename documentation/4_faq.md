# Frequently Asked Questions

<!-- toc -->

- [How to start Abc-Map locally ?](#how-to-start-abc-map-locally-)
- [UI, UX, styling: Desktop or mobile ?](#ui-ux-styling-desktop-or-mobile-)
- [React: functional component or class component ?](#react-functional-component-or-class-component-)
- [How to add a dependency ?](#how-to-add-a-dependency-)
- [How to search outdated dependencies ?](#how-to-search-outdated-dependencies-)
- [How to generate a markdown TOC ?](#how-to-generate-a-markdown-toc-)
- [How to fix my broken repository ?](#how-to-fix-my-broken-repository-)
- [Server crashed: Error: Frontend root 'abc-map/packages/server/public' must be a directory](#server-crashed-error-frontend-root-abc-mappackagesserverpublic-must-be-a-directory)
- [(node:132766) [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE] DeprecationWarning: 'onAfterSetupMiddleware' ...](#node132766-dep_webpack_dev_server_on_after_setup_middleware-deprecationwarning-onaftersetupmiddleware-)
- [How to create videos for help page ?](#how-to-create-videos-for-help-page-)

<!-- tocstop -->

## How to start Abc-Map locally ?

Check [setup-workstation.md](./1_set-up-workstation.md) first, then:

    $ ./abc-cli install     # Install all dependencies
    $ ./abc-cli build       # Build all packages, needed the first time or after many changes
    $ ./abc-cli watch       # Watch and compile sources
    $ ./abc-cli start       # Start application

## UI, UX, styling: Desktop or mobile ?

Abc-Map is a desktop application, but it must be usable on a mobile device.

The user interface is designed for large devices and occasionally adapted for small ones.

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

## How to fix my broken repository ?

    $ git checkout master
    $ abc clean
    $ abc install
    $ abc build

In very rare case you may need before all commands above:

    $ rm -rf packages/abc-cli/build

## Server crashed: Error: Frontend root 'abc-map/packages/server/public' must be a directory

You must run `abc build`.

## (node:132766) [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE] DeprecationWarning: 'onAfterSetupMiddleware' ...

This message comes from react-scripts 5.

## How to create videos for help page ?

You can use [peek](https://github.com/phw/peek).
