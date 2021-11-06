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

import React, { ChangeEvent, Component, KeyboardEvent, ReactNode } from 'react';
import { AbcArtefact, Logger, Zipper } from '@abc-map/shared';
import ArtefactCard from './artefact-card/ArtefactCard';
import { ServiceProps, withServices } from '../../core/withServices';
import NavigationBar from './NavigationBar';
import { FileFormat, FileFormats } from '../../core/data/FileFormats';
import { FileIO } from '../../core/utils/FileIO';
import { pageSetup } from '../../core/utils/page-setup';
import { ImportStatus } from '../../core/data/DataService';
import { solvesInAtLeast } from '../../core/utils/solvesInAtLeast';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './DataStoreView.module.scss';

const logger = Logger.get('DataStoreView.tsx');

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

const t = prefixedTranslation('DataStoreView:');

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
              placeholder={t('France_regions_world')}
              className={'form-control mr-2'}
              data-cy={'data-store-search'}
            />
            <button onClick={this.handleSearch} className={'btn btn-primary'}>
              {t('Search')}
            </button>
          </div>
          <div className={Cls.navigationBar}>
            {!query && <NavigationBar activePage={activePage} offset={offset} total={total} pageSize={PageSize} onClick={this.handlePageChange} />}
          </div>
        </div>

        {/* Artefacts list */}

        {downloading && (
          <div className={Cls.loading}>
            <h4 className={'my-3 mx-2'}>{t('A_bit_of_patience')} ⌛</h4>
          </div>
        )}

        {!downloading && (
          <div className={Cls.artefactList}>
            {artefacts.map((art, i) => (
              <ArtefactCard artefact={art} key={i} onImport={this.handleImportArtefact} onDownload={this.handleDownloadArtefact} />
            ))}
            {!artefacts.length && query && <div>{t('No_result')}</div>}
          </div>
        )}
      </div>
    );
  }

  public componentDidMount() {
    pageSetup(t('Data_store'), t('Add_data_easily'));

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
    const { data } = this.props.services;
    const { limit, offset, searchQuery } = this.state;

    if (searchQuery) {
      data
        .searchArtefacts(searchQuery, limit, offset)
        .then((res) => this.setState({ artefacts: res.content, limit: res.limit, offset: res.offset, total: res.total, activePage: 1 }))
        .catch((err) => logger.error(err));
    } else {
      data
        .listArtefacts(limit, offset)
        .then((res) => this.setState({ artefacts: res.content, limit: res.limit, offset: res.offset, total: res.total }))
        .catch((err) => logger.error(err));
    }
  }

  private handleImportArtefact = (artefact: AbcArtefact) => {
    const { toasts, data } = this.props.services;

    this.setState({ downloading: true });
    solvesInAtLeast(data.importArtefact(artefact))
      .then((res) => {
        if (res.status === ImportStatus.Failed) {
          toasts.error(t('Formats_not_supported'));
          return;
        }
        if (res.status === ImportStatus.Canceled) {
          return;
        }

        toasts.info(t('Import_done'));
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      })
      .finally(() => this.setState({ downloading: false }));
  };

  private handleDownloadArtefact = (artefact: AbcArtefact) => {
    const { toasts, data } = this.props.services;

    this.setState({ downloading: true });
    solvesInAtLeast(data.downloadFilesFrom(artefact))
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

export default withTranslation()(withServices(DataStoreView));
