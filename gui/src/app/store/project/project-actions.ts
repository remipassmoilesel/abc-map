import {IProject} from 'abcmap-shared';
import {Action} from '@ngrx/store';
import {FeatureCollection} from 'geojson';

// Actions are events

export namespace ProjectModule {

  export enum ActionTypes {
    PROJECT_LOADED = '[project] Project updated',
    PROJECT_CLOSED = '[project] Project closed',
    VECTOR_LAYER_UPDATED = '[project] Vector layer updated'
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
    constructor(public payload: {layerId: string, featureCollection: FeatureCollection}){}
  }

  export type ActionsUnion = ProjectLoaded | ProjectClosed | VectorLayerUpdated;

}
