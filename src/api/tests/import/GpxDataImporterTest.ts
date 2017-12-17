import * as chai from 'chai';
import {TestData} from "../TestData";
import {GpxDataImporter} from "../../../api/import/GpxDataImporter";
import {IImportedFile} from "../../../api/import/AbstractDataImporter";

const assert = chai.assert;

describe('GpxDataImporter', () => {

    it('Import should not fail', () => {

        const importer = new GpxDataImporter();
        return importer.getGeoJson(TestData.SAMPLE_GPX).then((file: IImportedFile) => {
            assert.isNotNull(file.data);
            // console.log(JSON.stringify(file))
            // assert.equal(file.type, 'FeatureCollection'); // TODO: restore
        });

    });

});
