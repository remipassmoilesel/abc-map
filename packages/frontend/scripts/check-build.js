#!/usr/bin/env node

/*

This script check that build "looks" correct. With React CRA, sometimes build can fail silently, without emitting
files. This can happen when there are errors in worker code for example.

 */

const fs = require('fs');
const path = require('path');

const root = path.resolve('build');
const files = ['index.html', 'static', 'static/css', 'static/js'];

files.forEach((relativePath) => {
  const fullPath = path.resolve(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`ERROR: file '${fullPath}' cannot be found, frontend build is broken`);
  }
});
