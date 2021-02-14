import { Feature } from 'ol';
import GeometryType from 'ol/geom/GeometryType';
import { logger, SelectionStyle } from './SelectionStyle';

logger.disable();

describe('SelectionStyle', function () {
  describe('getForFeature()', function () {
    it('Point', function () {
      const feature = fakeFeature(GeometryType.POINT);
      expect(SelectionStyle.getForFeature(feature)).toHaveLength(1);
    });

    it('LineString', function () {
      const feature = fakeFeature(GeometryType.LINE_STRING);
      expect(SelectionStyle.getForFeature(feature)).toHaveLength(1);
    });

    it('Polygon', function () {
      const feature = fakeFeature(GeometryType.POLYGON);
      expect(SelectionStyle.getForFeature(feature)).toHaveLength(1);
    });

    it('Circle', function () {
      const feature = fakeFeature(GeometryType.CIRCLE);
      expect(SelectionStyle.getForFeature(feature)).toHaveLength(2);
    });

    it('Non supported type', function () {
      const feature = fakeFeature('non supported' as GeometryType);
      expect(SelectionStyle.getForFeature(feature)).toHaveLength(0);
    });
  });
});

function fakeFeature(geom: GeometryType): Feature {
  return {
    getGeometry() {
      return {
        getType() {
          return geom;
        },
      };
    },
  } as Feature;
}
