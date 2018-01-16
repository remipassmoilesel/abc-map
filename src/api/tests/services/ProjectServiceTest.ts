import * as chai from 'chai';
import {ProjectService} from '../../services/ProjectService';
import {TestUtils} from '../TestUtils';
import {Project} from '../../entities/Project';
import {IServicesMap} from '../../services/IServiceMap';
import {initApplication, stopApplication} from '../../main';

const assert = chai.assert;

describe('ProjectService', () => {

    let ipcStub;
    let services: IServicesMap;

    before(async () => {
        ipcStub = TestUtils.getStubbedIpc();
        services = await initApplication(ipcStub.ipc);
    });

    after(async () => {
        await stopApplication();
    });

    it('Create new project should succeed', async () => {

        const projectDao = services.db.getProjectDao();

        // remove previous project
        await projectDao.clear();
        assert.isNull(await projectDao.query());

        // create a new project
        await services.project.createNewProject();

        const project = await projectDao.query();
        assert.isNotNull(project);
        assert.instanceOf(project, Project);

        await projectDao.clear();
    });


});
