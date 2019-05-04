import {AbstractDataImporter} from './AbstractDataImporter';
import {FileFormat} from '../export/FileFormat';
import {IAbcGeojsonFeatureCollection} from '../AbcGeojson';
import {DataImporterHelper} from './DataImporterHelper';

// tslint:disable:no-var-requires
const togeojson = require('togeojson');

export class GpxDataImporter extends AbstractDataImporter {

    public getSupportedFormat(): FileFormat {
        return FileFormat.GPX;
    }

    public async toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection> {
        const gpxDom = DataImporterHelper.getBufferAsDom(source);
        return this.convertToGeoJson(gpxDom);
    }

    private convertToGeoJson(gpxDom: Document): IAbcGeojsonFeatureCollection {
        return togeojson.gpx(gpxDom, {styles: true});
    }
}
