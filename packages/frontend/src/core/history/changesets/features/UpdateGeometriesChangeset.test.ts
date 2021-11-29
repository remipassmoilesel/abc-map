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

import { Point } from 'ol/geom';
import { UpdateGeometriesChangeset } from './UpdateGeometriesChangeset';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';

describe('UpdateGeometriesChangeset', function () {
  let feature: FeatureWrapper;
  let before: Point;
  let after: Point;
  let changeset: UpdateGeometriesChangeset;

  beforeEach(() => {
    feature = FeatureWrapper.create();
    before = new Point([16, 48]);
    after = new Point([12, 12]);
    const item = {
      feature,
      before,
      after,
    };
    changeset = new UpdateGeometriesChangeset([item]);
  });

  it('should undo', async () => {
    await changeset.undo();

    expect(feature.getGeometry()).toBeInstanceOf(Point);
    expect((feature.getGeometry() as Point).getCoordinates()).toEqual([16, 48]);
    expect(feature.getGeometry() === before).toBeFalsy();
  });

  it('should redo', async () => {
    await changeset.apply();

    expect(feature.getGeometry()).toBeInstanceOf(Point);
    expect((feature.getGeometry() as Point).getCoordinates()).toEqual([12, 12]);
    expect(feature.getGeometry() === after).toBeFalsy();
  });
});
