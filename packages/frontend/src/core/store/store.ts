/**
 * Copyright © 2021 Rémi Pace.
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
import { StorePersistence } from './persistence/StorePersistence';
import { initialState } from './state';
import { MainState, mainReducer } from './reducer';
import { createStore, Store } from 'redux';
import { getAbcWindow } from '@abc-map/shared';

const persistence = StorePersistence.newPersistence();
const preLoadedState = defaultsDeep(persistence.loadState(), initialState());

const _window = getAbcWindow();
const reduxExtension = _window.__REDUX_DEVTOOLS_EXTENSION__ && _window.__REDUX_DEVTOOLS_EXTENSION__();

export function storeFactory(preLoadedState?: MainState): Store<MainState> {
  return createStore(mainReducer, preLoadedState, reduxExtension);
}

export const mainStore = storeFactory(preLoadedState);

// At every store change, we persist store state in localstorage, but at most X times per second
const persist = throttle(() => persistence.saveState(mainStore.getState()), 300, { leading: true });
mainStore.subscribe(() => persist());

export type MainStore = typeof mainStore;
