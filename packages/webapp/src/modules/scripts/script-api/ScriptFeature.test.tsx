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

import { Point } from 'ol/geom';
import { ScriptFeature } from './ScriptFeature';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';

describe('ScriptFeature', () => {
  it('getGeometry()', () => {
    const point = new Point([-4598015.070240992, 6195706.806032903]);
    const feature = new ScriptFeature(new Feature<Geometry>(point), { name: 'EPSG:3857' });

    expect(feature.getGeometry()).toMatchSnapshot();
  });

  it('setGeometry()', () => {
    const point = new Point([-4598015.070240992, 6195706.806032903]);
    const feature = new ScriptFeature(new Feature<Geometry>(point), { name: 'EPSG:3857' });

    feature.setGeometry({
      type: 'Point',
      coordinates: [-41, 49],
    });

    expect(feature.getGeometry()).toMatchSnapshot();
    expect((feature.unwrap().getGeometry() as Point).getCoordinates()).toMatchSnapshot();
  });
});
