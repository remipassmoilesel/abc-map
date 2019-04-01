import {ProjectService} from '../project/ProjectService';
import {IDaoMap} from './database/IDaoMap';

export interface IServiceMap {
    project: ProjectService;
}

export function getServices(daos: IDaoMap): IServiceMap {
    return {
        project: new ProjectService(daos.project),
    };
}
