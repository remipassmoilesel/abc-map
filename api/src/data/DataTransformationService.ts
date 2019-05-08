import {IAbcGeojsonFeatureCollection} from './AbcGeojson';

export class DataTransformationService {

    public toGeojson(buffer: Buffer, path: string): IAbcGeojsonFeatureCollection {
        throw new Error('Implement me');
    }

}
