import {AbstractDataImporter} from './AbstractDataImporter';
import {IAbcGeojsonFeatureCollection} from '../../AbcGeojson';
import {FeatureHelper} from '../FeatureUtils';
import {DataFormats, IDataFormat} from '../dataformat/DataFormat';
import * as _ from 'lodash';
import {Logger} from 'loglevel';
import {Readable} from 'stream';
import uuid = require('uuid');
import loglevel = require('loglevel');

// tslint:disable-next-line:no-var-requires
const ogr2ogr = require('ogr2ogr');

export class ShapefileImporter extends AbstractDataImporter {

    protected logger: Logger = loglevel.getLogger('ProjectDao');

    public getSupportedFormat(): IDataFormat {
        return DataFormats.SHP;
    }

    public async toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection> {

        const featureColl = await ogr2ogr(this.bufferToStream(source), 'ESRI Shapefile')
            .format('GeoJSON')
            .skipfailures()
            .onStderr((data: any) => this.logger.error(data))
            .promise();

        return {
            id: uuid.v4(),
            type: featureColl.type,
            features: _.map(featureColl.features, (feature) => FeatureHelper.toAbcFeature(feature)),
        };
    }

    private bufferToStream(buffer: Buffer): Readable {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }
}
