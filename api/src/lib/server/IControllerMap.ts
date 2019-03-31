import {ProjectController} from "../../project/ProjectController";
import {IDaoMap} from "../database/IDaoMap";
import {IServiceMap} from "../IServiceMap";

export interface IControllerMap {
    project: ProjectController
}

export function getControllers(services: IServiceMap): IControllerMap {
    return {
        project: new ProjectController(services.project)
    }
}
