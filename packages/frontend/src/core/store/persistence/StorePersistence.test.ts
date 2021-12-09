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

import { StorePersistence } from './StorePersistence';
import { LocalStorageService, StorageKey } from '../../local-storage/LocalStorageService';
import sinon, { SinonStub } from 'sinon';
import { FillPatterns, LegendDisplay, UserStatus } from '@abc-map/shared';
import { MapTool } from '@abc-map/shared';
import { MainState } from '../reducer';
import { TestHelper } from '../../utils/test/TestHelper';
import { DimensionsPx } from '../../utils/DimensionsPx';
import { Views } from '../../geo/Views';
import { IconName } from '../../../assets/point-icons/IconName';

describe('StorePersistence', () => {
  let storage: LocalStorageService;
  let setStorageStub: SinonStub;
  let persistence: StorePersistence;

  beforeEach(() => {
    storage = new LocalStorageService();
    setStorageStub = sinon.stub(storage, 'set');
    persistence = new StorePersistence(storage);
  });

  it('persist should clean state, without undesirable state fields', () => {
    const sampleState: MainState = {
      project: {
        metadata: { name: 'test-project' } as any,
        layouts: [TestHelper.sampleLayout()],
        legend: {
          display: LegendDisplay.BottomRightCorner,
          items: [],
          width: 300,
          height: 500,
        },
        view: Views.random(),
      },
      map: {
        tool: MapTool.Point,
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
        mainMapDimensions: {
          width: 640,
          height: 480,
        },
      },
      authentication: {
        tokenString: 'abcd',
        userStatus: UserStatus.Authenticated,
        user: {
          id: 'test-user-id',
        } as any,
      },
      ui: {
        historyCapabilities: {
          TestHistoryKey: {
            canUndo: true,
            canRedo: true,
          },
        },
        documentation: {
          scrollPosition: 15,
        },
        sideMenu: {
          'menu-1': true,
          'menu-2': false,
        },
      },
    };
    const snapshot = stateSnapshot(sampleState);

    const expectedState: MainState = {
      project: undefined as any, // A new project is created on bootstrap
      map: {
        tool: MapTool.Move,
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
        mainMapDimensions: undefined as unknown as DimensionsPx,
      },
      authentication: {
        tokenString: 'abcd',
        userStatus: UserStatus.Authenticated,
        user: {
          id: 'test-user-id',
        } as any,
      },
      ui: {
        historyCapabilities: {},
        documentation: {
          scrollPosition: 15,
        },
        sideMenu: {
          'menu-1': true,
          'menu-2': false,
        },
      },
    };

    persistence.saveState(sampleState);
    expect(setStorageStub.callCount).toEqual(1);

    const call = setStorageStub.getCall(0);
    expect(call.args[0]).toEqual(StorageKey.REDUX_STATE);

    const actualState = JSON.parse(call.args[1]);
    expect(actualState).toEqual(expectedState);

    expect(stateSnapshot(sampleState)).toEqual(snapshot);
  });
});

function stateSnapshot(state: MainState): string {
  return JSON.stringify(state);
}
