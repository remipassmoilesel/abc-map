import {FileFormat} from './FileFormat';
import {IServiceMap} from '../../lib/IServiceMap';
import {IAbcGeojsonFeatureCollection} from '../AbcGeojson';

export abstract class AbstractDataExporter {

    public abstract getSupportedFormat(): FileFormat;

    public abstract exportCollection(featureCollection: IAbcGeojsonFeatureCollection,
                                     exportFormat: FileFormat): Promise<ArrayBuffer>;

}
