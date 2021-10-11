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

import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Logger } from '@abc-map/shared';
import DataSourceSelector from './DataSourceSelector';
import { DataRow, DataSource, getFields } from '../../../core/data/data-source/DataSource';
import DataTable from '../../../components/data-table/DataTable';
import { ServiceProps, withServices } from '../../../core/withServices';
import TipBubble from '../../../components/tip-bubble/TipBubble';
import { DataProcessingTips } from '@abc-map/user-documentation';
import FormLine from '../form-line/FormLine';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';

const logger = Logger.get('DataSourceForm.tsx');

export interface DataSourceFormValues {
  source: DataSource | undefined;
  valueField?: string;
  joinBy?: string;
}

interface Props extends ServiceProps {
  valuesFieldLabel: string;
  valuesFieldTip: string;
  values: DataSourceFormValues;
  onChange: (params: DataSourceFormValues) => void;
}

interface State {
  dataFields: string[];
  dataSamples: DataRow[];
}

const t = prefixedTranslation('DataProcessingModules:DataSourceForm.');

class DataSourceForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      dataFields: [],
      dataSamples: [],
    };
  }

  public render(): ReactNode {
    const source = this.props.values.source;
    const valueField = this.props.values.valueField;
    const joinBy = this.props.values.joinBy;
    const valuesFieldLabel = this.props.valuesFieldLabel;
    const valuesFieldTip = this.props.valuesFieldTip;
    const dataSamples = this.state.dataSamples;
    const dataFields = this.state.dataFields;

    return (
      <>
        <div className={'mb-4'}>
          <DataSourceSelector value={source} onSelected={this.handleDataSourceSelected} />
        </div>

        <FormLine>
          <label htmlFor="value-field" className={'flex-grow-1'}>
            {valuesFieldLabel}
          </label>

          <TipBubble id={valuesFieldTip} />
          <select
            value={valueField}
            onChange={this.handleSourceFieldChange}
            className={'form-control'}
            id={'value-field'}
            data-testid={'value-field'}
            data-cy={'value-field'}
          >
            {!dataFields.length && <option>{t('Select_data_source')}</option>}
            {!!dataFields.length &&
              [<option key={0}>{t('Select_field')}</option>].concat(
                dataFields.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))
              )}
          </select>
        </FormLine>

        <FormLine>
          <label htmlFor="data-join-by" className={'flex-grow-1'}>
            {t('Join_geometries_with')}:
          </label>

          <TipBubble id={DataProcessingTips.JoinBy} />
          <select
            value={joinBy}
            onChange={this.handleJoinByChange}
            className={'form-control'}
            id={'data-join-by'}
            data-testid={'data-join-by'}
            data-cy={'data-join-by'}
          >
            {!dataFields.length && <option>{t('Select_data_source')}</option>}
            {!!dataFields.length &&
              [<option key={0}>{t('Select_field')}</option>].concat(
                dataFields.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))
              )}
          </select>
        </FormLine>

        {!!dataSamples.length && (
          <>
            <div className={'my-3'}>{t('Data_samples')}</div>
            <DataTable rows={dataSamples} />
          </>
        )}
      </>
    );
  }

  public componentDidMount() {
    const dataSource = this.props.values.source;
    this.dataSourcePreview(dataSource).catch((err) => logger.error('Data preview error: ', err));
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    const dataSource = this.props.values.source;
    if (dataSource?.getId() !== prevProps.values.source?.getId()) {
      this.dataSourcePreview(dataSource).catch((err) => logger.error('Data preview error: ', err));
    }
  }

  private handleDataSourceSelected = (source: DataSource | undefined) => {
    this.dataSourcePreview(source)
      .then(() => {
        const values: DataSourceFormValues = {
          ...this.props.values,
          source,
          valueField: '',
        };
        this.props.onChange(values);
      })
      .catch((err) => logger.error('Preview error: ', err));
  };

  private handleSourceFieldChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    const values: DataSourceFormValues = {
      ...this.props.values,
      valueField: ev.target.value,
    };

    this.props.onChange(values);
  };

  private handleJoinByChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    const values: DataSourceFormValues = {
      ...this.props.values,
      joinBy: ev.target.value,
    };

    this.props.onChange(values);
  };

  private dataSourcePreview(source: DataSource | undefined): Promise<void> {
    const { toasts } = this.props.services;

    if (!source) {
      this.setState({ dataFields: [], dataSamples: [] });
      return Promise.resolve();
    }

    return source
      .getRows()
      .then((res) => {
        if (!res.length) {
          this.setState({ dataFields: [], dataSamples: [] });
          return;
        }

        const dataFields = getFields(res[0]);
        const dataSamples = res.slice(0, 3);
        this.setState({ dataFields, dataSamples });
      })
      .catch((err) => {
        logger.error(err);
        this.setState({ dataFields: [], dataSamples: [] });
        toasts.genericError();
      });
  }
}

export default withTranslation()(withServices(DataSourceForm));
