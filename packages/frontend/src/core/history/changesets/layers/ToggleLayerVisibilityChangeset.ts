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

import { Changeset } from '../../Changeset';
import { LayerWrapper } from '../../../geo/layers/LayerWrapper';
import { MapWrapper } from '../../../geo/map/MapWrapper';
import { getServices } from '../../../Services';

export class ToggleLayerVisibilityChangeset extends Changeset {
  public static create(layer: LayerWrapper, state: boolean): ToggleLayerVisibilityChangeset {
    const { geo } = getServices();
    const map = geo.getMainMap();
    return new ToggleLayerVisibilityChangeset(map, layer, state);
  }

  constructor(private map: MapWrapper, private layer: LayerWrapper, private state: boolean) {
    super();
  }

  public async execute(): Promise<void> {
    this.map.setLayerVisible(this.layer, this.state);
  }

  public async undo(): Promise<void> {
    this.map.setLayerVisible(this.layer, !this.state);
  }
}
