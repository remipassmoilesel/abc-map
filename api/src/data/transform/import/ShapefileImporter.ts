import * as shapefile from 'shapefile';
import {AbstractDataImporter} from './AbstractDataImporter';
import {IAbcGeojsonFeatureCollection} from '../../AbcGeojson';
import {FeatureHelper} from '../FeatureUtils';
import {DataFormats, IDataFormat} from '../dataformat/DataFormat';
import * as _ from 'lodash';
import uuid = require('uuid');

export class ShapefileImporter extends AbstractDataImporter {

    public getSupportedFormat(): IDataFormat {
        return DataFormats.KML;
    }

    public async toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection> {
        const featureColl = await shapefile.read(source);
        return {
            id: uuid.v4(),
            type: featureColl.type,
            features: _.map(featureColl.features, (feature) => FeatureHelper.toAbcFeature(feature)),
        };
    }

}
