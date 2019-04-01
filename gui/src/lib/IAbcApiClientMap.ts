import {ProjectClient} from '@/lib/project/ProjectClient';

const axios = require('axios');

export interface IAbcApiClientMap {
    project: ProjectClient;
}

export const abcApiClients: IAbcApiClientMap = {
    project: new ProjectClient(axios),
};
