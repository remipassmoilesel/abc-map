/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import React, { ChangeEvent, KeyboardEvent, Component, ReactNode } from 'react';
import { Logger } from '@abc-map/shared';
import { AbcArtefact, Zipper } from '@abc-map/shared';
import ArtefactCard from './artefact-card/ArtefactCard';
import { ServiceProps, withServices } from '../../core/withServices';
import NavigationBar from './NavigationBar';
import { HistoryKey } from '../../core/history/HistoryKey';
import { AddLayersTask } from '../../core/history/tasks/layers/AddLayersTask';
import { FileFormat, FileFormats } from '../../core/data/FileFormats';
import { FileIO } from '../../core/utils/FileIO';
import Cls from './DataStoreView.module.scss';

const logger = Logger.get('DataStore.tsx', 'info');

const PageSize = 6;

interface State {
  artefacts: AbcArtefact[];
  limit: number;
  offset: number;
  total: number;
  activePage: number;
  searchQuery: string;
  downloading: boolean;
}

class DataStoreView extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = {
      artefacts: [],
      limit: PageSize,
      offset: 0,
      total: 0,
      activePage: 1,
      searchQuery: '',
      downloading: false,
    };
  }

  public render(): ReactNode {
    const query = this.state.searchQuery;
    const artefacts = this.state.artefacts;
    const offset = this.state.offset;
    const total = this.state.total;
    const activePage = this.state.activePage;
    const downloading = this.state.downloading;

    return (
      <div className={Cls.datastore}>
        {/* Search and navigation bars */}

        <div className={Cls.header}>
          <div className={Cls.searchBar}>
            <input
              type={'text'}
              value={query}
              onChange={this.handleQueryChange}
              onKeyUp={this.handleKeyUp}
              placeholder={'France, régions, monde ...'}
              className={'form-control mr-2'}
              data-cy={'data-store-search'}
            />
            <button onClick={this.handleSearch} className={'btn btn-primary'}>
              Rechercher
            </button>
          </div>
          <div className={Cls.navigationBar}>
            {!query && <NavigationBar activePage={activePage} offset={offset} total={total} pageSize={PageSize} onClick={this.handlePageChange} />}
          </div>
        </div>

        {/* Artefacts list */}

        {downloading && <h4 className={'my-3 mx-2'}>Veuillez patienter pendant le téléchargement ...</h4>}

        {!downloading && (
          <div className={Cls.artefactList}>
            {artefacts.map((art, i) => (
              <ArtefactCard artefact={art} key={i} onImport={this.handleImportArtefact} onDownload={this.handleDownloadArtefact} />
            ))}
            {!artefacts.length && query && <div>Aucun résultat</div>}
          </div>
        )}
      </div>
    );
  }

  public componentDidMount() {
    this.loadArtefacts();
  }

  private handleQueryChange = (ev: ChangeEvent<HTMLInputElement>) => {
    // We set query and we reset offset and limit parameters
    this.setState({ searchQuery: ev.target.value, limit: PageSize, offset: 0 });
  };

  private handleKeyUp = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      this.handleSearch();
    }
  };

  private handlePageChange = (activePage: number, limit: number, offset: number) => {
    this.setState({ activePage, limit, offset }, () => this.loadArtefacts());
  };

  private handleSearch = () => {
    this.loadArtefacts();
  };

  private loadArtefacts() {
    const { dataStore } = this.props.services;
    const { limit, offset, searchQuery } = this.state;

    if (searchQuery) {
      dataStore
        .searchArtefacts(searchQuery, limit, offset)
        .then((res) => this.setState({ artefacts: res.content, limit: res.limit, offset: res.offset, total: res.total, activePage: 1 }))
        .catch((err) => logger.error(err));
    } else {
      dataStore
        .listArtefacts(limit, offset)
        .then((res) => this.setState({ artefacts: res.content, limit: res.limit, offset: res.offset, total: res.total }))
        .catch((err) => logger.error(err));
    }
  }

  private handleImportArtefact = (artefact: AbcArtefact) => {
    const { toasts, dataStore, geo, history } = this.props.services;

    this.setState({ downloading: true });
    dataStore
      .importArtefact(artefact)
      .then((res) => {
        if (!res.layers.length) {
          toasts.error('Ces fichiers ne sont pas supportés');
          return;
        }

        const map = geo.getMainMap();
        history.register(HistoryKey.Map, new AddLayersTask(map, res.layers));

        toasts.info('Import terminé !');
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      })
      .finally(() => this.setState({ downloading: false }));
  };

  private handleDownloadArtefact = (artefact: AbcArtefact) => {
    const { toasts, dataStore } = this.props.services;

    this.setState({ downloading: true });
    dataStore
      .downloadFilesFrom(artefact)
      .then(async (res) => {
        let content: Blob;
        if (res.length === 1 && FileFormat.ZIP === FileFormats.fromPath(res[0].path)) {
          content = res[0].content;
        } else {
          content = await Zipper.forFrontend().zipFiles(res);
        }

        FileIO.outputBlob(content, 'artefact.zip');
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      })
      .finally(() => this.setState({ downloading: false }));
  };
}

export default withServices(DataStoreView);
