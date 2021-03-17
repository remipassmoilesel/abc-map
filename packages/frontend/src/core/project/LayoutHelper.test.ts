import { LayoutFormats } from '@abc-map/shared-entities';
import { LayoutHelper } from './LayoutHelper';

describe('LayoutHelper', () => {
  it('formatToPixel()', () => {
    const format = LayoutFormats.A4_PORTRAIT;
    expect(LayoutHelper.formatToPixel(format)).toEqual({ width: 1654, height: 2339 });
  });
});
