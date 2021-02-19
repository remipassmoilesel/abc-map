import { AbstractDataReader } from './AbstractDataReader';
import { LayerType, WmsDefinition, WmsMetadata } from '@abc-map/shared-entities';
import { FileFormat, FileFormats } from '../datastore/FileFormats';
import { AbcFile } from './AbcFile';
import * as yaml from 'js-yaml';
import { BlobReader } from '../utils/BlobReader';
import { Logger } from '../utils/Logger';
import uuid from 'uuid-random';
import { LayerWrapper } from '../geo/layers/LayerWrapper';
import { LayerFactory } from '../geo/layers/LayerFactory';

const logger = Logger.get('WmsDefinitionReader.ts');

export class WmsDefinitionReader extends AbstractDataReader {
  public async isSupported(files: AbcFile[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.WMS_DEFINITION).length > 0;
  }

  public async read(files: AbcFile[]): Promise<LayerWrapper[]> {
    const definitions = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.WMS_DEFINITION);
    const layers: LayerWrapper[] = [];
    for (const file of definitions) {
      const fileContent = await BlobReader.asString(file.content);
      const definition = yaml.safeLoad(fileContent) as WmsDefinition | undefined;
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
