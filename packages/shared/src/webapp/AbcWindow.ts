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

import { E2eMap } from '../e2e/E2eMap';

export interface AbcWindow extends Window {
  abc: {
    mainMap?: E2eMap;
    layoutPreview?: E2eMap;
    sharingLayoutMap?: E2eMap;
    sharedMap?: E2eMap;
    services?: any;
    store?: any;
    goToFunding?: () => void;
    clearLocalData?: () => void;
  };
  __REDUX_DEVTOOLS_EXTENSION__?: () => any;
  Cypress?: any;
}

export function getAbcWindow(): AbcWindow {
  const _window: AbcWindow = window as any;
  if (!_window.abc) {
    _window.abc = {};
  }
  return _window;
}
