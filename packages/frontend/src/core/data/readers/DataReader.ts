/**
 * Copyright © 2021 Rémi Pace.
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

import { AbstractDataReader } from './AbstractDataReader';
import { AbcProjection } from '@abc-map/shared-entities';
import { GpxReader } from './GpxReader';
import { KmlReader } from './KmlReader';
import { ShapefileReader } from './ShapefileReader';
import { AbcFile, Zipper } from '@abc-map/frontend-commons';
import { FileFormat, FileFormats } from '../FileFormats';
import { GeoJsonReader } from './GeoJsonReader';
import { WmsDefinitionReader } from './WmsDefinitionReader';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';

export class DataReader {
  public static create(): DataReader {
    const readers = [new GpxReader(), new KmlReader(), new ShapefileReader(), new GeoJsonReader(), new WmsDefinitionReader()];
    return new DataReader(readers);
  }

  constructor(private readers: AbstractDataReader[]) {}

  public async read(files: AbcFile[], projection: AbcProjection): Promise<LayerWrapper[]> {
    if (!files.length) {
      return [];
    }

    // First we unzip if needed
    const _files: AbcFile[] = [];
    for (const f of files) {
      if (FileFormats.fromPath(f.path) === FileFormat.ZIP) {
        const unzipped = await Zipper.unzip(f.content);
        _files.push(...unzipped);
      } else {
        _files.push(f);
      }
    }

    // Then we create layers from data
    const result: LayerWrapper[] = [];
    for (const r of this.readers) {
      if (await r.isSupported(_files)) {
        const layers = await r.read(_files, projection);
        result.push(...layers);
      }
    }
    return result;
  }
}
