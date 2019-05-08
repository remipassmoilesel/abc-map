import {AbstractDataImporter} from './AbstractDataImporter';
import {IAbcGeojsonFeatureCollection} from '../../AbcGeojson';
import {DataImporterHelper} from './DataImporterHelper';
import {DataFormats, IDataFormat} from '../fileformat/DataFormat';

// tslint:disable:no-var-requires
const togeojson = require('@mapbox/togeojson');

export class KmlDataImporter extends AbstractDataImporter {

    public getSupportedFormat(): IDataFormat {
        return DataFormats.KML;
    }

    public async toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection> {
        const kmlDom = DataImporterHelper.getBufferAsDom(source);
        return this.convertToGeoJson(kmlDom);
    }

    private convertToGeoJson(kmlDom: Document): IAbcGeojsonFeatureCollection {
        return togeojson.kml(kmlDom, {styles: true});
    }
}


