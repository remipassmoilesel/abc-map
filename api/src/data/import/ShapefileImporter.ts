import * as shapefile from 'shapefile';
import * as _ from 'lodash';
import {AbstractDataImporter} from './AbstractDataImporter';
import {FileFormat} from '../export/FileFormat';
import {IAbcGeojsonFeatureCollection} from '../AbcGeojson';
import {FeatureHelper} from '../FeatureUtils';
import uuid = require('uuid');

export class ShapefileImporter extends AbstractDataImporter {

    public getSupportedFormat(): FileFormat {
        return FileFormat.KML;
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
