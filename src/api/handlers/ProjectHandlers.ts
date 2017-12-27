import {Ipc} from '../ipc/Ipc';
import {ProjectSubjects} from '../ipc/IpcSubject';
import {IpcEvent} from '../ipc/IpcEvent';
import {AbstractHandlersGroup, IServicesMap} from './AbstractHandlersGroup';
import {Logger} from '../dev/Logger';
import {Project} from "../entities/Project";

const logger = Logger.getLogger('ProjectHandlers');

export class ProjectHandlers extends AbstractHandlersGroup {

    constructor(ipc: Ipc, services: IServicesMap) {
        super(ipc, services);

        this.registerHandler(ProjectSubjects.CREATE_NEW, this.createNewProject.bind(this));
        this.registerHandler(ProjectSubjects.GET_CURRENT, this.getCurrentProject.bind(this));
        this.registerHandler(ProjectSubjects.ADD_LAYER, this.addLayer.bind(this));
        this.registerHandler(ProjectSubjects.DELETE_LAYERS, this.deleteLayer.bind(this));

        setInterval(this.persistProject.bind(this), 3 * 60 * 1000);
    }

    public async createNewProject() {

        const projectDao = this.services.db.getProjectDao();

        // TODO: do not drop previous project if not existing
        const previousProject: Project | null = await projectDao.query();
        if (previousProject) {
            await projectDao.clear();
        }

        // create a new project with a default layer
        const project = this.services.project.newProject();
        this.services.project.addLayer(this.services.map.getDefaultWmsLayers()[0]);

        await projectDao.insert(project);
    }

    public getCurrentProject() {
        return this.services.project.getCurrentProject();
    }

    public addLayer(event: IpcEvent) {
        return this.services.project.addLayer(event.data);
    }

    public deleteLayer(event: IpcEvent) {
        return this.services.project.deleteLayers(event.data);
    }

    public saveProjectAs(event: IpcEvent) {
        return Promise.resolve();
    }

    public persistProject() {
        logger.info('Automatic update of project in database ...');
        const projectDao = this.services.db.getProjectDao();
        const project = this.services.project.getCurrentProject();
        projectDao.update(project);
    }


}
