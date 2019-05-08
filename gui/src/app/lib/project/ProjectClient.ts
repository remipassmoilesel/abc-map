import {ApiRoutes, IProject} from 'abcmap-shared';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectClient {

  constructor(private httpClient: HttpClient) {

  }

  public findProjectById(projectId: string): Observable<IProject> {
    const url = ApiRoutes.PROJECT_GET_BY_ID.withArgs({id: projectId}).path;
    return this.httpClient.get<IProject>(url);
  }

  public createNewProject(projectName: string): Observable<IProject> {
    const url = `${ApiRoutes.PROJECT_CREATE_NEW.path}?name=${projectName}`;
    return this.httpClient.get<IProject>(url);
  }

  public saveProject(project: IProject): Observable<IProject> {
    const url = `${ApiRoutes.PROJECT.path}`;
    return this.httpClient.post<IProject>(url, project);
  }
}
