import { FillPatternFactory } from './FillPatternFactory';
import { FillProperties } from './FeatureStyle';
import { FillPatterns } from '@abc-map/shared-entities';

describe('FillPatternFactory', () => {
  let factory: FillPatternFactory;

  beforeEach(() => {
    factory = new FillPatternFactory();
  });

  it('should work', () => {
    const properties: FillProperties = {
      color1: '#fff',
      color2: '#000',
    };
    expect(factory.create({ ...properties, pattern: FillPatterns.Flat })).toBeUndefined();
    expect(factory.create({ ...properties, pattern: FillPatterns.Circles })).toBeDefined();
    expect(factory.create({ ...properties, pattern: FillPatterns.Squares })).toBeDefined();
    expect(factory.create({ ...properties, pattern: FillPatterns.HatchingVertical })).toBeDefined();
    expect(factory.create({ ...properties, pattern: FillPatterns.HatchingHorizontal })).toBeDefined();
    expect(factory.create({ ...properties, pattern: FillPatterns.HatchingObliqueRight })).toBeDefined();
    expect(factory.create({ ...properties, pattern: FillPatterns.HatchingObliqueLeft })).toBeDefined();
  });
});
