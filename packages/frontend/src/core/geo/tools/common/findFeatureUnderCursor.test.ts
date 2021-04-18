import { findFeatureUnderCursor } from './findFeatureUnderCursor';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Coordinate } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Polygon } from 'ol/geom';
import Geometry from 'ol/geom/Geometry';

describe('findFeatureUnderCursor', function () {
  it('should find nothing if source is empty', () => {
    const source = new VectorSource();

    const result = findFeatureUnderCursor(fakeEvent([1, 1]), source);

    expect(result).toBeUndefined();
  });

  it('should find a geometry on coordinate', () => {
    const { source, feature1 } = testVectorSource();

    const result = findFeatureUnderCursor(fakeEvent([2, 2]), source);

    expect(result).toEqual(feature1);
  });

  it('should find a geometry near coordinate if nothing on', () => {
    const { source, feature2 } = testVectorSource();

    const result = findFeatureUnderCursor(fakeEvent([120, 120]), source);

    expect(result).toEqual(feature2);
  });

  it('should find nothing if nothing on and out of tolerance', () => {
    const { source } = testVectorSource();

    const result = findFeatureUnderCursor(fakeEvent([128, 128]), source);

    expect(result).toBeUndefined();
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

function testVectorSource(): { source: VectorSource; feature1: Feature<Geometry>; feature2: Feature<Geometry> } {
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
