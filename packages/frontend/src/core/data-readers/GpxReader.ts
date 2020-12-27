import { AbstractDataReader } from './AbstractDataReader';
import { AbcProjection } from '@abc-map/shared-entities';
import BaseLayer from 'ol/layer/Base';
import { FileFormat, FileFormats } from '../datastore/FileFormats';
import { GPX } from 'ol/format';
import { BlobReader } from '../utils/BlobReader';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { AbcFile } from './AbcFile';

export class GpxReader extends AbstractDataReader {
  public async isSupported(files: AbcFile[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.GPX).length > 0;
  }

  public async read(files: AbcFile[], projection: AbcProjection): Promise<BaseLayer[]> {
    const format = new GPX();
    const gpxFiles = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.GPX);
    const result: BaseLayer[] = [];
    for (const file of gpxFiles) {
      const content = await BlobReader.asString(file.content);
      const features = await format.readFeatures(content, { featureProjection: projection.name });
      const layer = new VectorLayer({
        source: new VectorSource({ features }),
      });
      result.push(layer);
    }

    return result;
  }
}
