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
import { AbcProjection, LayerType, VectorMetadata } from '@abc-map/shared-entities';
import { FileFormat, FileFormats } from '../FileFormats';
import { AbcFile, Logger } from '@abc-map/frontend-commons';
import * as shapefile from 'shapefile';
import { GeoJSON } from 'ol/format';
import VectorSource from 'ol/source/Vector';
import { BlobIO } from '@abc-map/frontend-commons';
import uuid from 'uuid-random';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';
import { LayerFactory } from '../../geo/layers/LayerFactory';

const logger = Logger.get('ShapefileReader.ts');

export class ShapefileReader extends AbstractDataReader {
  public async isSupported(files: AbcFile[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.SHAPEFILE).length > 0;
  }

  public async read(files: AbcFile[], projection: AbcProjection): Promise<LayerWrapper[]> {
    const _files = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.SHAPEFILE);
    if (_files.length > 2) {
      return Promise.reject(new Error('Cannot parse more than one shapefile at once'));
    }
    const shp = _files.find((f) => f.path.toLocaleLowerCase().endsWith('shp'));
    const dbf = _files.find((f) => f.path.toLocaleLowerCase().endsWith('dbf'));
    if (!shp) {
      return Promise.reject(new Error('Shapefile not found'));
    }

    const shpBuffer = await BlobIO.asArrayBuffer(shp.content);
    const dbfBuffer = dbf ? await BlobIO.asArrayBuffer(dbf.content) : undefined;
    const geojson = await shapefile.read(shpBuffer, dbfBuffer, { encoding: 'utf-8' });

    const format = new GeoJSON();
    const features = format.readFeatures(geojson, { featureProjection: projection.name });
    this.prepareFeatures(features);

    const layer = LayerFactory.newVectorLayer(new VectorSource({ features }));
    const metadata: VectorMetadata = {
      id: uuid(),
      name: 'Couche Shapefile',
      type: LayerType.Vector,
      active: false,
      opacity: 1,
      visible: true,
    };
    layer.setMetadata(metadata);

    return [layer];
  }
}
