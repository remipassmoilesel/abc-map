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

import { EditPropertiesTool } from './EditPropertiesTool';
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { ModalService } from '../../ui/ModalService';
import { HistoryService } from '../../history/HistoryService';
import { ModalEventType, ModalStatus } from '../../ui/typings';
import Feature from 'ol/Feature';
import { LineString } from 'ol/geom';
import { HistoryKey } from '../../history/HistoryKey';
import { SetFeaturePropertiesChangeset } from '../../history/changesets/features/SetFeaturePropertiesChangeset';
import { TestHelper } from '../../utils/test/TestHelper';
import { DrawingTestMap } from '../common/interactions/DrawingTestMap.test.helpers';
import { Modes } from './Modes';
import Geometry from 'ol/geom/Geometry';

describe('EditPropertiesTool', () => {
  let modals: SinonStubbedInstance<ModalService>;
  let history: SinonStubbedInstance<HistoryService>;
  let feature: Feature<Geometry>;
  let map: DrawingTestMap;
  let tool: EditPropertiesTool;

  beforeEach(async () => {
    modals = sinon.createStubInstance(ModalService);
    history = sinon.createStubInstance(HistoryService);

    map = new DrawingTestMap();
    await map.init();

    tool = new EditPropertiesTool({} as any, history as unknown as HistoryService, modals as unknown as ModalService);
    tool.setup(map.getMap());

    feature = new Feature(
      new LineString([
        [0, 0],
        [5, 5],
      ])
    );
    map.addFeatures([feature]);
  });

  it('setup()', () => {
    expect(TestHelper.interactionNames(map.getMap())).toEqual(['DragPan', 'PinchZoom', 'MouseWheelZoom', 'Select']);
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

  it('should do nothing on cancel', async () => {
    // Prepare
    map.toMapWrapper().setToolMode(Modes.EditProperties);
    modals.featurePropertiesModal.resolves({ status: ModalStatus.Canceled, properties: { abcd: 1234 }, type: ModalEventType.FeaturePropertiesClosed });

    // Act
    await map.click(5, 5);
    await TestHelper.wait(10); // We wait an internal promise

    // Assert
    expect(modals.featurePropertiesModal.callCount).toEqual(1);
    expect(history.register.callCount).toEqual(0);
  });

  it('should do nothing if properties does not change', async () => {
    // Prepare
    map.toMapWrapper().setToolMode(Modes.EditProperties);
    feature.set('abcd', 1234);

    modals.featurePropertiesModal.resolves({ status: ModalStatus.Confirmed, properties: { abcd: 1234 }, type: ModalEventType.FeaturePropertiesClosed });

    // Act
    await map.click(5, 5);
    await TestHelper.wait(10); // We wait an internal promise

    // Assert
    expect(modals.featurePropertiesModal.callCount).toEqual(1);
    expect(history.register.callCount).toEqual(0);
  });

  it('should register changeset if properties change', async () => {
    // Prepare
    map.toMapWrapper().setToolMode(Modes.EditProperties);
    feature.set('abcd', 12345);

    modals.featurePropertiesModal.resolves({ status: ModalStatus.Confirmed, properties: { abcd: 4567 }, type: ModalEventType.FeaturePropertiesClosed });

    // Act
    await map.click(5, 5);
    await TestHelper.wait(10); // We wait an internal promise

    // Assert
    expect(modals.featurePropertiesModal.callCount).toEqual(1);
    expect(history.register.callCount).toEqual(1);
    expect(history.register.args[0][0]).toEqual(HistoryKey.Map);

    const changeset = history.register.args[0][1] as SetFeaturePropertiesChangeset;
    expect(changeset.before).toEqual({ abcd: 12345 });
    expect(changeset.after).toEqual({ abcd: 4567 });
  });
});
