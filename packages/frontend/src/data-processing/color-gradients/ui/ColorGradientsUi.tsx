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

import Cls from './ColorGradientsUi.module.scss';
import React, { Component } from 'react';
import { Logger } from '@abc-map/shared';
import { newParameters, Parameters } from '../Parameters';
import FoldingCard from '../../../components/folding-card/FoldingCard';
import { ServiceProps, withServices } from '../../../core/withServices';
import DataSourceForm, { DataSourceFormValues } from '../../_common/data-source-form/DataSourceForm';
import GradientsConfigForm, { ColorsConfigFormValues } from './components/GradientsConfigForm';
import GeometryLayerForm, { GeometryLayerFormValues } from '../../_common/geometry-layer-form/GeometryLayerForm';
import Sample from './sample.png';
import { ColorGradientTips } from '@abc-map/user-documentation';
import { FormState } from '../../../components/form-validation-label/FormState';
import FormValidationLabel from '../../../components/form-validation-label/FormValidationLabel';
import { isProcessingResult, ProcessingResult } from '../ProcessingResult';
import ProcessingReportModal from './components/report-modal/ProcessingReportModal';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';

const logger = Logger.get('ColorGradientsUI.tsx');

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

const t = prefixedTranslation('DataProcessingModules:ColorGradients.');

class ColorGradientsUI extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { params: this.props.initialValue };
  }

  public render() {
    const params = this.state.params;
    const formState = this.state.formState;
    const result = this.state.result;

    const configValues: ColorsConfigFormValues = {
      layerName: params.newLayerName,
      start: params.colors.start,
      end: params.colors.end,
      algorithm: params.colors.algorithm,
      classes: params.colors.classes,
    };

    const dataSourceValues: DataSourceFormValues = {
      source: params.data.source,
      valueField: params.data.valueField,
      joinBy: params.data.joinBy,
    };

    const geometryLayerValues: GeometryLayerFormValues = {
      layer: params.geometries.layer,
      joinBy: params.geometries.joinBy,
    };

    return (
      <div className={Cls.panel}>
        {/* Module introduction */}
        <FoldingCard title={`1. ${t('Introduction')}`} className={Cls.section}>
          <div className={Cls.introduction}>
            <div>
              <p>{t('Color_gradients_are_used_to_represent_relative_data')}</p>
              <p>{t('How_does_it_work')}</p>
              <ul>
                <li dangerouslySetInnerHTML={{ __html: t('Select_data_source_and_data_field') }} />
                <li dangerouslySetInnerHTML={{ __html: t('Select_geometry_layer_explanation') }} />
                <li dangerouslySetInnerHTML={{ __html: t('Select_join_field_explanation') }} />
                <li dangerouslySetInnerHTML={{ __html: t('Select_parameters_explanation') }} />
              </ul>
            </div>
            <img src={Sample} alt={t('Map_Sample')} title={t('Map_Sample')} />
          </div>
        </FoldingCard>

        {/* Data source selection */}
        <FoldingCard title={`2. ${t('Select_data_source')}`} className={Cls.section}>
          <div className={Cls.explanation}>{t('Data_source_contains_field_that_determine_colors')}</div>
          <DataSourceForm
            valuesFieldLabel={t('Colors_from')}
            valuesFieldTip={ColorGradientTips.ColorField}
            values={dataSourceValues}
            onChange={this.handleDataSourceChange}
          />
        </FoldingCard>

        {/* Vector layer selection */}
        <FoldingCard title={`3. ${t('Select_geometry_layer')}`} className={Cls.section}>
          <div className={Cls.explanation}>{t('Colors_applied_to_copy_of_geometries')}</div>
          <GeometryLayerForm values={geometryLayerValues} onChange={this.handleGeometryLayerChange} />
        </FoldingCard>

        {/* Data processing parameters */}
        <FoldingCard title={`4. ${t('Select_parameters')}`} className={Cls.section}>
          <div className={Cls.explanation}>{t('Colors_depends_on_algorithm')}</div>
          {!dataSourceValues.valueField && <div>{t('You_must_select_a_value_field')}</div>}
          {!dataSourceValues.source && <div>{t('You_must_select_a_datasource')}</div>}
          {dataSourceValues.valueField && dataSourceValues.source && (
            <GradientsConfigForm
              values={configValues}
              valueField={dataSourceValues.valueField}
              dataSource={dataSourceValues.source}
              onChange={this.handleConfigChange}
            />
          )}
        </FoldingCard>

        {/* Form validation */}
        {formState && (
          <div className={'m-3 d-flex justify-content-end'}>
            <FormValidationLabel state={formState} />
          </div>
        )}

        {/* Bottom controls */}
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

  private handleConfigChange = (values: ColorsConfigFormValues) => {
    const params: Parameters = {
      ...this.state.params,
      newLayerName: values.layerName,
      colors: {
        classes: values.classes,
        start: values.start,
        end: values.end,
        algorithm: values.algorithm,
      },
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
    const { toasts } = this.props.services;

    const formState = this.validateParameters();
    this.setState({ formState });
    if (formState !== FormState.Ok) {
      return;
    }

    const firstToast = toasts.info(t('Processing_in_progress'));
    this.props
      .onProcess()
      .then((result) => {
        if (isProcessingResult(result)) {
          this.setState({ result });
        }
      })
      .catch((err) => {
        logger.error('Data processing failed', err);
        toasts.genericError();
      })
      .finally(() => toasts.dismiss(firstToast));
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
      return FormState.MissingColorValueField;
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

    if (!params.colors.algorithm) {
      return FormState.MissingAlgorithm;
    }

    if (!params.colors.start) {
      return FormState.MissingStartColor;
    }

    if (!params.colors.end) {
      return FormState.MissingEndColor;
    }

    return FormState.Ok;
  }
}

export default withTranslation()(withServices(ColorGradientsUI));
