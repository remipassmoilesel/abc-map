import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable} from "rxjs";
import {ProjectModule} from "./project-actions";

@Injectable()
export class ProjectEffects {

  constructor(private actions$: Actions) {}

  @Effect() ProjectUpdated$: Observable<ProjectModule.ActionsUnion> = this.actions$
    .pipe(
      ofType<ProjectModule.ProjectUpdated>(ProjectModule.ActionTypes.PROJECT_UPDATED)
    );

}
