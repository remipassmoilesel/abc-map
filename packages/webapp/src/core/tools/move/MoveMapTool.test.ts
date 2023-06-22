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

import { Map } from 'ol';
import { TestHelper } from '../../utils/test/TestHelper';
import { MoveMapTool } from './MoveMapTool';

describe('MoveMapTool', () => {
  let map: Map;
  let tool: MoveMapTool;

  beforeEach(() => {
    map = new Map();
    map.getInteractions().clear();

    tool = new MoveMapTool();
  });

  it('setup()', () => {
    tool.setup(map);

    expect(TestHelper.interactionNames(map)).toEqual(['DragRotate', 'DragPan', 'PinchRotate', 'PinchZoom', 'MouseWheelZoom']);
  });

  it('dispose()', () => {
    tool.setup(map);
    tool.dispose();

    expect(TestHelper.interactionNames(map)).toEqual([]);
  });
});
