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

import { TestHelper } from '../../utils/test/TestHelper';
import { MoveMapTool } from './MoveMapTool';
import { DrawingTestMap } from '../common/interactions/DrawingTestMap.test.helpers';

describe('MoveMapTool', () => {
  let map: DrawingTestMap;
  let tool: MoveMapTool;

  beforeEach(async () => {
    map = new DrawingTestMap();
    await map.init();

    tool = new MoveMapTool();
    tool.setup(map.getMap());
  });

  it('setup()', () => {
    expect(TestHelper.interactionNames(map.getMap())).toEqual(['DragPan', 'PinchZoom', 'MouseWheelZoom']);
  });

  it('dispose()', () => {
    tool.dispose();

    expect(TestHelper.interactionNames(map.getMap())).toEqual([]);
  });

  it('drag should move map view', async () => {
    await map.drag(0, 0, 50, 50);

    expect(map.getMap().getView().getCenter()).toEqual([-45, 40]);
  });
});
