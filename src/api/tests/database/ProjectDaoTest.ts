import * as chai from 'chai';
import {TestUtils} from '../TestUtils';
import {Db} from 'mongodb';
import {ProjectDao} from '../../database/ProjectDao';
import {Project} from '../../entities/Project';

const uuid = require('uuid');

const assert = chai.assert;

describe.only('ProjectDao', () => {

    let db: Db;

    before(async () => {
        db = await TestUtils.getMongodbConnection();
    });

    after(async () => {
        await db.close();
    });

    it('> Insert, read and delete a project should succeed', async () => {
        const dao = new ProjectDao(db);

        // create a fake project and insert it
        const project = new Project('test project');
        // project.layers.push(new TileLayer());

        await dao.insert(project);

        // query project and compare it
        const queriedProject: Project = await dao.query();

        assert.deepEqual(project, queriedProject);
        assert.instanceOf(queriedProject, Project);

        await dao.clear();
    });


});
