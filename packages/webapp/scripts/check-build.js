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
