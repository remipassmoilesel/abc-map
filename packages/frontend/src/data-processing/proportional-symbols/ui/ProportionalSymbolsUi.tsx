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
import { newParameters, Parameters } from '../Parameters';
import FoldingCard from '../../../components/folding-card/FoldingCard';
import { ServiceProps, withServices } from '../../../core/withServices';
import SymbolConfigForm, { SymbolConfigFormValues } from './components/SymbolConfigForm';
import DataSourceForm, { DataSourceFormValues } from '../../_common/data-source-form/DataSourceForm';
import GeometryLayerForm, { GeometryLayerFormValues } from '../../_common/geometry-layer-form/GeometryLayerForm';
import { ScaleAlgorithm } from '../../_common/algorithm/Algorithm';
import Sample from './sample.png';
import { ProportionalSymbolsTips } from '@abc-map/user-documentation';
import FormValidationLabel from '../../../components/form-validation-label/FormValidationLabel';
import { FormState } from '../../../components/form-validation-label/FormState';
import { isProcessingResult, ProcessingResult } from '../ProcessingResult';
import ProcessingReportModal from './components/report-modal/ProcessingReportModal';
import { prefixedTranslation } from '../../../i18n/i18n';
import Cls from './ProportionalSymbolsUi.module.scss';
import { withTranslation } from 'react-i18next';

const logger = Logger.get('ProportionalSymbolsUi.tsx');

interface Props extends ServiceProps {
  initialValue: Parameters;
  onChange: (params: Parameters) => void;
  onProcess: () => Promise<ProcessingResult>;
}

interface State {
  params: Parameters;
  formState?: FormState;
  result?: ProcessingResult;
}

const t = prefixedTranslation('DataProcessingModules:ProportionalSymbols.');

class ProportionalSymbolsUi extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { params: this.props.initialValue };
  }

  public render(): ReactNode {
    const params = this.state.params;
    const formState = this.state.formState;
    const result = this.state.result;

    const dataSourceValues: DataSourceFormValues = {
      source: params.data.source,
      valueField: params.data.valueField,
      joinBy: params.data.joinBy,
    };

    const geometryLayerValues: GeometryLayerFormValues = {
      layer: params.geometries.layer,
      joinBy: params.geometries.joinBy,
    };

    const configValues: SymbolConfigFormValues = {
      layerName: params.newLayerName,
      type: params.symbols.type,
      color: params.symbols.color,
      sizeMin: params.symbols.sizeMin,
      sizeMax: params.symbols.sizeMax,
      algorithm: params.symbols.algorithm || ScaleAlgorithm.Absolute,
    };

    return (
      <div className={Cls.panel}>
        {/* Module introduction */}
        <FoldingCard title={`1. ${t('Introduction')}`} className={'section'}>
          <div className={'explanation d-flex flex-row justify-content-between align-items-start'}>
            <div className={Cls.introduction}>
              <p>{t('Proportional_symbols_are_used_to_represent_absolute_data')}</p>
              <p>{t('How_does_it_work')}</p>
              <ul>
                <li dangerouslySetInnerHTML={{ __html: t('Select_data_source_and_data_field') }} />
                <li dangerouslySetInnerHTML={{ __html: t('Select_geometry_layer_explanation') }} />
                <li dangerouslySetInnerHTML={{ __html: t('Select_join_field_explanation') }} />
                <li dangerouslySetInnerHTML={{ __html: t('Select_parameters_explanation') }} />
              </ul>
            </div>
            <img src={Sample} alt={t('Map_sample')} title={t('Map_sample')} className={Cls.sample} />
          </div>
        </FoldingCard>

        {/* Data source selection */}
        <FoldingCard title={`2. ${t('Select_data_source')}`} className={'section'}>
          <div className={'explanation'}>{t('Data_source_contains_field_that_will_determine_symbol_size')}</div>
          <DataSourceForm
            valuesFieldLabel={t('Symbol_size_from')}
            valuesFieldTip={ProportionalSymbolsTips.SizeField}
            values={dataSourceValues}
            onChange={this.handleDataSourceChange}
          />
        </FoldingCard>

        {/* Vector layer selection */}
        <FoldingCard title={`3. ${t('Select_a_geometry_layer')}`} className={'section'}>
          <div className={'explanation'}>{t('The_geometry_layer_will_be_used_to_determine_the_position_of_the_symbols')}</div>
          <GeometryLayerForm values={geometryLayerValues} onChange={this.handleGeometryLayerChange} />
        </FoldingCard>

        {/* Data processing parameters */}
        <FoldingCard title={`4. ${t('Processing_parameters')}`} className={'section'}>
          <div className={'explanation'}>{t('Symbols_are_create_in_a_new_layer')}</div>
          <SymbolConfigForm values={configValues} onChange={this.handleConfigChange} />
        </FoldingCard>

        {formState && (
          <div className={'m-3 d-flex justify-content-end'}>
            <FormValidationLabel state={formState} />
          </div>
        )}

        <div className={'d-flex flex-row justify-content-end'}>
          <button className={'btn btn-secondary mr-3'} onClick={this.handleCancel}>
            {t('Reset')}
          </button>
          <button className={'btn btn-primary mr-3'} onClick={this.handleSubmit} data-cy={'process'}>
            {t('Start_processing')}
          </button>
        </div>

        {/* Result report */}
        {result && <ProcessingReportModal result={result} params={params} onClose={this.handleModalClosed} />}
      </div>
    );
  }

  private handleDataSourceChange = (values: DataSourceFormValues) => {
    const params: Parameters = {
      ...this.state.params,
      data: {
        source: values.source,
        valueField: values.valueField,
        joinBy: values.joinBy,
      },
    };

    this.setState({ params });
    this.props.onChange(params);
  };

  private handleGeometryLayerChange = (values: GeometryLayerFormValues) => {
    const params: Parameters = {
      ...this.state.params,
      geometries: {
        layer: values.layer,
        joinBy: values.joinBy,
      },
    };

    this.setState({ params });
    this.props.onChange(params);
  };

  private handleConfigChange = (values: SymbolConfigFormValues) => {
    const params: Parameters = {
      ...this.state.params,
      newLayerName: values.layerName,
      symbols: { ...values },
    };

    this.setState({ params });
    this.props.onChange(params);
  };

  private handleCancel = () => {
    const params: Parameters = newParameters();

    this.setState({ params });
    this.props.onChange(params);
  };

  private handleSubmit = () => {
    const { toasts, modals } = this.props.services;

    const formState = this.validateParameters();
    this.setState({ formState });
    if (formState !== FormState.Ok) {
      return;
    }

    modals
      .longOperationModal<ProcessingResult>(this.props.onProcess)
      .then((result) => {
        if (isProcessingResult(result)) {
          this.setState({ result });
        } else {
          return Promise.reject(new Error('Invalid result'));
        }
      })
      .catch((err) => {
        logger.error('Data processing failed', err);
        toasts.genericError();
      });
  };

  private handleModalClosed = () => {
    this.setState({ result: undefined });
  };

  private validateParameters(): FormState {
    const params = this.state.params;

    if (!params.newLayerName) {
      return FormState.MissingNewLayerName;
    }

    if (!params.data.source) {
      return FormState.MissingDataSource;
    }

    if (!params.data.valueField) {
      return FormState.MissingSymbolValueField;
    }

    if (!params.data.joinBy) {
      return FormState.MissingDataJoinBy;
    }

    if (!params.geometries.layer) {
      return FormState.MissingGeometryLayer;
    }

    if (!params.geometries.joinBy) {
      return FormState.MissingGeometryJoinBy;
    }

    if (!params.symbols.algorithm) {
      return FormState.MissingAlgorithm;
    }

    if (!params.symbols.type) {
      return FormState.MissingSymbolType;
    }

    if (!params.symbols.sizeMin) {
      return FormState.MissingSizeMin;
    }

    if (!params.symbols.sizeMax) {
      return FormState.MissingSizeMax;
    }

    if (params.symbols.sizeMin >= params.symbols.sizeMax) {
      return FormState.InvalidSizeMinMax;
    }

    return FormState.Ok;
  }
}

export default withTranslation()(withServices(ProportionalSymbolsUi));
