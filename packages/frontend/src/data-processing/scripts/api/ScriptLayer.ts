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
import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';

export class ScriptLayer {
  public readonly id: string;
  public readonly name: string;

  constructor(private readonly layer: LayerWrapper) {
    this.id = layer.getId() || '<no-id>';
    this.name = layer.getName() || '<no-name>';
  }

  public isVector(): boolean {
    return this.layer.isVector();
  }

  public getFeatures(): Feature<Geometry>[] {
    if (!this.layer.isVector()) {
      throw new Error(`Layer with name ${this.name} is not a vector layer`);
    }

    return this.layer.getSource().getFeatures();
  }

  public unwrap() {
    return this.layer.unwrap();
  }
}
