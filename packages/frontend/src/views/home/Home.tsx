import React, { Component, ReactNode } from 'react';
import MainMap from './main-map/MainMap';
import { Map } from 'ol';
import { services } from '../../core/Services';
import LayerSelector from '../../components/layer-selector/LayerSelector';
import ProjectStatus from '../../components/project-status/ProjectStatus';
import { RootState } from '../../store';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '../../core/utils/Logger';
import BaseLayer from 'ol/layer/Base';
import './Home.scss';

const logger = Logger.get('Home.ts', 'debug');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

interface State {
  layers: BaseLayer[];
}

const mapStateToProps = (state: RootState) => ({
  project: state.project.current,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

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
              <button type={'button'} className={'btn btn-link menu-item'} onClick={this.newProject}>
                Nouveau projet
              </button>
              <div className={'menu-item'}>Ouvrir un projet</div>
              <div className={'menu-item'}>Enregistrer le projet</div>
              <div className={'menu-item'}>Exporter le projet</div>
            </div>
            <div className={'menu-group'}>
              <div className={'menu-item'}>Aide en ligne</div>
            </div>
          </div>
          <MainMap project={project} onMapCreated={this.onMapCreated} />
          <div className="right-menu">
            <div className={'menu-group'}>
              <ProjectStatus project={project} />
            </div>
            <div className={'menu-group'}>
              <div className={'menu-item'}>Rechercher sur la carte</div>
            </div>
            <div className={'menu-group'}>
              <div className={'menu-item'}>Outils de dessin</div>
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

  private onMapCreated = (map: Map) => {
    map.getLayers().on('propertychange', (ev) => {
      logger.debug('Map event: ', ev);
      const layers = this.services.map.getLayers(map);
      this.setState((st) => ({ ...st, layers }));
    });

    const layers = this.services.map.getLayers(map);
    this.setState((st) => ({ ...st, layers }));
  };

  private newProject = () => {
    this.services.project.newProject();
  };
}

export default connector(Home);
