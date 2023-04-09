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

import { toPrecision } from '../../core/utils/numbers';

export function responsiveIframeIntegration(publicLink: string, width: number, height: number): string {
  // See: https://www.w3schools.com/howto/howto_css_responsive_iframes.asp
  return formatCode(`
        <div style="max-width: ${width}px">
          <div style="position: relative; padding-bottom: ${toPrecision((height / width) * 100, 2)}%; padding-top: 25px; height: 0">
              <iframe src="${publicLink}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"></iframe>
          </div>
        </div>
  `);
}

export function classicIframeIntegration(publicLink: string, width: number, height: number): string {
  return formatCode(`<iframe src="${publicLink}" width="${width}" height="${height}"></iframe>`);
}

function formatCode(code: string): string {
  return code
    .split('\n')
    .map((line) => line.trim())
    .join('');
}
