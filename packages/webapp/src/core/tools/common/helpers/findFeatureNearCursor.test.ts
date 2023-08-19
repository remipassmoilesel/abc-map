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

import { FeatureFilter, findFeatureNearCursor, noopFilter } from './findFeatureNearCursor';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Polygon } from 'ol/geom';
import Geometry from 'ol/geom/Geometry';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';
import Point from 'ol/geom/Point';
import { TestHelper } from '../../../utils/test/TestHelper';

describe('findFeatureNearCursor', function () {
  it('should find nothing if source is empty', () => {
    const source = new VectorSource();
    const event = TestHelper.mapBrowserEvent({ coordinate: [1, 1] });

    const result = findFeatureNearCursor(event, source, noopFilter, 7);

    expect(result).toBeUndefined();
  });

  it('should find a geometry on coordinate', () => {
    const { source, feature1 } = testVectorSource1();
    const event = TestHelper.mapBrowserEvent({ coordinate: [2, 2] });

    const result = findFeatureNearCursor(event, source, noopFilter, 7);

    expect(result).toEqual(feature1);
  });

  it('should find a geometry near coordinate if nothing on', () => {
    const { source, feature2 } = testVectorSource1();
    const event = TestHelper.mapBrowserEvent({ coordinate: [120, 120] });

    const result = findFeatureNearCursor(event, source, noopFilter, 7);

    expect(result).toEqual(feature2);
  });

  it('should find nothing if nothing on and out of tolerance', () => {
    const { source } = testVectorSource1();
    const event = TestHelper.mapBrowserEvent({ coordinate: [128, 128] });

    const result = findFeatureNearCursor(event, source, noopFilter, 7);

    expect(result).toBeUndefined();
  });

  it('should use filter if position on geometry', () => {
    const { source } = testVectorSource2();
    const filter: FeatureFilter = (f) => f.getGeometry() instanceof Polygon;
    const event = TestHelper.mapBrowserEvent({ coordinate: [111, 111] });

    const result = findFeatureNearCursor(event, source, filter, 7);

    expect(result).toBeUndefined();
  });

  it('should use filter if position near geometry', () => {
    const { source } = testVectorSource2();
    const filter: FeatureFilter = (f) => f.getGeometry() instanceof Polygon;
    const event = TestHelper.mapBrowserEvent({ coordinate: [115, 115] });

    const result = findFeatureNearCursor(event, source, filter, 7);

    expect(result).toBeUndefined();
  });

  it('should use style properties for tolerance', () => {
    const { source, feature2 } = testVectorSource2();
    const event = TestHelper.mapBrowserEvent({ coordinate: [125, 125] });

    const result = findFeatureNearCursor(event, source, noopFilter, 0);

    expect(result).toEqual(feature2);
  });
});

function testVectorSource1(): { source: VectorSource<Geometry>; feature1: Feature<Geometry>; feature2: Feature<Geometry> } {
  const source = new VectorSource();
  const feature1 = new Feature(
    new Polygon([
      [
        [1, 1],
        [3, 1],
        [3, 3],
        [1, 3],
        [1, 1],
      ],
    ])
  );
  source.addFeature(feature1);

  const feature2 = new Feature(
    new Polygon([
      [
        [111, 111],
        [113, 111],
        [113, 113],
        [111, 113],
        [111, 111],
      ],
    ])
  );
  source.addFeature(feature2);

  return { source, feature1, feature2 };
}

function testVectorSource2(): { source: VectorSource<Geometry>; feature1: Feature<Geometry>; feature2: Feature<Geometry> } {
  const source = new VectorSource();
  const feature1 = FeatureWrapper.create(
    new Polygon([
      [
        [1, 1],
        [3, 1],
        [3, 3],
        [1, 3],
        [1, 1],
      ],
    ])
  );
  source.addFeature(feature1.unwrap());

  const feature2 = FeatureWrapper.create(new Point([111, 111])).setStyleProperties({
    point: {
      size: 5,
    },
    stroke: {
      width: 10,
    },
  });

  source.addFeature(feature2.unwrap());

  return { source, feature1: feature1.unwrap(), feature2: feature2.unwrap() };
}
