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

export class UrlHelper {
  /**
   * Update specified URL, replace host and port part if they do not match E2E config
   *
   * @param url
   */
  public static adaptToConfig(url: string) {
    const urlMatch = url.match(/^(http:\/\/localhost:[0-9]+)(.+)/);
    const host = urlMatch?.length ? urlMatch[1] : undefined;
    const path = urlMatch?.length && urlMatch?.length > 1 ? urlMatch[2] : undefined;

    if (host !== Cypress.config('baseUrl')) {
      const newUrl = `${Cypress.config('baseUrl')}${path}`;
      cy.log(`URL has been updated from ${url.substring(0, 60)}... to ${newUrl.substring(0, 60)}...`);
      return newUrl;
    }

    return url;
  }
}
