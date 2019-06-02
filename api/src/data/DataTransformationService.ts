import {TransformationTools} from './transform/TransformationTools';
import {AbstractService} from '../lib/AbstractService';
import {IAbcGeojsonFeatureCollection} from 'abcmap-shared';

export class DataTransformationService extends AbstractService {

    private transformTools = new TransformationTools();

    public async toGeojson(buffer: Buffer, path: string): Promise<IAbcGeojsonFeatureCollection> {
        const importer = this.transformTools.getImporterForPath(path);
        if (!importer) {
            return Promise.reject(`Not supported: ${path}`);
        }
        return importer.toCollection(buffer);
    }

}
