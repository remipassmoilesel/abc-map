let layerCount = 0;

export abstract class AbstractMapLayer {

    private _id: string;
    private _name: string;

    constructor(name: string) {
        this.generateId();
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    public generateId() {
        this.id = `layer-${layerCount++}`;
    }
}
