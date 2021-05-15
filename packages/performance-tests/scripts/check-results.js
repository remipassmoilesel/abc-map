/*
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
 *
 *
 */

/*
 * This scripts reads test-results.json then exit(0) if no requests failed, 1 otherwise.
 *
 * TODO: we should fail if performance drops here.
 */

const results = require('../test-results.json');

// If many tests are failed, report shape can change
const fails = results?.metrics?.checks?.fails ?? 'Invalid report';

if (fails) {
  console.error('Some requests failed. ');
  process.exit(1);
} else {
  console.info('Tests passed, hope so !');
  process.exit(0);
}
