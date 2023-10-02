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

import { promises as fs } from 'fs';
import * as path from 'path';

export class TestData {
  public async getSampleGpx(): Promise<Blob> {
    return this.readFile('./campings-bretagne.gpx');
  }

  public async getSampleKml(): Promise<Blob> {
    return this.readFile('./KML_Samples.kml');
  }

  public async getSampleGeojson(): Promise<Blob> {
    return this.readFile('./stations.geojson');
  }

  public async getSampleWkt(): Promise<Blob> {
    return this.readFile('./stations.wkt');
  }

  public async getSampleTopoJSON(): Promise<Blob> {
    return this.readFile('./belgium.topojson');
  }

  /**
   * Zip containing multiple format of data (KML, geojson, gpx)
   */
  public async getSampleZipWithGeoData(): Promise<Blob> {
    return this.readFile('./geodata.zip');
  }

  public async getSampleShapefile(): Promise<Blob> {
    return this.readFile('./world-cities.zip');
  }

  private async readFile(name: string): Promise<Blob> {
    const absPath = path.resolve(__dirname, name);
    const buffer = await fs.readFile(absPath);
    return new Blob([buffer]);
  }
}
