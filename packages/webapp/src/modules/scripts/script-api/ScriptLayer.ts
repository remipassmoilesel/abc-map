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

import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { Collection } from 'ol';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { ScriptFeature } from './ScriptFeature';
import { Layer } from 'ol/layer';
import { AbcProjection } from '@abc-map/shared';

export class ScriptLayer {
  public id: string;
  public name: string;

  constructor(private layer: LayerWrapper, private projection?: AbcProjection) {
    this.id = layer.getId() ?? '<invalid-layer-id>';
    this.name = layer.getName() ?? 'No name found';
  }

  public getFeatures(): ScriptFeature[] {
    if (!this.layer.isVector()) {
      return [];
    }

    const features = this.layer.getSource().getFeatures();
    return features.map((feature) => new ScriptFeature(feature, this.projection));
  }

  /**
   * This method allow to delete some features
   * @param features
   */
  public setFeatures(features: ScriptFeature[]): void {
    if (!this.layer.isVector()) {
      return;
    }

    let targetCollection = this.layer.getSource().getFeaturesCollection();
    if (!targetCollection) {
      targetCollection = new Collection<Feature<Geometry>>();
    }

    targetCollection.clear();
    targetCollection.extend(features.map((f) => f.unwrap()));
  }

  public unwrap(): Layer {
    return this.layer.unwrap();
  }
}
