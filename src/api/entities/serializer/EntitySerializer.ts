import {Project} from '../Project';
import {TileLayer} from '../layers/TileLayer';
import {IpcEvent, IpcEventImpl} from '../../ipc/IpcEvent';
import {EventType} from '../../ipc/IpcEventTypes';
import {GeoJsonLayer} from './../layers/GeoJsonLayer';
import {GeocodingResult} from './../GeocodingResult';
import * as _ from 'lodash';

// WARNING
// All constructors declared here are imported in browser

// List of constructors used to deserialize objects
const constructors: any = {};
constructors.TileLayer = TileLayer;
constructors.Project = Project;
constructors.IpcEventImpl = IpcEventImpl;
constructors.EventType = EventType;
constructors.GeoJsonLayer = GeoJsonLayer;
constructors.GeocodingResult = GeocodingResult;

const excludedConstructors = ['String'];

const MARK = '$$constructor';

export class EntitySerializer {

    public static newInstance(): EntitySerializer {
        return new EntitySerializer(constructors);
    }

    private constructorMap: any;

    constructor(constructorMap: any) {
        this.constructorMap = constructorMap;
    }

    public plainToClass(data: any) {

        // object is an array
        if (this.isArray(data)) {
            const result: any[] = [];
            for (const elmt of data) {
                result.push(this.plainToClass(elmt));
            }
            return result;
        }

        // object has a constructor
        const constructorName = data[MARK];
        if (constructorName) {
            const inst = this.createInstance(data);

            for (let propertyName in data) {
                if (data.hasOwnProperty(propertyName)) {

                    // object has a constructor
                    const propConstructorName = data[propertyName][MARK];
                    if (propConstructorName) {
                        inst[propertyName] = this.plainToClass(inst[propertyName]);
                    }

                    // object is an array
                    if (this.isArray(inst[propertyName])) {
                        const result: any[] = [];
                        const property = inst[propertyName];
                        for (const item of property) {
                            result.push(this.plainToClass(item));
                        }
                        inst[propertyName] = result;
                    }

                }
            }

            this.unmarkObject(inst);
            return inst;
        }

        // object is plain
        return data;
    }

    public classToPlain(data: any) {

        // mark object and nested objects with constructor name
        this.markObject(data);

        // clone object
        const plain = _.cloneDeep(data);

        // then unmark original object
        this.unmarkObject(data);
        return plain;
    }

    public serialize(data: any): string {
        return JSON.stringify(this.classToPlain(data));
    }

    public deserialize(serialized: string): any {
        return this.plainToClass(JSON.parse(serialized));
    }

    public deserializeProject(data: string): Project {
        return this.deserialize(data);
    }

    public deserializeIpcEvent(data: string): IpcEvent {
        return this.deserialize(data);
    }

    private createInstance(data: any) {
        const constructorName = data[MARK];
        const constructor = this.constructorMap[constructorName];

        if (!constructor) {
            throw new Error(`Unknown constructor: ${constructorName}`);
        }

        const newObj = new constructor();
        _.assign(newObj, data);
        return newObj;
    }

    private markObject(data: any) {

        // object is an array
        if (data.constructor === Array) {
            for (const elmt of data) {
                this.markObject(elmt);
            }
        }

        // object had a constructor not ignored
        else if (excludedConstructors.indexOf(data.constructor.name) === -1) {
            data[MARK] = data.constructor.name;

            for (let propertyName in data) {
                if (data.hasOwnProperty(propertyName)) {
                    const property = data[propertyName];
                    if (property && propertyName !== MARK && data.constructor && data.constructor.name) {
                        this.markObject(property);
                    }
                }
            }
        }

    }

    private unmarkObject(data: any) {

        if (data[MARK]) {
            delete data[MARK];
        }

        for (let propertyName in data) {
            const property = data[propertyName];

            // object has a constructor
            if (property[MARK]) {
                this.unmarkObject(property);
            }

            // object is an array
            if (this.isArray(property)) {
                for (const elmt of property) {
                    this.unmarkObject(elmt);
                }
            }
        }
    }

    private isArray(data: any) {
        return data.constructor === Array;
    }
}

