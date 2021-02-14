import { StyleCache } from './StyleCache';
import { TestHelper } from '../../utils/TestHelper';
import { Style } from 'ol/style';
import { AbcStyleProperties } from './AbcStyleProperties';

describe('StyleCache', function () {
  it('should return style', function () {
    const cache = new StyleCache();
    const props = TestHelper.sampleStyleProperties();
    const style = new Style();
    cache.put(props, style);

    const fromCache = cache.get(props);

    expect(fromCache).toStrictEqual(style);
  });

  it('should return nothing', function () {
    const cache = new StyleCache();
    const props = TestHelper.sampleStyleProperties();
    const style = new Style();
    cache.put(props, style);
    const otherProps: AbcStyleProperties = {
      ...props,
      fill: {
        color1: 'other-color',
      },
    };

    const fromCache = cache.get(otherProps);

    expect(fromCache).toBeUndefined();
  });
});
