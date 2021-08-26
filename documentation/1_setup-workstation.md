# Setup development workstation

**The development environment has only been tested under GNU / Linux, it will not work on Windows.**

Windows is supported as a target operating system, via browsers. It will never be actively supported 
as a development operating system.     


## Minimal setup

With this setup, you can modify project but all tests will not pass and you can not deploy.


For Debian like and Ubuntu:

    # Install git, docker and tools
    $ sudo apt install git docker.io docker-compose curl build-essential
    
    # This command allow you to use Docker without being root. 
    # You MUST logout then login after, or reboot your computer.
    $ sudo usermod -aG docker $USER

    # Install NodeJS and yarn. There are several ways to do that, but n rocks !
    # You MUST restart your terminal after.
    $ curl -L https://git.io/n-install | bash
    $ npm i -g yarn

    # Clone source code
    $ git clone https://gitlab.com/abc-map/abc-map.git
    $ cd abc-map


A CLI tool builds and starts the project:  

    $ ./abc-cli install     # Install all dependencies
    $ ./abc-cli build       # Build all packages, needed the first time or after many changes
    $ ./abc-cli start       # Start application


You can watch sources with:  

    $ ./abc-cli watch


See CLI help for more commands:

    $ ./abc-cli help


After start, several services are launched on start:
- A Mongodb instance on port 27019
- A Mongo Express instance on port 27020
- Backend server on port 10082
- Webpack dev server on port 3005


You can clean local data by using command:

    $ ./abc-cli clean-restart-services


## Additional tools

With these tools, all tests should pass, and you can deploy your own instance of Abc-Map.

TODO:
- K6
- Kubectl
- Helm

