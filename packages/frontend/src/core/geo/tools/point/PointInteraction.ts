import { Logger } from '@abc-map/frontend-shared';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import VectorSource from 'ol/source/Vector';
import { Interaction } from 'ol/interaction';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { Map } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import Point from 'ol/geom/Point';
import { findFeatureNearCursor } from '../common/findFeatureNearCursor';
import GeometryType from 'ol/geom/GeometryType';
import { Coordinate } from 'ol/coordinate';
import { withMainButton, withShiftKey } from '../common/key-helpers';
import { GeometryBeingUpdated, FeatureCreated, GeometryUpdated, FeatureBeingCreated } from '../common/ToolEvent';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';

const logger = Logger.get('PointInteraction.ts');

export interface Options {
  map: Map;
  source: VectorSource;
}

/**
 *  This interaction creates and modify points.
 *
 *  This interaction:
 * - Creates a feature with a point geometry, at pointer down, if no feature found at coordinate
 * - Select a feature, at pointer down, if feature found at coordinate
 * - Move feature, at pointer drag, if feature found at coordinate
 */
export class PointInteraction extends Interaction {
  private readonly source: VectorSource;
  private map: Map;
  private updateOverlay: VectorLayer;
  private creationOverlay: VectorLayer;
  private lastDragCoordinates?: Coordinate;

  constructor(private options: Options) {
    super();
    this.source = options.source;
    this.map = options.map;

    this.creationOverlay = new VectorLayer({
      source: new VectorSource({ useSpatialIndex: true }),
      updateWhileInteracting: true,
    });
    this.creationOverlay.setMap(this.map);

    this.updateOverlay = new VectorLayer({
      source: new VectorSource({ useSpatialIndex: true }),
      updateWhileInteracting: true,
    });
    this.updateOverlay.setMap(this.map);
  }

  /**
   * Return true to continue event dispatch
   * @param event
   */
  public handleEvent(event: MapBrowserEvent<UIEvent>): boolean {
    if (withShiftKey(event)) {
      return true;
    }

    let propagate = true;
    if (MapBrowserEventType.POINTERDOWN === event.type && withMainButton(event)) {
      propagate = this.handlePointerDown(event);
      this.lastDragCoordinates = event.coordinate;
    }
    if (MapBrowserEventType.POINTERDRAG === event.type) {
      propagate = this.handlePointerDrag(event);
      this.lastDragCoordinates = event.coordinate;
    }
    if (MapBrowserEventType.POINTERUP === event.type && withMainButton(event)) {
      propagate = this.handlePointerUp();
      this.lastDragCoordinates = undefined;
    }

    return propagate;
  }

  protected handlePointerDown(event: MapBrowserEvent<UIEvent>): boolean {
    // Feature found, we remove it from source and we add it in overlay
    const feature = this.findPointFeature(event, this.source);
    if (feature) {
      this.source.removeFeature(feature);
      this.updateOverlay.getSource().addFeature(feature);
      this.dispatchEvent(new GeometryBeingUpdated(feature));
      return false;
    }

    // No feature found, we create one
    const newFeature = new Feature(new Point(event.coordinate));
    this.creationOverlay.getSource().addFeature(newFeature);
    this.dispatchEvent(new FeatureBeingCreated(newFeature));

    return false;
  }

  protected handlePointerDrag(event: MapBrowserEvent<UIEvent>): boolean {
    // If we are dragging and features are present in overlay, we move them
    const features = this.creationOverlay.getSource().getFeatures().concat(this.updateOverlay.getSource().getFeatures());
    if (features.length && this.lastDragCoordinates) {
      const deltaX = event.coordinate[0] - this.lastDragCoordinates[0];
      const deltaY = event.coordinate[1] - this.lastDragCoordinates[1];

      features.forEach((f) => {
        const geom = f.getGeometry() as Point; // Features here are supposed points
        const original = geom.getFirstCoordinate();
        geom.setCoordinates([original[0] + deltaX, original[1] + deltaY]);
      });
    }

    return false;
  }

  protected handlePointerUp(): boolean {
    // End of interaction, we set back features to source
    const createdFeatures = this.creationOverlay.getSource().getFeatures();
    if (createdFeatures.length) {
      this.creationOverlay.getSource().clear();
      this.source.addFeatures(createdFeatures);
      this.dispatchEvent(new FeatureCreated(createdFeatures[0]));
    }

    const updatedFeatures = this.updateOverlay.getSource().getFeatures();
    if (updatedFeatures.length) {
      this.updateOverlay.getSource().clear();
      this.source.addFeatures(updatedFeatures);
      this.dispatchEvent(new GeometryUpdated(updatedFeatures[0]));
    }

    return false;
  }

  public dispose() {
    super.dispose();
    this.updateOverlay.setMap(null as any); // Typings are borked
  }

  /**
   * Return a feature only if near cursor and with a point geometry
   * @param event
   * @param source
   * @private
   */
  private findPointFeature(event: MapBrowserEvent<UIEvent>, source: VectorSource): Feature<Geometry> | undefined {
    return findFeatureNearCursor(event, source, (feature) => {
      const geom = feature?.getGeometry();
      return (feature && geom && geom.getType() === GeometryType.POINT) || false;
    });
  }
}
