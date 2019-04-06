import {ActionReducer, ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {projectReducer} from './project/project-reducers';
import {IProjectState} from './project/project-state';

export interface IMainState {
  project: IProjectState;
}

export const reducers: any = { // TODO: fix any, normally ActionReducerMap<State>  ?
  project: projectReducer
};

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<IMainState>[] = !environment.production ? [] : []; // [debug]
