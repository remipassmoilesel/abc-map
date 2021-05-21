# Abc-Map 2

Official rewrite, attempt n°265 👨‍💻.

<a href="https://gitlab.com/remipassmoilesel/abc-map-2/-/commits/master">
<img alt="pipeline status" src="https://gitlab.com/remipassmoilesel/abc-map-2/badges/master/pipeline.svg" />
</a>     


## Purpose

Abc-Map is a tool for processing geographic information that is easy to understand and use.

Use cases:             

- Education
- Professional uses: tourism, deliveries, etc. 
- Sports and leisure: hiking, hunting, treasure hunts, ...

More information [here](https://alpha.abc-map.fr/documentation).


## Status of project

Abc-Map 2 is at a very early stage. Everything is done within the means available to make this project a lasting one, 
but for now you should expect some breaking changes.     


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


## Developer documentation

See [documentation](./documentation) folder.


## Roadmap

Upcoming work and features:      

- Internationalization
- Automated map legend creation
- More frontend tests
