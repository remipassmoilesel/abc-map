import {IServicesMap} from '../services/IServiceMap';

export class AbstractServiceConsumer {
    protected services: IServicesMap;

    constructor(services?: IServicesMap) {
        this.setServicesMap(services);
    }

    public setServicesMap(services: IServicesMap) {
        this.services = services;
    }
}
