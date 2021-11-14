# Architecture of Abc-Map

## Components

Abc-Map is designed to be scalable but also to operate in an environment with limited resources.

For this purpose the number of mandatory processes for an instance is limited:

- One backend server, which serves frontend as static ressources
- One Mongodb server, which can be external and shared with other applications
- One SMTP server, which can be external and shared with other applications

Backend is stateless, so it can be horizontally scaled.

All communications between backend and frontend are done via HTTP, with a REST-like API.

## Code repository

Code repository is a monorepo managed with [Lerna](https://lerna.js.org/). Most used commands are wrapped
in a custom CLI: `abc-cli`. See `./abc-cli help` command.

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
