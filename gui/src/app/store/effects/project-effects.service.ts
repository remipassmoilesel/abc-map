import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {Observable} from "rxjs";
import {ProjectModule} from "../actions/ProjectActions";
import {switchMap} from "rxjs/internal/operators/switchMap";
import {ProjectService} from "../../lib/project/project.service";
import {of} from "rxjs/internal/observable/of";
import {catchError, map} from "rxjs/operators";

@Injectable()
export class ProjectEffects {

  constructor(private actions$: Actions,
              private projectService: ProjectService) {}

  @Effect() NewProject$: Observable<ProjectModule.Actions> = this.actions$
    .pipe(
      ofType<ProjectModule.CreateProject>(ProjectModule.ActionTypes.CREATE_PROJECT),
      switchMap(action => this.projectService.createNewProject()),
      map(project => new ProjectModule.Success(project)),
      catchError((err) => of(new ProjectModule.Error(err)))
    );

}
