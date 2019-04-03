import {ProjectClient} from '@/lib/project/ProjectClient';
import axios from 'axios';

export interface IAbcApiClientMap {
    project: ProjectClient;
}

export const abcApiClients: IAbcApiClientMap = {
    project: new ProjectClient(axios),
};
