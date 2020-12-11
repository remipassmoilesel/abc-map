import React, { Component, ReactNode } from 'react';
import { Map } from 'ol';
import { AbcProject } from '@abc-map/shared-entities';
import { Logger } from '../../../core/utils/Logger';
import { services } from '../../../core/Services';
import { GeoJSON, GPX, IGC, KML, TopoJSON } from 'ol/format';
import { DragAndDrop } from 'ol/interaction';
import { DragAndDropEvent } from 'ol/interaction/DragAndDrop';
import VectorSource from 'ol/source/Vector';
import FeatureFormat from 'ol/format/Feature';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { LayerProperties } from '../../../core/map/AbcProperties';
import './MainMap.scss';

const logger = Logger.get('MainMap.ts');

interface Props {
  project?: AbcProject;
  onMapCreated?: (map: Map) => void;
}

interface State {
  map?: Map;
}

class MainMap extends Component<Props, State> {
  private services = services();
  private mapRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return <div ref={this.mapRef} className="abc-main-map" />;
  }

  public componentDidMount() {
    const currentDiv = this.mapRef.current;
    if (!currentDiv) {
      return logger.error('Cannot mount map, div reference not ready');
    }

    const map = this.initializeMap(currentDiv);

    this.setState({ map });
    this.services.map.setMainMap(map);
    this.props.onMapCreated && this.props.onMapCreated(map);
  }

  public componentWillUnmount() {
    this.state.map?.dispose();
    this.services.map.setMainMap(undefined);
  }

  private initializeMap(currentDiv: HTMLDivElement): Map {
    const map = this.services.map.newDefaultMap(currentDiv);

    // TODO: create custom drag and drop in order to handle errors
    const dragAndDrop = new DragAndDrop({
      // FIXME: OL typing is broken
      formatConstructors: ([GPX, GeoJSON, IGC, KML, TopoJSON] as any) as FeatureFormat[],
    });
    dragAndDrop.on('addfeatures', this.onFeaturesDropped);

    map.addInteraction(dragAndDrop);
    return map;
  }

  private onFeaturesDropped = (ev: DragAndDropEvent): void => {
    const map = this.state.map;
    if (!map) {
      return logger.error('Map is not ready');
    }

    const source = new VectorSource({
      features: ev.features as Feature<Geometry>[],
    });

    const layer = this.services.map.newVectorLayer(source);
    layer.set(LayerProperties.Name, ev.file.name);

    map.addLayer(layer);
    map.getView().fit(source.getExtent());
  };
}

export default MainMap;
