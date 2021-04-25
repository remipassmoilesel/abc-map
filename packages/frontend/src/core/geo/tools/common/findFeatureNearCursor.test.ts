import { FeatureFilter, findFeatureNearCursor, noopFilter } from './findFeatureNearCursor';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Coordinate } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Polygon } from 'ol/geom';
import Geometry from 'ol/geom/Geometry';
import { FeatureWrapper } from '../../features/FeatureWrapper';
import Point from 'ol/geom/Point';

describe('findFeatureNearCursor', function () {
  it('should find nothing if source is empty', () => {
    const source = new VectorSource();

    const result = findFeatureNearCursor(fakeEvent([1, 1]), source, noopFilter, 7);

    expect(result).toBeUndefined();
  });

  it('should find a geometry on coordinate', () => {
    const { source, feature1 } = testVectorSource1();

    const result = findFeatureNearCursor(fakeEvent([2, 2]), source, noopFilter, 7);

    expect(result).toEqual(feature1);
  });

  it('should find a geometry near coordinate if nothing on', () => {
    const { source, feature2 } = testVectorSource1();

    const result = findFeatureNearCursor(fakeEvent([120, 120]), source, noopFilter, 7);

    expect(result).toEqual(feature2);
  });

  it('should find nothing if nothing on and out of tolerance', () => {
    const { source } = testVectorSource1();

    const result = findFeatureNearCursor(fakeEvent([128, 128]), source, noopFilter, 7);

    expect(result).toBeUndefined();
  });

  it('should use filter if position on geometry', () => {
    const { source } = testVectorSource2();
    const filter: FeatureFilter = (f) => f.getGeometry() instanceof Polygon;

    const result = findFeatureNearCursor(fakeEvent([111, 111]), source, filter, 7);

    expect(result).toBeUndefined();
  });

  it('should use filter if position near geometry', () => {
    const { source } = testVectorSource2();
    const filter: FeatureFilter = (f) => f.getGeometry() instanceof Polygon;

    const result = findFeatureNearCursor(fakeEvent([115, 115]), source, filter, 7);

    expect(result).toBeUndefined();
  });

  it('should use style properties for tolerance', () => {
    const { source, feature2 } = testVectorSource2();

    const result = findFeatureNearCursor(fakeEvent([125, 125]), source, noopFilter, 0);

    expect(result).toEqual(feature2);
  });
});

function fakeEvent(coordinate: Coordinate): MapBrowserEvent<UIEvent> {
  return {
    coordinate,
    map: {
      getView() {
        return {
          getResolution() {
            return 2;
          },
        };
      },
    },
  } as any;
}

function testVectorSource1(): { source: VectorSource; feature1: Feature<Geometry>; feature2: Feature<Geometry> } {
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

function testVectorSource2(): { source: VectorSource; feature1: Feature<Geometry>; feature2: Feature<Geometry> } {
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
