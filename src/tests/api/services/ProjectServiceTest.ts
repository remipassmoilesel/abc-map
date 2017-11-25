import * as chai from 'chai';
import 'mocha';
import {ProjectService} from "../../../api/services/ProjectService";
import {TestUtils} from "../TestUtils";
import {Evt} from "../../../api/ipc/IpcEventTypes";
import {Subj} from "../../../api/ipc/IpcSubjects";
import {IpcEvent} from "../../../api/ipc/IpcEvent";

const assert = chai.assert;

describe('ProjectService', () => {

    it('Create a new project should not fail', () => {

        const {ipc, sendStub} = TestUtils.getStubbedIpc();
        const ps = new ProjectService(ipc);

        assert.doesNotThrow(() => {
            ps.newProject();
        });

        assert.lengthOf(sendStub.getCalls(), 1);
        assert.equal(sendStub.getCalls()[0].args[0], Subj.PROJECT_EVENTS_BUS);
        assert.equal((sendStub.getCalls()[0].args[1] as IpcEvent).type, Evt.PROJECT_NEW_CREATED);
    });

});
