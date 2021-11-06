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

import GeometryType from 'ol/geom/GeometryType';
import { FeatureStyle } from '@abc-map/shared';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { withGeometry, withMainButton, withShiftKey } from './common-conditions';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';
import { SelectEvent } from 'ol/interaction/Select';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { DrawEvent } from 'ol/interaction/Draw';
import { AddFeaturesTask } from '../../history/tasks/features/AddFeaturesTask';
import { ModifyEvent } from 'ol/interaction/Modify';
import { UpdateGeometriesTask, UpdateItem } from '../../history/tasks/features/UpdateGeometriesTask';
import VectorSource from 'ol/source/Vector';
import { Logger } from '@abc-map/shared';
import { Task } from '../../history/Task';
import { Collection } from 'ol';
import { styleFunction } from '../../geo/styles/style-function';
import { createEditingStyle } from 'ol/style/Style';
import { DefaultTolerancePx } from './constants';
import { noModifierKeys } from 'ol/events/condition';

const logger = Logger.get('drawInteractionFactory.ts');

export declare type GetStyleFunc = () => FeatureStyle;
export declare type HistoryTaskHandler = (t: Task) => void;

export declare type ToolMode = GeometryType.POINT | GeometryType.LINE_STRING | GeometryType.POLYGON;

// For the moment, we support only those geometries
// Circles does not serialize in geojson
// Rectangle cannot be modified in a correct way with this method
export declare type SupportedGeometry =
  | GeometryType.POINT
  | GeometryType.MULTI_POINT
  | GeometryType.LINE_STRING
  | GeometryType.MULTI_LINE_STRING
  | GeometryType.MULTI_POLYGON
  | GeometryType.POLYGON;

export interface DrawInteraction {
  interactions: [Modify, Draw, Snap, Select];
  dispose: () => void;
}

const editingStyle = createEditingStyle();

/**
 * Create a draw interaction bundle for specified geometry type.
 *
 * For performance purposes, only selected features must be handled by modify, snap, etc ...
 *
 * @param mode "Mode" of drawing tool, can be point, linestring or polygon. See ol/interaction/Draw.js:122
 * @param targetTypes Only these types of features will be handled
 * @param source
 * @param getStyle
 * @param onTask
 */
export function drawInteractionFactory(
  mode: ToolMode,
  targetTypes: SupportedGeometry[],
  source: VectorSource,
  getStyle: GetStyleFunc,
  onTask: HistoryTaskHandler
): DrawInteraction {
  // Select features. Only selected features can be modified.
  const select = new Select({
    condition: (ev) => withMainButton(ev) && withShiftKey(ev),
    toggleCondition: () => false,
    layers: (lay) => LayerWrapper.from(lay).isActive(),
    filter: (feat) => withGeometry(feat, targetTypes),
    // Warning: here we must use null to not manage styles with Select interaction
    // Otherwise modification of style can be 'restored' from a bad state
    style: null as any,
    hitTolerance: DefaultTolerancePx,
  });

  // Modify features. Only selected features can be modified.
  const modify = new Modify({
    features: select.getFeatures(),
    condition: withMainButton,
  });

  // Add features
  const draw = new Draw({
    source: source,
    type: mode,
    condition: (e) => withMainButton(e) && noModifierKeys(e),
    finishCondition: (e) => withMainButton(e) && noModifierKeys(e),
    freehand: false,
    freehandCondition: () => false,
    style: (f) => {
      if (f.getGeometry()?.getType() === GeometryType.POINT) {
        return styleFunction(1, f).concat(editingStyle.Point);
      }

      return styleFunction(1, f);
    },
  });

  // Snap point, only on selected features
  const snap = new Snap({ features: select.getFeatures() });

  const previousSelection = new Collection<FeatureWrapper>();
  select.on('select', (ev: SelectEvent) => {
    previousSelection.forEach((f) => f.setSelected(false));
    previousSelection.clear();

    ev.selected.forEach((f) => {
      const feature = FeatureWrapper.from(f);
      feature.setSelected(true);
      previousSelection.push(feature);
    });
  });

  // Clear selection, set style and id on feature
  draw.on('drawstart', (ev: DrawEvent) => {
    select.getFeatures().forEach((f) => FeatureWrapper.from(f).setSelected(false));
    select.getFeatures().clear();

    const feature = FeatureWrapper.from(ev.feature);
    feature.setId();
    feature.setStyleProperties(getStyle());
  });

  // Register history task
  draw.on('drawend', (ev: DrawEvent) => {
    const feature = FeatureWrapper.from(ev.feature);
    onTask(new AddFeaturesTask(source, [feature]));
  });

  let modified: FeatureWrapper[] = [];

  // Save initial state of features
  modify.on('modifystart', (ev: ModifyEvent) => {
    const features = ev.features.getArray();
    features.forEach((feat) => modified.push(FeatureWrapper.from(feat).clone()));
  });

  // Create an history task
  modify.on('modifyend', (ev: ModifyEvent) => {
    const features = ev.features.getArray();
    const items = features
      .map((feat) => {
        const feature = FeatureWrapper.from(feat);
        const before = modified.find((f) => f.getId() === feature.getId());
        const geomBefore = before?.getGeometry();
        const geomAfter = feature?.getGeometry()?.clone(); // As geometries are mutated, here we must clone it
        if (!geomBefore || !geomAfter) {
          logger.error(`Cannot register modify task, 'before' feature not found with id ${feature.getId()}`);
          return null;
        }

        return { feature, before: geomBefore, after: geomAfter };
      })
      .filter((item) => !!item) as UpdateItem[];

    onTask(new UpdateGeometriesTask(items));
    modified = [];
  });

  // If Escape key is pressed and if user is drawing, we cancel drawing
  // If Escape key is pressed and objects are selected, we cancel selection
  const handleKey = (ev: KeyboardEvent) => {
    if (ev.key !== 'Escape') {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();

    if (draw.getOverlay().getSource().getFeatures().length > 1) {
      draw.abortDrawing();
    }
    if (select.getFeatures().getLength()) {
      select.getFeatures().forEach((f) => FeatureWrapper.from(f).setSelected(false));
      select.getFeatures().clear();
    }
  };
  document.body.addEventListener('keydown', handleKey);

  return {
    // Interactions are used from lasts to firsts
    // Order is inspired from openlayers examples
    interactions: [modify, draw, snap, select],
    dispose: () => {
      select.getFeatures().forEach((f) => FeatureWrapper.from(f).setSelected(false));
      select.getFeatures().clear();
      previousSelection.forEach((f) => f.setSelected(false));
      previousSelection.clear();

      document.body.removeEventListener('keydown', handleKey);
    },
  };
}
