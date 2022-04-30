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

import React, { Component } from 'react';
import { Logger } from '@abc-map/shared';
import { FileIO, InputResultType, InputType } from '../../../core/utils/FileIO';
import { ServiceProps, withServices } from '../../../core/withServices';
import { LayerChangeHandler } from '../../../core/geo/map/MapWrapper';
import VectorLayerSelector from '../vector-layer-selector/VectorLayerSelector';
import { DataSource, DataSourceType } from '../../../core/data/data-source/DataSource';
import { LayerDataSource } from '../../../core/data/data-source/LayerDataSource';
import { CsvDataSource } from '../../../core/data/data-source/CsvDataSource';
import { VectorLayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { CsvParsingError } from '../../../core/data/csv-parser/typings';
import Cls from './DataSourceSelector.module.scss';
import MessageLabel from '../../../components/message-label/MessageLabel';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { IconDefs } from '../../../components/icon/IconDefs';

export const logger = Logger.get('DataSourceSelector.tsx');

interface Props extends ServiceProps {
  value: DataSource | undefined;
  onSelected: (source: DataSource | undefined) => void;
}

interface State {
  display: Display;
  layerChangeHandler?: LayerChangeHandler;
  rows: number;
  errorAtLine: number;
  error: boolean;
}

enum Display {
  Layers = 'Layers',
  File = 'File',
}

const NoLineInformation = -1;
const NoRowsInformation = -1;

const t = prefixedTranslation('DataProcessingModules:DataSourceForm.');

class DataSourceSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { display: Display.Layers, error: false, errorAtLine: NoLineInformation, rows: NoRowsInformation };
  }

  public render() {
    const source = this.props.value;
    const display = this.state.display;
    const rows = this.state.rows;
    const errorAtLine = this.state.errorAtLine;
    const error = this.state.error;

    return (
      <div className={Cls.dataSourceSelector}>
        <div className={'d-flex mb-3'}>
          <div className={Cls.displayControl} onClick={() => this.handleDisplayClick(Display.Layers)} data-cy={'data-source-layer'}>
            <input type={'radio'} name={'display'} value={Display.Layers} checked={display === Display.Layers} readOnly />
            {t('Use_geometry_layer')}
          </div>
          <div className={Cls.displayControl} onClick={() => this.handleDisplayClick(Display.File)} data-cy={'data-source-file'}>
            <input type={'radio'} name={'display'} value={Display.File} checked={display === Display.File} readOnly />
            {t('Use_CSV_workbook')}
          </div>
        </div>

        {display === Display.Layers && (
          <div className={Cls.selectVectorLayer}>
            <VectorLayerSelector onSelected={this.handleLayerSelected} value={source?.getId()} />
          </div>
        )}

        {display === Display.File && (
          <div className={Cls.selectFile}>
            <div>
              {t('Select_file_on_computer')}:
              <ul className={'mt-2'}>
                <li>{t('Be_in_CSV_format')}</li>
                <li>{t('Have_header_row')}</li>
                <li>{t('Be_encoded_UTF8')}</li>
              </ul>
            </div>
            <div className={'d-flex'}>
              <button onClick={this.handleImportFile} className={'btn btn-primary'} data-cy={'data-source-import-file'}>
                {t('Choose_CSV_file')}
              </button>
            </div>
          </div>
        )}

        <>
          {rows >= 500 && <MessageLabel icon={IconDefs.faExclamationTriangle}>{t('This_source_contains_a_lot_of_data', { rows })}</MessageLabel>}
          {rows === 0 && <MessageLabel icon={IconDefs.faExclamationTriangle}>{t('Data_source_empty')}</MessageLabel>}
          {rows > 0 && <MessageLabel icon={IconDefs.faRocket}>{t('X_entries_will_be_processed', { rows })}</MessageLabel>}
        </>

        {error && <MessageLabel icon={IconDefs.faExclamationCircle}>{t('This_data_source_is_incorrect')}</MessageLabel>}
        {errorAtLine !== NoLineInformation && <MessageLabel icon={IconDefs.faChevronRight}>{t('Error_on_line_X', { errorAtLine })}</MessageLabel>}
      </div>
    );
  }

  public componentDidMount() {
    const datasource = this.props.value;

    // If a datasource is set, we switch to the proper display
    if (datasource) {
      const display = datasource?.getType() && datasource.getType() === DataSourceType.CsvFile ? Display.File : Display.Layers;
      this.setState({ display }, () => this.inspectSource(datasource).catch((err) => logger.error('Data source error: ', err)));
    }
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    const datasource = this.props.value;

    // If datasource was reset, we reset state
    if (datasource?.getId() !== prevProps.value?.getId()) {
      this.inspectSource(datasource).catch((err) => logger.error('Data source error: ', err));
    }
  }

  private handleDisplayClick = (display: Display) => {
    this.setState({ display, errorAtLine: NoLineInformation, error: false, rows: NoRowsInformation }, () => this.props.onSelected(undefined));
  };

  private handleLayerSelected = (layer: VectorLayerWrapper | undefined) => {
    if (!layer) {
      this.props.onSelected(undefined);
      return;
    }

    const source = new LayerDataSource(layer);
    this.inspectSource(source)
      .then(() => this.props.onSelected(source))
      .catch((err) => logger.error('Data source error: ', err));
  };

  private handleImportFile = () => {
    const { toasts } = this.props.services;

    FileIO.openInput(InputType.Single, '.csv')
      .then((res) => {
        if (res.type !== InputResultType.Confirmed) {
          return;
        }

        const source = new CsvDataSource(res.files[0]);
        return this.inspectSource(source)
          .then(() => this.props.onSelected(source))
          .catch((err) => logger.error('Data source error: ', err));
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  };

  private async inspectSource(source: DataSource | undefined): Promise<void> {
    if (!source) {
      this.setState({ rows: NoRowsInformation, error: false, errorAtLine: NoLineInformation });
      return;
    }

    // First we check that data source is valid
    return source
      .getRows()
      .then((rows) => this.setState({ rows: rows.length, error: false, errorAtLine: NoLineInformation }))
      .catch((err: CsvParsingError | Error) => {
        if ('row' in err && typeof err.row !== 'undefined') {
          this.setState({ error: true, errorAtLine: err.row });
        } else {
          this.setState({ error: true, errorAtLine: NoLineInformation });
        }
        return Promise.reject(err);
      });
  }
}

export default withTranslation()(withServices(DataSourceSelector));
