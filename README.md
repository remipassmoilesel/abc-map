# Abc-Map 2

Official rewrite, attempt n°265 👨‍💻.

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


## Status of project

Abc-Map 2 is at a very early stage. Everything is done within the means available to make this project a lasting one, 
but for now you should expect some breaking changes.     


## Architecture

Abc-Map is designed to be scalable but to operate in an environment with limited resources.        

For this purpose the number of processus for an instance is limited:        
- One backend server, which serves frontend as static ressources
- One Mongodb server
- One SMTP server 

Backend is stateless, so it can be horizontally scaled.       


## Technologies 

**Backend**: 
- Typescript 
- Express 
- Mongodb
- JWT

**Frontend**: 
- Typescript
- React
- Openlayers
- Bootstrap


## Development installation

**The development environment has only been tested under GNU / Linux.**      

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

