import express = require("express");
import {AbstractController} from "../lib/server/AbstractController";
import {Routes} from "../../../shared/dist";
import {ProjectService} from "./ProjectService";

export class ProjectController extends AbstractController {

    public route = Routes.PROJECT;

    constructor(private projectService: ProjectService) {
        super();
    }

    public getRouter(): express.Router {
        const router = express.Router();

        router.get(Routes.PROJECT_GET_BY_ID.path, this.getProject);
        router.get(Routes.PROJECT_CREATE_NEW.path, this.createNewProject);

        return router;
    }

    private getProject = async (req: express.Request, res: express.Response) => {
        const projectId = req.params.id;
        this.projectService.getProject(projectId)
            .then(project => {
                res.json(project);
            })
            .catch(err => {
                res.status(500).json(err);
            })
    };

    private createNewProject = async (req: express.Request, res: express.Response) => {
        const projectName = req.query.name;
        this.projectService.createEmptyProject(projectName)
            .then(project => {
                res.json(project);
            })
            .catch(err => {
                res.status(500).json(err);
            });
    };

}
