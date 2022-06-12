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
import { deepFreeze } from '../utils/deepFreeze';

describe('Views', () => {
  it('defaultView()', () => {
    expect(Views.defaultView()).toEqual({
      resolution: 39135,
      center: [1113194.9079327357, 5621521.486192066],
      rotation: 0,
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
      rotation: 7,
    };

    // Act
    const actual = Views.abcToOl(original);

    // Assert
    expect(actual.getResolution()).toEqual(original.resolution);
    expect(actual.getCenter()).toEqual(original.center);
    expect(actual.getProjection().getCode()).toEqual(original.projection.name);
    expect(actual.getRotation()).toEqual(7);
  });

  describe('olToAbc()', () => {
    it('should translate', () => {
      // Prepare
      const original = new View({
        resolution: 12345,
        center: [1113194, 5621521],
        projection: 'EPSG:3857',
        rotation: 7,
      });

      // Act
      const actual = Views.olToAbc(original);

      // Assert
      expect(actual).toEqual({
        resolution: 12345,
        center: [1113194, 5621521],
        rotation: 7,
        projection: {
          name: 'EPSG:3857',
        },
      });
    });

    it('should use default view if no values set', () => {
      // Prepare
      const original = new View({});

      // Act
      const actual = Views.olToAbc(original);

      // Assert
      expect(actual.resolution).toEqual(39135);
      expect(actual.center).toEqual([1113194.907932736, 5621521.486192066]);
      expect(actual.projection.name).toEqual(original.getProjection().getCode());
    });

    it('should limit precision to prevent weird comparison issues', () => {
      // Prepare
      const original = new View({
        resolution: 12345,
        center: [1113194.777777777, 5621521.777777777],
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

  it('normalize()', () => {
    const view: AbcView = deepFreeze({
      resolution: 1.8888888888,
      center: [2.7777777777, 3.6666666666],
      projection: {
        name: 'EPSG:3857',
      },
      rotation: 7,
    });

    expect(Views.normalize(view)).toEqual({
      resolution: 1.888888889,
      center: [2.777777778, 3.666666667],
      projection: {
        name: 'EPSG:3857',
      },
      rotation: 7,
    });
  });
});
