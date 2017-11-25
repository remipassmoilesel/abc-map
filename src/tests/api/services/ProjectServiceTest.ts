import * as chai from 'chai';
import 'mocha';
import {ProjectService} from "../../../api/services/ProjectService";
import {Ipc} from "../../../api/ipc/Ipc";

const assert = chai.assert;

describe('ProjectService', () => {

    it('Create a new project should not fail', () => {
        const ps = new ProjectService(new Ipc());

        assert.doesNotThrow(() => {
            ps.newProject();
        })
    });

});
