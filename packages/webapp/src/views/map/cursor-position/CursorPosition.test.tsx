/**
 * Copyright © 2023 Rémi Pace.
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

import { act, screen } from '@testing-library/react';
import CursorPosition from './CursorPosition';
import { abcRender } from '../../../core/utils/test/abcRender';
import { newTestServices, TestServices } from '../../../core/utils/test/TestServices';
import * as sinon from 'sinon';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';

describe('CursorPosition', () => {
  let services: TestServices;
  beforeEach(() => {
    services = newTestServices();
  });

  it('should render nothing if no position', () => {
    const map = fakeMap();
    services.geo.getMainMap.returns(map as unknown as MapWrapper);

    const { unmount } = abcRender(<CursorPosition />, { services });

    expect(screen.queryByText('Position du curseur')).toBeNull();
    expect(map.unwrap().on.callCount).toEqual(1);

    unmount();
    expect(map.unwrap().un.callCount).toEqual(1);
  });

  it('should render position', async () => {
    // Prepare
    const map = fakeMap();
    services.geo.getMainMap.returns(map as unknown as MapWrapper);

    abcRender(<CursorPosition />, { services });

    const handler = map.unwrap().on.args[0][1];

    // Act
    await act(() => {
      handler({ coordinate: [-20026376.39, -20048966.1], map: map.unwrap() });
    });

    // Assert
    expect(screen.queryByText('Position du curseur')).toBeDefined();
    expect(screen.queryByText('Latitude: -85.06')).toBeDefined();
    expect(screen.queryByText('Longitude: -179.9')).toBeDefined();
  });
});

function fakeMap() {
  const onStub = sinon.stub();
  const unStub = sinon.stub();
  return {
    unwrap: function () {
      return {
        on: onStub,
        un: unStub,
        getView: function () {
          return {
            getProjection: function () {
              return 'EPSG:3857';
            },
          };
        },
      };
    },
  };
}
