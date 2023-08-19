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

import { AbcFile, AbcProjection } from '@abc-map/shared';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { ReadResult } from '../ReadResult';

export abstract class AbstractDataReader {
  public abstract isSupported(files: AbcFile<Blob>[]): Promise<boolean>;
  public abstract read(files: AbcFile<Blob>[], projection: AbcProjection): Promise<ReadResult>;

  /**
   * This methods add an id if absent and set default style
   * @param features
   * @protected
   */
  protected prepareFeatures(features: Feature<Geometry>[]) {
    features.forEach((feat) => {
      const feature = FeatureWrapper.from(feat);
      if (!feature.getId()) {
        feature.setId();
      }

      feature.setDefaultStyle();
    });
  }
}
