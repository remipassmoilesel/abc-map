# Setup development workstation

**The development environment has only been tested under GNU / Linux, it may not work on Windows.**

Windows is supported as a target operating system, via browsers. It is not actively supported
as a development operating system. You can use dual boot or [virtual machines](https://brb.nci.nih.gov/seqtools/installUbuntu.html).

Tested environments:

- Manjaro Linux
- Ubuntu 20.04

## Minimal setup

With this setup, you can modify project but all tests will not pass and you can not deploy.

For Debian like and Ubuntu:

    # Install git, docker and tools
    $ sudo apt install git docker.io docker-compose curl build-essential

    # This command allow you to use Docker without being root.
    # You MUST logout then login after, or reboot your computer.
    $ sudo usermod -aG docker $USER

    # Install NodeJS and yarn. There are several ways to do that, but n rocks !
    # You MUST restart your terminal after.
    $ curl -L https://git.io/n-install | bash
    $ npm i -g yarn

    # Clone source code
    $ git clone https://gitlab.com/abc-map/abc-map.git
    $ cd abc-map

## Start commands

A CLI tool builds and starts the project:

    $ ./abc-cli install     # Install all dependencies
    $ ./abc-cli build       # Build all packages, needed the first time or after many changes
    $ ./abc-cli start       # Start application

You can watch sources with:

    $ ./abc-cli watch

See CLI help for more commands:

    $ ./abc-cli help

You can build, test, start packages independently too:

    $ yarn run start:watch        # Start and reload on source change
    $ yarn run test               # Run tests once, may need build before
    $ yarn run test:interactive   # Run tests and rerun on source change, may need build before
    $ yarn run coverage           # Run tests and export coverage report, may need build before
    $ yarn run build              # Typescript build
    $ yarn run clean              # Clean build sources
    $ yarn run clean-build        # Guess what ?
    $ yarn run lint               # Apply eslint
    $ yarn run lint-fix           # Apply eslint and fix when possible
    $ yarn run dep-check          # Dependency analysis with dependency-cruiser

## Local services

After start, several services are launched on start:

- A Mongodb instance on port `27019`
- A Mongo Express instance on port `27020`
- Server on port `10082`. This port serves the backend API and the last frontend build.
- Webpack dev server on port `3005`

You can clean local data by using command:

    $ ./abc-cli clean-restart-services

## Additional tools

With these tools, all tests should pass, and you can deploy your own instance of Abc-Map.

- K6 (k6-v0.32.0): https://k6.io/docs/getting-started/installation/
- Kubectl (v1.22.3): https://kubernetes.io/fr/docs/tasks/tools/install-kubectl/
- Helm (v3.7.1): https://helm.sh/docs/intro/install/
- addlicense: https://github.com/google/addlicense
