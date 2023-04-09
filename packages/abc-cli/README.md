# abc-cli

`abc-cli` is a command-line program that aids in the development and deployment of Abc-Map.

Try `help` command to know more:

```shell

    $ cd abc-map
    $ ./abc -cli help

    🌍 `abc-cli` 🔨


      /$$$$$$  /$$                         /$$$$$$  /$$       /$$$$$$
     /$$__  $$| $$                        /$$__  $$| $$      |_  $$_/
    | $$  \ $$| $$$$$$$   /$$$$$$$       | $$  \__/| $$        | $$
    | $$$$$$$$| $$__  $$ /$$_____//$$$$$$| $$      | $$        | $$
    | $$__  $$| $$  \ $$| $$     |______/| $$      | $$        | $$
    | $$  | $$| $$  | $$| $$             | $$    $$| $$        | $$
    | $$  | $$| $$$$$$$/|  $$$$$$$       |  $$$$$$/| $$$$$$$$ /$$$$$$
    |__/  |__/|_______/  \_______/        \______/ |________/|______/




    `abc-cli` helps to build and deploy Abc-Map.

    Common commands are:

      $ ./abc-cli install                    Init project and install dependencies.
      $ ./abc-cli build                      Build all packages. Generally needed once only.
      $ ./abc-cli watch                      Watch source code of all packages and compile on change.
      $ ./abc-cli start                      Start project and associated services (database, mail server, ...).
      $ ./abc-cli clean-restart-services     Stop services, clean data, then start services.
      $ ./abc-cli ci [--light]               Execute a full/light continuous integration pipeline locally.


    Other commands:

      $ ./abc-cli install                     Init project and install dependencies.
      $ ./abc-cli lint                        Analyse code with ESLint and fix things that can be fixed.
      $ ./abc-cli dep-check                   Check dependencies and source code with Dependency Cruiser.
      $ ./abc-cli build                       Build all packages.
      $ ./abc-cli test                        Test all packages.
      $ ./abc-cli e2e-tests                   Launch application and E2E tests.
      $ ./abc-cli performance-tests           Launch application and performance tests.
      $ ./abc-cli start-services              Start associated services.
      $ ./abc-cli stop-services               Stop associated services.
      $ ./abc-cli clean-restart-services      Stop associated services.
      $ ./abc-cli clean                       Clean all build directories and dependencies.
      $ ./abc-cli ci                          Execute continuous integration: lint, dep-check, build, test, ...
      $ ./abc-cli npm-registry                Start a local NPM registry
      $ ./abc-cli apply-license               Apply license to project files. Use: https://github.com/google/addlicense.
      $ ./abc-cli docker-build REGISTRY TAG   Build project docker images.
      $ ./abc-cli docker-push REGISTRY TAG    Push project docker images.
      $ ./abc-cli deploy /path/to/config.js   Build, push project then deploy it. Use --skip-build to skip build steps.
      $ ./abc-cli help                        Show this help.
```
