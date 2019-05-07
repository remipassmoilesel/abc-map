import {IAbcGeojsonFeatureCollection} from '../AbcGeojson';
import {IDataFormat} from '../fileformat/DataFormat';

export abstract class AbstractDataImporter {

    public abstract getSupportedFormat(): IDataFormat;

    public abstract toCollection(source: Buffer): Promise<IAbcGeojsonFeatureCollection>;

}

