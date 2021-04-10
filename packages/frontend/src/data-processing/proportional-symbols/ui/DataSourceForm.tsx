import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import DataSourceSelector from '../../../components/data-source-selector/DataSourceSelector';
import { DataRow, DataSource, getFields } from '../../../core/data/data-source/DataSource';
import DataTable from '../../../components/data-table/DataTable';
import { ServiceProps, withServices } from '../../../core/withServices';
import TipBubble from '../../../components/tip-bubble/TipBubble';
import { ProportionalSymbolsTips } from '@abc-map/documentation';

const logger = Logger.get('DataSourceForm.tsx');

export interface DataSourceFormValues {
  source: DataSource | undefined;
  sizeField: string;
  joinBy: string;
}

interface Props extends ServiceProps {
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
    const sizeField = this.props.values.sizeField;
    const joinBy = this.props.values.joinBy;
    const dataSamples = this.state.dataSamples;
    const dataFields = this.state.dataFields;

    return (
      <>
        <div className={'mb-4'}>
          <DataSourceSelector onSelected={this.handleDataSourceSelected} value={source} />
        </div>

        <div className={'form-line my-3'}>
          <label htmlFor="size-field">Champ de taille</label>
          <select className={'form-control'} id={'size-field'} value={sizeField} onChange={this.handleSourceFieldChange} data-cy={'size-field'}>
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
          <TipBubble id={ProportionalSymbolsTips.SizeField} />
        </div>

        <div className={'form-line my-3'}>
          <label htmlFor="data-join-by">Champ de jointure</label>
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
          <TipBubble id={ProportionalSymbolsTips.JoinBy} />
        </div>

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
    this.dataSourcePreview(dataSource);
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    const dataSource = this.props.values.source;
    if (dataSource?.getId() !== prevProps.values.source?.getId()) {
      this.dataSourcePreview(dataSource);
    }
  }

  private handleDataSourceSelected = (source: DataSource | undefined) => {
    this.dataSourcePreview(source).then(() => {
      const values: DataSourceFormValues = {
        ...this.props.values,
        source,
        sizeField: '',
      };
      this.props.onChange(values);
    });
  };

  private handleSourceFieldChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    const values: DataSourceFormValues = {
      ...this.props.values,
      sizeField: ev.target.value,
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
