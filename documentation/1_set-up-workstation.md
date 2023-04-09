# Set up a developer workstation

<!-- toc -->

- [Introduction](#introduction)
- [Basic setup](#basic-setup)
  - [Ubuntu 20.04 (actively supported)](#ubuntu-2004-actively-supported)
  - [Windows 11, Windows Subsystem for Linux version 2](#windows-11-windows-subsystem-for-linux-version-2)
- [Start and build Abc-Map locally](#start-and-build-abc-map-locally)
- [Local services](#local-services)
- [Additional tools](#additional-tools)

<!-- tocstop -->

## Introduction

This document explains how to set up a development workstation. This document will guide you through
the installation of dependencies needed to start and build Abc-Map.

Although these operations are simple and common, apply the steps described below with caution.

This setup has been tested on these operating systems:

- Manjaro Linux
- Ubuntu 20.04
- Windows 11, Windows Subsystem for Linux version 2

**The easiest and most reliable way to start developing on Abc-Map is to use Ubuntu 20.04.**

## Basic setup

### Ubuntu 22.04 (recommended)

Install basic tools and dependencies:

    $ sudo apt-get update
    $ sudo apt-get install ca-certificates curl gnupg lsb-release git build-essential
    $ sudo mkdir -m 0755 -p /etc/apt/keyrings
    $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    $ echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    $ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # This command allow you to use Docker without being root.
    # You MUST logout then login after, or reboot your computer.
    $ sudo usermod -aG docker $USER

Install Node.js and yarn. There are several ways to do that.

    $ curl https://get.volta.sh | bash
    $ source ~/.bashrc  # or restart your terminal
    $ volta install node@18
    $ npm i -g yarn

Clone source code:

    $ git clone https://gitlab.com/abc-map/abc-map.git
    $ cd abc-map

### Windows 11, Windows Subsystem for Linux version 2 (not recommended)

Install WSL, see: [https://docs.microsoft.com/en-us/windows/wsl/install](https://docs.microsoft.com/en-us/windows/wsl/install)

Download and install Docker Desktop with WSL backend, see [https://docs.docker.com/desktop/windows/wsl/](https://docs.docker.com/desktop/windows/wsl/)

If everything works fine, you can launch the Ubuntu application, then type these commands:

    $ sudo apt update

    ...
    Reading package lists... Done
    Building dependency tree
    Reading state information... Done
    ...

    $ docker run hello-world

    ...
    Hello from Docker!
    This message shows that your installation appears to be working correctly.
    ...

Install basic tools and dependencies

    $ sudo apt update
    $ sudo apt install -y git curl build-essential

Install Node.js and yarn. There are several ways to do that.

    $ curl https://get.volta.sh | bash
    $ source ~/.bashrc  # or restart your terminal
    $ volta install node@18
    $ npm i -g yarn

Clone source code then start and IDE (per example VSCode):

    # Clone source code
    $ git clone https://gitlab.com/abc-map/abc-map.git
    $ cd abc-map
    $ code .

Remarks:

- On the first start of Abc-Map, your firewall will ask you for permissions for Abc-Map and Docker, you must accept them
- You can install and use the Windows terminal to improve the display, otherwise you will see weird characters
- On first start, the frontend can be very slow

## Start and build Abc-Map locally

A tool called `abc-cli` helps to build and start the project.

The first time, or after a lot of modifications you must install dependencies and build the whole project:

    $ ./abc-cli install     # Install all dependencies. The first time it can take several minutes.
    $ ./abc-cli build       # Build all packages, needed the first time or after many changes.

Then you can start Abc-Map locally:

    $ ./abc-cli start

You can access the development frontend at [http://localhost:3005](http://localhost:3005).

Every time you modify sources you can apply your changes with:

    $ ./abc-cli watch

You can format your code with:

    $ ./abc-cli lint

See tool help for more commands:

    $ ./abc-cli help

You can build, test, start packages independently too:

    $ yarn run start:watch        # Start and reload on source change
    $ yarn run test               # Run tests once, may need build before
    $ yarn run test:interactive   # Run tests and rerun on source change, may need build before
    $ yarn run coverage           # Run tests and export coverage report, may need build before
    $ yarn run build              # Typescript build
    $ yarn run clean              # Clean build sources
    $ yarn run clean-build        # Guess what ?
    $ yarn run lint               # Apply eslint
    $ yarn run lint-fix           # Apply eslint and fix when possible
    $ yarn run dep-check          # Dependency analysis with dependency-cruiser

## Local services

After startup, several local services are accessible:

- A Mongodb instance on port `27019`
- A Mongo Express instance on port `27020`
- Abc-Map server on port `10082`. This port serves the backend API and the last frontend build.
- Webpack dev server on port `3005`

You can clean up local data using the command:

    $ ./abc-cli clean-restart-services

## Additional tools

With the configuration explained above, you can modify the source code but not all tests will pass and you will
not be able to deploy your own instance of Abc-Map

With these tools, all tests should pass, and you can deploy your own instance of Abc-Map.

- K6 (k6-v0.32.0): https://k6.io/docs/getting-started/installation/
- Kubectl (v1.22.3): https://kubernetes.io/fr/docs/tasks/tools/install-kubectl/
- Helm (v3.7.1): https://helm.sh/docs/intro/install/
- addlicense: https://github.com/google/addlicense
