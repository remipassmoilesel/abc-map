import * as tgj from 'togeojson';
import * as fs from 'fs-extra-promise';
import {Document, DOMParser} from 'xmldom';
import {AbstractDataImporter} from "./AbstractDataImporter";
import {AbstractMapLayer} from "../entities/layers/AbstractMapLayer";
import {GeoJsonLayer} from "../entities/layers/GeoJsonLayer";
import * as Promise from 'bluebird';

export class KmlDataImporter extends AbstractDataImporter {

    public getSupportedExtensions(): string[] {
        return ['.kml'];
    }

    public getAsLayer(pathToSourceFile: string): Promise<AbstractMapLayer> {

        return this.getSourceFileAsDom(pathToSourceFile)
            .then((kmlDom: Document) => {

                const geojson = this.convertToGeoJson(kmlDom);
                return new GeoJsonLayer(pathToSourceFile, geojson);

            });

    }

    private getSourceFileAsDom(path: string): Promise<Document> {
        return fs.readFileAsync(path).then((data: Buffer) => {
            return new DOMParser().parseFromString(data.toString());
        })
    }

    private convertToGeoJson(kmlDom: Document): any {
        return tgj.kml(kmlDom, {styles: true});
    }
}