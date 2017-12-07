import 'mocha';
import * as chai from 'chai';
import {GeoJsonDao} from "../../../api/database/GeoJsonDao";
import {TestUtils} from "../TestUtils";
import {IGeoJsonFeature} from "../../../api/entities/geojson/IGeoJsonFeature";

const assert = chai.assert;

describe('GeoJsonDao', () => {

    const feature: IGeoJsonFeature = {
        type: 'Feature',
        geometry: {
            type: "Polygon",
            coordinates: [[
                [-73.99, 40.75],
                [-73.98, 40.76],
                [-73.99, 40.75]
            ]]
        },
        properties: {variable: 'value'}
    };

    it('> Insert document in a new collection should success', () => {
        return TestUtils.getMongodbConnection()
            .then((db) => {

                const dao = new GeoJsonDao(db);
                const collectionId = 'new-collection-' + new Date();

                return dao.insert(collectionId, feature)
                    .then(() => {

                        const cursor = dao.queryAll(collectionId);
                        return cursor.count().then((count) => {
                            assert.equal(count, 1)
                        });

                    })
            });
    });

});
