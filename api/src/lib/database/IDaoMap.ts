import {ProjectDao} from '../../project/ProjectDao';
import {ApiConfigHelper} from '../../IApiConfig';
import {UserDao} from '../../users/UserDao';

const config = ApiConfigHelper.load();

export interface IDaoMap {
    project: ProjectDao;
    user: UserDao;
}

export function getDaoMap(): IDaoMap {
    return {
        project: new ProjectDao(config),
        user: new UserDao(config)
    };
}
