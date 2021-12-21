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
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Map from 'ol/Map';
import Icon from '../../../assets/tool-icons/text.inline.svg';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { HistoryKey } from '../../history/HistoryKey';
import { UpdateStyleChangeset } from '../../history/changesets/features/UpdateStyleChangeset';
import { Interaction, Select } from 'ol/interaction';
import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import { MapActions } from '../../store/map/actions';
import { MoveMapInteractionsBundle } from '../common/interactions/MoveMapInteractionsBundle';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';
import { DefaultTolerancePx } from '../common/constants';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import PluggableMap from 'ol/PluggableMap';
import GeometryType from 'ol/geom/GeometryType';
import { SelectionInteractionsBundle } from '../common/interactions/SelectionInteractionsBundle';
import { SupportedGeometries } from '../common/interactions/SupportedGeometry';
import { getRemSize } from '../../ui/getRemSize';
import { ToolMode } from '../ToolMode';
import { Conditions, Modes } from './Modes';
import { TextBox } from './TextBox';

const logger = Logger.get('TextTool.ts');

export class TextTool implements Tool {
  private map?: Map;
  private source?: VectorSource<Geometry>;
  private move?: MoveMapInteractionsBundle;
  private selection?: SelectionInteractionsBundle;
  private textSelect?: Select;
  private interactions: Interaction[] = [];
  private textBox?: TextBox;

  constructor(private store: MainStore, private history: HistoryService) {}

  public getId(): MapTool {
    return MapTool.Text;
  }

  public getIcon(): string {
    return Icon;
  }

  public getModes(): ToolMode[] {
    return [Modes.EditText, Modes.Select, Modes.MoveMap];
  }

  public getI18nLabel(): string {
    return 'Text';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    this.map = map;
    this.source = source;

    // Interactions for map view manipulation
    this.move = new MoveMapInteractionsBundle({ condition: Conditions.MoveMap });
    this.move.setup(map);

    // Selection for style modifications
    this.selection = new SelectionInteractionsBundle({ condition: Conditions.Select });
    this.selection.setup(map, source, SupportedGeometries);
    this.selection.onStyleSelected = (style) => this.store.dispatch(MapActions.setDrawingStyle({ text: style.text }));

    // Select interaction will condition modification of features
    this.textSelect = new Select({
      condition: Conditions.EditText,
      toggleCondition: Conditions.EditText,
      layers: (lay) => LayerWrapper.from(lay).isActive(),
      // Warning: here we must use null to not manage styles with Select interaction
      // Otherwise modification of style can be 'restored' from a bad state
      style: null,
      hitTolerance: DefaultTolerancePx,
    });

    this.textSelect.on('select', (ev) => {
      // We clear previous selection
      ev.deselected.forEach((f) => FeatureWrapper.from(f).setSelected(false));

      if (!ev.selected.length) {
        return;
      }

      // We keep only the last feature in selection
      this.textSelect?.getFeatures().forEach((f) => FeatureWrapper.from(f).setSelected(false));
      this.textSelect?.getFeatures().clear();
      this.textSelect?.getFeatures().push(ev.selected[0]);

      // We select feature
      const feature = FeatureWrapper.from(ev.selected[0]);
      feature.setSelected(true);

      // We display style
      const style = feature.getStyleProperties();
      this.store.dispatch(MapActions.setDrawingStyle({ text: style.text }));

      // We keep previous styme for undo / redo
      const before = feature.getStyleProperties();

      // We apply current style to feature
      const currentStyle = this.store.getState().map.currentStyle;
      const alignment = feature.getGeometry()?.getType() === GeometryType.POINT ? 'left' : 'center';
      feature.setStyleProperties({
        text: {
          color: currentStyle.text?.color,
          font: currentStyle.text?.font,
          size: currentStyle.text?.size,
          offsetX: currentStyle.text?.offsetX,
          offsetY: currentStyle.text?.offsetY,
          rotation: currentStyle.text?.rotation,
          alignment,
        },
      });

      // We grab feature position in pixel then display text box
      const originalEv = ev.mapBrowserEvent as MapBrowserEvent<UIEvent> | undefined;
      const map = originalEv?.map as PluggableMap | undefined;
      const mapTarget = map?.getTarget() as HTMLDivElement | undefined;
      if (!originalEv || !mapTarget || !(mapTarget instanceof HTMLDivElement)) {
        logger.error('Cannot show textbox: ', { originalEv, map, mapTarget });
        return false;
      }

      const x = mapTarget.getBoundingClientRect().x + originalEv?.pixel[0] + getRemSize();
      const y = mapTarget.getBoundingClientRect().y + originalEv?.pixel[1] + getRemSize();

      this.textBox = new TextBox();

      // When input done, we set text and register a change set
      this.textBox.onValidation = (text) => {
        if (text !== feature.getText()) {
          feature.setText(text);

          const after = feature.getStyleProperties();
          this.history.register(HistoryKey.Map, new UpdateStyleChangeset([{ before, after, feature }]));
        }
      };

      this.textBox.show(feature.getText() || '', x, y);
    });

    map.addInteraction(this.textSelect);
    this.interactions.push(this.textSelect);
  }

  public deselectAll() {
    this.textBox?.dispose();

    this.textSelect?.getFeatures().forEach((f) => FeatureWrapper.from(f).setSelected(false));
    this.textSelect?.getFeatures().clear();

    this.selection?.clear();
  }

  public dispose() {
    this.deselectAll();

    this.textSelect?.dispose();
    this.selection?.dispose();

    this.move?.dispose();

    this.interactions.forEach((inter) => {
      this.map?.removeInteraction(inter);
      inter.dispose();
    });
  }
}
