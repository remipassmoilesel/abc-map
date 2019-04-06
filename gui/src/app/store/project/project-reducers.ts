import {IProjectState, projectInitialState} from './project-state';
import {ProjectModule} from './project-actions';
import * as loglevel from 'loglevel';

const logger = loglevel.getLogger('projectReducer');

export function projectReducer(state = projectInitialState, action: ProjectModule.ActionsUnion): IProjectState {

  switch (action.type) {
    case ProjectModule.ActionTypes.PROJECT_UPDATED: {
      return {
        ...state,
        project: action.payload,
      };
    }

    default: {
      return state;
    }

  }
}
