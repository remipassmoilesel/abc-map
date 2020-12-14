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
import { EventsKey } from 'ol/events';
import BaseEvent from 'ol/events/Event';
import './MainMap.scss';

export const logger = Logger.get('MainMap.ts', 'debug');

export declare type LayerChangedHandler = (layers: BaseLayer[]) => void;

interface Props {
  map: Map;
  onLayersChanged?: LayerChangedHandler;
  drawingTool: DrawingTool;
}

interface State {
  dropData?: Interaction;
  draw?: Interaction;
  layers: BaseLayer[];
  activeLayer?: BaseLayer;
  layerChangedHandler?: EventsKey;
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
    const div = this.mapRef.current;
    if (!div) {
      return logger.error('Cannot mount map, div reference not ready');
    }

    this.initializeMap(div);
    this.updateInteractions(this.props.drawingTool);
  }

  public componentWillUnmount() {
    this.cleanupMap();
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    // Warning: we can not compare layers properties here between them, because we work with references
    // so previous objects get updated
    const drawingToolChanged = prevProps.drawingTool !== this.props.drawingTool;
    const layersChanged = !this.services.map.layersEquals(prevState.layers, this.state.layers);
    const activeLayerChanged = this.state.activeLayer !== prevState.activeLayer;
    if (drawingToolChanged || layersChanged || activeLayerChanged) {
      this.updateInteractions(this.props.drawingTool);
    }
  }

  private initializeMap(div: HTMLDivElement): void {
    logger.info('Initializing map');
    const map = this.props.map;

    // Attach to target
    map.setTarget(div);

    // Add default layer if needed
    if (!map.getLayers().getLength()) {
      const layer = this.services.map.newOsmLayer();
      map.addLayer(layer);
      this.services.map.setActiveLayer(map, layer);
    }

    // TODO: create custom drag and drop in order to handle errors and support abm2 format
    const dropData = new DragAndDrop({
      formatConstructors: ([GPX, GeoJSON, IGC, KML, TopoJSON] as any) as FeatureFormat[], // OL typing is broken
    });
    dropData.on('addfeatures', this.onFeaturesDropped);
    map.addInteraction(dropData);
    this.setState({ dropData: dropData });

    // Here we trigger a component update when layers change for interactions
    map.getLayers().on('propertychange', this.onLayersChanged);

    // First trigger for layer setup
    const layers = this.services.map.getManagedLayers(map);
    this.props.onLayersChanged && this.props.onLayersChanged(layers);
  }

  private cleanupMap() {
    const map = this.props.map;
    map.setTarget(undefined);
    this.state.dropData && map.removeInteraction(this.state.dropData);
    this.state.draw && map.removeInteraction(this.state.draw);
    map.getLayers().removeEventListener('propertychange', this.onLayersChanged);
  }

  private onLayersChanged = (ev: BaseEvent): boolean => {
    logger.debug('Layers event: ', ev);
    const map = this.props.map;
    const layers = this.services.map.getManagedLayers(map);
    const activeLayer = this.services.map.getActiveLayer(map);

    this.setState({ layers, activeLayer });

    this.props.onLayersChanged && this.props.onLayersChanged(layers);
    return true;
  };

  private onFeaturesDropped = (ev: DragAndDropEvent): void => {
    const map = this.props.map;
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

  private updateInteractions(tool: DrawingTool): void {
    const map = this.props.map;

    if (this.state.draw) {
      map.removeInteraction(this.state.draw);
    }

    const activeLayer = this.services.map.getActiveVectorLayer(map);
    if (!activeLayer || tool.geometryType === 'None') {
      this.setState({ draw: undefined });
      map.set(AbcProperties.CurrentTool, DrawingTools.None);
      return;
    }

    const draw = new Draw({
      source: activeLayer.getSource(),
      type: tool.geometryType,
    });
    map.addInteraction(draw);
    map.set(AbcProperties.CurrentTool, tool);
    this.setState({ draw });

    logger.debug(`Activated tool '${tool.label}'`);
  }
}

export default MainMap;
