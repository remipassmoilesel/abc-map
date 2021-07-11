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
import FoldableCard from '../../../components/foldable-card/FoldableCard';
import { ServiceProps, withServices } from '../../../core/withServices';
import DataSourceForm, { DataSourceFormValues } from '../../_common/data-source-form/DataSourceForm';
import GradientsConfigForm, { ColorsConfigFormValues } from './GradientsConfigForm';
import GeometryLayerForm, { GeometryLayerFormValues } from '../../_common/geometry-layer-form/GeometryLayerForm';
import Sample from './sample.png';
import { ColorGradientTips } from '@abc-map/user-documentation';
import Cls from './ColorGradientsUi.module.scss';
import { FormState } from '../../../components/form-validation-label/FormState';
import FormValidationLabel from '../../../components/form-validation-label/FormValidationLabel';

const logger = Logger.get('ColorGradientsUI.tsx');

interface Props extends ServiceProps {
  initialValue: Parameters;
  onChange: (params: Parameters) => void;
  onProcess: () => Promise<void>;
}

interface State {
  params: Parameters;
  formState?: FormState;
}

class ColorGradientsUI extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { params: this.props.initialValue };
  }

  public render(): ReactNode {
    const params = this.state.params;
    const formState = this.state.formState;

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
        <FoldableCard title={'1. Introduction'} className={'section'}>
          <div className={'explanation d-flex flex-row justify-content-between align-items-start'}>
            <div className={Cls.introduction}>
              <p>
                Les dégradés de couleurs permettent de représenter des données statistiques relatives (densité de population, revenus par habitants, etc ...)
              </p>
              <p>Comment ça marche ?</p>
              <ul>
                <li>
                  Sélectionnez une source de données et un champ de valeur. C&apos;est ce champ qui sera utilisé pour déterminer les couleurs. Par exemple, un
                  &nbsp;classeur CSV contenant la population française par département et le champ <code>densite_pop</code> contenant les données de densité.
                </li>
                <li>Sélectionnez une couche de géométries. Les géométries seront dupliquées et remplies avec la couleur calculée.</li>
                <li>Sélectionner un champ de jointure entre les données et les géométries.</li>
                <li>Ensuite sélectionnez les caractéristiques des géométries à créer.</li>
              </ul>
            </div>
            <img src={Sample} alt={'Exemple de carte'} className={Cls.sample} />
          </div>
        </FoldableCard>

        {/* Data source selection */}
        <FoldableCard title={'2. Sélectionner une source de données'} className={'section'}>
          <div className={'explanation'}>
            La source de données contient le champ qui déterminera les couleurs des géométries. La source de données peut être une couche de la carte ou
            &nbsp;un classeur au format CSV.
          </div>
          <DataSourceForm
            valuesFieldLabel={'Couleurs à partir de:'}
            valuesFieldTip={ColorGradientTips.ColorField}
            values={dataSourceValues}
            onChange={this.handleDataSourceChange}
          />
        </FoldableCard>

        {/* Vector layer selection */}
        <FoldableCard title={'3. Sélectionner une couche de géométries'} className={'section'}>
          <div className={'explanation'}>Les couleurs seront appliquées à une copie des géométries de la couche sélectionnée.</div>
          <GeometryLayerForm values={geometryLayerValues} onChange={this.handleGeometryLayerChange} />
        </FoldableCard>

        {/* Data processing parameters */}
        <FoldableCard title={'4. Paramètres du traitement'} className={'section'}>
          <div className={'explanation'}>
            Les couleurs seront créés dans une nouvelle couche. Leurs valeurs seront déterminées par le champ source utilisé, et par le type d&apos;algorithme.
          </div>
          {!dataSourceValues.valueField && <div>Vous devez choisir un champ de valeur.</div>}
          {!dataSourceValues.source && <div>Vous devez choisir une source de données.</div>}
          {dataSourceValues.valueField && dataSourceValues.source && (
            <GradientsConfigForm
              values={configValues}
              valueField={dataSourceValues.valueField}
              dataSource={dataSourceValues.source}
              onChange={this.handleConfigChange}
            />
          )}
        </FoldableCard>

        {formState && (
          <div className={'m-3 d-flex justify-content-end'}>
            <FormValidationLabel state={formState} />
          </div>
        )}

        <div className={'d-flex flex-row justify-content-end'}>
          <button className={'btn btn-secondary mr-3'} onClick={this.handleCancel}>
            Réinitialiser
          </button>
          <button className={'btn btn-primary mr-3'} onClick={this.handleSubmit} data-cy={'process'}>
            Lancer le traitement
          </button>
        </div>
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
    const { toasts, modals } = this.props.services;

    const formState = this.validateParameters();
    this.setState({ formState });
    if (formState !== FormState.Ok) {
      return;
    }

    modals
      .longOperationModal(this.props.onProcess)
      .then(() => toasts.info('Traitement terminé !'))
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
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

export default withServices(ColorGradientsUI);
