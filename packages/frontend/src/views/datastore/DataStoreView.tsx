import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import { AbcArtefact } from '@abc-map/shared-entities';
import ArtefactCard from './artefact-card/ArtefactCard';
import { ServiceProps, withServices } from '../../core/withServices';
import './DataStoreView.scss';

const logger = Logger.get('DataStore.tsx', 'info');

interface State {
  artefacts: AbcArtefact[];
  searchQuery: string;
}

class DataStoreView extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = {
      artefacts: [],
      searchQuery: '',
    };
  }

  public render(): ReactNode {
    return (
      <div className={'abc-datastore'}>
        <h1>Catalogue de données</h1>
        <p>Sur cette page vous pouvez sélectionner et importer des données dans votre carte.</p>
        <p>Rappelez-vous: vous pouvez aussi importer des donnés en sélectionnant un fichier et en le déposant sur la carte !</p>
        <div className={'mb-2 d-flex flex-row'}>
          <input type={'text'} value={this.state.searchQuery} onChange={this.onQueryChange} className={'form-control mr-2'} />
          <button onClick={this.onSearch} className={'btn btn-primary'}>
            Rechercher
          </button>
        </div>
        {this.state.artefacts.map((art, i) => (
          <ArtefactCard artefact={art} key={i} />
        ))}
      </div>
    );
  }

  public componentDidMount() {
    this.listArtefacts();
  }

  private onQueryChange = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: ev.target.value });
  };

  private onSearch = () => {
    const { toasts, data } = this.props.services;

    if (!this.state.searchQuery) {
      this.listArtefacts();
    } else {
      data
        .searchArtefacts(this.state.searchQuery)
        .then((artefacts) => {
          this.setState({ artefacts });
        })
        .catch((err) => {
          logger.error(err);
          toasts.genericError();
        });
    }
  };

  private listArtefacts() {
    const { toasts, data } = this.props.services;

    data
      .listArtefacts()
      .then((artefacts) => {
        this.setState({ artefacts });
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  }
}

export default withServices(DataStoreView);
