import {IProject} from "abcmap-shared";

export interface IProjectState {
  project: IProject | null;
}

export const projectInitialState: IProjectState = {
  project: null
}


