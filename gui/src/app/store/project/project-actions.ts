import {IProject, MapLayerType} from 'abcmap-shared';
import {Action} from '@ngrx/store';
import {FeatureCollection} from 'geojson';

// Actions are events

export namespace ProjectModule {

  export enum ActionTypes {
    PROJECT_LOADED = '[project] Project updated',
    PROJECT_CLOSED = '[project] Project closed',
    VECTOR_LAYER_UPDATED = '[project] Vector layer updated',
    LAYER_ADDED = '[project] Layer added',
    LAYER_REMOVED = '[project] Layer removed'
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

  export class LayerAdded implements Action {
    readonly type = ActionTypes.LAYER_ADDED;

    constructor(public payload: { layerType: MapLayerType }) {}
  }

  export class LayerRemoved implements Action {
    readonly type = ActionTypes.LAYER_REMOVED;

    constructor(public payload: { layerId: string }) {}
  }

  export type ActionsUnion = ProjectLoaded
    | ProjectClosed
    | LayerAdded
    | LayerRemoved
    | VectorLayerUpdated;

}
