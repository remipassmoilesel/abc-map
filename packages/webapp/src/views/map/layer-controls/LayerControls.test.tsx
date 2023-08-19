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

import React from 'react';
import { screen } from '@testing-library/react';
import { LayerControls } from './LayerControls';
import { newTestServices, TestServices } from '../../../core/utils/test/TestServices';
import { abcRender } from '../../../core/utils/test/abcRender';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { MapFactory } from '../../../core/geo/map/MapFactory';

describe('LayerControls', () => {
  let map: MapWrapper;
  let testServices: TestServices;

  beforeEach(() => {
    testServices = newTestServices();

    map = MapFactory.createNaked();
    testServices.geo.getMainMap.returns(map);
  });

  it('renders without layers', () => {
    abcRender(<LayerControls />, { services: testServices });
    const linkElement = screen.getByText(/No layer/i);
    expect(linkElement).toBeInTheDocument();
  });
});
