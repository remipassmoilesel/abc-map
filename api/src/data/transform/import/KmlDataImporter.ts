import {AbstractDataImporter} from './AbstractDataImporter';
import {IAbcGeojsonFeatureCollection} from '../../AbcGeojson';
import {DataFormats, IDataFormat} from '../dataformat/DataFormat';
import * as _ from 'lodash';
import {FeatureHelper} from '../FeatureUtils';
import * as loglevel from 'loglevel';
import {Logger} from 'loglevel';
import uuid = require('uuid');

// tslint:disable:no-var-requires
const ogr2ogr = require('ogr2ogr');

export class KmlDataImporter extends AbstractDataImporter {

    protected logger: Logger = loglevel.getLogger('KmlDataImporter');

    public getSupportedFormat(): IDataFormat {
        return DataFormats.KML;
    }

    public async toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection> {

        const featureColl = await ogr2ogr(this.bufferToStream(source), 'KML')
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

}


