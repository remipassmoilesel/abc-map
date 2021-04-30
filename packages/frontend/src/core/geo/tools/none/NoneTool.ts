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

import { AbstractTool } from '../AbstractTool';
import Icon from '../../../../assets/tool-icons/none.svg';
import { Map } from 'ol';
import { defaultInteractions } from '../../map/interactions';
import { MapTool } from '@abc-map/frontend-commons';

export class NoneTool extends AbstractTool {
  public getId(): MapTool {
    return MapTool.None;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Aucun';
  }

  protected setupInternal(map: Map) {
    const interactions = defaultInteractions();
    interactions.forEach((i) => map.addInteraction(i));

    this.interactions.push(...interactions);
  }
}
