import * as chai from 'chai';
import {KmlDataImporter} from '../../../api/import/KmlDataImporter';
import {TestData} from '../TestData';

const assert = chai.assert;

describe('KmlDataImporter', () => {

    it('Import should not fail', async () => {

        const importer = new KmlDataImporter();
        const collectionIds = await importer.fileToCollection(TestData.SAMPLE_KML);

    });

});
