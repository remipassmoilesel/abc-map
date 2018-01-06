import * as chai from 'chai';
import {ProjectHandlers} from '../../handlers/ProjectHandlers';
import {initApplication, stopApplication} from '../../main';
import {IServicesMap} from '../../services/IServiceMap';
import {TestUtils} from '../TestUtils';
import {ExportFormat} from '../../export/ExportFormat';
import {LayerExporterFinder} from '../../export/LayerExporterFinder';
import {XlsxLayerExporter} from '../../export/XlsxLayerExporter';

const assert = chai.assert;

describe('ExporterFinderTest', () => {

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

    it('Finder should find XLSX exporter', async () => {
        const finder = new LayerExporterFinder();
        const exporter = finder.getInstanceForFormat(ExportFormat.XLSX);

        assert.isDefined(exporter);
        assert.instanceOf(exporter, XlsxLayerExporter);
    });

});
