import {IGeoJsonFeatureCollection} from '../entities/geojson/IGeoJsonFeatureCollection';

// TODO: add service map injection
// TODO: implement collectionToGeojson
// TODO: implement geojsonToCollection
// TODO: implement collectionToFile

export abstract class AbstractDataImporter {

    // TODO: use a format class instead of strings
    public abstract getSupportedExtensions(): string[];

    public abstract getGeoJson(pathToSourceFile: string): Promise<IImportedFile>;
}

export interface IImportedFile {
    filepath: string;
    data: IGeoJsonFeatureCollection;
}
