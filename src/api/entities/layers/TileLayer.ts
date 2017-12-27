import {AbstractMapLayer} from './AbstractMapLayer';
import {SerializeProperty} from 'ts-serializer';

// TODO: restore credits
export class TileLayer extends AbstractMapLayer {

    private _url: string;

    constructor(name?: string, url?: string) {
        super(name);
        this._url = url;
    }

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }

    public getIdPrefix(): string {
        return 'tile';
    }

}
