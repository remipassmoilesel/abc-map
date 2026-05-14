#!/usr/bin/env node

/*
 * This script copy webapp build to server directory.
 */

import { execSync } from 'child_process';
import path from 'path';

const sourceDir = path.resolve(`${import.meta.dirname}/../build`);
const targetDir = path.resolve(`${import.meta.dirname}/../../server/public/webapp`);

console.info(`Copying webapp build to ${targetDir}`);

execSync(`rm -rf ${targetDir}`);
execSync(`mkdir -p ${targetDir}/assets`);
execSync(`cp -R ${sourceDir}/* ${targetDir}/assets`);
execSync(`mv ${targetDir}/assets/index.html ${targetDir}/index.html`);
execSync(`mv ${targetDir}/assets/error429.html ${targetDir}/error429.html`);
