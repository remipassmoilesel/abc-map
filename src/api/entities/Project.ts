import * as uuid from 'uuid';
import * as _ from 'lodash';
import {AbstractMapLayer} from './layers/AbstractMapLayer';

export interface IProjectCreationOptions {
    name?: string;
}


export class Project {

    public _id: string;
    private _name: string;
    private _layers: AbstractMapLayer[];

    constructor(name?: string) {
        this._id = uuid.v4();
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
