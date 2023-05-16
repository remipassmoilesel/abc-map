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
import { MapWrapper } from '../../../geo/map/MapWrapper';
import { LayerWrapper } from '../../../geo/layers/LayerWrapper';
import { getServices } from '../../../Services';

export class SetLayerPositionChangeset extends Changeset {
  public static create(layer: LayerWrapper, nextPosition: number): SetLayerPositionChangeset {
    const { geo } = getServices();
    const map = geo.getMainMap();
    const previousPosition = map.getLayers().findIndex((lay) => lay.getId() === layer.getId());
    if (previousPosition === -1) {
      throw new Error('Layer does not belong to main map');
    }

    return new SetLayerPositionChangeset(map, layer, previousPosition, nextPosition);
  }

  constructor(private map: MapWrapper, private layer: LayerWrapper, private previousPosition: number, private nextPosition: number) {
    super();
  }

  public async undo(): Promise<void> {
    this.map.removeLayer(this.layer);
    this.map.addLayer(this.layer, this.previousPosition);
  }

  public async execute(): Promise<void> {
    this.map.removeLayer(this.layer);
    this.map.addLayer(this.layer, this.nextPosition);
  }
}
