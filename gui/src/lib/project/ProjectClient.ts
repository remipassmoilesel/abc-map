import {AxiosStatic} from 'axios';
import {IProject, Routes} from '../../../../shared/dist';

export class ProjectClient {

    constructor(private httpClient: AxiosStatic) {

    }

    public findProjectById(projectId: string): Promise<IProject> {
        const url = Routes.PROJECT_GET_BY_ID.withArgs({id: projectId}).path;
        return this.httpClient.get(url).then((resp) => resp.data);
    }

    public createNewProject(projectName: string): Promise<IProject> {
        const url = `${Routes.PROJECT_CREATE_NEW.path}?name=${projectName}`;
        return this.httpClient.get(url).then((resp) => resp.data);
    }

}
