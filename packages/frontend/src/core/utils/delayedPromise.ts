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

/**
 * This promise will execute an underlying promise, but will never resolve before the specified delay.
 *
 * This is useful to display a waiting screen that will be at list shown for delay seconds.
 */
export function delayedPromise<T>(promise: Promise<T>, delay = 1000): Promise<T> {
  const start = Date.now();
  return new Promise<T>((resolve, reject) => {
    promise
      .then((result) => {
        const took = Date.now() - start;
        if (took >= delay) {
          resolve(result);
        } else {
          const delta = delay - took;
          setTimeout(() => {
            resolve(result);
          }, delta);
        }
      })
      .catch(reject);
  });
}
