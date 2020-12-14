import React, { Component, ReactNode } from 'react';
import MainMap from './main-map/MainMap';
import { services } from '../../core/Services';
import LayerSelector from '../../components/layer-selector/LayerSelector';
import ProjectStatus from '../../components/project-status/ProjectStatus';
import { RootState } from '../../core/store';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '../../core/utils/Logger';
import BaseLayer from 'ol/layer/Base';
import ProjectControls from '../../components/project-controls/ProjectControls';
import DrawingToolSelector from '../../components/drawing-tool-selector/DrawingToolSelector';
import './MapView.scss';

const logger = Logger.get('MapView.tsx', 'info');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

interface State {
  layers: BaseLayer[];
}

const mapStateToProps = (state: RootState) => ({
  project: state.project.current,
  map: state.map.mainMap,
  drawingTool: state.map.drawingTool,
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
    };
  }

  public render(): ReactNode {
    const project = this.props.project;
    return (
      <div className="abc-map-view">
        <div className="left-menu">
          <div className={'menu-group'}>
            <ProjectControls project={this.props.project} map={this.props.map} />
          </div>
          <div className={'menu-group'}>
            <div className={'menu-item'}>Aide en ligne</div>
          </div>
        </div>
        <MainMap map={this.props.map} drawingTool={this.props.drawingTool} onLayersChanged={this.onLayerChange} />
        <div className="right-menu">
          <div className={'menu-group'}>
            <ProjectStatus project={project} />
          </div>
          <div className={'menu-group'}>
            <div className={'menu-item'}>Rechercher sur la carte</div>
          </div>
          <div className={'menu-group'}>
            <div className={'menu-item'}>
              <DrawingToolSelector layers={this.state.layers} />
            </div>
            <div className={'menu-item'}>
              <LayerSelector map={this.props.map} layers={this.state.layers} />
            </div>
          </div>
          <div className={'menu-group'}>
            <div className={'menu-item'}>Annuler</div>
            <div className={'menu-item'}>Rétablir</div>
          </div>
        </div>
      </div>
    );
  }

  private onLayerChange = (layers: BaseLayer[]) => {
    this.setState({ layers });
  };
}

export default connector(MapView);
