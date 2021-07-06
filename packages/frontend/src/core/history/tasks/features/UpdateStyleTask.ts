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
import { FeatureStyle } from '@abc-map/shared';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';

export interface UpdateStyleItem {
  before: FeatureStyle;
  after: FeatureStyle;
  feature: FeatureWrapper;
}

export class UpdateStyleTask extends Task {
  constructor(private items: UpdateStyleItem[]) {
    super();
  }

  public async undo(): Promise<void> {
    this.items.forEach((item) => {
      item.feature.setStyleProperties(item.before);
    });
  }

  public async redo(): Promise<void> {
    this.items.forEach((item) => {
      item.feature.setStyleProperties(item.after);
    });
  }
}
