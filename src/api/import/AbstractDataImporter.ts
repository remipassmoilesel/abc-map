import {IGeoJsonFeatureCollection} from '../entities/geojson/IGeoJsonFeatureCollection';
import {AbstractServiceConsumer} from '../common/AbstractServiceConsumer';
import {FileFormat} from '../export/FileFormat';

// TODO: implement collectionToGeojson
// TODO: implement geojsonToCollection
// TODO: implement collectionToFile

export abstract class AbstractDataImporter extends AbstractServiceConsumer {

    public abstract getSupportedFormat(): FileFormat;

    public abstract getGeoJson(pathToSourceFile: string): Promise<IImportedFile>;

}

export interface IImportedFile {
    filepath: string;
    data: IGeoJsonFeatureCollection;
}
