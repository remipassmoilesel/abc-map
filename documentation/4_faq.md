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
- [How to create videos for help page ?](#how-to-create-videos-for-help-page-)
- [About style ratios](#about-style-ratios)
- [About 'instanceof' in frontend](#about-instanceof-in-frontend)
- [How do I publish public packages ?](#how-do-i-publish-public-packages-)
- [How to debug turborepo ?](#how-to-debug-turborepo-)
- [Which package manager is used ?](#which-package-manager-is-used-)

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

    $ pnpm -r outdated

## How to generate a markdown TOC ?

See https://github.com/jonschlinkert/markdown-toc#cli

    $ pnpm i -g markdown-toc
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

## How to create videos for help page ?

You can use [peek](https://github.com/phw/peek).

## About style ratios

Styles can be artificially scaled, for example between two screen sizes or for exports.

To this end, the functions and methods that handle styles take a "style ratio" as a parameter. For example,
a map with dots 10 pixels in diameter displayed with a ratio of 2 will have dots 20 pixels in diameter.

## About 'instanceof' in frontend

`instanceof` usage can have weird behavior in frontend because it cannot work with external modules.  
See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof#instanceof_and_multiple_context_e.g._frames_or_windows

You can use instead `crossContextInstanceof()`.

## How do I publish public packages ?

To publish packages to the NPM registry:

```
  $ npm adduser
  $ lerna run public-publish
```

Not all public packages are published on NPM registry.

## How to debug turborepo ?

```
$ turbo run clean-build --summarize
```

## Which package manager is used ?

PNPM is preferred, NPM otherwise.
