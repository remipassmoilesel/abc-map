# Abc-Map 2

Official rewrite, attempt n°265 👨‍💻.

<div>
  <a href="https://gitlab.com/abc-map/abc-map/-/commits/master">
    <img alt="Pipeline status" src="https://gitlab.com/abc-map/abc-map/badges/master/pipeline.svg" />
  </a>
  &nbsp;&nbsp;
  <a href="https://www.firsttimersonly.com/">
    <img alt="First timers only" src="https://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square" />
  </a>
</div>

Main repository of project is located here: [https://gitlab.com/abc-map/abc-map](https://gitlab.com/abc-map/abc-map).


## Purpose in a nutshell

Abc-Map is a tool for processing geographic information that is easy to understand and use.

Use cases:             

- Education
- Professional uses: tourism, deliveries, ...
- Sports and leisure: hiking, hunting, treasure hunts, ...

More information [here](https://abc-map.fr/documentation).    


## Status of project

Abc-Map 2 is at a very early stage. Everything is done within the means available to make this project a 
long-lasting one, but for now you should expect some breaking changes.

Please keep in mind that this software is developed at night after often 10 hours of code during the day. 
A lot of things needs to be and will be improved 💪    


## Why ? And why a web application ?

There are some very good GIS available: QGIS, GvSIG, OrbisGIS are great software. But they are intended for 
experts in the field and are hard to use. The goal of this project is to provide a GIS experience without 
complex technical knowledge. Of course, at a cost: Abc-Map is less powerful than these software.            

Web technologies, although complex and sometimes literally painful, make it possible to deliver software  
widely accessible and fully capable of heavy calculations. All the power of browsers has not yet been exploited 
in this software but it is possible thanks to WebWorkers and WebAssembly to do as well as many office 
applications.    


## What can I find here ?

Source code of Abc-Map and developer documentation, if you want to hack it or deploy your own instance.    

See [documentation](./documentation) folder.


## How can I help ?

See [CONTRIBUTING](./CONTRIBUTING.md).      
See [backlog](./documentation/5_backlog.md).        


## Technologies used 

**Backend**:
- [NodeJS](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/)
- [Mongodb](https://www.mongodb.com/)
- [K6](https://k6.io/) for load testing
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) for local development
- [Helm](https://helm.sh/) and [Kubernetes](https://kubernetes.io/) for deployment

**Frontend**: 
- [Typescript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Openlayers](https://openlayers.org/)
- [Bootstrap](https://getbootstrap.com)

