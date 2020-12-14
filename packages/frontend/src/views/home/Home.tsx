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
import './Home.scss';

const logger = Logger.get('Home.ts', 'info');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

interface State {
  layers: BaseLayer[];
}

const mapStateToProps = (state: RootState) => ({
  project: state.project.current,
  drawingTool: state.map.drawingTool,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

/**
 * Map layers are passed as props from here in order to update components "in a react way".
 */
class Home extends Component<Props, State> {
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
      <div className="abc-home">
        <div className="content">
          <div className="left-menu">
            <h3 className={'text-center mt-2'}>Abc-Map</h3>
            <div className={'menu-group'}>
              <ProjectControls />
            </div>
            <div className={'menu-group'}>
              <div className={'menu-item'}>Aide en ligne</div>
            </div>
          </div>
          <MainMap drawingTool={this.props.drawingTool} onLayersChanged={this.onLayerChange} />
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
                <LayerSelector layers={this.state.layers} />
              </div>
            </div>
            <div className={'menu-group'}>
              <div className={'menu-item'}>Annuler</div>
              <div className={'menu-item'}>Rétablir</div>
            </div>
          </div>
        </div>
        <div className="taskbar">Tâches en cours ...</div>
      </div>
    );
  }

  public componentDidMount() {
    window.addEventListener('beforeunload', this.warnBeforeUnload);
    window.addEventListener('unload', this.warnBeforeUnload);
  }

  public componentWillUnmount() {
    window.removeEventListener('beforeunload', this.warnBeforeUnload);
    window.removeEventListener('unload', this.warnBeforeUnload);
  }

  /**
   * Display warning if tab reload or is closing, in order to prevent modifications loss
   * @param ev
   * @private
   */
  private warnBeforeUnload = (ev: BeforeUnloadEvent | undefined): string => {
    const message = 'Les modifications seront perdues, êtes vous sûr ?';
    if (ev) {
      ev.returnValue = message;
    }
    return message;
  };

  private onLayerChange = (layers: BaseLayer[]) => {
    this.setState({ layers });
  };
}

export default connector(Home);
