import {ActionReducer, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {projectReducer} from './project/project-reducers';
import {IProjectState} from './project/project-state';
import {IMapState} from './map/map-state';
import {mapReducer} from './map/map-reducers';
import {IGuiState} from './gui/gui-state';
import {guiReducer} from './gui/gui-reducers';
import {IUserState} from './user/user-state';
import {userReducer} from './user/user-reducers';

export interface IMainState {
  project: IProjectState;
  map: IMapState;
  gui: IGuiState;
  user: IUserState;
}

export const reducers: any = { // TODO: fix any, normally ActionReducerMap<State>  ?
  project: projectReducer,
  map: mapReducer,
  gui: guiReducer,
  user: userReducer,
};

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<IMainState>[] = !environment.production ? [] : []; // [debug]
