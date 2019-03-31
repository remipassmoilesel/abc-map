import {ProjectDao} from "../../project/ProjectDao";
import {AbcApiConfig} from "../../AbcApiConfig";

const config = new AbcApiConfig();

export interface IDaoMap {
    project: ProjectDao
}

export function getDaoMap(): IDaoMap {
    return {
        project: new ProjectDao(config),
    }
}
