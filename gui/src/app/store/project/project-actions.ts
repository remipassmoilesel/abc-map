import {IProject} from "abcmap-shared";

// Actions are events

export namespace ProjectModule {

  export enum ActionTypes {
    PROJECT_UPDATED = '[project] Project updated',
  }

  export class ProjectUpdated {
    readonly type = ActionTypes.PROJECT_UPDATED;
    constructor(public payload: IProject) {}
  }

  export type Actions = ProjectUpdated;
}
