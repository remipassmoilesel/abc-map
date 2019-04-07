import {IProjectState, projectInitialState} from './project-state';
import {ProjectModule} from './project-actions';
import * as _ from 'lodash';
import {IMapLayer, IProject, MapLayerType, IVectorLayer} from 'abcmap-shared';

// All objects must be deep cloned

export function projectReducer(state = projectInitialState, action: ProjectModule.ActionsUnion): IProjectState {

  switch (action.type) {
    case ProjectModule.ActionTypes.PROJECT_LOADED: {
      return {
        ...state,
        currentProject: _.cloneDeep(action.payload),
      };
    }

    case ProjectModule.ActionTypes.VECTOR_LAYER_UPDATED: {
      if(!state.currentProject){
        return state;
      }
      const currentProject: IProject = _.cloneDeep(state.currentProject);
      const layer: IMapLayer | undefined = _.find(currentProject.layers, lay => lay.id === action.payload.layerId);
      if(!layer || layer.type !== MapLayerType.Vector){
        return state;
      }
      (layer as IVectorLayer).featureCollection = action.payload.featureCollection
      return {
        ...state,
        currentProject,
      }
    }

    default: {
      return state;
    }

  }
}
