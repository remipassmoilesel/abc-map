import {IProject} from "abcmap-shared";

export namespace ProjectModule {

  export enum ActionTypes {
    CREATE_PROJECT = '[project] Create new project',
    OPEN_PROJECT = '[project] Open project',

    SUCCESS = '[project] Success',
    ERROR = '[project] Error',
  }

  export class CreateProject {
    readonly type = ActionTypes.CREATE_PROJECT;
  }

  export class OpenProject {
    readonly type = ActionTypes.OPEN_PROJECT;

    constructor(public payload: { name: string }) {}
  }

  export class Success {
    readonly type = ActionTypes.SUCCESS;

    constructor(public payload: IProject) {}
  }

  export class Error {
    readonly type = ActionTypes.ERROR;

    constructor(public payload: Error) {}
  }

  export type Actions = CreateProject | OpenProject | Success | Error;
}
