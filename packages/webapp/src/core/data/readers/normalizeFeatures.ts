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

import Feature from 'ol/Feature';
import { Geometry, GeometryCollection } from 'ol/geom';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { Logger } from '@abc-map/shared';

export const logger = Logger.get('normalizeFeatures.ts');

/**
 * Filter unsupported geometries, adds an id if absent and set default style.
 *
 * /!\ This function mutates input.
 *
 * @param features
 * @protected
 */
export function normalizeFeatures(features: Feature<Geometry>[]): Feature<Geometry>[] {
  let result: Feature<Geometry>[] = [];

  for (const feature of features) {
    const geometry = feature.getGeometry();

    // If feature does not have a geometry, we discard it
    if (!geometry) {
      logger.warn('Unsupported feature, bad geometry', { feature, geometry });
      continue;
    }

    // If geometry is a geometry collection, we "split" this feature in multiple clones
    // This is mainly because geometry collection are not supported in drawing tools
    if (geometry.getType() === 'GeometryCollection') {
      const featureGColl = feature as Feature<GeometryCollection>;
      result = result.concat(splitGeometryCollection(featureGColl));
      continue;
    }

    result.push(feature);
  }

  for (const feature of result) {
    const featureW = FeatureWrapper.from(feature);

    // If feature does not have an id, we create it
    if (!featureW.getId()) {
      featureW.setId();
    }

    // If feature is selected, we unselect it
    if (featureW.isSelected()) {
      featureW.setSelected(false);
    }

    // We set default style
    featureW.setDefaultStyle();
  }

  return result;
}

function splitGeometryCollection(feature: Feature<GeometryCollection>): Feature<Geometry>[] {
  const geometries = feature.getGeometry()?.getGeometries();
  if (!geometries?.length) {
    return [];
  }

  return geometries.flatMap((geometry) => {
    const newFeature = FeatureWrapper.from(feature).clone();
    newFeature.unwrap().setGeometry(geometry);

    if (geometry.getType() === 'GeometryCollection') {
      return splitGeometryCollection(newFeature.unwrap() as Feature<GeometryCollection>);
    } else {
      return newFeature.setId().unwrap();
    }
  });
}
