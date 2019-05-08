import {AbstractDataImporter} from './AbstractDataImporter';

import {IAbcGeojsonFeatureCollection} from '../../AbcGeojson';
import {DataImporterHelper} from './DataImporterHelper';
import {DataFormats, IDataFormat} from '../dataformat/DataFormat';

// tslint:disable:no-var-requires
const togeojson = require('@mapbox/togeojson');

export class GpxDataImporter extends AbstractDataImporter {

    public getSupportedFormat(): IDataFormat {
        return DataFormats.GPX;
    }

    public async toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection> {
        const gpxDom = DataImporterHelper.getBufferAsDom(source);
        return this.convertToGeoJson(gpxDom);
    }

    private convertToGeoJson(gpxDom: Document): IAbcGeojsonFeatureCollection {
        return togeojson.gpx(gpxDom, {styles: true});
    }
}
