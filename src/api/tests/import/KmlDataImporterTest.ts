import * as chai from 'chai';
import {KmlDataImporter} from '../../../api/import/KmlDataImporter';
import {TestData} from '../TestData';
import * as uuid from 'uuid';
import {Db} from 'mongodb';
import {IServicesMap} from '../../services/IServiceMap';
import {ApiDevUtilities} from '../../dev/ApiDevUtilities';
import {initApplication, stopApplication} from '../../main';
import {TestUtils} from '../TestUtils';
import {DataImporterFinder} from '../../import/DataImporterFinder';
import {IGeoJsonFeature} from '../../entities/geojson/IGeoJsonFeature';

const assert = chai.assert;

describe('KmlDataImporter', () => {

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

        const importer = importerFinder.getInstanceForFile(TestData.SAMPLE_KML) as KmlDataImporter;
        assert.instanceOf(importer, KmlDataImporter);

        const collId = await importer.fileToCollection(TestData.SAMPLE_KML, `test-gpx-${uuid.v4()}`);

        const features: IGeoJsonFeature[] = await services.db.getGeoJsonDao().queryAll(collId).toArray();

        assert.lengthOf(features, 2);
        assert.equal(features[0].geometry.type, 'Point');
        assert.equal(features[1].geometry.type, 'LineString');

    });

});
