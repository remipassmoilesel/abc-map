/**
 * Copyright © 2026 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */
import defaultsDeep from 'lodash/defaultsDeep';
import throttle from 'lodash/throttle';
import { StorePersistence } from './utils/StorePersistence.ts';
import { initialState } from './state.ts';
import type { MainState } from './reducer.ts';
import { mainReducer } from './reducer.ts';
import type { Reducer } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import type { ActionTypes } from './actions.ts';

const persistence = StorePersistence.newPersistence();
const preLoadedState = defaultsDeep(persistence.loadState(), initialState());

export function storeFactory(initialState?: MainState) {
  return configureStore<MainState, ActionTypes>({
    // FIXME: find a better typing
    reducer: mainReducer as unknown as Reducer<MainState, ActionTypes>,
    preloadedState: initialState,
  });
}

export const mainStore = storeFactory(preLoadedState);

export type MainStore = typeof mainStore;

// At every store change, we persist store state in localstorage, but at most X times per second
const persist = throttle(() => persistence.saveState(mainStore.getState()), 300, { leading: true });
mainStore.subscribe(persist);
