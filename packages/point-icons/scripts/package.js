#!/usr/bin/env node

/*
 * This script copy point icons to server directory.
 */

const { execSync } = require('child_process');
const path = require('path');

const sourceDir = path.resolve(`${__dirname}/../icons`);
const targetDir = path.resolve(`${__dirname}/../../server/public/point-icons`);

console.info(`Copying point icons to ${targetDir}`);

execSync(`rm -rf ${targetDir}`);
execSync(`mkdir -p ${targetDir}`);
execSync(`cp -R ${sourceDir}/* ${targetDir}`);
