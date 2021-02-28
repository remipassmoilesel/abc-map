import React, { Component, ReactNode } from 'react';
import MainMap from './main-map/MainMap';
import { services } from '../../core/Services';
import LayerSelector from './layer-selector/LayerSelector';
import ProjectStatus from './project-status/ProjectStatus';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '../../core/utils/Logger';
import ProjectControls from './project-controls/ProjectControls';
import ToolSelector from './tool-selector/ToolSelector';
import HistoryControls from '../../components/history-controls/HistoryControls';
import { HistoryKey } from '../../core/history/HistoryKey';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { MainState } from '../../core/store/reducer';
import { LayerWrapper } from '../../core/geo/layers/LayerWrapper';
import Search from './search/Search';
import Cls from './MapView.module.scss';
import ImportData from './import-data/ImportData';

const logger = Logger.get('MapView.tsx', 'debug');

interface State {
  layers: LayerWrapper[];
  map: MapWrapper;
}

const mapStateToProps = (state: MainState) => ({
  project: state.project.metadata,
  tool: state.map.tool,
  currentStyle: state.map.currentStyle,
  userStatus: state.authentication.userStatus,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

class MapView extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {
      layers: [],
      map: this.services.geo.getMainMap(),
    };
  }

  public render(): ReactNode {
    const activeLayer = this.state.layers.find((lay) => lay.isActive());

    return (
      <div className={Cls.mapView}>
        {/*Left menu*/}
        <div className={Cls.leftPanel}>
          <ProjectStatus project={this.props.project} />
          <Search map={this.state.map} />
          <ProjectControls />
          <ImportData />
        </div>

        {/*Main map*/}
        <MainMap map={this.state.map} />

        {/*Right menu*/}
        <div className={Cls.rightPanel}>
          <HistoryControls historyKey={HistoryKey.Map} />
          <LayerSelector layers={this.state.layers} />
          <ToolSelector activeLayer={activeLayer} />
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.state.map.addLayerChangeListener(this.onLayerChange);
    this.onLayerChange(); // We trigger manually the first event for setup
    this.state.map.unwrap().on('rendercomplete', this.onRenderComplete);
  }

  public componentWillUnmount() {
    this.state.map.removeLayerChangeListener(this.onLayerChange);
    this.state.map.unwrap().un('rendercomplete', this.onRenderComplete);
  }

  private onLayerChange = (): boolean => {
    logger.debug('Layers changed');
    const layers = this.state.map.getLayers();
    this.setState({ layers });
    return true;
  };

  private onRenderComplete = () => {
    logger.debug('Map rendering complete');
  };
}

export default connector(MapView);
