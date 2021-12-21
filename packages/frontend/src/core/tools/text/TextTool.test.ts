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

import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import { TextTool } from './TextTool';
import { TestHelper } from '../../utils/test/TestHelper';
import { DrawingTestMap } from '../common/interactions/DrawingTestMap.test.helpers';
import { newTestStore, TestStore } from '../../store/TestStore';
import sinon, { SinonStubbedInstance } from 'sinon';
import { IconName } from '../../../assets/point-icons/IconName';
import { deepFreeze } from '../../utils/deepFreeze';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { Polygon } from 'ol/geom';
import { Modes } from './Modes';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UpdateStyleChangeset } from '../../history/changesets/features/UpdateStyleChangeset';
import { HistoryKey } from '../../history/HistoryKey';
import { logger } from './TextBox';

logger.disable();

describe('Text', () => {
  const textStyle = deepFreeze({
    color: '#000',
    font: 'sans-serif',
    size: 55,
    offsetX: 20,
    offsetY: 15,
    rotation: 0,
  });

  let map: DrawingTestMap;
  let store: TestStore;
  let history: SinonStubbedInstance<HistoryService>;
  let feature: FeatureWrapper;
  let tool: TextTool;

  beforeEach(async () => {
    history = sinon.createStubInstance(HistoryService);

    map = new DrawingTestMap();
    await map.init();

    store = newTestStore();
    store.getState.returns({
      map: {
        currentStyle: {
          text: textStyle,
          point: {
            icon: IconName.IconGeoAltFill,
            size: 30,
            color: 'rgba(18,90,147,0.9)',
          },
        },
      },
    } as any);

    tool = new TextTool(store as unknown as MainStore, history as unknown as HistoryService);
    tool.setup(map.getMap(), map.getVectorSource());

    feature = FeatureWrapper.create(
      new Polygon([
        [
          [10, 0],
          [20, 0],
          [30, 0],
        ],
      ])
    );
    map.addFeatures([feature.unwrap()]);
  });

  afterEach(() => {
    tool.dispose();
  });

  it('setup()', () => {
    expect(TestHelper.interactionNames(map.getMap())).toEqual(['DragPan', 'PinchZoom', 'MouseWheelZoom', 'Select', 'Select']);
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

  it('click on feature should open text-box', async () => {
    // Prepare
    map.toMapWrapper().setToolMode(Modes.EditText);

    // Act
    await map.click(20, 0);

    // Assert
    expect(screen.getByTestId('text-box')).toBeDefined();
  });

  it('validate should register task and set text if text changed', async () => {
    // Prepare
    map.toMapWrapper().setToolMode(Modes.EditText);
    await map.click(20, 0);

    // Act
    userEvent.type(screen.getByTestId('text-box'), 'hello');
    userEvent.click(screen.getByTestId('validate'));

    // Assert
    expect(feature.getText()).toEqual('hello');
    expect(history.register.args).toEqual([
      [
        HistoryKey.Map,
        new UpdateStyleChangeset([
          {
            feature,
            before: {
              fill: {},
              point: {},
              stroke: {},
              text: {},
            },
            after: {
              fill: {},
              point: {},
              stroke: {},
              text: {
                ...textStyle,
                alignment: 'center',
                value: 'hello',
              },
            },
          },
        ]),
      ],
    ]);
  });

  it('validate should not register task and set text if text did not changed', async () => {
    // Prepare
    map.toMapWrapper().setToolMode(Modes.EditText);
    feature.setText('hello');
    await map.click(20, 0);

    // Act
    userEvent.clear(screen.getByTestId('text-box'));
    userEvent.type(screen.getByTestId('text-box'), 'hello');
    userEvent.click(screen.getByTestId('validate'));

    // Assert
    expect(feature.getText()).toEqual('hello');
    expect(history.register.callCount).toEqual(0);
  });

  it('dispose() should close text-box', async () => {
    // Prepare
    map.toMapWrapper().setToolMode(Modes.EditText);
    feature.setText('hello');
    await map.click(20, 0);

    // Act
    tool.dispose();

    // Assert
    expect(screen.queryByTestId('text-box')).toBeNull();
  });
});
