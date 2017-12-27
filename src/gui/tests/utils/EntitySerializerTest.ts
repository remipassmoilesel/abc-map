import * as chai from 'chai';
import * as _ from 'lodash';
import {TileLayer} from '../../../api/entities/layers/TileLayer';
import {Project} from '../../../api/entities/Project';
import {EventType} from '../../../api/ipc/IpcEventTypes';
import {EntitySerializerFactory} from '../../../api/entities/serializer/EntitySerializerFactory';
import {IpcEventImpl} from '../../../api/ipc/IpcEvent';
import {AbstractTest} from '../test-man/AbstractTest';

const assert = chai.assert;

const eu = EntitySerializerFactory.newInstance();

// these objects will be serialized then unserialized
const entitiesToTest: any[] = [];
entitiesToTest.push(new TileLayer('name', 'http://url'));

const project = new Project('name-name');
project.layers = [new TileLayer('name', 'http://url'), new TileLayer('name2', 'http://url2')];
entitiesToTest.push(project);
entitiesToTest.push(new IpcEventImpl(EventType.PROJECT_NEW_CREATED, project));
entitiesToTest.push({data: new TileLayer('name', 'http://url')});

export class EntitySerializerTest extends AbstractTest {

    public name: string = 'UiSearchableComponentsTest';

    public registerTests(): any[] {
        return [
            this.serializationShouldSucceed,
            this.methodShouldBeCallable,
        ];
    }

    public serializationShouldSucceed() {
        _.forEach(entitiesToTest, (obj, index) => {
            const raw = eu.serialize(obj);

            assert.isString(raw);

            const newObj = eu.deserialize(raw);
            assert.deepEqual(obj, newObj, `Serialization failed for: ${obj}, ${newObj}`);
        });
    }

    public methodShouldBeCallable() {

        const lay = new TileLayer('tile-layer-1', 'http://url2');
        assert.doesNotThrow(lay.generateId.bind(lay));

        const serialized = eu.serialize(lay);
        const deserialized = eu.deserialize(serialized);

        assert.doesNotThrow(deserialized.generateId.bind(deserialized));
    }

}
