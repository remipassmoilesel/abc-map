import {ProjectService} from '../project/ProjectService';
import {IDaoMap} from './database/IDaoMap';
import {AbstractService} from './AbstractService';
import {UserService} from '../users/UserService';
import {AuthenticationService} from '../authentication/AuthenticationService';
import {IApiConfig} from '../IApiConfig';
import {DatastoreService} from '../data/DatastoreService';
import {DataTransformationService} from '../data/DataTransformationService';

export interface IServiceMap {
    [k: string]: AbstractService;

    project: ProjectService;
    user: UserService;
    authentication: AuthenticationService;
    datastore: DatastoreService;
    dataTransformation: DataTransformationService;
}

export async function getServices(daos: IDaoMap, config: IApiConfig): Promise<IServiceMap> {
    const dataTransformation = new DataTransformationService();
    const services: IServiceMap = {
        project: new ProjectService(daos.project),
        user: new UserService(daos.user),
        authentication: new AuthenticationService(daos.user, config),
        datastore: new DatastoreService(config, daos.documents, dataTransformation),
        dataTransformation,
    };

    for (const serviceName in services) {
        if (serviceName in services) {
            await services[serviceName].postConstruct();
        }
    }

    return services;
}
