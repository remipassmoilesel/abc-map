import { AbstractDataReader } from './AbstractDataReader';
import { LayerType, WmsDefinition, WmsMetadata } from '@abc-map/shared-entities';
import BaseLayer from 'ol/layer/Base';
import { FileFormat, FileFormats } from '../datastore/FileFormats';
import { AbcFile } from './AbcFile';
import TileLayer from 'ol/layer/Tile';
import * as yaml from 'js-yaml';
import { BlobReader } from '../utils/BlobReader';
import { Logger } from '../utils/Logger';
import { LayerFactory } from '../geo/map/LayerFactory';
import * as uuid from 'uuid';
import { LayerMetadataHelper } from '../geo/map/LayerMetadataHelper';

const logger = Logger.get('WmsDefinitionReader.ts');

export class WmsDefinitionReader extends AbstractDataReader {
  public async isSupported(files: AbcFile[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.WMS_DEFINITION).length > 0;
  }

  public async read(files: AbcFile[]): Promise<BaseLayer[]> {
    const definitions = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.WMS_DEFINITION);
    const layers: TileLayer[] = [];
    for (const file of definitions) {
      const fileContent = await BlobReader.asString(file.content);
      const definition = yaml.safeLoad(fileContent) as WmsDefinition | undefined;
      if (!definition || !definition.url || !definition.layerName) {
        // TODO: we should fail here
        logger.error('Invalid definition: ', { definition, fileContent });
        continue;
      }

      const layer = LayerFactory.newWmsLayer(definition);

      const metadata: WmsMetadata = {
        id: uuid.v4(),
        name: 'Couche GeoJSON',
        type: LayerType.Wms,
        active: false,
        opacity: 1,
        visible: true,
        url: definition.url,
        layerName: definition.layerName,
        projection: definition.projection,
        extent: definition.extent,
        auth: definition.auth,
      };
      LayerMetadataHelper.setWmsMetadata(layer, metadata);

      layers.push(layer);
    }
    return layers;
  }
}
