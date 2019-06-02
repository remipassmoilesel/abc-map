import {IProjectState, projectInitialState} from './project-state';
import {ProjectModule} from './project-actions';
import {IMapLayer, IVectorLayer, LayerHelper, MapLayerType} from 'abcmap-shared';
import * as _ from 'lodash';

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
      if (!newState.currentProject) {
        return newState;
      }
      const layer: IMapLayer | undefined = _.find(newState.currentProject.layers, lay => lay.id === action.payload.layerId);
      if (!layer || layer.type !== MapLayerType.Vector) {
        return newState;
      }
      (layer as IVectorLayer).featureCollection = action.payload.featureCollection;
      return newState;
    }

    case ProjectModule.ActionTypes.ACTIVE_LAYER_CHANGED: {
      const newState = _.cloneDeep(state);
      if (!newState.currentProject) {
        return newState;
      }

      newState.currentProject.activeLayerId = action.payload.layerId;
      return newState;
    }

    case ProjectModule.ActionTypes.LAYER_REMOVED: {
      const newState = _.cloneDeep(state);
      if (!newState.currentProject) {
        return newState;
      }

      _.remove(newState.currentProject.layers, lay => lay.id === action.payload.layerId);
      if (newState.currentProject.layers.length === 0) {
        newState.currentProject.layers = [LayerHelper.newVectorLayer()];
      }

      if (newState.currentProject.activeLayerId === action.payload.layerId) {
        const lastLayerIndex = newState.currentProject.layers.length - 1;
        newState.currentProject.activeLayerId = newState.currentProject.layers[lastLayerIndex].id;
      }

      return newState;
    }

    case ProjectModule.ActionTypes.VECTOR_LAYER_ADDED: {
      const newState = _.cloneDeep(state);
      if (!newState.currentProject) {
        return newState;
      }

      newState.currentProject.layers.push(LayerHelper.newVectorLayer());
      return newState;
    }

    case ProjectModule.ActionTypes.PREDEFINED_LAYER_ADDED: {
      const newState = _.cloneDeep(state);
      if (!newState.currentProject) {
        return newState;
      }

      newState.currentProject.layers.push(LayerHelper.newPredefinedLayer(action.payload.preset));
      return newState;

    }

    case ProjectModule.ActionTypes.WMS_LAYER_ADDED: {
      const newState = _.cloneDeep(state);
      if (!newState.currentProject) {
        return newState;
      }

      newState.currentProject.layers.push(LayerHelper.newWmsLayer(action.payload.url, action.payload.params));
      return newState;

    }

    case ProjectModule.ActionTypes.DATA_IMPORTED_AS_LAYER: {
      const newState = _.cloneDeep(state);
      if (!newState.currentProject) {
        return newState;
      }

      newState.currentProject.layers.push(
        LayerHelper.newVectorLayer(action.payload.name, action.payload.collection)
      );
      return newState;
    }

    default: {
      return state;
    }

  }
}
