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

import { DrawingTestMap } from '../common/interactions/DrawingTestMap.test.helpers';
import { newTestStore, TestStore } from '../../store/TestStore.test.helper';
import { HistoryService } from '../../history/HistoryService';
import sinon, { SinonStubbedInstance } from 'sinon';
import { MainStore } from '../../store/store';
import { FillPatterns } from '@abc-map/shared';
import { Point } from 'ol/geom';
import { TestHelper } from '../../utils/test/TestHelper';
import { HistoryKey } from '../../history/HistoryKey';
import { UndoCallbackChangeset } from '../../history/changesets/features/UndoCallbackChangeset';
import { AddFeaturesChangeset } from '../../history/changesets/features/AddFeaturesChangeset';
import { deepFreeze } from '../../utils/deepFreeze';
import { PointTool } from './PointTool';
import { IconName } from '../../../assets/point-icons/IconName';

// FIXME: selection does not work in tests with points
describe('PointTool', () => {
  const point = deepFreeze({ icon: IconName.Icon0Circle, size: 30, color: 'rgba(18,90,147,0.9)' });
  let testMap: DrawingTestMap;
  let store: TestStore;
  let history: SinonStubbedInstance<HistoryService>;
  let tool: PointTool;

  beforeEach(async () => {
    testMap = new DrawingTestMap();
    await testMap.init();

    store = newTestStore();
    store.getState.returns({
      map: {
        currentStyle: {
          fill: {
            color1: 'rgba(18,90,147,0.30)',
            color2: 'rgba(255,255,255,0.60)',
            pattern: FillPatterns.HatchingObliqueRight,
          },
          point,
        },
      },
    } as any);

    history = sinon.createStubInstance(HistoryService);

    tool = new PointTool(store as unknown as MainStore, history as unknown as HistoryService);
    tool.setup(testMap.getMap(), testMap.getVectorSource());
  });

  it('setup()', () => {
    expect(TestHelper.interactionNames(testMap.getMap())).toEqual(['DragPan', 'KeyboardPan', 'MouseWheelZoom', 'Select', 'Modify', 'Snap', 'Draw']);
  });

  it('drag should move map view', async () => {
    await testMap.drag(0, 0, 50, 50, { ctrl: true });

    expect(testMap.getMap().getView().getCenter()).toEqual([-45, 40]);
  });

  it('click should draw point', async () => {
    // Act
    await testMap.click(10, 0);

    // Assert
    // Feature must exists
    const feat = testMap.getFeature<Point>(0);
    expect(feat).toBeDefined();
    expect(feat.getGeometry()).toBeInstanceOf(Point);
    expect(feat.getGeometry()?.getCoordinates()).toEqual([10, 0]);

    // Feature must have store style
    expect(feat.getStyleProperties()).toEqual({ point, stroke: {}, fill: {}, text: {} });

    // Changesets must have been registered
    expect(history.register.callCount).toEqual(2);
    expect(history.register.args[0][0]).toEqual(HistoryKey.Map);
    expect(history.register.args[0][1]).toBeInstanceOf(UndoCallbackChangeset);
    expect(history.register.args[1][0]).toEqual(HistoryKey.Map);
    expect(history.register.args[1][1]).toBeInstanceOf(AddFeaturesChangeset);

    // First changeset must have been removed
    expect(history.remove.callCount).toEqual(1);
    expect(history.register.args[0][0]).toEqual(HistoryKey.Map);
    expect(history.register.args[0][1]).toBeInstanceOf(UndoCallbackChangeset);
  });

  it('dispose()', async () => {
    // Act
    tool.dispose();

    // Assert
    expect(TestHelper.interactionNames(testMap.getMap())).toEqual([]);
  });
});
