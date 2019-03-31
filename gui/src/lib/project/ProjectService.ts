import {AxiosStatic} from "axios";
import {IProject, Routes} from "../../../../shared/dist";

export class ProjectService {

    constructor(private httpClient: AxiosStatic) {

    }

    public findProjectById(projectId: string): Promise<IProject> {
        const url = Routes.PROJECT_GET_BY_ID.withArgs({id: projectId}).path;
        return this.httpClient.get(url).then(resp => resp.data);
    }

}
