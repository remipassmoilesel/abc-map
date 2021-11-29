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
import { FeatureStyle, Logger, MapTool } from '@abc-map/shared';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Map from 'ol/Map';
import Icon from '../../../assets/tool-icons/text.inline.svg';
import { TextInteraction } from './TextInteraction';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { HistoryKey } from '../../history/HistoryKey';
import { UpdateStyleChangeset } from '../../history/changesets/features/UpdateStyleChangeset';
import GeometryType from 'ol/geom/GeometryType';
import { TextChanged, TextEnd, TextEvent, TextStart } from './TextInteractionEvents';
import { Interaction } from 'ol/interaction';
import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import { MapActions } from '../../store/map/actions';
import { SelectionInteractionsBundle } from '../common/interactions/SelectionInteractionsBundle';
import { AllSupportedGeometries } from '../common/interactions/SupportedGeometry';
import { MoveInteractionsBundle } from '../common/interactions/MoveInteractionsBundle';

const logger = Logger.get('TextTool.ts');

export class TextTool implements Tool {
  private map?: Map;
  private source?: VectorSource<Geometry>;
  private move?: MoveInteractionsBundle;
  private selection?: SelectionInteractionsBundle;
  private interactions: Interaction[] = [];

  constructor(private store: MainStore, private history: HistoryService) {}

  public getId(): MapTool {
    return MapTool.Text;
  }

  public getIcon(): string {
    return Icon;
  }

  public getI18nLabel(): string {
    return 'Text';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    this.map = map;
    this.source = source;

    // Interactions for map view manipulation
    this.move = new MoveInteractionsBundle();
    this.move.setup(map);

    // Select on shift + click
    this.selection = new SelectionInteractionsBundle();
    this.selection.setup(map, source, AllSupportedGeometries);
    this.selection.onStyleSelected = (style) => this.store.dispatch(MapActions.setDrawingStyle({ text: style.text }));

    // Edit text
    const text = new TextInteraction({ source });

    let before: FeatureStyle | undefined;
    text.customOn(TextEvent.Start, (ev: TextStart) => {
      const feature = FeatureWrapper.from(ev.feature);

      // Dispatch style
      const style = feature.getStyleProperties();
      this.store.dispatch(MapActions.setDrawingStyle({ text: style.text }));

      // Apply style to feature
      const currentStyle = this.store.getState().map.currentStyle;
      style.text = {
        ...style.text,
        color: currentStyle.text?.color,
        size: currentStyle.text?.size,
        offsetX: currentStyle.text?.offsetX,
        offsetY: currentStyle.text?.offsetY,
        rotation: currentStyle.text?.rotation,
      };

      if (feature.getGeometry()?.getType() === GeometryType.POINT) {
        style.text.alignment = 'left';
      } else {
        style.text.alignment = 'center';
      }

      feature.setStyleProperties(style);
      before = style;
    });

    text.customOn(TextEvent.Changed, (ev: TextChanged) => {
      const feature = FeatureWrapper.from(ev.feature);
      feature.setText(ev.text);
    });

    text.customOn(TextEvent.End, (ev: TextEnd) => {
      if (!before) {
        logger.error('Cannot register changeset, before style was not set');
        return;
      }

      const feature = FeatureWrapper.from(ev.feature);
      const after = feature.getStyleProperties();

      this.history.register(HistoryKey.Map, new UpdateStyleChangeset([{ before, after, feature }]));
    });

    map.addInteraction(text);
    this.interactions.push(text);
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
