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
import { AbcProjection, LayerType, VectorMetadata } from '@abc-map/shared';
import { FileFormat, FileFormats } from '../FileFormats';
import { KML } from 'ol/format';
import { BlobIO } from '@abc-map/shared';
import VectorSource from 'ol/source/Vector';
import { AbcFile } from '@abc-map/shared';
import uuid from 'uuid-random';
import { LayerFactory } from '../../geo/layers/LayerFactory';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';

export class KmlReader extends AbstractDataReader {
  public async isSupported(files: AbcFile<Blob>[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.KML).length > 0;
  }

  public async read(files: AbcFile<Blob>[], projection: AbcProjection): Promise<LayerWrapper[]> {
    const layers: LayerWrapper[] = [];
    const format = new KML();
    const _files = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.KML);
    for (const file of _files) {
      const content = await BlobIO.asString(file.content);
      const features = format.readFeatures(content, { featureProjection: projection.name });
      this.prepareFeatures(features);

      const layer = LayerFactory.newVectorLayer(new VectorSource({ features }));
      const metadata: VectorMetadata = {
        id: uuid(),
        name: 'Couche KML',
        type: LayerType.Vector,
        active: false,
        opacity: 1,
        visible: true,
      };
      layer.setMetadata(metadata);

      layers.push(layer);
    }

    return layers;
  }
}
