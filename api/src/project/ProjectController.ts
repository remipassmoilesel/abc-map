import express = require('express');
import {NextFunction} from 'express';
import {AbstractController} from '../lib/server/AbstractController';
import {ProjectService} from './ProjectService';
import {ApiRoutes, IProject, IProjectEventContent, ProjectEvent} from 'abcmap-shared';
import WebSocket from 'ws';
import {asyncHandler} from '../lib/server/asyncExpressHandler';

export class ProjectController extends AbstractController {

    constructor(private projectService: ProjectService) {
        super();
    }

    public getRouter(): express.Router {
        const router = express.Router();

        router.ws(ApiRoutes.PROJECT_WEBSOCKET.path, this.projectWebsocket);
        router.get(ApiRoutes.PROJECT_CREATE_NEW.path, asyncHandler(this.createNewProject));
        router.get(ApiRoutes.PROJECT_GET_BY_ID.path, asyncHandler(this.getProject));
        router.post(ApiRoutes.PROJECT.path, asyncHandler(this.saveProject));

        return router;
    }

    private projectWebsocket = async (ws: WebSocket, req: express.Request, next: NextFunction) => {
        const projectId = req.params.id;
        this.projectService.getEmitter()
            .on(ProjectEvent.PROJECT_UPDATED, (event: IProjectEventContent) => {
                if (event.projectId === projectId) {
                    ws.send(event);
                }
            });
    };

    private getProject = async (req: express.Request, res: express.Response, next: NextFunction) => {
        const projectId = req.params.id;
        return this.projectService.findProject(projectId)
            .then((project) => {
                res.json(project);
            });
    };

    private createNewProject = async (req: express.Request, res: express.Response, next: NextFunction) => {
        const projectName = req.query.name;
        return this.projectService.createNewProject(projectName)
            .then((project) => {
                res.json(project);
            });
    };

    private saveProject = async (req: express.Request, res: express.Response, next: NextFunction) => {
        const toSave: IProject = req.body;
        if(!toSave){
            return next("Project must be defined");
        }
        return this.projectService.updateProject(toSave)
            .then((project) => {
                res.json(project);
            });
    };

}
