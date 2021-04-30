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
import { FeatureStyle } from '../../style/FeatureStyle';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { withControlKeyOnly, withGeometry, withMainButton } from './common-conditions';
import { LayerWrapper } from '../../layers/LayerWrapper';
import { SelectEvent } from 'ol/interaction/Select';
import { FeatureWrapper } from '../../features/FeatureWrapper';
import { DrawEvent } from 'ol/interaction/Draw';
import { AddFeaturesTask } from '../../../history/tasks/features/AddFeaturesTask';
import { ModifyEvent } from 'ol/interaction/Modify';
import { UpdateGeometriesTask, UpdateItem } from '../../../history/tasks/features/UpdateGeometriesTask';
import VectorSource from 'ol/source/Vector';
import { Logger } from '@abc-map/frontend-commons';
import { Task } from '../../../history/Task';
import { createEditingStyle } from 'ol/style/Style';
import { Collection } from 'ol';
import { noModifierKeys } from 'ol/events/condition';

const logger = Logger.get('drawInteractionFactory.ts');

export declare type GetStyleFunc = () => FeatureStyle;
export declare type HistoryTaskHandler = (t: Task) => void;

// For the moment, we support only those geometries
// Circles does not serialize in geojson
// Rectangle cannot be modified in a correct way with this method
export declare type SupportedGeometry = GeometryType.POINT | GeometryType.LINE_STRING | GeometryType.POLYGON;

export interface DrawInteraction {
  interactions: [Modify, Draw, Snap, Select];
  dispose: () => void;
}

const editingStyle = createEditingStyle();

/**
 * Create a draw interaction bundle for specified geometry type.
 *
 * @param type
 * @param source
 * @param getStyle
 * @param onTask
 */
export function drawInteractionFactory(type: SupportedGeometry, source: VectorSource, getStyle: GetStyleFunc, onTask: HistoryTaskHandler): DrawInteraction {
  // Select interaction will condition modification of features
  const select = new Select({
    condition: (ev) => withControlKeyOnly(ev) && withMainButton(ev),
    layers: (lay) => LayerWrapper.from(lay).isActive(),
    filter: (feat) => withGeometry(feat, type),
    // Warning: here we must use null to not manage styles with Select interaction
    // Otherwise modification of style can be 'restored' from a bad state
    style: null as any,
  });

  const modify = new Modify({
    features: select.getFeatures(),
    condition: withMainButton,
  });

  const draw = new Draw({
    source: source,
    type,
    condition: (e) => noModifierKeys(e) && withMainButton(e),
    finishCondition: (e) => noModifierKeys(e) && withMainButton(e),
    style: (f) => {
      // This style is for the point under cursor. Otherwise, Modify should not manage style.
      if (f.getGeometry()?.getType() === GeometryType.POINT) {
        return editingStyle.Point;
      }
      return [];
    },
  });

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
  // If Escape key is pressed and objetcs are selected, we cancel selection
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
