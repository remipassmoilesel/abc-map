import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import OlGeolocation from 'ol/Geolocation';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Logger } from '@abc-map/shared';
import { GeolocationChanged, GeolocationError, Position } from './events';
import { toLonLat } from 'ol/proj';

const logger = Logger.get('Geolocation.ts');

export class Geolocation {
  public static create(map: Map) {
    return new Geolocation(map);
  }

  private enabled = false;
  private _followPosition = false;
  private geolocation?: OlGeolocation;
  private layer = new VectorLayer<VectorSource<Geometry>>();
  private accuracyFeature = new Feature<Geometry>();
  private positionFeature = new Feature<Geometry>();

  private eventEmitter = document.createDocumentFragment();

  constructor(private readonly map: Map) {}

  public enable(follow: boolean) {
    this._followPosition = follow;

    // See: https://openlayers.org/en/latest/examples/geolocation.html
    this.geolocation = new OlGeolocation({
      // enableHighAccuracy must be set to true to have the heading value.
      trackingOptions: { enableHighAccuracy: true },
      projection: this.map.getView().getProjection(),
    });

    this.accuracyFeature.setStyle(
      new Style({
        fill: new Fill({ color: '#ffffff66' }),
        stroke: new Stroke({ color: '#3399CCCC', width: 1 }),
      })
    );

    this.positionFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({ color: '#3399CC' }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
        }),
      })
    );

    this.geolocation.on('error', (error: { message?: string }) => {
      logger.error('Geolocation error: ', { message: error.message, error });
      this.eventEmitter.dispatchEvent(new GeolocationError(error));
    });

    this.geolocation.on('change:accuracyGeometry', () => {
      const feat = this.geolocation?.getAccuracyGeometry();
      if (feat) {
        this.accuracyFeature.setGeometry(feat);
      }

      this.dispatchChange();
    });

    this.geolocation.on('change:position', () => {
      const coordinates = this.geolocation?.getPosition();
      this.positionFeature.setGeometry(coordinates ? new Point(coordinates) : undefined);

      this.dispatchChange();
    });

    this.layer.setMap(this.map);
    this.layer.setSource(new VectorSource({ features: [this.accuracyFeature, this.positionFeature] }));

    this.geolocation.setTracking(true);
    this.enabled = true;
  }

  public disable() {
    this.geolocation?.dispose();
    this.layer?.dispose();

    this.enabled = false;
  }

  public updateMapView() {
    const view = this.map.getView();
    const accuracyGeom = this.accuracyFeature.getGeometry();
    const position = this.geolocation?.getPosition();

    const updateZoom = () => {
      const zoom = view.getZoom() ?? 7;
      view.setZoom(zoom - zoom * 0.06);
    };

    // If accuracy geom we fit it
    if (accuracyGeom) {
      view.fit(accuracyGeom.getExtent());
      updateZoom();
    }
    // Else we try position
    else if (position) {
      logger.warn('Cannot update view, no accuracy geometry');
      view.setCenter(position);
      updateZoom();
    }
    // Else no update !
    else {
      logger.warn('Cannot update view, no accuracy geometry, no position');
    }
  }

  private dispatchChange(): void {
    if (!this.geolocation) {
      throw new Error('Not started');
    }

    // Dispatch event with position and various information
    const event = new GeolocationChanged(this.getPosition());
    this.eventEmitter.dispatchEvent(event);

    // If "follow position" is enabled, each time position change we update map view
    if (this._followPosition) {
      this.updateMapView();
    }
  }

  public getPosition(): Position {
    if (!this.geolocation) {
      throw new Error('Not enabled');
    }

    const position = this.geolocation.getPosition();
    const positionLonLat = position && toLonLat(position, this.map.getView().getProjection());

    return {
      accuracy: this.geolocation.getAccuracy(),
      altitude: this.geolocation.getAltitude(),
      altitudeAccuracy: this.geolocation.getAltitudeAccuracy(),
      heading: this.geolocation.getHeading(),
      speed: this.geolocation.getSpeed(),
      position: position,
      positionLonLat: positionLonLat,
    };
  }

  public followPosition(val: boolean) {
    this._followPosition = val;
  }

  public onNextChange(handler: (ev: GeolocationChanged) => void) {
    const handleChange = (ev: GeolocationChanged) => {
      this.removeChangeListener(handleChange);
      handler(ev);
    };

    this.addChangeListener(handleChange);
  }

  public onNextAccuracyChange(handler: (ev: GeolocationChanged) => void) {
    const handleChange = (ev: GeolocationChanged) => {
      const hasAccuracy = typeof ev.position.accuracy !== 'undefined';
      const hasAccuracyGeometry = !!this.accuracyFeature.getGeometry();
      if (hasAccuracy && hasAccuracyGeometry) {
        this.removeChangeListener(handleChange);
        handler(ev);
      }
    };

    this.addChangeListener(handleChange);
  }

  public addErrorListener(listener: (ev: GeolocationError) => void) {
    this.eventEmitter.addEventListener('error', listener as EventListener);
  }

  public removeErrorListener(listener: (ev: GeolocationError) => void) {
    this.eventEmitter.removeEventListener('error', listener as EventListener);
  }

  public addChangeListener(listener: (ev: GeolocationChanged) => void) {
    this.eventEmitter.addEventListener('change', listener as EventListener);
  }

  public removeChangeListener(listener: (ev: GeolocationChanged) => void) {
    this.eventEmitter.removeEventListener('change', listener as EventListener);
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}
