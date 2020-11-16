import React, { Component, ReactNode } from 'react';
import MainMap from './map/MainMap';
import { services } from '../../core/Services';
import LayerSelector from '../../components/layer-selector/LayerSelector';
import ProjectStatus from '../../components/project-status/ProjectStatus';
import { RootState } from '../../store';
import { connect, ConnectedProps } from 'react-redux';
import './Home.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

const mapStateToProps = (state: RootState) => ({
  project: state.project.current,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

class Home extends Component<Props, {}> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
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
          <MainMap />
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
                <LayerSelector project={project} />
              </div>
            </div>
            <div className={'menu-group'}>
              <div className={'menu-item'}>Annuler</div>
              <div className={'menu-item'}>Rétablir</div>
            </div>
          </div>
        </div>
        <div className="taskbar">Tasks in progress ...</div>
      </div>
    );
  }

  private newProject = () => {
    this.services.project.newProject();
  };
}

export default connector(Home);
