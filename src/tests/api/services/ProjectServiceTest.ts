import * as chai from 'chai';
import 'mocha';
import {ProjectService} from "../../../api/services/ProjectService";

const assert = chai.assert;

describe('ProjectService', () => {

    it('Create a new project should not fail', () => {
        const ps = new ProjectService();

        assert.doesNotThrow(() => {
            ps.newProject();
        })
    });

});
