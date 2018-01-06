import * as chai from 'chai';
import * as _ from 'lodash';
import {TestUtils} from '../TestUtils';
import {Db} from 'mongodb';
import {GeoJsonLayer} from '../../entities/layers/GeoJsonLayer';
import {IServicesMap} from '../../services/IServiceMap';
import {initApplication, stopApplication} from '../../main';
import {DataExporterFinder} from '../../export/DataExporterFinder';
import {ExportFormat} from '../../export/ExportFormat';
import {AbstractDataExporter} from '../../export/AbstractDataExporter';
import {LayerEditionService} from '../../layer-editor/LayerEditor';

const assert = chai.assert;

describe.only('DataExporterTest', () => {

    let db: Db;

    let ipcStub;
    let services: IServicesMap;
    let exporterFinder: DataExporterFinder;

    before(async () => {
        ipcStub = TestUtils.getStubbedIpc();
        services = await initApplication(ipcStub.ipc);
        db = await TestUtils.getMongodbConnection();

        exporterFinder = new DataExporterFinder();
        exporterFinder.setServiceMap(services);

        await services.project.setupDevProject();
    });

    after(async () => {
        await stopApplication();
    });

    function getExporter(services, exportFormat: ExportFormat): AbstractDataExporter {
        return exporterFinder.getInstanceForFormat(exportFormat);
    }

    it('> Export layer as xlsx should succeed', async () => {

        const exporter = getExporter(services, ExportFormat.XLSX);
        const project = services.project.getCurrentProject();

        const layerId: string = _.find(project.layers, (lay) => lay instanceof GeoJsonLayer).id;
        assert.isDefined(layerId);

        const tempPath = LayerEditionService.getTempPath(layerId, ExportFormat.XLSX);
        await exporter.exportCollection(layerId, tempPath, ExportFormat.XLSX);

        console.log('tempPath');
        console.log(tempPath);
    });


});
