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
import { newTestStore, TestStore } from '../../store/TestStore';
import { HistoryService } from '../../history/HistoryService';
import sinon, { SinonStubbedInstance } from 'sinon';
import { MainStore } from '../../store/store';
import { FillPatterns } from '@abc-map/shared';
import { Polygon } from 'ol/geom';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { TestHelper } from '../../utils/test/TestHelper';
import { deepFreeze } from '../../utils/deepFreeze';
import { IconName } from '../../../assets/point-icons/IconName';
import { SelectionTool } from './SelectionTool';
import { Modes } from './Modes';

// FIXME: use a better test setup, this test does not work since OL 7
describe.skip('SelectionTool', () => {
  const strokeStyle = deepFreeze({ color: 'rgba(18,90,147,0.60)', width: 3 });
  const fillStyle = deepFreeze({ color1: 'rgba(18,90,147,0.30)', color2: 'rgba(255,255,255,0.60)', pattern: FillPatterns.HatchingObliqueRight });

  let map: DrawingTestMap;
  let store: TestStore;
  let history: SinonStubbedInstance<HistoryService>;
  let tool: SelectionTool;

  beforeEach(async () => {
    history = sinon.createStubInstance(HistoryService);

    map = new DrawingTestMap();
    await map.init();

    store = newTestStore();
    store.getState.returns({
      map: {
        currentStyle: {
          point: {
            icon: IconName.IconGeoAltFill,
            size: 30,
            color: 'rgba(18,90,147,0.9)',
          },
          fill: fillStyle,
          stroke: strokeStyle,
        },
      },
    } as any);

    tool = new SelectionTool(store as unknown as MainStore, history as unknown as HistoryService);
    tool.setup(map.getMap(), map.getVectorSource());
  });

  it('setup()', () => {
    expect(TestHelper.interactionNames(map.getMap())).toEqual(['DragRotate', 'DragPan', 'PinchRotate', 'PinchZoom', 'MouseWheelZoom', 'DragBox', 'Translate']);
  });

  it('dispose()', () => {
    tool.dispose();

    expect(TestHelper.interactionNames(map.getMap())).toEqual([]);
  });

  it('drag should move map view', async () => {
    map.toMapWrapper().setToolMode(Modes.MoveMap);

    await map.drag(0, 0, 50, 50);

    expect(map.getMap().getView().getCenter()).toEqual([-45, 40]);
  });

  it('drag should select', async () => {
    // Prepare
    map.toMapWrapper().setToolMode(Modes.Select);

    const feature1 = FeatureWrapper.create(
      new Polygon([
        [
          [10, 0],
          [20, 0],
          [30, 0],
        ],
      ])
    );
    feature1.setStyleProperties({ stroke: strokeStyle, fill: fillStyle });

    const feature2 = FeatureWrapper.create(
      new Polygon([
        [
          [10, 20],
          [20, 20],
          [30, 20],
        ],
      ])
    );
    feature2.setStyleProperties({ stroke: { color: 'green', width: 6 }, fill: { color1: 'green', color2: 'red', pattern: FillPatterns.Circles } });

    map.addFeatures([feature1.unwrap(), feature2.unwrap()]);

    // Act
    await map.drag(9, 1, 31, -1);

    // Assert
    expect(feature1.isSelected()).toBe(true);
    expect(feature2.isSelected()).toBe(false);

    // Style must have been dispatch
    expect(store.dispatch.args).toEqual([[{ type: 'SetDrawingStyle', style: { stroke: strokeStyle, fill: fillStyle } }]]);
  });

  it('dispose() should unselect all', async () => {
    // Prepare
    map.toMapWrapper().setToolMode(Modes.Select);

    const feature1 = FeatureWrapper.create(
      new Polygon([
        [
          [10, 0],
          [20, 0],
          [30, 0],
        ],
      ])
    );
    map.addFeatures([feature1.unwrap()]);

    // Select
    await map.drag(9, 1, 31, -1);
    expect(feature1.isSelected()).toBe(true);

    // Act
    tool.dispose();

    // Assert
    expect(feature1.isSelected()).toBe(false);
  });
});
