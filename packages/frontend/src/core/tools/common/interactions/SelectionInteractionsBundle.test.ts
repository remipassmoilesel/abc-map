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
import { SelectionInteractionsBundle } from './SelectionInteractionsBundle';
import GeometryType from 'ol/geom/GeometryType';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';
import { LineString, Point, Polygon } from 'ol/geom';

describe('SelectionInteractionsBundle', () => {
  let testMap: DrawingTestMap;
  let interactions: SelectionInteractionsBundle;

  beforeEach(async () => {
    testMap = new DrawingTestMap();
    await testMap.init();

    interactions = new SelectionInteractionsBundle({ condition: () => true });
    interactions.setup(testMap.getMap(), testMap.getVectorSource(), [GeometryType.LINE_STRING]);
  });

  it('setup()', () => {
    expect(TestHelper.interactionNames(testMap.getMap())).toEqual(['Select']);
  });

  it('select should work', async () => {
    // Prepare
    const feature1 = FeatureWrapper.create(
      new LineString([
        [0, 0],
        [5, 5],
      ])
    );
    feature1.setDefaultStyle();
    testMap.getVectorSource().addFeature(feature1.unwrap());

    // Act
    await testMap.click(5, 5);

    // Assert
    expect(feature1.isSelected()).toEqual(true);
  });

  it('select should filter by layer', async () => {
    // Prepare
    const feature1 = FeatureWrapper.create(
      new LineString([
        [0, 0],
        [5, 5],
      ])
    );
    feature1.setDefaultStyle();
    testMap.getVectorSource().addFeature(feature1.unwrap());

    testMap.getVectorLayer().setActive(false);

    // Act
    await testMap.click(5, 5);

    // Assert
    expect(feature1.isSelected()).toEqual(false);
  });

  it('select should filter by geometry type', async () => {
    // Prepare
    const feature1 = FeatureWrapper.create(
      new Polygon([
        [
          [0, 0],
          [5, 5],
          [10, 10],
        ],
      ])
    );
    feature1.setDefaultStyle();
    testMap.getVectorSource().addFeature(feature1.unwrap());

    // Act
    await testMap.click(5, 5);

    // Assert
    expect(feature1.isSelected()).toEqual(false);
  });

  it('add features to source should add them to selection', () => {
    const feature = FeatureWrapper.create(new Point([0, 0]));
    feature.setSelected(true);

    testMap.getVectorSource().addFeature(feature.unwrap());

    expect(interactions.getFeatures().getArray()).toEqual([feature.unwrap()]);
  });

  it('remove features from source should remove them to selection', () => {
    const feature = FeatureWrapper.create(new Point([0, 0]));
    feature.setSelected(true);
    testMap.getVectorSource().addFeature(feature.unwrap());

    testMap.getVectorSource().removeFeature(feature.unwrap());

    expect(interactions.getFeatures().getArray()).toEqual([]);
    expect(feature.isSelected()).toEqual(false);
  });

  it('add feature should filter deselected features from selection', () => {
    // Prepare
    const feature1 = FeatureWrapper.create(new Point([0, 0]));
    feature1.setSelected(true);

    // We add feature then unselect it
    testMap.getVectorSource().addFeature(feature1.unwrap());
    feature1.setSelected(false);

    const feature2 = FeatureWrapper.create(new Point([0, 0]));
    feature2.setSelected(true);

    // Act
    testMap.getVectorSource().addFeature(feature2.unwrap());

    // Assert
    expect(interactions.getFeatures().getArray()).toEqual([feature2.unwrap()]);
  });

  it('dispose()', () => {
    interactions.dispose();

    expect(TestHelper.interactionNames(testMap.getMap())).toEqual([]);
  });
});
