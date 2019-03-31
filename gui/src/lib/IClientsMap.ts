import {ProjectClient} from "@/lib/project/ProjectClient";

const axios = require('axios');

export interface IClientsMap {
    project: ProjectClient;
}

export const clients = {
    project: new ProjectClient(axios)
};
