import * as chai from 'chai';
import {ProjectService} from '../../services/ProjectService';
import {TestUtils} from '../TestUtils';
import {EventType} from '../../ipc/IpcEventTypes';
import {IpcEventBus} from '../../ipc/IpcSubject';
import {IpcEvent} from '../../ipc/IpcEvent';

const assert = chai.assert;

describe('ProjectService', () => {

    it('Create a new project should not fail', () => {

        const {ipc, sendStub} = TestUtils.getStubbedIpc();
        const ps = new ProjectService(ipc);

        assert.doesNotThrow(() => {
            ps.newProject();
        });

        assert.lengthOf(sendStub.getCalls(), 1);
        assert.equal(sendStub.getCalls()[0].args[0], IpcEventBus.PROJECT);
        assert.equal((sendStub.getCalls()[0].args[1] as IpcEvent).type, EventType.PROJECT_NEW_CREATED);
    });

});
