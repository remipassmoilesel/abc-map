import {ProjectService} from '../project/ProjectService';
import {IDaoMap} from './database/IDaoMap';
import {AbstractService} from './AbstractService';
import {UserService} from '../users/UserService';
import {AuthenticationService} from '../authentication/AuthenticationService';
import {IApiConfig} from '../IApiConfig';
import {DatastoreService} from '../data/DatastoreService';

export interface IServiceMap {
    [k: string]: AbstractService;

    project: ProjectService;
    user: UserService;
    authentication: AuthenticationService;
    datastore: DatastoreService;
}

export async function getServices(daos: IDaoMap, config: IApiConfig): Promise<IServiceMap> {
    const services: IServiceMap = {
        project: new ProjectService(daos.project),
        user: new UserService(daos.user),
        authentication: new AuthenticationService(daos.user, config),
        datastore: new DatastoreService(config),
    };

    for (const serviceName in services) {
        await services[serviceName].postConstruct();
    }

    return services;
}
