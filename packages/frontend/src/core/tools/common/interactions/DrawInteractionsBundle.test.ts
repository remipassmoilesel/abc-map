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

import { DrawingTestMap } from './DrawingTestMap.test.helpers';
import { TestHelper } from '../../../utils/test/TestHelper';
import { DrawInteractionsBundle } from './DrawInteractionsBundle';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Collection from 'ol/Collection';
import sinon from 'sinon';
import Feature from 'ol/Feature';
import GeometryType from 'ol/geom/GeometryType';

/**
 * These interactions are tested through map tools (linestring tool, polygon tool, point tool)
 */
describe('DrawInteractionsBundle', () => {
  let testMap: DrawingTestMap;
  let interactions: DrawInteractionsBundle;

  beforeEach(async () => {
    testMap = new DrawingTestMap();
    await testMap.init();

    interactions = new DrawInteractionsBundle({
      type: GeometryType.LINE_STRING,
      getStyle: sinon.stub(),
      drawCondition: sinon.stub(),
      modifyCondition: sinon.stub(),
    });
    const source = new VectorSource<Geometry>();
    const selection = new Collection<Feature<Geometry>>();
    interactions.setup(testMap.getMap(), source, selection);
  });

  it('setup()', () => {
    expect(TestHelper.interactionNames(testMap.getMap())).toEqual(['Modify', 'Snap', 'Draw']);
  });

  it('dispose()', () => {
    interactions.dispose();

    expect(TestHelper.interactionNames(testMap.getMap())).toEqual([]);
  });
});
