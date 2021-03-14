import { AbstractDataReader } from './AbstractDataReader';
import { AbcProjection, LayerType, VectorMetadata } from '@abc-map/shared-entities';
import { FileFormat, FileFormats } from '../FileFormats';
import { KML } from 'ol/format';
import { BlobReader } from '@abc-map/frontend-shared';
import VectorSource from 'ol/source/Vector';
import { AbcFile } from '@abc-map/frontend-shared';
import uuid from 'uuid-random';
import { LayerFactory } from '../../geo/layers/LayerFactory';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';

export class KmlReader extends AbstractDataReader {
  public async isSupported(files: AbcFile[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.KML).length > 0;
  }

  public async read(files: AbcFile[], projection: AbcProjection): Promise<LayerWrapper[]> {
    const layers: LayerWrapper[] = [];
    const format = new KML();
    const _files = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.KML);
    for (const file of _files) {
      const content = await BlobReader.asString(file.content);
      const features = await format.readFeatures(content, { featureProjection: projection.name });
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
