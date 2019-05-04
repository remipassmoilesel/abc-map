import {AbstractDataImporter} from './AbstractDataImporter';
import {FileFormat} from '../export/FileFormat';
import {IAbcGeojsonFeatureCollection} from '../AbcGeojson';
import {DataImporterHelper} from './DataImporterHelper';

// tslint:disable:no-var-requires
const togeojson = require('togeojson');

export class KmlDataImporter extends AbstractDataImporter {

    public getSupportedFormat(): FileFormat {
        return FileFormat.KML;
    }

    public async toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection> {
        const kmlDom = DataImporterHelper.getBufferAsDom(source);
        return this.convertToGeoJson(kmlDom);
    }

    private convertToGeoJson(kmlDom: Document): IAbcGeojsonFeatureCollection {
        return togeojson.kml(kmlDom, {styles: true});
    }
}


