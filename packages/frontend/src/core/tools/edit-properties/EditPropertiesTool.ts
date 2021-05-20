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
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Map } from 'ol';
import Icon from '../../../assets/tool-icons/properties.svg';
import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import { ModalService } from '../../ui/ModalService';
import { EditPropertiesInteraction, Options } from './EditPropertiesInteraction';
import { EditPropertiesEvent, FeatureSelected } from './EditPropertiesEvent';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { ModalStatus } from '../../ui/typings';
import { HistoryKey } from '../../history/HistoryKey';
import { SetFeatureProperties } from '../../history/tasks/features/SetFeatureProperties';
import * as _ from 'lodash';

const logger = Logger.get('EditPropertiesTool.ts');

function interactionFactory(options: Options): EditPropertiesInteraction {
  return new EditPropertiesInteraction(options);
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

  protected setupInternal(map: Map, source: VectorSource<Geometry>): void {
    const edit = this.newInteraction({ source });

    edit.on(EditPropertiesEvent.FeatureSelected, (ev: FeatureSelected) => {
      const feature = FeatureWrapper.from(ev.feature);
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

    map.addInteraction(edit);
    this.interactions.push(edit);
  }
}
