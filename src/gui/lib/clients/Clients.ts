import {MapClient} from "./MapClient";

export class Clients {
    private mapClient: MapClient;

    constructor() {
        this.mapClient = new MapClient();
    }

    public getMapClient() {
        return this.mapClient;
    }

}