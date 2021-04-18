import { Draw, Interaction, Modify, Snap } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Collection, Map, MapBrowserEvent } from 'ol';
import { LayerProperties } from '@abc-map/shared-entities';
import { MapTool } from '@abc-map/frontend-shared';
import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import { DrawEvent } from 'ol/interaction/Draw';
import { HistoryKey } from '../../history/HistoryKey';
import { AddFeaturesTask } from '../../history/tasks/features/AddFeaturesTask';
import { onlyMainButton } from './common/common-conditions';
import Feature, { FeatureLike } from 'ol/Feature';
import { ModifyEvent } from 'ol/interaction/Modify';
import { Logger } from '@abc-map/frontend-shared';
import { UpdateItem, UpdateGeometriesTask } from '../../history/tasks/features/UpdateGeometriesTask';
import BaseLayer from 'ol/layer/Base';
import GeometryType from 'ol/geom/GeometryType';
import * as _ from 'lodash';
import { FeatureWrapper } from '../features/FeatureWrapper';
import { EventsKey } from 'ol/events';
import { drawingInteractions } from '../map/interactions';

const logger = Logger.get('AbstractTool.ts');

export abstract class AbstractTool {
  protected mapListeners: EventsKey[] = [];
  protected sourceListeners: EventsKey[] = [];
  protected interactions: Interaction[] = [];
  protected vectorSource?: VectorSource;
  protected map?: Map;

  constructor(protected store: MainStore, protected history: HistoryService) {}

  public abstract getId(): MapTool;
  public abstract getLabel(): string;
  public abstract getIcon(): string;

  public setup(map: Map, source: VectorSource<Geometry>): void {
    // Set references
    this.map = map;
    this.vectorSource = source;

    // Add drawing interactions
    const interactions = drawingInteractions();
    interactions.forEach((i) => map.addInteraction(i));
    this.interactions.push(...interactions);
  }

  public dispose() {
    this.mapListeners.forEach((l) => this.map?.un(l.type, l.listener));
    this.interactions.forEach((inter) => {
      this.map?.removeInteraction(inter);
      inter.dispose();
    });

    this.mapListeners = [];
    this.interactions = [];
    this.vectorSource = undefined;
    this.map = undefined;
  }

  /**
   * Setup a listener on tool to apply current style after draw
   * @param draw
   */
  protected applyStyleOnDrawEnd(draw: Draw): void {
    draw.on('drawend', (ev: DrawEvent) => {
      FeatureWrapper.from(ev.feature).setStyleProperties(this.store.getState().map.currentStyle);
    });
  }

  protected finalizeOnDrawEnd(draw: Draw, source: VectorSource): void {
    draw.on('drawend', (ev: DrawEvent) => {
      const feature = FeatureWrapper.from(ev.feature);
      if (!feature.getId()) {
        feature.setId();
      }
      this.history.register(HistoryKey.Map, new AddFeaturesTask(source, [feature]));
    });
  }

  /**
   * Modify interactions, allow users to modify geometries
   *
   * In order to prevent poor performances on large layers, will only set 'modifiable' features that are near cursor
   * @param map
   * @param type
   * @protected
   */
  protected commonModifyInteractions(map: Map, type: GeometryType): void {
    const features = new Collection<Feature<Geometry>>();
    const modify = new Modify({ features: features, condition: onlyMainButton });
    const snap = new Snap({ features: features });

    const setFeatureModifiable = (feat: FeatureLike): boolean => {
      const feature = FeatureWrapper.fromFeatureLike(feat);
      if (!feature) {
        return false; // Continue iteration
      }

      if (feature.getGeometry()?.getType() !== type) {
        return false;
      }

      const alreadyRegistered = !!features.getArray().find((f) => feature.getId() === f.getId());
      if (alreadyRegistered) {
        return true; // Stop iteration
      }

      features.push(feature.unwrap());
      return true;
    };

    const limitModifiableList = () => {
      features
        .getArray()
        .slice()
        .forEach((feature) => {
          if (features.getLength() > 1) {
            features.remove(feature);
          }
        });
    };

    const featureSeekOptions = {
      hitTolerance: 10,
      layerFilter: (lay: BaseLayer) => lay.get(LayerProperties.Active) || false,
    };

    // Every time mouse move on map, we select closest feature and add it to modify collection
    const listener = _.throttle(
      (event: MapBrowserEvent) => {
        map.forEachFeatureAtPixel(event.pixel, setFeatureModifiable, featureSeekOptions);
        limitModifiableList();
      },
      200,
      { trailing: true }
    );

    const mapListener = map.on('pointermove', listener);
    this.mapListeners.push(mapListener);

    // Every time a modification starts we snapshot geometry in order to create an history task
    let modified: FeatureWrapper[] = [];
    modify.on('modifystart', (ev: ModifyEvent) => {
      const features = ev.features.getArray();
      features.forEach((feat) => {
        modified.push(FeatureWrapper.from(feat).clone());
      });
    });

    // Every time a modification ends we create an history task
    modify.on('modifyend', (ev: ModifyEvent) => {
      const features = ev.features.getArray();
      const items = features
        .map((feat) => {
          const feature = FeatureWrapper.from(feat);
          if (!feature.getId()) {
            logger.error('Cannot register modify task, feature does not have an id');
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

      this.history.register(HistoryKey.Map, new UpdateGeometriesTask(items));
      modified = [];
    });

    map.addInteraction(modify);
    map.addInteraction(snap);
    this.interactions.push(modify, snap);
  }

  public getMap(): Map | undefined {
    return this.map;
  }

  public getSource(): VectorSource | undefined {
    return this.vectorSource;
  }

  public getInteractions(): Interaction[] {
    return this.interactions;
  }

  public getMapListeners(): EventsKey[] {
    return this.mapListeners;
  }
}
