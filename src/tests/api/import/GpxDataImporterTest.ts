import * as chai from 'chai';
import 'mocha';
import {TestData} from "../TestData";
import {GeoJsonLayer} from "../../../api/entities/layers/GeoJsonLayer";
import {GpxDataImporter} from "../../../api/import/GpxDataImporter";

const assert = chai.assert;

describe('GpxDataImporter', () => {

    it('Import should not fail', () => {

        const importer = new GpxDataImporter();
        return importer.getAsLayer(TestData.SAMPLE_GPX).then((layer: GeoJsonLayer) => {
            assert.isNotNull(layer.data);
            assert.equal(layer.data.type, 'FeatureCollection');
        });

    });

});
