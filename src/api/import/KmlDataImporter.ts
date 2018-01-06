import * as tgj from 'togeojson';
import * as fs from 'fs-extra-promise';
import {Document, DOMParser} from 'xmldom';
import {AbstractDataImporter, IImportedFile} from './AbstractDataImporter';
import {IGeoJsonFeatureCollection} from '../entities/geojson/IGeoJsonFeatureCollection';

export class KmlDataImporter extends AbstractDataImporter {

    public getSupportedExtensions(): string[] {
        return ['.kml'];
    }

    public getGeoJson(pathToSourceFile: string): Promise<IImportedFile> {

        return this.getSourceFileAsDom(pathToSourceFile)
            .then((kmlDom: Document) => {

                return {
                    data: this.convertToGeoJson(kmlDom),
                    filepath: pathToSourceFile,
                };

            });

    }

    private getSourceFileAsDom(path: string): Promise<Document> {
        return (fs.readFileAsync(path).then((data: Buffer) => {
            return new DOMParser().parseFromString(data.toString());
        }) as any);
    }

    private convertToGeoJson(kmlDom: Document): IGeoJsonFeatureCollection {
        return tgj.kml(kmlDom, {styles: true});
    }
}
