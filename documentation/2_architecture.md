# Architecture of Abc-Map

<!-- toc -->

- [Components](#components)
- [Code repository](#code-repository)
- [Continuous integration](#continuous-integration)

<!-- tocstop -->

## Components

Abc-Map is designed to be scalable but also to operate in an environment with limited resources.

For this purpose:

- the majority of Abc-map functionalities are client-side, in a [progressive web app](https://en.wikipedia.org/wiki/Progressive_web_app): `webapp`.
- the web app is served by a [Fastify](https://fastify.dev/) server: `server`. This server is stateless and can be scaled horizontally.
- the mandatory software infrastructure is limited (one [Mongodb](https://www.mongodb.com/) database). A SMTP server can be added.

All communications between server and client-side are done via HTTP, with a REST-like API.

## Code repository

Code repository is a monorepo managed with [PNPM](https://pnpm.io/fr/) and [Turbo](https://turbo.build/). Some development tools are available via `abc-cli`.
See `./abc-cli help` command.

```
    `abc-cli` helps to build and deploy Abc-Map.

    Common commands are:

      $ ./abc-cli install                    Init project and install dependencies.
      $ ./abc-cli build                      Build all packages. Generally needed once only.
      $ ./abc-cli watch                      Watch source code of all packages and compile on change.
      $ ./abc-cli start                      Start project and associated services (database, mail server, ...).
      $ ./abc-cli clean-restart-services     Stop services, clean data, then start services.
      $ ./abc-cli ci [--light]               Execute a full/light continuous integration pipeline locally.
```

## Continuous integration

These checks and tests are used in continuous integration:

- [eslint](https://eslint.org/) for static code analysis
- [sort-package-json](https://www.npmjs.com/package/sort-package-json) for package.json sorting
- [Typescript](https://www.typescriptlang.org/) for type checking
- [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) for dependency analysis
- Unit and integration tests on backend with [Mocha](https://mochajs.org/)
- Unit tests on frontend with [Jest](https://jestjs.io/)
- End-to-end tests with [Cypress](https://www.cypress.io/)
- Load testing with [K6](https://k6.io/). In continuous integration load tests are not intended to prove that the
  software is holding a huge load. They pass in order to prove that they are functional.

Tests follow the concept of [Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html).
