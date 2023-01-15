/**
 * Copyright © 2022 Rémi Pace.
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

import * as Cypress from 'cypress';

export class BrowserConfig {
  public static setupNodeEvents(on: Cypress.PluginEvents) {
    on('before:browser:launch', (browser, launchOptions) => {
      // Set windows size on launch for CI
      // Even if we set viewport size, window size affect PDF and PNG rendering
      const width = 1920;
      const height = 1080;

      if (browser.name === 'chrome' || browser.name === 'chromium') {
        launchOptions.args.push(`--window-size=${width},${height}`);

        // force screen to be non-retina and just use our given resolution
        launchOptions.args.push('--force-device-scale-factor=1');
      } else if (browser.name === 'electron') {
        // might not work on CI for some reason
        launchOptions.preferences.width = width;
        launchOptions.preferences.height = height;
      } else if (browser.name === 'firefox') {
        launchOptions.args.push(`--width=${width}`);
        launchOptions.args.push(`--height=${height}`);
      } else {
        // eslint-disable-next-line no-console
        console.error('Cannot set window size for runner, tests may fail.');
      }

      return launchOptions;
    });
  }
}
