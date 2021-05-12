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
import { EditPropertiesInteraction } from './EditPropertiesInteraction';
import { ModalService } from '../../../ui/ModalService';
import { HistoryService } from '../../../history/HistoryService';
import { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import { FeatureSelected } from './EditPropertiesEvent';
import { ModalEventType, ModalStatus } from '../../../ui/typings';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { HistoryKey } from '../../../history/HistoryKey';
import { SetFeatureProperties } from '../../../history/tasks/features/SetFeatureProperties';
import { Utils } from '../../../utils/Utils';

describe('EditPropertiesTool', () => {
  let map: SinonStubbedInstance<Map>;
  let source: SinonStubbedInstance<VectorSource>;
  let interaction: EditPropertiesInteraction;
  let modals: SinonStubbedInstance<ModalService>;
  let history: SinonStubbedInstance<HistoryService>;
  let tool: EditPropertiesTool;

  beforeEach(() => {
    modals = sinon.createStubInstance(ModalService);
    history = sinon.createStubInstance(HistoryService);
    map = sinon.createStubInstance(Map);
    source = sinon.createStubInstance(VectorSource);
    interaction = new EditPropertiesInteraction({ source: (source as unknown) as VectorSource });
    const factory = () => interaction;

    tool = new EditPropertiesTool({} as any, (history as unknown) as HistoryService, (modals as unknown) as ModalService, factory);
    tool.setup((map as unknown) as Map, (source as unknown) as VectorSource);
  });

  it('should do nothing on cancel', async () => {
    // Prepare
    const feature = new Feature(new Point([1, 2]));
    modals.featurePropertiesModal.resolves({ status: ModalStatus.Canceled, properties: { abcd: 1234 }, type: ModalEventType.FeaturePropertiesClosed });

    // Act
    interaction.dispatchEvent(new FeatureSelected(feature));
    await Utils.wait(10); // We wait an internal promise

    // Assert
    expect(history.register.callCount).toEqual(0);
  });

  it('should do nothing if properties does not change', async () => {
    // Prepare
    const feature = new Feature(new Point([1, 2]));
    feature.set('abcd', 1234);
    modals.featurePropertiesModal.resolves({ status: ModalStatus.Confirmed, properties: { abcd: 1234 }, type: ModalEventType.FeaturePropertiesClosed });

    // Act
    interaction.dispatchEvent(new FeatureSelected(feature));
    await Utils.wait(10); // We wait an internal promise

    // Assert
    expect(history.register.callCount).toEqual(0);
  });

  it('should register history task if properties change', async () => {
    // Prepare
    const feature = new Feature(new Point([1, 2]));
    feature.set('abcd', 12345);
    modals.featurePropertiesModal.resolves({ status: ModalStatus.Confirmed, properties: { abcd: 4567 }, type: ModalEventType.FeaturePropertiesClosed });

    // Act
    interaction.dispatchEvent(new FeatureSelected(feature));
    await Utils.wait(10); // We wait an internal promise

    // Assert
    expect(history.register.callCount).toEqual(1);
    expect(history.register.args[0][0]).toEqual(HistoryKey.Map);
    const task = history.register.args[0][1] as SetFeatureProperties;
    expect(task.before).toEqual({ abcd: 12345 });
    expect(task.after).toEqual({ abcd: 4567 });
  });

  it('dispose()', () => {
    tool.dispose();

    expect(map.removeInteraction.callCount).toEqual(1);
    expect(map.removeInteraction.args[0][0].constructor.name).toEqual('EditPropertiesInteraction');
  });
});
