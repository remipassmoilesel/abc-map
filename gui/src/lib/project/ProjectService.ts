import {AbcLocalStorageHelper, LSKey} from '@/lib/utils/AbcLocalStorageHelper';
import {AbcStoreWrapper} from '@/lib/store/AbcStoreWrapper';
import {IAbcApiClientMap} from '@/lib/IAbcApiClientMap';
import * as loglevel from 'loglevel';

export class ProjectService {

    private logger = loglevel.getLogger('ProjectService');

    constructor(private clients: IAbcApiClientMap,
                private storew: AbcStoreWrapper,
                private abcLocalst: AbcLocalStorageHelper) {

        this.listenDocumentReady();
    }

    public listenDocumentReady() {
        document.addEventListener('DOMContentLoaded', (event) => {
            this.initProject();
        });
    }

    public initProject(): Promise<any> {
        this.logger.info('Initializing project ...');

        const storedProjectId = this.abcLocalst.get(LSKey.CURRENT_PROJECT_ID);
        if (!storedProjectId) {
            return this.createNewProject();
        } else {
            return this.openProject(storedProjectId)
                .catch((err) => this.storew.gui.setProjectNotFoundModalVisible(true));
        }
    }

    public async createNewProject(): Promise<any> {
        const project = await this.clients.project.createNewProject('Nouveau projet');
        this.abcLocalst.save(LSKey.CURRENT_PROJECT_ID, project.id);
        return this.storew.project.setCurrentProject(project).then((res) => project);
    }

    public async openProject(projectId: string): Promise<any> {
        const project = await this.clients.project.findProjectById(projectId);
        this.abcLocalst.save(LSKey.CURRENT_PROJECT_ID, project.id);
        return this.storew.project.setCurrentProject(project).then((res) => project);
    }

}
