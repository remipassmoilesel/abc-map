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
- [How to debug turborepo ?](#how-to-debug-turborepo-)
- [Which package manager is used ?](#which-package-manager-is-used-)
- [(node:3841) TimeoutNaNWarning: NaN is not a number.](#node3841-timeoutnanwarning-nan-is-not-a-number)
- [Why `void` in `void reply.forbidden();` ?](#why-void-in-void-replyforbidden-)
- [How to update turbo (turborepo) ?](#how-to-update-turbo-turborepo-)

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

## How to debug turborepo ?

```
$ turbo run clean-build --summarize
```

## Which package manager is used ?

PNPM is preferred, NPM otherwise.

## (node:3841) TimeoutNaNWarning: NaN is not a number.

This warning come from react or react-boostrap (04/2026)

## Why `void` in `void reply.forbidden();` ?

Some Fastify methods are conflicting with @typescript-eslint/no-floating-promises rules (`.then()`)

See: https://github.com/fastify/fastify/discussions/3849

## How to update turbo (turborepo) ?

Update `turbo` dependency in both `abc-map/package.json` and `abc-map/packages/abc-cli/package.json)`.

Why `turbo` in `abc-cli` ? In order to work even if turbo was not globally installed (like in CI).
