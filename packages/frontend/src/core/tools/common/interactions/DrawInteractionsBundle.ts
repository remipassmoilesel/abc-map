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
import { FeatureStyle, Logger } from '@abc-map/shared';
import { Draw, Modify, Snap } from 'ol/interaction';
import { withMainButton } from '../helpers/common-conditions';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';
import { DrawEvent } from 'ol/interaction/Draw';
import { AddFeaturesTask } from '../../../history/tasks/features/AddFeaturesTask';
import { ModifyEvent } from 'ol/interaction/Modify';
import { UpdateGeometriesTask, UpdateItem } from '../../../history/tasks/features/UpdateGeometriesTask';
import VectorSource from 'ol/source/Vector';
import { Task } from '../../../history/Task';
import { styleFunction } from '../../../geo/styles/style-function';
import { createEditingStyle } from 'ol/style/Style';
import { noModifierKeys } from 'ol/events/condition';
import { UndoCallbackTask } from '../../../history/tasks/features/UndoCallbackTask';
import Collection from 'ol/Collection';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import Map from 'ol/Map';

const logger = Logger.get('DrawInteraction');

export declare type GetStyleFunc = () => FeatureStyle;
export declare type HistoryTaskHandler = (t: Task) => void;

export declare type ToolMode = typeof GeometryType.POINT | typeof GeometryType.LINE_STRING | typeof GeometryType.POLYGON;

const editingStyle = createEditingStyle();

/**
 * Wrapper around several Openlayers interactions, used to draw points, lines and polygons.
 *
 * For performance purposes, only selected features must be handled by modify, snap, etc ...
 *
 * This file is tested during tool testing.
 *
 * FIXME: add Translate after ol upgrade ? May conflict with Modify
 *
 * @param mode "Mode" of drawing tool, can be point, linestring or polygon. See ol/interaction/Draw.js:122
 * @param targetTypes Only these types of features will be handled
 * @param source
 * @param getStyle
 * @param addTask
 * @param removeTask
 * @param onStyle
 */
export class DrawInteractionsBundle {
  public onNewTask?: HistoryTaskHandler;
  public onDeleteTask?: HistoryTaskHandler;

  private snap?: Snap;
  private modify?: Modify;
  private draw?: Draw;

  private map?: Map;
  private source?: VectorSource<Geometry>;
  private selection?: Collection<Feature<Geometry>>;

  private getStyle?: GetStyleFunc;
  private drawingStartTask?: Task;
  private escapeKeyListener?: (ev: KeyboardEvent) => void;

  constructor(private mode: ToolMode) {}

  public setup(map: Map, source: VectorSource<Geometry>, selection: Collection<Feature<Geometry>>, getStyle: GetStyleFunc) {
    this.map = map;
    this.source = source;
    this.selection = selection;
    this.getStyle = getStyle;

    this.initModification();
    this.initDraw();
    this.initKeybindings();
  }

  // Modify features. Only selected features can be modified.
  private initModification() {
    this.snap = new Snap({ features: this.selection });
    this.modify = new Modify({ features: this.selection, condition: withMainButton });

    let modified: FeatureWrapper[] = [];

    // Save initial state of features
    this.modify.on('modifystart', (ev: ModifyEvent) => {
      const features = ev.features.getArray();
      features.forEach((feat) => {
        const clone = FeatureWrapper.fromUnknown(feat)?.clone();
        if (!clone) {
          logger.error(`Cannot track feature history, invalid feature`, feat);
          return;
        }

        modified.push(clone);
      });
    });

    // Create an history task
    this.modify.on('modifyend', (ev: ModifyEvent) => {
      const features = ev.features.getArray();
      const items = features
        .map((feat) => {
          const feature = FeatureWrapper.fromUnknown(feat);
          if (!feature) {
            logger.error(`Cannot track feature history, invalid feature`, feat);
            return null;
          }

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

      this.onNewTask && this.onNewTask(new UpdateGeometriesTask(items));
      modified = [];
    });

    this.map?.addInteraction(this.modify);
    this.map?.addInteraction(this.snap);
  }

  // Add features
  private initDraw(): void {
    const selection = this.selection;
    const getStyle = this.getStyle;
    const source = this.source;
    if (!selection || !getStyle || !source) {
      throw new Error('DrawInteractionsBundle not initialized');
    }

    this.draw = new Draw({
      source: this.source,
      type: this.mode,
      condition: (ev) => withMainButton(ev) && noModifierKeys(ev),
      finishCondition: (ev) => withMainButton(ev) && noModifierKeys(ev),
      freehand: false,
      freehandCondition: () => false,
      style: (f) => {
        if (f.getGeometry()?.getType() === GeometryType.POINT) {
          return styleFunction(1, f).concat(editingStyle.Point);
        }

        return styleFunction(1, f);
      },
      stopClick: true,
      // Snap tolerance is low in order to allow users to draw close vertices
      snapTolerance: 1,
    });

    // Clear selection, set style and id on feature
    this.draw.on('drawstart', (ev: DrawEvent) => {
      selection.forEach((f) => FeatureWrapper.from(f).setSelected(false));
      selection.clear();

      const feature = FeatureWrapper.from(ev.feature);
      feature.setId();
      feature.setStyleProperties(getStyle());

      // Register history task for drawing start
      this.drawingStartTask = new UndoCallbackTask(() => this.abortDrawing());
      this.onNewTask && this.onNewTask(this.drawingStartTask);
    });

    this.draw.on('drawend', (ev: DrawEvent) => {
      const feature = FeatureWrapper.from(ev.feature);

      // When draw is confirmed, we replace history task
      this.drawingStartTask && this.onDeleteTask && this.onDeleteTask(this.drawingStartTask);
      this.drawingStartTask = undefined;

      this.onNewTask && this.onNewTask(new AddFeaturesTask(source, [feature]));
    });

    this.map?.addInteraction(this.draw);
  }

  private abortDrawing() {
    this.drawingStartTask && this.onDeleteTask && this.onDeleteTask(this.drawingStartTask);
    this.drawingStartTask = undefined;

    const featuresInDrawOverlay = this.draw?.getOverlay().getSource().getFeatures().length || 0;
    if (featuresInDrawOverlay > 1) {
      this.draw?.abortDrawing();
    }
  }

  // If Escape key is pressed and if user is drawing, we cancel drawing
  // If Escape key is pressed and objects are selected, we cancel selection
  private initKeybindings() {
    this.escapeKeyListener = (ev: KeyboardEvent) => {
      if (ev.key !== 'Escape') {
        return;
      }
      ev.preventDefault();
      ev.stopPropagation();

      this.abortDrawing();
    };

    document.body.addEventListener('keydown', this.escapeKeyListener);
  }

  public dispose(): void {
    [this.snap, this.modify, this.draw].forEach((inter) => {
      if (inter) {
        inter.dispose();
        this.map?.removeInteraction(inter);
      }
    });

    this.escapeKeyListener && document.body.removeEventListener('keydown', this.escapeKeyListener);
  }
}
