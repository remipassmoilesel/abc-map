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

import { Changeset } from '../../Changeset';
import { MapWrapper } from '../../../geo/map/MapWrapper';
import { LayerWrapper } from '../../../geo/layers/LayerWrapper';
import { getServices } from '../../../Services';

export class SetActiveLayerChangeset extends Changeset {
  public static create(layer: LayerWrapper): SetActiveLayerChangeset {
    const { geo } = getServices();
    const map = geo.getMainMap();
    const previous = geo.getMainMap().getActiveLayer();
    return new SetActiveLayerChangeset(map, previous, layer);
  }

  constructor(private map: MapWrapper, private previous: LayerWrapper | undefined, private next: LayerWrapper) {
    super();
  }

  public async undo(): Promise<void> {
    if (this.previous) {
      this.map.setActiveLayer(this.previous);
    }
  }

  public async execute(): Promise<void> {
    this.map.setActiveLayer(this.next);
  }
}
