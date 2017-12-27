import * as chai from 'chai';
import * as _ from 'lodash';
import {TileLayer} from '../../entities/layers/TileLayer';
import {EntitySerializer} from '../../entities/serializer/EntitySerializer';
import {Project} from '../../entities/Project';
import {IpcEventImpl} from '../../ipc/IpcEvent';
import {EventType} from '../../ipc/IpcEventTypes';
import {NestedTestClass, SimpleTestClass, SimpleTestClass2} from './SimpleTestClass';

const assert = chai.assert;

describe.only('AbcmapEntitiesTest', () => {

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
