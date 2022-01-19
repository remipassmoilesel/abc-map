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

import { useServices } from '../../../../../core/useServices';
import { useCallback, useEffect, useState } from 'react';
import { AbcSharedView, BaseMetadata, LayerMetadata, LayerState } from '@abc-map/shared';
import LayerListItem from './LayerListItem';

interface Props {
  view: AbcSharedView;
  onUpdate: (view: AbcSharedView) => void;
}

function LayerVisibilitySelector(props: Props) {
  const { view, onUpdate } = props;
  const { geo } = useServices();
  const [layers, setLayers] = useState<BaseMetadata[]>([]);

  useEffect(() => {
    const map = geo.getMainMap();

    const handleLayerChange = () => {
      const metadatas = map
        .getLayers()
        .map((lay) => lay.getMetadata())
        .filter((m): m is LayerMetadata => !!m);
      setLayers(metadatas);
    };

    // We trigger first setup manually
    handleLayerChange();

    map.addLayerChangeListener(handleLayerChange);
    return () => map.removeLayerChangeListener(handleLayerChange);
  }, [geo]);

  const handleSelect = useCallback(
    (meta: BaseMetadata) => {
      const state = view.layers.find((st) => st.layerId === meta.id);
      let layers: LayerState[];
      if (state) {
        layers = view.layers.map((st) => {
          if (st.layerId === meta.id) {
            return { ...st, visible: !st.visible };
          } else {
            return { ...st };
          }
        });
      } else {
        layers = view.layers.concat({ layerId: meta.id, visible: true });
      }

      onUpdate({ ...view, layers });
    },
    [onUpdate, view]
  );

  return (
    <div>
      {layers.map((metadata) => {
        const state = view.layers.find((st) => metadata.id === st.layerId);
        return <LayerListItem key={metadata.id} metadata={metadata} visible={state?.visible || false} onSelect={handleSelect} />;
      })}
    </div>
  );
}

export default LayerVisibilitySelector;
