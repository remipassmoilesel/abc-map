import { Draw, Interaction, Modify, Snap } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Collection, Map, MapBrowserEvent } from 'ol';
import { LayerProperties, MapTool } from '@abc-map/shared-entities';
import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import { DrawEvent } from 'ol/interaction/Draw';
import { VectorStyles } from '../features/VectorStyles';
import { HistoryKey } from '../../history/HistoryKey';
import { AddFeaturesTask } from '../../history/tasks/AddFeaturesTask';
import { onlyMainButton } from './common/common-conditions';
import Feature, { FeatureLike } from 'ol/Feature';
import { ModifyEvent } from 'ol/interaction/Modify';
import { Logger } from '../../utils/Logger';
import { FeatureHelper } from '../features/FeatureHelper';
import { ModificationItem, ModifyGeometriesTask } from '../../history/tasks/ModifyGeometriesTask';
import BaseLayer from 'ol/layer/Base';
import GeometryType from 'ol/geom/GeometryType';
import * as _ from 'lodash';

const logger = Logger.get('AbstractTool.ts');

export interface MapListener {
  type: string;
  listener: (ev: MapBrowserEvent) => any;
}

export abstract class AbstractTool {
  protected mapListeners: MapListener[] = [];
  protected interactions: Interaction[] = [];
  protected vectorSource?: VectorSource;
  protected map?: Map;

  constructor(protected store: MainStore, protected history: HistoryService) {}

  public abstract getId(): MapTool;
  public abstract getLabel(): string;
  public abstract getIcon(): string;

  public setup(map: Map, source: VectorSource<Geometry>): void {
    this.map = map;
    this.vectorSource = source;
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
      const feature = ev.feature;
      VectorStyles.setProperties(feature, this.store.getState().map.currentStyle);
    });
  }

  protected finalizeOnDrawEnd(draw: Draw, source: VectorSource): void {
    draw.on('drawend', (ev: DrawEvent) => {
      const feature = ev.feature;
      if (!feature.getId()) {
        FeatureHelper.setId(feature);
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
    const modifiableFeatures = new Collection<Feature<Geometry>>();
    const modify = new Modify({ features: modifiableFeatures, condition: onlyMainButton });
    const snap = new Snap({ features: modifiableFeatures });

    const setFeatureModifiable = (feature: FeatureLike): boolean => {
      const hasId = feature.getId();
      const modifiable = feature instanceof Feature && feature.getGeometry() instanceof Geometry;
      const correctType = feature.getGeometry()?.getType() === type;
      if (!hasId || !modifiable || !correctType) {
        return false;
      }

      const alreadySelected = !!modifiableFeatures.getArray().find((f) => feature.getId() === f.getId());
      if (alreadySelected) {
        return true;
      }

      modifiableFeatures.push(feature as Feature<Geometry>);
      return true;
    };

    const limitModifiableList = () => {
      modifiableFeatures
        .getArray()
        .slice()
        .forEach((feature) => {
          if (modifiableFeatures.getLength() > 1) {
            modifiableFeatures.remove(feature);
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
    map.on('pointermove', listener);
    this.mapListeners.push({ type: 'pointermove', listener });

    // Every time a modification starts we snapshot geometry in order to create an history task
    let modified: Feature<Geometry>[] = [];
    modify.on('modifystart', (ev: ModifyEvent) => {
      const features = ev.features.getArray();
      features.forEach((feat) => {
        const cloned = FeatureHelper.clone(feat);
        modified.push(cloned);
      });
    });

    // Every time a modification ends we create an history task
    modify.on('modifyend', (ev: ModifyEvent) => {
      const features = ev.features.getArray();
      const items = features
        .map((feature) => {
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
        .filter((item) => !!item) as ModificationItem[];

      this.history.register(HistoryKey.Map, new ModifyGeometriesTask(items));
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

  public getMapListeners(): MapListener[] {
    return this.mapListeners;
  }
}
