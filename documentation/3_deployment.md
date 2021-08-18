# Deploy an instance of Abc-Map

Abc-Map server is provided as Docker images on [Gitlab](https://gitlab.com/abc-map/abc-map/container_registry) 
under the name `registry.gitlab.com/abc-map/abc-map/server`.

Supported deployment is on Kubernetes, but you can easily deploy Abc-Map on any OS that support Docker.


## Version

At the moment there are no versions, because it is not yet necessary. 

Docker images are built when the official platform is deployed. They are stored in the Gitlab repository with dated tags
(e.g: `v2021-07-27T04-25-45-863Z`). This repository is cleaned up regularly.

**You must therefore choose a tag and then store the image in your repository**.  

As soon as it will be requested, versions will be used.


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


## Deployment with Abc-CLI

With Abc-CLI you can build then deploy this software easily and quickly.   

First you must create your own `values.yaml` as described above.  

Then you must create a deployment configuration in Javascript:   
```
    
    $ nano my-config.js

    
    # Sample deployment configuration
    
    const path = require('path');
    
    module.exports = {
        releaseName: 'abc-map',
        namespace: 'abc-map',
        tag: 'v2.01-modified',
        registry: 'my-docker-registry.my-domain.com/abc-map',
        valuesFile: path.resolve(__dirname, 'values.yml'),
        healthCheckUrl: 'https://my-domain.abc-map.fr/api/health/'
    }
```

Then you can deploy your instance by calling:  

    $ ./abc-cli deploy ./my-config.js


## Deployment with Docker Compose

Work in progress.


