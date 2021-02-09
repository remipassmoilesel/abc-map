import { StyleCache } from './StyleCache';
import { TestHelper } from '../../utils/TestHelper';
import { Style } from 'ol/style';
import { AbcStyle } from './AbcStyle';

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
    const otherProps: AbcStyle = {
      ...props,
      fill: {
        color: 'other-color',
      },
    };

    const fromCache = cache.get(otherProps);

    expect(fromCache).toBeUndefined();
  });

  /**
   * If this test fail, you must adapt cache keys
   */
  it('depends on AbcStyle structure', function () {
    const witness = '{"stroke":{"color":"stroke-color","width":5},"fill":{"color":"fill-color"}}';
    const props: AbcStyle = {
      stroke: {
        color: 'stroke-color',
        width: 5,
      },
      fill: {
        color: 'fill-color',
      },
    };

    expect(JSON.stringify(props)).toEqual(witness);
  });
});
