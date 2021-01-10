import React, { ChangeEvent, Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { Logger } from '../../core/utils/Logger';
import { AbcArtefact } from '@abc-map/shared-entities';
import ArtefactCard from './ArtefactCard';
import './DataStore.scss';

const logger = Logger.get('DataStore.tsx', 'info');

interface State {
  artefacts: AbcArtefact[];
  searchQuery: string;
}

class DataStore extends Component<{}, State> {
  private services = services();

  constructor(props: {}) {
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
    if (!this.state.searchQuery) {
      this.listArtefacts();
    } else {
      this.services.dataStore
        .search(this.state.searchQuery)
        .then((artefacts) => {
          this.setState({ artefacts });
        })
        .catch((err) => {
          logger.error(err);
          this.services.ui.toasts.genericError();
        });
    }
  };

  private listArtefacts() {
    this.services.dataStore
      .list()
      .then((artefacts) => {
        this.setState({ artefacts });
      })
      .catch((err) => {
        logger.error(err);
        this.services.ui.toasts.genericError();
      });
  }
}

export default DataStore;
