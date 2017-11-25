import {AbstractMapLayer} from "./AbstractMapLayer";

export class Project {

    private _name: string;
    private _layers: AbstractMapLayer[];

    constructor(name: string) {
        this._name = name;
        this._layers = [];
    }


    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get layers(): AbstractMapLayer[] {
        return this._layers;
    }

    set layers(value: AbstractMapLayer[]) {
        this._layers = value;
    }
}