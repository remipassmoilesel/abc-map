import * as chai from 'chai';
import * as uuid from 'uuid';
import {Db} from 'mongodb';
import {GeoJsonDao} from '../../database/GeoJsonDao';
import {TestUtils} from '../TestUtils';
import {IGeoJsonFeature} from '../../entities/geojson/IGeoJsonFeature';
import {TestData} from '../TestData';
import {IGeoJsonFeatureCollection} from '../../entities/geojson/IGeoJsonFeatureCollection';
import {initApplication, stopApplication} from '../../main';
import {IServicesMap} from '../../services/IServiceMap';

const assert = chai.assert;

describe('GeoJsonDao', () => {

    let db: Db;

    let ipcStub;
    let services: IServicesMap;

    before(async () => {
        ipcStub = TestUtils.getStubbedIpc();
        services = await initApplication(ipcStub.ipc);
        db = await TestUtils.getMongodbConnection();
    });

    after(async () => {
        await stopApplication();
    });

    const coordinates = () => [Math.random() * 80, Math.random() * 50];

    const getGeoJsonFeature = () => {

        const feature: IGeoJsonFeature = {
            geometry: {
                coordinates: [[
                    [-73.99, 40.75],
                    [-73.98, 40.76],
                    [-73.99, 40.75],
                ]],
                type: 'Polygon',
            },
            properties: {variable: 'value'},
            type: 'Feature',
        };

        feature.geometry.coordinates = [[coordinates(), coordinates()]];
        feature.properties = [coordinates(), coordinates()];
        return feature;
    };

    it('> Insert a geojson document in a new collection should succeed', async () => {

        const dao = new GeoJsonDao(db);
        const collectionId = uuid.v4();

        await dao.insertMany(collectionId, require(TestData.SAMPLE_GEOJSON).features);

        const cursor = await dao.queryAll(collectionId);
        const count = await cursor.count();
        assert.equal(count, 1);
    });

    it('> Insert many documents in a new collection should succeed', async () => {
        const dao = new GeoJsonDao(db);
        const collectionId = uuid.v4();

        await dao.insertMany(collectionId, [
            getGeoJsonFeature(),
            getGeoJsonFeature(),
            getGeoJsonFeature(),
        ]);

        const cursor = await dao.queryAll(collectionId);
        const count = await cursor.count();
        assert.equal(count, 3);

    });

    it('> Create a geoindex should succeed', async () => {

        const shapes: IGeoJsonFeatureCollection = require(TestData.JSON_GRENOBLE_SHAPES);

        const dao = new GeoJsonDao(db);
        const collectionId = uuid.v4();

        await dao.insertMany(collectionId, shapes.features);
        const index = await dao.createGeoIndex(collectionId);

        assert.equal(index, 'geometry_2dsphere');

    });

    it('> Filter shapes with a polygon should succeed', async () => {

        const shapes: IGeoJsonFeatureCollection = require(TestData.JSON_GRENOBLE_SHAPES);
        const filter: IGeoJsonFeatureCollection = require(TestData.JSON_GRENOBLE_SHAPES_FILTER1);

        assert.lengthOf(shapes.features, 6);

        const dao = new GeoJsonDao(db);
        const collectionId = uuid.v4();

        await dao.insertMany(collectionId, shapes.features);
        await dao.createGeoIndex(collectionId);
        const cursor = dao.queryForArea(collectionId, filter.features[0].geometry);
        const count = await cursor.count();
        assert.equal(count, 2);

    });

});
