import {Injectable} from '@angular/core';
import {ProjectClient} from './ProjectClient';
import {LocalStorageService, LSKey} from '../local-storage/local-storage.service';
import * as loglevel from 'loglevel';
import {Observable, throwError} from 'rxjs';
import {tap} from 'rxjs/internal/operators/tap';
import {IMapLayer, IProject} from 'abcmap-shared';
import {catchError, first, flatMap, map} from 'rxjs/operators';
import {ProjectModule} from '../../store/project/project-actions';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {ToastService} from '../notifications/toast.service';
import {FeatureCollection} from 'geojson';
import {Actions, ofType} from '@ngrx/effects';
import VectorLayerUpdated = ProjectModule.VectorLayerUpdated;
import ProjectLoaded = ProjectModule.ProjectLoaded;
import ActionTypes = ProjectModule.ActionTypes;

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private logger = loglevel.getLogger('ProjectService');

  constructor(private projectClient: ProjectClient,
              private store: Store<IMainState>,
              private actions$: Actions,
              private toasts: ToastService,
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
        this.store.dispatch(new ProjectLoaded(project));
        this.toasts.info('Nouveau projet créé !');
      }));
  }

  public openProject(projectId: string): Observable<any> {
    return this.projectClient.findProjectById(projectId)
      .pipe(tap(project => {
        this.localst.save(LSKey.CURRENT_PROJECT_ID, project.id);
        this.store.dispatch(new ProjectLoaded(project));
      }));
  }

  public listenProjectState(): Observable<IProject | undefined> {
    return this.store.select(state => state.project)
      .pipe(map(projectState => projectState.currentProject));
  }

  public listenLayersState(): Observable<IMapLayer[]> {
    return this.store
      .select(state => state.project.currentProject ? state.project.currentProject.layers : []);
  }

  public listenProjectLoaded(): Observable<IProject | undefined> {
    return this.actions$.pipe(
      ofType(ActionTypes.PROJECT_LOADED),
      map((action: ProjectLoaded) => action.payload)
    );
  }

  public saveProject(): Observable<IProject> {
    return this.store.select(state => state.project.currentProject)
      .pipe(
        first(),
        flatMap(project => {
          if (!project) {
            this.toasts.errorForNonExistingProject();
            return throwError(new Error('Project is undefined'));
          }
          return this.projectClient.saveProject(project);
        }),
        tap(project => {
          this.toasts.info('Projet enregistré !');
        }),
        catchError(err => {
          this.toasts.error('Erreur lors de la sauvegarde, veuillez réessayer plus tard');
          return throwError(err);
        })
      );
  }

  public updateVectorLayer(layerId: string, featureCollection: FeatureCollection) {
    this.store.dispatch(new VectorLayerUpdated({layerId, featureCollection}));
  }

}
