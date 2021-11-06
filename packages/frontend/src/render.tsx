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
import { Services } from './core/Services';
import { getAbcWindow } from '@abc-map/shared';
import { E2eMapWrapper } from './core/geo/map/E2eMapWrapper';
import { MainStore } from './core/store/store';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { ServiceProvider } from './core/context';
import ErrorBoundary from './views/error-boundary/ErrorBoundary';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

export function render(svc: Services, store: MainStore) {
  const root = document.getElementById('root');

  // For tests and debug purposes
  const _window = getAbcWindow();
  _window.abc.mainMap = new E2eMapWrapper(svc.geo.getMainMap());
  _window.abc.services = svc;
  _window.abc.store = store;

  ReactDOM.render(
    <ReduxProvider store={store}>
      <ServiceProvider value={svc}>
        <React.StrictMode>
          <ErrorBoundary>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ErrorBoundary>
        </React.StrictMode>
      </ServiceProvider>
    </ReduxProvider>,
    root
  );
}
