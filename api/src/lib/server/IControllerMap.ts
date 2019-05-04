import {AbstractController} from './AbstractController';
import {ProjectController} from '../../project/ProjectController';
import {AuthenticationController} from '../../authentication/AuthenticationController';
import {UserController} from '../../users/UserController';
import {IServiceMap} from '../IServiceMap';

export interface IControllerMap {
    [k: string]: AbstractController;

    project: ProjectController;
    authentication: AuthenticationController;
    user: UserController;
}

export function getControllers(services: IServiceMap): IControllerMap {
    return {
        project: new ProjectController(services.project),
        authentication: new AuthenticationController(services.authentication),
        user: new UserController(services.authentication, services.user)
    };
}
