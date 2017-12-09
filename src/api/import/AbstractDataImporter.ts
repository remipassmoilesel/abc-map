import {IGeoJsonFeatureCollection} from "../entities/geojson/IGeoJsonFeatureCollection";

export abstract class AbstractDataImporter {
    public abstract getSupportedExtensions(): string[];

    public abstract getGeoJson(pathToSourceFile: string): Promise<IImportedFile>;
}

export interface IImportedFile {
    filepath: string;
    data: IGeoJsonFeatureCollection;
}
