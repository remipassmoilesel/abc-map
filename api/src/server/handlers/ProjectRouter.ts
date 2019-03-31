import express = require("express");
import {AbstractRouter} from "./AbstractRouter";
import {IProject} from "../../../../shared/src/IProject";

export class ProjectRouter extends AbstractRouter {

    public basePath = "/project";

    public getRouter(): express.Router {
        const router = express.Router();

        router.get("/current", this.getCurrentProject);

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
