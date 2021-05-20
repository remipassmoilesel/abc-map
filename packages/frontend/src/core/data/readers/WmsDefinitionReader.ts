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
import { LayerType, WmsDefinition, WmsMetadata } from '@abc-map/shared';
import { FileFormat, FileFormats } from '../FileFormats';
import { AbcFile } from '@abc-map/shared';
import * as yaml from 'js-yaml';
import { BlobIO } from '@abc-map/shared';
import { Logger } from '@abc-map/shared';
import uuid from 'uuid-random';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';
import { LayerFactory } from '../../geo/layers/LayerFactory';

const logger = Logger.get('WmsDefinitionReader.ts');

export class WmsDefinitionReader extends AbstractDataReader {
  public async isSupported(files: AbcFile<Blob>[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.WMS_DEFINITION).length > 0;
  }

  public async read(files: AbcFile<Blob>[]): Promise<LayerWrapper[]> {
    const definitions = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.WMS_DEFINITION);
    const layers: LayerWrapper[] = [];
    for (const file of definitions) {
      const fileContent = await BlobIO.asString(file.content);
      const definition = yaml.load(fileContent) as WmsDefinition | undefined;
      if (!definition || !definition.remoteUrl || !definition.remoteLayerName) {
        // TODO: we should fail here
        logger.error('Invalid definition: ', { definition, fileContent });
        continue;
      }

      const layer = LayerFactory.newWmsLayer(definition);
      const metadata: WmsMetadata = {
        id: uuid(),
        name: 'Couche GeoJSON',
        type: LayerType.Wms,
        active: false,
        opacity: 1,
        visible: true,
        remoteUrl: definition.remoteUrl,
        remoteLayerName: definition.remoteLayerName,
        projection: definition.projection,
        extent: definition.extent,
        auth: definition.auth,
      };
      layer.setMetadata(metadata);

      layers.push(layer);
    }
    return layers;
  }
}
