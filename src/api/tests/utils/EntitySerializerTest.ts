import * as chai from 'chai';
import * as _ from 'lodash';
import {TileLayer} from '../../entities/layers/TileLayer';
import {EntitySerializer} from '../../entities/serializer/EntitySerializer';
import {Project} from '../../entities/Project';
import {IpcEventImpl} from '../../ipc/IpcEvent';
import {EventType} from '../../ipc/IpcEventTypes';

const assert = chai.assert;

class SimpleTestClass {
    private field1: string;

    constructor(value1: string) {
        this.field1 = value1;
    }
}

const constructors: any = {};
constructors.SimpleTestClass = SimpleTestClass;

describe.only('EntitySerializer', () => {

    it.only('Serialize then deserialize simple object should be correct', () => {

        const eu = new EntitySerializer(constructors);

        const origin = new SimpleTestClass('value1');
        const serialized = eu.serialize(origin);

        const deserialized = eu.deserialize(serialized);

        assert.isTrue(serialized.length > 0);
        assert.deepEqual(origin, deserialized);
    });

    const eu = EntitySerializer.newInstance();

    // these objects will be serialized then unserialized
    const toTest: any[] = [];
    toTest.push(new TileLayer('name', 'http://url'));

    const project = new Project('name-name');
    project.layers = [new TileLayer('name', 'http://url'), new TileLayer('name2', 'http://url2')];
    toTest.push(project);

    toTest.push(new IpcEventImpl(EventType.PROJECT_NEW_CREATED, project));

    it('Serialize then deserialize should be correct', () => {

        _.forEach(toTest, (obj, index) => {
            const raw = eu.serialize(obj);

            assert.isString(raw);

            const newObj = eu.deserialize(raw);
            assert.deepEqual(obj, newObj, `Serialization failed for: ${obj}, ${newObj}`);
        });
    });

});
