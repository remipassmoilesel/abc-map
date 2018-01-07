import * as chai from 'chai';
import * as _ from 'lodash';
import {Row, Workbook, Worksheet} from 'exceljs';
import {TestUtils} from '../TestUtils';
import {Db} from 'mongodb';
import {GeoJsonLayer} from '../../entities/layers/GeoJsonLayer';
import {IServicesMap} from '../../services/IServiceMap';
import {initApplication, stopApplication} from '../../main';
import {DataExporterFinder} from '../../export/DataExporterFinder';
import {ExportFormat} from '../../export/ExportFormat';
import {AbstractDataExporter} from '../../export/AbstractDataExporter';
import {LayerEditionService} from '../../layer-editor/LayerEditor';
import {XlsxDataExporter} from '../../export/XlsxDataExporter';
import {DevUtilities} from '../../dev/DevUtilities';

const assert = chai.assert;

describe.only('XlsxDataExporterTest', () => {

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

        await DevUtilities.setupDevProject(services);
    });

    after(async () => {
        await stopApplication();
    });

    function getExporter(services, exportFormat: ExportFormat): AbstractDataExporter {
        return exporterFinder.getInstanceForFormat(exportFormat);
    }

    function getAllIds(dataSheet: Worksheet): Promise<string[]> {
        const idHeader = Object.keys(XlsxDataExporter.XLSX_HEADERS)[0];
        const sheetFeatureIds: string[] = [];

        let i = 1;
        const end = dataSheet.rowCount - 1;

        return new Promise((resolve, reject) => {
            dataSheet.eachRow((row: Row) => {
                const id = row.getCell(1).value.toString();

                if (id === idHeader) {
                    return;
                }

                sheetFeatureIds.push(id);
                if (i >= end - 1) {
                    resolve(sheetFeatureIds);
                }
                i++;
            });
        });
    }

    it('> Export layer as xlsx should succeed', async () => {

        const exporter = getExporter(services, ExportFormat.XLSX);

        const testLayer: GeoJsonLayer = await DevUtilities.createGeojsonTestLayer(services);
        const layerId: string = testLayer.id;

        const tempPath = LayerEditionService.getTempPath(layerId, ExportFormat.XLSX);

        await exporter.exportCollection(layerId, tempPath, ExportFormat.XLSX);

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
