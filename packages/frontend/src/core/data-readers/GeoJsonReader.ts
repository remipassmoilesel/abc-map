import { AbstractDataReader } from './AbstractDataReader';
import { AbcProjection, LayerType, VectorMetadata } from '@abc-map/shared-entities';
import { FileFormat, FileFormats } from '../datastore/FileFormats';
import { GeoJSON } from 'ol/format';
import { BlobReader } from '../utils/BlobReader';
import VectorSource from 'ol/source/Vector';
import { AbcFile } from './AbcFile';
import uuid from 'uuid-random';
import { LayerWrapper } from '../geo/layers/LayerWrapper';
import { LayerFactory } from '../geo/layers/LayerFactory';

export class GeoJsonReader extends AbstractDataReader {
  public async isSupported(files: AbcFile[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.GEOJSON).length > 0;
  }

  public async read(files: AbcFile[], projection: AbcProjection): Promise<LayerWrapper[]> {
    const layers: LayerWrapper[] = [];
    const format = new GeoJSON();
    const _files = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.GEOJSON);
    for (const file of _files) {
      const content = await BlobReader.asString(file.content);
      const features = await format.readFeatures(content, { featureProjection: projection.name });
      this.generateIdsIfAbsents(features);

      const layer = LayerFactory.newVectorLayer(new VectorSource({ features }));
      const metadata: VectorMetadata = {
        id: uuid(),
        name: 'Couche GeoJSON',
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
