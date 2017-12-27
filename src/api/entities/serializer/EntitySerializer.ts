import {Project} from '../Project';
import {IpcEvent} from '../../ipc/IpcEvent';
import * as _ from 'lodash';
import {Logger, LogLevel} from '../../dev/Logger';

const defaultIgnoredConstructors = [
    'String', 'Number', 'Boolean',
];

const defaultForbiddenConstructors = [
    'Date',
];

const MARK = '#constructor';

const logger = Logger.getLogger('EntitySerializer');
// logger.setLevel(LogLevel.DEBUG);

export class EntitySerializer {

    private constructorMap: any;
    private ignoredConstructors: any;
    private forbiddenConstructors: any;

    constructor(constructorMap: any, ignoredConstructors?: any, forbiddenConstructors?: any) {
        this.constructorMap = constructorMap;
        this.ignoredConstructors = ignoredConstructors || defaultIgnoredConstructors;
        this.forbiddenConstructors = forbiddenConstructors || defaultForbiddenConstructors;
    }

    public plainToClass(data: any): any {

        logger.debug('plainToClass', data);

        if (!data) {
            return data;
        }

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

                    const property = data[propertyName];

                    // object is null or undefined
                    if (!property) {
                        inst[propertyName] = property;
                    }

                    // object is an array
                    else if (this.isArray(inst[propertyName])) {
                        const result: any[] = [];
                        const property = inst[propertyName];
                        for (const item of property) {
                            result.push(this.plainToClass(item));
                        }
                        inst[propertyName] = result;
                    }

                    // object has a constructor
                    else if (property && property[MARK]) {
                        inst[propertyName] = this.plainToClass(inst[propertyName]);
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

        logger.debug('classToPlain', data);

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

        logger.debug('createInstance', data);

        const constructorName = data[MARK];
        const constructor = this.constructorMap[constructorName];

        if (!constructor) {
            throw new Error(`Unknown constructor: '${constructorName}' in ${JSON.stringify(data)}`);
        }

        const newObj = new constructor();
        _.assign(newObj, data);
        return newObj;
    }

    private markObject(data: any): any {

        // object is undefined or null
        if (!data) {
            return;
        }

        // constructor is forbiddent
        else if (this.isConstructorForbidden(data)) {
            throw new Error(`Forbidden constructor: '${data.constructor.name}' in '${data}'`);
        }

        // object is an array
        else if (data.constructor === Array) {
            for (const elmt of data) {
                this.markObject(elmt);
            }
        }

        // object had a constructor not ignored
        else if (this.isConstructorIgnored(data) !== true) {

            try {
                data[MARK] = data.constructor.name;
            } catch (e) {
                throw new Error(`Cannot serialize property '${data}' with `
                    + `constructor '${data.constructor.name}'`);
            }

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

        if (!data) {
            return;
        }

        if (data[MARK]) {
            delete data[MARK];
        }

        for (let propertyName in data) {

            if (data.hasOwnProperty(propertyName)) {

                const property = data[propertyName];

                // object is undefined or null
                if (!property) {
                    continue;
                }

                // object has a constructor
                else if (property[MARK]) {
                    this.unmarkObject(property);
                }

                // object is an array
                else if (this.isArray(property)) {
                    for (const elmt of property) {
                        this.unmarkObject(elmt);
                    }
                }
            }

        }
    }

    private isArray(data: any) {
        return data.constructor === Array;
    }

    private isConstructorIgnored(data: any) {
        return this.ignoredConstructors.indexOf(data.constructor.name) !== -1;
    }

    private isConstructorForbidden(data: any) {
        return this.forbiddenConstructors.indexOf(data.constructor.name) !== -1;
    }
}

