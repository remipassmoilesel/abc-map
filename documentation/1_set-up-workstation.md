# Set up a developer workstation

<!-- toc -->

- [Introduction](#introduction)
- [Basic setup](#basic-setup)
  - [Ubuntu 22.04 (recommended)](#ubuntu-2204-recommended)
  - [Fedora 42](#fedora-42)
  - [Windows 11, Windows Subsystem for Linux version 2 (not recommended)](#windows-11-windows-subsystem-for-linux-version-2-not-recommended)
- [Start and build Abc-Map locally](#start-and-build-abc-map-locally)
- [Local services](#local-services)
- [Additional tools](#additional-tools)

<!-- tocstop -->

## Introduction

This document explains how to set up a development workstation. This document will guide you through
the installation of dependencies needed to start, build and modify Abc-Map.

Although these operations are simple and common, apply the steps described below with caution.

This setup has been tested on these operating systems:

- Fedora 42
- Manjaro Linux
- Ubuntu 22.04
- Windows 11, Windows Subsystem for Linux version 2

**The easiest and most reliable way to start developing on Abc-Map is to use Ubuntu LTS.**

## Basic setup

### Ubuntu 22.04 (recommended)

Install basic tools and dependencies:

    $ sudo apt-get update
    $ sudo apt-get install ca-certificates curl gnupg lsb-release git libcairo2-dev libjpeg8-dev libpango1.0-dev \
        libgif-dev build-essential g++
    $ sudo mkdir -m 0755 -p /etc/apt/keyrings
    $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    $ echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    $ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # This command allow you to use Docker without being root.
    # You MUST logout then login after, or reboot your computer.
    $ sudo usermod -aG docker $USER

Install Node.js and pnpm. There are several ways to do that.

    $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    $ curl -fsSL https://get.pnpm.io/install.sh | sh -
    $ source ~/.bashrc  # or restart your terminal

Clone source code:

    $ git clone https://gitlab.com/abc-map/abc-map.git
    $ cd abc-map

### Fedora 42

Install dependencies:

    $ sudo dnf install @development-tools make automake gcc gcc-c++ g++ kernel-devel cairo-devel  \
        cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-devel

Install Docker:

    $ sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    $ sudo systemctl enable --now docker
    $ sudo usermod -aG docker $USER

Install Node.js and pnpm. There are several ways to do that.

    $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    $ curl -fsSL https://get.pnpm.io/install.sh | sh -
    $ source ~/.bashrc  # or restart your terminal

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

Then follow the steps in the "Ubuntu 22.04" section, excluding "docker" related commands.

Remarks:

- On the first start of Abc-Map, your firewall will ask you for permissions for Abc-Map and Docker, you must accept them
- You can install and use the Windows terminal to improve the display, otherwise you will see weird characters
- On first start, webapp server can be very slow

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

    $ pnpm run start:watch            # Start and reload on source change
    $ pnpm run test                   # Run tests once, may need build before
    $ pnpm run test:interactive       # Run tests and rerun on source change, may need build before
    $ pnpm run coverage               # Run tests and export coverage report, may need build before
    $ pnpm run build                  # Typescript build
    $ pnpm run clean                  # Clean build sources
    $ pnpm run clean-build            # Guess what ?
    $ pnpm run lint                   # Apply eslint
    $ pnpm run lint:fix               # Apply eslint and fix when possible
    $ pnpm run dependency-check       # Dependency analysis with dependency-cruiser

All commands available with `pnpm` and `turborepo` obviously works !

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

- `K6` (v1.7.1): https://k6.io/docs/getting-started/installation/
- `Kubectl` (v1.29.15): https://kubernetes.io/fr/docs/tasks/tools/install-kubectl/
- `Helm` (v4.1.4): https://helm.sh/docs/intro/install/
- `addlicense`: https://github.com/google/addlicense

You may also need `mongodump` and `mongorestore` (v100.16.0).
