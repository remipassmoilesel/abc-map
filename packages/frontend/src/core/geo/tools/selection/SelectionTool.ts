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
import { MapTool } from '@abc-map/frontend-commons';
import { DragBox, Translate } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Collection, Map } from 'ol';
import Icon from '../../../../assets/tool-icons/selection.svg';
import { containsXY, Extent } from 'ol/extent';
import Feature from 'ol/Feature';
import { HistoryKey } from '../../../history/HistoryKey';
import { UpdateItem, UpdateGeometriesTask } from '../../../history/tasks/features/UpdateGeometriesTask';
import { Logger } from '@abc-map/frontend-commons';
import { FeatureWrapper } from '../../features/FeatureWrapper';
import { withMainButton } from '../common/common-conditions';
import { defaultInteractions } from '../../map/interactions';

const logger = Logger.get('SelectionTool.ts');

export class SelectionTool extends AbstractTool {
  private selection = new Collection<Feature<Geometry>>();

  public getId(): MapTool {
    return MapTool.Selection;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Sélection';
  }

  protected setupInternal(map: Map, source: VectorSource<Geometry>): void {
    // Interactions for map view manipulation
    const defaults = defaultInteractions();
    defaults.forEach((i) => map.addInteraction(i));
    this.interactions.push(...defaults);

    // Tool interactions
    const dragBox = new DragBox({
      condition: withMainButton,
      className: 'abc-selection-box',
    });

    const sourceListener = source.on('addfeature', (evt) => {
      if (FeatureWrapper.from(evt.feature).isSelected()) {
        this.selection.push(evt.feature);

        // If one feature were added, others can be deselected. So we remove them
        this.selection
          .getArray()
          .slice()
          .forEach((feat) => {
            if (!FeatureWrapper.from(feat).isSelected()) {
              this.selection.remove(feat);
            }
          });
      }
    });
    this.sourceListeners.push(sourceListener);

    dragBox.on('boxstart', () => {
      this.selection.forEach((f) => FeatureWrapper.from(f).setSelected(false));
      this.selection.clear();
    });

    dragBox.on('boxend', () => {
      const extent = dragBox.getGeometry().getExtent();
      source.forEachFeatureInExtent(extent, (feature) => {
        const geomExtent = feature.getGeometry()?.getExtent();
        if (isWithinExtent(extent, geomExtent)) {
          FeatureWrapper.from(feature).setSelected(true);
          this.selection.push(feature);
        }
      });
    });

    const translate = new Translate({
      features: this.selection,
    });

    let translated: FeatureWrapper[] = [];
    translate.on('translatestart', () => {
      this.selection.forEach((feat) => {
        const clone = FeatureWrapper.from(feat).clone();
        translated.push(clone);
      });
    });

    translate.on('translateend', () => {
      const items = this.selection
        .getArray()
        .map((feat) => {
          const feature = FeatureWrapper.from(feat);
          if (!feature.getId()) {
            logger.error('Cannot register modify task, feature does not have an id');
            return null;
          }

          const before = translated.find((f) => f.getId() === feature.getId());
          const geomBefore = before?.getGeometry();
          const geomAfter = feature?.getGeometry()?.clone(); // As geometries are mutated, here we must clone it
          if (!geomBefore || !geomAfter) {
            logger.error(`Cannot register modify task, 'before' feature not found with id ${feature.getId()}`);
            return null;
          }

          return { feature, before: geomBefore, after: geomAfter };
        })
        .filter((item) => !!item) as UpdateItem[];

      this.history.register(HistoryKey.Map, new UpdateGeometriesTask(items));
      translated = [];
    });

    map.addInteraction(dragBox);
    map.addInteraction(translate);
    this.interactions.push(dragBox);
    this.interactions.push(translate);
  }

  protected disposeInternal() {
    super.disposeInternal();
    this.selection.forEach((f) => FeatureWrapper.from(f).setSelected(false));
    this.selection.clear();
  }
}

function isWithinExtent(selection: Extent, geomExtent?: Extent) {
  return geomExtent && containsXY(selection, geomExtent[0], geomExtent[1]) && containsXY(selection, geomExtent[2], geomExtent[3]);
}
