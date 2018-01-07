import * as chai from 'chai';
import {TestData} from '../TestData';
import {GpxDataImporter} from '../../../api/import/GpxDataImporter';

const assert = chai.assert;

describe('GpxDataImporter', () => {

    it('Import should not fail', async () => {

        const importer = new GpxDataImporter();
        const collId = await importer.fileToCollection(TestData.SAMPLE_GPX);

    });

});
