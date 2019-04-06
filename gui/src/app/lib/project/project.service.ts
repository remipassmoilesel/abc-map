import {Injectable} from '@angular/core';
import {ProjectClient} from './ProjectClient';
import {LocalStorageService, LSKey} from '../local-storage/local-storage.service';
import * as loglevel from 'loglevel';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/internal/operators/tap';
import {IProject} from 'abcmap-shared';
import {catchError, map} from 'rxjs/operators';
import {ProjectModule} from '../../store/project/project-actions';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private logger = loglevel.getLogger('ProjectService');

  constructor(private projectClient: ProjectClient,
              private store: Store<IMainState>,
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
          return this.createNewProject();
        }));
    }
  }

  public createNewProject(): Observable<any> {
    return this.projectClient.createNewProject('Nouveau projet')
      .pipe(tap(project => {
        this.localst.save(LSKey.CURRENT_PROJECT_ID, project.id);
        this.store.dispatch(new ProjectModule.ProjectUpdated(project));
      }));
  }

  public openProject(projectId: string): Observable<any> {
    return this.projectClient.findProjectById(projectId)
      .pipe(tap(project => {
        this.localst.save(LSKey.CURRENT_PROJECT_ID, project.id);
        this.store.dispatch(new ProjectModule.ProjectUpdated(project));
      }));
  }

  public listenProjectUpdates(): Observable<IProject | undefined> {
    return this.store.select(state => state.project)
      .pipe(map(projectState => projectState.project));
  }

}
