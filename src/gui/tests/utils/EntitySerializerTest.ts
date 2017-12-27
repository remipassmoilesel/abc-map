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
const toTest: any[] = [];
toTest.push(new TileLayer('name', 'http://url'));

const project = new Project('name-name');
project.layers = [new TileLayer('name', 'http://url'), new TileLayer('name2', 'http://url2')];
toTest.push(project);
toTest.push(new IpcEventImpl(EventType.PROJECT_NEW_CREATED, project));

export class EntitySerializerTest extends AbstractTest {

    public name: string = 'UiSearchableComponentsTest';

    public registerTests(): any[] {
        return [
            this.serializationShouldSucceed,
        ];
    }

    public serializationShouldSucceed() {
        _.forEach(toTest, (obj, index) => {
            const raw = eu.serialize(obj);

            assert.isString(raw);

            const newObj = eu.deserialize(raw);
            assert.deepEqual(obj, newObj, `Serialization failed for: ${obj}, ${newObj}`);
        });
    }

}
