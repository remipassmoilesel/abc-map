# Docker compose deployment

This deployment is not actively used (we use Helm Chart for official instance).

Please open an issue in case of problem.

## Usage

First you need to install [Docker and Docker Compose](https://docs.docker.com/get-started/).

Then you have to choose a version of Abc-Map server here: https://gitlab.com/abc-map/abc-map/container_registry/2555712

```
    # You should probably pick the most recent "stable" tag.
    # Examples:
    stable-v2023-05-20-0be00cddc0
    stable-v2022-11-13-c597f4e5fc
    nightly-v2023-03-11-1386fec705
    nightly-v2023-04-09-528570d3b9
    ...
```

Next, you need to edit the [.env](.env) file.

```
-ABC_SERVER_TAG="..."
+ABC_SERVER_TAG="stable-v2023-05-20-0be00cddc0"
```

Then you can start Abc-Map:

```

  $ cd docker-compose
  $ docker compose up

```

Once server is started, visit [http://localhost:10082](http://localhost:10082).
