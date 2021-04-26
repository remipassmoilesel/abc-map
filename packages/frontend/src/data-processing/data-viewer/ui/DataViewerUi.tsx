import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import { DataRow } from '../../../core/data/data-source/DataSource';
import VectorLayerSelector from '../../../components/vector-layer-selector/VectorLayerSelector';
import { VectorLayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import DataTable from '../../../components/data-table/DataTable';
import { LayerDataSource } from '../../../core/data/data-source/LayerDataSource';
import { ServiceProps, withServices } from '../../../core/withServices';
import { CsvParser } from '../../../core/data/csv-parser/CsvParser';
import { FileIO } from '../../../core/utils/FileIO';
import Cls from './DataViewerUi.module.scss';

const logger = Logger.get('DataViewerUi.tsx');

interface Props extends ServiceProps {
  initialValue?: string;
  onChange: (layerId?: string) => void;
}

interface State {
  data: DataRow[];
  layer?: VectorLayerWrapper;
  disableDownload: boolean;
}

class DataViewerUi extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: [],
      disableDownload: true,
    };
  }

  public render(): ReactNode {
    const data = this.state.data;
    const layer = this.state.layer;
    const disableDownload = this.state.disableDownload;

    return (
      <div className={Cls.panel}>
        <div className={'d-flex flex-column'}>
          <div className={'my-3'}>Sélectionnez une couche pour visualiser ses données.</div>
          <div className={'d-flex flex-row'}>
            <div className={Cls.vectorSelection}>
              <VectorLayerSelector value={layer?.getId()} onSelected={this.handleSelected} data-cy={'layer-selector'} />
            </div>
            <button className={'mx-3 btn btn-secondary'} disabled={disableDownload} onClick={this.handleDownload} data-cy={'download'}>
              Télécharger au format CSV
            </button>
          </div>
        </div>
        {!!data.length && (
          <>
            <div className={'my-3'}>
              <b>{data.length}</b> entrées affichées
            </div>
            <DataTable rows={data} className={Cls.dataTable} data-cy={'data-table'} />
          </>
        )}
        {layer && !data.length && <div className={'my-3'}>Pas de données à afficher</div>}
      </div>
    );
  }

  public componentDidMount() {
    const layerId = this.props.initialValue;
    if (layerId) {
      const map = this.props.services.geo.getMainMap();
      const layer = map.getLayers().find((lay) => lay.getId() === layerId);
      layer && layer.isVector() && this.showData(layer);
    }
  }

  private handleSelected = (layer: VectorLayerWrapper | undefined) => {
    this.props.onChange(layer?.getId());
    this.showData(layer);
  };

  private showData(layer: VectorLayerWrapper | undefined) {
    if (!layer) {
      this.setState({ data: [], layer, disableDownload: true });
      return;
    }

    new LayerDataSource(layer)
      .getRows()
      .then((data) => {
        this.setState({ data, layer, disableDownload: data.length < 1 });
      })
      .catch((err) => {
        this.setState({ data: [], layer, disableDownload: true });
        logger.error(err);
      });
  }

  private handleDownload = () => {
    const { toasts } = this.props.services;

    const rows = this.state.data;
    const layer = this.state.layer;
    if (!rows.length || !layer) {
      toasts.error('Vous devez sélectionner une couche qui contient des données');
      return;
    }

    const fileName = `${layer.getName()}.csv`;
    const toDownload: Partial<DataRow>[] = rows.map((r) => ({ ...r }));
    toDownload.forEach((r) => delete r._id);

    CsvParser.unparse(toDownload, fileName)
      .then((file) => FileIO.outputBlob(file, fileName))
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  };
}

export default withServices(DataViewerUi);
