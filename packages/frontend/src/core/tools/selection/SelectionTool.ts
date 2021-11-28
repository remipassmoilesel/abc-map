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
import { GeometryType, Logger, MapTool } from '@abc-map/shared';
import { DragBox, Interaction, Translate } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Map from 'ol/Map';
import Icon from '../../../assets/tool-icons/selection.inline.svg';
import { HistoryKey } from '../../history/HistoryKey';
import { UpdateGeometriesTask, UpdateItem } from '../../history/tasks/features/UpdateGeometriesTask';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { withMainButton } from '../common/helpers/common-conditions';
import { noModifierKeys } from 'ol/events/condition';
import { MapActions } from '../../store/map/actions';
import { HistoryService } from '../../history/HistoryService';
import { MainStore } from '../../store/store';
import { isWithinExtent } from '../common/helpers/isWithinExtent';
import { SelectionInteractionsBundle } from '../common/interactions/SelectionInteractionsBundle';
import { AllSupportedGeometries } from '../common/interactions/SupportedGeometry';
import { MoveInteractionsBundle } from '../common/interactions/MoveInteractionsBundle';

const logger = Logger.get('SelectionTool.ts');

export class SelectionTool implements Tool {
  private map?: Map;
  private source?: VectorSource<Geometry>;
  private selection?: SelectionInteractionsBundle;
  private move?: MoveInteractionsBundle;
  private interactions: Interaction[] = [];

  constructor(private store: MainStore, private history: HistoryService) {}

  public getId(): MapTool {
    return MapTool.Selection;
  }

  public getIcon(): string {
    return Icon;
  }

  public getI18nLabel(): string {
    return 'Select';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    this.map = map;
    this.source = source;

    // Interactions for map view manipulation
    this.move = new MoveInteractionsBundle();
    this.move.setup(map);

    const dispatchStyle = (feat: FeatureWrapper) => {
      const style = feat.getStyleProperties();
      switch (feat.getGeometry()?.getType()) {
        case GeometryType.POINT:
          this.store.dispatch(MapActions.setDrawingStyle({ point: style.point }));
          break;
        case GeometryType.LINE_STRING:
        case GeometryType.MULTI_LINE_STRING:
          this.store.dispatch(MapActions.setDrawingStyle({ stroke: style.stroke }));
          break;
        case GeometryType.POLYGON:
        case GeometryType.MULTI_POLYGON:
          this.store.dispatch(MapActions.setDrawingStyle({ stroke: style.stroke, fill: style.fill }));
          break;
        default:
          logger.error('Unhandled style: ', { style, feature: feat });
      }
    };

    // Selection on shift + click
    this.selection = new SelectionInteractionsBundle();
    this.selection.setup(map, this.source, AllSupportedGeometries);
    this.selection.onStyleSelected = (style, feature) => dispatchStyle(feature);

    const selection = this.selection.getFeatures();

    // Select with a box
    const dragBox = new DragBox({
      condition: (ev) => withMainButton(ev) && noModifierKeys(ev),
      className: 'abc-selection-box',
    });

    dragBox.on('boxstart', () => {
      selection.forEach((f) => FeatureWrapper.from(f).setSelected(false));
      selection.clear();
    });

    dragBox.on('boxend', () => {
      const extent = dragBox.getGeometry().getExtent();

      source.forEachFeatureInExtent(extent, (feature) => {
        const geomExtent = feature.getGeometry()?.getExtent();
        if (isWithinExtent(extent, geomExtent)) {
          FeatureWrapper.from(feature).setSelected(true);
          selection.push(feature);
        }
      });

      if (selection.getLength()) {
        const last = FeatureWrapper.from(selection.getArray()[selection.getLength() - 1]);
        dispatchStyle(last);
      }
    });

    // Translate selection
    const translate = new Translate({ features: selection });

    let translated: FeatureWrapper[] = [];
    translate.on('translatestart', () => {
      selection.forEach((feat) => {
        const clone = FeatureWrapper.from(feat).clone();
        translated.push(clone);
      });
    });

    translate.on('translateend', () => {
      const items = selection
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

    [dragBox, translate].forEach((inter) => {
      map.addInteraction(inter);
      this.interactions.push(inter);
    });
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
