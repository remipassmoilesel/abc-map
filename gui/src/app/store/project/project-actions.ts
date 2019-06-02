import {IProject, IWmsParams, PredefinedLayerPreset} from 'abcmap-shared';
import {Action} from '@ngrx/store';
import {FeatureCollection} from 'geojson';

// Actions are events

export namespace ProjectModule {

  export enum ActionTypes {
    PROJECT_LOADED = '[project] Project updated',
    PROJECT_CLOSED = '[project] Project closed',
    VECTOR_LAYER_UPDATED = '[project] Vector layer updated',
    ACTIVE_LAYER_CHANGED = '[project] Active layer changed',
    VECTOR_LAYER_ADDED = '[project] Vector layer added',
    PREDEFINED_LAYER_ADDED = '[project] Predefined layer added',
    DATA_IMPORTED_AS_LAYER = '[project] Data imported as layer',
    WMS_LAYER_ADDED = '[project] Wms layer added',
    LAYER_REMOVED = '[project] Layer removed',
  }

  export class ProjectLoaded implements Action {
    readonly type = ActionTypes.PROJECT_LOADED;

    constructor(public payload: IProject) {}
  }

  export class ProjectClosed implements Action {
    readonly type = ActionTypes.PROJECT_CLOSED;
  }

  export class VectorLayerUpdated implements Action {
    readonly type = ActionTypes.VECTOR_LAYER_UPDATED;

    constructor(public payload: { layerId: string, featureCollection: FeatureCollection }) {}
  }

  export class ActiveLayerChanged implements Action {
    readonly type = ActionTypes.ACTIVE_LAYER_CHANGED;

    constructor(public payload: { layerId: string }) {}
  }

  export class VectorLayerAdded implements Action {
    readonly type = ActionTypes.VECTOR_LAYER_ADDED;

    constructor() {}
  }

  export class PredefinedLayerAdded implements Action {
    readonly type = ActionTypes.PREDEFINED_LAYER_ADDED;

    constructor(public payload: {preset: PredefinedLayerPreset}) {}
  }

  export class WmsLayerAdded implements Action {
    readonly type = ActionTypes.WMS_LAYER_ADDED;

    constructor(public payload: { url: string, params: IWmsParams}) {}
  }

  export class DataImportedAsLayer implements Action {
    readonly type = ActionTypes.DATA_IMPORTED_AS_LAYER;

    constructor(public payload: { name: string, collection: FeatureCollection}) {}
  }

  export class LayerRemoved implements Action {
    readonly type = ActionTypes.LAYER_REMOVED;

    constructor(public payload: { layerId: string }) {}
  }

  export type ActionsUnion = ProjectLoaded
    | ProjectClosed
    | ActiveLayerChanged
    | VectorLayerAdded
    | PredefinedLayerAdded
    | WmsLayerAdded
    | DataImportedAsLayer
    | LayerRemoved
    | VectorLayerUpdated;

}
