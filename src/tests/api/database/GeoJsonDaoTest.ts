import * as chai from 'chai';
import {GeoJsonDao} from "../../../api/database/GeoJsonDao";
import {TestUtils} from "../TestUtils";
import {IGeoJsonFeature} from "../../../api/entities/geojson/IGeoJsonFeature";
import {TestData} from "../TestData";
import {IGeoJsonFeatureCollection} from "../../../api/entities/geojson/IGeoJsonFeatureCollection";

const uuid = require('uuid');

const assert = chai.assert;

describe('GeoJsonDao', () => {

    const coordinates = () => [Math.random() * 80, Math.random() * 50];

    const getGeoJsonFeature = () => {

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

        feature.geometry.coordinates = [[coordinates(), coordinates()]];
        feature.properties = [coordinates(), coordinates()];
        return feature;
    };


    it('> Insert a geojson document in a new collection should success', () => {
        return TestUtils.getMongodbConnection()
            .then((db) => {

                const dao = new GeoJsonDao(db);
                const collectionId = uuid.v4();

                return dao.insertMany(collectionId, require(TestData.SAMPLE_GEOJSON).features)
                    .then(() => {

                        const cursor = dao.queryAll(collectionId);
                        return cursor.count().then((count) => {
                            assert.equal(count, 1);
                        });

                    })
            });
    });

    it('> Insert many documents in a new collection should success', () => {
        return TestUtils.getMongodbConnection()
            .then((db) => {

                const dao = new GeoJsonDao(db);
                const collectionId = uuid.v4();

                return dao.insertMany(collectionId, [
                    getGeoJsonFeature(),
                    getGeoJsonFeature(),
                    getGeoJsonFeature()
                ])
                    .then(() => {

                        const cursor = dao.queryAll(collectionId);
                        return cursor.count().then((count) => {
                            assert.equal(count, 3);
                        });

                    })
            });
    });

    it('> Create a geoindex should success', () => {

        const shapes: IGeoJsonFeatureCollection = require(TestData.JSON_GRENOBLE_SHAPES);

        return TestUtils.getMongodbConnection()
            .then((db) => {

                const dao = new GeoJsonDao(db);
                const collectionId = uuid.v4();

                return dao.insertMany(collectionId, shapes.features)
                    .then(() => {
                        return dao.createGeoIndex(collectionId)
                    })
                    .then((data) => {
                        assert.equal(data, 'geometry_2dsphere');
                    });
            });
    });

    it('> Filter shapes with a polygon should success', () => {

        const shapes: IGeoJsonFeatureCollection = require(TestData.JSON_GRENOBLE_SHAPES);
        const filter: IGeoJsonFeatureCollection = require(TestData.JSON_GRENOBLE_SHAPES_FILTER1);

        assert.lengthOf(shapes.features, 6);

        return TestUtils.getMongodbConnection()
            .then((db) => {

                const dao = new GeoJsonDao(db);
                const collectionId = uuid.v4();

                return dao.insertMany(collectionId, shapes.features)
                    .then(() => {
                        return dao.createGeoIndex(collectionId)
                    })
                    .then(() => {
                        const cursor = dao.queryForArea(collectionId, filter.features[0].geometry);
                        return cursor.count().then((count) => {
                            assert.equal(count, 2);
                        });
                    })
            });
    });

});
