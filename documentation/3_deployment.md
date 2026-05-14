# Deploy an instance of Abc-Map

<!-- toc -->

- [Releases](#releases)
- [Deployment on Kubernetes with Helm](#deployment-on-kubernetes-with-helm)
- [Deployment on Kubernetes with Abc-CLI](#deployment-on-kubernetes-with-abc-cli)
- [Deployment with Docker Compose](#deployment-with-docker-compose)

<!-- tocstop -->

Abc-Map server is provided as Docker images on [Gitlab](https://gitlab.com/abc-map/abc-map/container_registry)
under the name `registry.gitlab.com/abc-map/abc-map/server`.

Supported deployment is on Kubernetes, but you can easily deploy Abc-Map on any OS that support Docker.

## Releases

Presently there are no releases, because no one asked.

Docker images are built when the official platform is deployed. They are stored in the Gitlab repository with dated tags
(e.g: `v2021-07-27T04-25-45-863Z`). This repository is cleaned up regularly.

**You must therefore choose a tag and then store the image in your repository**.

However, you can update to the latest version at any time the data will be migrated.

## Deployment on Kubernetes with Helm

A Helm chart is available in source code repository.

Prerequisites:

- You must have a working Kubernetes cluster, and you must be connected to it
- You must have `git` and `helm` installed on your workstation

Clone the code repository:

    $ git clone https://gitlab.com/abc-map/abc-map
    $ cd abc-map

Copy template, delete and modify what you need:

    $ cp packages/infrastructure/helm-chart/abc-map/values.yaml .
    $ nano values.yaml

Deploy:

    $ helm upgrade abc-map \
        packages/infrastructure/helm-chart/abc-map \
        --namespace abc-map \
        --values values.yaml
        --install --wait

## Deployment on Kubernetes with Abc-CLI

With Abc-CLI you can build then deploy this software easily and quickly.

First you must create your own `values.yaml` as described above.

Then you must create a deployment configuration in Javascript:

```

    $ nano my-config.mjs

    // Sample deployment configuration
    export default {
        releaseName: 'abc-map',
        namespace: 'abc-map',
        tag: 'v2.01-modified',
        registry: 'my-docker-registry.my-domain.com/abc-map',
        valuesFile: '/path/to/values.yml',
        healthCheckUrl: 'https://my-domain.abc-map.fr/api/health/'
    }
```

Then you can deploy your instance by calling:

    $ ./abc-cli deploy ./my-config.mjs

## Deployment with Docker Compose

You can deploy Abc-Map with Docker-Compose.

See [infrastructure/docker-compose](../packages/infrastructure/docker-compose) folder.
