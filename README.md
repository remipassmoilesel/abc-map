# Abc-Map 2

Official rewrite, attempt 265 👨‍💻.

<a href="https://gitlab.com/remipassmoilesel/abc-map-2/-/commits/master">
<img alt="pipeline status" src="https://gitlab.com/remipassmoilesel/abc-map-2/badges/master/pipeline.svg" />
</a>     


## Goals

Abc-Map is a tool for processing geographic information that is easy to understand and use.

Use cases:             

- Education
- Professional uses: tourism, deliveries, etc. 
- Sports and leisure: hiking, hunting, treasure hunts, ...

More information [here](https://abc-map.fr).


## Development installation

For Debian like and Ubuntu:       

    # Install git, docker and docker-compose
    $ sudo apt install git docker.io docker-compose

    # Install NodeJS and yarn
    $ curl -L https://git.io/n-install | bash
    $ npm i -g yarn

    # Clone source code
    $ git clone https://gitlab.com/remipassmoilesel/abc-map-2.git
    $ cd abc-map-2


Build then start:      

    $ ./abc-cli bootstrap   # Install all dependencies
    $ ./abc-cli build       # Build all packages
    $ ./abc-cli start       # Start application, for development purposes
