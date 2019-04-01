import {ProjectService} from '@/lib/project/ProjectService';
import {abcApiClients} from '@/lib/IAbcApiClientMap';
import {abcStorew} from '@/lib/store/AbcStoreWrapper';
import {abcLocalst} from '@/lib/utils/AbcLocalStorageHelper';

export interface IAbcServiceMap {
    project: ProjectService;
}

export const abcServices: IAbcServiceMap = {
    project: new ProjectService(abcApiClients, abcStorew, abcLocalst),
};
