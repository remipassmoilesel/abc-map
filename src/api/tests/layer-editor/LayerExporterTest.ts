import * as chai from 'chai';
import {ProjectHandlers} from '../../handlers/ProjectHandlers';
import {initApplication, stopApplication} from '../../main';
import {IServicesMap} from '../../handlers/AbstractHandlersGroup';
import {TestUtils} from '../TestUtils';

const assert = chai.assert;

describe('LayerExporterTest', () => {


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

    it('Responses returned from handler should be serialized', async () => {

    });

});
