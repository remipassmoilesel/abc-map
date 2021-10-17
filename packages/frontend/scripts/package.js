#!/usr/bin/env node

// Here we copy frontend build to public backend dir.
// We could use frontend as a dependency but dependency management is messy afterwards (more than usual lol).

const {execSync} = require('child_process');
const path = require('path');


const sourceDir = path.resolve(`${__dirname}/../build`);
const targetDir = path.resolve(`${__dirname}/../../server/public`);

console.info(`\nCopying frontend distribution to ${targetDir}`);

execSync(`rm -rf ${targetDir}`);
execSync(`cp -R ${sourceDir} ${targetDir}`);

