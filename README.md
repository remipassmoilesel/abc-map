# Welcome to Abc-Map !

<div style="margin-bottom: 3rem">
  <img alt="Abc-Map" src="./documentation/assets/main-icon.png" />
</div>

<div style="margin-bottom: 1.5rem">
  <a href="https://gitlab.com/abc-map/abc-map/-/commits/master">
    <img alt="Pipeline status" src="https://gitlab.com/abc-map/abc-map/badges/master/pipeline.svg" />
  </a>&nbsp;&nbsp;
  <a href="https://www.firsttimersonly.com/">
    <img alt="First timers only" src="https://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square" />
  </a>
</div>

Abc-Map is a tool for processing geographic information that is easy to understand and use.

Use cases:

- Education
- Professional uses: tourism, deliveries, ...
- Sports and leisure: hiking, hunting, treasure hunts, ...

You can try Abc-Map online on [abc-map.fr](https://abc-map.fr). If you like it, please give it a star 🌟

## Why ?

There are some very good GIS available: [QGIS](https://www.qgis.org) and others are great software. But they are
designed by and for experts, and are hard to use.

Abc-Map is a lightweight GIS whose objective is to offer a good user experience for neophytes as for experts in a
hurry.

## What can I do with this thing ?

- You can create and process geographic data (geojson, shapefiles, WMS, WMTS, XYZ, ...)
- You can export maps in PDF or PNG format
- You can share online maps on your sites in iframe or fullscreen
- If you are a nerd you can practice Javascript, Typescript, React, Openlayers and more !

## Who uses Abc-Map ?

- Sportsmen and women for running or cycling routes
- Teachers and students for workshops
- Entrepreneurs to georeference their activities or one-off events
- Police, gendarmes and coastguards for public service missions
- Ecological associations for the organization of community actions
- Professional researchers and enthusiasts to illustrate historical or political narratives
- Tourist offices for tour itineraries
- Town halls and citizens' committees for the organization of markets or celebrations
- Humanitarian and solidarity organizations for social action missions

And much more, which we don't hear about because... we don't track users 👏👏

## How can I help ?

See [CONTRIBUTING](./CONTRIBUTING.md) and [backlog](./documentation/5_backlog.md).

## Source code, issues, license

Main repository is hosted on Gitlab: [https://gitlab.com/abc-map/abc-map](https://gitlab.com/abc-map/abc-map).

Something went wrong ? Take a look at the [issues](https://gitlab.com/abc-map/abc-map/-/issues).

All source code is distributed under GPLv3 license, see [LICENSE.txt](./LICENSE.txt).

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

## Status of project

Abc-Map 2 is at a very early stage. A lot of things needs to be - and will be - improved 💪
