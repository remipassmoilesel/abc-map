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
import Map from 'ol/Map';
import { ModalEventType, ModalStatus } from '../../ui/typings';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { HistoryKey } from '../../history/HistoryKey';
import { SetFeaturePropertiesChangeset } from '../../history/changesets/features/SetFeaturePropertiesChangeset';
import { TestHelper } from '../../utils/test/TestHelper';
import { Select } from 'ol/interaction';
import { SelectEvent } from 'ol/interaction/Select';
import Geometry from 'ol/geom/Geometry';

describe('EditPropertiesTool', () => {
  let map: SinonStubbedInstance<Map>;
  let modals: SinonStubbedInstance<ModalService>;
  let history: SinonStubbedInstance<HistoryService>;
  let interaction: Select;
  let tool: EditPropertiesTool;

  beforeEach(() => {
    modals = sinon.createStubInstance(ModalService);
    history = sinon.createStubInstance(HistoryService);
    map = sinon.createStubInstance(Map);
    interaction = new Select();
    const factory = () => interaction;

    tool = new EditPropertiesTool({} as any, history as unknown as HistoryService, modals as unknown as ModalService, factory);
    tool.setup(map as unknown as Map);
  });

  it('should do nothing on cancel', async () => {
    // Prepare
    const feature = new Feature(new Point([1, 2]));
    modals.featurePropertiesModal.resolves({ status: ModalStatus.Canceled, properties: { abcd: 1234 }, type: ModalEventType.FeaturePropertiesClosed });

    // Act
    interaction.dispatchEvent(selectEvent([feature]));
    await TestHelper.wait(10); // We wait an internal promise

    // Assert
    expect(history.register.callCount).toEqual(0);
  });

  it('should do nothing if properties does not change', async () => {
    // Prepare
    const feature = new Feature(new Point([1, 2]));
    feature.set('abcd', 1234);
    modals.featurePropertiesModal.resolves({ status: ModalStatus.Confirmed, properties: { abcd: 1234 }, type: ModalEventType.FeaturePropertiesClosed });

    // Act
    interaction.dispatchEvent(selectEvent([feature]));
    await TestHelper.wait(10); // We wait an internal promise

    // Assert
    expect(history.register.callCount).toEqual(0);
  });

  it('should register changeset if properties change', async () => {
    // Prepare
    const feature = new Feature(new Point([1, 2]));
    feature.set('abcd', 12345);
    modals.featurePropertiesModal.resolves({ status: ModalStatus.Confirmed, properties: { abcd: 4567 }, type: ModalEventType.FeaturePropertiesClosed });

    // Act
    interaction.dispatchEvent(selectEvent([feature]));
    await TestHelper.wait(10); // We wait an internal promise

    // Assert
    expect(history.register.callCount).toEqual(1);
    expect(history.register.args[0][0]).toEqual(HistoryKey.Map);
    const changeset = history.register.args[0][1] as SetFeaturePropertiesChangeset;
    expect(changeset.before).toEqual({ abcd: 12345 });
    expect(changeset.after).toEqual({ abcd: 4567 });
  });

  it('dispose()', () => {
    tool.dispose();

    expect(map.removeInteraction.callCount).toEqual(4);
    const names = map.removeInteraction.args.map((args) => args[0].constructor.name);
    expect(names).toEqual(['DragPan', 'KeyboardPan', 'MouseWheelZoom', 'Select']);
  });

  function selectEvent(feats: Feature<Geometry>[]): SelectEvent {
    return new SelectEvent('select' as any, feats, [], {} as any);
  }
});
