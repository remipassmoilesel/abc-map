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
import { Views } from './Views';
import { AbcView } from '@abc-map/shared';
import View from 'ol/View';

describe('View', () => {
  it('defaultView()', () => {
    expect(Views.defaultView()).toEqual({
      resolution: 39135,
      center: [1113194.9079327357, 5621521.486192066],
      projection: {
        name: 'EPSG:3857',
      },
    });
  });

  it('random()', () => {
    const view = Views.random();
    expect(view.resolution).toBeDefined();
    expect(view.center).toBeDefined();
    expect(view.projection.name).toBeDefined();
  });

  it('abcToOl()', () => {
    // Prepare
    const original: AbcView = {
      resolution: 12345,
      center: [1113194, 5621521],
      projection: { name: 'EPSG:3857' },
    };

    // Act
    const actual = Views.abcToOl(original);

    // Assert
    expect(actual.getResolution()).toEqual(original.resolution);
    expect(actual.getCenter()).toEqual(original.center);
    expect(actual.getProjection().getCode()).toEqual(original.projection.name);
  });

  it('olToAbc()', () => {
    // Prepare
    const original: View = new View({
      resolution: 12345,
      center: [1113194, 5621521],
      projection: 'EPSG:3857',
    });

    // Act
    const actual = Views.olToAbc(original);

    // Assert
    expect(actual.resolution).toEqual(original.getResolution());
    expect(actual.center).toEqual(original.getCenter());
    expect(actual.projection.name).toEqual(original.getProjection().getCode());
  });
});
