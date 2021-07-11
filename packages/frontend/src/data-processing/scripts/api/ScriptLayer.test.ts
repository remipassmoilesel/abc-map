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
import { ScriptLayer } from './ScriptLayer';
import { LayerFactory } from '../../../core/geo/layers/LayerFactory';
import { PredefinedLayerModel } from '@abc-map/shared';
import VectorSource from 'ol/source/Vector';
import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';

describe('ScriptLayer', function () {
  it('isVector()', () => {
    const vector = new ScriptLayer(LayerFactory.newVectorLayer());
    const predefined = new ScriptLayer(LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM));

    expect(vector.isVector()).toBe(true);
    expect(predefined.isVector()).toBe(false);
  });

  describe('getFeatures()', () => {
    it('with vector layer', () => {
      const source = new VectorSource();
      source.addFeature(FeatureWrapper.create().unwrap());
      source.addFeature(FeatureWrapper.create().unwrap());
      const vector = new ScriptLayer(LayerFactory.newVectorLayer(source));

      expect(vector.getFeatures()).toHaveLength(2);
      expect(
        vector
          .getFeatures()
          .map((f) => f.getId())
          .sort()
      ).toEqual(
        source
          .getFeatures()
          .map((f) => f.getId())
          .sort()
      );
    });

    it('with wrong layer', () => {
      const predefined = new ScriptLayer(LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM).setName('Layer 1'));

      expect(() => predefined.getFeatures()).toThrow(/Layer with name Layer 1 is not a vector layer/);
    });
  });
});
