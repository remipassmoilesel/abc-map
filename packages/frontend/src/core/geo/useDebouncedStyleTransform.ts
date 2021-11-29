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

import { useMemo } from 'react';
import debounce from 'lodash/debounce';
import { StyleTransformFunc } from './GeoService';
import { useServices } from '../hooks';

/**
 * This function returns a debounced function, which apply style transformation to selected features.
 *
 * This is useful for text fields which should apply style transform on features, in order to not apply
 * too much transformations and to not pollute changeset history.
 */
export function useDebouncedStyleTransform() {
  const { geo } = useServices();

  return useMemo(
    () =>
      debounce((transform: StyleTransformFunc) => {
        geo.updateSelectedFeatures(transform);
      }, 200),
    [geo]
  );
}
