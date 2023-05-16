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

export class AddLayersChangeset extends Changeset {
  public static create(layers: LayerWrapper[]): AddLayersChangeset {
    const { geo } = getServices();
    const map = geo.getMainMap();
    return new AddLayersChangeset(map, layers);
  }

  constructor(private map: MapWrapper, private layers: LayerWrapper[]) {
    super();
  }

  public async execute(): Promise<void> {
    this.layers.forEach((lay) => this.map.addLayer(lay));

    // We activate the last layer
    const layers = this.map.getLayers();
    if (layers.length) {
      this.map.setActiveLayer(layers[layers.length - 1]);
    }
  }

  public async undo(): Promise<void> {
    this.layers.forEach((lay) => this.map.removeLayer(lay));

    // We activate the last layer
    const layers = this.map.getLayers();
    if (layers.length) {
      this.map.setActiveLayer(layers[layers.length - 1]);
    }
  }
}
