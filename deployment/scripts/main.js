#!/usr/bin/env node

const {build} = require("./lib/build");
const {config} = require("./config");

function main() {

    const args = process.argv.map(arg => arg.trim()).slice(2);

    switch (args[0]) {
        case 'test': {
            return test(args, config);
        }
        case 'build': {
            return build(args, config);
        }
        case 'start:dev': {
            return startDev(args, config);
        }
    }

}

main();
