import {AbstractDataImporter} from './AbstractDataImporter';
import {IAbcGeojsonFeatureCollection} from 'abcmap-shared';
import {DataFormats, IDataFormat} from '../dataformat/DataFormat';
import {Logger} from 'loglevel';
import {FeatureCollection} from 'geojson';
import uuid = require('uuid');
import loglevel = require('loglevel');

// tslint:disable-next-line:no-var-requires
const ogr2ogr = require('ogr2ogr');

export class ShapefileImporter extends AbstractDataImporter {

    protected logger: Logger = loglevel.getLogger('ShapefileImporter');

    public getSupportedFormat(): IDataFormat {
        return DataFormats.SHP;
    }

    public async toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection> {

        const featureColl: FeatureCollection = await ogr2ogr(this.bufferToStream(source), 'ESRI Shapefile')
            .format('GeoJSON')
            .skipfailures()
            .onStderr((data: any) => this.logger.error(data))
            .options(['--config', 'CPL_DEBUG', 'ON', '-t_srs', 'EPSG:3857'])
            .promise();

        return {
            id: uuid.v4(),
            type: featureColl.type,
            features: this.featuresToAbcFeatures(featureColl.features),
        };
    }

}
