import {ProjectService} from '../project/ProjectService';
import {IDaoMap} from './database/IDaoMap';
import {AbstractService} from './AbstractService';

export interface IServiceMap {
    [k: string]: AbstractService;

    project: ProjectService;
}

export async function getServices(daos: IDaoMap): Promise<IServiceMap> {
    const services: IServiceMap = {
        project: new ProjectService(daos.project),
    };

    for (let serviceName in services) {
        await services[serviceName].postConstruct();
    }

    return services;
}
