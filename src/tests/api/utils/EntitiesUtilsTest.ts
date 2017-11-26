import * as chai from 'chai';
import * as _ from 'lodash';
import 'mocha';
import {WmsLayer} from '../../../api/entities/WmsLayer';
import {EntitiesUtils} from '../../../api/utils/EntitiesUtils';
import {Project} from "../../../api/entities/Project";
import {IpcEventImpl} from "../../../api/ipc/IpcEvent";
import {Evt} from "../../../api/ipc/IpcEventTypes";

const assert = chai.assert;

describe('EntitiesUtils', () => {
    const eu = new EntitiesUtils();

    // these objects will be serialized then deserialized
    const toTest: any[] = [];
    toTest.push(new WmsLayer('name', 'http://url'));

    const project = new Project('name-name');
    project.layers = [new WmsLayer('name', 'http://url'), new WmsLayer('name2', 'http://url2')]
    toTest.push(project);

    toTest.push(new IpcEventImpl(Evt.PROJECT_NEW_CREATED, project));

    it('Serialize then deserialize should be correct', () => {

        _.forEach(toTest, (obj, index) => {
            const raw = eu.serialize(obj);

            assert.isString(raw);

            const newObj = eu.deserialize(raw);
            assert.deepEqual(obj, newObj, `Serialization failed for: ${obj}, ${newObj}`);
        });

    });

});
