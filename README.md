# Abc-Map

Official rewrite, attempt n°265 👨‍💻.

<div>
  <a href="https://gitlab.com/abc-map/abc-map/-/commits/master">
    <img alt="Pipeline status" src="https://gitlab.com/abc-map/abc-map/badges/master/pipeline.svg" />
  </a>&nbsp;&nbsp;
  <a href="https://www.firsttimersonly.com/">
    <img alt="First timers only" src="https://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square" />
  </a>
</div>

You can try it here on [abc-map.fr](https://abc-map.fr).

Main repository of source code is on Gitlab: [https://gitlab.com/abc-map/abc-map](https://gitlab.com/abc-map/abc-map).


## Purpose in a nutshell

Abc-Map is a tool for processing geographic information that is easy to understand and use.

Use cases:             

- Education
- Professional uses: tourism, deliveries, ...
- Sports and leisure: hiking, hunting, treasure hunts, ...

More information [here](https://abc-map.fr/documentation).    


## Why ?

There are some very good GIS available: [QGIS](https://www.qgis.org) and others are great software. But they are 
designed by and for experts, and are hard to use. The goal of this project is to provide a light GIS experience 
without complex technical knowledge. 


## Status of project

Abc-Map 2 is at a very early stage. 

Everything is done within the means available to make this project a long-lasting one. But this software is developed 
at night after often 10 hours of code during the day.       

A lot of things needs to be - and will be - improved 💪


## What can I find here ?

Source code of Abc-Map and developer documentation, if you want to hack it or deploy your own instance.    

See [documentation](./documentation) folder.


## How can I help ?

See [CONTRIBUTING](./CONTRIBUTING.md) and [backlog](./documentation/5_backlog.md).        


## Technologies used 

**Backend**:
- [NodeJS](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/)
- [Mongodb](https://www.mongodb.com/)
- [K6](https://k6.io/) for load testing
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) for local development
- [Kubernetes](https://kubernetes.io/) and [Helm](https://helm.sh/) for deployment

**Frontend**: 
- [Typescript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Openlayers](https://openlayers.org/)
- [Bootstrap](https://getbootstrap.com)

