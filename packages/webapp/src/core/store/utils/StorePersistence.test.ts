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

import { PersistedMainState, StorePersistence } from './StorePersistence';
import { StorageService, StorageKey } from '../../storage/StorageService';
import sinon, { SinonStub } from 'sinon';
import { FillPatterns, ProjectConstants, UserStatus } from '@abc-map/shared';
import { MainState } from '../reducer';
import { IconName } from '../../../assets/point-icons/IconName';
import { deepFreeze } from '../../utils/deepFreeze';
import { DateTime } from 'luxon';
import { CURRENT_STATE_VERSION } from '../state';

describe('StorePersistence', () => {
  let storage: StorageService;
  let setStorageStub: SinonStub;
  let persistence: StorePersistence;

  beforeEach(() => {
    storage = new StorageService();
    setStorageStub = sinon.stub(storage, 'set');
    persistence = new StorePersistence(storage);
  });

  it('persist should clean state, without undesirable state fields', () => {
    // Prepare
    const sampleState: PersistedMainState = deepFreeze({
      version: CURRENT_STATE_VERSION,
      state: {
        project: {
          metadata: {
            id: 'test-project-id',
            version: ProjectConstants.CurrentVersion,
            name: `Test project`,
            public: false,
          },
          mainView: {
            center: [0, 1],
            projection: { name: 'EPSG:4326' },
            resolution: 1,
            rotation: 6,
          },
          layouts: {
            list: [],
            activeId: 'test-active-layout-id',
            abcMapAttributionsEnabled: true,
          },
          sharedViews: {
            list: [],
            fullscreen: true,
            mapDimensions: {
              width: 800,
              height: 600,
            },
            activeId: 'test-active-view-id',
          },
          lastSaveOnline: DateTime.now(),
          lastExport: DateTime.now(),
        },
        map: {
          currentStyle: {
            fill: {
              color1: '#FFFFFF',
              color2: '#FF5733',
              pattern: FillPatterns.Flat,
            },
            stroke: {
              color: '#FF5733',
              width: 5,
            },
            text: {
              color: '#FF5733',
              font: 'AbcCantarell',
              size: 30,
              offsetX: 15,
              offsetY: 10,
              rotation: 5,
            },
            point: {
              icon: IconName.Icon0CircleFill,
              size: 15,
              color: '#FF5733',
            },
          },
          geolocation: {
            enabled: true,
            followPosition: true,
            rotateMap: true,
          },
        },
        authentication: {
          tokenString: 'abcd',
          userStatus: UserStatus.Authenticated,
          user: {
            id: 'test-user-id',
            email: 'test-user@mail.fr',
            password: 'test-password-value',
          },
        },
        ui: {
          historyCapabilities: {
            TestHistoryKey: {
              canUndo: true,
              canRedo: true,
            },
          },
          sideMenu: {
            'menu-1': true,
            'menu-2': false,
          },
          informations: {
            riskyDevice: true,
            installApp: true,
          },
          experimentalFeatures: {
            Feature1: true,
            Feature2: false,
          },
          visits: 1,
          remoteModuleUrls: ['https://module3', 'https://module4'],
          lastModulesUsed: ['module1', 'module2'],
          favoriteModules: ['module-1', 'module-2'],
          serviceWorker: {
            present: true,
            updateAvailable: true,
            installed: true,
            error: true,
          },
        },
      },
    });

    const expectedState: PersistedMainState = {
      version: 1,
      state: {
        project: {
          metadata: {
            id: 'test-project-id',
            version: ProjectConstants.CurrentVersion,
            name: `Test project`,
            public: false,
          },
          mainView: {
            center: [0, 1],
            projection: { name: 'EPSG:4326' },
            resolution: 1,
            rotation: 6,
          },
          layouts: {
            list: [],
            activeId: undefined,
            abcMapAttributionsEnabled: true,
          },
          sharedViews: {
            list: [],
            fullscreen: true,
            mapDimensions: {
              // Values will be overwritten at project loading
              width: 0,
              height: 0,
            },
            // Active view may have 'disappear'
            activeId: undefined,
          },
          lastSaveOnline: null,
          lastExport: null,
        },
        map: {
          currentStyle: {
            fill: {
              color1: '#FFFFFF',
              color2: '#FF5733',
              pattern: FillPatterns.Flat,
            },
            stroke: {
              color: '#FF5733',
              width: 5,
            },
            text: {
              color: '#FF5733',
              font: 'AbcCantarell',
              size: 30,
              offsetX: 15,
              offsetY: 10,
              rotation: 5,
            },
            point: {
              icon: IconName.Icon0CircleFill,
              size: 15,
              color: '#FF5733',
            },
          },
          geolocation: {
            enabled: true,
            followPosition: true,
            rotateMap: true,
          },
        },
        authentication: {
          tokenString: 'abcd',
          userStatus: UserStatus.Authenticated,
          user: {
            id: 'test-user-id',
            email: 'test-user@mail.fr',
            password: 'test-password-value',
          },
        },
        ui: {
          historyCapabilities: {},
          sideMenu: {},
          informations: {
            riskyDevice: true,
            installApp: true,
          },
          experimentalFeatures: {
            Feature1: true,
            Feature2: false,
          },
          visits: 1,
          remoteModuleUrls: ['https://module3', 'https://module4'],
          lastModulesUsed: ['module1', 'module2'],
          favoriteModules: ['module-1', 'module-2'],
          serviceWorker: {
            present: false,
            updateAvailable: false,
            installed: false,
            error: false,
          },
        },
      },
    };

    // Act
    persistence.saveState(sampleState.state as MainState);

    // Assert
    expect(setStorageStub.callCount).toEqual(1);

    const call = setStorageStub.getCall(0);
    expect(call.args[0]).toEqual(StorageKey.REDUX_STATE);

    const actualState = JSON.parse(call.args[1]);
    expect(actualState).toEqual(expectedState);
  });
});
