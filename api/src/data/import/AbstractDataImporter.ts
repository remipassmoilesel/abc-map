import {FileFormat} from '../export/FileFormat';
import {IAbcGeojsonFeatureCollection} from '../AbcGeojson';

export abstract class AbstractDataImporter {

    public abstract getSupportedFormat(): FileFormat;

    public abstract toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection>;

}

