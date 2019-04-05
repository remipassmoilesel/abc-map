import {IProjectState, projectInitialState} from "./project-state";
import {ProjectModule} from "./project-actions";

export function projectReducer(state = projectInitialState, action: ProjectModule.Actions): IProjectState {

  switch (action.type) {
    case ProjectModule.ActionTypes.PROJECT_UPDATED: {
      return {
        ...state,
        project: action.payload,
      };
    }

    default: {
      // TODO: replace by logger
      console.log("Unknown action: " + action);
      return state;
    }

  }
}
