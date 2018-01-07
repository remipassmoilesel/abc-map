import * as tgj from 'togeojson';
import * as fs from 'fs-extra-promise';
import {Document, DOMParser} from 'xmldom';
import {AbstractDataImporter, IImportedFile} from './AbstractDataImporter';
import {IGeoJsonFeatureCollection} from '../entities/geojson/IGeoJsonFeatureCollection';
import {FileFormat} from '../export/FileFormat';

export class GpxDataImporter extends AbstractDataImporter {

    public getSupportedFormat(): FileFormat {
        return FileFormat.GPX;
    }

    public getGeoJson(pathToSourceFile: string): Promise<IImportedFile> {

        return this.getSourceFileAsDom(pathToSourceFile)
            .then((gpxDom: Document) => {

                return {
                    data: this.convertToGeoJson(gpxDom),
                    filepath: pathToSourceFile,
                };

            });

    }

    private getSourceFileAsDom(path: string): Promise<Document> {
        return (fs.readFileAsync(path).then((data: Buffer) => {
            return new DOMParser().parseFromString(data.toString());
        }) as any);
    }

    private convertToGeoJson(gpxDom: Document): IGeoJsonFeatureCollection {
        return tgj.gpx(gpxDom, {styles: true});
    }
}
