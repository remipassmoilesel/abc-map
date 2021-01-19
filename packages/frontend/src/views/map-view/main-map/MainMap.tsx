import React, { Component, ReactNode } from 'react';
import { Logger } from '../../../core/utils/Logger';
import { services } from '../../../core/Services';
import { GeoJSON, GPX, IGC, KML, TopoJSON } from 'ol/format';
import { DragAndDrop, Interaction } from 'ol/interaction';
import { DragAndDropEvent } from 'ol/interaction/DragAndDrop';
import VectorSource from 'ol/source/Vector';
import FeatureFormat from 'ol/format/Feature';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { LayerProperties } from '@abc-map/shared-entities';
import { ManagedMap } from '../../../core/geo/map/ManagedMap';
import './MainMap.scss';

export const logger = Logger.get('MainMap.ts', 'debug');

interface Props {
  map: ManagedMap;
}

interface State {
  dropData?: Interaction;
}

class MainMap extends Component<Props, State> {
  private services = services();
  private mapRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return <div ref={this.mapRef} data-cy={'main-map'} className="abc-main-map" />;
  }

  public componentDidMount() {
    const div = this.mapRef.current;
    if (!div) {
      return logger.error('Cannot mount map, div reference not ready');
    }

    this.initializeMap(div);
  }

  public componentWillUnmount() {
    this.cleanupMap();
  }

  private initializeMap(div: HTMLDivElement): void {
    logger.info('Initializing map');
    const map = this.props.map;

    // Attach to target
    map.setTarget(div);

    // Add drop data interaction
    // TODO: create custom drag and drop in order to handle errors and support abm2 format
    const dropData = new DragAndDrop({
      formatConstructors: ([GPX, GeoJSON, IGC, KML, TopoJSON] as any) as FeatureFormat[], // OL typing is broken
    });
    dropData.on('addfeatures', this.onFeaturesDropped);
    map.getInternal().addInteraction(dropData);

    this.setState({ dropData });
  }

  private cleanupMap() {
    const map = this.props.map;
    map.setTarget(undefined);
    if (this.state.dropData) {
      map.getInternal().removeInteraction(this.state.dropData);
      this.state.dropData.dispose();
    }
  }

  private onFeaturesDropped = (ev: DragAndDropEvent): void => {
    const map = this.props.map;
    if (!map) {
      return logger.error('Map is not ready');
    }

    const source = new VectorSource({
      features: ev.features as Feature<Geometry>[],
    });

    const layer = this.services.geo.newVectorLayer(source);
    layer.set(LayerProperties.Name, ev.file.name);

    map.addLayer(layer);
    map.setActiveLayer(layer);
    map.getInternal().getView().fit(source.getExtent());
  };
}

export default MainMap;
