import * as chai from 'chai';
import {TestUtils} from "../TestUtils";
import {ProjectDao} from "../../database/ProjectDao";
import {Project} from "../../entities/Project";

const uuid = require('uuid');

const assert = chai.assert;

describe.only('ProjectDao', () => {

    it('> Insert, read and delete a project should succeed', async () => {

        const dbConnection = await TestUtils.getMongodbConnection();

        const project = new Project('test project');
        const dao = new ProjectDao(dbConnection);

        await dao.insert(project);

        const queriedProject: Project = await dao.query();

        console.log("queriedProject");
        console.log(queriedProject);
        console.log("project");
        console.log(project);

        assert.deepEqual(project, queriedProject);
        assert.instanceOf(queriedProject, Project);

        dao.clear();
    });


});
