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

import { DrawingTestMap } from './DrawingTestMap.test.helpers';
import { TestHelper } from '../../../utils/test/TestHelper';
import { MoveInteractionsBundle } from './MoveInteractionsBundle';

describe('MoveInteractionsBundle', () => {
  let testMap: DrawingTestMap;
  let interactions: MoveInteractionsBundle;

  beforeEach(async () => {
    testMap = new DrawingTestMap();
    await testMap.init();

    interactions = new MoveInteractionsBundle();
    interactions.setup(testMap.getMap());
  });

  it('setup()', () => {
    expect(TestHelper.interactionNames(testMap.getMap())).toEqual(['DragPan', 'KeyboardPan', 'MouseWheelZoom', 'PinchZoom']);
  });

  it('dispose()', () => {
    interactions.dispose();

    expect(TestHelper.interactionNames(testMap.getMap())).toEqual([]);
  });
});
