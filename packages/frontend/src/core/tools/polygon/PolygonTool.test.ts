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
import { HistoryKey } from '../../history/HistoryKey';
import { UndoCallbackChangeset } from '../../history/changesets/features/UndoCallbackChangeset';
import { AddFeaturesChangeset } from '../../history/changesets/features/AddFeaturesChangeset';
import { deepFreeze } from '../../utils/deepFreeze';
import { UpdateGeometriesChangeset } from '../../history/changesets/features/UpdateGeometriesChangeset';
import { PolygonTool } from './PolygonTool';
import { IconName } from '../../../assets/point-icons/IconName';

describe('PolygonTool', () => {
  const stroke = deepFreeze({ color: 'rgba(18,90,147,0.60)', width: 3 });
  const fill = deepFreeze({ color1: 'rgba(18,90,147,0.30)', color2: 'rgba(255,255,255,0.60)', pattern: FillPatterns.HatchingObliqueRight });

  let testMap: DrawingTestMap;
  let store: TestStore;
  let history: SinonStubbedInstance<HistoryService>;
  let tool: PolygonTool;

  beforeEach(async () => {
    testMap = new DrawingTestMap();
    await testMap.init();

    store = newTestStore();
    store.getState.returns({
      map: {
        currentStyle: {
          point: {
            icon: IconName.IconGeoAltFill,
            size: 30,
            color: 'rgba(18,90,147,0.9)',
          },
          fill,
          stroke,
        },
      },
    } as any);

    history = sinon.createStubInstance(HistoryService);

    tool = new PolygonTool(store as unknown as MainStore, history as unknown as HistoryService);
    tool.setup(testMap.getMap(), testMap.getVectorSource());
  });

  it('setup()', () => {
    expect(TestHelper.interactionNames(testMap.getMap())).toEqual([
      'DragPan',
      'KeyboardPan',
      'MouseWheelZoom',
      'PinchZoom',
      'Select',
      'Modify',
      'Snap',
      'Draw',
    ]);
  });

  it('drag should move map view', async () => {
    await testMap.drag(0, 0, 50, 50, { ctrl: true });

    expect(testMap.getMap().getView().getCenter()).toEqual([-45, 40]);
  });

  it('click should draw polygon', async () => {
    // Act
    await testMap.click(10, 0);
    await testMap.click(20, 0);
    await testMap.doubleClick(30, 0);

    // Assert
    // Feature must exists
    const feat = testMap.getFeature<Polygon>(0);
    expect(feat).toBeDefined();
    expect(feat.getGeometry()).toBeInstanceOf(Polygon);
    expect(feat.getGeometry()?.getCoordinates()).toEqual([
      [
        [10, 0],
        [20, 0],
        [30, 0],
        [10, 0],
      ],
    ]);

    // Feature must have store style
    expect(feat.getStyleProperties()).toEqual({ stroke, fill, point: {}, text: {} });

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

  it('shift + click should select polygons, toggle select, deselect all', async () => {
    // Prepare
    const feature1 = FeatureWrapper.create(
      new Polygon([
        [
          [10, 0],
          [20, 0],
          [30, 0],
        ],
      ])
    );
    feature1.setStyleProperties({ stroke, fill });

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

    testMap.addFeatures([feature1.unwrap(), feature2.unwrap()]);

    // Act & assert
    // Select one
    await testMap.click(20, 0, { shift: true });
    expect(feature1.isSelected()).toBe(true);
    expect(feature2.isSelected()).toBe(false);

    // Select two
    await testMap.click(35, -20, { shift: true });
    expect(feature1.isSelected()).toBe(true);
    expect(feature2.isSelected()).toBe(true);

    // Toggle one
    await testMap.click(20, 0, { shift: true });
    expect(feature1.isSelected()).toBe(false);
    expect(feature2.isSelected()).toBe(true);

    // Deselect all
    tool.deselectAll();
    expect(feature1.isSelected()).toBe(false);
    expect(feature2.isSelected()).toBe(false);

    // Style must have been dispatch
    expect(store.dispatch.args).toEqual([
      [{ type: 'SetDrawingStyle', style: { stroke, fill } }],
      [
        {
          type: 'SetDrawingStyle',
          style: { stroke: { color: 'green', width: 6 }, fill: { color1: 'green', color2: 'red', pattern: FillPatterns.Circles } },
        },
      ],
    ]);
  });

  it('new draw should deselect all', async () => {
    // Prepare
    const feature1 = FeatureWrapper.create(
      new Polygon([
        [
          [10, 0],
          [20, 0],
          [30, 0],
        ],
      ])
    );
    testMap.addFeatures([feature1.unwrap()]);

    // Act & assert
    // Select one
    await testMap.click(20, 0, { shift: true });
    expect(feature1.isSelected()).toBe(true);

    // Draw two
    await testMap.click(50, 20);
    await testMap.click(60, 20);
    await testMap.doubleClick(70, 20);

    expect(testMap.getFeature(0).isSelected()).toBe(false);
    expect(testMap.getFeature(1).isSelected()).toBe(false);
  });

  it('select then modify should update geometries and history', async () => {
    // Prepare
    const feature1 = FeatureWrapper.create(
      new Polygon([
        [
          [10, 0],
          [20, 0],
          [30, 0],
        ],
      ])
    );
    testMap.addFeatures([feature1.unwrap()]);

    // Act
    // Select one
    await testMap.click(20, 0, { shift: true });
    expect(feature1.isSelected()).toBe(true);

    // Modify one
    await testMap.drag(20, 0, 50, 50);

    // Assert
    const geom = feature1.getGeometry() as Polygon;
    expect(geom.getCoordinates()).toEqual([
      [
        [10, 0],
        [50, -50],
        [30, 0],
      ],
    ]);
    expect(history.register.callCount).toEqual(1);
    expect(history.register.args[0][0]).toEqual(HistoryKey.Map);

    const changeset = history.register.args[0][1] as UpdateGeometriesChangeset;
    expect(changeset).toBeInstanceOf(UpdateGeometriesChangeset);
    expect(changeset.items.length).toEqual(1);
    expect((changeset.items[0].before as Polygon).getCoordinates()).toEqual([
      [
        [10, 0],
        [20, 0],
        [30, 0],
      ],
    ]);
    expect((changeset.items[0].after as Polygon).getCoordinates()).toEqual([
      [
        [10, 0],
        [50, -50],
        [30, 0],
      ],
    ]);
  });

  it('dispose()', async () => {
    // Prepare
    const feature1 = FeatureWrapper.create(
      new Polygon([
        [
          [10, 0],
          [20, 0],
          [30, 0],
        ],
      ])
    );
    testMap.addFeatures([feature1.unwrap()]);

    // Select
    await testMap.click(20, 0, { shift: true });
    expect(feature1.isSelected()).toBe(true);

    // Act
    tool.dispose();

    // Assert
    expect(feature1.isSelected()).toBe(false);
    expect(TestHelper.interactionNames(testMap.getMap())).toEqual([]);
  });
});
