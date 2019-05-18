import {AbstractDataImporter} from './AbstractDataImporter';

import {IAbcGeojsonFeatureCollection} from 'abcmap-shared';
import {DataFormats, IDataFormat} from '../dataformat/DataFormat';
import * as loglevel from 'loglevel';
import {Logger} from 'loglevel';
import {FeatureCollection} from 'geojson';
import uuid = require('uuid');

// tslint:disable:no-var-requires
const ogr2ogr = require('ogr2ogr');

export class GpxDataImporter extends AbstractDataImporter {

    protected logger: Logger = loglevel.getLogger('GpxDataImporter');

    public getSupportedFormat(): IDataFormat {
        return DataFormats.GPX;
    }

    public async toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection> {

        const featureColl: FeatureCollection = await ogr2ogr(this.bufferToStream(source), 'GPX')
            .format('GeoJSON')
            .skipfailures()
            .onStderr((data: any) => this.logger.error(data))
            .promise();


        return {
            id: uuid.v4(),
            type: featureColl.type,
            features: this.featuresToAbcFeatures(featureColl.features),
        };
    }

}
