import {ProjectService} from "@/lib/project/ProjectService";


const axios = require('axios');

export class ServiceMap {

    project = new ProjectService(axios);

}
