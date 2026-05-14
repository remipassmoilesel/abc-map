#!/usr/bin/env node
/**
 * Copyright © 2026 Rémi Pace.
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
 * This script copy point icons to server directory.
 */

import { execSync } from 'child_process';
import path from 'path';

const sourceDir = path.resolve(`${import.meta.dirname}/../icons`);
const targetDir = path.resolve(`${import.meta.dirname}/../../server/public/point-icons`);

console.info(`Copying point icons to ${targetDir}`);

execSync(`rm -rf ${targetDir}`);
execSync(`mkdir -p ${targetDir}`);
execSync(`cp -R ${sourceDir}/* ${targetDir}`);
