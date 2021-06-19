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
import DataSourceSelector from '../../components/data-source-selector/DataSourceSelector';
import { DataRow, DataSource, getFields } from '../../core/data/data-source/DataSource';
import DataTable from '../../components/data-table/DataTable';
import { ServiceProps, withServices } from '../../core/withServices';
import TipBubble from '../../components/tip-bubble/TipBubble';
import { DataProcessingTips } from '@abc-map/user-documentation';
import FormLine from './form-line/FormLine';

const logger = Logger.get('DataSourceForm.tsx');

export interface DataSourceFormValues {
  source: DataSource | undefined;
  valueField: string;
  joinBy: string;
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
          <DataSourceSelector onSelected={this.handleDataSourceSelected} value={source} />
        </div>

        <FormLine>
          <label htmlFor="value-field" className={'flex-grow-1'}>
            {valuesFieldLabel}
          </label>

          <TipBubble id={valuesFieldTip} />
          <select className={'form-control'} id={'value-field'} value={valueField} onChange={this.handleSourceFieldChange} data-cy={'value-field'}>
            {!dataFields.length && <option>Sélectionnez une source de données</option>}
            {!!dataFields.length &&
              [<option key={0}>Sélectionnez un champ</option>].concat(
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
            Jointure avec les géométries par:
          </label>

          <TipBubble id={DataProcessingTips.JoinBy} />
          <select className={'form-control'} id={'data-join-by'} value={joinBy} onChange={this.handleJoinByChange} data-cy={'data-joinby-field'}>
            {!dataFields.length && <option>Sélectionnez une source de données</option>}
            {!!dataFields.length &&
              [<option key={0}>Sélectionnez un champ</option>].concat(
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
            <div className={'my-3'}>Échantillon</div>
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
    this.dataSourcePreview(source).then(() => {
      const values: DataSourceFormValues = {
        ...this.props.values,
        source,
        valueField: '',
      };
      this.props.onChange(values);
    });
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

export default withServices(DataSourceForm);
