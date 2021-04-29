import { getAllIcons, safeGetIcon } from './PointIcons';
import { mountSvg } from './IconProcessor';
import { PointIcons } from '@abc-map/shared-entities';

describe('PointIcons', () => {
  it('safeGetIcon()', () => {
    const icon = safeGetIcon(PointIcons.Star);
    expect(icon.name).toEqual('star');
    expect(icon.contentSvg).toMatch(/^<\?xml version=/);
  });

  it('safeGetIcon() should not fail', () => {
    const icon = safeGetIcon('not an icon' as PointIcons);
    expect(icon.name).toEqual('square');
    expect(icon.contentSvg).toMatch(/^<\?xml version=/);
  });

  it('getAllIcons() should not return too much icons', () => {
    // Icons are inlined and system is not optimized for a big collection of icons
    // If this test fail, it's refactoring time !
    expect(getAllIcons().length).toBeLessThan(50);
  });

  it('all icons must be valid', () => {
    getAllIcons().forEach((icon) => {
      // Icon must mount as svg
      const { svg } = mountSvg(icon.contentSvg);

      // Icon must have a name
      expect(icon.name).toBeDefined();

      // Icon must have a viewbox attribute
      if (!svg.getAttribute('viewBox')) {
        throw new Error(`You must set viewbox attribute on icon '${icon.name}'`);
      }
    });
  });
});
