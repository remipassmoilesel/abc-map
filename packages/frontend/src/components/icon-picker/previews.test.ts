import { getPreviews } from './previews';

describe('previews', function () {
  it('should work', () => {
    const previews = getPreviews();

    const keys = Array.from(previews.keys()).sort();
    const valuesCount = keys.map((k) => previews.get(k)?.length);
    expect(keys).toEqual(['Arrows', 'Emojis', 'Geometries', 'Objects', 'Pins', 'Symbols', 'Weather']);
    expect(valuesCount).toEqual([73, 22, 25, 258, 10, 65, 65]);
    keys
      .flatMap((k) => previews.get(k))
      .forEach((p) => {
        expect(p?.icon.name).toBeDefined();
        expect(p?.icon.category).toBeDefined();
        expect(p?.icon.contentSvg).toBeDefined();
      });
  });
});
