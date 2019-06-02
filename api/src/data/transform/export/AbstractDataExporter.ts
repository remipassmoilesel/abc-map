import {IDataFormat} from '../dataformat/DataFormat';
import {IAbcGeojsonFeatureCollection} from 'abcmap-shared';

export abstract class AbstractDataExporter {

    public abstract getSupportedFormat(): IDataFormat;

    public abstract exportCollection(featureCollection: IAbcGeojsonFeatureCollection,
                                     exportFormat: IDataFormat): Promise<ArrayBuffer>;

}
