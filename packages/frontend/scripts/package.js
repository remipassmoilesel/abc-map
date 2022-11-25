#!/usr/bin/env node

/*
 * This script copy frontend build result to backend.
 */

const {execSync} = require('child_process');
const path = require('path');


const sourceDir = path.resolve(`${__dirname}/../build`);
const targetDir = path.resolve(`${__dirname}/../../server/public`);

console.info(`Copying frontend distribution to ${targetDir}`);

execSync(`rm -rf ${targetDir}`);
execSync(`mkdir -p ${targetDir}/assets`);
execSync(`cp -R ${sourceDir}/* ${targetDir}/assets`);
execSync(`mv ${targetDir}/assets/index.html ${targetDir}/index.html`);
execSync(`mv ${targetDir}/assets/error429.html ${targetDir}/error429.html`);

