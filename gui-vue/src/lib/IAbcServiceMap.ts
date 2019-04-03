import {ProjectService} from '@/lib/project/ProjectService';
import {abcApiClients} from '@/lib/IAbcApiClientMap';
import {abcStorew} from '@/lib/store/AbcStoreWrapper';
import {abcLocalst} from '@/lib/utils/AbcLocalStorageHelper';
import {MapService} from "@/lib/map/MapService";

export interface IAbcServiceMap {
    project: ProjectService;
    map: MapService;
}

export const abcServices: IAbcServiceMap = {
    project: new ProjectService(abcApiClients, abcStorew, abcLocalst),
    map: new MapService(abcApiClients, abcStorew, abcLocalst),
};
