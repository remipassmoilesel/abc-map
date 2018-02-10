import * as chai from 'chai';
import * as uuid from 'uuid';
import {Db} from 'mongodb';
import {TestData} from '../TestData';
import {GpxDataImporter} from '../../../api/import/GpxDataImporter';
import {IServicesMap} from '../../services/IServiceMap';
import {ApiDevUtilities} from '../../dev/ApiDevUtilities';
import {initApplication, stopApplication} from '../../main';
import {TestUtils} from '../TestUtils';
import {DataImporterFinder} from '../../import/DataImporterFinder';
import {IGeoJsonFeature} from '../../entities/geojson/IGeoJsonFeature';

const assert = chai.assert;

describe('GpxDataImporter', () => {

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

        const importer = importerFinder.getInstanceForFile(TestData.SAMPLE_GPX);
        const collId = await importer.fileToCollection(TestData.SAMPLE_GPX, `test-gpx-${uuid.v4()}`);

        const features: IGeoJsonFeature[] = await services.db.getGeoJsonDao().queryAll(collId).toArray();

        assert.lengthOf(features, 1);
        assert.equal(features[0].geometry.type, 'LineString');

    });

});
