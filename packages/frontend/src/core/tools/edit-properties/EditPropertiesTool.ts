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

import { Tool } from '../Tool';
import { Logger, MapTool } from '@abc-map/shared';
import Map from 'ol/Map';
import Icon from '../../../assets/tool-icons/properties.inline.svg';
import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import { ModalService } from '../../ui/ModalService';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { ModalStatus } from '../../ui/typings';
import { HistoryKey } from '../../history/HistoryKey';
import { SetFeaturePropertiesChangeset } from '../../history/changesets/features/SetFeaturePropertiesChangeset';
import { Interaction, Select } from 'ol/interaction';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';
import { DefaultTolerancePx } from '../common/constants';
import { MoveMapInteractionsBundle } from '../common/interactions/MoveMapInteractionsBundle';
import isEqual from 'lodash/isEqual';
import { ToolMode } from '../ToolMode';
import { Conditions, Modes } from './Modes';
import { getSelectionFromMap } from '../../geo/feature-selection/getSelectionFromMap';

const logger = Logger.get('EditPropertiesTool.ts');

export class EditPropertiesTool implements Tool {
  private map?: Map;
  private move?: MoveMapInteractionsBundle;
  // This interaction is used to select features to edit
  private editSelect?: Select;
  private interactions: Interaction[] = [];

  constructor(private store: MainStore, private history: HistoryService, private modals: ModalService) {}

  public getId(): MapTool {
    return MapTool.EditProperties;
  }

  public getIcon(): string {
    return Icon;
  }

  public getModes(): ToolMode[] {
    return [Modes.EditProperties, Modes.MoveMap];
  }

  public getI18nLabel(): string {
    return 'Properties';
  }

  public setup(map: Map): void {
    this.map = map;

    // Default interactions
    this.move = new MoveMapInteractionsBundle({ condition: Conditions.MoveMap });
    this.move.setup(map);

    // Edit properties on selection
    this.editSelect = new Select({
      condition: Conditions.EditProperties,
      toggleCondition: Conditions.EditProperties,
      layers: (lay) => LayerWrapper.from(lay).isActive(),
      // Warning: here we must use null to not manage styles with Select interaction
      // Otherwise modification of style can be 'restored' from a bad state
      style: null,
      hitTolerance: DefaultTolerancePx,
    });

    const selection = getSelectionFromMap(map);

    this.editSelect.on('select', (ev) => {
      if (!ev.selected.length) {
        return;
      }

      // We clear previous selection
      this.editSelect?.getFeatures().clear();

      // Then we select the new feature
      const feature = FeatureWrapper.from(ev.selected[0]);
      if (!selection.isSelected(feature)) {
        selection.add([feature]);
      }

      // Keep previous properties for undo / redo
      const before = feature.getDataProperties();

      // Pop up modal, when modification done overwrite properties, register changeset
      this.modals
        .editPropertiesModal(before)
        .then((modalEvent) => {
          const after = modalEvent.properties;
          if (ModalStatus.Confirmed === modalEvent.status && !isEqual(before, after)) {
            const cs = new SetFeaturePropertiesChangeset(feature, before, after);
            cs.execute().catch((err) => logger.error('Cannot modify properties: ', err));
            this.history.register(HistoryKey.Map, cs);
          }

          // Then we clear selection in order to let user click twice on same item
          this.editSelect?.getFeatures().clear();
        })
        .catch((err) => logger.error('Error while editing feature properties: ', err));
    });

    map.addInteraction(this.editSelect);
    this.interactions.push(this.editSelect);
  }

  public dispose() {
    this.move?.dispose();
    this.editSelect?.dispose();

    this.interactions.forEach((inter) => {
      this.map?.removeInteraction(inter);
      inter.dispose();
    });
  }
}
