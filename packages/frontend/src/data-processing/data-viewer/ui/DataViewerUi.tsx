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

import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/shared';
import { DataRow } from '../../../core/data/data-source/DataSource';
import VectorLayerSelector from '../../_common/vector-layer-selector/VectorLayerSelector';
import { VectorLayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import DataTable from '../../../components/data-table/DataTable';
import { LayerDataSource } from '../../../core/data/data-source/LayerDataSource';
import { ServiceProps, withServices } from '../../../core/withServices';
import { CsvParser } from '../../../core/data/csv-parser/CsvParser';
import { FileIO } from '../../../core/utils/FileIO';
import Cls from './DataViewerUi.module.scss';
import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';
import { ModalStatus } from '../../../core/ui/typings';
import * as _ from 'lodash';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { SetFeatureProperties } from '../../../core/history/tasks/features/SetFeatureProperties';
import { RemoveFeaturesTask } from '../../../core/history/tasks/features/RemoveFeaturesTask';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';

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

const t = prefixedTranslation('DataProcessingModules:DataViewer.');

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
          <div className={'my-3'}>{t('Select_a_layer')}</div>
          <div className={'d-flex flex-row'}>
            <div className={Cls.vectorSelection}>
              <VectorLayerSelector value={layer?.getId()} onSelected={this.handleSelected} data-cy={'layer-selector'} />
            </div>
            <button className={'mx-3 btn btn-secondary'} disabled={disableDownload} onClick={this.handleDownload} data-cy={'download'}>
              {t('Download_CSV')}
            </button>
          </div>
        </div>
        {!!data.length && (
          <>
            <div className={'mt-3 mb-4'} dangerouslySetInnerHTML={{ __html: t('X_entries_displayed', { entries: data.length }) }} />
            <DataTable rows={data} withActions={true} onEdit={this.handleEdit} onDelete={this.handleDelete} className={Cls.dataTable} data-cy={'data-table'} />
          </>
        )}
        {layer && !data.length && <div className={'my-3'}>{t('No_data_to_display')}</div>}
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
      toasts.error(t('You_must_select_a_layer_with_data'));
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

  private handleEdit = (r: DataRow) => {
    const { toasts, modals, history } = this.props.services;

    const layer = this.state.layer;
    const feature = this.getFeature(r);
    if (!feature || !layer) {
      toasts.genericError();
      return;
    }

    const before = feature.getSimpleProperties();

    modals
      .featurePropertiesModal(before)
      .then((modalEvent) => {
        const after = modalEvent.properties;
        if (ModalStatus.Confirmed === modalEvent.status && !_.isEqual(before, after)) {
          feature.overwriteSimpleProperties(after);
          history.register(HistoryKey.Map, new SetFeatureProperties(feature, before, after));
          this.showData(layer);
        }
      })
      .catch((err) => logger.error('Error while editing feature properties: ', err));
  };

  private handleDelete = (r: DataRow) => {
    const { toasts, history } = this.props.services;

    const layer = this.state.layer;
    const feature = this.getFeature(r);
    if (!feature || !layer) {
      toasts.genericError();
      return;
    }

    const task = new RemoveFeaturesTask(layer.getSource(), [feature]);
    history.register(HistoryKey.Map, task);
    layer.getSource().removeFeature(feature.unwrap());
    this.showData(layer);
  };

  private getFeature(r: DataRow): FeatureWrapper | undefined {
    const layer = this.state.layer;
    if (!layer) {
      return;
    }

    const feature = layer
      .getSource()
      .getFeatures()
      .find((f) => f.getId() === r._id);
    if (!feature) {
      return;
    }

    return FeatureWrapper.from(feature);
  }
}

export default withTranslation()(withServices(DataViewerUi));
