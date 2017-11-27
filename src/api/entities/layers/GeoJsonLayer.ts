import {AbstractMapLayer} from './AbstractMapLayer';

export class GeoJsonLayer extends AbstractMapLayer {

    // TODO: refactor to datasource
    private _data: any;

    constructor(name: string, data: any) {
        super(name);
        this._data = data;
    }

    get data(): any {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }
}
