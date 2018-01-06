import * as chai from 'chai';
import {Application} from 'spectron';
import {TestUtils} from '../TestUtils';
import {initApplication, stopApplication} from '../../main';
import {IServicesMap} from '../../services/IServiceMap';
import {ProjectHandlers} from '../../handlers/ProjectHandlers';
import {Project} from '../../entities/Project';

const assert = chai.assert;

describe('ProjectHandlers', function () {

    let ipcStub;
    let services: IServicesMap;
    let projectHandlers: ProjectHandlers;

    before(async () => {
        ipcStub = TestUtils.getStubbedIpc();
        services = await initApplication(ipcStub.ipc);
        projectHandlers = new ProjectHandlers(ipcStub.ipc, services);
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
        await projectHandlers.createNewProject();

        const project = await projectDao.query();
        assert.isNotNull(project);
        assert.instanceOf(project, Project);

        await projectDao.clear();
    });

});
