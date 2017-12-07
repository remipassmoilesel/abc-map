import 'mocha';
import * as chai from 'chai';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import {GeoJsonDao} from "../../../api/database/GeoJsonDao";
import {TestUtils} from "../TestUtils";
import {IGeoJsonFeature} from "../../../api/entities/geojson/IGeoJsonFeature";

const assert = chai.assert;

describe.skip('GeoJsonDao', () => {

    const feature: IGeoJsonFeature = {
        _id: null,
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

    const getGeoJsonFeature = () => {
        const feat = _.cloneDeep(feature);
        feat._id = uuid.v4();
        return feature;
    };

    it('> Insert document in a new collection should success', () => {
        return TestUtils.getMongodbConnection()
            .then((db) => {

                const dao = new GeoJsonDao(db);
                const collectionId = uuid.v4();

                return dao.insert(collectionId, feature)
                    .then(() => {

                        const cursor = dao.queryAll(collectionId);
                        return cursor.count().then((count) => {
                            assert.equal(count, 1)
                        });

                    })
            });
    });

    it('> Insert multiple documents in a new collection should success', () => {
        return TestUtils.getMongodbConnection()
            .then((db) => {

                const dao = new GeoJsonDao(db);
                const collectionId = uuid.v4();

                return dao.insertMany(collectionId, [
                    getGeoJsonFeature(),
                    getGeoJsonFeature(),
                    getGeoJsonFeature()])
                    .then(() => {

                        const cursor = dao.queryAll(collectionId);
                        return cursor.count().then((count) => {
                            assert.equal(count, 3)
                        });

                    })
            });
    });

});
