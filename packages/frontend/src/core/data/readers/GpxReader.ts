import { AbstractDataReader } from './AbstractDataReader';
import { AbcProjection, LayerType, VectorMetadata } from '@abc-map/shared-entities';
import { FileFormat, FileFormats } from '../FileFormats';
import { GPX } from 'ol/format';
import { BlobReader } from '../../utils/BlobReader';
import VectorSource from 'ol/source/Vector';
import { AbcFile } from './AbcFile';
import uuid from 'uuid-random';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';
import { LayerFactory } from '../../geo/layers/LayerFactory';

export class GpxReader extends AbstractDataReader {
  public async isSupported(files: AbcFile[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.GPX).length > 0;
  }

  public async read(files: AbcFile[], projection: AbcProjection): Promise<LayerWrapper[]> {
    const layers: LayerWrapper[] = [];
    const format = new GPX();
    const gpxFiles = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.GPX);

    for (const file of gpxFiles) {
      const content = await BlobReader.asString(file.content);
      const features = await format.readFeatures(content, { featureProjection: projection.name });
      this.prepareFeatures(features);

      const layer = LayerFactory.newVectorLayer(new VectorSource({ features }));
      const metadata: VectorMetadata = {
        id: uuid(),
        name: 'Couche GPX',
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
