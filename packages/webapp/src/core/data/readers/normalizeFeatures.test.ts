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
 */

import Feature from 'ol/Feature';
import { GeometryCollection, Point } from 'ol/geom';
import { logger, normalizeFeatures } from './normalizeFeatures';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import uniq from 'lodash/uniq';

logger.disable();

describe('normalizeFeatures()', () => {
  it('should skip invalid features', () => {
    // Prepare
    const feat1 = FeatureWrapper.create(new Point([1, 2]));
    const feat2 = new Feature();
    const input = [feat1.unwrap(), feat2];

    // Act
    const normalized = normalizeFeatures(input);

    // Assert
    expect(normalized).toHaveLength(1);
    expect(normalized[0].getId()).toEqual(feat1.getId());
  });

  it('should set ids', () => {
    // Prepare
    const feat1 = FeatureWrapper.create(new Point([1, 2])).setId(undefined);
    const feat2 = FeatureWrapper.create(new Point([1, 2])).setId(undefined);
    const input = [feat1.unwrap(), feat2.unwrap()];

    // Act
    const normalized = normalizeFeatures(input);

    // Assert
    expect(normalized).toHaveLength(2);
    expect(normalized[0].getId()).toBeDefined();
    expect(normalized[1].getId()).toBeDefined();
  });

  it('should not overwrite ids', () => {
    // Prepare
    const feat1 = FeatureWrapper.create(new Point([1, 2])).setId(undefined);
    const feat2 = FeatureWrapper.create(new Point([1, 2]));
    const feat2Id = feat2.getId();
    const input = [feat1.unwrap(), feat2.unwrap()];

    // Act
    const normalized = normalizeFeatures(input);

    // Assert
    expect(normalized).toHaveLength(2);
    expect(normalized[0].getId()).toBeDefined();
    expect(normalized[1].getId()).toEqual(feat2Id);
  });

  it('should unselect features', () => {
    // Prepare
    const feat1 = FeatureWrapper.create(new Point([1, 2]))
      .setId(undefined)
      .setSelected(true);
    const feat2 = FeatureWrapper.create(new Point([1, 2])).setId(undefined);
    const input = [feat1.unwrap(), feat2.unwrap()];

    // Act
    const normalized = normalizeFeatures(input);

    // Assert
    expect(normalized).toHaveLength(2);
    expect(FeatureWrapper.from(normalized[0]).isSelected()).toEqual(false);
    expect(FeatureWrapper.from(normalized[1]).isSelected()).toEqual(false);
  });

  it('should split geometry collections', () => {
    // Prepare
    const feat1 = FeatureWrapper.create(new Point([11, 22])).setId(undefined);

    const geometries = [new Point([1, 2]), new Point([3, 4]), new Point([5, 6])];
    const feat2 = FeatureWrapper.create(new GeometryCollection(geometries)).setId(undefined);
    feat2.setDataProperties({ name: 'Gull nest', reference: '1234' });

    const input = [feat1.unwrap(), feat2.unwrap()];

    // Act
    const normalized = normalizeFeatures(input);

    // Assert
    expect(normalized).toHaveLength(4);
    expect((normalized[0].getGeometry() as Point).getCoordinates()).toEqual([11, 22]);
    expect((normalized[1].getGeometry() as Point).getCoordinates()).toEqual([1, 2]);
    expect((normalized[2].getGeometry() as Point).getCoordinates()).toEqual([3, 4]);
    expect((normalized[3].getGeometry() as Point).getCoordinates()).toEqual([5, 6]);

    // We ensure that ids have been set and are different
    const ids = normalized.map((f) => f.getId());
    expect(ids.filter((f) => !f)).toHaveLength(0);
    expect(uniq(ids)).toHaveLength(4);
  });
});
