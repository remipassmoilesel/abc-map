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

import React from 'react';
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import { newTestServices, TestServices } from './TestServices';
import { ServiceProvider } from '../../withServices';
import { Services } from '../../Services';
import { Provider } from 'react-redux';
import { storeFactory } from '../../store/store';
import { MainState } from '../../store/reducer';

interface Options extends RenderOptions {
  services?: TestServices;
  state?: MainState;
}

export function abcRender(ui: React.ReactElement, options?: Options): RenderResult {
  class TestServiceWrapper extends React.Component<any, any> {
    public render() {
      const store = storeFactory(options?.state);
      const services = options?.services || newTestServices();

      return (
        <ServiceProvider value={services as unknown as Services}>
          <Provider store={store}>{ui}</Provider>
        </ServiceProvider>
      );
    }
  }
  return rtlRender(ui, { wrapper: TestServiceWrapper, ...options });
}
