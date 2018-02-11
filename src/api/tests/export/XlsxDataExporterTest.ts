import * as chai from 'chai';
import * as _ from 'lodash';
import {Workbook, Worksheet} from 'exceljs';
import {TestUtils} from '../TestUtils';
import {Db} from 'mongodb';
import {GeoJsonLayer} from '../../entities/layers/GeoJsonLayer';
import {IServicesMap} from '../../services/IServiceMap';
import {initApplication, stopApplication} from '../../main';
import {DataExporterFinder} from '../../export/DataExporterFinder';
import {FileFormat} from '../../export/FileFormat';
import {LayerEditor} from '../../layer-editor/LayerEditor';
import {XlsxDataExporter} from '../../export/XlsxDataExporter';
import {ApiDevUtilities} from '../../dev/ApiDevUtilities';
import {Logger} from '../../dev/Logger';
import {getAllIds} from './common';

const assert = chai.assert;

const logger = Logger.getLogger('XlsxDataExporterTest');

describe('XlsxDataExporterTest', () => {

    let db: Db;

    let ipcStub;
    let services: IServicesMap;
    let exporterFinder: DataExporterFinder;

    before(async () => {
        ipcStub = TestUtils.getStubbedIpc();
        services = await initApplication(ipcStub.ipc);
        db = await TestUtils.getMongodbConnection();

        exporterFinder = new DataExporterFinder(services);

        await ApiDevUtilities.setupDevProject(services);
    });

    after(async () => {
        await stopApplication();
    });

    it('> Export layer as xlsx should succeed', async () => {

        const exporter = exporterFinder.getInstanceForFormat(FileFormat.XLSX) as XlsxDataExporter;
        assert.instanceOf(exporter, XlsxDataExporter);

        const testLayer: GeoJsonLayer = await ApiDevUtilities.createGeojsonTestLayer(services);
        const layerId: string = testLayer.id;

        const tempPath = LayerEditor.getTempPath(layerId, FileFormat.XLSX);
        logger.info(`Layer exported at location: ${tempPath}`);

        await exporter.exportCollection(layerId, tempPath, FileFormat.XLSX);

        const workbook = new Workbook();
        await workbook.xlsx.readFile(tempPath);

        assert.lengthOf(workbook.worksheets, 2);
        assert.equal((workbook.worksheets[0] as any).name, 'Help');
        assert.equal((workbook.worksheets[1] as any).name, 'Data');

        const featureCursor = await services.db.getGeoJsonDao().queryAll(layerId);
        const featureCount = await featureCursor.count();
        const dataSheet: Worksheet = workbook.worksheets[1];

        assert.equal(dataSheet.rowCount, featureCount + 1); // +1 for headers

        const dbFeatures = await featureCursor.toArray();
        const dbFeatureIds: string[] = _.map(dbFeatures, (feat) => feat._id);

        const sheetFeatureIds: string[] = await getAllIds(dataSheet);

        assert.sameMembers(sheetFeatureIds, dbFeatureIds);
        assert.sameMembers(sheetFeatureIds, dbFeatureIds);

        await featureCursor.close();
    });


});
