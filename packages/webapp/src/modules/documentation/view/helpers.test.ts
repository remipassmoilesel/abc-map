/**
 * Copyright © 2023 Rémi Pace.
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
 *
 */

import { rewriteAssetsUrls, rewriteContentPath } from './helpers';

describe('helpers', () => {
  it('rewriteContentPath()', () => {
    expect(rewriteContentPath('/fr/modules/documentation')).toEqual('/documentation/fr/');
    expect(rewriteContentPath('/en/modules/documentation')).toEqual('/documentation/en/');
    expect(rewriteContentPath('/fr/modules/documentation/')).toEqual('/documentation/fr/');
    expect(rewriteContentPath('/fr/modules/documentation/reference/presentation')).toEqual('/documentation/fr/reference/presentation/');
    expect(rewriteContentPath('/fr/modules/documentation/reference/presentation/index.html')).toEqual('/documentation/fr/reference/presentation/');
  });

  it('rewriteAssetsUrls()', () => {
    // Prepare
    const content = document.createElement('div');

    const img = document.createElement('img');
    img.src = 'image.png';
    content.append(img);

    const video = document.createElement('video');
    video.src = 'video.mp4';
    content.append(video);

    const contentRoute = '/documentation/en/automated-test-target/';

    // Act
    rewriteAssetsUrls(content, contentRoute);

    // Assert
    expect(content.innerHTML).toMatchSnapshot();
  });
});
