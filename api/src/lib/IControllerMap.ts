import {AbstractController} from './server/AbstractController';
import {ProjectController} from '../project/ProjectController';
import {AuthenticationController} from '../authentication/AuthenticationController';
import {UserController} from '../users/UserController';
import {IServiceMap} from './IServiceMap';
import {DataStoreController} from '../data/DataStoreController';
import {HealthController} from './server/HealthController';

export interface IControllerMap {
    [k: string]: AbstractController;

    health: HealthController;
    project: ProjectController;
    authentication: AuthenticationController;
    user: UserController;
    datastore: DataStoreController;
}

export function getControllers(services: IServiceMap): IControllerMap {
    return {
        health: new HealthController(services),
        project: new ProjectController(services.project),
        authentication: new AuthenticationController(services.authentication),
        user: new UserController(services.authentication, services.user, services.datastore),
        datastore: new DataStoreController(services.datastore, services.dataTransformation),
    };
}
