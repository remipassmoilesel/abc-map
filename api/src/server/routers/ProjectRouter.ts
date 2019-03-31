import express = require("express");
import {AbstractRouter} from "./AbstractRouter";
import {Routes} from "../../../../shared/dist/src/routes/Routes";
import {IProject} from "../../../../shared/dist/src/project/IProject";

export class ProjectRouter extends AbstractRouter {

    public route = Routes.PROJECT;

    public getRouter(): express.Router {
        const router = express.Router();

        router.get(Routes.PROJECT_CURRENT.path, this.getCurrentProject);

        return router;
    }

    getCurrentProject = (req: express.Request, res: express.Response) => {
        const project: IProject = {
            id: 'id',
            name: 'name',
            activeLayer: null,
            layers: []
        };
        res.json(project);
    }

}
