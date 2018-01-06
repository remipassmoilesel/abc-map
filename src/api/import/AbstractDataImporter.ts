import {IGeoJsonFeatureCollection} from '../entities/geojson/IGeoJsonFeatureCollection';

export abstract class AbstractDataImporter {

    // TODO: use a format class instead of strings
    public abstract getSupportedExtensions(): string[];

    public abstract getGeoJson(pathToSourceFile: string): Promise<IImportedFile>;
}

export interface IImportedFile {
    filepath: string;
    data: IGeoJsonFeatureCollection;
}
