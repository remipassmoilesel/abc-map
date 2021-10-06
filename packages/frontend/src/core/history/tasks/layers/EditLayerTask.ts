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

import { Task } from '../../Task';
import { LayerWrapper } from '../../../geo/layers/LayerWrapper';
import { MapWrapper } from '../../../geo/map/MapWrapper';

export interface EditableLayerProperties {
  name: string;
  opacity: number;
  attributions: string[];
}

/**
 * Undo/Redo modification of layer properties.
 *
 * Map is only used to dispatch events for UI updates.
 *
 */
export class EditLayerTask extends Task {
  constructor(private map: MapWrapper, private layer: LayerWrapper, private before: EditableLayerProperties, private after: EditableLayerProperties) {
    super();
  }

  public async undo(): Promise<void> {
    this.layer.setName(this.before.name).setOpacity(this.before.opacity).setAttributions(this.before.attributions);
    this.map.triggerLayerChange();
  }

  public async redo(): Promise<void> {
    this.layer.setName(this.after.name).setOpacity(this.after.opacity).setAttributions(this.after.attributions);
    this.map.triggerLayerChange();
  }
}
