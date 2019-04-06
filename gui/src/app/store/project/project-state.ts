import {IProject} from 'abcmap-shared';

export interface IProjectState {
  currentProject?: IProject;
}

export const projectInitialState: IProjectState = {
  currentProject: undefined
};
