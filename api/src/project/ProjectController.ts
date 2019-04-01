import express = require("express");
import {NextFunction} from "express";
import {AbstractController} from "../server/AbstractController";
import {IProjectEventContent, ProjectEvent, Routes} from "../../../shared/dist";
import {ProjectService} from "./ProjectService";
import * as ws from 'ws';

export class ProjectController extends AbstractController {

    constructor(private projectService: ProjectService) {
        super();
    }

    public getRouter(): express.Router {
        const router = express.Router();

        router.get(Routes.PROJECT_CREATE_NEW.path, this.createNewProject);
        router.ws(Routes.PROJECT_WEBSOCKET.path, this.projectWebsocket);
        router.get(Routes.PROJECT_GET_BY_ID.path, this.getProject);

        return router;
    }

    private projectWebsocket = async (ws: ws, req: express.Request, next: NextFunction) => {
        const projectId = req.params.id;
        this.projectService.getEmitter()
            .on(ProjectEvent.PROJECT_UPDATED, (event: IProjectEventContent) => {
                if (event.projectId === projectId) {
                    ws.send(event)
                }
            })
    }

    private getProject = async (req: express.Request, res: express.Response, next: NextFunction) => {
        const projectId = req.params.id;
        this.projectService.findProject(projectId)
            .then(project => {
                res.json(project);
            })
            .catch(next);
    };

    private createNewProject = async (req: express.Request, res: express.Response, next: NextFunction) => {
        const projectName = req.query.name;
        this.projectService.createEmptyProject(projectName)
            .then(project => {
                res.json(project);
            })
            .catch(next);
    };

}
