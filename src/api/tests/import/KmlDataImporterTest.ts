import * as chai from 'chai';
import {KmlDataImporter} from '../../../api/import/KmlDataImporter';
import {TestData} from '../TestData';
import {IImportedFile} from '../../../api/import/AbstractDataImporter';

const assert = chai.assert;

describe('KmlDataImporter', () => {

    it('Import should not fail', () => {

        const importer = new KmlDataImporter();
        return importer.getGeoJson(TestData.SAMPLE_KML).then((file: IImportedFile) => {
            assert.isNotNull(file.data);
            // assert.equal(file.type, 'FeatureCollection'); // TODO restore
        });

    });

});
