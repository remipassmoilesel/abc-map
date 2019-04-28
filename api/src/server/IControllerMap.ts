import {ProjectController} from '../project/ProjectController';
import {IServiceMap} from '../lib/IServiceMap';
import {AuthenticationController} from '../users/AuthenticationController';
import {AbstractController} from './AbstractController';
import {UserController} from '../users/UserController';

export interface IControllerMap {
    [k: string]: AbstractController;

    project: ProjectController;
    authentication: AuthenticationController;
    user: UserController;
}

export function getControllers(services: IServiceMap): IControllerMap {
    return {
        project: new ProjectController(services.project),
        authentication: new AuthenticationController(services.authentication, services.user),
        user: new UserController(services.authentication, services.user)
    };
}
