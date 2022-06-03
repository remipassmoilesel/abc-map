import { Coordinate } from 'ol/coordinate';

export class GeolocationError extends Event {
  constructor(public readonly error: { message?: string }) {
    super('error');
  }
}

export interface Position {
  accuracy: number | undefined;
  altitude: number | undefined;
  altitudeAccuracy: number | undefined;
  heading: number | undefined;
  speed: number | undefined;
  position: Coordinate | undefined;
  positionLonLat: Coordinate | undefined;
}

export class GeolocationChanged extends Event {
  constructor(public readonly position: Position) {
    super('change');
  }
}
