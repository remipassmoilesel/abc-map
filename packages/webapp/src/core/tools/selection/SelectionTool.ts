/**
 * Copyright © 2023 Rémi Pace.
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
import { DragBox, Interaction, Translate } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Map from 'ol/Map';
import Icon from '../../../assets/tool-icons/selection.inline.svg';
import { HistoryKey } from '../../history/HistoryKey';
import { UpdateGeometriesChangeset, UpdateItem } from '../../history/changesets/features/UpdateGeometriesChangeset';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { MapActions } from '../../store/map/actions';
import { HistoryService } from '../../history/HistoryService';
import { MainStore } from '../../store/store';
import { isWithinExtent } from '../common/helpers/isWithinExtent';
import { MoveMapInteractionsBundle } from '../common/interactions/MoveMapInteractionsBundle';
import { ToolMode } from '../ToolMode';
import { Conditions, Modes } from './Modes';
import { getSelectionFromMap } from '../../geo/feature-selection/getSelectionFromMap';

const logger = Logger.get('SelectionTool.ts');

export class SelectionTool implements Tool {
  private map?: Map;
  private source?: VectorSource<Geometry>;
  private move?: MoveMapInteractionsBundle;
  private interactions: Interaction[] = [];

  constructor(private store: MainStore, private history: HistoryService) {}

  public getId(): MapTool {
    return MapTool.Selection;
  }

  public getIcon(): string {
    return Icon;
  }

  public getModes(): ToolMode[] {
    return [Modes.Select, Modes.MoveMap];
  }

  public getI18nLabel(): string {
    return 'Select';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    this.map = map;
    this.source = source;

    // Interactions for map view manipulation
    this.move = new MoveMapInteractionsBundle({ condition: Conditions.Move });
    this.move.setup(map);

    const selection = getSelectionFromMap(map);

    const dispatchStyle = (feat: FeatureWrapper) => {
      const style = feat.getStyleProperties();
      switch (feat.getGeometry()?.getType()) {
        case 'Point':
          this.store.dispatch(MapActions.setDrawingStyle({ point: style.point }));
          break;
        case 'LineString':
        case 'MultiLineString':
          this.store.dispatch(MapActions.setDrawingStyle({ stroke: style.stroke }));
          break;
        case 'Polygon':
        case 'MultiPolygon':
          this.store.dispatch(MapActions.setDrawingStyle({ stroke: style.stroke, fill: style.fill }));
          break;
        default:
          logger.error('Unhandled style: ', { style, feature: feat });
      }
    };

    // Select with a box
    const dragBox = new DragBox({ condition: Conditions.Select, className: 'abc-selection-box' });

    dragBox.on('boxstart', () => {
      selection.clear();
    });

    dragBox.on('boxend', () => {
      const extent = dragBox.getGeometry().getExtent();

      source.forEachFeatureInExtent(extent, (feature) => {
        const geomExtent = feature.getGeometry()?.getExtent();
        if (isWithinExtent(extent, geomExtent)) {
          selection.add([feature]);
        }
      });

      const selectedFeatures = selection.getFeatures();
      if (selectedFeatures.length) {
        const last = FeatureWrapper.from(selectedFeatures[selectedFeatures.length - 1]);
        dispatchStyle(last);
      }
    });

    // Translate selection
    const translate = new Translate({ features: selection.getFeatureCollection(), condition: Conditions.Select });

    let translated: FeatureWrapper[] = [];
    translate.on('translatestart', () => {
      selection.getFeatures().forEach((feat) => {
        const clone = FeatureWrapper.from(feat).clone();
        translated.push(clone);
      });
    });

    translate.on('translateend', () => {
      const items = selection
        .getFeatures()
        .map((feat) => {
          const feature = FeatureWrapper.from(feat);
          if (!feature.getId()) {
            logger.error('Cannot register modify changeset, feature does not have an id');
            return null;
          }

          const before = translated.find((f) => f.getId() === feature.getId());
          const geomBefore = before?.getGeometry();
          const geomAfter = feature?.getGeometry()?.clone(); // As geometries are mutated, here we must clone it
          if (!geomBefore || !geomAfter) {
            logger.error(`Cannot register modify changeset, 'before' feature not found with id ${feature.getId()}`);
            return null;
          }

          return { feature, before: geomBefore, after: geomAfter };
        })
        .filter((item): item is UpdateItem => !!item);

      this.history.register(HistoryKey.Map, new UpdateGeometriesChangeset(items));
      translated = [];
    });

    [dragBox, translate].forEach((inter) => {
      map.addInteraction(inter);
      this.interactions.push(inter);
    });
  }

  public dispose() {
    this.move?.dispose();

    this.interactions.forEach((inter) => {
      this.map?.removeInteraction(inter);
      inter.dispose();
    });
  }
}
