import React, { Component, ReactNode } from 'react';
import MainMap from './main-map/MainMap';
import LayerControls from './layer-controls/LayerControls';
import ProjectStatus from './project-status/ProjectStatus';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '@abc-map/frontend-shared';
import ProjectControls from './project-controls/ProjectControls';
import ToolSelector from './tool-selector/ToolSelector';
import HistoryControls from '../../components/history-controls/HistoryControls';
import { HistoryKey } from '../../core/history/HistoryKey';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { MainState } from '../../core/store/reducer';
import { LayerWrapper } from '../../core/geo/layers/LayerWrapper';
import Search from './search/Search';
import ImportData from './import-data/ImportData';
import { ServiceProps, withServices } from '../../core/withServices';
import * as _ from 'lodash';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import Cls from './MapView.module.scss';
import { toLonLat } from 'ol/proj';
import CursorPosition from './cursor-position/CursorPosition';
import { Coordinate } from 'ol/coordinate';

const logger = Logger.get('MapView.tsx', 'debug');

interface State {
  layers: LayerWrapper[];
  map: MapWrapper;
  position?: Coordinate;
}

const mapStateToProps = (state: MainState) => ({
  project: state.project.metadata,
  tool: state.map.tool,
  currentStyle: state.map.currentStyle,
  userStatus: state.authentication.userStatus,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

class MapView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      layers: [],
      map: this.props.services.geo.getMainMap(),
    };
  }

  public render(): ReactNode {
    const activeLayer = this.state.layers.find((lay) => lay.isActive());
    const position = this.state.position;

    return (
      <div className={Cls.mapView}>
        {/*Left menu*/}
        <div className={Cls.leftPanel}>
          <ProjectStatus project={this.props.project} />
          <Search map={this.state.map} />
          <ProjectControls />
          <HistoryControls historyKey={HistoryKey.Map} />
          <ImportData />
          <CursorPosition position={position} />
        </div>

        {/*Main map*/}
        <MainMap map={this.state.map} />

        {/*Right menu*/}
        <div className={Cls.rightPanel}>
          <LayerControls layers={this.state.layers} />
          <ToolSelector activeLayer={activeLayer} />
        </div>
      </div>
    );
  }

  public componentDidMount() {
    const map = this.state.map;

    map.addLayerChangeListener(this.handleLayerChange);
    this.handleLayerChange(); // We trigger manually the first event for setup

    map.unwrap().on('rendercomplete', this.handleRenderComplete);
    map.unwrap().on('pointermove', this.handlePointerMove);
  }

  public componentWillUnmount() {
    const map = this.state.map;

    map.removeLayerChangeListener(this.handleLayerChange);
    map.unwrap().un('rendercomplete', this.handleRenderComplete);
    map.unwrap().un('pointermove', this.handlePointerMove);
  }

  private handleLayerChange = (): void => {
    logger.debug('Layers changed');
    const layers = this.state.map.getLayers();
    this.setState({ layers });
  };

  private handleRenderComplete = () => {
    logger.debug('Map rendering complete');
  };

  private handlePointerMove = _.throttle(
    (ev: MapBrowserEvent) => {
      const position = toLonLat(ev.coordinate, ev.map.getView().getProjection());
      this.setState({ position });
    },
    200,
    { trailing: true }
  );
}

export default connector(withServices(MapView));
