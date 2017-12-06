import {IGeoJsonFeature} from "../entities/geojson/IGeoJsonFeature";

export abstract class AbstractDataImporter {
    public abstract getSupportedExtensions(): string[];

    public abstract getGeoJson(pathToSourceFile: string): Promise<IImportedFile>;
}

export interface IImportedFile {
    filepath: string;
    data: IGeoJsonFeature[];
}
