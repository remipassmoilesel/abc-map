import {ProjectService} from '../project/ProjectService';
import {IDaoMap} from './database/IDaoMap';
import {AbstractService} from './AbstractService';
import {UserService} from '../users/UserService';
import {AuthenticationService} from '../users/AuthenticationService';
import {IApiConfig} from '../IApiConfig';

export interface IServiceMap {
    [k: string]: AbstractService;

    project: ProjectService;
    user: UserService;
    authentication: AuthenticationService;
}

export async function getServices(daos: IDaoMap, config: IApiConfig): Promise<IServiceMap> {
    const services: IServiceMap = {
        project: new ProjectService(daos.project),
        user: new UserService(daos.user),
        authentication: new AuthenticationService(daos.user, config),
    };

    for (let serviceName in services) {
        await services[serviceName].postConstruct();
    }

    return services;
}
