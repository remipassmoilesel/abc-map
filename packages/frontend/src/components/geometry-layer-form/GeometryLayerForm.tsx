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

import React, { ChangeEvent, Component } from 'react';
import { Logger } from '@abc-map/shared';
import { DataRow } from '../../core/data/data-source/DataSource';
import { SmallDataTable } from '../small-data-table/SmallDataTable';
import { ServiceProps, withServices } from '../../core/withServices';
import { VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';
import { LayerSelector } from '../layer-selector/LayerSelector';
import { LayerDataSource } from '../../core/data/data-source/LayerDataSource';
import DialogBoxAdvice from '../dialog-box-advice/DialogBoxAdvice';
import { DataProcessingTips } from '@abc-map/user-documentation';
import FormLine from '../form-line/FormLine';
import MessageLabel from '../message-label/MessageLabel';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { IconDefs } from '../icon/IconDefs';
import { getAllFieldNames } from '../../core/data/getFieldNames';

const logger = Logger.get('GeometryLayerForm.tsx');

export interface GeometryLayerFormValues {
  layer?: VectorLayerWrapper;
  joinBy?: string;
}

interface Props extends ServiceProps {
  values: GeometryLayerFormValues;
  onChange: (params: GeometryLayerFormValues) => void;
}

interface State {
  featureFields: string[];
  dataSamples: DataRow[];
  geometries: number;
}

const UnknownGeometries = -1;

const t = prefixedTranslation('GeometryLayerForm:');

class GeometryLayerForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      featureFields: [],
      dataSamples: [],
      geometries: UnknownGeometries,
    };
  }

  public render() {
    const layer = this.props.values.layer;
    const joinBy = this.props.values.joinBy;
    const geometries = this.state.geometries;
    const featureFields = this.state.featureFields;
    const dataSamples = this.state.dataSamples;

    return (
      <>
        <FormLine>
          <LayerSelector
            label={t('Layer')}
            value={layer}
            onSelected={this.handleGeometryLayerSelected}
            onlyVector={true}
            data-cy={'geometry-layer'}
            data-testid={'layer-selector'}
          />
        </FormLine>

        <FormLine>
          <label htmlFor="geometries-join-by" className={'flex-grow-1'}>
            {t('Join_with_data_by')}:
          </label>

          <DialogBoxAdvice id={DataProcessingTips.JoinBy} />
          <select
            value={joinBy}
            onChange={this.handleJoinByChanged}
            id={'geometries-join-by'}
            className={'form-select'}
            data-cy={'geometries-join-by'}
            data-testid={'geometries-join-by'}
          >
            {!featureFields.length && <option>{t('Select_layer')}</option>}
            {!!featureFields.length &&
              [<option key={0}>{t('Select_join_field')}</option>].concat(
                featureFields.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))
              )}
          </select>
        </FormLine>

        <div className={'my-3'}>
          {layer && geometries < 1 && <MessageLabel icon={IconDefs.faExclamationTriangle}>{t('No_geometry_found')}</MessageLabel>}
          {layer && geometries > 0 && <MessageLabel icon={IconDefs.faInfoCircle}>{t('X_geometries_will_be_processed', { geometries })}</MessageLabel>}
        </div>

        {!!dataSamples.length && (
          <>
            <div className={'mt-5 mb-3'}>{t('Data_samples')}</div>
            <SmallDataTable rows={dataSamples} />
          </>
        )}
      </>
    );
  }

  public componentDidMount() {
    const layer = this.props.values.layer;
    this.layerDataPreview(layer).catch((err) => logger.error('Data preview error: ', err));
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    const layer = this.props.values.layer;
    if (layer?.getId() !== prevProps.values.layer?.getId()) {
      this.layerDataPreview(layer).catch((err) => logger.error('Data preview error: ', err));
    }
  }

  private handleGeometryLayerSelected = (_: unknown, layer: VectorLayerWrapper | undefined) => {
    this.layerDataPreview(layer)
      .then(() => {
        const values: GeometryLayerFormValues = {
          ...this.props.values,
          layer,
          joinBy: '', // We reset field when layer change
        };

        this.props.onChange(values);
      })
      .catch((err) => logger.error('Preview error: ', err));
  };

  private handleJoinByChanged = (ev: ChangeEvent<HTMLSelectElement>) => {
    const values: GeometryLayerFormValues = {
      ...this.props.values,
      joinBy: ev.target.value,
    };

    this.props.onChange(values);
  };

  private layerDataPreview(layer: VectorLayerWrapper | undefined): Promise<void> {
    const { toasts } = this.props.services;

    if (!layer) {
      this.setState({ featureFields: [], dataSamples: [] });
      return Promise.resolve();
    }

    return new LayerDataSource(layer)
      .getRows()
      .then((rows) => {
        if (!rows.length) {
          this.setState({ featureFields: [], dataSamples: [], geometries: 0 });
          return;
        }

        const featureFields = getAllFieldNames(rows);
        const dataSamples = rows.slice(0, 3);
        const geometries = rows.length;
        this.setState({ featureFields, dataSamples, geometries });
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
        this.setState({ featureFields: [], dataSamples: [], geometries: UnknownGeometries });
      });
  }
}

export default withTranslation()(withServices(GeometryLayerForm));
