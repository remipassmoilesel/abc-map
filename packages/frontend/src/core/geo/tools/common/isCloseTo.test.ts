import { isCloseTo } from './isCloseTo';

describe('isCloseTo()', () => {
  it('should return true', () => {
    // On exact position
    expect(isCloseTo([1, 1], [1, 1], 2)).toBe(true);
    // Both values near
    expect(isCloseTo([1, 1], [3, 3], 2)).toBe(true);
    // Both values near with negative
    expect(isCloseTo([-1, 1], [1, 3], 2)).toBe(true);
  });

  it('should return false', () => {
    // One value far
    expect(isCloseTo([1, 1], [3, 4], 2)).toBe(false);
    // Both values far
    expect(isCloseTo([1, 1], [4, 4], 2)).toBe(false);
    // Both values far with negative
    expect(isCloseTo([-1, 1], [-2, 4], 2)).toBe(false);
  });
});
