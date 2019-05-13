import {ProjectDao} from '../../project/ProjectDao';
import {IApiConfig} from '../../IApiConfig';
import {UserDao} from '../../users/UserDao';
import {AbstractMongodbDao} from './AbstractMongodbDao';
import {DocumentDao} from '../../data/DocumentDao';

export interface IDaoMap {
    [k: string]: AbstractMongodbDao<any>;

    project: ProjectDao;
    user: UserDao;
    documents: DocumentDao;
}

export async function getDaoMap(config: IApiConfig): Promise<IDaoMap> {
    const daoMap: IDaoMap = {
        project: new ProjectDao(config),
        user: new UserDao(config),
        documents: new DocumentDao(config),
    };

    for (const daoName in daoMap) {
        await daoMap[daoName].postConstruct();
    }

    return daoMap;
}
