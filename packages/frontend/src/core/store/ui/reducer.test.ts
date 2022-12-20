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

import { uiReducer } from './reducer';
import { UiActions } from './actions';
import { UiState } from './state';
import { deepFreeze } from '../../utils/deepFreeze';

describe('UI reducer', function () {
  let initialState: UiState;

  beforeEach(() => {
    initialState = deepFreeze({
      historyCapabilities: {},
      documentation: {
        scrollPosition: 0,
      },
      sideMenu: {},
      informations: {
        riskyDevice: false,
        installApp: false,
      },
      experimentalFeatures: {},
      visits: 0,
      remoteModuleUrls: [],
      lastModulesUsed: [],
      favoriteModules: [],
    });
  });

  it('RegisterModuleUsage', function () {
    // Act
    let state = initialState;
    for (let i = 0; i < 15; i++) {
      state = uiReducer(state, UiActions.registerModuleUsage(`test-module-${i}`));
    }

    state = uiReducer(state, UiActions.registerModuleUsage(`test-module-14`));
    state = uiReducer(state, UiActions.registerModuleUsage(`test-module-14`));
    state = uiReducer(state, UiActions.registerModuleUsage(`test-module-14`));

    // Assert
    expect(state?.lastModulesUsed).toEqual([
      'test-module-14',
      'test-module-13',
      'test-module-12',
      'test-module-11',
      'test-module-10',
      'test-module-9',
      'test-module-8',
      'test-module-7',
      'test-module-6',
      'test-module-5',
    ]);
  });
});
