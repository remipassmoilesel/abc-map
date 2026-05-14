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

import { defineConfig } from 'cypress';
import { BrowserConfig } from './src/plugins/BrowserConfig';
import { PngComparison } from './src/plugins/PngComparison';
import path from 'path';

const baseUrl = process.env.ABC_CYPRESS_BASE_URL || 'http://localhost:3005';

export default defineConfig({
  video: false,
  watchForFileChanges: false,
  // We do not keep tests in memory in order to reduce the use of resources and make the tests more reliable
  numTestsKeptInMemory: 0,
  screenshotsFolder: path.resolve(import.meta.dirname, 'screenshots'),
  downloadsFolder: path.resolve(import.meta.dirname, 'downloads'),
  videosFolder: path.resolve(import.meta.dirname, 'videos'),
  e2e: {
    setupNodeEvents(on, config) {
      BrowserConfig.setupNodeEvents(on);
      PngComparison.setupNodeEvents(on);
    },
    baseUrl,
    specPattern: 'src/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'src/support/index.ts',
  },
  retries: {
    openMode: 0,
    runMode: 2,
  },
  pageLoadTimeout: 15_000,
  defaultCommandTimeout: 6_000,
  allowCypressEnv: false,
  experimentalRunAllSpecs: true,
});
