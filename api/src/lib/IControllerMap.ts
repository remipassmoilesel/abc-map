import {AbstractController} from './server/AbstractController';
import {ProjectController} from '../project/ProjectController';
import {AuthenticationController} from '../authentication/AuthenticationController';
import {UserController} from '../users/UserController';
import {IServiceMap} from './IServiceMap';
import {DataStoreController} from '../data/DataStoreController';

export interface IControllerMap {
    [k: string]: AbstractController;

    project: ProjectController;
    authentication: AuthenticationController;
    user: UserController;
    datastore: DataStoreController;
}

export function getControllers(services: IServiceMap): IControllerMap {
    return {
        project: new ProjectController(services.project),
        authentication: new AuthenticationController(services.authentication),
        user: new UserController(services.authentication, services.user),
        datastore: new DataStoreController(services.datastore, services.dataTransformation),
    };
}
