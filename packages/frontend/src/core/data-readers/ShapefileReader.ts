import { AbstractDataReader } from './AbstractDataReader';
import { AbcProjection } from '@abc-map/shared-entities';
import BaseLayer from 'ol/layer/Base';
import { FileFormat, FileFormats } from '../datastore/FileFormats';
import { AbcFile } from './AbcFile';
import * as shapefile from 'shapefile';
import { GeoJSON } from 'ol/format';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { BlobReader } from '../utils/BlobReader';

export class ShapefileReader extends AbstractDataReader {
  public async isSupported(files: AbcFile[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.SHAPEFILE).length > 0;
  }

  public async read(files: AbcFile[], projection: AbcProjection): Promise<BaseLayer[]> {
    const _files = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.SHAPEFILE);
    if (_files.length > 2) {
      return Promise.reject(new Error('Cannot parse more than one shapefile at once'));
    }
    const shp = _files.find((f) => f.path.toLocaleLowerCase().endsWith('shp'));
    const dbf = _files.find((f) => f.path.toLocaleLowerCase().endsWith('dbf'));
    if (!shp) {
      return Promise.reject(new Error('Shapefile not found'));
    }

    const shpBuffer = await BlobReader.asArrayBuffer(shp.content);
    const dbfBuffer = dbf ? await BlobReader.asArrayBuffer(dbf.content) : undefined;
    const geojson = await shapefile.read(shpBuffer, dbfBuffer);

    const format = new GeoJSON();
    const features = format.readFeatures(geojson, { featureProjection: projection.name });
    this.generateIdsIfAbsents(features);
    const layer = new VectorLayer({
      source: new VectorSource({
        features,
      }),
    });

    return [layer];
  }
}
