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

import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { newTestServices, TestServices } from '../../core/utils/test/TestServices';
import sinon, { SinonStub } from 'sinon';
import { MapFactory } from '../../core/geo/map/MapFactory';
import { abcRender } from '../../core/utils/test/abcRender';
import DataSourceSelector, { logger } from './DataSourceSelector';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestDataSource } from '../../core/data/data-source/TestDataSource';
import { CsvParsingError } from '../../core/data/csv-parser/typings';
import range from 'lodash/range';

logger.disable();

describe('DataSourceSelector', () => {
  let map: MapWrapper;
  let services: TestServices;
  let handleSelection: SinonStub;

  beforeEach(() => {
    map = MapFactory.createNaked();
    services = newTestServices();
    handleSelection = sinon.stub();

    services.geo.getMainMap.returns(map);
  });

  it('should render', () => {
    abcRender(<DataSourceSelector value={undefined} onSelected={handleSelection} />, { services });

    expect(screen.getByText(/Use a geometry layer/)).toBeDefined();
    expect(screen.getByText(/Use a CSV workbook/)).toBeDefined();
  });

  it('should change display if user wants to choose a file', async () => {
    abcRender(<DataSourceSelector value={undefined} onSelected={handleSelection} />, { services });

    await act(async () => {
      await userEvent.click(screen.getByText(/Use a CSV workbook/));
    });

    expect(screen.getByText(/Choose a CSV file/)).toBeDefined();
  });

  it('should warn if data source is empty', async () => {
    const fakeSource = TestDataSource.from([]);

    abcRender(<DataSourceSelector value={fakeSource} onSelected={handleSelection} />, { services });

    await waitFor(() => {
      expect(screen.getByText(/This data source is empty/)).toBeDefined();
    });
  });

  it('should warn if data source is too big', async () => {
    const fakeSource = TestDataSource.from(range(0, 550).map((i) => ({ data: { code: i } })));

    abcRender(<DataSourceSelector value={fakeSource} onSelected={handleSelection} />, { services });

    await waitFor(() => {
      expect(screen.getByText(/This source contains a lot of data.+550.+/)).toBeDefined();
    });
  });

  it('should warn on error', async () => {
    const fakeSource = TestDataSource.from(range(0, 550).map((i) => ({ data: { code: i } })));
    const getRowsStub = sinon.stub();
    getRowsStub.rejects();
    fakeSource.getRows = getRowsStub;

    abcRender(<DataSourceSelector value={fakeSource} onSelected={handleSelection} />, { services });

    await waitFor(() => {
      expect(screen.getByText(/This data source is incorrect./)).toBeDefined();
    });
  });

  it('should show line error if any', async () => {
    const fakeSource = TestDataSource.from(range(0, 550).map((i) => ({ data: { code: i } })));
    const getRowsStub = sinon.stub();
    getRowsStub.rejects(new CsvParsingError('Missing comma', 5));
    fakeSource.getRows = getRowsStub;

    abcRender(<DataSourceSelector value={fakeSource} onSelected={handleSelection} />, { services });

    await waitFor(() => {
      expect(screen.getByText(/An error occurred on line 5/)).toBeDefined();
    });
  });
});
