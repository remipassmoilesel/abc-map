import {IProject} from "abcmap-shared";

export interface IProjectState {
  project?: IProject;
}

export const projectInitialState: IProjectState = {
  project: undefined
}
