import {IProjectState, projectInitialState} from './project-state';
import {ProjectModule} from './project-actions';
import * as _ from 'lodash';

// All objects must be deep cloned

export function projectReducer(state = projectInitialState, action: ProjectModule.ActionsUnion): IProjectState {

  switch (action.type) {
    case ProjectModule.ActionTypes.PROJECT_UPDATED: {
      return {
        ...state,
        currentProject: _.cloneDeep(action.payload),
      };
    }

    default: {
      return state;
    }

  }
}
