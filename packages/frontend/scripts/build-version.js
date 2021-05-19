#!/usr/bin/env node
/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

/* This script generate a file with current git hash and build date in source directory. */

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

// Fetch informations
const build = {
  date: new Date().toISOString(),
  hash: childProcess.execSync('git rev-parse HEAD').toString('utf-8').substring(0, 20),
};
const filePath = path.resolve(process.cwd(), 'src', 'build-version.ts');

// Template file in src dir
const fileContent = `\
/* eslint-disable */
// WARNING: THIS FILE IS GENERATED, DO NOT MANUALLY EDIT
export const BUILD_INFO = ${JSON.stringify(build, null, 4)};
`;
fs.writeFileSync(filePath, fileContent, { encoding: 'utf-8' });

console.log(`Wrote version info ${build.hash} to ${filePath}`);
