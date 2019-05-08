#!/usr/bin/env node

const {startGui, startApi} = require("./lib/start");

const {build} = require("./lib/build");
const {test} = require("./lib/test");
const {config} = require("./config");

function main() {

    const args = process.argv.map(arg => arg.trim()).slice(2);

    switch (args[0]) {
        case 'test': {
            return build(args, config)
                && test(args, config);
        }
        case 'build': {
            return build(args, config);
        }
        case 'start:api': {
            return startApi(args, config);
        }
        case 'start:gui': {
            return startGui(args, config);
        }
        case 'deploy': {
            return startDev(args, config);
        }
    }

}

main();
