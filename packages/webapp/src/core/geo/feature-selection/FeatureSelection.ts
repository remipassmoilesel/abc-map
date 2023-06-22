/**
 * Copyright © 2022 Rémi Pace.
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
import Geometry from 'ol/geom/Geometry';
import { FeatureWrapper, SupportedFeature } from '../features/FeatureWrapper';
import { Collection, Map } from 'ol';
import { getSelectionFromMap } from './getSelectionFromMap';

/**
 * This class hold a reference to all features selected.
 *
 * Feature selections are attached to maps. Use getSelectionFromMap() to retrieve it.
 */
export class FeatureSelection {
  public static getSelectionFromMap(map: Map): FeatureSelection {
    return getSelectionFromMap(map);
  }

  private features = new Collection<Feature<Geometry>>();

  constructor() {
    // Features can be added by drawing tools
    this.features.on('add', (ev) => {
      const feature = FeatureWrapper.fromUnknown(ev.element);
      if (feature && !feature.isSelected()) {
        feature.setSelected(true);
      }
    });

    // Features can be removed by drawing tools
    this.features.on('remove', (ev) => {
      const feature = FeatureWrapper.fromUnknown(ev.element);
      if (feature && feature.isSelected()) {
        feature.setSelected(false);
      }
    });
  }

  public add(features: SupportedFeature[]): void {
    features.forEach((feat) => {
      const feature = FeatureWrapper.from(feat);
      feature.setSelected(true);
      this.features.push(feature.unwrap());
    });
  }

  public remove(features: SupportedFeature[]): void {
    features.forEach((feat) => {
      const feature = FeatureWrapper.from(feat);
      feature.setSelected(false);
      this.features.remove(feature.unwrap());
    });
  }

  public clear() {
    this.features.forEach((feat) => FeatureWrapper.from(feat).setSelected(false));
    this.features.clear();
  }

  public getFeatures(): Feature<Geometry>[] {
    return this.features.getArray();
  }

  public getFeatureCollection(): Collection<Feature<Geometry>> {
    return this.features;
  }

  public isSelected(feat: SupportedFeature): boolean {
    const feature = FeatureWrapper.from(feat);
    return !!this.getFeatures().find((f) => f.getId() === feature.getId());
  }
}
