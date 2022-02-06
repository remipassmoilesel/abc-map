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
import { resolveInAtLeast } from '../../core/utils/resolveInAtLeast';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { IconDefs } from '../../components/icon/IconDefs';
import { FaIcon } from '../../components/icon/FaIcon';
import Cls from './DataStoreView.module.scss';
import { InlineLoader } from '../../components/inline-loader/InlineLoader';

const logger = Logger.get('DataStoreView.tsx');

const PageSize = 9;

interface State {
  artefacts: AbcArtefact[];
  limit: number;
  offset: number;
  total: number;
  activePage: number;
  searchQuery: string;
  downloading: boolean;
  searching: boolean;
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
      searching: false,
    };
  }

  public render(): ReactNode {
    const query = this.state.searchQuery;
    const artefacts = this.state.artefacts;
    const total = this.state.total;
    const activePage = this.state.activePage;
    const numberOfPages = Math.ceil(total / PageSize);
    const downloading = this.state.downloading;
    const searching = this.state.searching;

    return (
      <div className={Cls.datastore}>
        <div className={Cls.header}>
          {/* Search bar */}
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

          {/* Clear search button */}
          {query && (
            <button className={'btn btn-outline-secondary mx-2'} onClick={this.clearSearch}>
              <FaIcon icon={IconDefs.faTimes} />
            </button>
          )}

          <InlineLoader size={2} active={searching} />
        </div>

        {/* Waiting screen */}
        {downloading && (
          <div className={Cls.loading}>
            <h4 className={'my-3 mx-2'}>{t('A_bit_of_patience')} ⌛</h4>
          </div>
        )}

        {/* Artefact list */}
        {!downloading && (
          <>
            <div className={Cls.artefactList}>
              {artefacts.map((art, i) => (
                <ArtefactCard artefact={art} key={i} onImport={this.handleImportArtefact} onDownload={this.handleDownloadArtefact} />
              ))}
              {!artefacts.length && query && <div className={'mx-3'}>{t('No_result')}</div>}
            </div>

            {/* Navigation bar */}
            {!query && !!artefacts.length && (
              <div className={Cls.navigationBar}>
                <NavigationBar activePage={activePage} numberOfPages={numberOfPages} onClick={this.handlePageChange} />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  public componentDidMount() {
    pageSetup(t('Data_store'), t('Add_data_easily'));

    this.listArtefacts();
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

  private clearSearch = () => {
    this.setState({ searchQuery: '' }, () => this.listArtefacts());
  };

  private handleSearch = () => {
    this.searchArtefacts();
  };

  private searchArtefacts() {
    const { data } = this.props.services;
    const { searchQuery } = this.state;

    if (!searchQuery) {
      return;
    }

    this.setState({ searching: true });

    resolveInAtLeast(data.searchArtefacts(searchQuery), 400)
      .then((res) => this.setState({ artefacts: res.content }))
      .catch((err) => logger.error(err))
      .finally(() => this.setState({ searching: false }));
  }

  private handlePageChange = (activePage: number) => {
    const offset = Math.round((activePage - 1) * PageSize);
    this.setState({ activePage, offset }, () => this.listArtefacts());
  };

  private listArtefacts() {
    const { data } = this.props.services;
    const { limit, offset } = this.state;

    data
      .listArtefacts(limit, offset)
      .then((res) => this.setState({ artefacts: res.content, limit: res.limit, offset: res.offset, total: res.total }))
      .catch((err) => logger.error(err));
  }

  private handleImportArtefact = (artefact: AbcArtefact) => {
    const { toasts, data } = this.props.services;

    this.setState({ downloading: true });
    resolveInAtLeast(data.importArtefact(artefact), 800)
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
    resolveInAtLeast(data.downloadFilesFrom(artefact), 800)
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
