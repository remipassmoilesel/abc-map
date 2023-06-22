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

import { LayerWrapper as ModuleLayerWrapper, FeatureWrapper as ModuleFeatureWrapper, ModuleApi } from '@abc-map/module-api';
import { getServices } from '../../../core/Services';
import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';
import { LayerFactory } from '../../../core/geo/layers/LayerFactory';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { AddLayersChangeset } from '../../../core/history/changesets/layers/AddLayersChangeset';
import { RemoveLayerChangeset } from '../../../core/history/changesets/layers/RemoveLayerChangeset';
import { AddFeaturesChangeset } from '../../../core/history/changesets/features/AddFeaturesChangeset';
import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import VectorSource from 'ol/source/Vector';
import { RemoveFeaturesChangeset } from '../../../core/history/changesets/features/RemoveFeaturesChangeset';

/**
 * This API is used in external modules and in scripts
 */
export function getModuleApi(): ModuleApi {
  const { geo, history, modals } = getServices();

  return {
    FeatureWrapperFactory: {
      from: FeatureWrapper.from,
      fromUnknown: FeatureWrapper.fromUnknown,
    },
    LayerFactory: LayerFactory,
    MapFactory: {
      from: MapWrapper.from,
      fromUnknown: MapWrapper.fromUnknown,
    },
    changesets: {
      // Here we must cast entites because ModuleEntities are subset of entities
      addLayers: (layers: ModuleLayerWrapper[]) => AddLayersChangeset.create(layers as LayerWrapper[]),
      removeLayer: (layer: ModuleLayerWrapper) => RemoveLayerChangeset.create(layer as LayerWrapper),
      addFeatures: (source: VectorSource, features: ModuleFeatureWrapper[]) => new AddFeaturesChangeset(source, features as FeatureWrapper[]),
      removeFeatures: (source: VectorSource, features: ModuleFeatureWrapper[]) => new RemoveFeaturesChangeset(source, features as FeatureWrapper[]),
    },
    mainMap: geo.getMainMap(),
    services: {
      geo,
      history,
      modals,
    },
    // This variable will be set at runtime
    resourceBaseUrl: '',
  };
}
