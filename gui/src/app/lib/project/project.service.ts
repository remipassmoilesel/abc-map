import { Injectable } from '@angular/core';
import {ProjectClient} from "./ProjectClient";
import {LocalStorageService, LSKey} from "../local-storage/local-storage.service";
import * as loglevel from 'loglevel';
import {Observable} from "rxjs";
import {tap} from "rxjs/internal/operators/tap";
import {IProject} from "abcmap-shared";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private logger = loglevel.getLogger('ProjectService');

  constructor(private projectClient: ProjectClient,
              private localst: LocalStorageService) {
    this.initProjectWhenAppReady();
  }

  private initProjectWhenAppReady() {
    document.addEventListener('DOMContentLoaded', (event) => {
      this.initProject().subscribe();
    });
  }

  public initProject(): Observable<IProject> {
    this.logger.info('Initializing project ...');

    const storedProjectId = this.localst.get(LSKey.CURRENT_PROJECT_ID);
    if (!storedProjectId) {
      return this.createNewProject();
    } else {
      return this.openProject(storedProjectId)
        .pipe(catchError(error => {
          this.logger.error(error);
          return this.storew.gui.setProjectNotFoundModalVisible(true);
        }));
    }
  }

  public createNewProject(): Observable<any> {
    return this.projectClient.createNewProject('Nouveau projet')
      .pipe(tap(project => {
        this.localst.save(LSKey.CURRENT_PROJECT_ID, project.id);
        this.storew.project.setCurrentProject(project).then((res) => project);
      }));
  }

  public openProject(projectId: string): Observable<any> {
    return this.projectClient.findProjectById(projectId)
      .pipe(tap(project => {
        this.localst.save(LSKey.CURRENT_PROJECT_ID, project.id);
        return this.storew.project.setCurrentProject(project).then((res) => project);
      }));
    }

}
