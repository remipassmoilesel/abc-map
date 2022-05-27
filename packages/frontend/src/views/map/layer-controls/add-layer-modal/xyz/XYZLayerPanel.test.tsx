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
import { abcRender } from '../../../../../core/utils/test/abcRender';
import XYZLayerPanel from './XYZLayerPanel';
import sinon, { SinonStub } from 'sinon';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestServices } from '../../../../../core/utils/test/TestServices';
import { MapFactory } from '../../../../../core/geo/map/MapFactory';
import { XYZ } from 'ol/source';
import { AddLayersChangeset } from '../../../../../core/history/changesets/layers/AddLayersChangeset';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { mockServices, restoreServices } from '../../../../../core/utils/test/mock-services';

describe('XYZLayerPanel', () => {
  let onChange: SinonStub;
  let onCancel: SinonStub;
  let onConfirm: SinonStub;
  let services: TestServices;

  beforeEach(() => {
    onChange = sinon.stub();
    onCancel = sinon.stub();
    onConfirm = sinon.stub();

    services = mockServices();
  });

  afterEach(() => {
    restoreServices();
  });

  it('should render', () => {
    abcRender(<XYZLayerPanel url={'https://test-url'} onChange={onChange} onConfirm={onConfirm} onCancel={onCancel} />, { services });

    expect(screen.getByRole('textbox')).toHaveValue('https://test-url');
    expect(screen.getByTestId('form-validation')).toHaveTextContent('The URL must contain {x}, {y} and {z}.');
    expect(screen.queryByTestId('placeholder-warning')).toBeNull();
  });

  it('should show warning if wrong placeholder', () => {
    abcRender(<XYZLayerPanel url={'https://{s}-test-url/{x}/{y}/{z}.png'} onChange={onChange} onConfirm={onConfirm} onCancel={onCancel} />, { services });

    expect(screen.getByTestId('form-validation')).toHaveTextContent('Perfect !');
    expect(screen.queryByTestId('placeholder-warning')?.textContent).toMatch('Some placeholders may not be correctly interpreted');
  });

  it('should fire onchange', async () => {
    abcRender(<XYZLayerPanel url={''} onChange={onChange} onConfirm={onConfirm} onCancel={onCancel} />, { services });

    await userEvent.type(screen.getByRole('textbox'), 'https');

    expect(onChange.args.flatMap((x) => x)).toEqual(['h', 't', 't', 'p', 's']);
  });

  it('should add layer', async () => {
    // Prepare
    const map = MapFactory.createNaked();
    services.geo.getMainMap.returns(map);

    abcRender(<XYZLayerPanel url={'https://{s-s}-test-url/{x}/{y}/{z}.png'} onChange={onChange} onConfirm={onConfirm} onCancel={onCancel} />, { services });

    // Act
    await userEvent.click(screen.getByTestId('confirm'));

    // Assert
    expect(map.getLayers().length).toEqual(1);
    const layer = map.getLayers()[0];
    expect(layer.isXyz()).toEqual(true);
    expect((layer.getSource() as XYZ).getUrls()).toEqual(['https://s-test-url/{x}/{y}/{z}.png']);

    await waitFor(() => {
      expect(services.history.register.callCount).toEqual(1);
      expect(services.history.register.args[0][0]).toEqual(HistoryKey.Map);
      expect(services.history.register.args[0][1]).toBeInstanceOf(AddLayersChangeset);
    });
  });
});
