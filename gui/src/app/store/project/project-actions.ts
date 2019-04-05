import {IProject} from "abcmap-shared";
import {Action} from "@ngrx/store";

// Actions are events

export namespace ProjectModule {

  export enum ActionTypes {
    PROJECT_UPDATED = '[project] Project updated',
    PROJECT_CLOSED = '[project] Project closed'
  }

  export class ProjectUpdated implements Action {
    readonly type = ActionTypes.PROJECT_UPDATED;
    constructor(public payload: IProject) {}
  }

  export class ProjectClosed implements Action {
    readonly type = ActionTypes.PROJECT_CLOSED;
  }

  export type ActionsUnion = ProjectUpdated | ProjectClosed;

}
