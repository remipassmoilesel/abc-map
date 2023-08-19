/**
 * Copyright © 2023 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import { SinonStubbedInstance } from 'sinon';
import * as sinon from 'sinon';
import { GeoService, NominatimResult, StyleTransformFunc } from '../services';
import { MapWrapper } from '../map';

/**
 * Initialize a new geo service stub. Based on sinonjs, see: https://sinonjs.org/releases/latest/stubs/
 */
export function newTestGeoService(): SinonStubbedInstance<GeoService> {
  return sinon.createStubInstance(DumbGeoService);
}

/* eslint-disable */
export class DumbGeoService implements GeoService {
  public geocode(query: string): Promise<NominatimResult[]> {
    return {} as any;
  }

  public getMainMap(): MapWrapper {
    return {} as any;
  }

  public getUserPosition(): Promise<Coordinate> {
    return {} as any;
  }

  public loadProjection(code: string): Promise<Extent> {
    return {} as any;
  }

  public updateSelectedFeatures(transform: StyleTransformFunc): number {
    return {} as any;
  }
}
/* eslint-enable */
