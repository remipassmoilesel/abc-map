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

import { AbcGeometryType, FeatureStyle, Logger } from '@abc-map/shared';
import { Draw, Modify, Snap } from 'ol/interaction';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';
import { DrawEvent } from 'ol/interaction/Draw';
import { AddFeaturesChangeset } from '../../../history/changesets/features/AddFeaturesChangeset';
import { ModifyEvent } from 'ol/interaction/Modify';
import { UpdateGeometriesChangeset, UpdateItem } from '../../../history/changesets/features/UpdateGeometriesChangeset';
import VectorSource from 'ol/source/Vector';
import { Changeset } from '../../../history/Changeset';
import { styleFunction } from '../../../geo/styles/style-function';
import { createEditingStyle } from 'ol/style/Style';
import { UndoCallbackChangeset } from '../../../history/changesets/features/UndoCallbackChangeset';
import Geometry from 'ol/geom/Geometry';
import Map from 'ol/Map';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { DefaultStyleOptions } from '../../../geo/styles/StyleFactoryOptions';
import { FeatureSelection } from '../../../geo/feature-selection/FeatureSelection';
import { getSelectionFromMap } from '../../../geo/feature-selection/getSelectionFromMap';

const logger = Logger.get('DrawInteraction');

export declare type GetStyleFunc = () => FeatureStyle;
export declare type ChangesetHandler = (t: Changeset) => void;
export declare type FeatureAddedHandler = (f: FeatureWrapper) => void;

export declare type ToolType = typeof AbcGeometryType.POINT | typeof AbcGeometryType.LINE_STRING | typeof AbcGeometryType.POLYGON;

const editingStyle = createEditingStyle();

export interface Options {
  type: ToolType;
  getStyle: GetStyleFunc;
  drawCondition: (ev: MapBrowserEvent<UIEvent>) => boolean;
  modifyCondition: (ev: MapBrowserEvent<UIEvent>) => boolean;
  deleteVertex?: (ev: MapBrowserEvent<UIEvent>) => boolean;
}

/**
 * Wrapper around several Openlayers interactions, used to draw points, lines and polygons.
 *
 * For performance purposes, only selected features must be handled by modify, snap, etc ...
 *
 * This file is tested during tool testing.
 *
 */
export class DrawInteractionsBundle {
  public onNewChangeset?: ChangesetHandler;
  public onDeleteChangeset?: ChangesetHandler;
  public onFeatureAdded?: FeatureAddedHandler;
  public onDrawStart?: () => void;
  public onDrawEnd?: () => void;
  public onDrawAborted?: () => void;
  public onModifyStart?: () => void;
  public onModifyEnd?: () => void;

  private snap?: Snap;
  private modify?: Modify;
  private draw?: Draw;

  private map?: Map;
  private source?: VectorSource<Geometry>;
  private selection?: FeatureSelection;

  private drawingStartChangeset?: Changeset;
  private escapeKeyListener?: (ev: KeyboardEvent) => void;

  // True when user is creating a new geometry. We use this state to prevent modifications will creating.
  private creating = false;

  constructor(private options: Options) {}

  public setup(map: Map, source: VectorSource<Geometry>) {
    this.map = map;
    this.source = source;
    this.selection = getSelectionFromMap(map);

    this.initModification();
    this.initDraw();
    this.initKeybindings();
  }

  // Modify features. Only selected features can be modified.
  private initModification() {
    this.snap = new Snap({ features: this.selection?.getFeatureCollection() });

    this.modify = new Modify({
      features: this.selection?.getFeatureCollection(),
      condition: (ev) => !this.creating && this.options.modifyCondition(ev),
      deleteCondition: this.options.deleteVertex,
    });

    let modified: FeatureWrapper[] = [];

    // Save initial state of features
    this.modify.on('modifystart', (ev: ModifyEvent) => {
      // Despite typings, ev.features is in fact nullable
      if (!ev.features || !ev.features.getLength()) {
        return;
      }

      const features = ev.features.getArray();
      features.forEach((feat) => {
        const clone = FeatureWrapper.fromUnknown(feat)?.clone();
        if (!clone) {
          logger.error(`Cannot track feature history, invalid feature`, feat);
          return;
        }

        modified.push(clone);
      });

      this.onModifyStart && this.onModifyStart();
    });

    // Create a changeset
    this.modify.on('modifyend', (ev: ModifyEvent) => {
      // Despite typings, ev.features is in fact nullable
      if (!ev.features || !ev.features.getLength()) {
        return;
      }

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
            logger.error(`Cannot register modify changeset, 'before' feature not found with id ${feature.getId()}`);
            return null;
          }

          return { feature, before: geomBefore, after: geomAfter };
        })
        .filter((item): item is UpdateItem => !!item);

      this.onNewChangeset && this.onNewChangeset(new UpdateGeometriesChangeset(items));
      modified = [];

      this.onModifyEnd && this.onModifyEnd();
    });

    this.map?.addInteraction(this.modify);
    this.map?.addInteraction(this.snap);
  }

  // Add features
  private initDraw(): void {
    const selection = this.selection;
    const getStyle = this.options.getStyle;
    const source = this.source;
    if (!selection || !source) {
      throw new Error('DrawInteractionsBundle not initialized');
    }

    this.draw = new Draw({
      source: this.source,
      type: this.options.type,
      condition: this.options.drawCondition,
      finishCondition: this.options.drawCondition,
      freehand: false,
      freehandCondition: () => false,
      style: (f) => {
        if (f.getGeometry()?.getType() === AbcGeometryType.POINT) {
          return styleFunction(DefaultStyleOptions, f).concat(editingStyle.Point);
        }

        return styleFunction(DefaultStyleOptions, f);
      },
      stopClick: true,
      // Snap tolerance is low in order to allow users to draw close vertices
      snapTolerance: 1,
    });

    // Clear selection, set style and id on feature
    this.draw.on('drawstart', (ev: DrawEvent) => {
      this.creating = true;

      const feature = FeatureWrapper.from(ev.feature);
      feature.setId();
      feature.setStyleProperties(getStyle());

      // Register changeset for drawing start
      this.drawingStartChangeset = new UndoCallbackChangeset(() => this.abortDrawing());
      this.onNewChangeset && this.onNewChangeset(this.drawingStartChangeset);

      this.onDrawStart && this.onDrawStart();
    });

    this.draw.on('drawend', (ev: DrawEvent) => {
      this.creating = false;

      const feature = FeatureWrapper.from(ev.feature);

      // When draw is confirmed, we replace changeset
      this.drawingStartChangeset && this.onDeleteChangeset && this.onDeleteChangeset(this.drawingStartChangeset);
      this.drawingStartChangeset = undefined;

      this.onNewChangeset && this.onNewChangeset(new AddFeaturesChangeset(source, [feature]));

      this.onFeatureAdded && this.onFeatureAdded(feature);

      this.onDrawEnd && this.onDrawEnd();
    });

    this.map?.addInteraction(this.draw);
  }

  public finishDrawing() {
    this.draw?.finishDrawing();
  }

  public abortDrawing() {
    this.drawingStartChangeset && this.onDeleteChangeset && this.onDeleteChangeset(this.drawingStartChangeset);
    this.drawingStartChangeset = undefined;
    this.creating = false;

    const featuresInDrawOverlay = this.draw?.getOverlay().getSource().getFeatures().length || 0;
    if (featuresInDrawOverlay > 1) {
      this.draw?.abortDrawing();
    }

    this.onDrawAborted && this.onDrawAborted();
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
