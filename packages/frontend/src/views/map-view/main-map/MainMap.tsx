import React, { Component, ReactNode } from 'react';
import { Map } from 'ol';
import { Logger } from '../../../core/utils/Logger';
import { services } from '../../../core/Services';
import { GeoJSON, GPX, IGC, KML, TopoJSON } from 'ol/format';
import { DragAndDrop, Interaction } from 'ol/interaction';
import { DragAndDropEvent } from 'ol/interaction/DragAndDrop';
import VectorSource from 'ol/source/Vector';
import FeatureFormat from 'ol/format/Feature';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { AbcProperties, LayerProperties } from '@abc-map/shared-entities';
import { DrawingTool, DrawingTools } from '../../../core/map/DrawingTools';
import BaseLayer from 'ol/layer/Base';
import { EventsKey } from 'ol/events';
import BaseEvent from 'ol/events/Event';
import _ from 'lodash';
import { ResizeObserverFactory } from '../../../core/utils/ResizeObserverFactory';
import { AbcStyle } from '../../../core/map/AbcStyle';
import './MainMap.scss';
import { Task } from '../../../core/history/Task';
import { HistoryKey } from '../../../core/history/HistoryKey';

export const logger = Logger.get('MainMap.ts', 'debug');

export declare type LayerChangedHandler = (layers: BaseLayer[]) => void;

interface Props {
  map: Map;
  currentStyle: AbcStyle;
  onLayersChanged?: LayerChangedHandler;
  drawingTool: DrawingTool;
}

interface State {
  dropData?: Interaction;
  drawInteractions: Interaction[];
  layers: BaseLayer[];
  activeLayer?: BaseLayer;
  layerChangedHandler?: EventsKey;
  sizeObserver?: ResizeObserver;
}

class MainMap extends Component<Props, State> {
  private services = services();
  private mapRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      layers: [],
      drawInteractions: [],
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
    const layersChanged = !this.services.geo.layersEquals(prevState.layers, this.state.layers);
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

    // TODO: create custom drag and drop in order to handle errors and support abm2 format
    const dropData = new DragAndDrop({
      formatConstructors: ([GPX, GeoJSON, IGC, KML, TopoJSON] as any) as FeatureFormat[], // OL typing is broken
    });
    dropData.on('addfeatures', this.onFeaturesDropped);
    map.addInteraction(dropData);

    // Here we trigger a component update when layers change for interactions
    map.getLayers().on('propertychange', this.onLayersChanged);

    // Here we listen to div support size change
    const resizeThrottled = _.throttle(() => map.updateSize(), 300, { trailing: true });
    const sizeObserver = ResizeObserverFactory.create(() => resizeThrottled());
    sizeObserver.observe(div);

    // First trigger for layer setup
    const layers = this.services.geo.getManagedLayers(map);
    this.props.onLayersChanged && this.props.onLayersChanged(layers);

    this.setState({ dropData, sizeObserver });
  }

  private cleanupMap() {
    const map = this.props.map;
    map.setTarget(undefined);
    if (this.state.dropData) {
      map.removeInteraction(this.state.dropData);
      this.state.dropData.dispose();
    }

    this.state.drawInteractions.forEach((inter) => {
      map.removeInteraction(inter);
      inter.dispose();
    });

    this.state.sizeObserver && this.state.sizeObserver.disconnect();
    map.getLayers().removeEventListener('propertychange', this.onLayersChanged);
  }

  private onLayersChanged = (ev: BaseEvent): boolean => {
    logger.debug('Layers event: ', ev);
    const map = this.props.map;
    const layers = this.services.geo.getManagedLayers(map);
    const activeLayer = this.services.geo.getActiveLayer(map);

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

    const layer = this.services.geo.newVectorLayer(source);
    layer.set(LayerProperties.Name, ev.file.name);

    map.addLayer(layer);
    map.getView().fit(source.getExtent());
  };

  private updateInteractions(tool: DrawingTool): void {
    const map = this.props.map;

    this.state.drawInteractions.forEach((inter) => map.removeInteraction(inter));

    const activeLayer = this.services.geo.getActiveVectorLayer(map);
    if (!activeLayer || tool.id === DrawingTools.None.id) {
      this.setState({ drawInteractions: [] });
      map.set(AbcProperties.CurrentTool, DrawingTools.None);
      return;
    }

    const getStyle = () => this.props.currentStyle;
    const registerTask = (task: Task) => this.services.history.register(HistoryKey.Map, task);
    const drawInter = tool.factory(activeLayer.getSource(), map, getStyle, registerTask);
    drawInter.forEach((inter) => map.addInteraction(inter));

    map.set(AbcProperties.CurrentTool, tool);
    this.setState({ drawInteractions: drawInter });

    logger.debug(`Activated tool '${tool.label}'`);
  }
}

export default MainMap;
