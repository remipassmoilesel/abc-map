import * as chai from 'chai';
import 'mocha';
import {KmlDataImporter} from "../../../api/import/KmlDataImporter";
import {TestData} from "../TestData";
import {GeoJsonLayer} from "../../../api/entities/layers/GeoJsonLayer";

const assert = chai.assert;

describe('KmlDataImporter', () => {

    it('Import should not fail', () => {

        const importer = new KmlDataImporter();
        return importer.getAsLayer(TestData.SAMPLE_KML).then((layer: GeoJsonLayer) => {
            assert.isNotNull(layer.data);
            assert.equal(layer.data.type, 'FeatureCollection');
        });

    });

});
