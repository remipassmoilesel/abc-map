import * as chai from 'chai';
import {TestData} from '../TestData';
import * as uuid from 'uuid';
import {Db} from 'mongodb';
import {IServicesMap} from '../../services/IServiceMap';
import {ApiDevUtilities} from '../../dev/ApiDevUtilities';
import {initApplication, stopApplication} from '../../main';
import {TestUtils} from '../TestUtils';
import {DataImporterFinder} from '../../import/DataImporterFinder';
import {IGeoJsonFeature} from '../../entities/geojson/IGeoJsonFeature';
import {XlsxDataImporter} from '../../import/XlsxDataImporter';

const assert = chai.assert;

describe.only('XlsxDataImporter', () => {

    let db: Db;

    let ipcStub;
    let services: IServicesMap;
    let importerFinder: DataImporterFinder;

    before(async () => {
        ipcStub = TestUtils.getStubbedIpc();
        services = await initApplication(ipcStub.ipc);
        db = await TestUtils.getMongodbConnection();

        importerFinder = new DataImporterFinder(services);

        await ApiDevUtilities.setupDevProject(services);
    });

    after(async () => {
        await stopApplication();
    });

    it('Import should not fail', async () => {

        const importer = importerFinder.getInstanceForFile(TestData.SAMPLE_XLSX) as XlsxDataImporter;
        assert.instanceOf(importer, XlsxDataImporter);

        const collId = await importer.fileToCollection(TestData.SAMPLE_XLSX, `test-xlsx-${uuid.v4()}`);

        const features: IGeoJsonFeature[] = await services.db.getGeoJsonDao().queryAll(collId).toArray();

        assert.lengthOf(features, 6);
        assert.equal(features[0].geometry.type, 'Polygon');
        assert.equal(features[1].geometry.type, 'Polygon');
        assert.equal(features[2].geometry.type, 'Polygon');
        assert.equal(features[3].geometry.type, 'LineString');
        assert.equal(features[4].geometry.type, 'Polygon');
        assert.equal(features[5].geometry.type, 'LineString');

    });

});
