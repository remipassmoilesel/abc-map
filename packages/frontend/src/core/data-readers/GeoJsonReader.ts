import { AbstractDataReader } from './AbstractDataReader';
import { AbcProjection } from '@abc-map/shared-entities';
import BaseLayer from 'ol/layer/Base';
import { FileFormat, FileFormats } from '../datastore/FileFormats';
import { GeoJSON } from 'ol/format';
import { BlobReader } from '../utils/BlobReader';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { AbcFile } from './AbcFile';

export class GeoJsonReader extends AbstractDataReader {
  public async isSupported(files: AbcFile[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.GEOJSON).length > 0;
  }

  public async read(files: AbcFile[], projection: AbcProjection): Promise<BaseLayer[]> {
    const format = new GeoJSON();
    const _files = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.GEOJSON);
    const result: BaseLayer[] = [];
    for (const file of _files) {
      const content = await BlobReader.asString(file.content);
      const features = await format.readFeatures(content, { featureProjection: projection.name });
      this.generateIdsIfAbsents(features);
      const layer = new VectorLayer({
        source: new VectorSource({ features }),
      });
      result.push(layer);
    }

    return result;
  }
}
