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

import { getAbcWindow } from '@abc-map/shared';
import { newTestServices, TestServices } from './TestServices';

/**
 * This function mocks the main service map, which is returned by getServices().
 *
 * Generally, you should prefer create your own test service map and inject it.
 *
 * If injection is not possible everywhere, use this function.
 *
 * Don't forget to call restoreServices() after for the next tests.
 *
 */
export function mockServices(): TestServices {
  const window = getAbcWindow();
  window.abc.services = newTestServices();
  return window.abc.services;
}

export function restoreServices() {
  const window = getAbcWindow();
  // Services will be recreated at next call of getServices()
  window.abc.services = undefined;
}
