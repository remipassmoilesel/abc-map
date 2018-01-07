import {IGeoJsonFeatureCollection} from '../entities/geojson/IGeoJsonFeatureCollection';
import {AbstractServiceConsumer} from '../common/AbstractServiceConsumer';

// TODO: implement collectionToGeojson
// TODO: implement geojsonToCollection
// TODO: implement collectionToFile

export abstract class AbstractDataImporter extends AbstractServiceConsumer{

    // TODO: use a format class instead of strings
    public abstract getSupportedExtensions(): string[];

    public abstract getGeoJson(pathToSourceFile: string): Promise<IImportedFile>;

}

export interface IImportedFile {
    filepath: string;
    data: IGeoJsonFeatureCollection;
}
