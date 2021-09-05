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

import { newTestServices, TestServices } from '../../../core/utils/test/TestServices';
import { abcRender } from '../../../core/utils/test/abcRender';
import { screen, waitFor } from '@testing-library/react';
import Search from './Search';
import sinon, { SinonStubbedInstance } from 'sinon';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import userEvent from '@testing-library/user-event';

describe('Search', () => {
  let services: TestServices;
  let map: SinonStubbedInstance<MapWrapper>;

  beforeEach(() => {
    services = newTestServices();
    map = sinon.createStubInstance(MapWrapper);
    services.geo.getMainMap.returns(map as unknown as MapWrapper);
  });

  it('should geolocate then update view', async () => {
    // Prepare
    abcRender(<Search />, { services });
    services.geo.getUserPosition.resolves([5, 6]);

    // Act
    userEvent.click(screen.getByTestId('geolocate'));

    // Assert
    await waitFor(() => {
      expect(services.geo.getUserPosition.callCount).toEqual(1);
      expect(map.moveViewToPosition.args).toEqual([[[5, 6], 12]]);
    });
  });
});
