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
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import { newTestServices, TestServices } from './TestServices';
import { Services } from '../../Services';
import { Provider } from 'react-redux';
import { MainStore, storeFactory } from '../../store/store';
import { MainState } from '../../store/reducer';
import { MemoryRouter } from 'react-router-dom';
import { ServiceProvider } from '../../context';

interface Options extends RenderOptions {
  services?: TestServices;
  state?: Partial<MainState>;
  store?: MainStore;
  router?: {
    /**
     * You will probably need to use Switch and Route to use this:
     * ```
     *   <Switch>
     *     <Route exact path={'/shared/:projectId'} component={SharedMapView} />
     *   </Switch>,
     * ```
     */
    initialEntries?: string[];
  };
}

export function abcRender(ui: React.ReactElement, options?: Options): RenderResult {
  class TestServiceWrapper extends React.Component<any, any> {
    public render() {
      const store = options?.store || storeFactory(options?.state as unknown as MainState);
      const services = options?.services || newTestServices();
      const initialEntries = options?.router?.initialEntries;

      return (
        <MemoryRouter initialEntries={initialEntries}>
          <ServiceProvider value={services as unknown as Services}>
            <Provider store={store}>{ui}</Provider>
          </ServiceProvider>
        </MemoryRouter>
      );
    }
  }

  const rendered = rtlRender(ui, { wrapper: TestServiceWrapper, ...options });

  return {
    ...rendered,
    rerender: abcRender.bind(null, ui, options),
  };
}
