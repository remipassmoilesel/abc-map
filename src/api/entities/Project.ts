import {AbstractMapLayer} from "./AbstractMapLayer";

export class Project {

    private name: string;
    private layers: AbstractMapLayer[];

    constructor(name: string) {
        this.name = name;
        this.layers = [];
    }

}