import * as tgj from 'togeojson';
import * as fs from 'fs-extra-promise';
import * as path from 'path';
import {Document, DOMParser} from 'xmldom';
import {AbstractDataImporter} from './AbstractDataImporter';
import {IGeoJsonFeatureCollection} from '../entities/geojson/IGeoJsonFeatureCollection';
import {FileFormat} from '../export/FileFormat';

export class KmlDataImporter extends AbstractDataImporter {

    public getSupportedFormat(): FileFormat {
        return FileFormat.KML;
    }

    public async fileToCollection(pathToSourceFile: string, collectionName?: string): Promise<string> {

        const kmlDom = await this.getSourceFileAsDom(pathToSourceFile);
        const geojson = this.convertToGeoJson(kmlDom);

        const collectionId = collectionName || path.basename(pathToSourceFile);
        await this.services.db.getGeoJsonDao().insertMany(
            collectionId,
            geojson.features,
        );

        return collectionId;
    }

    private async getSourceFileAsDom(path: string): Promise<Document> {
        const buffer: Buffer = await fs.readFileAsync(path);
        return new DOMParser().parseFromString(buffer.toString());
    }

    private convertToGeoJson(kmlDom: Document): IGeoJsonFeatureCollection {
        return tgj.kml(kmlDom, {styles: true});
    }
}


