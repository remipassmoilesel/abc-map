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

import throttle from 'lodash/throttle';

/**
 * This function allow to limit storage call.
 *
 * With a 5s value, it will ensure that storageCb will be called once then no more the 5 next seconds.
 *
 * @param storageCb
 * @param waitBetweenCallsMs
 */
export function throttleDbStorage(storageCb: (...args: any[]) => void, waitBetweenCallsMs = 5_000) {
  return throttle(storageCb, waitBetweenCallsMs, { leading: true, trailing: true });
}
