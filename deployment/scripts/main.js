#!/usr/bin/env node

const {databaseStart, databaseStop, databaseClean} = require("./lib/database");

const {startGui, startApi} = require("./lib/start");
const {build} = require("./lib/build");
const {deploy} = require("./lib/deploy");
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
        case 'start:gui': {
            return startGui(args, config);
        }
        case 'start:api': {
            return startApi(args, config);
        }
        case 'database:start': {
            return databaseStart(args, config);
        }
        case 'database:stop': {
            return databaseStop(args, config);
        }
        case 'database:clean': {
            databaseStop(args, config);
            return databaseClean(args, config);
        }
        case 'deploy': {
            return deploy(args, config);
        }
        default: {
            throw new Error(`Invalid command: ${args.join(' ')}`)
        }
    }

}

main();
