import * as fs from 'fs-extra-promise';
import * as path from 'path';
import {AbstractDataImporter} from './AbstractDataImporter';
import {IGeoJsonFeatureCollection} from '../entities/geojson/IGeoJsonFeatureCollection';
import {FileFormat} from '../export/FileFormat';

const tgj = require('togeojson');
const {Document, DOMParser} = require('xmldom');

export class GpxDataImporter extends AbstractDataImporter {

    public getSupportedFormat(): FileFormat {
        return FileFormat.GPX;
    }

    public async fileToCollection(pathToSourceFile: string, collectionName?: string): Promise<string> {

        const gpxDom = await this.getSourceFileAsDom(pathToSourceFile);
        const geojson = this.convertToGeoJson(gpxDom);

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

    private convertToGeoJson(gpxDom: Document): IGeoJsonFeatureCollection {
        return tgj.gpx(gpxDom, {styles: true});
    }
}
