import * as tgj from 'togeojson';
import * as fs from 'fs-extra-promise';
import {Document, DOMParser} from 'xmldom';
import {AbstractDataImporter, IImportedFile} from "./AbstractDataImporter";
import {IGeoJsonFeature} from "../entities/geojson/IGeoJsonFeature";
import {IGeoJsonFeatureCollection} from "../entities/geojson/IGeoJsonFeatureCollection";

export class GpxDataImporter extends AbstractDataImporter {

    public getSupportedExtensions(): string[] {
        return ['.gpx'];
    }

    public getGeoJson(pathToSourceFile: string): Promise<IImportedFile> {

        return this.getSourceFileAsDom(pathToSourceFile)
            .then((gpxDom: Document) => {

                return {
                    filepath: pathToSourceFile,
                    data: this.convertToGeoJson(gpxDom)
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