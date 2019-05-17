import {AbstractDataImporter} from './AbstractDataImporter';

import {IAbcGeojsonFeatureCollection} from '../../AbcGeojson';
import {DataFormats, IDataFormat} from '../dataformat/DataFormat';
import * as loglevel from 'loglevel';
import {Logger} from 'loglevel';
import * as _ from 'lodash';
import {FeatureHelper} from '../FeatureUtils';
import uuid = require('uuid');

// tslint:disable:no-var-requires
const ogr2ogr = require('ogr2ogr');

export class GpxDataImporter extends AbstractDataImporter {

    protected logger: Logger = loglevel.getLogger('GpxDataImporter');

    public getSupportedFormat(): IDataFormat {
        return DataFormats.GPX;
    }

    public async toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection> {

        const featureColl = await ogr2ogr(this.bufferToStream(source), 'GPX')
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
