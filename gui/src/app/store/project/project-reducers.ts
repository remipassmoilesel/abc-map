import {IProjectState, projectInitialState} from './project-state';
import {ProjectModule} from './project-actions';
import * as _ from 'lodash';
import {IMapLayer, IProject, MapLayerType, IVectorLayer} from 'abcmap-shared';

// All objects must be deep cloned

export function projectReducer(state = projectInitialState, action: ProjectModule.ActionsUnion): IProjectState {

  switch (action.type) {
    case ProjectModule.ActionTypes.PROJECT_LOADED: {
      const newState = _.cloneDeep(state);
      newState.currentProject = _.cloneDeep(action.payload);
      return newState;
    }

    case ProjectModule.ActionTypes.VECTOR_LAYER_UPDATED: {
      const newState = _.cloneDeep(state);
      if(!newState.currentProject){
        return newState;
      }
      const layer: IMapLayer | undefined = _.find(newState.currentProject.layers, lay => lay.id === action.payload.layerId);
      if(!layer || layer.type !== MapLayerType.Vector){
        return newState;
      }
      (layer as IVectorLayer).featureCollection = action.payload.featureCollection;
      return newState;
    }

    case ProjectModule.ActionTypes.ACTIVE_LAYER_CHANGED: {
      const newState = _.cloneDeep(state);
      if(!newState.currentProject){
        return newState;
      }

      newState.currentProject.activeLayerId = action.payload.layerId;
      return newState;
    }

    default: {
      return state;
    }

  }
}
