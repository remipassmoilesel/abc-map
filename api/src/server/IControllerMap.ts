import {ProjectController} from "../project/ProjectController";
import {IServiceMap} from "../lib/IServiceMap";

export interface IControllerMap {
    project: ProjectController
}

export function getControllers(services: IServiceMap): IControllerMap {
    return {
        project: new ProjectController(services.project)
    }
}
