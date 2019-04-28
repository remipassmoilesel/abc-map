import {ProjectService} from '../project/ProjectService';
import {IDaoMap} from './database/IDaoMap';
import {AbstractService} from './AbstractService';
import {UserService} from '../users/UserService';

export interface IServiceMap {
    [k: string]: AbstractService;

    project: ProjectService;
    user: UserService;
}

export async function getServices(daos: IDaoMap): Promise<IServiceMap> {
    const services: IServiceMap = {
        project: new ProjectService(daos.project),
        user: new UserService(daos.user),
    };

    for (let serviceName in services) {
        await services[serviceName].postConstruct();
    }

    return services;
}
