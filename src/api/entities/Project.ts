import * as uuid from 'uuid';
import {AbstractMapLayer} from './layers/AbstractMapLayer';

export interface IProjectCreationOptions {
    name?: string;
}


export class Project {
    public _id: string;
    public activeLayer: AbstractMapLayer | null;
    public name: string;
    public layers: AbstractMapLayer[];

    constructor(name: string) {
        this._id = uuid.v4();
        this.name = name;
        this.layers = [];
    }

}
