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
import { withMainButton } from '../common/helpers/common-conditions';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';
import { Options } from 'ol/interaction/Select';
import { noModifierKeys } from 'ol/events/condition';
import { DefaultTolerancePx } from '../common/constants';
import { MoveInteractionsBundle } from '../common/interactions/MoveInteractionsBundle';
import { SelectionInteractionsBundle } from '../common/interactions/SelectionInteractionsBundle';
import { MapActions } from '../../store/map/actions';
import isEqual from 'lodash/isEqual';

const logger = Logger.get('EditPropertiesTool.ts');

function interactionFactory(options: Options): Select {
  return new Select(options);
}

export class EditPropertiesTool implements Tool {
  private map?: Map;
  private move?: MoveInteractionsBundle;
  private selection?: SelectionInteractionsBundle;
  private interactions: Interaction[] = [];

  constructor(private mainStore: MainStore, private history: HistoryService, private modals: ModalService, private newInteraction = interactionFactory) {}

  public getId(): MapTool {
    return MapTool.EditProperties;
  }

  public getIcon(): string {
    return Icon;
  }

  public getI18nLabel(): string {
    return 'Properties';
  }

  public setup(map: Map): void {
    this.map = map;

    // Default interactions
    this.move = new MoveInteractionsBundle();
    this.move.setup(map);

    // Selection with shift click
    this.selection = new SelectionInteractionsBundle();
    this.selection.onStyleSelected = (st) => this.mainStore.dispatch(MapActions.setDrawingStyle(st));

    // Select interaction will condition modification of features
    const select = this.newInteraction({
      condition: (ev) => withMainButton(ev) && noModifierKeys(ev),
      toggleCondition: () => false,
      layers: (lay) => LayerWrapper.from(lay).isActive(),
      // Warning: here we must use null to not manage styles with Select interaction
      // Otherwise modification of style can be 'restored' from a bad state
      style: null as any,
      hitTolerance: DefaultTolerancePx,
    });

    select.on('select', (ev) => {
      const feature = FeatureWrapper.from(ev.selected[0]);

      // Keep previous properties for undo / redo
      const before = feature.getSimpleProperties();

      // Pop up modal, when modification done overwrite properties, register changeset
      this.modals
        .featurePropertiesModal(before)
        .then((modalEvent) => {
          const after = modalEvent.properties;
          if (ModalStatus.Confirmed === modalEvent.status && !isEqual(before, after)) {
            const cs = new SetFeaturePropertiesChangeset(feature, before, after);
            cs.apply().catch((err) => logger.error('Cannot modify properties: ', err));
            this.history.register(HistoryKey.Map, cs);
          }

          // We must unselect otherwise we can not select again
          select.getFeatures().forEach((f) => FeatureWrapper.from(f).setSelected(false));
          select.getFeatures().clear();
        })
        .catch((err) => logger.error('Error while editing feature properties: ', err));
    });

    map.addInteraction(select);
    this.interactions.push(select);
  }

  public deselectAll() {
    this.selection?.clear();
  }

  public dispose() {
    this.deselectAll();

    this.move?.dispose();
    this.selection?.dispose();

    this.interactions.forEach((inter) => {
      this.map?.removeInteraction(inter);
      inter.dispose();
    });
  }
}
