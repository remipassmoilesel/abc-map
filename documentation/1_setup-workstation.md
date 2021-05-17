# Setup development workstation

**The development environment has only been tested under GNU / Linux, it will not work on Windows.**


## Minimal setup

With this setup, you can modify project but all tests will not pass and you can not deploy.


For Debian like and Ubuntu:

    # Install git, docker and docker-compose
    $ sudo apt install git docker.io docker-compose

    # Install NodeJS and yarn
    $ curl -L https://git.io/n-install | bash
    $ npm i -g yarn

    # Clone source code
    $ git clone https://gitlab.com/remipassmoilesel/abc-map-2.git
    $ cd abc-map-2


A CLI tool builds and starts the project:

    $ ./abc-cli install     # Install all dependencies
    $ ./abc-cli build       # Build all packages, needed the first time or after many changes
    $ ./abc-cli start       # Start application and watch sources, for development purposes


See CLI help for more commands:

    $ ./abc-cli help


Several services are launched on start:
- A Mongodb instance on port 27019
- A Mongo Express instance on port 27020
- Backend server on port 10082
- Webpack dev server on port 3005


You can clean local data by using command:

    $ ./abc-cli clean-restart-services


## Additional tools

With these tools, all tests should pass, and you can deploy your own instance of Abc-Map.

TODO:
- K6
- Kubectl
- Helm


## Deployment options

TODO:
- Docker simple example
- Helm chart
