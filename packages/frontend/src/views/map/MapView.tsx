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
import Cls from './MapView.module.scss';

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

    return (
      <div className={Cls.mapView}>
        {/*Left menu*/}
        <div className={Cls.leftPanel}>
          <ProjectStatus project={this.props.project} />
          <Search map={this.state.map} />
          <ProjectControls />
          <HistoryControls historyKey={HistoryKey.Map} />
          <ImportData />
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
    this.state.map.addLayerChangeListener(this.onLayerChange);
    this.onLayerChange(); // We trigger manually the first event for setup
    this.state.map.unwrap().on('rendercomplete', this.onRenderComplete);
  }

  public componentWillUnmount() {
    this.state.map.removeLayerChangeListener(this.onLayerChange);
    this.state.map.unwrap().un('rendercomplete', this.onRenderComplete);
  }

  private onLayerChange = (): void => {
    logger.debug('Layers changed');
    const layers = this.state.map.getLayers();
    this.setState({ layers });
  };

  private onRenderComplete = () => {
    logger.debug('Map rendering complete');
  };
}

export default connector(withServices(MapView));
