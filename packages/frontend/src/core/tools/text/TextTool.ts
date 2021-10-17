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
import { MapTool } from '@abc-map/shared';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Map } from 'ol';
import Icon from '../../../assets/tool-icons/text.svg';
import { Logger } from '@abc-map/shared';
import { TextInteraction } from './TextInteraction';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { HistoryKey } from '../../history/HistoryKey';
import { UpdateStyleTask } from '../../history/tasks/features/UpdateStyleTask';
import { FeatureStyle } from '@abc-map/shared';
import GeometryType from 'ol/geom/GeometryType';
import { TextEvent, TextChanged, TextEnd, TextStart } from './TextInteractionEvents';
import { defaultInteractions } from '../../geo/map/interactions';

const logger = Logger.get('TextTool.ts');

export class TextTool extends AbstractTool {
  private previousFeature: FeatureWrapper | undefined;

  public getId(): MapTool {
    return MapTool.Text;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Ajouter du texte';
  }

  protected setupInternal(map: Map, source: VectorSource<Geometry>): void {
    // Interactions for map view manipulation
    const defaults = defaultInteractions();
    defaults.forEach((i) => map.addInteraction(i));
    this.interactions.push(...defaults);

    const text = new TextInteraction({ source });

    let before: FeatureStyle | undefined;
    text.on(TextEvent.Start, (ev: TextStart) => {
      const feature = FeatureWrapper.from(ev.feature);

      // Select feature
      this.previousFeature?.setSelected(false);
      feature.setSelected(true);

      // Apply style
      const currentStyle = this.store.getState().map.currentStyle;
      const style = feature.getStyleProperties();
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
      this.previousFeature = feature;
    });

    text.on(TextEvent.Changed, (ev: TextChanged) => {
      const feature = FeatureWrapper.from(ev.feature);
      feature.setText(ev.text);
    });

    text.on(TextEvent.End, (ev: TextEnd) => {
      if (!before) {
        logger.error('Cannot register task, before style was not set');
        return;
      }

      const feature = FeatureWrapper.from(ev.feature);
      const after = feature.getStyleProperties();

      this.history.register(HistoryKey.Map, new UpdateStyleTask([{ before, after, feature }]));
    });

    map.addInteraction(text);
    this.interactions.push(text);
  }

  public dispose() {
    super.dispose();
    this.previousFeature?.setSelected(false);
  }
}
