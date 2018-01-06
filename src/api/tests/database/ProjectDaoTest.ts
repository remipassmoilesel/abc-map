import * as chai from 'chai';
import {TestUtils} from '../TestUtils';
import {Db} from 'mongodb';
import {ProjectDao} from '../../database/ProjectDao';
import {Project} from '../../entities/Project';
import {TileLayer} from '../../entities/layers/TileLayer';
import {GeoJsonLayer} from '../../entities/layers/GeoJsonLayer';
import {IServicesMap} from '../../services/IServiceMap';
import {initApplication, stopApplication} from '../../main';

const assert = chai.assert;

describe('ProjectDao', () => {

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

    it('> Insert, read and delete a project should succeed', async () => {
        const dao = new ProjectDao(db);

        // create a fake project and insert it
        const project = new Project('test project');

        const tileLayer = new TileLayer('Tile-Layer-1', null);
        project.layers.push(tileLayer);

        const geojLayer = new GeoJsonLayer('Geojson-Layer-1');
        project.layers.push(geojLayer);

        await dao.insert(project);

        // query project and compare it
        const queriedProject: Project = await dao.query();

        assert.deepEqual(project, queriedProject);
        assert.instanceOf(queriedProject, Project);
        assert.instanceOf(queriedProject.layers[0], TileLayer);
        assert.instanceOf(queriedProject.layers[1], GeoJsonLayer);

        await dao.clear();
    });


});
