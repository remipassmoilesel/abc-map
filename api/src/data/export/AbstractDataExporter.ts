import {IDataFormat} from '../fileformat/DataFormat';
import {IAbcGeojsonFeatureCollection} from '../AbcGeojson';

export abstract class AbstractDataExporter {

    public abstract getSupportedFormat(): IDataFormat;

    public abstract exportCollection(featureCollection: IAbcGeojsonFeatureCollection,
                                     exportFormat: IDataFormat): Promise<ArrayBuffer>;

}
