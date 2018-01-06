import * as chai from 'chai';
import * as _ from 'lodash';
import {ProjectHandlers} from '../../handlers/ProjectHandlers';
import {initApplication, stopApplication} from '../../main';
import {IServicesMap} from '../../services/IServiceMap';
import {TestUtils} from '../TestUtils';
import {AbstractMapLayer} from '../../entities/layers/AbstractMapLayer';
import {GeoJsonLayer} from '../../entities/layers/GeoJsonLayer';
import {ExportFormat} from '../../export/ExportFormat';

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

    it('Layer should be exported correctly', async () => {
        await services.project.setupDevProject();
        const layerId = _.find(services.project.getCurrentProject().layers,
            (lay: AbstractMapLayer) => lay instanceof GeoJsonLayer).id;

        await services.map.editLayerAsSpreadsheet(layerId, ExportFormat.XLSX);
    });

});
