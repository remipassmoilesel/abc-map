import React, { Component, ReactNode } from 'react';
import { Map } from 'ol';
import { Logger } from '../../../core/utils/Logger';
import { services } from '../../../core/Services';
import { GeoJSON, GPX, IGC, KML, TopoJSON } from 'ol/format';
import { DragAndDrop, Draw, Interaction } from 'ol/interaction';
import { DragAndDropEvent } from 'ol/interaction/DragAndDrop';
import VectorSource from 'ol/source/Vector';
import FeatureFormat from 'ol/format/Feature';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { AbcProperties, LayerProperties } from '../../../core/map/AbcProperties';
import { DrawingTool, DrawingTools } from '../../../core/map/DrawingTools';
import BaseLayer from 'ol/layer/Base';
import './MainMap.scss';

export const logger = Logger.get('MainMap.ts', 'debug');

export declare type LayerChangedHandler = (layers: BaseLayer[]) => void;

interface Props {
  onLayersChanged?: LayerChangedHandler;
  drawingTool: DrawingTool;
}

interface State {
  map?: Map;
  drawInteraction?: Interaction;
  layers: BaseLayer[];
  activeLayer?: BaseLayer;
}

class MainMap extends Component<Props, State> {
  private services = services();
  private mapRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      layers: [],
    };
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
  }

  public componentWillUnmount() {
    this.state.map?.dispose();
    this.services.map.setMainMap(undefined);
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    if (!this.state.map) {
      return;
    }

    // Warning: we can not compare layers properties here between them, because we work with references
    // so previous objects get updated
    const drawingToolChanged = prevProps.drawingTool !== this.props.drawingTool;
    const layersChanged = !this.services.map.layersEquals(prevState.layers, this.state.layers);
    const activeLayerChanged = this.state.activeLayer !== prevState.activeLayer;
    if (drawingToolChanged || layersChanged || activeLayerChanged) {
      this.updateInteractions(this.state.map, this.props.drawingTool);
    }
  }

  private initializeMap(currentDiv: HTMLDivElement): Map {
    logger.info('Initializing map');
    const map = this.services.map.newDefaultMap(currentDiv);

    // TODO: create custom drag and drop in order to handle errors and support abm2 format
    const dragAndDrop = new DragAndDrop({
      formatConstructors: ([GPX, GeoJSON, IGC, KML, TopoJSON] as any) as FeatureFormat[], // OL typing is broken
    });
    dragAndDrop.on('addfeatures', this.onFeaturesDropped);
    map.addInteraction(dragAndDrop);

    // Here we trigger a component update when layers change for interactions
    map.getLayers().on('propertychange', (ev) => {
      logger.debug('Layers event: ', ev);
      const layers = this.services.map.getManagedLayers(map);
      const activeLayer = this.services.map.getActiveLayer(map);
      this.setState({ layers, activeLayer });
      this.props.onLayersChanged && this.props.onLayersChanged(layers);
    });

    // First trigger for layer setup
    const layers = this.services.map.getManagedLayers(map);
    this.props.onLayersChanged && this.props.onLayersChanged(layers);
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

  private updateInteractions(map: Map, tool: DrawingTool): void {
    if (this.state.drawInteraction) {
      map.removeInteraction(this.state.drawInteraction);
    }

    const activeLayer = this.services.map.getActiveVectorLayer(map);
    if (!activeLayer || tool.geometryType === 'None') {
      this.setState({ drawInteraction: undefined });
      map.set(AbcProperties.CurrentTool, DrawingTools.None);
      return;
    }

    const drawInteraction = new Draw({
      source: activeLayer.getSource(),
      type: tool.geometryType,
    });
    map.addInteraction(drawInteraction);
    map.set(AbcProperties.CurrentTool, tool);
    this.setState({ drawInteraction });

    logger.debug(`Activated tool '${tool.label}'`);
  }
}

export default MainMap;
