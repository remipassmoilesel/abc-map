import { StyleCache } from './StyleCache';
import { TestHelper } from '../../utils/TestHelper';
import { Style } from 'ol/style';
import { FeatureStyle } from './FeatureStyle';
import GeometryType from 'ol/geom/GeometryType';

describe('StyleCache', function () {
  let cache: StyleCache;
  let props: FeatureStyle;

  beforeEach(() => {
    cache = new StyleCache();
    props = TestHelper.sampleStyleProperties();
  });

  it('should return style', function () {
    const style = [new Style()];
    cache.put(GeometryType.LINE_STRING, props, style);

    const fromCache = cache.get(GeometryType.LINE_STRING, props);

    expect(fromCache).toStrictEqual(style);
  });

  it('should return nothing if properties are different', function () {
    const style = [new Style()];
    cache.put(GeometryType.LINE_STRING, props, style);
    const otherProps: FeatureStyle = {
      ...props,
      fill: {
        color1: 'other-color',
      },
    };

    const fromCache = cache.get(GeometryType.LINE_STRING, otherProps);

    expect(fromCache).toBeUndefined();
  });

  it('should return nothing if geometry is different', function () {
    const style = [new Style()];
    cache.put(GeometryType.LINE_STRING, props, style);

    const fromCache = cache.get(GeometryType.POLYGON, props);

    expect(fromCache).toBeUndefined();
  });
});
