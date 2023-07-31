#!/usr/bin/env node

/*
 * This script copy webapp build to server directory.
 */

const { execSync } = require('child_process');
const path = require('path');

const sourceDir = path.resolve(`${__dirname}/../build`);
const targetDir = path.resolve(`${__dirname}/../../server/public/webapp`);

console.info(`Copying webapp build to ${targetDir}`);

execSync(`rm -rf ${targetDir}`);
execSync(`mkdir -p ${targetDir}/assets`);
execSync(`cp -R ${sourceDir}/* ${targetDir}/assets`);
execSync(`mv ${targetDir}/assets/index.html ${targetDir}/index.html`);
execSync(`mv ${targetDir}/assets/error429.html ${targetDir}/error429.html`);
