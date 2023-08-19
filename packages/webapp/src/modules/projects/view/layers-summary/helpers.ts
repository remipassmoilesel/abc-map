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

import { LayerType } from '@abc-map/shared';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const t = prefixedTranslation('ProjectManagement:');

export function layerTypeName(type: LayerType | undefined): string {
  switch (type) {
    case LayerType.Vector:
      return t('Vector');
    case LayerType.Predefined:
      return t('Predefined');
    case LayerType.Wms:
      return t('Wms');
    case LayerType.Wmts:
      return t('Wmts');
    case LayerType.Xyz:
      return t('Xyz');
    default:
      return t('Unknown_type');
  }
}

export function layerIcon(type: LayerType | undefined): IconDefinition {
  switch (type) {
    case LayerType.Vector:
      return IconDefs.faDrawPolygon;
    case LayerType.Predefined:
      return IconDefs.faClone;
    case LayerType.Wms:
      return IconDefs.faClone;
    case LayerType.Wmts:
      return IconDefs.faClone;
    case LayerType.Xyz:
      return IconDefs.faClone;
    default:
      return IconDefs.faQuestion;
  }
}
