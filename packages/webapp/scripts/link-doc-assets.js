#!/usr/bin/env node

/*
 * This script copy user documentation assets to frontend build directory.
 */

const { execSync } = require('child_process');
const path = require('path');

const sourceDir = path.resolve(`../user-documentation/build/static/documentation-assets`);
const targetDir = path.resolve(`./public/static/documentation-assets`);

console.info(`Linking documentation assets`);

execSync(`rm -f ${targetDir}`, { cwd: process.cwd() });
execSync(`ln -s ${sourceDir} ${targetDir}`, { cwd: process.cwd() });
