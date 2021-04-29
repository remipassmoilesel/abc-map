import { Coordinate } from 'ol/coordinate';

/**
 * Return true if point is within tolerance. Tolerance is in coordinates unit.
 *
 * Use map.getView().getResolution() to get tolerance from pixels.
 *
 * @param a
 * @param b
 * @param tolerance
 */
export function isCloseTo(a: Coordinate, b: Coordinate, tolerance: number) {
  return Math.abs(a[0] - b[0]) <= tolerance && Math.abs(a[1] - b[1]) <= tolerance;
}
