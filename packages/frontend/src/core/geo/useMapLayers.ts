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

import { useEffect, useState } from 'react';
import { useServices } from '../useServices';
import { LayerWrapper, VectorLayerWrapper } from './layers/LayerWrapper';

interface Result {
  layers: LayerWrapper[];
  activeLayer: LayerWrapper | undefined;
  activeVectorLayer: VectorLayerWrapper | undefined;
}

/**
 * Returns the collection of layers of main map
 */
export function useMapLayers(): Result {
  const { geo } = useServices();
  const [layers, setLayers] = useState<LayerWrapper[]>([]);
  const [activeLayer, setActiveLayer] = useState<LayerWrapper | undefined>(undefined);
  const [activeVectorLayer, setActiveVectorLayer] = useState<VectorLayerWrapper | undefined>(undefined);
  const map = geo.getMainMap();

  useEffect(() => {
    const handleLayerChange = () => {
      setLayers(map.getLayers());
      setActiveLayer(map.getActiveLayer());
      setActiveVectorLayer(map.getActiveVectorLayer());
    };

    map.addLayerChangeListener(handleLayerChange);
    handleLayerChange();

    return () => map.removeLayerChangeListener(handleLayerChange);
  }, [map]);

  return {
    layers,
    activeLayer,
    activeVectorLayer,
  };
}
