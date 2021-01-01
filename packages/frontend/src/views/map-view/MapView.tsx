import React, { Component, ReactNode } from 'react';
import MainMap from './main-map/MainMap';
import { services } from '../../core/Services';
import LayerSelector from './layer-selector/LayerSelector';
import ProjectStatus from './project-status/ProjectStatus';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '../../core/utils/Logger';
import BaseLayer from 'ol/layer/Base';
import ProjectControls from './project-controls/ProjectControls';
import ToolSelector from './tool-selector/ToolSelector';
import StyleSelector from './style-selector/StyleSelector';
import HistoryControls from '../../components/history-controls/HistoryControls';
import { HistoryKey } from '../../core/history/HistoryKey';
import { ManagedMap } from '../../core/map/ManagedMap';
import { MainState } from '../../core/store/reducer';
import './MapView.scss';

const logger = Logger.get('MapView.tsx', 'info');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

interface State {
  layers: BaseLayer[];
  map: ManagedMap;
}

const mapStateToProps = (state: MainState) => ({
  project: state.project.metadata,
  tool: state.map.tool,
  currentStyle: state.map.currentStyle,
  userStatus: state.authentication.userStatus,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

/**
 * Map layers are passed as props from here in order to update components "in a react way".
 */
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
    return (
      <div className="abc-map-view">
        {/*Left menu*/}
        <div className="left-panel">
          <ProjectStatus project={this.props.project} />
          <ProjectControls />
          <div className={'control-block'}>
            <div className={'control-item'}>
              <button onClick={this.importFile} type={'button'} className={'btn btn-link'}>
                <i className={'fa fa-table mr-2'} /> Importer des données
              </button>
            </div>
            <div>
              <i>Vous pouvez importer des données en sélectionnant un fichier et en le déposant sur la carte</i>
            </div>
          </div>
          <HistoryControls historyKey={HistoryKey.Map} />
        </div>

        {/*Main map*/}
        <MainMap map={this.state.map} />

        {/*Right menu*/}
        <div className="right-panel">
          <div className={'control-block'}>
            <div className={'control-item'}>
              Rechercher sur la carte
              <input type={'text'} className={'mt-2'} onKeyPress={this.onSearch} />
            </div>
          </div>

          <LayerSelector map={this.state.map} layers={this.state.layers} />
          <ToolSelector />
          <StyleSelector />
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.state.map.addLayerChangeListener(this.onLayerChange);
    this.onLayerChange(); // We trigger manually the first event for setup
  }

  public componentWillUnmount() {
    this.state.map.removeLayerChangeListener(this.onLayerChange);
  }

  private onLayerChange = (): boolean => {
    const layers = this.state.map.getLayers();
    this.setState({ layers });
    return true;
  };

  private importFile = () => {
    this.services.toasts.featureNotReady();
  };

  private onSearch = () => {
    this.services.toasts.featureNotReady();
  };
}

export default connector(MapView);
