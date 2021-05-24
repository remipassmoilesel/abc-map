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

import { AbstractTool } from '../AbstractTool';
import { Logger, MapTool } from '@abc-map/shared';
import { Map } from 'ol';
import Icon from '../../../assets/tool-icons/properties.svg';
import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import { ModalService } from '../../ui/ModalService';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { ModalStatus } from '../../ui/typings';
import { HistoryKey } from '../../history/HistoryKey';
import { SetFeatureProperties } from '../../history/tasks/features/SetFeatureProperties';
import * as _ from 'lodash';
import { defaultInteractions } from '../../geo/map/interactions';
import { Select } from 'ol/interaction';
import { withControlKeyOnly, withMainButton } from '../common/common-conditions';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';
import { Options } from 'ol/interaction/Select';

const logger = Logger.get('EditPropertiesTool.ts');

function interactionFactory(options: Options): Select {
  return new Select(options);
}

export class EditPropertiesTool extends AbstractTool {
  constructor(mainStore: MainStore, history: HistoryService, private modals: ModalService, private newInteraction = interactionFactory) {
    super(mainStore, history);
  }

  public getId(): MapTool {
    return MapTool.EditProperties;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Editer les propriétés';
  }

  protected setupInternal(map: Map): void {
    // Select interaction will condition modification of features
    const select = this.newInteraction({
      condition: (ev) => withControlKeyOnly(ev) && withMainButton(ev),
      layers: (lay) => LayerWrapper.from(lay).isActive(),
      // Warning: here we must use null to not manage styles with Select interaction
      // Otherwise modification of style can be 'restored' from a bad state
      style: null as any,
    });

    select.on('select', () => {
      const raw = select.getFeatures().pop();
      if (!raw) {
        return;
      }

      const feature = FeatureWrapper.from(raw);
      const before = feature.getSimpleProperties();

      this.modals
        .featurePropertiesModal(before)
        .then((modalEvent) => {
          const after = modalEvent.properties;
          if (ModalStatus.Confirmed === modalEvent.status && !_.isEqual(before, after)) {
            feature.overwriteSimpleProperties(after);
            this.history.register(HistoryKey.Map, new SetFeatureProperties(feature, before, after));
          }
        })
        .catch((err) => logger.error('Error while editing feature properties: ', err));
    });

    map.addInteraction(select);
    this.interactions.push(select);

    // Interactions for map view manipulation
    const defaults = defaultInteractions();
    defaults.forEach((i) => map.addInteraction(i));
    this.interactions.push(...defaults);
  }
}
